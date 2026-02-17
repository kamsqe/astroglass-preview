import { getCollection } from 'astro:content';

// Sidebar Labels (Localization)
export const SIDEBAR_LABELS: Record<string, Record<string, string>> = {
  'components-sections': {
    en: 'Marketing Sections',
    ru: 'Маркетинговые Секции'
  },
  'components-ui': {
    en: 'UI Elements',
    ru: 'UI Элементы'
  },
  'components-pages': {
    en: 'Pages',
    ru: 'Страницы'
  },
  'components-reference': {
    en: 'Reference',
    ru: 'Справочник'
  },
  'getting-started': {
    en: 'Getting Started',
    ru: 'Начало работы'
  },
  'core-concepts': {
    en: 'Core Concepts',
    ru: 'Основные Концепции'
  },
  'deployment': {
    en: 'Deployment',
    ru: 'Развертывание'
  },
  'components': {
    en: 'Components',
    ru: 'Компоненты'
  },
  'themes': {
    en: 'Themes',
    ru: 'Темы'
  },
  'guide': {
    en: 'Guide',
    ru: 'Руководство'
  },
  'guides': {
    en: 'Guides',
    ru: 'Руководства'
  }
};

export async function buildDocsNav(locale: 'en' | 'ru') {
  // Fetch all docs
  const allDocs = await getCollection('docs');
  console.log(`[DocsNav] Total docs found: ${allDocs.length}`);
  
  // Filter for locale
  const docs = allDocs.filter(d => d.slug.startsWith(`${locale}/`));
  console.log(`[DocsNav] Docs for ${locale}: ${docs.length}`);
  
  // Group by folder
  const sections: Record<string, any[]> = {};
  
  docs.forEach(doc => {
    const cleanSlug = doc.slug.replace(`${locale}/`, '');
    const parts = cleanSlug.split('/');
    
    // Determine section name
    // If it's in a subfolder, use folder name. If root, use 'General'
    let sectionKey = parts.length > 1 ? parts[0] : 'General';
    
    // granular components
    if (sectionKey === 'components' && parts.length > 2) {
      sectionKey = `components-${parts[1]}`;
    }
    
    if (!sections[sectionKey]) sections[sectionKey] = [];
    
    sections[sectionKey].push({
      title: doc.data.title,
      href: locale === 'en' ? `/docs/${cleanSlug}/` : `/${locale}/docs/${cleanSlug}/`,
      order: doc.data.order || 99
    });
  });

  // Explicit Section Ordering
  const SECTION_ORDER: Record<string, number> = {
    'getting-started': 1,
    'core-concepts': 2,
    'components-sections': 3,
    'components-ui': 4,
    'components-pages': 5,
    'components-reference': 6,
    'guides': 7,
    'deployment': 8,
    'General': 0
  };

  // Convert to array and sort
  const nav = Object.entries(sections).map(([key, items]) => {
    // Default formatting
    let title = key === 'General' ? 'General' : 
      key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Use localized override if available
    if (SIDEBAR_LABELS[key] && SIDEBAR_LABELS[key][locale]) {
      title = SIDEBAR_LABELS[key][locale];
    }
      
    // Get explicit order
    const sectionOrder = SECTION_ORDER[key] || 99;

    return {
      title,
      order: sectionOrder,
      items: items.sort((a, b) => a.order - b.order)
    };
  });

  return nav.sort((a, b) => a.order - b.order);
}
