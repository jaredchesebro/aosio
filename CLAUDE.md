# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AOS (Animate On Scroll) — a lightweight JavaScript library that animates elements as they scroll into view. Version 3.0.0-beta.6, on the `feature/modular` branch (PR target: `next`).

## Commands

- **Build:** `npm run build` (production Rollup build)
- **Dev:** `npm run dev` (parallel watch + live-server on port 8080)
- **Watch only:** `npm run watch`
- **Lint:** `npm run lint` (ESLint on src, cypress, demo, scripts)
- **Test:** `npm test` (lint + Cypress e2e tests via `scripts/run-cypress-tests.js`)
- **Test interactive:** `npm run test:dev` (opens Cypress runner)

Note: The test script references `yarn lint` internally but `npm run lint` works equivalently.

## Architecture

### JS

**`src/js/aosio.js`** — IntersectionObserver version. No scroll listeners; uses native IO API for much better performance with many elements. No IE11 support.

All three expose the same public API: `AOS.init(options)`, `AOS.refresh()`, `AOS.refreshHard()`.

### SASS Structure (`src/sass/`)

- `aos.scss` — Full bundle (imports core + easing + all animations)
- `_core.scss` — Duration/delay generators (50ms increments, 60 steps)
- `_easing.scss` — 18 easing functions; `_easing-lite.scss` — 8 essential
- `_animations.scss` — Imports all animation partials
- `animations/` — Individual partials: `_fade.scss`, `_zoom.scss`, `_slide.scss`, `_flip.scss`

### Key Helpers (`src/js/helpers/`)

- `getInlineOption.js` — Parses `data-aos-*` attributes from elements

### Libs (`src/js/libs/`)

- `observer.js` — MutationObserver wrapper for dynamic DOM content
- `intersectionObserver.js` — IO implementation with observer pooling by config (anchor-placement + offset)

## Build Output

Rollup produces multiple bundles in `dist/`:
- Standard: `aosio.js` (UMD), `aosio.css`

Package exports are defined in `package.json` under `"exports"` for each variant.

## Style

- ESLint with babel-eslint parser, prettier plugin, single quotes
- 2-space indentation (`.editorconfig`)
- Runtime dependencies: `lodash.throttle`, `lodash.debounce`, `classlist-polyfill`
