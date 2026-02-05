# Liquid Glass Astro Cloudflare Starter

A modern, high-performance starter kit built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and [Fuse.js](https://fusejs.io) for search. Deploys seamlessly to Cloudflare Pages.

## 🚀 Key Features

- **Astro 5.0**: Fast, content-focused static site generation.
- **Tailwind CSS**: Utility-first styling with a custom design system.
- **Internationalization (i18n)**: Native support for English (`en`) and Russian (`ru`).
- **Fuse.js Search**: Client-side fuzzy search with custom indexing, highlighting, and mobile optimization.
- **Responsive UI**: Glassmorphism design, mobile drawer navigation, and polished animations.
- **Cloudflare Ready**: Configured for edge deployment.

## 🛠️ Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally                       |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |

## 🔍 Search Implementation

This project replaces the default Pagefind integration with **Fuse.js** to provide a highly customizable, "premium" feel search experience.

### Architecture

1.  **Indexing**:
    *   The script `scripts/generate-search-index.mjs` runs at build time.
    *   It scans all content (MDX files) and generates locale-specific JSON indexes:
        *   `public/search/en.json`
        *   `public/search/ru.json`

2.  **Frontend (`CommandPalette.astro`)**:
    *   Loads the appropriate JSON index based on the current locale.
    *   Uses **Fuse.js** for fuzzy matching (supports typos).
    *   Features:
        *   **Recent Searches**: Stored in `localStorage`.
        *   **Quick Links**: Instant access to key pages.
        *   **"Did You Mean?"**: Suggests pages if no results are found.
        *   **Keyboard Navigation**: Full support for arrow keys, `Cmd+K`, `/`, `Enter`.
    
3.  **UI/UX**:
    *   **Highlights**: Uses a custom "outline shimmer" animation (non-layout-shifting) for matches.
    *   **Mobile**: Optimized touch targets, swipe-to-close gesture, and clean navigation bar.
    *   **Visuals**: Premium glassmorphism cards with SVG icons.

### Customization

You can adjust the search behavior in `src/components/docs/CommandPalette.astro`:

- **Weights**: Modify the field priorities (Title > Headings > Content).
- **Threshold**: Adjust fuzziness (0.0 = exact match, 1.0 = match anything).
- **Styling**: All styles are scoped and use CSS variables for theming.

## 📂 Project Structure

```text
/
├── public/
│   └── search/        # Generated search indexes
├── scripts/
│   └── generate-search-index.mjs
├── src/
│   ├── components/    # UI Components (Docs, Search, etc.)
│   ├── content/       # Content collections (Docs, Blog)
│   ├── layouts/       # Page layouts
│   ├── locales/       # i18n translation strings
│   ├── pages/         # File-based routing
│   └── utils/         # Helper functions (i18n, navigation)
└── package.json
```

## 🌍 Internationalization

- **Content**: Place localized content in `src/content/docs/{locale}/`.
- **UI Strings**: manage translations in `src/locales/{locale}/*.json`.
- **Routing**: URL-based routing (e.g., `/en/docs`, `/ru/docs`).

## 👀 Want to learn more?

Check out [Astro Documentation](https://docs.astro.build) or [Fuse.js Documentation](https://fusejs.io).
