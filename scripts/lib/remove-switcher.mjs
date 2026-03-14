/**
 * Remove ThemeSwitcher and/or LanguageSwitcher from all header components.
 *
 * When only 1 palette is selected, the ThemeSwitcher is unnecessary.
 * When only 1 locale is selected, the LanguageSwitcher is unnecessary.
 */
import fs from 'fs/promises';
import path from 'path';
import { resolve, readFile, writeFile, safeRemove, removeLinesMatching } from './utils.mjs';

const HEADER_DIR = 'src/components/layout/header';

/**
 * Get all .astro files in the headers directory.
 */
async function getHeaderFiles() {
  const dir = resolve(HEADER_DIR);
  try {
    const entries = await fs.readdir(dir);
    return entries.filter((f) => f.endsWith('.astro')).map((f) => path.join(HEADER_DIR, f));
  } catch {
    return [];
  }
}

/**
 * Remove a component from a .astro file.
 * Removes both the import line and all JSX usages.
 *
 * @param {string} content - File content
 * @param {string} componentName - e.g. 'ThemeSwitcher' or 'LanguageSwitcher'
 * @returns {string} Updated content
 */
function removeComponentUsage(content, componentName) {
  let result = content;

  // Remove import line: import X from '...';
  result = result.replace(
    new RegExp(`\\s*import\\s+${componentName}\\s+from\\s+['\"][^'\"]+['\"];?\\s*\\n`, 'g'),
    '\n',
  );

  // Remove JSX self-closing tags: <ThemeSwitcher ... />
  result = result.replace(new RegExp(`\\s*<${componentName}[^/>]*/>\\s*\\n?`, 'g'), '\n');

  // Remove JSX open+close tags: <ThemeSwitcher ...>...</ThemeSwitcher>
  result = result.replace(
    new RegExp(`\\s*<${componentName}[^>]*>[\\s\\S]*?</${componentName}>\\s*\\n?`, 'g'),
    '\n',
  );

  return result;
}

/**
 * Remove ThemeSwitcher from all headers and delete the component file.
 */
export async function removeThemeSwitcher() {
  const headerFiles = await getHeaderFiles();
  let modifiedFiles = 0;

  for (const file of headerFiles) {
    const content = await readFile(file);
    if (!content || !content.includes('ThemeSwitcher')) continue;

    const updated = removeComponentUsage(content, 'ThemeSwitcher');
    if (updated !== content) {
      await writeFile(file, updated);
      modifiedFiles++;
    }
  }

  // Also remove from DocsLayout if present
  const docsLayout = await readFile('src/components/docs/DocsLayout.astro');
  if (docsLayout && docsLayout.includes('ThemeSwitcher')) {
    await writeFile(
      'src/components/docs/DocsLayout.astro',
      removeComponentUsage(docsLayout, 'ThemeSwitcher'),
    );
  }

  // Delete the component file and CSS
  await safeRemove('src/components/ui/ThemeSwitcher.astro');
  await safeRemove('src/styles/_theme-switcher.css');

  // Remove @import from global.css
  await removeLinesMatching('src/styles/global.css', /_theme-switcher\.css/);

  // Also remove the _switcher-shared.css import if both switchers are removed
  // (handled later — we check after both removals)

  return { modifiedFiles };
}

/**
 * Remove LanguageSwitcher from all headers and delete the component file.
 */
export async function removeLanguageSwitcher() {
  const headerFiles = await getHeaderFiles();
  let modifiedFiles = 0;

  for (const file of headerFiles) {
    const content = await readFile(file);
    if (!content || !content.includes('LanguageSwitcher')) continue;

    const updated = removeComponentUsage(content, 'LanguageSwitcher');
    if (updated !== content) {
      await writeFile(file, updated);
      modifiedFiles++;
    }
  }

  // Also remove from DocsLayout, DocsBottomBar, etc.
  for (const filePath of [
    'src/components/docs/DocsLayout.astro',
    'src/components/docs/DocsBottomBar.astro',
  ]) {
    const content = await readFile(filePath);
    if (content && content.includes('LanguageSwitcher')) {
      await writeFile(filePath, removeComponentUsage(content, 'LanguageSwitcher'));
    }
  }

  // Delete the component file and CSS
  await safeRemove('src/components/ui/LanguageSwitcher.astro');
  await safeRemove('src/styles/_lang-switcher.css');

  // Remove @import from global.css
  await removeLinesMatching('src/styles/global.css', /_lang-switcher\.css/);

  // Remove the locale preference script from BaseLayout if only 1 locale
  let baseLayout = await readFile('src/layouts/BaseLayout.astro');
  if (baseLayout) {
    // Remove the applyLocalePreference script block
    baseLayout = baseLayout.replace(
      /\s*<script is:inline define:vars=\{\{ enabledLocales \}\}>[\s\S]*?<\/script>/,
      '',
    );
    await writeFile('src/layouts/BaseLayout.astro', baseLayout);
  }

  return { modifiedFiles };
}

/**
 * If both switchers have been removed, also clean up the shared switcher CSS.
 */
export async function cleanupSharedSwitcherCSS() {
  const globalCss = await readFile('src/styles/global.css');
  if (!globalCss) return;

  // Check if both switcher CSS imports are gone
  const hasThemeSwitcher = globalCss.includes('_theme-switcher.css');
  const hasLangSwitcher = globalCss.includes('_lang-switcher.css');

  if (!hasThemeSwitcher && !hasLangSwitcher) {
    await removeLinesMatching('src/styles/global.css', /_switcher-shared\.css/);
    await safeRemove('src/styles/_switcher-shared.css');
  }
}
