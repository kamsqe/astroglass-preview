// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { defaultLocale, getEnabledLocaleCodes } from './src/config/locales';
import { adapter, output } from './src/config/providers/active-provider';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output,
  adapter,
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale,
    locales: getEnabledLocaleCodes(),
  },
});