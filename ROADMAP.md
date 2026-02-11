# Roadmap

## Low Priority — Build & Config

- **Stub SCSS import in ESM build** — The ESM build processes SCSS through PostCSS then discards it (`extract: false, inject: false`). Replace with a simple stub plugin to skip Sass compilation entirely.
- **Remove unnecessary Rollup plugins** — `@rollup/plugin-node-resolve` and `@rollup/plugin-commonjs` are not needed — zero runtime dependencies, all local ES module imports.
- **Remove `_easing.scss` from import chain** — The file is comment-only and emits zero CSS. It can be removed from `aosio.scss` (or converted to a `.md` reference) with no output change.
- **Fix `_easing.scss` cubic-bezier values** — Several comment values (`ease-out-cubic`, `ease-in-out-cubic`, `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart`) are copy-pasted duplicates of the quad easings. Should match the correct values in `resolveEasing.js`.

## Completed

- **Remove UA-sniffing device detector** — Replaced `detector.js` regex patterns with modern `matchMedia` checks (`pointer: coarse`, `hover: none`). Removed dead `ie11()` method.
- **Drop `lodash.debounce` dependency** — Replaced with inline debounce to make the library zero-dependency.
- **Clean up `observer.js` legacy fallbacks** — Removed prefixed `WebKitMutationObserver`/`MozMutationObserver` checks and `isSupported()` guard.
- **`data-aos-anchor`** — Trigger an animation based on another element's scroll position.
- **Add `destroy()` method** — Full teardown that removes event listeners, CSS custom properties, and resets all state beyond what `disable()` does.
- **Fix `getInlineOption` null check** — `getAttribute()` returns `null`, not `undefined`. Changed `typeof attr !== 'undefined'` to `attr !== null`.
- **Fix `"private"` type in package.json** — Changed `"private": "true"` (string) to `"private": true` (boolean).
- **Drop CSS-native keywords from `resolveEasing` map** — Removed `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out` from the map since browsers handle them natively. The fallthrough (`return name`) already passes them through.
- **Add ESM build output** — Added a second Rollup output (`dist/aosio.esm.js`, `format: 'es'`) and `"main"`/`"module"` fields in `package.json` so bundlers can import AOS as an ES module.
- **Remove `pointer-events: none` on un-animated elements** — Removed the `pointer-events: none` rule from `_core.scss` that blocked interaction on all `[data-aos]` elements until they animated.
- **Stop `disable()` from stripping `data-aos` attributes** — Removed `removeAttribute('data-aos-*')` calls from `disable()` so user markup is preserved and re-initialization works after `disable()` or `destroy()`.
- **Fix `Object.assign` mutating default options** — Froze defaults as a constant and changed `init()` to merge into a fresh object (`Object.assign({}, defaults, settings)`) so each call starts clean.
- **Guard against double initialization** — `init()` now calls `destroy()` first if already initialized, preventing listener and observer leaks on repeated calls.
- **Fix `getInlineOption` falsy-value fallback** — Changed `return attr || fallback` to `return attr ?? fallback` so values like `"0"` are preserved instead of falling through to the default.
- **Only trigger MutationObserver rebuild on additions** — Removed `removedNodes` from the MutationObserver check so only newly added `[data-aos]` elements trigger `refreshHard()`.
- **Prevent `refresh(true)` from firing twice on page load** — Added `if (!initialized)` guard to the `load` listener so `refresh(true)` doesn't run again when it already fired for `DOMContentLoaded`.
- **Skip observer rebuild on width-only resizes** — Cache `window.innerHeight` and skip `refresh()` when only width changes, since rootMargin is vertical only.
- **Replace `containsAOSNode` recursive walk with `querySelector`** — Replaced manual recursive tree walk with native `querySelector('[data-aos]')` and modernized array handling.
- **Remove unused `observers` array from return value** — Removed the `observers` array property from `createObserver()` return value that was allocated but never consumed.
- **Inline `elements.js` and unwrap `{ node }` wrapper** — Deleted `elements.js`, inlined `querySelectorAll` into `aosio.js`, and changed `$aosElements` to hold plain DOM nodes. Removed `el.node` indirection throughout.
- **Replace `Detector` class with plain functions** — Replaced the `Detector` class with plain arrow functions. Same API, no class/prototype overhead.
- **Remove `orientationchange` listener** — Removed redundant listener since `resize` already fires on orientation change in all modern browsers.
- **Add `exports` and `sideEffects` to `package.json`** — Added `"exports"` map for modern bundler resolution and `"sideEffects"` for CSS/SCSS to enable tree-shaking.
- **Skip CSSNano in dev mode** — Conditionally include CSSNano only in production builds so dev watch rebuilds are faster.
