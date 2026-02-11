# Roadmap

## Maybe

- **Add ESM build output** — Add a second Rollup output (`dist/aosio.esm.js`) and a `"module"` field in `package.json` for tree-shaking support.
- **Replace `Detector` class with plain functions** — `detector.js` exports a stateless class instantiated once. Plain exported functions avoid class/prototype overhead and are simpler.
- **Remove `orientationchange` listener** — `resize` already fires on orientation change in all modern browsers. The second listener is redundant.
- **Inline `elements.js` helper** — It's a one-liner (`querySelectorAll` + map). Inlining it into `initializeObservers` removes a module boundary and import for no loss of clarity.
- **Remove `_easing.scss` from import chain** — The file is comment-only and emits zero CSS. It can be removed from `aosio.scss` (or converted to a `.md` reference) with no output change.
- **Optimize `refresh()` to skip stable observers on resize** — Currently every resize disconnects and rebuilds all IntersectionObservers. Only `*-center` and `*-top` placements use `window.innerHeight` in their `rootMargin`. Observers for `*-bottom` (the default) could survive resize unchanged.

## Completed

- **Remove UA-sniffing device detector** — Replaced `detector.js` regex patterns with modern `matchMedia` checks (`pointer: coarse`, `hover: none`). Removed dead `ie11()` method.
- **Drop `lodash.debounce` dependency** — Replaced with inline debounce to make the library zero-dependency.
- **Clean up `observer.js` legacy fallbacks** — Removed prefixed `WebKitMutationObserver`/`MozMutationObserver` checks and `isSupported()` guard.
- **`data-aos-anchor`** — Trigger an animation based on another element's scroll position.
- **Add `destroy()` method** — Full teardown that removes event listeners, CSS custom properties, and resets all state beyond what `disable()` does.
- **Fix `getInlineOption` null check** — `getAttribute()` returns `null`, not `undefined`. Changed `typeof attr !== 'undefined'` to `attr !== null`.
- **Fix `"private"` type in package.json** — Changed `"private": "true"` (string) to `"private": true` (boolean).
- **Drop CSS-native keywords from `resolveEasing` map** — Removed `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out` from the map since browsers handle them natively. The fallthrough (`return name`) already passes them through.
