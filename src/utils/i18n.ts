import en from '../locales/en.json';
import ru from '../locales/ru.json';

const translations: Record<string, typeof en> = {
  en,
  ru,
};

export const defaultLocale = 'en';
export const locales = ['en', 'ru'] as const;

export type Locale = (typeof locales)[number];

/**
 * Get the locale from a URL pathname
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale)) {
    return lang as Locale;
  }
  return defaultLocale;
}

/**
 * Get a translation function for the given locale
 */
export function useTranslations(locale: Locale) {
  const t = translations[locale] || translations[defaultLocale];
  
  return function getTranslation(key: string): string {
    const keys = key.split('.');
    let value: unknown = t;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
}

/**
 * Get the path to switch to another locale
 */
export function getLocalePath(url: URL, targetLocale: Locale): string {
  const pathname = url.pathname;
  const currentLocale = getLocaleFromUrl(url);
  
  // Strip current locale if it's there
  let cleanPath = pathname;
  if (pathname.startsWith(`/${currentLocale}/`)) {
    cleanPath = pathname.replace(`/${currentLocale}/`, '/');
  } else if (pathname === `/${currentLocale}`) {
    cleanPath = '/';
  }
  
  // Build new path
  if (targetLocale === 'en') {
    return cleanPath;
  }
  
  return `/${targetLocale}${cleanPath === '/' ? '' : cleanPath}`;
}
