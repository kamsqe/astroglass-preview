<div align="center">

  <a href="https://astroglass-preview.pages.dev">
    <img src="public/favicon.svg" width="100" alt="AstroGlass Logo" />
  </a>

  <h1>AstroGlass</h1>

  <p>
    Multi-theme Astro template with 6 design systems, 10 palettes, 7 locales,<br/>
    and a CLI to scaffold exactly what you need.
  </p>

  <p>
    <a href="https://github.com/kamsqee/astroglass-preview/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
    <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro_5.0-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Built with Astro" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js_%3E%3D_20-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node.js >= 20" /></a>
  </p>

  <p>
    <a href="https://astroglass-preview.pages.dev"><strong>View Live Demo</strong></a> ·
    <a href="#quick-start"><strong>Quick Start</strong></a> ·
    <a href="#features"><strong>Explore Features</strong></a>
  </p>

</div>

<!-- TODO: Replace with actual hero screenshot showing 2-3 themes side by side -->
<!-- Example: a wide composite image showing Liquid, Glass, and Luxury themes at desktop width -->
> **[Screenshot placeholder]** — Hero image: composite showing the Liquid (fluid/organic), Glass (glassmorphism), and Luxury (editorial) themes at 1440px, demonstrating the visual range across design systems.

---

## Why AstroGlass?

Most Astro templates give you one design. AstroGlass gives you **six independent design systems** that share a common architecture — same components, same i18n, same routing — just different visual language.

- **6 themes** — Liquid, Glass, Neo, Minimal, Luxury, Aurora. Each has a full section set (hero → footer).
- **10 color palettes** — Hot-swap between light, dark, and colorful palettes at runtime. CSS-only, no JS.
- **7 languages** — English, Russian, French, Spanish, Japanese, Chinese, Kazakh. Add more in minutes.
- **CLI scaffolding** — Ship only the themes, palettes, and features you need. No manual pruning.

---

## Themes

| Theme | Style | Sections |
|-------|-------|----------|
| 💧 **Liquid** | Fluid motion, organic shapes | Hero, About, Features, Portfolio, Pricing, Testimonials, FAQ, CTA, Contact, Footer |
| 🔮 **Glass** | Glassmorphism, frosted layers, depth | ↑ same 10 sections |
| ⚡ **Neo** | Bold brutalist, high energy | ↑ |
| ○ **Minimal** | Clean typography, whitespace | ↑ |
| ✨ **Luxury** | Editorial, sophisticated animations | ↑ |
| 🌌 **Aurora** | Cosmic gradients, geometric | ↑ |

Every theme includes a dedicated header, all 10 landing sections, and a footer. Themes are fully independent — include one or all six.

<!-- TODO: Replace with actual theme screenshots — 2x3 grid showing each theme's hero section -->
> **[Screenshot placeholder]** — 2×3 grid: each theme's hero section at 1280px width, showing Liquid (top-left) through Aurora (bottom-right).

---

## Quick Start

### Via CLI (recommended)

```bash
npm create astroglass@latest ./my-site
cd my-site
pnpm install
pnpm dev
```

The CLI walks you through theme, palette, locale, and feature selection interactively.

### Non-interactive

```bash
npm create astroglass@latest ./my-site -- \
  --theme liquid \
  --palettes azure,abyss \
  --deploy cloudflare \
  --yes
```

### Manual setup

<details>
<summary>Clone without the CLI</summary>

```bash
npx degit kamsqee/astroglass-preview my-site
cd my-site
pnpm install
pnpm dev
```

This gives you the full template with all themes, palettes, and locales. Remove what you don't need manually.

</details>

