import { getCollection } from 'astro:content';

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
    'components-sections': 2,
    'components-ui': 3,
    'components-reference': 4,
    'core-concepts': 5,
    'deployment': 6,
    'General': 0
  };

  // Convert to array and sort
  const nav = Object.entries(sections).map(([key, items]) => {
    // Format title
    let title = key === 'General' ? 'General' : 
      key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Custom titles
    if (key === 'components-sections') title = 'Marketing Sections';
    if (key === 'components-ui') title = 'UI Elements';
    if (key === 'components-reference') title = 'Reference';
      
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
