// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { createRequire } from 'module';
import { dirname } from 'path';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { defaultLocale, getEnabledLocaleCodes } from './src/config/locales';

// The Cloudflare adapter (@astrojs/cloudflare@13.1.1 + @cloudflare/vite-plugin@1.27.0)
// has a bug where its workerd build-time simulation routes ALL module requests (including
// Node.js built-ins) through the Vite SSR module server, which can't serve them.
// This causes build failures for cloudflare:workers, node:events, etc.
// Since this project uses output:'static' (no SSR), the adapter is not needed for
// production builds — Cloudflare Pages can serve static assets directly.
// TODO: re-enable the adapter once @cloudflare/vite-plugin fixes the CustomModuleRunner.
// Detect build vs dev from both npm lifecycle and direct CLI invocation.
const isDev = process.env.npm_lifecycle_event === 'dev' || process.argv.includes('dev');
const isBuild = process.env.npm_lifecycle_event === 'build' || process.argv.includes('build');

// Dynamically import the Cloudflare adapter only when NOT building.
// The adapter's @cloudflare/vite-plugin has side effects at import time that register
// Vite environments, causing lightningcss/workerd resolution errors during static builds.
// Since this project uses output:'static', Cloudflare Pages serves static assets directly.
const adapter =
  isDev || isBuild ? undefined : (await import('./src/config/providers/active-provider')).adapter;

// Require function in the config's Node.js context — used by the CJS interop plugin below.
const _require = createRequire(import.meta.url);

// Node.js built-in module names (bare and node:-prefixed) that Vite's module runner
// cannot externalize on its own. We pre-load them into globalThis here (where we have
// a full Node.js context) and serve them via a virtual shim in the plugin below.
const NODE_BUILTIN_NAMES = new Set([
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'diagnostics_channel',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib',
]);

// @ts-ignore
globalThis.__nodeBuiltinShims__ = /** @type {Record<string, unknown>} */ ({});
for (const name of NODE_BUILTIN_NAMES) {
  try {
    // @ts-ignore
    globalThis.__nodeBuiltinShims__[name] = name === 'process' ? process : _require(`node:${name}`);
  } catch {
    /* ignore built-ins not available in this Node.js version */
  }
}

