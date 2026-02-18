/**
 * Portfolio Shared Behavior Utilities
 *
 * Extracts the category filter logic and expand/collapse detail panel
 * logic shared across all 6 portfolio pages.
 *
 * Uses AbortController instead of the cloneNode anti-pattern for
 * clean listener deduplication on Astro page re-initialization.
 */

// ─── Category Filter ────────────────────────────────────────────

export interface CategoryFilterConfig {
  /** ID of the filters container element */
  filtersId: string;
  /** CSS selector for the filterable card/item elements */
  cardSelector: string;
  /** Classes to add to the active filter button */
  activeClasses: string[];
  /** Classes to add to inactive filter buttons */
  inactiveClasses: string[];
  /** Optional callback after a filter is applied */
  onFilter?: (filter: string) => void;
  /**
   * Transform applied to cards when hiding (default: 'translateY(20px)').
   * Set to a custom value like 'scale(0.95)' for different themes.
   */
  hideTransform?: string;
  /** Delay in ms before swapping display (default: 400) */
  fadeOutMs?: number;
  /**
   * If true, uses a two-step animation: fade out everything first,
   * then swap display and fade matching items back in.
   * Used by Luxury, Minimal, Aurora themes.
   */
  twoStepAnimation?: boolean;
  /**
   * If provided, target this child selector inside each card for the
   * opacity/transform animation instead of the card itself.
   * Used by Minimal theme which animates `.c-portfolio-page-minimal__row`.
   */
  animateChildSelector?: string;
}

/**
 * Wire up category filter buttons to show/hide project cards.
 *
 * Returns an AbortController — call `.abort()` on reinit to cleanly
 * remove all listeners without cloneNode.
 */
export function initCategoryFilter(config: CategoryFilterConfig): AbortController | null {
  const {
    filtersId,
    cardSelector,
    activeClasses,
    inactiveClasses,
    onFilter,
    hideTransform = 'translateY(20px)',
    fadeOutMs = 400,
    twoStepAnimation = false,
    animateChildSelector,
  } = config;

  const filters = document.getElementById(filtersId);
  if (!filters) return null;

  const controller = new AbortController();
  const { signal } = controller;

  filters.querySelectorAll<HTMLElement>('button').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        // Update active state on all filter buttons
        filters.querySelectorAll<HTMLElement>('button').forEach((b) => {
          // Remove both active and inactive classes, then add inactive
          [...activeClasses, ...inactiveClasses].forEach((cls) => b.classList.remove(cls));
          inactiveClasses.forEach((cls) => b.classList.add(cls));
        });
        // Mark clicked button as active
        inactiveClasses.forEach((cls) => btn.classList.remove(cls));
        activeClasses.forEach((cls) => btn.classList.add(cls));

        const filter = btn.getAttribute('data-filter');
        if (onFilter) onFilter(filter || 'all');

        const cards = document.querySelectorAll<HTMLElement>(cardSelector);

        if (twoStepAnimation) {
          // Step 1: Fade out all items
          cards.forEach((card) => {
            const target = animateChildSelector
              ? card.querySelector<HTMLElement>(animateChildSelector)
              : card;
            if (target) {
              target.style.opacity = '0';
              target.style.transform = hideTransform;
            }
          });

          // Step 2: After fade-out, swap display and reveal matching
          setTimeout(() => {
            cards.forEach((card) => {
              const category = card.getAttribute('data-category');
              const target = animateChildSelector
                ? card.querySelector<HTMLElement>(animateChildSelector)
                : card;

              if (filter === 'all' || category === filter) {
                card.style.display = '';
                if (target) {
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      target.style.opacity = '1';
                      target.style.transform = '';
                    });
                  });
                }
              } else {
                card.style.display = 'none';
              }
            });
          }, fadeOutMs < 400 ? fadeOutMs : 300);
        } else {
          // Simple show/hide with transition
          cards.forEach((card) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = '';
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = '';
              });
            } else {
              card.style.opacity = '0';
              card.style.transform = hideTransform;
              setTimeout(() => {
                card.style.display = 'none';
              }, fadeOutMs);
            }
          });
        }
      },
      { signal }
    );
  });

  return controller;
}

// ─── Detail Panel Expand/Collapse ───────────────────────────────

export interface DetailPanelConfig {
  /** Selector for toggle buttons, e.g. '[data-toggle-details]' */
  toggleSelector: string;
  /** Selector for close buttons, e.g. '[data-close-details]' */
  closeSelector: string;
  /** CSS class used on expanded panels */
  expandedClass?: string;
  /** Selector for the detail panel container class (for closing "all others") */
  panelBaseSelector: string;
  /** Selector for the card/item ancestor (used for scroll-back on close) */
  cardSelector: string;
}

/**
 * Wire up expand/collapse behavior for inline detail panels.
 *
 * Used by Liquid, Neo, and Minimal portfolio pages (themes with
 * inline expandable panels rather than modals).
 *
 * Returns an AbortController for cleanup.
 */
export function initDetailPanels(config: DetailPanelConfig): AbortController {
  const {
    toggleSelector,
    closeSelector,
    expandedClass = 'is-expanded',
    panelBaseSelector,
    cardSelector,
  } = config;

  const controller = new AbortController();
  const { signal } = controller;

  // Toggle buttons
  document.querySelectorAll<HTMLElement>(toggleSelector).forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const projectId = btn.getAttribute('data-toggle-details');
        const panel = document.querySelector<HTMLElement>(`[data-details="${projectId}"]`);
        if (!panel) return;

        const isExpanded = panel.classList.contains(expandedClass);

        // Close all other panels first
        document.querySelectorAll(`${panelBaseSelector}.${expandedClass}`).forEach((p) => {
          if (p !== panel) p.classList.remove(expandedClass);
        });

        if (isExpanded) {
          panel.classList.remove(expandedClass);
        } else {
          panel.classList.add(expandedClass);
          setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      },
      { signal }
    );
  });

  // Close buttons
  document.querySelectorAll<HTMLElement>(closeSelector).forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const projectId = btn.getAttribute('data-close-details');
        const panel = document.querySelector<HTMLElement>(`[data-details="${projectId}"]`);
        if (panel) {
          panel.classList.remove(expandedClass);
          const card = panel.closest(cardSelector);
          if (card) {
            setTimeout(() => {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        }
      },
      { signal }
    );
  });

  return controller;
}
