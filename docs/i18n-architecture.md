# Arquitectura i18n — Portafolio Astro

> Diseño técnico para soporte multilingüe (Español / Inglés) con escalabilidad a N idiomas.
>
> **Fecha:** Junio 2026
> **Stack:** Astro 6 + TypeScript + Tailwind CSS 4
> **Formato de traducciones:** Módulos TypeScript (sin JSON)

---

## Tabla de Contenidos

1. [Diagnóstico del proyecto](#1-diagnóstico-del-proyecto)
2. [Arquitectura recomendada](#2-arquitectura-recomendada)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Por qué TypeScript exclusivamente](#4-por-qué-typescript-exclusivamente)
5. [Organización de traducciones para escalar](#5-organización-de-traducciones-para-escalar)
6. [Desacoplamiento del texto de los componentes](#6-desacoplamiento-del-texto-de-los-componentes)
7. [Sistema de selección de idioma](#7-sistema-de-selección-de-idioma)
8. [Evitar duplicación de lógica entre idiomas](#8-evitar-duplicación-de-lógica-entre-idiomas)
9. [Preparación para un tercer idioma](#9-preparación-para-un-tercer-idioma)
10. [Orden de refactorización](#10-orden-de-refactorización)
11. [Plan de migración por fases](#11-plan-de-migración-por-fases)
12. [Resumen de decisiones](#12-resumen-de-decisiones-arquitectónicas)

---

## 1. Diagnóstico del proyecto

Tras auditar el proyecto, se identificaron **~285 strings** de contenido visible, divididas en dos categorías con naturalezas fundamentalmente distintas:

| Categoría | Cantidad | Naturaleza | Ejemplos |
|-----------|----------|------------|----------|
| **Strings de UI/Chrome** | ~65 | Etiquetas, botones, headings, navegación, aria-labels | `"Ver proyectos"`, `"Frontend & Mobile"`, `aria-label="Abrir menú"` |
| **Strings de contenido** | ~220 | Datos de experiencia, proyectos, formación, pilares | Descripciones de proyectos, logros, resúmenes, títulos de grado |

Esta distinción es **crítica** para la arquitectura. Ambos tipos requieren estrategias diferentes.

### Inventario detallado por componente

| Componente | Strings UI | Strings contenido | Tipo de datos |
|------------|-----------|-------------------|---------------|
| `Layout.astro` | 2 | 0 | Meta description, `lang` |
| `Navbar.astro` | 10 | 0 | Labels, aria-labels |
| `Hero.astro` | 8 | 0 | Heading, tagline, CTAs |
| `Technologies.astro` | 6 | 0 | Headings, párrafos descriptivos |
| `TechnologyCard.astro` | 0 | 0 | Renderiza desde datos (nombres propios) |
| `Education.astro` | 8 | 0 | Títulos, instituciones, fechas |
| `Experience.astro` | 5 | 0 | Heading, párrafo intro |
| `ExperienceCard.astro` | 0 | ~80 | 5 experiencias con múltiples campos |
| `ProjectsGrid.astro` | 5 | 0 | Heading, párrafo intro |
| `ProjectCard.astro` | 12 | 0 | Badges, CTAs, aria-labels |
| `[slug].astro` | 18 | ~175 | 7 proyectos con ~25 campos cada uno |
| `About.astro` | 18 | 0 | Párrafos, array de pilares (4) |
| `Footer.astro` | 1 | 0 | Tagline |

---

## 2. Arquitectura recomendada

### Principio rector: Angular-like separation of concerns

Angular separa el template (HTML) del contenido (i18n attributes + XLF). En Astro replicamos el patrón con:

- **Módulos TypeScript por sección y por idioma** — cada componente tiene su propio archivo de traducciones tipado
- **Loaders individuales** — funciones como `getHero(locale)` que retornan el objeto de traducciones correcto
- **Middleware de Astro** — detecta el locale y lo expone en `Astro.locals`

### Tres capas

```
Capa 1: UI Strings    → Módulos TypeScript por componente/sección (tipado fuerte, sin strings mágicas)
Capa 2: Contenido     → Archivos de datos con variante de idioma (estructurado, mismo patrón)
Capa 3: Infraestructura → Middleware Astro + loaders + tipos compartidos
```

### API de consumo en componentes

```astro
---
// Hero.astro
import { getHero } from "../i18n/loader";
const { locale } = Astro.locals;
const hero = getHero(locale);
---
<h1>{hero.title}</h1>
<p>{hero.description}</p>
<a href="/proyectos">{hero.cta}</a>
```

**Ventajas sobre `t("clave.anidada")`:**
- Autocompletado IDE en `hero.` — todas las propiedades visibles
- Sin strings mágicas: cero riesgo de typos en claves
- Refactorización segura: renombrar una propiedad actualiza todas las referencias
- Tipo de retorno inferido: el loader devuelve el tipo exacto, no `string`

### ¿Por qué no usar librerías externas?

`i18next`, `astro-i18next` y `paraglide` añaden runtime JS. Este portafolio genera HTML estático. Cargar una librería de 30 KB para traducir ~65 strings de UI es innecesario. Con TypeScript nativo y loaders estáticos, todo se resuelve en build time con cero overhead en el cliente.

---

## 3. Estructura de carpetas

```
src/
├── i18n/
│   ├── config.ts              # SUPPORTED_LOCALES, DEFAULT_LOCALE, tipo Locale
│   ├── types.ts               # Interfaces por sección: HeroTranslations, NavbarTranslations, etc.
│   ├── loader.ts              # getNavbar(), getHero(), getTechnologies(), etc.
│   │
│   ├── es/
│   │   ├── navbar.ts          # export const navbar: NavbarTranslations = { ... }
│   │   ├── hero.ts            # export const hero: HeroTranslations = { ... }
│   │   ├── technologies.ts    # export const technologies: TechnologiesTranslations = { ... }
│   │   ├── education.ts       # export const education: EducationTranslations = { ... }
│   │   ├── experience.ts      # export const experience: ExperienceTranslations = { ... }
│   │   ├── about.ts           # export const about: AboutTranslations = { ... }
│   │   ├── projects.ts        # export const projects: ProjectsTranslations = { ... }
│   │   └── footer.ts          # export const footer: FooterTranslations = { ... }
│   │
│   └── en/
│       ├── navbar.ts
│       ├── hero.ts
│       ├── technologies.ts
│       ├── education.ts
│       ├── experience.ts
│       ├── about.ts
│       ├── projects.ts
│       └── footer.ts
│
├── data/
│   ├── experiencias/
│   │   ├── es.ts              # 5 experiencias en español
│   │   ├── en.ts              # 5 experiencias en inglés
│   │   └── loader.ts          # getExperiencias(locale)
│   ├── proyectos/
│   │   ├── es.ts              # 7 proyectos en español
│   │   ├── en.ts              # 7 proyectos en inglés
│   │   └── loader.ts          # getProyectos(locale), getProyectoBySlug(slug, locale)
│   └── tecnologias.ts         # Sin cambios (nombres propios, no se traducen)
│
├── middleware.ts               # Detección de locale, expone locale en Astro.locals
│
└── components/
    └── LanguageSwitcher.astro  # Selector ES | EN
```

### Justificación

**`i18n/{es,en}/`** — Un directorio por idioma con un archivo `.ts` por sección. Agregar un tercer idioma (`/pt/`) requiere crear una carpeta nueva con los mismos 8 archivos como plantilla. Cero cambios en componentes.

**Un archivo `.ts` por sección** — Cada componente del portafolio tiene su propio módulo de traducciones. Si trabajas en `Navbar.astro`, solo tocas `es/navbar.ts` y `en/navbar.ts`. Sin colisiones, sin archivos monolíticos.

**`loader.ts` centralizado** — Contiene una función `get*()` por sección. Cada loader importa estáticamente ambos idiomas y retorna el correcto según el locale. Esto permite tree-shaking: Astro solo incluye en el bundle las traducciones del idioma que se está construyendo.

---

## 4. Por qué TypeScript exclusivamente

### Comparativa eliminada: JSON descartado por decisión arquitectónica

| Característica | JSON | TypeScript |
|---------------|------|------------|
| Autocompletado | ❌ Requiere tipos generados manualmente | ✅ Nativo |
| Refactorización | ❌ Strings mágicas, sin trazabilidad | ✅ `F2` renombra todas las referencias |
| Validación en compilación | ❌ Solo en runtime | ✅ El build falla si falta una propiedad |
| Estructuras anidadas | ✅ Soportado | ✅ Soportado, con tipo inferido |
| Funciones helper | ❌ No soportado | ✅ Se pueden agregar getters, computed properties |
| Curva de aprendizaje | Baja | Media (ya conocida en el proyecto) |
| Tooling | Cualquier editor | IDE con IntelliSense completo |

### Beneficio clave de TypeScript sobre JSON

Con JSON + `t("hero.title")`:

```astro
<!-- Sin autocompletado, sin validación -->
<h1>{t("hero.titel")}</h1>  <!-- typo: "titel" en vez de "title" — solo falla en runtime -->
```

Con TypeScript + loaders:

```astro
---
const hero = getHero(locale);
---
<h1>{hero.title}</h1>  <!-- autocompletado, validación en compilación, renombrable -->
```

### Conclusión

TypeScript exclusivo elimina una capa de abstracción (el mapeo de strings a valores), reduce el riesgo de errores silenciosos y aprovecha al máximo el sistema de tipos que el proyecto ya utiliza. La verbosidad adicional de los archivos `.ts` frente a `.json` es marginal comparada con la seguridad que aporta.

---

## 5. Organización de traducciones para escalar

### Principio: Un módulo TypeScript por sección del portafolio

```
i18n/{locale}/
├── navbar.ts         # Labels de navegación, aria-labels, brand
├── hero.ts           # Subtítulo, título, descripción, CTAs, social links
├── technologies.ts   # Headings de tarjetas, párrafos frontend/backend
├── education.ts      # Títulos de grado, instituciones, fechas, CTA
├── experience.ts     # Heading de sección, párrafo introductorio
├── about.ts          # Párrafos, pilares (array de objetos), enfoque
├── projects.ts       # Labels de ProjectCard, badges, CTAs, [slug] UI
└── footer.ts         # Tagline, copyright
```

### Ejemplo de módulo: `es/hero.ts`

```typescript
import type { HeroTranslations } from "../types";

export const hero: HeroTranslations = {
  subtitle: "Ingeniero de Sistemas",
  title: "Elias Alegre",
  description: "Desarrollo sistemas y aplicaciones para ayudar a empresas a digitalizar y optimizar sus procesos.",
  alt: "Elias Alegre",
  social: {
    gmail: "Gmail",
    linkedin: "LinkedIn",
    github: "GitHub",
  },
  cta: "Ver proyectos",
};
```

### Ejemplo de módulo: `es/navbar.ts`

```typescript
import type { NavbarTranslations } from "../types";

export const navbar: NavbarTranslations = {
  home: "Inicio",
  skills: "Conocimientos",
  projects: "Proyectos",
  experience: "Experiencia",
  about: "Sobre mí",
  brand: "Elias",
  aria: {
    mainNav: "Navegación principal",
    openMenu: "Abrir menú de navegación",
    closeMenu: "Cerrar menú de navegación",
    mobileMenu: "Menú mobile",
    menu: "Menú",
  },
};
```

### Ejemplo de módulo con datos estructurados: `es/technologies.ts`

```typescript
import type { TechnologiesTranslations } from "../types";

export const technologies: TechnologiesTranslations = {
  heading: "Tecnologías con las que trabajo",
  frontend: {
    title: "Frontend & Mobile",
    description: "Desarrollo interfaces web y aplicaciones móviles utilizando tecnologías que destacan por diferentes fortalezas: Astro por su rendimiento, React por su enfoque basado en componentes, Angular por su arquitectura escalable y Kotlin por su capacidad para crear aplicaciones móviles modernas.",
  },
  backend: {
    title: "Backend",
    description: "En el backend construyo la lógica de negocio y las APIs apoyándome en C#, Java, Python, Laravel y Node.js, aprovechando la eficiencia, robustez, integración con IA, rapidez de desarrollo y escalabilidad que aporta cada una de estas tecnologías.",
  },
};
```

### Por qué esta organización escala

1. **Localidad absoluta:** Si modificas el Navbar, solo tocas `navbar.ts` en cada idioma. El resto del sistema no se entera.
2. **Sin colisiones:** `navbar.home` y `hero.title` viven en archivos y tipos separados. Imposible que colisionen.
3. **Tipos por sección:** `NavbarTranslations`, `HeroTranslations`, etc. Cada interfaz describe exactamente lo que ese componente necesita. Sin campos sobrantes ni faltantes.
4. **Migración incremental:** Puedes migrar Hero sin tocar Navbar. Cada componente se independiza en su propia fase.

---

## 6. Desacoplamiento del texto de los componentes

### Estrategia: Loaders tipados por sección

Cada componente importa su propio loader desde `src/i18n/loader.ts` y consume las traducciones como un objeto TypeScript con todas las propiedades accesibles por autocompletado.

### Antes (hardcodeado)

```astro
<h2>Tecnologías con las que trabajo</h2>
```

### Después (desacoplado)

```astro
---
// Technologies.astro
import { getTechnologies } from "../i18n/loader";
const { locale } = Astro.locals;
const t = getTechnologies(locale);
---
<h2>{t.heading}</h2>
```

### Ejemplo completo: Technologies.astro

```astro
---
import TechnologyCard from "./TechnologyCard.astro";
import { frontend, backend } from "../data/tecnologias";
import { getTechnologies } from "../i18n/loader";

const { locale } = Astro.locals;
const t = getTechnologies(locale);
---

<section id="tecnologias" class="py-24">
  <div class="max-w-7xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-16">{t.heading}</h2>

    <div class="grid md:grid-cols-2 gap-8 items-stretch">

      <div class="card-gold p-8 flex flex-col">
        <h3 class="mb-4 text-2xl font-semibold text-white">{t.frontend.title}</h3>
        <p class="mb-6 text-gray-400 leading-relaxed flex-1">{t.frontend.description}</p>
        <div class="flex flex-wrap items-center justify-center gap-10">
          {frontend.map(tech => <TechnologyCard tecnologia={tech} />)}
        </div>
      </div>

      <div class="card-gold p-8 flex flex-col">
        <h3 class="mb-4 text-2xl font-semibold text-white">{t.backend.title}</h3>
        <p class="mb-6 text-gray-400 leading-relaxed flex-1">{t.backend.description}</p>
        <div class="flex flex-wrap items-center justify-center gap-10">
          {backend.map(tech => <TechnologyCard tecnologia={tech} />)}
        </div>
      </div>

    </div>
  </div>
</section>
```

### Ejemplo con datos estructurados: Experience.astro

```astro
---
import { getExperiencias } from "../data/experiencias/loader";
import { getExperience } from "../i18n/loader";
import ExperienceCard from "./experience/ExperienceCard.astro";

const { locale } = Astro.locals;
const t = getExperience(locale);
const experiencias = getExperiencias(locale);
---

<section id="experiencia" class="py-24">
  <div class="max-w-7xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-center mb-4">{t.heading}</h2>
    <p class="text-gray-400 text-center max-w-2xl mx-auto mb-16">{t.description}</p>
    <div class="space-y-6">
      {experiencias.map(exp => <ExperienceCard experiencia={exp} />)}
    </div>
  </div>
</section>
```

### El loader (`src/i18n/loader.ts`)

```typescript
import type { Locale } from "./config";
import type {
  NavbarTranslations,
  HeroTranslations,
  TechnologiesTranslations,
  EducationTranslations,
  ExperienceTranslations,
  AboutTranslations,
  ProjectsTranslations,
  FooterTranslations,
} from "./types";

import { navbar as navbarEs } from "./es/navbar";
import { navbar as navbarEn } from "./en/navbar";
import { hero as heroEs } from "./es/hero";
import { hero as heroEn } from "./en/hero";
import { technologies as technologiesEs } from "./es/technologies";
import { technologies as technologiesEn } from "./en/technologies";
import { education as educationEs } from "./es/education";
import { education as educationEn } from "./en/education";
import { experience as experienceEs } from "./es/experience";
import { experience as experienceEn } from "./en/experience";
import { about as aboutEs } from "./es/about";
import { about as aboutEn } from "./en/about";
import { projects as projectsEs } from "./es/projects";
import { projects as projectsEn } from "./en/projects";
import { footer as footerEs } from "./es/footer";
import { footer as footerEn } from "./en/footer";

const navbarMap: Record<Locale, NavbarTranslations> = { es: navbarEs, en: navbarEn };
const heroMap: Record<Locale, HeroTranslations> = { es: heroEs, en: heroEn };
const technologiesMap: Record<Locale, TechnologiesTranslations> = { es: technologiesEs, en: technologiesEn };
const educationMap: Record<Locale, EducationTranslations> = { es: educationEs, en: educationEn };
const experienceMap: Record<Locale, ExperienceTranslations> = { es: experienceEs, en: experienceEn };
const aboutMap: Record<Locale, AboutTranslations> = { es: aboutEs, en: aboutEn };
const projectsMap: Record<Locale, ProjectsTranslations> = { es: projectsEs, en: projectsEn };
const footerMap: Record<Locale, FooterTranslations> = { es: footerEs, en: footerEn };

export function getNavbar(locale: Locale): NavbarTranslations {
  return navbarMap[locale] ?? navbarMap.es;
}

export function getHero(locale: Locale): HeroTranslations {
  return heroMap[locale] ?? heroMap.es;
}

export function getTechnologies(locale: Locale): TechnologiesTranslations {
  return technologiesMap[locale] ?? technologiesMap.es;
}

export function getEducation(locale: Locale): EducationTranslations {
  return educationMap[locale] ?? educationMap.es;
}

export function getExperience(locale: Locale): ExperienceTranslations {
  return experienceMap[locale] ?? experienceMap.es;
}

export function getAbout(locale: Locale): AboutTranslations {
  return aboutMap[locale] ?? aboutMap.es;
}

export function getProjects(locale: Locale): ProjectsTranslations {
  return projectsMap[locale] ?? projectsMap.es;
}

export function getFooter(locale: Locale): FooterTranslations {
  return footerMap[locale] ?? footerMap.es;
}
```

### Mecanismo técnico

1. `middleware.ts` detecta el locale al recibir la request y lo expone en `Astro.locals.locale`
2. Cada componente importa su loader específico: `getHero`, `getNavbar`, etc.
3. El loader realiza imports estáticos de ambos idiomas (es, en) y retorna el mapa correcto
4. Como todo es estático, Astro aplica tree-shaking: solo el idioma activo llega al bundle final
5. Si un locale no existe, el loader retorna el fallback (`es`) automáticamente

**Cero runtime JS en el cliente.** La traducción ocurre durante SSG.

---

## 7. Sistema de selección de idioma

### Estrategia: URL-based routing con cookie de preferencia

```
/           → redirige a /es/ según preferencia
/es/        → sitio en español
/en/        → sitio en inglés
/es/proyectos/trazabilidad  → detalle en español
/en/projects/trazabilidad   → detalle en inglés
```

### Flujo de detección (orden de prioridad)

```
1. URL                          → /es/ o /en/ ya determina el idioma
2. Cookie "preferred_locale"    → selección manual previa del usuario
3. Header "Accept-Language"     → preferencia del navegador
4. Fallback                     → español (es)
```

### Middleware de Astro (pseudocódigo)

```typescript
// src/middleware.ts
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "./i18n/config";

export const onRequest = (context, next) => {
  const url = new URL(context.request.url);

  // 1. Extraer locale de la URL
  const localeFromPath = url.pathname.split("/")[1];

  // 2. Validar que sea un locale soportado
  const locale: Locale = SUPPORTED_LOCALES.includes(localeFromPath as Locale)
    ? (localeFromPath as Locale)
    : detectLocale(context.request); // cookie → header → fallback

  // 3. Redirigir si la URL no tiene prefijo
  if (!SUPPORTED_LOCALES.includes(localeFromPath as Locale)) {
    return Response.redirect(new URL(`/${locale}${url.pathname}`, url.origin));
  }

  // 4. Exponer locale en Astro.locals (los loaders se llaman desde cada componente)
  context.locals.locale = locale;

  return next();
};
```

### Componente LanguageSwitcher

- Renderiza `ES | EN` con la opción activa resaltada en dorado
- Al hacer clic, guarda cookie y redirige a la misma página en el otro idioma
- Ubicación: Navbar (escritorio) y menú mobile

---

## 8. Evitar duplicación de lógica entre idiomas

### Principio: Una sola fuente de verdad para la lógica, múltiples fuentes para el texto

### A. Templates idénticos, solo cambian los datos

El componente `ExperienceCard.astro` renderiza igual en español e inglés. Solo cambia el objeto `experiencia` que recibe. La lógica de renderizado vive una sola vez.

```astro
<!-- ExperienceCard.astro — único archivo, sin forks por idioma -->
<article class="card-gold ...">
  <h3>{experiencia.rol}</h3>
  <p>{experiencia.resumen}</p>
</article>
```

### B. Módulos TypeScript espejo con la misma interfaz

```typescript
// src/i18n/es/hero.ts
export const hero: HeroTranslations = {
  subtitle: "Ingeniero de Sistemas",
  title: "Elias Alegre",
  cta: "Ver proyectos",
};

// src/i18n/en/hero.ts
export const hero: HeroTranslations = {
  subtitle: "Systems Engineer",
  title: "Elias Alegre",
  cta: "View projects",
};
```

Ambos exportan el mismo tipo `HeroTranslations`. Si `en/hero.ts` olvida el campo `cta`, TypeScript **falla en compilación**, no en producción.

### C. TypeScript garantiza paridad de interfaces

```typescript
// src/i18n/types.ts
export interface HeroTranslations {
  subtitle: string;
  title: string;
  description: string;
  alt: string;
  social: {
    gmail: string;
    linkedin: string;
    github: string;
  };
  cta: string;
}
```

Cada archivo `es/hero.ts` y `en/hero.ts` debe satisfacer `HeroTranslations`. Si falta un campo o sobra, el compilador lo detecta.

### D. Loader garantiza fallback seguro

```typescript
export function getHero(locale: Locale): HeroTranslations {
  return heroMap[locale] ?? heroMap.es;  // Siempre retorna algo válido
}
```

### Lo que NUNCA se debe hacer

```
❌ Navbar.es.astro y Navbar.en.astro          → fork de componentes por idioma
❌ if (locale === "es") { ... } else { ... }   → condicionales en templates
❌ {locale === "es" ? "Inicio" : "Home"}       → ternarios inline
❌ t("hero.title")                              → strings mágicas sin tipo
```

---

## 9. Preparación para un tercer idioma

La arquitectura está diseñada para que agregar un idioma requiera **cero cambios en componentes**.

### Paso 1: Registrar el nuevo locale

```typescript
// src/i18n/config.ts
export const SUPPORTED_LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
```

### Paso 2: Crear las traducciones

```bash
cp -r src/i18n/es/ src/i18n/pt/
cp src/data/experiencias/es.ts src/data/experiencias/pt.ts
cp src/data/proyectos/es.ts src/data/proyectos/pt.ts
```

Luego traducir los archivos copiados. Cada archivo `.ts` ya está tipado con su interfaz correspondiente, así que el IDE guía qué campos traducir.

### Paso 3: Actualizar el loader

Agregar una línea por cada mapa en `loader.ts`:

```typescript
import { navbar as navbarPt } from "./pt/navbar";
// ... etc

const navbarMap: Record<Locale, NavbarTranslations> = {
  es: navbarEs,
  en: navbarEn,
  pt: navbarPt,  // ← nueva línea
};
```

### Paso 4: Actualizar el selector de idioma

Agregar `"pt"` al array de opciones en `LanguageSwitcher.astro`.

### Garantías

- **TypeScript fuerza que `pt/` tenga exactamente las mismas propiedades que `es/`.** Si `pt/hero.ts` no tiene `cta`, el build falla.
- **El middleware detecta automáticamente** cualquier locale en `SUPPORTED_LOCALES`.
- **Los componentes son agnósticos del locale.** Solo consumen `getHero(locale)`, `getNavbar(locale)`, etc.
- **El loader centralizado** solo requiere agregar imports y entradas en los maps. Sin tocar componentes.

---

## 10. Orden de refactorización

### Criterio de priorización

| Factor | Peso |
|--------|------|
| UI primero (más repetitivas, más visibles) | Alto |
| Menos strings primero (victorias rápidas) | Alto |
| Componentes del hero fold primero | Medio |
| Componentes sin lógica condicional primero | Medio |

### Orden ejecutado

| Fase | Componentes | Estado |
|------|------------|--------|
| **0** | Infraestructura (`config.ts`, `types.ts`, `loader.ts`, `middleware.ts`) | ✅ Completada |
| **1** | `navbar.ts`, `footer.ts`, `Layout.astro` | ✅ Completada |
| **2** | `hero.ts`, `technologies.ts` | ✅ Completada |
| **3** | `experience.ts`, `education.ts`, `experiencias/{locale}.ts` | ✅ Completada |
| **4** | `about.ts` (párrafos + pilares) | ✅ Completada |
| **5A** | `projects.ts` — UI de ProjectsGrid y ProjectCard | ✅ Completada |
| **5B** | `proyectos/{locale}.ts` — datos de 7 proyectos en ambos idiomas | ✅ Completada |
| **5C** | `[slug].astro` — página de detalle con loaders | ✅ Completada |

### Orden pendiente

| Fase | Descripción | Dificultad |
|------|------------|------------|
| **6** | Rutas multilenguaje — configuración de Astro para `/es/` y `/en/` | Media |
| **7** | Language Switcher — selector ES \| EN en Navbar | Baja |
| **8** | SEO multilenguaje — hreflang, canonical, sitemap, robots, Accept-Language | Media |
| **9** | Pulido y Release 1.0 — Open Graph, Twitter Cards, favicon, manifest, Lighthouse, README | Baja |

---

## 11. Plan de migración por fases

### ✅ Fase 0: Infraestructura (COMPLETADA)

**Objetivo:** Establecer la base sin romper nada existente.

- [x] Crear `src/i18n/config.ts` — `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, tipo `Locale`
- [x] Crear `src/i18n/types.ts` — `NavbarTranslations`, `FooterTranslations`
- [x] Crear `src/i18n/es/navbar.ts` y `src/i18n/es/footer.ts` con strings actuales
- [x] Crear `src/i18n/loader.ts` — funciones `getNavbar()`, `getFooter()`
- [x] Escribir `middleware.ts` — detección de locale, exponer `Astro.locals.locale`
- [x] Crear `src/env.d.ts` — tipado de `App.Locals`
- [x] **Build exitoso, 0 errores, sin cambios visuales**

**Hito:** Middleware funcionando, `locale` disponible en `Astro.locals`, tipos definidos, loader operativo.

---

### ✅ Fase 1: Navbar + Footer + Layout (COMPLETADA)

- [x] Crear `src/i18n/en/navbar.ts` y `src/i18n/en/footer.ts` con traducciones al inglés
- [x] Actualizar `loader.ts` con imports de `en/`
- [x] Refactorizar `Navbar.astro` → `getNavbar(locale)`, `define:vars` para aria-labels en JS
- [x] Refactorizar `Footer.astro` → `getFooter(locale)`
- [x] `lang="es"` → `lang={locale}` dinámico en Layout
- [x] **Build exitoso, 8 páginas, sin cambios visuales**

**Hito:** Primeros componentes desacoplados. Navbar y Footer funcionan en ambos idiomas.

---

### ✅ Fase 2: Hero + Technologies (COMPLETADA)

- [x] Crear `es/hero.ts`, `en/hero.ts` — tipados con `HeroTranslations`
- [x] Crear `es/technologies.ts`, `en/technologies.ts` — tipados con `TechnologiesTranslations`
- [x] Agregar `getHero()` y `getTechnologies()` al loader
- [x] Refactorizar `Hero.astro` y `Technologies.astro`
- [x] **Build exitoso, above the fold bilingüe**

**Hito:** Above the fold completamente bilingüe.

---

### ✅ Fase 3: Experience + Education (COMPLETADA)

- [x] Crear `es/experience.ts`, `en/experience.ts`
- [x] Crear `es/education.ts`, `en/education.ts`
- [x] Agregar `getExperience()` y `getEducation()` al loader
- [x] Migrar `src/data/experiencias.ts` → `src/data/experiencias/{es,en}.ts` + `loader.ts`
- [x] Refactorizar `Experience.astro` y `Education.astro`
- [x] **Build exitoso, datos estructurados migrados**

**Hito:** Contenido estructurado migrado. El patrón `data/{tipo}/{locale}.ts` + `loader.ts` queda validado. `ExperienceCard.astro` no requirió cambios.

---

### ✅ Fase 4: About + pilares (COMPLETADA)

- [x] Crear `es/about.ts`, `en/about.ts` — incluye el array tipado de pilares con iconos SVG
- [x] Agregar `getAbout()` al loader
- [x] Refactorizar `About.astro` — `map()` sobre `paragraphs[]` y `pilares[]`
- [x] **Build exitoso, cero texto hardcodeado en About**

---

### ✅ Fase 5A: Projects UI (COMPLETADA)

- [x] Crear `es/projects.ts`, `en/projects.ts`
- [x] Agregar `getProjects()` al loader
- [x] Refactorizar `ProjectsGrid.astro` y `ProjectCard.astro`
- [x] **Build exitoso, UI de proyectos 100% i18n**

---

### ✅ Fase 5B: Projects Data (COMPLETADA)

- [x] Migrar `proyectos.ts` → `proyectos/{es,en}.ts` + `loader.ts`
- [x] Crear `getProyectos()`, `getProyectosDestacados()`, `getProyectoBySlug()`
- [x] Revisión lingüística del inglés (verbos profesionales, terminología estándar)
- [x] Actualizar `ProjectsGrid.astro` para usar `getProyectos(locale)`
- [x] **Build exitoso, 7 proyectos localizados**

**Hito:** 100% de los datos de proyectos en ambos idiomas.

---

### ✅ Fase 5C: Project Detail (COMPLETADA)

- [x] Extender `ProjectsTranslations` con sección `detail` (17 campos nuevos)
- [x] Actualizar `es/projects.ts` y `en/projects.ts`
- [x] Refactorizar `[slug].astro` — `getProyectoBySlug(locale, slug)` + `getProjects(locale)`
- [x] `getStaticPaths()` usa locale `"es"` para generar rutas
- [x] **Build exitoso, 7 páginas de detalle en español**

**Hito:** 100% del contenido desacoplado. El archivo `src/data/proyectos.ts` queda obsoleto. Todas las secciones del portafolio funcionan con el sistema i18n.

---

### ⬜ Fase 6: Rutas multilenguaje (PENDIENTE)

- [ ] Configurar `astro.config.mjs` para generar rutas `/es/` y `/en/`
- [ ] Mover `src/pages/index.astro` → `src/pages/[locale]/index.astro`
- [ ] Mover `src/pages/proyectos/[slug].astro` → `src/pages/[locale]/proyectos/[slug].astro`
- [ ] Actualizar `getStaticPaths()` en ambas páginas para generar todas las variantes
- [ ] Actualizar middleware para redirigir `/` → `/{locale}/`
- [ ] **Build bilingüe con dos conjuntos de páginas estáticas**

---

### ⬜ Fase 7: Language Switcher (PENDIENTE)

- [ ] Crear `LanguageSwitcher.astro` — selector ES | EN con estilo dorado
- [ ] Integrar en `Navbar.astro` (escritorio y mobile)
- [ ] Implementar cookie `preferred_locale` para recordar preferencia
- [ ] Redirigir a la misma página en el otro idioma al cambiar
- [ ] **Build y verificar cambio de idioma fluido**

---

### ⬜ Fase 8: SEO multilenguaje (PENDIENTE)

- [ ] Agregar `hreflang` tags en `Layout.astro` para SEO multilingüe
- [ ] Configurar `canonical` URLs por idioma
- [ ] Generar `sitemap.xml` con URLs de ambos idiomas
- [ ] Configurar `robots.txt`
- [ ] Middleware: detección de `Accept-Language` header
- [ ] **Build y auditoría SEO**

---

### ⬜ Fase 9: Pulido y Release 1.0 (PENDIENTE)

- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Cards
- [ ] `favicon.ico` y `manifest.json`
- [ ] `theme-color` meta tag
- [ ] Auditoría Lighthouse (Performance, Accessibility, SEO)
- [ ] Revisión de accesibilidad (contraste, focus, ARIA)
- [ ] Actualizar `README.md` con info del proyecto final
- [ ] Actualizar este documento (`docs/i18n-architecture.md`) con estado final
- [ ] **Release 1.0**

---

## 12. Resumen de decisiones arquitectónicas

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| **Formato de traducciones** | Módulos TypeScript exclusivamente | Autocompletado, validación en compilación, refactorización segura, sin strings mágicas |
| **API de consumo** | `getHero(locale).title` (loaders por sección) | Tipado inferido, sin claves string, renombrable con F2 |
| **Organización** | Un archivo `.ts` por sección por idioma | Localidad, sin colisiones, migración incremental |
| **Carga de traducciones** | Build time (SSG) con imports estáticos | Cero runtime JS, tree-shaking automático |
| **Detección de idioma** | URL prefix + cookie + header | SEO-friendly, compartible, sin flash de contenido |
| **Separación UI vs contenido** | `i18n/{locale}/` para UI, `data/{tipo}/{locale}.ts` para contenido | Distinta naturaleza, distinto ciclo de vida |
| **Garantía de paridad** | Interfaces TypeScript compartidas | Build falla si falta un campo en cualquier idioma |
| **Migración** | Por componente, UI primero, fases pequeñas | Minimiza riesgo, releases incrementales, feedback temprano |
| **Nuevo idioma** | Copiar `es/` → `{locale}/` + traducir + 1 línea por mapa en loader | Cero cambios en componentes |
