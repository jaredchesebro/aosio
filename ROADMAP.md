# Roadmap

## Medium Priority — Stability

- **Prevent `refresh(true)` from firing twice on page load** — When `readyState` is `'interactive'`, `refresh(true)` runs immediately and again on `load`. The `load` listener callback should check `if (initialized) return`.

## Low Priority — Performance

- **Replace `containsAOSNode` recursive walk with `querySelector`** — The recursive function walks all children on every DOM mutation. Native `querySelector('[data-aos]')` is faster and simpler.
- **Optimize `refresh()` to skip stable observers on resize** — Every resize disconnects and rebuilds all IntersectionObservers. Only `*-center` and `*-top` placements use `window.innerHeight` in their `rootMargin`. Observers for `*-bottom` (the default) could survive resize unchanged.
- **Remove unused `observers` array from return value** — `intersectionObserver.js` allocates an `observers` array on every `createObserver()` call that nothing consumes. Only `disconnect()` and `activate()` are used.

## Low Priority — Code Simplification

- **Replace `Detector` class with plain functions** — `detector.js` exports a stateless class instantiated once. Plain exported functions avoid class/prototype overhead and are simpler.
- **Remove `orientationchange` listener** — `resize` already fires on orientation change in all modern browsers. The second listener is redundant.
- **Inline `elements.js` helper** — It's a one-liner (`querySelectorAll` + map). Inlining it into `initializeObservers` removes a module boundary and import for no loss of clarity.
- **Unwrap `{ node }` element wrapper** — `elements.js` wraps each DOM node in `{ node }` — a legacy pattern from the original AOS where extra properties were stored alongside. In the IO version those properties live in `elementConfigs` inside `createObserver()`. Return plain DOM nodes instead.
- **Use modern array methods** — Replace `Array.prototype.slice.call` in `observer.js` with spread (`[...mutation.addedNodes]`). All target browsers support it.

## Low Priority — Build & Config

- **Skip CSSNano in dev mode** — `cssnano` runs on every watch rebuild unnecessarily. Conditionally include it: `[autoprefixer, !isDev && cssnano].filter(Boolean)`.
- **Add `exports` and `sideEffects` to `package.json`** — Modern bundlers benefit from the `"exports"` map for module resolution and `"sideEffects": ["*.css", "*.scss"]` for tree-shaking.
- **Remove unnecessary Rollup plugins** — `@rollup/plugin-node-resolve` and `@rollup/plugin-commonjs` are not needed — zero runtime dependencies, all local ES module imports.
- **Stub SCSS import in ESM build** — The ESM build processes SCSS through PostCSS then discards it (`extract: false, inject: false`). Replace with a simple stub plugin to skip Sass compilation entirely.
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
