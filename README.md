# aosio

Animate On Scroll library powered by the IntersectionObserver API. A high-performance fork of [AOS](https://github.com/michalsnik/aos) that replaces scroll event listeners with native browser observation for better performance and battery life.

---

## Why IntersectionObserver?

### Traditional AOS (Scroll Events)

The original AOS implementation uses scroll event listeners with throttling:

```javascript
window.addEventListener('scroll', throttle(() => {
  // Check ALL elements on every scroll event
  elements.forEach(el => checkPosition(el));
}, 99)); // Fires ~10 times per second
```

**Performance Impact:**
- With 100 animated elements
- Throttle fires ~10x per second while scrolling
- = **1,000 position checks per second**
- High CPU usage, battery drain on mobile
- Can cause scroll jank on lower-end devices

### AOS-IO (IntersectionObserver)

The IntersectionObserver version uses browser-native viewport intersection detection:

```javascript
const observer = new IntersectionObserver((entries) => {
  // Only called when elements enter/exit viewport
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animate(entry.target);
    }
  });
});
```

**Performance Benefits:**
- **Browser-optimized** - runs in separate thread
- **Event-driven** - only fires when needed
- **Zero overhead** when not scrolling
- **Batched updates** - browser combines multiple checks
- **Better battery life** on mobile devices

### Performance Comparison

| Metric | Scroll Events | IntersectionObserver |
|--------|--------------|---------------------|
| **Checks while scrolling** | ~1000/sec (100 elements) | Only when crossing viewport |
| **CPU usage (idle)** | Continuous polling | Zero |
| **Memory overhead** | Moderate | Minimal |
| **Battery impact** | Higher | Much lower |
| **Frame drops** | Possible with many elements | Rare |
| **Browser optimization** | None | Native optimization |

---

## Installation

Copy the built files from `dist/` into your project, then add the stylesheet and script:

```html
<link rel="stylesheet" href="path/to/aosio.css" />
<script src="path/to/aosio.js"></script>
<script>
  AOS.init();
</script>
```

### ES module import

```js
import AOS from './path/to/aosio.js';

AOS.init();
```

If your project uses SCSS, you can import the source files directly from `src/sass/` instead of using the pre-built CSS. See [Custom SCSS builds](#custom-scss-builds).

---

## How to use

### 1. Initialize AOS

```js
AOS.init();

// Or pass an optional settings object (defaults shown):
AOS.init({
  // Global settings:
  disable: false,        // 'phone', 'tablet', 'mobile', boolean, or function
  startEvent: 'DOMContentLoaded', // event that triggers initialization
  initClassName: 'aos-init',      // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false,  // if true, adds data-aos value as classes on scroll
  disableMutationObserver: false, // disable automatic DOM mutation detection
  debounceDelay: 50,     // debounce delay on window resize (ms)

  // Per-element settings (overridable via data-aos-* attributes):
  offset: 120,           // offset (px) from the trigger point
  delay: 0,              // 0 to 3000, step 50ms
  duration: 400,         // 0 to 3000, step 50ms
  easing: 'ease',        // default easing for animations
  once: false,           // animate only once (on scroll down)
  mirror: false,         // animate out when scrolling past
  anchorPlacement: 'top-bottom', // which position triggers the animation
});
```

### 2. Add animations with `data-aos`

```html
<div data-aos="fade-up"></div>
```

Customize per-element behavior with `data-aos-*` attributes:

```html
<div
  data-aos="fade-up"
  data-aos-offset="200"
  data-aos-delay="50"
  data-aos-duration="1000"
  data-aos-easing="ease-in-out"
  data-aos-mirror="true"
  data-aos-once="false"
  data-aos-anchor-placement="top-center"
></div>
```

### Anchor

Trigger an animation based on another element's position:

```html
<div data-aos="fade-up" data-aos-anchor=".other-element"></div>
```

Useful for animating fixed elements as you scroll to a different section.

---

## Custom SCSS builds

Copy the `src/sass/` directory into your project, then import only what you need:

```scss
// Override defaults before importing
$aos-distance: 200px;

// Import only what you need
@import 'path/to/sass/core';
@import 'path/to/sass/easing';
@import 'path/to/sass/animations/fade';
@import 'path/to/sass/animations/slide';
```

---

## API

AOS exposes three methods:

- **`AOS.init(settings)`** — Initialize AOS with optional settings
- **`AOS.refresh()`** — Recalculate observer positions (called automatically on resize)
- **`AOS.refreshHard()`** — Rebuild the element list and refresh observers (called automatically on DOM mutations)

```js
// Manually refresh after dynamic content changes
AOS.refreshHard();
```

AOS uses a MutationObserver to detect DOM changes and automatically calls `refreshHard()` when `[data-aos]` elements are added or removed.

---

## JS Events

AOS dispatches `aos:in` and `aos:out` events on the document:

```js
document.addEventListener('aos:in', ({ detail }) => {
  console.log('animated in', detail);
});

document.addEventListener('aos:out', ({ detail }) => {
  console.log('animated out', detail);
});
```

Use `data-aos-id` to listen for element-specific events:

```html
<div data-aos="fade-in" data-aos-id="hero"></div>
```

```js
document.addEventListener('aos:in:hero', ({ detail }) => {
  console.log('hero animated in');
});
```

---

## Browser support

Requires [IntersectionObserver](https://caniuse.com/intersectionobserver) support: Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+. No IE11 support.

---

## Animations

### Fade
- fade
- fade-up
- fade-down
- fade-left
- fade-right
- fade-up-right
- fade-up-left
- fade-down-right
- fade-down-left

### Flip
- flip-up
- flip-down
- flip-left
- flip-right

### Slide
- slide-up
- slide-down
- slide-left
- slide-right

### Zoom
- zoom-in
- zoom-in-up
- zoom-in-down
- zoom-in-left
- zoom-in-right
- zoom-out
- zoom-out-up
- zoom-out-down
- zoom-out-left
- zoom-out-right

### Anchor placements
- top-bottom
- top-center
- top-top
- center-bottom
- center-center
- center-top
- bottom-bottom
- bottom-center
- bottom-top

### Easing functions
- linear
- ease
- ease-in
- ease-out
- ease-in-out
- ease-in-back
- ease-out-back
- ease-in-out-back
- ease-in-sine
- ease-out-sine
- ease-in-out-sine
- ease-in-quad
- ease-out-quad
- ease-in-out-quad
- ease-in-cubic
- ease-out-cubic
- ease-in-out-cubic
- ease-in-quart
- ease-out-quart
- ease-in-out-quart

---

## Development

```bash
npm run dev      # Watch + live-server on port 8080
npm run build    # Production Rollup build
npm run lint     # ESLint
```

## Build output

| File | Format | Description |
|------|--------|-------------|
| `dist/aosio.js` | UMD | Browser `<script>` tag (exposes `window.AOS`) |
| `dist/aosio.css` | CSS | All animations, easings, durations |

## Customizations

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for custom animations, custom easings, Animate.css integration, and duration/delay caveats.
