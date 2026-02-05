---
title: "Getting Started"
description: "How to use Liquid Glass."
order: 1
layout: v1
---

# Getting Started

Welcome to the **Liquid Glass** starter kit. This template is designed for high-performance documentation and marketing sites, built with Astro 5.0 and Tailwind CSS.

## Key Features

- **Fuse.js Search**: Client-side fuzzy search with custom indexing (replaced Pagefind).
- **Internationalization**: Native i18n support for English (`en`) and Russian (`ru`).
- **Glassmorphism UI**: Premium visual style with backdrop filters and smooth animations.
- **Mobile First**: Optimized navigation drawer and touch-friendly interactions.

## Search Architecture

The search system uses **Fuse.js** for a customizable, "premium" feel.
- **Index Generation**: Run `pnpm build` to generate `public/search/{locale}.json`.
- **Frontend**: The `CommandPalette` component loads the index and handles fuzzy matching.
- **Customization**: Adjust weights and thresholds in `src/components/docs/CommandPalette.astro`.

## quick Start

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Start development server**:
    ```bash
    pnpm dev
    ```
3.  **Build for production**:
    ```bash
    pnpm build
    ```
