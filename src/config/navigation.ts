/**
 * Navigation Configuration
 * 
 * This file contains the navigation structure for the site.
 * Modify this file to customize the navigation menu.
 * 
 * Each nav item can have:
 * - href: Link URL (optional for dropdown parents)
 * - labelKey: Translation key for the label
 * - icon: SVG path data for the icon (used in mobile nav)
 * - children: Nested navigation items
 */

export interface NavIcon {
  paths: string[];
  strokeWidth?: number;
}

export interface NavChild {
  href: string;
  labelKey: string;
  icon?: NavIcon;
  children?: { href: string; labelKey: string }[];
}

export interface NavLink {
  href?: string;
  labelKey: string;
  icon: NavIcon;
  children?: NavChild[];
}

// Default icons for common nav items
export const navIcons = {
  home: {
    paths: ['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
    strokeWidth: 1.75,
  },
  about: {
    paths: ['M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
    strokeWidth: 1.75,
  },
  services: {
    paths: ['M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'],
    strokeWidth: 1.75,
  },
  resources: {
    paths: ['M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'],
    strokeWidth: 1.75,
  },
  contact: {
    paths: ['M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
    strokeWidth: 1.75,
  },
} as const;

/**
 * Main navigation structure
 * Uses translation keys instead of hardcoded text
 */
export const navigationConfig: NavLink[] = [
  {
    href: '/',
    labelKey: 'nav.home',
    icon: navIcons.home,
  },
  {
    href: '/about',
    labelKey: 'nav.about',
    icon: navIcons.about,
  },
  {
    labelKey: 'nav.services',
    icon: navIcons.services,
    children: [
      {
        href: '/services/web',
        labelKey: 'nav.servicesWeb',
        children: [
          { href: '/services/web/frontend', labelKey: 'nav.webFrontend' },
          { href: '/services/web/backend', labelKey: 'nav.webBackend' },
          { href: '/services/web/fullstack', labelKey: 'nav.webFullstack' },
          { href: '/services/web/ecommerce', labelKey: 'nav.webEcommerce' },
        ],
      },
      {
        href: '/services/mobile',
        labelKey: 'nav.servicesMobile',
        children: [
          { href: '/services/mobile/ios', labelKey: 'nav.mobileIos' },
          { href: '/services/mobile/android', labelKey: 'nav.mobileAndroid' },
          { href: '/services/mobile/cross-platform', labelKey: 'nav.mobileCrossPlatform' },
        ],
      },
      { href: '/services/design', labelKey: 'nav.servicesDesign' },
      { href: '/services/consulting', labelKey: 'nav.servicesConsulting' },
    ],
  },
  {
    labelKey: 'nav.resources',
    icon: navIcons.resources,
    children: [
      { href: '/blog', labelKey: 'nav.resourcesBlog' },
      { href: '/docs', labelKey: 'nav.resourcesDocs' },
      { href: '/tutorials', labelKey: 'nav.resourcesTutorials' },
      { href: '/faq', labelKey: 'nav.resourcesFaq' },
    ],
  },
  {
    href: '/contact',
    labelKey: 'nav.contact',
    icon: navIcons.contact,
  },
];

/**
 * Helper to build localized navigation
 */
export function buildNavLinks(
  locale: string,
  t: (key: string) => string
): Array<{
  href?: string;
  label: string;
  icon: NavIcon;
  children?: Array<{
    href: string;
    label: string;
    children?: Array<{ href: string; label: string }>;
  }>;
}> {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  
  return navigationConfig.map((link) => ({
    href: link.href ? `${prefix}${link.href}` : undefined,
    label: t(link.labelKey),
    icon: link.icon,
    children: link.children?.map((child) => ({
      href: `${prefix}${child.href}`,
      label: t(child.labelKey),
      children: child.children?.map((subChild) => ({
        href: `${prefix}${subChild.href}`,
        label: t(subChild.labelKey),
      })),
    })),
  }));
}

