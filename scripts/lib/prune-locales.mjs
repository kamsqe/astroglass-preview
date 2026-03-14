/**
 * Locale pruning — deletes content/translations for unselected locales.
 */
import { safeRemove, readFile, writeFile } from './utils.mjs';

/** All locale codes available in the project */
export const ALL_LOCALES = ['en', 'ru', 'fr', 'es', 'ja', 'zh', 'kk'];

/**
 * Prune unselected locales from the project.
 * @param {string[]} selectedLocales - Locale codes to keep
 * @returns {{ deletedDirs: number }} Summary
 */
export async function pruneLocales(selectedLocales) {
  const localesToRemove = ALL_LOCALES.filter((l) => !selectedLocales.includes(l));
  let deletedDirs = 0;

  // 1. Delete locale directories
  for (const locale of localesToRemove) {
    // Translation JSON files
    if (await safeRemove(`src/locales/${locale}`)) deletedDirs++;
    // Blog content
    if (await safeRemove(`src/content/blog/${locale}`)) deletedDirs++;
    // Docs content
    if (await safeRemove(`src/content/docs/${locale}`)) deletedDirs++;
    // Search indexes
    await safeRemove(`public/search/${locale}.json`);
  }

  // 2. Update src/config/locales.ts — remove unselected locale entries
  let localesConfig = await readFile('src/config/locales.ts');
  if (localesConfig) {
    for (const locale of localesToRemove) {
      // Remove the full object literal block for this locale.
      // Use [^}]* (not [\s\S]*?) to avoid matching across multiple blocks.
      const blockRegex = new RegExp(`\\s*\\{[^}]*code:\\s*'${locale}'[^}]*\\},?`, '');
      localesConfig = localesConfig.replace(blockRegex, '');
    }

    // Update defaultLocale if the current default was removed
    const currentDefault = localesConfig.match(/export const defaultLocale = '([^']+)'/)?.[1];
    if (currentDefault && !selectedLocales.includes(currentDefault)) {
      localesConfig = localesConfig.replace(
        /export const defaultLocale = '[^']+'/,
        `export const defaultLocale = '${selectedLocales[0]}'`,
      );
    }

    await writeFile('src/config/locales.ts', localesConfig);
  }

  return { deletedDirs };
}
