// Modular locale files - English
import enCommon from '../locales/en/common.json';
import enNav from '../locales/en/nav.json';
import enLanding from '../locales/en/landing.json';
import enUi from '../locales/en/ui.json';
import enBlog from '../locales/en/blog.json';
import enHero from '../locales/en/hero.json';
import enAbout from '../locales/en/about.json';
import enFeatures from '../locales/en/features.json';
import enPortfolio from '../locales/en/portfolio.json';
import enPricing from '../locales/en/pricing.json';
import enTestimonial from '../locales/en/testimonial.json';
import enFaq from '../locales/en/faq.json';
import enCta from '../locales/en/cta.json';
import enContact from '../locales/en/contact.json';
import enShowcase from '../locales/en/showcase.json';

// Modular locale files - Russian
import ruCommon from '../locales/ru/common.json';
import ruNav from '../locales/ru/nav.json';
import ruLanding from '../locales/ru/landing.json';
import ruUi from '../locales/ru/ui.json';
import ruBlog from '../locales/ru/blog.json';
import ruHero from '../locales/ru/hero.json';
import ruAbout from '../locales/ru/about.json';
import ruFeatures from '../locales/ru/features.json';
import ruPortfolio from '../locales/ru/portfolio.json';
import ruPricing from '../locales/ru/pricing.json';
import ruTestimonial from '../locales/ru/testimonial.json';
import ruFaq from '../locales/ru/faq.json';
import ruCta from '../locales/ru/cta.json';
import ruContact from '../locales/ru/contact.json';
import ruShowcase from '../locales/ru/showcase.json';

// Assemble complete translation objects
const en = {
  ...enCommon,
  siteName: enCommon.siteName,
  nav: enNav,
  landing: enLanding,
  themeSwitcher: enUi,
  languageSwitcher: { label: 'Language', hint: 'Choose language' },
  blog: enBlog,
  hero: enHero,
  about: enAbout,
  features: enFeatures,
  portfolio: enPortfolio,
  pricing: enPricing,
  testimonial: enTestimonial,
  faq: enFaq,
  cta: enCta,
  contact: enContact,
  showcase: enShowcase,
};

const ru = {
  ...ruCommon,
  siteName: ruCommon.siteName,
  nav: ruNav,
  landing: ruLanding,
  themeSwitcher: ruUi,
  languageSwitcher: { label: 'Язык', hint: 'Выберите язык' },
  blog: ruBlog,
  hero: ruHero,
  about: ruAbout,
  features: ruFeatures,
  portfolio: ruPortfolio,
  pricing: ruPricing,
  testimonial: ruTestimonial,
  faq: ruFaq,
  cta: ruCta,
  contact: ruContact,
  showcase: ruShowcase,
};

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
