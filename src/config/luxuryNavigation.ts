
/**
 * Luxury Navigation Configuration
 * 
 * Defines the specific navigation items for the Luxury theme.
 * Mixes scroll-to-section links (hash) and page links (path).
 */
import type { NavIcon } from './navigation';

export interface LuxuryNavLink {
  label: string;
  href: string;
  type: 'section' | 'page'; // 'section' = scroll, 'page' = route
  icon?: NavIcon; // Optional icon for mobile
}

export function buildLuxuryNavLinks(
  locale: string,
  t: (key: string) => string
): LuxuryNavLink[] {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const themeBase = `${prefix}/luxury`;
  
  return [
    {
      label: t('nav.about'),
      href: `${themeBase}#about`,
      type: 'section',
    },
    {
      label: t('nav.services'),
      href: `${themeBase}#services`,
      type: 'section',
    },
    {
      label: t('nav.portfolio'),
      href: `${themeBase}#portfolio`,
      type: 'section',
    },
    {
      label: t('nav.pricing'),
      href: `${themeBase}#pricing`,
      type: 'section',
    },
    {
      label: t('nav.faq'),
      href: `${themeBase}#faq`,
      type: 'section',
    },
    {
      label: t('nav.contact'),
      href: `${themeBase}#contact`,
      type: 'section',
    },
    // Pages
    {
      label: t('nav.blog'),
      href: `${prefix}/blog`,
      type: 'page',
    },
    {
      label: t('nav.docs'),
      href: `${prefix}/docs`,
      type: 'page',
    },
  ];
}
