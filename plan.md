# CLI Configuration Tool — Implementation Plan

## Overview

A Node.js interactive CLI (`scripts/configure.mjs`) that lets users pick one theme, their languages, and their color palettes — then surgically prunes all unused code from the project.

## User Flow

```
$ pnpm run configure

  AstroGlass Configurator

? Which theme? (pick one)
  > Liquid  💧  — Fluid, organic design
    Glass   🔮  — Glassmorphism with depth
    Neo     ⚡  — Bold, energetic design
    Luxury  ✨  — Premium, sophisticated
    Minimal ○   — Clean, focused design
    Aurora  🌌  — Immersive gradient-mesh

? Which languages? (pick 1 or more, space to toggle)
  > [x] English  🇬🇧
    [ ] Russian  🇷🇺
    [ ] French   🇫🇷
    ...

? Which color palettes? (pick 1 or more, space to toggle)
  Light:
  > [x] Azure   ☀️
    [ ] Nordic   ❄️
    [ ] Solaris  🌅
  Dark:
    [x] Abyss    🌙
    ...

✓ Theme: Liquid
✓ Languages: English, Russian (2)
✓ Palettes: Azure, Abyss (2)

? Proceed? This will delete unused files. (y/n)

Pruning 5 themes... ✓ (removed 127 files)
Pruning 5 locales... ✓ (removed 85 dirs)
Pruning 8 palettes... ✓ (removed 8 CSS files)
Updating configs... ✓
Removing language switcher... skipped (2 languages)
Removing palette switcher... skipped (2 palettes)

Done! Run `pnpm dev` to start.
```

## Dependencies

Use `@inquirer/prompts` (modern, ESM-native, small) for interactive prompts:

- `select` — single theme choice
- `checkbox` — multi-select for languages and palettes
- `confirm` — final confirmation

Add to devDependencies: `@inquirer/prompts`

## Implementation Steps

### Step 1: Create `scripts/configure.mjs`

Entry point with three prompt stages + confirmation + execution.

### Step 2: Theme Pruning

**What to delete** (for each unselected theme):

- All files from `themeRegistry[theme]` (barrel, sections, CSS, headers, footers, UI, scripts, tokens)
- Portfolio page: `src/pages/[...lang]/[theme]/portfolio.astro` (if theme-specific)
- Theme card background images in `src/assets/` (e.g., `LiquidCardBg.png`)

**What to update:**

- `src/config/themes.ts` — remove unselected theme entries from the `themes` array
- `src/config/themePresets.ts` — remove unselected theme presets
- `src/config/themeRegistry.ts` — remove unselected theme manifests
- `src/config/navigation.ts` — remove unselected themes from `themeIcons` and dropdown items
- `src/pages/[...lang]/[theme].astro` — remove unused `import * as XSections` lines
- `src/pages/[...lang]/index.astro` — keep as-is (home page showcases the chosen theme)

**Strategy:** Read the themeRegistry at runtime to get file lists. Use `fs.rm()` for deletions. Use string manipulation on config files (find the array entries, filter them).

### Step 3: Locale Pruning

**What to delete** (for each unselected locale):

- `src/locales/{code}/` — entire translation directory
- `src/content/blog/{code}/` — blog content for that locale
- `src/content/docs/{code}/` — docs content for that locale
- `public/search/{code}.json` — search index for that locale

**What to update:**

- `src/config/locales.ts` — set `enabled: false` on unselected locales (or remove entries entirely)

**If only 1 locale selected → remove LanguageSwitcher:**

- Delete `src/components/ui/LanguageSwitcher.astro`
- Delete `src/styles/_lang-switcher.css`
- Remove `<LanguageSwitcher>` usage from all header components (grep for `LanguageSwitcher`)
- Remove the `@import` for `_lang-switcher.css` from `global.css`
- Simplify URL routing (no `[...lang]` prefix needed, but this is complex — easier to just keep the default locale routing)

### Step 4: Palette Pruning

**What to delete** (for each unselected palette):

- `src/styles/palettes/{id}.css` — palette CSS file

**What to update:**

- `src/styles/_themes.css` — remove `@import` lines for unselected palettes
- `src/config/palettes.ts` — remove unselected palette entries from the `palettes` array
- Expressive code config in `astro.config.mjs` — update `themeCssSelector` to only reference selected palette data-theme attributes

**If only 1 palette selected → remove ThemeSwitcher:**

- Delete `src/components/ui/ThemeSwitcher.astro`
- Delete `src/styles/_theme-switcher.css`
- Remove `<ThemeSwitcher>` usage from all header components (grep for `ThemeSwitcher`)
- Remove the `@import` for `_theme-switcher.css` from `global.css`
- Set the single palette as default in `<html data-theme="...">` in BaseLayout

**If 2-10 palettes selected → resize ThemeSwitcher popup:**

- Update ThemeSwitcher.astro: if a category has 0 palettes, hide that category section
- If total palettes <= 4: use a single-row compact layout instead of categorized grid
- Adjust the desktop dropdown max-width based on palette count

### Step 5: Config File Updates (shared)

Files that always need updating regardless of choices:

- `src/config/themes.ts` — filter to selected theme only
- `src/config/locales.ts` — filter to selected locales
- `src/config/palettes.ts` — filter to selected palettes
- `src/config/themeRegistry.ts` — keep only selected theme
- `src/styles/_themes.css` — keep only selected palette imports
- `astro.config.mjs` — update expressive-code theme selectors

### Step 6: Post-Pruning

After all deletions and config updates:

1. Run `pnpm run build` to verify nothing is broken
2. Print summary of changes

## File Structure

```
scripts/
  configure.mjs          ← Main CLI entry point
  lib/
    prompts.mjs          ← Interactive prompt logic
    prune-themes.mjs     ← Theme file deletion + config updates
    prune-locales.mjs    ← Locale file deletion + config updates
    prune-palettes.mjs   ← Palette file deletion + config updates
    update-configs.mjs   ← Shared config file transformations
    remove-switcher.mjs  ← Remove language/palette switcher from headers
    utils.mjs            ← Shared utilities (safe delete, config rewriting)
```

## Key Design Decisions

1. **Config-driven pruning**: Read `themeRegistry.ts`, `themes.ts`, `locales.ts`, `palettes.ts` at runtime to discover what to delete — don't hardcode file paths in the CLI.

2. **String-based config rewriting**: For `.ts` config files, use regex/string replacement rather than AST parsing. The config files have predictable, well-structured formats. For example, to remove a theme from `themes.ts`, find the object literal with `id: 'glass'` and remove it.

3. **Switcher removal via grep**: Find all files containing `LanguageSwitcher` or `ThemeSwitcher` imports/usage via glob+grep, then remove those lines. The header components follow consistent patterns.

4. **Destructive by design**: The CLI is meant to be run once on a fresh clone. It permanently deletes files. The confirmation prompt makes this clear.

5. **Blog + Docs always kept**: The pruning logic never touches blog/docs structure — only prunes locale-specific content subdirectories for unselected languages.

## npm script

Add to `package.json`:

```json
"configure": "node scripts/configure.mjs"
```

## Edge Cases

- **Default locale handling**: English (`en`) should always remain as the default locale if selected. If the user doesn't select English, the first selected locale becomes the default.
- **Single theme simplification**: When only 1 theme is selected, the home page (`index.astro`) could redirect to the theme page directly, or the theme page becomes the index. For v1, keep the home page as-is since it serves as a landing/showcase.
- **Palette default**: If the user's selected palettes don't include `azure` (the current default), the first selected palette becomes the new default.
