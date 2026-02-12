
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
  // For section links, we usually want them to work from anywhere.
  // If on luxury page, '#id' works. If elsewhere, '/luxury/#id'.
  // However, since Luxury header is likely only on Luxury page, relative hash is safest for scrollspy.
  // We'll leave the HREF as just the hash for sections to support smooth scroll libraries/observers easier,
  // or fully qualified if needed. Let's use Hash for now and handle "external" navigation if we were on another page separately.
  // Given the request is "within the /luxury page", hash is correct.
  
  return [
    {
      label: t('nav.about'),
      href: '#about',
      type: 'section',
    },
    {
      label: t('nav.services'),
      href: '#services', // Maps to Features component
      type: 'section',
    },
    {
      label: t('nav.pricing'),
      href: '#pricing',
      type: 'section',
    },
    {
      label: t('nav.portfolio'),
      href: '#portfolio',
      type: 'section',
    },
    // FAQ
    {
      label: t('nav.faq'), // Updated to use cleaner 'faq' key
      href: '#faq',
      type: 'section',
    },
    {
      label: t('nav.contact'),
      href: '#contact',
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
