# Add New Locale

Add a new language to the project with full translation scaffolding.

## Instructions

1. Ask the user for:
   - Language code (ISO 639-1, e.g., `de`, `pt`, `ar`)
   - Language name in English (e.g., "German")
   - Native name (e.g., "Deutsch")
   - Flag emoji (e.g., "🇩🇪")
   - Text direction (`ltr` or `rtl`)

2. Add the locale entry to `src/config/locales.ts` in the `localesConfig` array

3. Create translation JSON files by copying from `src/locales/en/`:
   - Copy every `.json` file from `src/locales/en/` to `src/locales/{code}/`
   - Translate all user-facing string values to the target language
   - Keep JSON keys unchanged — only translate values
   - Keep code references (class names, component paths) unchanged

4. Create blog content:
   - Copy `src/content/blog/en/` to `src/content/blog/{code}/`
   - Translate frontmatter (title, description) and body content

5. Create docs content:
   - Copy entire `src/content/docs/en/` directory structure to `src/content/docs/{code}/`
   - Translate frontmatter (title, description) and body content
   - Keep MDX component imports and code blocks unchanged

6. Add sidebar labels in `src/utils/docs-nav.ts`:
   - Add a `{code}: "..."` entry to every key in `SIDEBAR_LABELS`

7. Run `pnpm check` to verify everything compiles

8. Run `pnpm build` to regenerate search indexes for the new locale

## Important

- The i18n system auto-discovers new locales from `localesConfig` — no routing changes needed
- Translation JSON files use dot-notation keys: `t('hero.title')` maps to `hero.json` → `{ "title": "..." }`
- Keep ALL JSON keys identical across languages — missing keys fall back to showing the key name
- For RTL languages, set `direction: 'rtl'` — the layout system handles RTL automatically
