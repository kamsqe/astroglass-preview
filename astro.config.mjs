// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, getEnabledLocaleCodes } from './src/config/locales';
import { adapter, output } from './src/config/providers/active-provider';

// https://astro.build/config
export default defineConfig({
  output,
  adapter,
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale,
    locales: getEnabledLocaleCodes(),
  },
});