# AstroGlass — AI Agent Guide

## Quick Reference

- **Stack**: Astro 6 + Tailwind CSS 4 + React 19 + TypeScript
- **Validation**: Valibot (NOT Zod)
- **Search**: Fuse.js
- **Deployment**: Cloudflare Pages (default), Vercel, Netlify
- **Package manager**: pnpm
- **Node**: >=22.12.0

## Commands

```bash
pnpm dev              # Start dev server (runs search index first)
pnpm build            # Production build
pnpm check            # TypeScript / Astro diagnostics
pnpm lint             # ESLint
pnpm format           # Prettier (write)
pnpm format:check     # Prettier (check only)
pnpm preview          # Preview via Wrangler (Cloudflare)
```

## Architecture Overview

### Theme System

6 themes: **liquid**, **glass**, **neo**, **luxury**, **minimal**, **aurora**

Each theme provides 11 section components (Hero, About, Features, Portfolio, Pricing, Testimonial, FAQ, CTA, Contact, Header, Footer) plus a PortfolioPage.

**Naming convention**: `{Section}{Theme}.astro` + `{Section}{Theme}.css`
Example: `HeroLiquid.astro`, `HeroLiquid.css`

### Key Config Files

| File | Purpose |
|------|---------|
| `src/config/themes.ts` | Theme definitions (enable/disable, metadata) |
| `src/config/themeRegistry.ts` | **File manifest per theme** — every file that belongs to a theme |
| `src/config/themePresets.ts` | Section order per theme landing page |
| `src/config/sectionRegistry.ts` | Section type definitions (SectionKey, LayoutKey, PageKey) |
| `src/config/locales.ts` | Locale definitions (7 languages) |
| `src/config/palettes.ts` | Color palette definitions (10 palettes) |
| `src/config/navigation.ts` | Nav structure & icons |
| `src/config/docs.ts` | Docs versioning, categories, metadata |
| `src/config/providers/active-provider.ts` | Active deployment provider |

### Theme File Locations

```
src/components/sections/themes/{theme}.ts    # Barrel file (re-exports all sections)
src/components/sections/{section}/{Section}{Theme}.astro
src/styles/components/{section}/{Section}{Theme}.css
src/components/layout/header/Header{Theme}.astro
src/components/sections/footer/Footer{Theme}.astro
src/components/ui/{theme}/                   # Theme-specific UI primitives
src/styles/tokens/{theme}.css                # Design tokens
```

### i18n System

7 locales: **en** (default), **ru**, **fr**, **es**, **ja**, **zh**, **kk**

- Translation files: `src/locales/{locale}/*.json` (one JSON per section)
- Translation utility: `useTranslations(locale)` from `src/utils/i18n.ts`
- Access pattern: `t('hero.title')`, `t('features.home.list.0.title')`
- Default locale has no URL prefix; others use `/{locale}/...`

### Content Collections

- **Blog**: `src/content/blog/{locale}/*.md` — Frontmatter: title, date, author, description, tags
- **Docs**: `src/content/docs/{locale}/{section}/*.mdx` — Frontmatter: title, description, order, category, tags

### Routing

- `/` — Home page (index.astro)
- `/{theme}` — Theme landing page (e.g., `/liquid`, `/glass`)
- `/{theme}/portfolio` — Portfolio page per theme
- `/blog/` — Blog listing
- `/blog/{slug}` — Blog post
- `/docs/` — Docs index
- `/docs/{section}/{page}` — Docs page
- `/{locale}/...` — Localized variants of all above

### Deployment Providers

Active provider is set in `src/config/providers/active-provider.ts`.
Available: `cloudflare.config.ts`, `vercel.config.ts`, `netlify.config.ts`.

## Common Recipes

### Keep Only One Theme

1. In `src/config/themes.ts`, set `enabled: false` on all themes except the one you want
2. Use `src/config/themeRegistry.ts` to find all files belonging to disabled themes
3. Delete those files (sections, CSS, headers, footers, UI primitives, scripts, tokens)
4. Remove disabled theme barrel files from `src/components/sections/themes/`
5. Remove disabled theme presets from `src/config/themePresets.ts`
6. Run `pnpm check` to verify nothing broke

