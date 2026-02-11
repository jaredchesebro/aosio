# Roadmap

## Planned

- **Add ESM build output** — Add a second Rollup output (`dist/aosio.esm.js`) and a `"module"` field in `package.json` for tree-shaking support.
## Completed

- **Remove UA-sniffing device detector** — Replaced `detector.js` regex patterns with modern `matchMedia` checks (`pointer: coarse`, `hover: none`). Removed dead `ie11()` method.
- **Drop `lodash.debounce` dependency** — Replaced with inline debounce to make the library zero-dependency.
- **Clean up `observer.js` legacy fallbacks** — Removed prefixed `WebKitMutationObserver`/`MozMutationObserver` checks and `isSupported()` guard.
- **`data-aos-anchor`** — Trigger an animation based on another element's scroll position.
- **Add `destroy()` method** — Full teardown that removes event listeners, CSS custom properties, and resets all state beyond what `disable()` does.
- **Fix `getInlineOption` null check** — `getAttribute()` returns `null`, not `undefined`. Changed `typeof attr !== 'undefined'` to `attr !== null`.
- **Fix `"private"` type in package.json** — Changed `"private": "true"` (string) to `"private": true` (boolean).
