/**
 * Palette pruning — deletes CSS files for unselected palettes and updates configs.
 */
import { safeRemove, readFile, writeFile } from './utils.mjs';

/** All palette IDs available in the project */
export const ALL_PALETTES = [
  'azure', 'nordic', 'solaris',       // light
  'abyss', 'neonoir', 'synthwave',    // dark
  'evergreen', 'rose', 'aquatica', 'monochrome', // colorful
];

/** Default palette */
export const DEFAULT_PALETTE = 'azure';

/**
 * Prune unselected palettes from the project.
 * @param {string[]} selectedPalettes - Palette IDs to keep
 * @returns {{ deletedFiles: number }} Summary
 */
export async function prunePalettes(selectedPalettes) {
  const palettesToRemove = ALL_PALETTES.filter(p => !selectedPalettes.includes(p));
  let deletedFiles = 0;

  // 1. Delete palette CSS files
  for (const paletteId of palettesToRemove) {
    if (await safeRemove(`src/styles/palettes/${paletteId}.css`)) deletedFiles++;
  }

  // 2. Update src/styles/_themes.css — remove @import lines for deleted palettes
  let themesCSS = await readFile('src/styles/_themes.css');
  if (themesCSS) {
    for (const paletteId of palettesToRemove) {
      themesCSS = themesCSS.replace(
        new RegExp(`@import\\s+["']\\./palettes/${paletteId}\\.css["'];?\\n?`, 'g'),
        ''
      );
    }
    await writeFile('src/styles/_themes.css', themesCSS);
  }

  // 3. Update src/config/palettes.ts — remove unselected palette entries
  let palettesConfig = await readFile('src/config/palettes.ts');
  if (palettesConfig) {
    for (const paletteId of palettesToRemove) {
      // Remove the single-line palette entry
      palettesConfig = palettesConfig.replace(
        new RegExp(`\\s*\\{[^}]*id:\\s*'${paletteId}'[^}]*\\},?\\n?`, 'g'),
        '\n'
      );
    }

    // Update defaultPalette if the current default was removed
    if (!selectedPalettes.includes(DEFAULT_PALETTE)) {
      palettesConfig = palettesConfig.replace(
        /export const defaultPalette = '[^']+'/,
        `export const defaultPalette = '${selectedPalettes[0]}'`
      );
    }

    await writeFile('src/config/palettes.ts', palettesConfig);
  }

  // 4. Update astro.config.mjs — update expressive-code theme selectors
  let astroConfig = await readFile('astro.config.mjs');
  if (astroConfig) {
    // Build new CSS selectors from selected palettes
    const selectedDark = selectedPalettes.filter(p =>
      ['abyss', 'neonoir', 'synthwave'].includes(p)
    );
    const selectedLight = selectedPalettes.filter(p =>
      !['abyss', 'neonoir', 'synthwave'].includes(p)
    );

    if (selectedDark.length > 0) {
      const darkSelector = selectedDark.map(p => `[data-theme="${p}"]`).join(', ');
      astroConfig = astroConfig.replace(
        /if \(theme\.name === 'dracula'\) \{[\s\S]*?return '[^']*';[\s\S]*?\}/,
        `if (theme.name === 'dracula') {\n          return '${darkSelector}';\n        }`
      );
    }

    if (selectedLight.length > 0) {
      const lightSelector = selectedLight.map(p => `[data-theme="${p}"]`).join(', ');
      astroConfig = astroConfig.replace(
        /\/\/ Light themes[\s\S]*?return '[^']*';/,
        `// Light themes\n        return '${lightSelector}';`
      );
    }

    await writeFile('astro.config.mjs', astroConfig);
  }

  // 5. Update BaseLayout.astro — set the correct default palette
  let baseLayout = await readFile('src/layouts/BaseLayout.astro');
  if (baseLayout) {
    const newDefault = selectedPalettes.includes('azure') ? 'azure' : selectedPalettes[0];
    // Update the activeTheme fallback
    baseLayout = baseLayout.replace(
      /const activeTheme = [^;]+;/,
      `const activeTheme = '${newDefault}';`
    );
    await writeFile('src/layouts/BaseLayout.astro', baseLayout);
  }

  return { deletedFiles };
}
