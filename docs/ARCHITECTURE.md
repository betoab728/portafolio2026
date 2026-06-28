# Architecture — Portfolio Astro

## Overview

This portfolio is a **fully static multilingual site** built with Astro 6. It generates pre-rendered HTML for two languages (Spanish and English) using a custom TypeScript-based i18n system with zero runtime JavaScript overhead.

## Architecture Layers

```
┌─────────────────────────────────────┐
│            Pages (Routes)            │
│  src/pages/[locale]/                │
│  ├── index.astro                    │
│  └── proyectos/[slug].astro         │
├─────────────────────────────────────┤
│          Components (UI)             │
│  src/components/                    │
│  ├── Layout (Layout.astro)          │
│  ├── Navbar, Hero, Technologies...  │
│  ├── LanguageSwitcher               │
│  └── projects/, experience/         │
├─────────────────────────────────────┤
│         Data Layer (Content)         │
│  src/data/                          │
│  ├── experiencias/{locale}.ts       │
│  ├── proyectos/{locale}.ts          │
│  └── tecnologias.ts                 │
├─────────────────────────────────────┤
│      Translations Layer (i18n)       │
│  src/i18n/                          │
│  ├── config.ts, types.ts, loader.ts │
│  └── {locale}/ (navbar, hero, ...)  │
├─────────────────────────────────────┤
│         Infrastructure               │
│  middleware.ts, astro.config.mjs     │
│  env.d.ts, global.css               │
└─────────────────────────────────────┘
```

## Component Organization

Each Astro file is a self-contained component with its own imports and logic. Components are organized by domain:

| Directory | Purpose |
|-----------|---------|
| `src/components/` | Top-level page sections (Navbar, Hero, etc.) |
| `src/components/experience/` | Experience section components |
| `src/components/projects/` | Project grid and cards |
| `src/layouts/` | Page layout wrappers |

## i18n System

### Architecture

The i18n system uses **TypeScript modules** exclusively — no JSON, no runtime libraries.

```
src/i18n/
├── config.ts       # SUPPORTED_LOCALES, DEFAULT_LOCALE, Locale type
├── types.ts        # Translation interfaces (NavbarTranslations, HeroTranslations, ...)
├── loader.ts       # getNavbar(locale), getHero(locale), etc.
├── es/             # Spanish: navbar.ts, hero.ts, technologies.ts, ...
└── en/             # English: navbar.ts, hero.ts, technologies.ts, ...
```

### Translation Flow

```
1. User visits /es/ or /en/
2. Middleware extracts locale from URL → sets Astro.locals.locale
3. Each component imports its loader: getHero(locale)
4. Loader returns the typed translation object: HeroTranslations
5. Component renders: {hero.title}, {hero.description}
```

### Loaders

Each `get*()` function in `loader.ts`:
- Imports both language modules at build time
- Returns the correct translation based on `locale` parameter
- Falls back to Spanish if locale is not found
- TypeScript ensures all languages have the same structure

### Data Loaders

Content data (experiences, projects) follows the same pattern:

```
src/data/experiencias/
├── es.ts      # Spanish experience entries
├── en.ts      # English experience entries
└── loader.ts  # getExperiencias(locale)
```

```typescript
// src/data/experiencias/loader.ts
const data: Record<Locale, Experiencia[]> = { es, en };
export function getExperiencias(locale: Locale): Experiencia[] {
  return data[locale] ?? data.es;
}
```

## Routing

### URL Structure

| URL | Content |
|-----|---------|
| `/es/` | Spanish homepage |
| `/en/` | English homepage |
| `/es/proyectos/{slug}/` | Spanish project detail |
| `/en/proyectos/{slug}/` | English project detail |

### Implementation

Pages live under `src/pages/[locale]/`. Astro's `getStaticPaths()` generates all locale variants:

```astro
---
// src/pages/[locale]/index.astro
export function getStaticPaths() {
  return [{ params: { locale: "es" } }, { params: { locale: "en" } }];
}
---
```

### Middleware

`src/middleware.ts` handles:
1. Locale extraction from URL path
2. Redirect from `/` to `/{locale}/` using cookie → Accept-Language → default
3. Setting `Astro.locals.locale` for component consumption
4. Setting `preferred_locale` cookie (1 year expiry)

## Data Flow

```
User Request → Middleware → Astro.locals.locale → Component → Loader
                    ↓                                      ↓
              URL locale                           Translation/Data
                                                         ↓
                                                   Rendered HTML
```

## Adding Content

### Adding a new language

1. Copy `src/i18n/es/` → `src/i18n/{locale}/`
2. Copy data files: `src/data/experiencias/es.ts` → `{locale}.ts`, `src/data/proyectos/es.ts` → `{locale}.ts`
3. Add locale to `SUPPORTED_LOCALES` in `src/i18n/config.ts`
4. Add imports and map entries in `src/i18n/loader.ts`
5. Add locale to `getStaticPaths()` in `src/pages/[locale]/index.astro`
6. Update `public/sitemap.xml` with new locale URLs

### Adding a project

1. Add entry to `src/data/proyectos/es.ts` (Spanish)
2. Add translated entry to `src/data/proyectos/en.ts` (English)
3. Add project images to `public/assets/sistemas/{slug}/`
4. Add slug URLs to `public/sitemap.xml`

### Adding a section

1. Define translations interface in `src/i18n/types.ts`
2. Create `src/i18n/es/{section}.ts` and `src/i18n/en/{section}.ts`
3. Add `get{Section}()` to `src/i18n/loader.ts`
4. Create `.astro` component, import loader, consume translations

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| TypeScript modules for translations | Type-safe, refactorable, autocomplete, no string keys |
| Loader functions (`getHero(locale)`) | Each section is independent, tree-shakeable |
| Content in `/data/{type}/{locale}.ts` | Complex objects stay typed, separate from UI strings |
| Manual `[locale]` routing | Full control, no dependency on Astro experimental i18n |
| No runtime i18n libraries | Zero JS overhead, everything resolved at build time |
| Static sitemap in `public/` | No build-time complications with API endpoints in SSG |

## Performance

- All translations resolved at build time (SSG)
- Images use lazy loading (`loading="lazy"`)
- Fonts via Google Fonts with `preconnect` and `display=swap`
- No client-side JS for core functionality
- Minimal CSS via Tailwind's utility-first approach

## Accessibility

- Semantic HTML5 throughout
- All images have `alt` attributes
- Interactive elements have `aria-label` or `aria-current`
- Navbar supports keyboard navigation and screen readers
- Language switcher communicates active state via `aria-current`
- Color contrast meets WCAG AA standards
