/**
 * Theme pruning — deletes files for unselected themes and updates configs.
 */
import { safeRemove, readFile, writeFile, removeRecordEntry, capitalize } from './utils.mjs';

// Mirrors src/config/themeRegistry.ts — we duplicate the data here
// so the CLI can run as plain Node.js without TS compilation.
const SECTIONS = 'src/components/sections';
const STYLES = 'src/styles/components';
const HEADER = 'src/components/layout/header';
const UI = 'src/components/ui';

const themeRegistry = {
  liquid: {
    barrel: `${SECTIONS}/themes/liquid.ts`,
    sections: [
      `${SECTIONS}/hero/HeroLiquid.astro`,
      `${SECTIONS}/about/AboutLiquid.astro`,
      `${SECTIONS}/features/FeaturesLiquid.astro`,
      `${SECTIONS}/portfolio/PortfolioLiquid.astro`,
      `${SECTIONS}/pricing/PricingLiquid.astro`,
      `${SECTIONS}/testimonial/TestimonialLiquid.astro`,
      `${SECTIONS}/faq/FAQLiquid.astro`,
      `${SECTIONS}/cta/CTALiquid.astro`,
      `${SECTIONS}/contact/ContactLiquid.astro`,
    ],
    css: [
      `${STYLES}/hero/HeroLiquid.css`,
      `${STYLES}/about/AboutLiquid.css`,
      `${STYLES}/features/FeaturesLiquid.css`,
      `${STYLES}/portfolio/PortfolioLiquid.css`,
      `${STYLES}/pricing/PricingLiquid.css`,
      `${STYLES}/testimonial/TestimonialLiquid.css`,
      `${STYLES}/faq/FAQLiquid.css`,
      `${STYLES}/cta/CTALiquid.css`,
      `${STYLES}/contact/ContactLiquid.css`,
      `${STYLES}/footer/FooterLiquid.css`,
    ],
    header: [`${HEADER}/HeaderLiquid.astro`],
    footer: [`${SECTIONS}/footer/FooterLiquid.astro`],
    ui: [`${UI}/liquid/LiquidSectionTag.astro`],
    scripts: [],
    tokens: ['src/styles/tokens/liquid.css'],
  },
  glass: {
    barrel: `${SECTIONS}/themes/glass.ts`,
    sections: [
      `${SECTIONS}/hero/HeroGlass.astro`,
      `${SECTIONS}/about/AboutGlass.astro`,
      `${SECTIONS}/features/FeaturesGlass.astro`,
      `${SECTIONS}/portfolio/PortfolioGlass.astro`,
      `${SECTIONS}/pricing/PricingGlass.astro`,
      `${SECTIONS}/testimonial/TestimonialGlass.astro`,
      `${SECTIONS}/faq/FAQGlass.astro`,
      `${SECTIONS}/cta/CTAGlass.astro`,
      `${SECTIONS}/contact/ContactGlass.astro`,
    ],
    css: [
      `${STYLES}/hero/HeroGlass.css`,
      `${STYLES}/about/AboutGlass.css`,
      `${STYLES}/features/FeaturesGlass.css`,
      `${STYLES}/portfolio/PortfolioGlass.css`,
      `${STYLES}/pricing/PricingGlass.css`,
      `${STYLES}/testimonial/TestimonialGlass.css`,
      `${STYLES}/faq/FAQGlass.css`,
      `${STYLES}/cta/CTAGlass.css`,
      `${STYLES}/contact/ContactGlass.css`,
      `${STYLES}/footer/FooterGlass.css`,
      `${STYLES}/header/HeaderGlass.css`,
    ],
    header: [`${HEADER}/HeaderGlass.astro`],
    footer: [`${SECTIONS}/footer/FooterGlass.astro`],
    ui: [`${UI}/glass/SectionHeading.astro`, `${UI}/glass/SectionTag.astro`],
    scripts: [],
    tokens: ['src/styles/tokens/glass.css'],
  },
  neo: {
    barrel: `${SECTIONS}/themes/neo.ts`,
    sections: [
      `${SECTIONS}/hero/HeroNeo.astro`,
      `${SECTIONS}/about/AboutNeo.astro`,
      `${SECTIONS}/features/FeaturesNeo.astro`,
      `${SECTIONS}/portfolio/PortfolioNeo.astro`,
      `${SECTIONS}/pricing/PricingNeo.astro`,
      `${SECTIONS}/testimonial/TestimonialNeo.astro`,
      `${SECTIONS}/faq/FAQNeo.astro`,
      `${SECTIONS}/cta/CTANeo.astro`,
      `${SECTIONS}/contact/ContactNeo.astro`,
    ],
    css: [
      `${STYLES}/hero/HeroNeo.css`,
      `${STYLES}/about/AboutNeo.css`,
      `${STYLES}/features/FeaturesNeo.css`,
      `${STYLES}/portfolio/PortfolioNeo.css`,
      `${STYLES}/pricing/PricingNeo.css`,
      `${STYLES}/testimonial/TestimonialNeo.css`,
      `${STYLES}/faq/FAQNeo.css`,
      `${STYLES}/cta/CTANeo.css`,
      `${STYLES}/contact/ContactNeo.css`,
      `${STYLES}/footer/FooterNeo.css`,
      `${STYLES}/header/HeaderNeo.css`,
    ],
    header: [`${HEADER}/HeaderNeo.astro`],
    footer: [`${SECTIONS}/footer/FooterNeo.astro`],
    ui: [`${UI}/neo/NeoSectionTag.astro`],
    scripts: [],
    tokens: [],
  },
  luxury: {
    barrel: `${SECTIONS}/themes/luxury.ts`,
    sections: [
      `${SECTIONS}/hero/HeroLuxury.astro`,
      `${SECTIONS}/about/AboutLuxury.astro`,
      `${SECTIONS}/features/FeaturesLuxury.astro`,
      `${SECTIONS}/portfolio/PortfolioLuxury.astro`,
      `${SECTIONS}/pricing/PricingLuxury.astro`,
      `${SECTIONS}/testimonial/TestimonialLuxury.astro`,
      `${SECTIONS}/faq/FAQLuxury.astro`,
      `${SECTIONS}/cta/CTALuxury.astro`,
      `${SECTIONS}/contact/ContactLuxury.astro`,
    ],
    css: [
      `${STYLES}/hero/HeroLuxury.css`,
      `${STYLES}/about/AboutLuxury.css`,
      `${STYLES}/features/FeaturesLuxury.css`,
      `${STYLES}/portfolio/PortfolioLuxury.css`,
      `${STYLES}/pricing/PricingLuxury.css`,
      `${STYLES}/testimonial/TestimonialLuxury.css`,
      `${STYLES}/faq/FAQLuxury.css`,
      `${STYLES}/cta/CTALuxury.css`,
      `${STYLES}/contact/ContactLuxury.css`,
      `${STYLES}/footer/FooterLuxury.css`,
      `${STYLES}/header/HeaderLuxury.css`,
    ],
    header: [
      `${HEADER}/HeaderLuxury.astro`,
      `${HEADER}/HeaderDesktopLuxury.astro`,
      `${HEADER}/SidebarStructureLuxury.astro`,
      `${HEADER}/DesktopControlsLuxury.astro`,
    ],
    footer: [`${SECTIONS}/footer/FooterLuxury.astro`],
    ui: [
      `${UI}/luxury/LuxuryButton.astro`,
      `${UI}/luxury/LuxuryCard.astro`,
      `${UI}/luxury/LuxurySectionLabel.astro`,
    ],
    scripts: ['src/scripts/luxury-interactions.js'],
    tokens: ['src/styles/tokens/luxury.css'],
  },
  minimal: {
    barrel: `${SECTIONS}/themes/minimal.ts`,
    sections: [
      `${SECTIONS}/hero/HeroMinimal.astro`,
      `${SECTIONS}/about/AboutMinimal.astro`,
      `${SECTIONS}/features/FeaturesMinimal.astro`,
      `${SECTIONS}/portfolio/PortfolioMinimal.astro`,
      `${SECTIONS}/pricing/PricingMinimal.astro`,
      `${SECTIONS}/testimonial/TestimonialMinimal.astro`,
      `${SECTIONS}/faq/FAQMinimal.astro`,
      `${SECTIONS}/cta/CTAMinimal.astro`,
      `${SECTIONS}/contact/ContactMinimal.astro`,
    ],
    css: [
      `${STYLES}/hero/HeroMinimal.css`,
      `${STYLES}/about/AboutMinimal.css`,
      `${STYLES}/portfolio/PortfolioMinimal.css`,
      `${STYLES}/pricing/PricingMinimal.css`,
      `${STYLES}/testimonial/TestimonialMinimal.css`,
      `${STYLES}/faq/FAQMinimal.css`,
      `${STYLES}/cta/CTAMinimal.css`,
      `${STYLES}/contact/ContactMinimal.css`,
      `${STYLES}/footer/FooterMinimal.css`,
      `${STYLES}/header/HeaderMinimal.css`,
    ],
    header: [`${HEADER}/HeaderMinimal.astro`],
    footer: [`${SECTIONS}/footer/FooterMinimal.astro`],
    ui: [],
    scripts: [],
    tokens: ['src/styles/tokens/minimal.css'],
  },
  aurora: {
    barrel: `${SECTIONS}/themes/aurora.ts`,
    sections: [
      `${SECTIONS}/hero/HeroAurora.astro`,
      `${SECTIONS}/about/AboutAurora.astro`,
      `${SECTIONS}/features/FeaturesAurora.astro`,
      `${SECTIONS}/portfolio/PortfolioAurora.astro`,
      `${SECTIONS}/pricing/PricingAurora.astro`,
      `${SECTIONS}/testimonial/TestimonialAurora.astro`,
      `${SECTIONS}/faq/FAQAurora.astro`,
      `${SECTIONS}/cta/CTAAurora.astro`,
      `${SECTIONS}/contact/ContactAurora.astro`,
    ],
    css: [
      `${STYLES}/hero/HeroAurora.css`,
      `${STYLES}/about/AboutAurora.css`,
      `${STYLES}/features/FeaturesAurora.css`,
      `${STYLES}/portfolio/PortfolioAurora.css`,
      `${STYLES}/pricing/PricingAurora.css`,
      `${STYLES}/testimonial/TestimonialAurora.css`,
      `${STYLES}/faq/FAQAurora.css`,
      `${STYLES}/cta/CTAAurora.css`,
      `${STYLES}/contact/ContactAurora.css`,
      `${STYLES}/footer/FooterAurora.css`,
      `${STYLES}/header/HeaderAurora.css`,
    ],
    header: [`${HEADER}/HeaderAurora.astro`],
    footer: [`${SECTIONS}/footer/FooterAurora.astro`],
    ui: [],
    scripts: [],
    tokens: [],
  },
};

