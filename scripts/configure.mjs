#!/usr/bin/env node
/**
 * AstroGlass Configuration CLI
 *
 * Interactive tool to configure the project:
 * - Pick a single theme
 * - Pick languages (1 to all)
 * - Pick color palettes (1 to all)
 *
 * Prunes all unused code and updates config files accordingly.
 * Intended to be run ONCE on a fresh clone.
 */
import { select, checkbox, confirm } from '@inquirer/prompts';
import { pruneThemes, ALL_THEMES } from './lib/prune-themes.mjs';
import { pruneLocales, ALL_LOCALES } from './lib/prune-locales.mjs';
import { prunePalettes, ALL_PALETTES } from './lib/prune-palettes.mjs';
import {
  removeThemeSwitcher,
  removeLanguageSwitcher,
  cleanupSharedSwitcherCSS,
} from './lib/remove-switcher.mjs';

// ─── Theme metadata ──────────────────────────────────────────
const themeChoices = [
  {
    name: 'Liquid   \u{1F4A7}  \u2014 Fluid, organic design with smooth animations',
    value: 'liquid',
  },
  { name: 'Glass    \u{1F52E}  \u2014 Glassmorphism with depth and transparency', value: 'glass' },
  { name: 'Neo      \u26A1  \u2014 Bold, energetic design with dynamic elements', value: 'neo' },
  { name: 'Luxury   \u2728  \u2014 Premium, sophisticated aesthetic', value: 'luxury' },
  {
    name: 'Minimal  \u25CB   \u2014 Clean, focused design with essential elements',
    value: 'minimal',
  },
  { name: 'Aurora   \u{1F30C}  \u2014 Immersive, gradient-mesh-rich design', value: 'aurora' },
];

// ─── Locale metadata ─────────────────────────────────────────
const localeChoices = [
  { name: 'English   \u{1F1EC}\u{1F1E7}', value: 'en', checked: true },
  { name: 'Russian   \u{1F1F7}\u{1F1FA}', value: 'ru' },
  { name: 'French    \u{1F1EB}\u{1F1F7}', value: 'fr' },
  { name: 'Spanish   \u{1F1EA}\u{1F1F8}', value: 'es' },
  { name: 'Japanese  \u{1F1EF}\u{1F1F5}', value: 'ja' },
  { name: 'Chinese   \u{1F1E8}\u{1F1F3}', value: 'zh' },
  { name: 'Kazakh    \u{1F1F0}\u{1F1FF}', value: 'kk' },
];

// ─── Palette metadata ────────────────────────────────────────
const paletteChoices = [
  // Light
  { name: '\u2600\uFE0F  Azure       (light, blue)', value: 'azure', checked: true },
  { name: '\u2744\uFE0F  Nordic      (light, cool)', value: 'nordic' },
  { name: '\u{1F305}  Solaris     (light, warm)', value: 'solaris' },
  // Dark
  { name: '\u{1F319}  Abyss       (dark, indigo)', value: 'abyss' },
  { name: '\u{1F303}  Neonoir     (dark, pink)', value: 'neonoir' },
  { name: '\u{1F3A7}  Synthwave   (dark, purple)', value: 'synthwave' },
  // Colorful
  { name: '\u{1F332}  Evergreen   (green)', value: 'evergreen' },
  { name: '\u{1F338}  Rose        (pink)', value: 'rose' },
  { name: '\u{1F30A}  Aquatica    (teal)', value: 'aquatica' },
  { name: '\u25FB\uFE0F  Monochrome  (gray)', value: 'monochrome' },
];

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log('\n  AstroGlass Configurator\n');

  // 1. Pick theme
  const selectedTheme = await select({
    message: 'Which theme? (pick one)',
    choices: themeChoices,
  });

  // 2. Pick languages
  const selectedLocales = await checkbox({
    message: 'Which languages? (space to toggle, enter to confirm)',
    choices: localeChoices,
    required: true,
    validate(selected) {
      if (selected.length === 0) return 'Select at least one language.';
      return true;
    },
  });

  // 3. Pick palettes
  const selectedPalettes = await checkbox({
    message: 'Which color palettes? (space to toggle, enter to confirm)',
    choices: paletteChoices,
    required: true,
    validate(selected) {
      if (selected.length === 0) return 'Select at least one palette.';
      return true;
    },
  });

  // ─── Summary ─────────────────────────────────────────────
  const themesRemoved = ALL_THEMES.length - 1;
  const localesRemoved = ALL_LOCALES.length - selectedLocales.length;
  const palettesRemoved = ALL_PALETTES.length - selectedPalettes.length;

  console.log('\n  Summary:');
  console.log(`    Theme:    ${selectedTheme}`);
  console.log(`    Languages: ${selectedLocales.join(', ')} (${selectedLocales.length})`);
  console.log(`    Palettes:  ${selectedPalettes.join(', ')} (${selectedPalettes.length})`);

  if (selectedLocales.length === 1) {
    console.log('    -> Language switcher will be REMOVED from navbar');
  }
  if (selectedPalettes.length === 1) {
    console.log('    -> Palette switcher will be REMOVED from navbar');
  }

  console.log(
    `\n    Will prune: ${themesRemoved} themes, ${localesRemoved} locales, ${palettesRemoved} palettes`,
  );

  // ─── Confirm ─────────────────────────────────────────────
  const proceed = await confirm({
    message: 'Proceed? This will permanently delete unused files.',
    default: false,
  });

  if (!proceed) {
    console.log('\n  Aborted.\n');
    process.exit(0);
  }

  // ─── Execute ─────────────────────────────────────────────
  console.log('');

  // Prune themes
  process.stdout.write('  Pruning themes... ');
  const themeResult = await pruneThemes(selectedTheme);
  console.log(`done (${themeResult.deletedFiles} files removed)`);

  // Prune locales
  process.stdout.write('  Pruning locales... ');
  const localeResult = await pruneLocales(selectedLocales);
  console.log(`done (${localeResult.deletedDirs} directories removed)`);

  // Prune palettes
  process.stdout.write('  Pruning palettes... ');
  const paletteResult = await prunePalettes(selectedPalettes);
  console.log(`done (${paletteResult.deletedFiles} files removed)`);

  // Remove switchers if applicable
  if (selectedPalettes.length === 1) {
    process.stdout.write('  Removing palette switcher... ');
    const r = await removeThemeSwitcher();
    console.log(`done (${r.modifiedFiles} headers updated)`);
  }

  if (selectedLocales.length === 1) {
    process.stdout.write('  Removing language switcher... ');
    const r = await removeLanguageSwitcher();
    console.log(`done (${r.modifiedFiles} headers updated)`);
  }

  // Clean up shared CSS if both switchers removed
  if (selectedPalettes.length === 1 && selectedLocales.length === 1) {
    await cleanupSharedSwitcherCSS();
  }

  console.log('\n  Configuration complete!');
  console.log('  Run `pnpm dev` to start developing.\n');
}

main().catch((err) => {
  if (err.name === 'ExitPromptError') {
    // User pressed Ctrl+C
    console.log('\n  Aborted.\n');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
