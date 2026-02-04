import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const posts = await getCollection('blog', ({ slug }) => slug.startsWith('en/'));
  return rss({
    title: 'Liquid Glass Blog',
    description: 'Insights and updates.',
    site: context.site || 'https://liquid-glass.netlify.app',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug.replace('en/', '')}/`,
    })),
  });
}
