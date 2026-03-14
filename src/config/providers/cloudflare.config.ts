/**
 * Cloudflare Provider Configuration
 *
 * Astro adapter configuration for Cloudflare Pages deployment.
 *
 * @see https://docs.astro.build/en/guides/deploy/cloudflare/
 */

import cloudflare from '@astrojs/cloudflare';

/** Cloudflare adapter with image service */
export const adapter = cloudflare({
  // Site is fully static (output: 'static'), so all routes are prerendered.
  // Use Node.js for prerendering to avoid CJS compatibility issues with workerd.
  // imageService: 'compile' is omitted — the @cloudflare/vite-plugin@1.27.0 worker
  // simulation has a bug resolving cloudflare:workers in build mode when image routes
  // are registered; use Astro's default sharp service instead.
  prerenderEnvironment: 'node',
});

/** Output mode for Cloudflare */
export const output = 'static' as const;

/** Provider name for display */
export const providerName = 'Cloudflare Pages';

/** Provider-specific build notes */
export const buildNotes = `
  Deploy to Cloudflare Pages automatically by configuring GitHub integration.
  (Local deploy with wrangler is no longer required)
`;
