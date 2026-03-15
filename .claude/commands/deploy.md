# Build & Deploy

Build the project and deploy to the configured provider.

## Instructions

1. Read `src/config/providers/active-provider.ts` to determine the current provider

2. Run pre-deploy checks:
   ```bash
   pnpm check          # TypeScript diagnostics
   pnpm lint            # ESLint
   pnpm format:check    # Prettier check
   ```
   Fix any errors before proceeding.

3. Run the build:
   ```bash
   pnpm build
   ```
   This runs `astro build` then generates the search index.

4. Deploy based on provider:

   **Cloudflare Pages:**
   ```bash
   npx wrangler pages deploy dist
   ```

   **Vercel:**
   ```bash
   pnpm deploy:vercel
   ```

   **Netlify:**
   ```bash
   pnpm deploy:netlify
   ```

5. Report the deployment URL and status

## Pre-Deploy Checklist (verify these)

- [ ] All `pnpm check` diagnostics pass
- [ ] No lint errors
- [ ] Build completes without errors
- [ ] Search index generated in `public/search/`
- [ ] All enabled locales have translation files
- [ ] Environment variables are set (if any)
