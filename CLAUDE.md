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

### Three JS Variants

1. **`src/js/aos.js`** — Standard version. Uses scroll event listeners with throttle (99ms). Imports CSS. This is the main/default entry point.
2. **`src/js/aos-io.js`** — IntersectionObserver version. No scroll listeners; uses native IO API for much better performance with many elements. No IE11 support.
3. **`src/js/aos-core.js`** — Core logic WITHOUT CSS import. Used by modular builds so each can bundle only its animation CSS.

All three expose the same public API: `AOS.init(options)`, `AOS.refresh()`, `AOS.refreshHard()`.

### Modular Builds (`src/js/modular/`)

Tree-shakeable entry points that import aos-core + a single animation group's SCSS:
- `aos-fade.js`, `aos-zoom.js`, `aos-slide.js`, `aos-flip.js` (full)
- `aos-fade-lite.js`, `aos-zoom-lite.js`, `aos-slide-lite.js`, `aos-flip-lite.js` (lite — fewer duration/easing steps, ~56% smaller CSS)

### SASS Structure (`src/sass/`)

- `aos.scss` — Full bundle (imports core + easing + all animations)
- `_core.scss` — Duration/delay generators (50ms increments, 60 steps)
- `_core-lite.scss` — Optimized (100ms increments, 30 steps)
- `_easing.scss` — 18 easing functions; `_easing-lite.scss` — 8 essential
- `_animations.scss` — Imports all animation partials
- `animations/` — Individual partials: `_fade.scss`, `_zoom.scss`, `_slide.scss`, `_flip.scss`
- `modular/` — Per-animation-group SCSS entry points (full + lite)

### Key Helpers (`src/js/helpers/`)

- `handleScroll.js` — Core scroll logic: determines which elements are in viewport
- `prepare.js` — Prepares DOM elements with animation attributes
- `getInlineOption.js` — Parses `data-aos-*` attributes from elements
- `offsetCalculator.js` — Calculates element trigger positions

### Libs (`src/js/libs/`)

- `observer.js` — MutationObserver wrapper for dynamic DOM content
- `intersectionObserver.js` — IO implementation with observer pooling by config (anchor-placement + offset)
- `offset.js` — Offset parsing utilities

## Build Output

Rollup produces multiple bundles in `dist/`:
- Standard: `aos.js` (UMD), `aos.cjs.js`, `aos.esm.js`, `aos.css`
- IO: `aos-io.js` (UMD), `aos-io.cjs.js`, `aos-io.esm.js`
- Modular: `aos-{group}.cjs.js`, `aos-{group}.esm.js`, `aos-{group}.css` (8 variants)

Package exports are defined in `package.json` under `"exports"` for each variant.

## Testing

Cypress 2.1.0 e2e tests in `cypress/integration/` (17 spec files). Tests cover core functionality, custom events (`aos:in`/`aos:out`), mutation observation, and per-setting behavior. The test runner starts live-server serving `/demo` with `/dist` mounted.

## Style

- ESLint with babel-eslint parser, prettier plugin, single quotes
- 2-space indentation (`.editorconfig`)
- Runtime dependencies: `lodash.throttle`, `lodash.debounce`, `classlist-polyfill`