import react from '@astrojs/react';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Adapter disabled: see comment above about @cloudflare/vite-plugin@1.27.0 bug.
  // Re-enable once the CustomModuleRunner bug is fixed upstream.
  adapter,
  integrations: [
    expressiveCode({
      themes: ['dracula', 'github-light'],
      themeCssSelector: (theme, context) => {
        // Dark themes - High contrast Dracula
        if (theme.name === 'dracula') {
          return '[data-theme="abyss"], [data-theme="neonoir"], [data-theme="synthwave"]';
        }
        // Light themes - Default Github Light
        // Explicitly listing them ensures no specificity conflicts with the dark theme
        return '[data-theme="azure"], [data-theme="solaris"], [data-theme="nordic"], [data-theme="evergreen"], [data-theme="rose"], [data-theme="aquatica"], [data-theme="monochrome"]';
      },
      styleOverrides: {
        borderColor: 'hsl(var(--bc) / 0.1)',
        borderRadius: '0.75rem',
        frames: {
          frameBoxShadowCssValue: 'none',
          editorActiveTabBorderColor: 'transparent',
          editorTabBarBorderColor: 'hsl(var(--bc) / 0.1)',
          editorActiveTabIndicatorHeight: '2px',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorActiveTabIndicatorBottomColor: 'hsl(var(--a))',
        },
        uiFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      },
    }),
    mdx(),
    react(),
  ],
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.google(),
    },
  ],
  vite: {
    // @ts-ignore
    plugins: [
      tailwindcss(),
      // Prevent native build-time packages from being scanned by esbuild during
      // the Cloudflare worker's optimizeDeps phase. lightningcss and fsevents are
      // transitive deps of Astro/Vite internals that have no place in a workerd bundle.
      {
        name: 'exclude-native-deps-from-worker',
        enforce: 'pre',
        apply: 'build',
        configEnvironment(name, _opts) {
          // Exclude native build-time packages from esbuild's optimization scan
          // in ALL environments (especially Cloudflare worker simulation).
          return {
            optimizeDeps: {
              exclude: [
                'lightningcss',
                'fsevents',
                ...[...NODE_BUILTIN_NAMES].map((n) => `node:${n}`),
              ],
            },
          };
        },
        resolveId(source) {
          // Tell the module runner to externalize these built-ins,
          // rather than trying to resolve and bundle them for workerd.
          if (source.startsWith('node:') || NODE_BUILTIN_NAMES.has(source)) {
            return { id: source, external: true };
          }
        },
      },
      // Vite 7's SSR module runner (used during both dev serving AND build-time sync/prerender)
      // cannot externalize Node.js built-ins on its own — not even node:-prefixed ones.
      // Provide virtual shims backed by the real modules (grabbed here in Node.js context)
      // so the runner can load them. Also stubs cloudflare:* built-ins for the
      // @cloudflare/vite-plugin@1.27.0 workerd simulation (which has the same issue).
      // This plugin runs in BOTH serve and build modes (no `apply` restriction).
      {
        name: 'node-builtin-shims',
        enforce: 'pre',
        resolveId(id, importer, options) {
          if (!options?.ssr) return null;
          if (id.startsWith('node:')) {
            return `\0virtual:node-builtin:${id.slice(5)}`;
          }
          if (NODE_BUILTIN_NAMES.has(id)) {
            return `\0virtual:node-builtin:${id}`;
          }
          // Cloudflare built-in modules (needed for workerd simulation stubs)
          if (id.startsWith('cloudflare:')) {
            return `\0virtual:cloudflare-builtin:${id.slice(11)}`;
          }
          return null;
        },
        load(id, options) {
          if (!options?.ssr) return null;
          if (id.startsWith('\0virtual:node-builtin:')) {
            const modName = id.slice('\0virtual:node-builtin:'.length);
            // @ts-ignore
            if (!globalThis.__nodeBuiltinShims__[modName]) {
              try {
                // @ts-ignore
                globalThis.__nodeBuiltinShims__[modName] = _require(`node:${modName}`);
              } catch {
                try {
                  // @ts-ignore
                  globalThis.__nodeBuiltinShims__[modName] = _require(modName);
                } catch {}
              }
            }
            // @ts-ignore
            const mod = globalThis.__nodeBuiltinShims__[modName];
            if (mod == null) return `export default {};`;
            const keys = Object.keys(mod).filter((k) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k));
            const namedExports = keys
              .map(
                (k) => `export const ${k} = globalThis.__nodeBuiltinShims__['${modName}']['${k}'];`,
              )
              .join('\n');
            return `${namedExports}\nexport default globalThis.__nodeBuiltinShims__['${modName}'];`;
          }
          if (id.startsWith('\0virtual:cloudflare-builtin:')) {
            const modName = id.slice('\0virtual:cloudflare-builtin:'.length);
            // Return minimal stubs for known cloudflare: built-ins
            if (modName === 'workers') {
              return `
                export class WorkerEntrypoint {}
                export class DurableObject {}
                export class WorkflowEntrypoint {}
                export const env = {};
              `;
            }
            return `export default {};`;
          }
          return null;
        },
      },
      // Vite 7's module runner evaluates CJS node_modules as ESM (no module/exports/require).
      // This plugin injects those globals so CJS packages work in the module runner context,
      // which is used during BOTH dev serving AND build-time sync/prerender steps.
      {
        name: 'cjs-esm-interop',
        enforce: 'pre',
        resolveId(id, importer, options) {
          if (!options?.ssr) return null;
          // Force react-dom/server to the browser (web streams) version.
          // The default `node` condition resolves to server.node.js which requires
          // Node.js built-ins (util, async_hooks, stream) not available in the module runner.
          if (id === 'react-dom/server') {
            return _require.resolve('react-dom/server.browser');
          }
          return null;
        },
        transform(code, id, options) {
          if (!options?.ssr) return null;
          // Skip Rollup's client bundle environment — @rollup/plugin-commonjs handles CJS there.
          // We only need to shim CJS in module runner contexts (server, prerender, astro env).
          const envName = this.environment?.name;
          if (envName === 'client') return null;

          // Strip Vite's query parameters (e.g. ?v=abc123)
          const cleanId = id.replace(/[?#].*$/, '');

          // Only transform CJS files in node_modules
          if (
            !cleanId.includes('node_modules') ||
            cleanId.endsWith('.mjs') ||
            cleanId.endsWith('.mts')
          )
            return null;

          // Skip ESM files: check for import/export statements (but not inside strings).
          // Wrapping ESM files with CJS shims causes duplicate default export declarations.
          // Use a more precise check: look for `import ` or `export ` at start of line or after semicolons.
          const hasESMSyntax =
            /(?:^|;)\s*(?:import\s|export\s)/m.test(code) ||
            /\bexport\s*\{/.test(code) ||
            /\bexport\s+default\b/.test(code);
          if (hasESMSyntax) return null;

          // Also skip if we can't require() the file (it might not be CJS)
          let requireSucceeded = false;
          try {
            _require(cleanId);
            requireSucceeded = true;
          } catch {
            /* not requireable */
          }
          if (!requireSucceeded) return null;

          // Get named exports at transform time (in the real Node.js context) so
          // we can re-export them as named ESM bindings for consumers.
          let namedKeys = [];
          try {
            const mod = _require(cleanId);
            if (typeof mod === 'object' && mod !== null) {
              namedKeys = Object.keys(mod).filter(
                (k) =>
                  k !== '__esModule' && k !== 'default' && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k),
              );
            }
          } catch {
            /* ignore – some packages can't be require()'d at transform time */
          }

          // Use unique binding names to avoid conflicts with identifiers in the module body.
          // e.g. cookie exports `parseCookie` as both a function decl and a named export.
          const namedExportLines = namedKeys.flatMap((k) => [
            `const __cjs_e_${k}__ = __cjs_m__.exports.${k};`,
            `export { __cjs_e_${k}__ as ${k} };`,
          ]);

          // Inject all standard CJS globals (module, exports, require, __filename, __dirname).
          // We provide `require` via createRequire(__filename) so both static and dynamic
          // require() calls resolve correctly through Node.js's native module resolution —
          // no need to transform require() calls to import() at all.
          return {
            code: [
              'const __cjs_m__ = { exports: {} };',
              'let exports = __cjs_m__.exports;',
              'const module = __cjs_m__;',
              `const __filename = ${JSON.stringify(cleanId)};`,
              `const __dirname = ${JSON.stringify(dirname(cleanId))};`,
              "const require = globalThis.__nodeBuiltinShims__['module'].createRequire(__filename);",
              code,
              'export default __cjs_m__.exports;',
              ...namedExportLines,
            ].join('\n'),
            map: null,
          };
        },
      },
    ],
    optimizeDeps: {
      include: ['valibot'],
      // Prevent native build-time tools from entering esbuild's optimization scan —
      // they contain .node files that esbuild/workerd cannot handle.
      exclude: ['lightningcss', 'fsevents'],
    },
    // Keep them out of the Rollup SSR bundle as well.
    ssr: {
      external: ['lightningcss', 'fsevents'],
    },
  },
  i18n: {
    defaultLocale,
    locales: getEnabledLocaleCodes(),
  },
  // CSP disabled: blocks client:only component hydration and inline event handlers,
  // preventing the search dialog from opening. Re-enable once CSP nonce support
  // is stable for client:only directives in Astro 6.
  // security: {
  //   csp: true,
  // },
});
