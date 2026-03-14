/**
 * Shared utilities for the configure CLI.
 */
import fs from 'fs/promises';
import path from 'path';

/** Project root (two levels up from scripts/lib/) */
export const ROOT = path.resolve(new URL('../../', import.meta.url).pathname);

/** Resolve a path relative to the project root */
export function resolve(...segments) {
  return path.join(ROOT, ...segments);
}

/**
 * Safely delete a file or directory. No-op if it doesn't exist.
 * Returns true if something was deleted.
 */
export async function safeRemove(relPath) {
  const abs = resolve(relPath);
  try {
    const stat = await fs.stat(abs);
    if (stat.isDirectory()) {
      await fs.rm(abs, { recursive: true, force: true });
    } else {
      await fs.unlink(abs);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a file relative to project root. Returns null if not found.
 */
export async function readFile(relPath) {
  try {
    return await fs.readFile(resolve(relPath), 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Write a file relative to project root.
 */
export async function writeFile(relPath, content) {
  const abs = resolve(relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, 'utf-8');
}

/**
 * Check if a file/directory exists.
 */
export async function exists(relPath) {
  try {
    await fs.access(resolve(relPath));
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove lines matching a pattern from a file.
 * Returns the number of lines removed.
 */
export async function removeLinesMatching(relPath, pattern) {
  const content = await readFile(relPath);
  if (!content) return 0;

  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  const lines = content.split('\n');
  const filtered = lines.filter(line => !regex.test(line));
  const removed = lines.length - filtered.length;

  if (removed > 0) {
    await writeFile(relPath, filtered.join('\n'));
  }
  return removed;
}

/**
 * Remove an array entry from a TS config file.
 * Finds the object literal containing `id: '{id}'` and removes it.
 * Works for themes.ts, palettes.ts, locales.ts patterns.
 */
export function removeArrayEntry(content, idField, idValue) {
  // Match object literal with the given id field value, including surrounding braces and trailing comma
  // This handles multi-line object literals in arrays
  const patterns = [
    // Pattern: { ... id: 'value', ... },
    new RegExp(
      `\\s*\\{[^}]*${idField}:\\s*'${idValue}'[^}]*\\},?`,
      'g'
    ),
    // Pattern with code: 'value' (for locales)
    new RegExp(
      `\\s*\\{[^}]*${idField}:\\s*'${idValue}'[\\s\\S]*?\\},`,
      'g'
    ),
  ];

  let result = content;
  for (const pattern of patterns) {
    const newResult = result.replace(pattern, '');
    if (newResult !== result) {
      result = newResult;
      break;
    }
  }
  return result;
}

/**
 * Remove a keyed block from a Record/object in a TS file.
 * E.g., remove `liquid: { ... },` from themePresets.
 */
export function removeRecordEntry(content, key) {
  // Match:  key: { ... }, (multi-line, non-greedy within braces — handles nested braces)
  // We count braces to find the proper closing brace
  const startPattern = new RegExp(`(\\n\\s*)${key}:\\s*\\{`);
  const match = content.match(startPattern);
  if (!match) return content;

  const startIdx = match.index;
  const braceStart = content.indexOf('{', startIdx + match[1].length + key.length);

  let depth = 0;
  let endIdx = braceStart;
  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }

  // Include trailing comma and newline
  let sliceEnd = endIdx + 1;
  if (content[sliceEnd] === ',') sliceEnd++;
  // Consume trailing whitespace/newline
  while (sliceEnd < content.length && (content[sliceEnd] === '\n' || content[sliceEnd] === '\r')) {
    sliceEnd++;
  }

  return content.slice(0, startIdx) + content.slice(sliceEnd);
}

/** Capitalize first letter */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
