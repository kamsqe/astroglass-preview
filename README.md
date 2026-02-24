# AstroGlass

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![pnpm >= 8](https://img.shields.io/badge/pnpm-%3E%3D8-orange)

A premium, multi-theme Astro template with 6 design variants, 7 languages (i18n), Fuse.js search, and one-click deployment to Cloudflare, Vercel, or Netlify.

[🔗 Live Demo](https://astroglass-preview.pages.dev)

## ✨ Themes

AstroGlass ships with **6 production-ready themes**, each with a complete set of sections:

| Theme | Style | Type |
|-------|-------|------|
| 💧 **Liquid** | Fluid, organic animations | Free |
| 🔮 **Glass** | Glassmorphism with depth | Free |
| ⚡ **Neo** | Bold, energetic design | Free |
| ○ **Minimal** | Clean, focused aesthetic | Free |
| ✨ **Luxury** | Premium, sophisticated | Premium |
| 🌌 **Aurora** | Gradient-mesh, geometric | Premium |

Every theme includes: Hero, About, Features, Portfolio, Pricing, Testimonials, FAQ, CTA, Contact, Header, and Footer sections.

## 🚀 Quick Start

```bash
# Clone the repo
npx degit kamsqee/astroglass-preview my-site
cd my-site

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) to see your site.

## 🛠️ Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Production build to `./dist/` |
| `pnpm check` | Astro type checking |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm preview` | Preview build locally |

## 📂 Project Structure

```
src/
├── components/         # UI components
│   ├── sections/       # Theme-specific sections (hero, about, pricing, etc.)
│   ├── ui/             # Shared primitives (button, card, tabs)
│   └── layout/         # Headers and structural wrappers
├── config/             # Central config (themes, locales, navigation, providers)
├── content/            # MDX collections (docs, blog)
├── layouts/            # Page layouts
├── lib/                # Utilities (search, schemas, cn())
├── locales/            # i18n translation JSON files (en, ru, fr, es, ja, zh, kk)
├── pages/              # File-based routing
├── styles/             # CSS (global + per-component)
└── utils/              # Helpers (i18n, animations, form validation)
```

## 🎨 Customization

### Adding a Theme

1. Create a barrel file at `src/components/sections/themes/{theme}.ts`
2. Add a preset in `src/config/themePresets.ts`
3. Register the theme in `src/config/themes.ts`
4. Add the module to `themeModules` in `src/pages/[...lang]/[theme].astro`

### Adding a Locale

1. Add an entry to `localesConfig` in `src/config/locales.ts`
2. Create JSON files in `src/locales/{code}/` matching the existing structure
3. The locale will be automatically available throughout the app

### Reordering / Disabling Sections

Edit `src/config/themePresets.ts` — change the `landingSections[]` array for any theme.

### Switching Deployment Provider

Change the import in `src/config/providers/active-provider.ts`:

```typescript
// Cloudflare (default)
export { adapter, output, providerName, buildNotes } from './cloudflare.config';

// Vercel
export { adapter, output, providerName, buildNotes } from './vercel.config';

// Netlify
export { adapter, output, providerName, buildNotes } from './netlify.config';
```

## 🌍 Internationalization

- **UI Strings**: `src/locales/{locale}/*.json` — auto-loaded via Vite glob
- **Content**: `src/content/docs/{locale}/` — MDX collections per locale
- **Routing**: URL-based (`/en/docs`, `/ru/docs`, `/kk/docs`, etc.) with auto-detection

Currently ships with 7 languages: English (`en`), Russian (`ru`), French (`fr`), Spanish (`es`), Japanese (`ja`), Chinese (`zh`), and Kazakh (`kk`). Add more by following the steps above.

## 🔍 Search

Client-side fuzzy search powered by [Fuse.js](https://fusejs.io):

- **Build-time indexing**: `scripts/generate-search-index.mjs` generates per-locale JSON indexes
- **Keyboard shortcuts**: `Cmd+K` / `/` to open, arrow keys to navigate
- **Features**: Recent searches, "Did you mean?" suggestions, match highlighting
- **Customization**: Adjust weights, threshold, and styling in `src/components/docs/CommandPalette.astro`

## 🚢 Deployment

### Cloudflare Pages (default)

```bash
pnpm deploy:cloudflare
```

### Vercel

```bash
pnpm add -D @astrojs/vercel
# Update active-provider.ts to import from vercel.config
pnpm deploy:vercel
```

### Netlify

```bash
pnpm add -D @astrojs/netlify
# Update active-provider.ts to import from netlify.config
pnpm deploy:netlify
```

## 🧱 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Islands | [React 19](https://react.dev) |
| Search | [Fuse.js](https://fusejs.io) |
| Validation | [Valibot](https://valibot.dev) |
| Code Blocks | [Expressive Code](https://expressive-code.com) |
| Animations | [Framer Motion](https://motion.dev) |

### Demo-Only Dependencies

These packages power demo/showcase components and can be safely removed if not needed:

| Package | Used For |
|---------|----------|
| `recharts` | Dashboard demo charts |
| `@xyflow/react` | Flow diagram demo |
| `cmdk` | Command palette search UI |
| `lucide-react` | Icons in React components |

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and the PR process.

## 📄 License

[MIT](LICENSE) © AstroGlass
