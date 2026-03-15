# Mix Theme Sections

Create a custom hybrid theme by cherry-picking sections from different existing themes.

## Instructions

1. Read `src/config/themes.ts` to show the user all available themes
2. Read `src/config/sectionRegistry.ts` to show all section types
3. Ask the user which section they want from which theme. Example:
   - Hero → Liquid
   - About → Glass
   - Features → Aurora
   - Pricing → Neo
   - (etc.)
   - Also ask for Header and Footer theme preference

4. Create the custom barrel file `src/components/sections/themes/custom.ts`:
   ```typescript
   // Custom hybrid theme — mixed from multiple themes
   export { default as Header } from '../../layout/header/HeaderLiquid.astro';
   export { default as Footer } from '../footer/FooterGlass.astro';
   export { default as Hero } from '../hero/HeroLiquid.astro';
   export { default as About } from '../about/AboutGlass.astro';
   // ... etc for each section
   export { default as PortfolioPage } from '../../pages/portfolio/PortfolioPageLiquid.astro';
   ```

5. Add the custom theme to `src/config/themes.ts`:
   ```typescript
   {
     id: 'custom',
     name: 'Custom',
     color: 'from-indigo-500 to-violet-400',
     icon: '🎨',
     sections: ['Header', 'Hero', 'About', ...],
     enabled: true,
     premium: false,
     description: 'Custom hybrid theme',
   }
   ```

6. Add the preset to `src/config/themePresets.ts` with the desired section order

7. Add the manifest to `src/config/themeRegistry.ts` listing ONLY the files actually used by the custom mix

8. Collect all required CSS files from each source theme's manifest in `themeRegistry.ts`:
   - For each section picked from theme X, include that section's CSS from theme X's manifest
   - Verify all CSS files are imported (check `global.css` or component-level imports)

9. Check if any theme-specific UI primitives are needed:
   - Luxury sections may need `src/components/ui/luxury/` components
   - Glass sections may need `src/components/ui/glass/` components
   - Liquid sections may need `src/components/ui/liquid/` components

10. Check if any theme-specific scripts are needed (e.g., `luxury-interactions.js`)

11. Run `pnpm check` to verify the build

## Important

- Each section component is self-contained — mixing is safe as long as you include the right CSS
- The barrel file pattern (`export { default as Hero } from '...'`) is what the page renderer uses
- PortfolioPage must also be specified (pick from any theme)
- Design tokens (`src/styles/tokens/`) may affect appearance — consider which theme's tokens to use
