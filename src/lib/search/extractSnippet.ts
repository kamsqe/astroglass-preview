/**
 * extractSnippet.ts
 * Extracts a snippet of text around the matched search terms with highlighting.
 */

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function extractSnippet(content: string, query: string, maxLength: number = 80): string {
  if (!content) return '';

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter(w => w.length > 0);

  // Find first matching word position
  let matchPos = -1;
  for (const word of words) {
    const pos = lowerContent.indexOf(word);
    if (pos !== -1) {
      matchPos = pos;
      break;
    }
  }

  if (matchPos === -1) {
    const truncated = content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
    return escapeHtml(truncated);
  }

  // Extract snippet around match with some buffer
  const buffer = 30;
  const start = Math.max(0, matchPos - buffer);
  const end = Math.min(content.length, matchPos + maxLength - buffer);

  let snippet = content.slice(start, end);

  // Add ellipses
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  // Escape HTML entities BEFORE adding <mark> tags to prevent XSS
  snippet = escapeHtml(snippet);

  // Highlight matching words with <mark> tags
  words.forEach(word => {
    if (word.length < 2) return;
    const escapedWord = escapeHtml(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedWord})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');
  });

  return snippet;
}