/** All theme IDs */
export const ALL_THEMES = Object.keys(themeRegistry);

/**
 * Prune unselected themes from the project.
 * @param {string} selectedTheme - The single theme to keep
 * @returns {{ deletedFiles: number }} Summary
 */
export async function pruneThemes(selectedTheme) {
  const themesToRemove = ALL_THEMES.filter(t => t !== selectedTheme);
  let deletedFiles = 0;

  // 1. Delete all files for unselected themes
  for (const themeId of themesToRemove) {
    const manifest = themeRegistry[themeId];
    const allFiles = [
      manifest.barrel,
      ...manifest.sections,
      ...manifest.css,
      ...manifest.header,
      ...manifest.footer,
      ...manifest.ui,
      ...manifest.scripts,
      ...manifest.tokens,
    ];

    for (const file of allFiles) {
      if (await safeRemove(file)) deletedFiles++;
    }

    // Also try removing empty UI directories
    const uiDir = `${UI}/${themeId}`;
    await safeRemove(uiDir);
  }

  // 2. Update src/config/themes.ts — remove unselected theme entries
  let themesConfig = await readFile('src/config/themes.ts');
  if (themesConfig) {
    for (const themeId of themesToRemove) {
      // Remove the object literal block for this theme.
      // Use [^}]* (not [\s\S]*?) to avoid matching across multiple blocks.
      const blockRegex = new RegExp(
        `\\s*\\{[^}]*id:\\s*'${themeId}'[^}]*\\},?`,
        ''
      );
      themesConfig = themesConfig.replace(blockRegex, '');
    }
    await writeFile('src/config/themes.ts', themesConfig);
  }

  // 3. Update src/config/themePresets.ts — remove unselected theme presets
  let presetsConfig = await readFile('src/config/themePresets.ts');
  if (presetsConfig) {
    for (const themeId of themesToRemove) {
      presetsConfig = removeRecordEntry(presetsConfig, themeId);
    }
    await writeFile('src/config/themePresets.ts', presetsConfig);
  }

  // 4. Update src/config/themeRegistry.ts — remove unselected theme manifests
  let registryConfig = await readFile('src/config/themeRegistry.ts');
  if (registryConfig) {
    for (const themeId of themesToRemove) {
      registryConfig = removeRecordEntry(registryConfig, themeId);
    }
    await writeFile('src/config/themeRegistry.ts', registryConfig);
  }

  // 5. Update src/config/navigation.ts — remove theme icons for pruned themes
  let navConfig = await readFile('src/config/navigation.ts');
  if (navConfig) {
    for (const themeId of themesToRemove) {
      // Remove lines like:  liquid: '💧',
      navConfig = navConfig.replace(
        new RegExp(`\\s*${themeId}:\\s*'[^']*',?\\n?`, 'g'),
        '\n'
      );
    }
    await writeFile('src/config/navigation.ts', navConfig);
  }

  // 6. Update [theme].astro — remove unused imports and themeModules entries
  let themePage = await readFile('src/pages/[...lang]/[theme].astro');
  if (themePage) {
    for (const themeId of themesToRemove) {
      const capName = capitalize(themeId);
      // Remove import line
      themePage = themePage.replace(
        new RegExp(`\\s*import \\* as ${capName}Sections\\s+from[^;]+;\\n?`, 'g'),
        '\n'
      );
      // Remove themeModules entry
      themePage = themePage.replace(
        new RegExp(`\\s*${themeId}:\\s+${capName}Sections,?\\n?`, 'g'),
        '\n'
      );
    }
    await writeFile('src/pages/[...lang]/[theme].astro', themePage);
  }

  // 7. Update global.css — remove token imports for pruned themes
  let globalCss = await readFile('src/styles/global.css');
  if (globalCss) {
    for (const themeId of themesToRemove) {
      globalCss = globalCss.replace(
        new RegExp(`@import\\s+["']\\./tokens/${themeId}\\.css["'];?\\n?`, 'g'),
        ''
      );
    }
    await writeFile('src/styles/global.css', globalCss);
  }

  // 8. Update BaseLayout.astro — remove unused header imports
  let baseLayout = await readFile('src/layouts/BaseLayout.astro');
  if (baseLayout) {
    for (const themeId of themesToRemove) {
      const capName = capitalize(themeId);
      // Remove import lines for headers of pruned themes
      baseLayout = baseLayout.replace(
        new RegExp(`\\s*import\\s+\\w*Header${capName}?\\w*\\s+from[^;]*Header${capName}[^;]*;\\n?`, 'g'),
        '\n'
      );
    }
    await writeFile('src/layouts/BaseLayout.astro', baseLayout);
  }

  // 9. Remove luxury-specific CSS import if luxury is pruned
  if (themesToRemove.includes('luxury')) {
    let globalCssContent = await readFile('src/styles/global.css');
    if (globalCssContent) {
      globalCssContent = globalCssContent.replace(
        /@import\s+["']\.\/\_luxury-interactions\.css["'];?\n?/g,
        ''
      );
      await writeFile('src/styles/global.css', globalCssContent);
    }
  }

  return { deletedFiles };
}
