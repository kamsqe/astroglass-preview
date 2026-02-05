/**
 * Documentation Configuration
 * 
 * Central registry for docs navigation, versions, and metadata.
 * This is the single source of truth for documentation structure.
 */

export interface DocsVersion {
  /** Version identifier (e.g., 'v1', 'v2') */
  id: string;
  /** Display name */
  label: string;
  /** Whether this is the default/current version */
  current: boolean;
  /** URL path prefix (empty for current version) */
  pathPrefix: string;
}

export interface DocsCategory {
  /** Category identifier */
  id: string;
  /** Display name */
  label: string;
  /** Emoji icon */
  icon: string;
  /** Order in sidebar */
  order: number;
  /** Layout type for this category */
  layout: 'v1' | 'v2';
}

/**
 * Available documentation versions
 */
export const docsVersions: DocsVersion[] = [
  {
    id: 'current',
    label: 'Latest',
    current: true,
    pathPrefix: '',
  },
  // Add future versions here:
  // {
  //   id: 'v1',
  //   label: 'v1.x',
  //   current: false,
  //   pathPrefix: 'v1',
  // },
];

/**
 * Documentation categories
 */
export const docsCategories: DocsCategory[] = [
  {
    id: 'guide',
    label: 'Guide',
    icon: '📖',
    order: 1,
    layout: 'v1',
  },
  {
    id: 'api',
    label: 'API Reference',
    icon: '⚡',
    order: 2,
    layout: 'v2',
  },
  {
    id: 'examples',
    label: 'Examples',
    icon: '🎨',
    order: 3,
    layout: 'v1',
  },
];

/**
 * Get the current docs version
 */
export function getCurrentVersion(): DocsVersion {
  return docsVersions.find(v => v.current) ?? docsVersions[0];
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): DocsCategory | undefined {
  return docsCategories.find(c => c.id === id);
}

/**
 * Get categories sorted by order
 */
export function getSortedCategories(): DocsCategory[] {
  return [...docsCategories].sort((a, b) => a.order - b.order);
}

/**
 * Calculate reading time from content
 * @param content Markdown content string
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Mobile bottom bar items
 */
export const mobileBottomBarItems = [
  { id: 'menu', label: 'Menu', icon: '☰', action: 'openDrawer' },
  { id: 'toc', label: 'Contents', icon: '📑', action: 'openTOC' },
  { id: 'search', label: 'Search', icon: '🔍', action: 'openSearch' },
  { id: 'home', label: 'Home', icon: '🏠', href: '/docs' },
];

/**
 * Keyboard shortcuts configuration
 */
export const keyboardShortcuts = [
  { keys: ['/', 'Ctrl+K', 'Cmd+K'], action: 'openSearch', label: 'Search docs' },
  { keys: ['ArrowLeft'], action: 'prevPage', label: 'Previous page' },
  { keys: ['ArrowRight'], action: 'nextPage', label: 'Next page' },
  { keys: ['Escape'], action: 'closeModals', label: 'Close modals' },
];
