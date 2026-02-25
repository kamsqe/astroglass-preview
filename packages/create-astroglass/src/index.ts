#!/usr/bin/env node
/**
 * create-astroglass — CLI entry point
 *
 * Usage:
 *   npm create astroglass@latest [dir] [options]
 *
 * Options:
 *   --preset <name>   Use a preset (minimal, standard, full)
 *   --theme <id>      Select a single theme
 *   --locales <list>  Comma-separated locale codes
 *   --palettes <list> Comma-separated palette ids
 *   --deploy <target> Deploy target (cloudflare, vercel, netlify, static)
 *   --yes             Skip confirmation prompts
 *   --dry-run         Show what would be done without writing files
 */

import { defineCommand, runMain } from 'citty';
import { showBanner } from './prompts/banner.js';
import { runQuickStart } from './prompts/quick-start.js';
import { runCustomFlow } from './prompts/custom.js';
import { runPresetFlow } from './prompts/preset.js';
import { scaffold } from './scaffold/index.js';
import { showSummary } from './summary.js';
import { statusCommand } from './commands/status.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { repairCommand } from './commands/repair.js';
import * as p from '@clack/prompts';

export interface UserChoices {
  projectDir: string;
  themes: string[];
  palettes: string[];
  locales: string[];
  features: string[];
  deployTarget: string;
  defaultPalette: string;
}

// ─── Subcommands ───

const statusCmd = defineCommand({
  meta: { name: 'status', description: 'Show project configuration' },
  args: {
    validate: { type: 'boolean', description: 'Validate filesystem consistency', default: false },
  },
  async run({ args }) {
    await statusCommand({ validate: args.validate });
  },
});

const addCmd = defineCommand({
  meta: { name: 'add', description: 'Add a theme, palette, language, or feature' },
  args: {
    theme:   { type: 'string', description: 'Theme to add' },
    palette: { type: 'string', description: 'Palette to add' },
    lang:    { type: 'string', description: 'Language to add' },
    feature: { type: 'string', description: 'Feature to add (blog, docs, dashboard, react)' },
    'dry-run': { type: 'boolean', description: 'Preview changes', default: false },
  },
  async run({ args }) {
    await addCommand({
      theme: args.theme,
      palette: args.palette,
      lang: args.lang,
      feature: args.feature,
      dryRun: args['dry-run'],
    });
  },
});

const removeCmd = defineCommand({
  meta: { name: 'remove', description: 'Remove a theme, palette, language, or feature' },
  args: {
    theme:   { type: 'string', description: 'Theme to remove' },
    palette: { type: 'string', description: 'Palette to remove' },
    lang:    { type: 'string', description: 'Language to remove' },
    feature: { type: 'string', description: 'Feature to remove' },
    force:   { type: 'boolean', description: 'Skip confirmation', default: false },
    'dry-run': { type: 'boolean', description: 'Preview changes', default: false },
  },
  async run({ args }) {
    await removeCommand({
      theme: args.theme,
      palette: args.palette,
      lang: args.lang,
      feature: args.feature,
      force: args.force,
      dryRun: args['dry-run'],
    });
  },
});

const repairCmd = defineCommand({
  meta: { name: 'repair', description: 'Validate and fix project configuration' },
  args: {
    fix: { type: 'boolean', description: 'Auto-fix without prompting', default: false },
    'dry-run': { type: 'boolean', description: 'Preview changes', default: false },
  },
  async run({ args }) {
    await repairCommand({ fix: args.fix, dryRun: args['dry-run'] });
  },
});

// ─── Main (init) Command ───

const main = defineCommand({
  meta: {
    name: 'create-astroglass',
    version: '1.0.0',
    description: 'Scaffold and manage Astroglass projects',
  },
  args: {
    dir: {
      type: 'positional',
      description: 'Project directory',
      required: false,
    },
    preset: {
      type: 'string',
      description: 'Use a preset (minimal, standard, full)',
    },
    theme: {
      type: 'string',
      description: 'Select a single theme',
    },
    locales: {
      type: 'string',
      description: 'Comma-separated locale codes',
    },
    palettes: {
      type: 'string',
      description: 'Comma-separated palette ids',
    },
    deploy: {
      type: 'string',
      description: 'Deploy target',
      default: 'cloudflare',
    },
    yes: {
      type: 'boolean',
      description: 'Skip confirmation prompts',
      default: false,
    },
    'dry-run': {
      type: 'boolean',
      description: 'Show what would be done',
      default: false,
    },
  },
  subCommands: {
    status: statusCmd,
    add: addCmd,
    remove: removeCmd,
    repair: repairCmd,
  },
  async run({ args }) {
    showBanner();

    // Determine the flow based on args
    let choices: UserChoices;

    if (args.preset) {
      choices = await runPresetFlow(args.dir, args.preset, args);
    } else if (args.theme) {
      choices = {
        projectDir: args.dir || './my-astroglass',
        themes: [args.theme],
        palettes: args.palettes?.split(',') ?? ['azure'],
        locales: args.locales?.split(',') ?? ['en'],
        features: [],
        deployTarget: args.deploy ?? 'cloudflare',
        defaultPalette: args.palettes?.split(',')[0] ?? 'azure',
      };
    } else {
      p.intro('Let\'s create your Astroglass project!');

      const mode = await p.select({
        message: 'How would you like to get started?',
        options: [
          { value: 'quick', label: '⚡ Quick Start', hint: '5 questions, done in 30 seconds' },
          { value: 'preset', label: '📦 Use a Preset', hint: 'Minimal, Standard, or Full' },
          { value: 'custom', label: '🎨 Custom', hint: 'Pick themes per section' },
        ],
      });

      if (p.isCancel(mode)) {
        p.cancel('Setup cancelled.');
        process.exit(0);
      }

      switch (mode) {
        case 'quick':
          choices = await runQuickStart(args.dir);
          break;
        case 'preset':
          choices = await runPresetFlow(args.dir, undefined, args);
          break;
        case 'custom':
          choices = await runCustomFlow(args.dir);
          break;
        default:
          choices = await runQuickStart(args.dir);
      }
    }

    if (!args.yes && !args['dry-run']) {
      const confirmed = await p.confirm({
        message: 'Ready to scaffold your project?',
      });

      if (p.isCancel(confirmed) || !confirmed) {
        p.cancel('Setup cancelled.');
        process.exit(0);
      }
    }

    const result = await scaffold(choices, {
      dryRun: args['dry-run'] ?? false,
    });

    showSummary(choices, result);
  },
});

runMain(main);

