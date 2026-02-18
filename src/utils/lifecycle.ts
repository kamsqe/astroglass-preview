/**
 * Astro Page Lifecycle Utility
 *
 * Provides safe registration of page init functions that work
 * correctly with Astro's View Transitions (client-side navigation).
 *
 * Fixes the listener accumulation bug where each navigation adds
 * a new `astro:after-swap` listener without removing the old one.
 */

/**
 * Register a page init function with safe astro:after-swap handling.
 *
 * - Calls `initFn` immediately for the initial page load.
 * - Adds an `astro:after-swap` listener so `initFn` re-runs on
 *   client-side navigation.
 * - Removes the old listener on `astro:before-swap` to prevent
 *   accumulation across navigations.
 */
export function registerAstroPage(initFn: () => void): void {
  // Run immediately for the initial page load
  initFn();

  // Handler reference so we can remove it later
  const swapHandler = () => initFn();

  document.addEventListener('astro:after-swap', swapHandler);

  // Clean up on next navigation to prevent stacking
  document.addEventListener(
    'astro:before-swap',
    () => {
      document.removeEventListener('astro:after-swap', swapHandler);
    },
    { once: true }
  );
}
