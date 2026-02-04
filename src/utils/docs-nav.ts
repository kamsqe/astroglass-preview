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
    
    if (!sections[sectionKey]) sections[sectionKey] = [];
    
    sections[sectionKey].push({
      title: doc.data.title,
      href: locale === 'en' ? `/docs/${cleanSlug}/` : `/${locale}/docs/${cleanSlug}/`,
      order: doc.data.order || 99
    });
  });

  // Convert to array and sort
  const nav = Object.entries(sections).map(([key, items]) => {
    // Format title: "01-getting-started" -> "Getting Started"
    const title = key === 'General' ? 'General' : 
      key.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
    // Extract section order if present (e.g. 01-)
    const match = key.match(/^(\d+)-/);
    const sectionOrder = match ? parseInt(match[1]) : (key === 'General' ? 0 : 99);

    return {
      title,
      order: sectionOrder,
      items: items.sort((a, b) => a.order - b.order)
    };
  });

  return nav.sort((a, b) => a.order - b.order);
}
