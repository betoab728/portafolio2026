# Portfolio — Elias Alegre

Portafolio web personal desarrollado con **Astro**, **Tailwind CSS** y **React**. Sitio single-page optimizado para rendimiento, con despliegue estático y diseño responsive.

## Stack

| Tecnología        | Versión |
| :---------------- | :------ |
| Astro             | 6.x     |
| Tailwind CSS      | 4.x     |
| React             | 19.x    |
| TypeScript        | 5.x     |

## Estructura del proyecto

```text
/
├── public/              # Assets estáticos (favicon, imágenes, fuentes)
├── src/
│   ├── assets/          # Recursos importados desde componentes
│   ├── components/      # Componentes reutilizables (.astro y .tsx)
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── Technologies.astro
│   │   ├── Education.astro
│   │   ├── Projects.astro
│   │   ├── Experience.astro
│   │   ├── About.astro
│   │   └── Footer.astro
│   ├── content/         # Colecciones de contenido (Markdown/MDX)
│   ├── data/            # Datos estructurados (JSON, TS)
│   ├── layouts/         # Plantillas de página
│   ├── pages/           # Rutas del sitio (file-based routing)
│   ├── styles/          # Estilos globales y utilidades CSS
│   └── types/           # Definiciones de TypeScript
├── astro.config.mjs     # Configuración de Astro + integraciones
├── package.json
└── tsconfig.json
```

## Secciones

| Sección       | Descripción                              |
| :------------ | :--------------------------------------- |
| **Hero**      | Presentación principal y llamada a la acción |
| **Technologies** | Stack técnico y herramientas           |
| **Education** | Formación académica y certificaciones    |
| **Projects**  | Proyectos destacados con enlaces         |
| **Experience** | Trayectoria profesional                 |
| **About**     | Información personal y habilidades blandas |
| **Footer**    | Enlaces de contacto y redes sociales     |

## Comandos

| Comando            | Acción                                           |
| :----------------- | :----------------------------------------------- |
| `npm install`      | Instala dependencias                             |
| `npm run dev`      | Servidor local en `localhost:4321`               |
| `npm run build`    | Build de producción en `./dist/`                 |
| `npm run preview`  | Previsualiza el build local antes de desplegar   |

## Despliegue

El proyecto genera un sitio completamente estático en `dist/`, desplegable en cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
