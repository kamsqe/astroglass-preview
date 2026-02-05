/**
 * Shared Navigation Script
 * 
 * Common JavaScript functionality for header navigation across all themes.
 * This module handles mobile menu toggling, dropdowns, and accessibility.
 * 
 * Usage in Astro components:
 * <script>
 *   import { initNavigation } from '../scripts/navigation';
 *   initNavigation();
 *   document.addEventListener('astro:after-swap', initNavigation);
 * </script>
 */

/**
 * Initialize all navigation functionality
 * Call this on page load and after client-side navigation
 */
export function initNavigation(): void {
  initMobileMenu();
  initDropdowns();
  initEscapeHandler();
  initResizeHandler();
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu(): void {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (!menuButton || !mobileMenu) return;
  
  // Clone to remove existing listeners
  const newButton = menuButton.cloneNode(true) as HTMLElement;
  menuButton.parentNode?.replaceChild(newButton, menuButton);
  
  newButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    newButton.classList.toggle('is-active', isOpen);
    newButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
}

/**
 * Initialize dropdown/accordion functionality for nested menus
 */
function initDropdowns(): void {
  const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
  
  accordionTriggers.forEach((trigger) => {
    // Clone to remove existing listeners
    const newTrigger = trigger.cloneNode(true) as HTMLElement;
    trigger.parentNode?.replaceChild(newTrigger, trigger);
    
    newTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const parent = newTrigger.closest('[data-accordion-item]');
      if (!parent) return;
      
      const isOpen = parent.classList.toggle('is-open');
      newTrigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

/**
 * Close menus on Escape key press
 */
function initEscapeHandler(): void {
  if ((window as any).__navEscapeAdded) return;
  (window as any).__navEscapeAdded = true;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
    }
  });
}

/**
 * Close mobile menu on window resize to desktop
 */
function initResizeHandler(): void {
  if ((window as any).__navResizeAdded) return;
  (window as any).__navResizeAdded = true;
  
  let resizeTimer: ReturnType<typeof setTimeout>;
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        closeAllMenus();
      }
    }, 100);
  });
}

/**
 * Close all open menus (mobile menu, dropdowns, accordions)
 */
export function closeAllMenus(): void {
  // Close mobile menu
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  
  if (mobileMenu?.classList.contains('is-open')) {
    mobileMenu.classList.remove('is-open');
    menuButton?.classList.remove('is-active');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
  
  // Close accordions
  document.querySelectorAll('[data-accordion-item].is-open').forEach((item) => {
    item.classList.remove('is-open');
    item.querySelector('[data-accordion-trigger]')?.setAttribute('aria-expanded', 'false');
  });
  
  // Close dropdowns
  document.querySelectorAll('.is-open').forEach((el) => {
    if (el.hasAttribute('data-dropdown') || el.hasAttribute('data-lang-switcher') || el.hasAttribute('data-theme-switcher')) {
      el.classList.remove('is-open');
      el.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
    }
  });
}
