# Prune Themes

Keep only selected themes and remove all files belonging to the rest.

## Instructions

1. Read `src/config/themes.ts` to list all available themes with their IDs
2. Ask the user which themes they want to **keep** (can be one or more)
3. Read `src/config/themeRegistry.ts` to get the complete file manifest for each theme to remove
4. For each theme being removed, delete ALL files listed in its manifest:
   - Barrel file (`src/components/sections/themes/{theme}.ts`)
   - Section components (`.astro` files)
   - CSS files
   - Header components
   - Footer components
   - UI primitives directory
   - Scripts
   - Design token files
5. Remove the theme entries from `src/config/themes.ts` (delete from the `themes` array)
6. Remove the theme presets from `src/config/themePresets.ts`
7. Remove the theme manifests from `src/config/themeRegistry.ts`
8. Check `src/styles/global.css` and remove any imports referencing deleted CSS files
9. Check `src/pages/[...lang]/index.astro` — if it references theme-specific components, update accordingly
10. Run `pnpm check` to verify the build still passes
11. Report what was removed (file count, themes removed)

## Important

- Always use `themeRegistry.ts` as the source of truth for which files belong to which theme
- The `themeRegistry.ts` lists `npmDeps` per theme — if a removed theme was the only user of an npm package, suggest removing it from `package.json`
- Never delete shared infrastructure (layouts, utils, config files other than theme entries)
- Keep the theme system functional — just with fewer themes
