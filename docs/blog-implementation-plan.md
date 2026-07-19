# Plan de Implementación — Sección Blog

> **Rol del documento:** guía de arquitectura para implementar la sección Blog de forma incremental.
> **Estado:** planificación — ninguna fase descrita aquí ha sido implementada todavía.
> **Fecha:** Julio 2026
> **Relacionado:** [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`i18n-architecture.md`](./i18n-architecture.md)

---

## Tabla de Contenidos

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Reglas de negocio y trazabilidad](#2-reglas-de-negocio-y-trazabilidad)
3. [Decisiones arquitectónicas clave](#3-decisiones-arquitectónicas-clave)
4. [Contrato de datos](#4-contrato-de-datos)
5. [Punto de colisión: `translation_group` vs. slug compartido](#5-punto-de-colisión-translation_group-vs-slug-compartido)
6. [Variables de entorno](#6-variables-de-entorno)
7. [Fuera de alcance](#7-fuera-de-alcance)
8. [Plan de fases incrementales](#8-plan-de-fases-incrementales)
9. [Matriz de riesgos](#9-matriz-de-riesgos)
10. [Supuestos y decisiones abiertas](#10-supuestos-y-decisiones-abiertas)

---

## 1. Resumen ejecutivo

La sección Blog añade contenido dinámico (tabla `posts` en Supabase) a un sitio que hoy es **100% estático** (SSG, sin adaptador SSR, cero JS de runtime para contenido). El reto arquitectónico no es "cómo conectar Supabase" — es **cómo hacerlo sin convertir el sitio en dinámico**, sin crear una API intermedia, y sin romper los dos sistemas que ya existen y funcionan: el motor de i18n (`i18n/{locale}/*.ts` + `loader.ts`) y el layer de datos (`data/{tipo}/{locale}.ts` + `loader.ts`).

**Principio rector:** Supabase sustituye únicamente la *fuente* de los datos de contenido (antes: archivos `.ts` locales; ahora: tabla remota). No cambia el *contrato* que consumen los componentes ni el modelo de renderizado (SSG). La consulta a Supabase ocurre en build time, dentro del proceso de `astro build`, exactamente en el mismo lugar donde hoy se leen `experiencias/es.ts` o `proyectos/es.ts` — solo que ahora es una llamada `await` a la API JS de Supabase en lugar de un `import` estático.

Consecuencia directa de este principio: **el contenido del blog solo se actualiza en el siguiente rebuild.** No hay revalidación, no hay SSR, no hay ISR. Esto es intencional (mantiene la arquitectura y el SEO actuales), se declara sin ambigüedad en la [decisión 3.1](#31-estrategia-de-renderizado-ssg-puro-sin-excepciones), y tiene una implicación operativa fuera del código de este repo (ver [Fase 11](#fase-11-deploy-hook-desde-el-cms-infraestructura-fuera-del-repo)).

---

## 2. Reglas de negocio y trazabilidad

| Regla de negocio | Mecanismo que la garantiza | Fase |
|---|---|---|
| Astro solo consume `status = 'published'` | Filtro `.eq('status', 'published')` centralizado en **un único** punto: `src/data/posts/loader.ts`. Ningún componente ni página filtra por status — todos reciben datos ya filtrados. | Fase 1 |
| El CMS es un proyecto Next.js independiente | No se crea ningún código de administración/mutación en este repo. Astro es estrictamente de lectura. | N/A (restricción de diseño) |
| Astro nunca administra contenido | No hay formularios, no hay mutaciones, no hay `insert`/`update`/`delete` en el cliente Supabase de Astro. Cliente configurado como solo-lectura (anon key + RLS recomendada). | Fase 0 |
| Cada idioma es un registro independiente vía `translation_group` | Nuevo dato de dominio: `Post.translationGroup`. Se usa para resolver el enlace equivalente en el otro idioma (selector de idioma, hreflang). Ver [sección 5](#5-punto-de-colisión-translation_group-vs-slug-compartido). | Fase 1, 7, 8 |
| Consulta directa a Supabase, sin API REST intermedia | `@supabase/supabase-js` se invoca directamente desde el frontmatter de Astro (`getStaticPaths`, código de página) en build time. No se crea ningún endpoint propio que actúe como proxy de datos. | Fase 0, 1, 2 |
| Respetar el sistema i18n existente | El blog usa el mismo patrón: `getBlog(locale)` en `i18n/loader.ts`, `getPosts(locale)` en `data/posts/loader.ts`. Rutas bajo `src/pages/[locale]/blog/`. Cero condicionales `if (locale === "es")`. | Fase 3, 4, 5 |
| No afectar el SEO | `canonical`, `hreflang` y `sitemap.xml` se extienden (no se reemplazan) para incluir el blog, resolviendo explícitamente el caso "sin traducción disponible" en vez de enlazar a un 404. | Fase 7, 8, 9 |
| Mantener la arquitectura actual | Cero adaptador SSR, cero JS de cliente para el blog, mismo patrón de capas (data → i18n → components → pages). | Todas |

---

## 3. Decisiones arquitectónicas clave

### 3.1 Estrategia de renderizado: SSG puro, sin excepciones

Decisión explícita para eliminar cualquier ambigüedad durante la implementación:

- El proyecto continúa siendo **100% Server-Side Generation (SSG)**. No se instala ningún adaptador SSR (`@astrojs/vercel`, `@astrojs/node`, etc.) ni se cambia el `output` de `astro.config.mjs`.
- **Todas** las páginas del blog (índice y detalle, en `es` y `en`) se generan durante `astro build` vía `getStaticPaths()` — el mismo mecanismo que ya usa `proyectos/[slug].astro`. No existe ninguna ruta del blog que se resuelva en request time.
- **No se usa ISR** (revalidación incremental) ni ningún esquema de *stale-while-revalidate*. El contenido queda fijo en el HTML generado hasta el siguiente build (ver 3.7).
- **No se usan Server Islands** (`server:defer`) para el contenido del blog. Astro 6 las soporta, pero introducirían renderizado en request time, lo cual contradice dos reglas de negocio explícitas: "la arquitectura actual debe mantenerse" y "la integración no debe afectar el SEO" (un crawler que no ejecute ese renderizado no vería el contenido en el HTML inicial).
- Consecuencia directa: **toda** consulta a Supabase relacionada con el blog ocurre en build time, nunca en request time, sin excepción en ninguna fase de este plan. Cualquier futura necesidad de contenido "en vivo" (p. ej. un contador de vistas) queda fuera de alcance por definición — no es compatible con esta decisión y requeriría reabrir esta discusión, no improvisarse dentro de una fase.

### 3.2 Dónde vive la consulta a Supabase

La consulta ocurre **exclusivamente en build time**, dentro de:
- `getStaticPaths()` de `src/pages/[locale]/blog/index.astro` y `[slug].astro` (para enumerar rutas)
- el frontmatter de esas mismas páginas (para obtener los datos a renderizar)

Astro ejecuta este código en Node durante `astro build`, nunca en el navegador. Esto es idéntico al mecanismo que ya usan `getExperiencias(locale)` o `getProyectos(locale)` — la única diferencia es que la función es `async` porque ahora hay I/O de red.

### 3.3 Cliente Supabase: solo lectura, solo build time

- Nuevo archivo `src/lib/supabase.ts`: instancia única del cliente (`createClient`), análogo a `middleware.ts` en el sentido de ser infraestructura transversal, no un componente de dominio.
- Usa la **anon key**, nunca una service role key (el proyecto Astro no necesita bypass de RLS; el CMS Next.js es quien administra con privilegios elevados).
- Recomendación de defensa en profundidad: una policy de RLS en la tabla `posts` que permita `select` público únicamente cuando `status = 'published'`. Así, aunque el filtro de la app tuviera un bug, la base de datos no expondría borradores. Esto es una decisión de infraestructura de Supabase, no de este repo — se documenta como requisito, no se implementa aquí.
- Las variables `SUPABASE_URL` / `SUPABASE_ANON_KEY` **no** deben tener el prefijo `PUBLIC_` (convención de Astro para inyectar variables en el bundle del cliente). Como el blog no tiene islas interactivas, estas variables solo deben existir en el entorno de build, nunca en un `<script>` de cliente.

### 3.4 Capa de datos: mismo contrato, fuente distinta

Los loaders existentes (`data/experiencias/loader.ts`, `data/proyectos/loader.ts`) leen de mapas estáticos `Record<Locale, T[]>` poblados por `import`. Para posts esto no es posible porque el contenido no vive en el repo. Se documenta explícitamente como una **variante intencional** del patrón, no como una desviación no controlada:

| Aspecto | Patrón actual (`proyectos`, `experiencias`) | Patrón nuevo (`posts`) |
|---|---|---|
| Fuente | Archivos `es.ts` / `en.ts` en el repo | Tabla `posts` en Supabase |
| Carga | `import` estático, síncrono | `await` a Supabase, asíncrono |
| Forma del loader | `getProyectos(locale): Proyecto[]` | `getPosts(locale): Promise<Post[]>` |
| Contrato externo | Función pura por locale | Función pura por locale (misma forma, distinta implementación) |
| Consumidores | Componentes `.astro` | Componentes `.astro` (sin cambios de patrón) |

La única diferencia visible para quien consuma el loader es el `await`. El resto de la arquitectura (componentes, i18n, rutas) no distingue entre datos "locales" y datos "remotos".

### 3.5 Renderizado del campo `content`: formato deliberadamente abierto

El campo `content` es `text` en el esquema, pero eso solo fija su tipo de almacenamiento — no su formato. El CMS en Next.js **todavía no está construido**, y cuando se construya podría emitir Markdown, HTML, o el documento serializado de un editor rich-text (TipTap, EditorJS, etc.). Las tres opciones son perfectamente compatibles con una columna `text`; lo único que cambia es cómo se interpreta esa cadena al momento de renderizar.

**Decisión arquitectónica:** esta arquitectura no debe depender del formato final de `content`. Se aísla la conversión "`content` (string) → HTML seguro para insertar en la página" detrás de un único módulo, consumido exclusivamente por la página de detalle (`blog/[slug].astro`, ver Fase 5). Todo lo demás — el loader, los tipos, las rutas, el i18n, el SEO, el sitemap — trata `content` como una cadena opaca y nunca necesita saber si es Markdown, HTML o JSON de un editor.

Esto mantiene el acoplamiento bajo: cuando el CMS quede definido, el único trabajo pendiente es (a) elegir el parser adecuado al formato elegido dentro de ese módulo, y (b) sanitizar el HTML resultante en todos los casos (p. ej. `sanitize-html`) como defensa en profundidad, ya que el contenido cruza un límite de confianza (proviene de un sistema externo). Ningún otro archivo del plan cambia por esta decisión, sea cual sea el formato que finalmente se elija.

Esto no rompe "cero JS de runtime": la conversión ocurre en build time, sea cual sea el formato.

### 3.6 SEO: canonical, hreflang y sitemap

Ver [sección 5](#5-punto-de-colisión-translation_group-vs-slug-compartido) — es el punto más delicado del plan porque `Layout.astro` y `LanguageSwitcher.astro` **ya existen** y asumen que el slug es idéntico en ambos idiomas. El blog rompe ese supuesto.

### 3.7 Frescura de contenido y rebuilds

Como el sitio es SSG puro (decisión 3.1), publicar/editar un post en el CMS no tiene efecto hasta el siguiente build. Esto se documenta como comportamiento esperado (no es un bug) y requiere que el CMS Next.js dispare un rebuild del portafolio (deploy hook) al publicar — ver [Fase 11](#fase-11-deploy-hook-desde-el-cms-infraestructura-fuera-del-repo).

---

## 4. Contrato de datos

### 4.1 Mapeo tabla → tipo de dominio

`src/types/post.ts` mapea las columnas `snake_case` de la tabla a un tipo `camelCase`, siguiendo la convención de `Proyecto`/`Experiencia`:

```typescript
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seoDescription: string | null;
  coverImage: string | null;
  locale: Locale;
  readingTime: number | null;
  publishedAt: string | null; // ISO string
  translationGroup: string;
}
```

Nota: `status`, `created_at`, `updated_at` **no** se exponen en el tipo de dominio — son metadatos administrativos del CMS sin uso en el portafolio. El loader los consulta (para filtrar/ordenar) pero no los propaga fuera de `data/posts/loader.ts`.

### 4.2 Forma del loader (`src/data/posts/loader.ts`)

Mismo nombre de funciones que el patrón `proyectos`, en versión async:

```typescript
export async function getPosts(locale: Locale): Promise<Post[]>
export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | null>
export async function getTranslatedSlug(translationGroup: string, targetLocale: Locale): Promise<string | null>
```

- `getPosts` y `getPostBySlug` filtran siempre por `locale` **y** `status = 'published'`.
- `getTranslatedSlug` es la pieza nueva sin equivalente en `proyectos`: dado el `translation_group` de un post, devuelve el `slug` del post publicado en el idioma destino, o `null` si no existe traducción publicada.

### 4.3 i18n de UI (`BlogTranslations`)

Sigue el patrón exacto de `ProjectsTranslations` en `i18n/types.ts` — textos de interfaz (heading, estado vacío, CTA "leer más", etiqueta de fecha, etiqueta de tiempo de lectura, botón "volver al blog"). El **contenido** de los posts (título, excerpt, body) nunca vive en `i18n/` — ya viene traducido desde Supabase, igual que `proyectos/{locale}.ts` no duplica textos de UI.

---

## 5. Punto de colisión: `translation_group` vs. slug compartido

Este es el hallazgo más importante del análisis y el que más riesgo tiene si se ignora.

**Estado actual verificado en el código:**
- `LanguageSwitcher.astro` construye el link al otro idioma haciendo un *path-swap* naive: toma la URL actual, cambia `/es/` por `/en/` (o viceversa) y mantiene el resto del path intacto.
- `Layout.astro` genera las etiquetas `hreflang` con la misma lógica: mismo path, distinto prefijo de locale.
- Esto funciona hoy porque `Proyecto.slug` es **el mismo valor** en `proyectos/es.ts` y `proyectos/en.ts` para el "mismo" proyecto (confirmado en `public/sitemap.xml`: `/es/proyectos/erp-centros-opticos/` y `/en/proyectos/erp-centros-opticos/` comparten slug).

**Por qué el blog rompe este supuesto:**
- Cada post es un registro independiente en Supabase con su propio `slug` (columna `unique`, no compuesta con `locale`). Nada garantiza que el post en inglés de un `translation_group` tenga el mismo slug que su par en español — de hecho, si el slug se genera desde el título, casi nunca coincidirá (`"como-optimizar-una-api"` vs `"how-to-optimize-an-api"`).
- Si no se corrige, el selector de idioma en una página de post generaría un link roto (404), y el `hreflang` de `Layout.astro` apuntaría a una URL inexistente — exactamente la clase de problema de SEO que la regla de negocio prohíbe.

**Diseño de la solución (Fase 7):**
- `Layout.astro` y `LanguageSwitcher.astro` reciben una prop **opcional** `alternateUrls?: Partial<Record<Locale, string>>`.
- Si la prop no se pasa (caso de Home, Proyectos, y cualquier página existente), el comportamiento es **idéntico al actual** (path-swap) — cero regresión.
- Las páginas de blog (`[slug].astro`) calculan `alternateUrls` con `getTranslatedSlug()` y la pasan explícitamente. Si no existe traducción publicada, el idioma correspondiente se omite del objeto → `LanguageSwitcher` cae a un fallback (enlazar al índice `/{locale}/blog/` en vez de a un slug que no existe) y `Layout` omite esa etiqueta `hreflang` en vez de generar una URL rota.

Este diseño es deliberadamente **aditivo**: ningún archivo existente cambia su comportamiento por defecto.

---

## 6. Variables de entorno

| Variable | Uso | Prefijo `PUBLIC_` | Dónde se configura |
|---|---|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase | No | `.env` local + entorno de build en Vercel |
| `SUPABASE_ANON_KEY` | Clave anónima, solo lectura (idealmente restringida por RLS a `status = 'published'`) | No | `.env` local + entorno de build en Vercel |

Ambas se consumen únicamente vía `import.meta.env` dentro de `src/lib/supabase.ts`, en código que corre en build time. Nunca deben pasarse a un componente React hidratado ni a un `<script>` de cliente. Se añade `.env.example` con las claves (sin valores) para documentar el requisito sin exponer secretos.

---

## 7. Fuera de alcance

Explícitamente **no** se implementa en este plan (para minimizar riesgo; podría evaluarse como iniciativa futura independiente):

- Paginación o infinite scroll en el listado
- Búsqueda o filtrado por categoría/tag (la tabla no tiene esas columnas)
- Feed RSS/Atom
- Comentarios o cualquier interacción del visitante
- Revalidación incremental (ISR) o cualquier forma de SSR — contradice "la arquitectura actual debe mantenerse"
- Cualquier UI de administración de contenido (vive en el CMS Next.js)

---

## 8. Plan de fases incrementales

Cada fase es desplegable de forma aislada, no rompe fases anteriores, y tiene un criterio de verificación explícito antes de avanzar a la siguiente.

### Fase 0 — Infraestructura de acceso a datos

**Objetivo:** poder conectarse a Supabase desde build time, sin ninguna UI ni ruta nueva.

- Agregar dependencia `@supabase/supabase-js`.
- Crear `src/lib/supabase.ts` — cliente único, solo lectura, usando `SUPABASE_URL` / `SUPABASE_ANON_KEY`.
- Crear `.env.example` documentando ambas variables.
- No se toca ningún archivo de `components/`, `pages/`, `i18n/` o `data/` existente.

**Verificación:**
- `npm run build` sigue funcionando igual que antes (cero cambios visuales/funcionales).
- Una comprobación manual puntual (script desechable o log temporal) confirma que el cliente puede conectarse y contar filas de `posts`.
- `grep` sobre `dist/` confirma que no aparece ninguna cadena `SUPABASE_ANON_KEY` ni URL de Supabase en el HTML/JS generado (garantiza que no se filtró al cliente).

---

### Fase 1 — Tipos y capa de datos de posts

**Objetivo:** tener `getPosts` / `getPostBySlug` / `getTranslatedSlug` funcionando y probados, sin ninguna página que los use todavía.

- Crear `src/types/post.ts` con la interfaz `Post` (sección 4.1).
- Crear `src/data/posts/loader.ts` con las tres funciones (sección 4.2), con el filtro `status = 'published'` como **único punto** de esa regla en todo el código.
- Orden por defecto: `published_at desc`, con fallback a `created_at desc` si `published_at` es `null`.

**Verificación:**
- Comprobación manual (página temporal o script) confirma que `getPosts("es")` solo devuelve posts publicados en español, y que un post en `draft` no aparece aunque exista en la tabla.
- `getTranslatedSlug` devuelve `null` correctamente cuando no hay contraparte publicada en el otro idioma (probarlo con un post sin traducción).
- Type-check (`astro check` o `tsc`) pasa sin errores.

---

### Fase 2 — Validación end-to-end de la arquitectura (spike)

**Objetivo:** demostrar que la cadena completa Supabase → build time → HTML estático funciona, **antes** de invertir en i18n de UI, componentes visuales, Navbar o SEO. Es una comprobación de riesgo arquitectónico, no una entrega visual — el objetivo es fallar rápido y barato si algo en el diseño no funciona como se espera.

- Crear la versión mínima de `src/pages/[locale]/blog/index.astro`: `getStaticPaths` para `es`/`en`, llama a `getPosts(locale)` (Fase 1) y renderiza una lista sin estilos (`<ul><li>{post.title}</li></ul>`) — sin `BlogCard`, sin textos de `i18n/blog.ts` (todavía no existen, se añaden en la Fase 3).
- Este archivo **no es descartable**: en la Fase 4 se completa con estilos, i18n y el componente `BlogCard`. El spike evita trabajo duplicado en vez de crear una página de prueba desechable.
- No se toca `Navbar.astro` ni ninguna página existente — la ruta solo es alcanzable por URL directa.

**Verificación (criterio de salida obligatorio antes de continuar con cualquier fase posterior):**
- `npm run build` genera `dist/es/blog/index.html` y `dist/en/blog/index.html`.
- Inspección directa del archivo HTML generado (no del DOM en el navegador) confirma que los títulos de los posts publicados están presentes como texto estático — evidencia de que la consulta a Supabase se resolvió en build time, no en el cliente.
- Cambiar el `status` de un post a `draft` en Supabase y volver a compilar confirma que desaparece del HTML generado (el filtro de la Fase 1 funciona end-to-end, no solo en aislamiento).
- Inspección del HTML confirma que no se añadió ningún `<script>` nuevo más allá de los que ya existen globalmente en `Layout`/`LanguageSwitcher`.
- Si cualquiera de estos puntos falla, se resuelve **aquí**, antes de construir `BlogCard`, i18n del blog, el link de Navbar, el selector de idioma o el SEO — todas esas fases siguientes asumen que esta cadena ya está probada.

---

### Fase 3 — Traducciones i18n del Blog (UI)

**Objetivo:** textos de interfaz del blog disponibles vía el sistema i18n existente, sin renderizarse todavía en ninguna página.

- Extender `src/i18n/types.ts` con `BlogTranslations` (heading, descripción de sección, estado vacío, CTA "leer más", etiqueta de fecha de publicación, etiqueta de tiempo de lectura, CTA "volver al blog").
- Crear `src/i18n/es/blog.ts` y `src/i18n/en/blog.ts`.
- Añadir `getBlog(locale)` a `src/i18n/loader.ts`.

**Verificación:**
- `npm run build` sigue sin cambios visuales (los archivos nuevos no se importan desde ningún componente todavía).
- Revisión de que ambas traducciones satisfacen la misma interfaz `BlogTranslations` (el compilador falla si falta un campo — mismo mecanismo que el resto del sistema).

---

### Fase 4 — Listado de Blog

**Objetivo:** completar la página validada en la Fase 2 con el componente visual definitivo y los textos de i18n de la Fase 3 — sigue aislada del resto del sitio (sin enlace desde el Navbar todavía).

- Crear `src/components/blog/BlogCard.astro` reutilizando el lenguaje visual existente (`card-gold`, tipografía, espaciados de `ProjectCard.astro`).
- Reemplazar el `<ul>` mínimo de la Fase 2 en `src/pages/[locale]/blog/index.astro`: seguir usando `getStaticPaths` + `getPosts(locale)`, pero renderizando el grid de `BlogCard` y usando `getBlog(locale)` para los textos.
- Manejo explícito de estado vacío (0 posts publicados no debe romper el build ni verse como un error).

**Verificación:**
- `npm run build` genera `/es/blog/` y `/en/blog/` como HTML estático.
- Cambiar el `status` de un post en Supabase a `draft` y rebuildear confirma que desaparece del listado.
- Página visualmente consistente con el resto del sitio (revisión manual en `npm run preview`).

---

### Fase 5 — Detalle de artículo

**Objetivo:** página de artículo individual, con contenido renderizado.

- Crear `src/pages/[locale]/blog/[slug].astro`: `getStaticPaths` async que enumera todos los posts publicados por locale.
- Crear el módulo de conversión de `content` a HTML (p. ej. `src/lib/renderPostContent.ts`), cuyo comportamiento interno depende del formato que el CMS entregue en ese momento — ver [decisión 3.5](#35-renderizado-del-campo-content-formato-deliberadamente-abierto) y [sección 10, punto 1](#10-supuestos-y-decisiones-abiertas). Esta página es el **único** punto del código que depende del formato final de `content`; si el formato cambia más adelante, solo este módulo se toca.
- Usa `getPostBySlug`, `getBlog(locale)`.
- Los slugs no generados (drafts, archivados, inexistentes) devuelven 404 automáticamente al no estar en `getStaticPaths` — no requiere lógica adicional.

**Verificación:**
- Visitar cada URL generada en `npm run preview` y confirmar renderizado correcto (título, fecha, tiempo de lectura, contenido).
- Confirmar manualmente que la URL de un post en `draft`/`archived` devuelve 404.
- Confirmar que no se añadió ningún `<script>` de cliente nuevo (inspección del HTML generado).

---

### Fase 6 — Enlace en Navbar

**Objetivo:** hacer el blog descubrible desde la navegación principal.

- Añadir campo `blog` a `NavbarTranslations` y a `es/navbar.ts` / `en/navbar.ts`.
- Añadir el link en `Navbar.astro` (versión desktop y mobile), apuntando a `/{locale}/blog/`.

**Verificación:**
- Revisión visual en ambos breakpoints y ambos locales.
- Confirmar que el resto de los items de navegación no cambia de posición/comportamiento (regresión visual mínima).

---

### Fase 7 — Selector de idioma consciente de `translation_group`

**Objetivo:** resolver la colisión descrita en la [sección 5](#5-punto-de-colisión-translation_group-vs-slug-compartido) sin romper páginas existentes.

- Extender `Layout.astro` y `LanguageSwitcher.astro` con la prop opcional `alternateUrls` (comportamiento por defecto sin cambios si no se pasa).
- En `blog/[slug].astro`, calcular `alternateUrls` con `getTranslatedSlug()` y pasarlo a `Layout`/`Navbar`/`LanguageSwitcher`.
- Definir el fallback: si no hay traducción publicada, el switcher enlaza a `/{locale}/blog/` (índice) en vez de a un slug inexistente.

**Verificación:**
- Un post con traducción: cambiar de idioma aterriza en el slug correcto del otro idioma.
- Un post sin traducción: cambiar de idioma aterriza en el índice del blog en ese idioma, sin 404.
- Regresión: `/es/proyectos/{slug}/` y `/en/proyectos/{slug}/` siguen intercambiándose exactamente igual que antes (path-swap sin cambios).

---

### Fase 8 — SEO por artículo

**Objetivo:** metadata correcta y consistente con el resto del sitio.

- `title`/`description` del `Layout` alimentados por `seoDescription` (fallback a `excerpt` si es `null`).
- `og:image` alimentado por `coverImage` (fallback a la imagen OG por defecto del sitio si es `null`).
- `hreflang`/`canonical` usando `alternateUrls` de la Fase 7 (con y sin traducción disponible).

**Verificación:**
- Ver el código fuente de una página de post con y sin traducción, confirmando que las etiquetas `hreflang`/`canonical`/`og:*` son correctas en cada caso.
- Ningún `hreflang` apunta a una URL que devuelva 404.

---

### Fase 9 — Sitemap dinámico

**Objetivo:** que `sitemap.xml` incluya el blog sin mantenimiento manual, sin introducir una API REST.

- Sustituir `public/sitemap.xml` (archivo estático) por `src/pages/sitemap.xml.ts`, un endpoint que Astro resuelve en build time (sigue siendo 100% estático en el `dist/` final — no es un endpoint en runtime).
- El endpoint combina las rutas estáticas existentes (home, proyectos) con los posts publicados obtenidos de `getPosts()` para ambos locales, generando los `<xhtml:link rel="alternate">` a partir de `translation_group` (omitiendo el alternate si no hay contraparte, igual que en Fase 7/8).
- Eliminar `public/sitemap.xml` en el mismo cambio, para no dejar dos fuentes de verdad.

**Verificación:**
- `npm run build` produce `dist/sitemap.xml` con todas las URLs estáticas previas intactas **más** las URLs de posts publicados.
- Un post en `draft` no aparece en el sitemap generado.
- Validar el XML resultante contra el esquema de sitemaps (bien formado, sin URLs duplicadas).

---

### Fase 10 — Resiliencia ante fallos de build

**Objetivo:** que un problema de conectividad con Supabase falle el build de forma clara, en vez de publicar un sitio roto o silenciosamente vacío.

- Política explícita: si la consulta a Supabase falla (red, auth, esquema inesperado), el error se propaga y `astro build` falla — no hay fallback silencioso a "cero posts". Como el hosting (Vercel) no promueve un build fallido, el sitio previamente desplegado permanece intacto.
- Una tabla vacía (0 filas publicadas) es un caso **válido**, distinto de un error — debe mostrar el estado vacío de la Fase 4, no fallar el build.

**Verificación:**
- Simular credenciales inválidas → `npm run build` falla con un mensaje de error legible.
- Simular tabla sin filas `published` → `npm run build` tiene éxito y el listado muestra el estado vacío.

---

### Fase 11 — Deploy hook desde el CMS (infraestructura, fuera del repo)

**Objetivo:** que publicar/editar/despublicar un post en el CMS Next.js se refleje en el portafolio sin intervención manual.

- No es una fase de código en este repositorio. Se documenta como requisito operativo: el CMS debe invocar un Deploy Hook (Vercel u equivalente del proveedor de hosting elegido) al cambiar el `status` de un post o al editar uno ya publicado.
- Este plan no implementa el lado del CMS — solo señala la dependencia para que no se pase por alto al planificar el proyecto Next.js.

**Verificación:**
- Disparo manual del deploy hook (p. ej. `curl` al webhook de Vercel) produce un nuevo deployment que refleja el cambio de contenido esperado.

---

## 9. Matriz de riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Un problema de arquitectura (pipeline Supabase → build → HTML) se descubre recién al tener toda la UI construida | Retrabajo costoso sobre componentes ya terminados | Fase 2: spike de validación end-to-end antes de construir `BlogCard`, i18n, Navbar o SEO |
| Slug del post no coincide entre idiomas (ver sección 5) | SEO roto, links 404 en el selector de idioma | Fase 7: `alternateUrls` vía `translation_group`, con fallback explícito |
| El formato final de `content` se decide más adelante (cuando exista el CMS) y podría requerir un parser distinto al previsto (Markdown, HTML, TipTap/EditorJS) | Retrabajo si se hubiera asumido el formato equivocado de antemano | Formato deliberadamente sin decidir (secciones 3.5 y 10); la conversión está aislada en un único módulo consumido solo por la Fase 5 — cambiar el formato no afecta al resto del sistema |
| Filtro de `status` olvidado en un nuevo punto de consumo futuro | Se publica un draft sin querer | Filtro centralizado en un único loader (Fase 1) — ningún otro archivo debe repetir la condición |
| Build falla por Supabase caído justo en un deploy | Sitio no se actualiza (pero no se rompe) | Comportamiento aceptado (Fase 10): el deployment anterior sigue activo |
| Contenido desactualizado porque el CMS no dispara rebuild | Blog "atrasado" respecto al CMS | Fase 11: deploy hook obligatorio, documentado como dependencia externa |
| `translation_group` no asignado correctamente por el CMS (cada fila con su propio UUID por el `default`) | Posts que deberían enlazarse aparecen como no traducidos | Fuera del control de este repo; Astro solo lee el campo y confía en él — documentar como responsabilidad del CMS |
| Cambios en `Layout.astro`/`LanguageSwitcher.astro` rompen páginas existentes | Regresión en Home/Proyectos | Props nuevas siempre opcionales con comportamiento por defecto idéntico (Fase 7) |

---

## 10. Supuestos y decisiones abiertas

Estas decisiones no bloquean el inicio del plan, pero deben confirmarse antes de la fase indicada:

1. **Formato del campo `content`:** deliberadamente sin decidir. El CMS Next.js todavía no existe; cuando se construya podría emitir Markdown, HTML, o el documento serializado de un editor rich-text (TipTap, EditorJS, etc.). La arquitectura de este plan no depende de esa elección — la conversión queda aislada en un único módulo, consumido solo por la Fase 5 (ver [decisión 3.5](#35-renderizado-del-campo-content-formato-deliberadamente-abierto)). Confirmar el formato real es un prerrequisito de esa fase únicamente, no del resto del plan.
2. **Política RLS en Supabase** (antes de Fase 0, recomendado): confirmar si ya existe una policy que restrinja `select` a `status = 'published'` para la anon key, o si el filtro de la aplicación es la única barrera. Se recomienda tener ambas capas.
3. **Asignación de `translation_group`** (antes de Fase 1): confirmar con el equipo del CMS que, al crear la traducción de un post, se reutiliza el mismo `translation_group` de la fila origen (el `default gen_random_uuid()` del esquema solo aplica si no se especifica explícitamente al insertar).
4. **Proveedor de hosting y mecanismo de deploy hook** (antes de Fase 11): confirmar si se mantiene Vercel (como sugiere `astro.config.mjs` y el dominio actual) para usar su Deploy Hook nativo.
5. **Manejo de imágenes (`cover_image`)**: se asume que la columna almacena una URL absoluta ya optimizada/alojada externamente (p. ej. Supabase Storage o un CDN gestionado por el CMS). Este plan no incluye pipeline de optimización de imágenes para el blog — si se requiere, es una fase adicional a evaluar por separado.