### Mix Sections From Different Themes

1. Create `src/components/sections/themes/custom.ts` barrel file
2. Import specific sections: `export { default as Hero } from '../hero/HeroLiquid.astro'`
3. Mix freely: `export { default as Pricing } from '../pricing/PricingGlass.astro'`
4. Add 'custom' theme to `src/config/themes.ts` and `src/config/themePresets.ts`
5. Include CSS files for each section you picked (check `themeRegistry.ts`)

### Add a New Locale

1. Add entry to `localesConfig` array in `src/config/locales.ts`
2. Create translation JSON files in `src/locales/{code}/` (copy from `en/`)
3. Create blog content in `src/content/blog/{code}/`
4. Create docs content in `src/content/docs/{code}/` (mirror `en/` structure)
5. Add sidebar labels in `src/utils/docs-nav.ts` `SIDEBAR_LABELS`

### Switch Deployment Provider

1. Install the adapter: `pnpm add @astrojs/vercel` or `pnpm add @astrojs/netlify`
2. In `src/config/providers/active-provider.ts`, change the import path
3. Update `astro.config.mjs` if the adapter has specific requirements
4. Use the matching deploy script: `pnpm deploy:vercel` or `pnpm deploy:netlify`

### Add a New Section Type

1. Add the key to `SectionKey` in `src/config/sectionRegistry.ts`
2. Create `{Section}{Theme}.astro` component for each theme
3. Create matching CSS file in `src/styles/components/{section}/`
4. Export from each theme barrel file in `src/components/sections/themes/`
5. Add to `landingSections[]` in `src/config/themePresets.ts`
6. Update `themeRegistry.ts` manifests

### Add a New Form with Validation

1. Create a Valibot schema in `src/lib/schemas/` (see `contact.ts` for pattern)
2. Use `pipe()`, `string()`, `email()`, `minLength()`, `maxLength()` from valibot
3. Wire up client-side validation using `validateSingleField()` and `validateForm()` from `src/utils/form-validation.ts`
4. The schema supports localized error messages via the `t` translation function

## File Structure Quick Map

```
src/
├── assets/              # Static assets (images, favicon)
├── components/
│   ├── sections/        # Theme-specific section components
│   │   ├── themes/      # Barrel files per theme
│   │   ├── hero/        # Hero variants (one per theme)
│   │   ├── about/       # About variants
│   │   ├── features/    # Features variants
│   │   ├── portfolio/   # Portfolio variants
│   │   ├── pricing/     # Pricing variants
│   │   ├── testimonial/ # Testimonial variants
│   │   ├── faq/         # FAQ variants
│   │   ├── cta/         # CTA variants
│   │   ├── contact/     # Contact variants
│   │   ├── footer/      # Footer variants
│   │   ├── landing/     # Home page sections (StatsStrip, TemplateShowcase, etc.)
│   │   └── pages/       # Standalone page components
│   ├── layout/header/   # Header variants per theme
│   ├── ui/              # Shared UI primitives (button, card, badge, tabs, etc.)
│   └── mdx/             # MDX components (Callout, Steps, CodeTabs, etc.)
├── config/              # All configuration (themes, locales, palettes, providers)
├── content/             # Content collections (blog, docs) per locale
├── layouts/             # BaseLayout.astro
├── lib/                 # Utility libraries (schemas, search, cn utility)
├── locales/             # Translation JSON files per locale
├── pages/               # Astro page routes
├── styles/              # Global CSS, tokens, palettes, component CSS
├── types/               # TypeScript type declarations
└── utils/               # Utility functions (i18n, animations, form validation)
```

## Important Notes

- **Valibot, not Zod**: This project uses Valibot for form validation. Do not introduce Zod.
- **CSS custom properties**: Theme switching uses `data-theme` attribute on `<html>` + CSS custom properties
- **Static output**: Build output is static (SSG), not SSR
- **Astro islands**: React components use `client:only` or `client:load` directives for interactivity
- **No test suite**: The project does not have unit tests. Use `pnpm check` and `pnpm lint` for validation.
- **Theme registry is the source of truth**: When pruning themes, always consult `themeRegistry.ts` for the complete file list
