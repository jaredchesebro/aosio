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

```css
[data-aos] {
  body[data-aos-easing="new-easing"] &,
  &[data-aos][data-aos-easing="new-easing"] {
    transition-timing-function: cubic-bezier(.250, .250, .750, .750);
  }
}
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

---

### Custom Duration and delay values

Duration and delay accept values from 50 to 3000 in 50ms steps (handled via CSS). To add a custom value:

```css
body[data-aos-duration='4000'] [data-aos],
[data-aos][data-aos][data-aos-duration='4000'] {
  transition-duration: 4000ms;
}
```

The doubled `[data-aos][data-aos]` selector gives per-element settings higher specificity than global settings without `!important`.
