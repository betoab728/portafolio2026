# Portfolio — Elias Alegre

Professional portfolio built with **Astro**, **Tailwind CSS** and **React**. Multilingual (Spanish/English), fully static, and optimized for performance.

## Stack

| Technology        | Version |
| :---------------- | :------ |
| Astro             | 6.x     |
| Tailwind CSS      | 4.x     |
| React             | 19.x    |
| TypeScript        | 5.x     |

## Features

- **Multilingual** — Spanish (`/es/`) and English (`/en/`) via a custom TypeScript-based i18n architecture
- **Static generation** — Fully pre-rendered HTML with zero client-side JS overhead
- **SEO** — Canonical URLs, hreflang alternates, Open Graph, Twitter Cards, sitemap, robots.txt
- **Responsive** — Mobile-first design with Tailwind CSS
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation
- **Performant** — Lazy loading, optimized images, minimal CSS

## Project Structure

```
/
├── public/              # Static assets (images, fonts, favicon, sitemap, robots)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── Technologies.astro
│   │   ├── Education.astro
│   │   ├── Experience.astro
│   │   ├── About.astro
│   │   ├── Footer.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── TechnologyCard.astro
│   │   ├── experience/
│   │   │   └── ExperienceCard.astro
│   │   └── projects/
│   │       ├── ProjectCard.astro
│   │       └── ProjectsGrid.astro
│   ├── data/            # Localized structured data
│   │   ├── experiencias/
│   │   │   ├── es.ts
│   │   │   ├── en.ts
│   │   │   └── loader.ts
│   │   ├── proyectos/
│   │   │   ├── es.ts
│   │   │   ├── en.ts
│   │   │   └── loader.ts
│   │   └── tecnologias.ts
│   ├── i18n/            # Translation modules
│   │   ├── config.ts
│   │   ├── types.ts
│   │   ├── loader.ts
│   │   ├── es/          # Spanish translations
│   │   └── en/          # English translations
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── [locale]/
│   │       ├── index.astro
│   │       └── proyectos/
│   │           └── [slug].astro
│   ├── styles/
│   │   └── global.css
│   └── types/           # TypeScript interfaces
├── docs/
│   └── i18n-architecture.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Sections

| Section          | Description                          |
| :--------------- | :----------------------------------- |
| **Hero**         | Introduction and call to action      |
| **Technologies** | Technical stack and tools            |
| **Education**    | Academic background and certifications |
| **Projects**     | Featured projects with links         |
| **Experience**   | Professional experience              |
| **About**        | Personal information and soft skills |

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Start dev server at `localhost:4321`        |
| `npm run build`    | Production build to `./dist/`               |
| `npm run preview`  | Preview production build locally            |

## Deployment

The project generates a fully static site in `dist/`, deployable to any static hosting:

- **Vercel** — Automatic deploys from Git
- **Netlify** — Drag-and-drop or Git integration
- **Cloudflare Pages** — Global CDN with free tier
- **GitHub Pages** — Free hosting for public repos

Set the `site` URL in `astro.config.mjs` before deploying.

## Adding a Language

1. Copy `src/i18n/es/` → `src/i18n/{locale}/`
2. Copy `src/data/experiencias/es.ts` → `src/data/experiencias/{locale}.ts`
3. Copy `src/data/proyectos/es.ts` → `src/data/proyectos/{locale}.ts`
4. Add the locale to `SUPPORTED_LOCALES` in `src/i18n/config.ts`
5. Add imports and map entries in `src/i18n/loader.ts` and `src/data/.../loader.ts`
6. Add the locale route in `src/pages/[locale]/index.astro` `getStaticPaths`

## Adding a Project

1. Add the project to `src/data/proyectos/es.ts` (Spanish)
2. Add the translated version to `src/data/proyectos/en.ts` (English)
3. Add images to `public/assets/sistemas/{slug}/`
4. Add the slug URLs to `public/sitemap.xml`

## License

MIT — see [LICENSE](./LICENSE)
