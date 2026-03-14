#!/usr/bin/env node
/**
 * Non-interactive AstroGlass configurator for CI/CD.
 *
 * Usage:
 *   node scripts/configure-ci.mjs --theme liquid --locales en,fr --palettes azure,neonoir
 *
 * All three flags are required.
 */
import { pruneThemes, ALL_THEMES } from './lib/prune-themes.mjs';
import { pruneLocales, ALL_LOCALES } from './lib/prune-locales.mjs';
import { prunePalettes, ALL_PALETTES } from './lib/prune-palettes.mjs';
import {
  removeThemeSwitcher,
  removeLanguageSwitcher,
  cleanupSharedSwitcherCSS,
} from './lib/remove-switcher.mjs';

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--theme' && args[i + 1]) {
      opts.theme = args[++i];
    } else if (args[i] === '--locales' && args[i + 1]) {
      opts.locales = args[++i]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (args[i] === '--palettes' && args[i + 1]) {
      opts.palettes = args[++i]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return opts;
}

async function main() {
  const { theme, locales, palettes } = parseArgs();

  // Validate
  if (!theme || !locales?.length || !palettes?.length) {
    console.error(
      'Usage: node scripts/configure-ci.mjs --theme <theme> --locales <a,b> --palettes <a,b>',
    );
    process.exit(1);
  }

  if (!ALL_THEMES.includes(theme)) {
    console.error(`Invalid theme "${theme}". Valid: ${ALL_THEMES.join(', ')}`);
    process.exit(1);
  }

  for (const l of locales) {
    if (!ALL_LOCALES.includes(l)) {
      console.error(`Invalid locale "${l}". Valid: ${ALL_LOCALES.join(', ')}`);
      process.exit(1);
    }
  }

  for (const p of palettes) {
    if (!ALL_PALETTES.includes(p)) {
      console.error(`Invalid palette "${p}". Valid: ${ALL_PALETTES.join(', ')}`);
      process.exit(1);
    }
  }

  console.log(
    `Configuring: theme=${theme} locales=${locales.join(',')} palettes=${palettes.join(',')}`,
  );

  // Prune themes
  process.stdout.write('  Pruning themes... ');
  const themeResult = await pruneThemes(theme);
  console.log(`done (${themeResult.deletedFiles} files removed)`);

  // Prune locales
  process.stdout.write('  Pruning locales... ');
  const localeResult = await pruneLocales(locales);
  console.log(`done (${localeResult.deletedDirs} directories removed)`);

  // Prune palettes
  process.stdout.write('  Pruning palettes... ');
  const paletteResult = await prunePalettes(palettes);
  console.log(`done (${paletteResult.deletedFiles} files removed)`);

  // Remove switchers if applicable
  if (palettes.length === 1) {
    process.stdout.write('  Removing palette switcher... ');
    const r = await removeThemeSwitcher();
    console.log(`done (${r.modifiedFiles} headers updated)`);
  }

  if (locales.length === 1) {
    process.stdout.write('  Removing language switcher... ');
    const r = await removeLanguageSwitcher();
    console.log(`done (${r.modifiedFiles} headers updated)`);
  }

  if (palettes.length === 1 && locales.length === 1) {
    await cleanupSharedSwitcherCSS();
  }

  console.log('Configuration complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
