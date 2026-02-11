# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AOSIO (Animate On Scroll via Intersection Observer) — a lightweight JavaScript library that animates elements as they scroll into view. Uses the native IntersectionObserver API instead of scroll events for better performance and battery life. No IE11 support (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+).

## Commands

- **Build:** `npm run build` (production Rollup build)
- **Dev:** `npm run dev` (watch + live-server on port 8080)
- **Lint:** `npm run lint` (ESLint on src)

## Architecture

### JS

**`src/js/aosio.js`** — Main entry point. Uses IntersectionObserver for detecting when elements enter/leave the viewport. No scroll listeners. Global settings are applied as CSS custom properties (`--aos-duration`, `--aos-delay`, `--aos-easing`) on `<body>`.

Public API: `AOS.init(options)`, `AOS.refresh()`, `AOS.refreshHard()`, `AOS.destroy()`.

### Key Helpers (`src/js/helpers/`)

- `getInlineOption.js` — Parses `data-aos-*` attributes from elements
- `elements.js` — Collects and prepares AOS elements from the DOM
- `detector.js` — Device detection via matchMedia (mobile, phone, tablet)
- `resolveEasing.js` — Maps easing names to CSS timing functions

### Libs (`src/js/libs/`)

- `observer.js` — MutationObserver wrapper for dynamically added DOM content (uses unprefixed `MutationObserver` directly)
- `intersectionObserver.js` — IO implementation with observer pooling by config (anchor-placement + offset)

### SASS Structure (`src/sass/`)

- `aosio.scss` — Full bundle (imports core + animations)
- `_core.scss` — Core styles using CSS custom properties for duration, delay, and easing. Wraps animations in `@media (prefers-reduced-motion: no-preference)` for accessibility
- `_easing.scss` — 18 easing function definitions (documentation/reference only, no CSS output)
- `_animations.scss` — Imports all animation partials
- `animations/` — Individual partials: `_config.scss`, `_fade.scss`, `_zoom.scss`, `_slide.scss`, `_flip.scss`

## Build Output

Rollup produces `dist/aosio.js` (UMD, global `AOS`), `dist/aosio.css`, and a sourcemap. CSS is processed with Autoprefixer and CSSNano in production.

## Style

- ESLint flat config with eslint-plugin-prettier, single quotes
- ES2022 for src, CommonJS for scripts
- 2-space indentation, LF line endings (`.editorconfig`)
- No runtime dependencies
