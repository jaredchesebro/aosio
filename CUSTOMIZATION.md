# Customization

## Recipes

### Custom animations

```css
[data-aos="new-animation"] {
  opacity: 0;
  transition-property: transform, opacity;

  &.aos-animate {
    opacity: 1;
  }

  @media screen and (min-width: 768px) {
    transform: translateX(100px);

    &.aos-animate {
      transform: translateX(0);
    }
  }
}
```

```html
<div data-aos="new-animation"></div>
```

### Custom easing

Pass any `cubic-bezier()` value directly via the `data-aos-easing` attribute:

```html
<div data-aos="fade-up" data-aos-easing="cubic-bezier(.250, .250, .750, .750)"></div>
```

Or set a custom default via `AOS.init()`:

```js
AOS.init({
  easing: 'cubic-bezier(.250, .250, .750, .750)',
});
```

### Integrating Animate.css

```html
<div data-aos="fadeInUp"></div>
```

```js
AOS.init({
  useClassNames: true,
  initClassName: false,
  animatedClassName: 'animated',
});
```

You may also need:

```css
[data-aos] { visibility: hidden; }
[data-aos].animated { visibility: visible; }
```
