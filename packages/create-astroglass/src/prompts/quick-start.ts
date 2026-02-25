/**
 * Quick Start — 5-prompt flow for the fastest setup
 */
import * as p from '@clack/prompts';
import type { UserChoices } from '../index.js';
import {
  AVAILABLE_THEMES,
  AVAILABLE_PALETTES,
  AVAILABLE_LOCALES,
  AVAILABLE_FEATURES,
  DEPLOY_TARGETS,
  resolveFeatureDeps,
} from './shared.js';

export async function runQuickStart(dirArg?: string): Promise<UserChoices> {
  // 1. Project directory
  const projectDir = dirArg || await p.text({
    message: 'Where should we create your project?',
    placeholder: './my-astroglass',
    defaultValue: './my-astroglass',
    validate: (value) => {
      if (!value) return 'Please enter a directory path';
    },
  });

  if (p.isCancel(projectDir)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  // 2. Pick a theme
  const theme = await p.select({
    message: 'Choose a theme:',
    options: AVAILABLE_THEMES.map(t => ({
      value: t.id,
      label: t.label,
      hint: t.hint,
    })),
  });

  if (p.isCancel(theme)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  // 3. Pick palettes (multi-select)
  const palettes = await p.multiselect({
    message: 'Select color palettes:',
    options: AVAILABLE_PALETTES.map(p => ({
      value: p.id,
      label: p.label,
      hint: p.category,
    })),
    initialValues: ['azure'],
    required: true,
  });

  if (p.isCancel(palettes)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  // 4. Features
  const features = await p.multiselect({
    message: 'Include extra features?',
    options: AVAILABLE_FEATURES.map(f => ({
      value: f.id,
      label: f.label,
      hint: f.hint,
    })),
    initialValues: [],
    required: false,
  });

  if (p.isCancel(features)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  // 5. Deploy target
  const deploy = await p.select({
    message: 'Deploy target:',
    options: DEPLOY_TARGETS.map(d => ({
      value: d.value,
      label: d.label,
      hint: d.hint,
    })),
  });

  if (p.isCancel(deploy)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  const resolvedFeatures = resolveFeatureDeps(features as string[]);

  return {
    projectDir: projectDir as string,
    themes: [theme as string],
    palettes: palettes as string[],
    locales: ['en'],
    features: resolvedFeatures,
    deployTarget: deploy as string,
    defaultPalette: (palettes as string[])[0] || 'azure',
  };
}
