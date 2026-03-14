import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getEnabledLocaleCodes, defaultLocale } from '../../../config/locales';

export const prerender = true;

export async function getStaticPaths() {
  const langs = getEnabledLocaleCodes();
  return langs.map((lang) => ({
    params: { lang: lang === defaultLocale ? undefined : lang },
    props: { locale: lang },
  }));
}

export async function GET(context) {
  const locale = context.props.locale || defaultLocale;
  const posts = await getCollection(
    'blog',
    ({ id, data }) => id.startsWith(`${locale}/`) && !data.draft,
  );

  return rss({
    title: `Astro Glass Blog (${locale})`,
    description: 'Insights and updates.',
    site: context.site || 'https://astroglass-preview.pages.dev',
    items: posts.map((post) => {
      // Astro 6 Content Layer: id includes the file extension (e.g. "en/my-post.mdx").
      // Strip extension and derive the locale-relative slug.
      const idWithoutExt = post.id.replace(/\.(mdx?)$/, '').replace(/\/index$/, '');
      const postSlug = idWithoutExt.replace(`${locale}/`, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: locale === defaultLocale ? `/blog/${postSlug}/` : `/${locale}/blog/${postSlug}/`,
      };
    }),
  });
}
