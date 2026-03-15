# Switch Deployment Provider

Switch the deployment target between Cloudflare Pages, Vercel, and Netlify.

## Instructions

1. Ask the user which provider they want to switch to:
   - **Cloudflare Pages** (default) — `@astrojs/cloudflare`
   - **Vercel** — `@astrojs/vercel`
   - **Netlify** — `@astrojs/netlify`

2. Install the required adapter if not already present:
   - Cloudflare: `pnpm add @astrojs/cloudflare` (already installed by default)
   - Vercel: `pnpm add @astrojs/vercel`
   - Netlify: `pnpm add @astrojs/netlify`

3. Update `src/config/providers/active-provider.ts`:
   - Change the import to point to the selected provider config file
   - e.g., `export { adapter, output, providerName, buildNotes } from './vercel.config';`

4. Review `astro.config.mjs`:
   - The config imports `adapter` and `output` from `active-provider.ts`
   - Check if any provider-specific Vite plugins need adjustment
   - The Cloudflare-specific native deps exclusion (lines ~106-125) can be removed for other providers

5. Update deploy scripts in `package.json` if needed

6. Run `pnpm check` then `pnpm build` to verify the build succeeds

## Provider-Specific Notes

### Cloudflare Pages
- Config: `wrangler.jsonc` (already present)
- Preview: `pnpm preview` uses `wrangler pages dev dist`
- Deploy: Connect GitHub repo to Cloudflare Pages dashboard, or use `wrangler pages deploy dist`

### Vercel
- May need a `vercel.json` for custom configuration
- Preview: `pnpm preview:vercel` uses `vercel dev`
- Deploy: `pnpm deploy:vercel`

### Netlify
- May need a `netlify.toml` for custom configuration
- Preview: `pnpm preview:netlify` uses `netlify dev`
- Deploy: `pnpm deploy:netlify`
