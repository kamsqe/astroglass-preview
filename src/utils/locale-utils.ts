import { 
  localesConfig, 
  defaultLocale, 
  getEnabledLocaleCodes,
  type Locale 
} from '../config/locales';

export const locales = getEnabledLocaleCodes() as unknown as readonly Locale[];

/**
 * Get the locale from a URL pathname
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale)) {
    return lang as Locale;
  }
  return defaultLocale as Locale;
}

/**
 * Get the path to switch to another locale
 */
export function getLocalePath(url: URL, targetLocale: Locale): string {
  const pathname = url.pathname;
  const currentLocale = getLocaleFromUrl(url);
  
  // Strip current locale if present
  let cleanPath = pathname;
  if (pathname.startsWith(`/${currentLocale}/`)) {
    cleanPath = pathname.replace(`/${currentLocale}/`, '/');
  } else if (pathname === `/${currentLocale}`) {
    cleanPath = '/';
  }
  
  // Build new path
  if (targetLocale === 'en') {
    return cleanPath || '/';
  }
  
  // For non-English locales, prefix the path
  if (cleanPath === '/') {
    return `/${targetLocale}/`;
  }
  
  return `/${targetLocale}${cleanPath}`;
}

/**
 * Build a locale-aware internal path.
 * Returns a function that prefixes paths with the current locale.
 *
 * Usage in .astro files:
 *   const lp = localePath(Astro.url);
 *   <a href={lp('/liquid/portfolio')}>View All</a>
 *   // On /ru/ pages → "/ru/liquid/portfolio"
 *   // On /en/ pages → "/liquid/portfolio"
 */
export function localePath(url: URL): (path: string) => string {
  const locale = getLocaleFromUrl(url);
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return (path: string) => `${prefix}${path}`;
}