Open [http://localhost:4321](http://localhost:4321) to see your site.

---

## Features

| Feature | Description |
|---------|-------------|
| 🎨 **Multi-theme** | 6 design systems sharing a common component architecture |
| 🎭 **10 Palettes** | CSS-only color switching — Azure, Solaris, Evergreen, Rosé, Monochrome, Nordic, Aquatica, Abyss, NeoNoir, Synthwave |
| 🌍 **i18n** | 7 languages with URL-based routing (`/en/docs`, `/ru/docs`) and locale auto-detection |
| 📝 **Blog** | MDX-powered blog with RSS feed support |
| 📚 **Docs** | Documentation pages with Fuse.js full-text search, `Cmd+K` command palette |
| 📊 **Dashboard** | Analytics demo with Recharts (React island) |
| 🔍 **Search** | Client-side fuzzy search built on [Fuse.js](https://fusejs.io) — build-time indexing, match highlighting, "Did you mean?" |
| 🚀 **Deploy** | One-file provider switch — Cloudflare Pages, Vercel, Netlify, or static |

---

## CLI Reference

After scaffolding, you can manage your project with `astroglass` subcommands:

```bash
# Check what's installed
npx astroglass status --validate

# Add components
npx astroglass add --theme luxury
npx astroglass add --palette synthwave
npx astroglass add --lang fr
npx astroglass add --feature docs

# Remove components (with safety checks)
npx astroglass remove --theme neo
npx astroglass remove --palette rose

# Fix config/filesystem mismatches
npx astroglass repair
```

All `add`/`remove` commands update `astroglass.config.json` and auto-commit if you're in a git repo.

---

## Project Structure

```
src/
├── components/
│   ├── sections/themes/     # Barrel files per theme (liquid.ts, glass.ts, ...)
│   ├── sections/hero/       # HeroLiquid.astro, HeroGlass.astro, ...
│   ├── sections/[section]/  # about, features, portfolio, pricing, ...
│   ├── ui/                  # Shared primitives (button, card, tabs)
│   └── layout/header/       # Per-theme headers
├── config/
│   ├── themes.ts            # Theme definitions
│   ├── palettes.ts          # Palette registry
│   ├── locales.ts           # Locale config
│   ├── navigation.ts        # Nav builder
│   └── providers/           # Deploy target configs
├── content/                 # MDX collections (docs, blog)
├── locales/                 # Translation JSON per locale
├── pages/
│   └── [...lang]/[theme].astro  # Dynamic theme/locale routing
├── styles/
│   ├── palettes/            # Per-palette CSS (azure.css, abyss.css, ...)
│   ├── tokens/              # Per-theme design tokens
│   └── components/          # Per-section CSS
└── utils/                   # i18n, animations, form validation
```

---

## Customization

### Themes

Each theme is a self-contained set of section components. To add a new theme:

1. Create section components in `src/components/sections/[section]/[Theme].astro`
2. Create a barrel file at `src/components/sections/themes/[theme].ts`
3. Register it in `src/config/themes.ts` and `src/config/themePresets.ts`

Or use the CLI: `npx astroglass add --theme [id]`

### Palettes

Palettes are pure CSS — a single file in `src/styles/palettes/` defining color variables under a `[data-palette="name"]` selector. Add a new `.css` file and import it in `_themes.css`.

### Reorder / Disable Sections

Edit `src/config/themePresets.ts` — the `landingSections[]` array controls section order for each theme.

### Switch Deploy Target

```bash
npx astroglass add --deploy vercel
```

Or manually change the import in `src/config/providers/active-provider.ts`.

---

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Production build to `./dist/` |
| `pnpm preview` | Preview production build |
| `pnpm check` | Astro type checking |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Islands | [React 19](https://react.dev) |
| Search | [Fuse.js](https://fusejs.io) |
| Code Blocks | [Expressive Code](https://expressive-code.com) |
| Validation | [Valibot](https://valibot.dev) |
| Animations | [Framer Motion](https://motion.dev) |
| CLI | [citty](https://github.com/unjs/citty) + [@clack/prompts](https://github.com/natemoo-re/clack) |

---

## Contributing

Contributions are welcome — whether it's bug fixes, new themes, palette ideas, or documentation improvements. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and the PR process.

> **Note on translations:** Most non-English localizations (Russian, French, Spanish, Japanese, Chinese, Kazakh) were generated with AI and may contain inaccuracies. Native speaker corrections are especially appreciated — even fixing a single string helps.

## License

[MIT](LICENSE) © AstroGlass
