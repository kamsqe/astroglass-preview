import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  // Ignore build output and generated files
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      '.wrangler/',
      '.netlify/',
      'public/search/',
      'scripts/',
      // Astro files with template patterns the ESLint Astro parser can't handle
      // (top-level ternaries, HTML comments in JSX expressions, nested components)
      'src/components/layout/DesktopNav.astro',
      'src/components/layout/header/HeaderDefault.astro',
      'src/components/layout/header/HeaderNeo.astro',
      'src/components/sections/contact/ContactLiquid.astro',
      'src/components/sections/faq/FAQAurora.astro',
      'src/components/sections/hero/HeroLuxury.astro',
      'src/components/sections/portfolio/ThemeStack.astro',
      'src/components/ui/LanguageSwitcher.astro',
      'src/components/ui/ThemeSwitcher.astro',
      'src/pages/**/blog/index.astro',
    ],
  },

  // Astro recommended rules (includes parser config for .astro files)
  ...eslintPluginAstro.configs.recommended,

  // Relax rules that conflict with Astro template patterns
  {
    files: ['**/*.astro'],
    rules: {
      'no-unused-vars': 'off',
    },
  },

  // TypeScript / JS files — need explicit TS parser
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
