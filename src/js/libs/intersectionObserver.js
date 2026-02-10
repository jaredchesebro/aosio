/**
 * IntersectionObserver-based animation handler
 * More performant alternative to scroll event listeners
 */

import getInlineOption from '../helpers/getInlineOption';

/**
 * Convert anchor-placement to IntersectionObserver rootMargin
 * @param {string} anchorPlacement - AOS anchor placement value
 * @param {number} offset - Additional offset in pixels
 * @returns {string} rootMargin value for IntersectionObserver
 */
const getRootMargin = (anchorPlacement, offset) => {
  const windowHeight = window.innerHeight;

  switch (anchorPlacement) {
    case 'top-bottom':
      // Element top hits viewport bottom (default)
      return `0px 0px ${-offset}px 0px`;

    case 'center-bottom':
      // Element center hits viewport bottom
      return `0px 0px ${-offset}px 0px`;

    case 'bottom-bottom':
      // Element bottom hits viewport bottom
      return `0px 0px ${-offset}px 0px`;

    case 'top-center':
      // Element top hits viewport center
      return `${-(windowHeight / 2) + offset}px 0px ${-(windowHeight / 2) + offset}px 0px`;

    case 'center-center':
      // Element center hits viewport center
      return `${-(windowHeight / 2) + offset}px 0px ${-(windowHeight / 2) + offset}px 0px`;

    case 'bottom-center':
      // Element bottom hits viewport center
      return `${-(windowHeight / 2) + offset}px 0px ${-(windowHeight / 2) + offset}px 0px`;

    case 'top-top':
      // Element top hits viewport top
      return `${offset}px 0px ${-windowHeight + offset}px 0px`;

    case 'bottom-top':
      // Element bottom hits viewport top
      return `${offset}px 0px ${-windowHeight + offset}px 0px`;

    case 'center-top':
      // Element center hits viewport top
      return `${offset}px 0px ${-windowHeight + offset}px 0px`;

    default:
      return `0px 0px ${-offset}px 0px`;
  }
};

/**
 * Get threshold value based on anchor placement
 * @param {string} anchorPlacement
 * @returns {number} threshold (0 to 1)
 */
const getThreshold = (anchorPlacement) => {
  switch (anchorPlacement) {
    case 'top-bottom':
    case 'top-center':
    case 'top-top':
      return 0; // Trigger as soon as top is visible

    case 'center-bottom':
    case 'center-center':
    case 'center-top':
      return 0.5; // Trigger when 50% visible

    case 'bottom-bottom':
    case 'bottom-center':
    case 'bottom-top':
      return 1; // Trigger when fully visible

    default:
      return 0;
  }
};

/**
 * Fire custom AOS event
 */
const fireEvent = (eventName, node, id) => {
  const customEvent = new CustomEvent(eventName, {
    detail: { node },
  });
  document.dispatchEvent(customEvent);

  if (id) {
    const idEvent = new CustomEvent(`${eventName}:${id}`, {
      detail: { node },
    });
    document.dispatchEvent(idEvent);
  }
};

/**
 * Add animation classes to element
 */
const addClasses = (node, classes) => {
  classes && classes.forEach((className) => node.classList.add(className));
};

/**
 * Remove animation classes from element
 */
const removeClasses = (node, classes) => {
  classes && classes.forEach((className) => node.classList.remove(className));
};

/**
 * Create IntersectionObserver for AOS elements
 * @param {Array} elements - Array of AOS elements
 * @param {Object} options - AOS options
 * @returns {IntersectionObserver} observer instance
 */
export const createObserver = (elements, options) => {
  // Map to store element-specific options
  const elementMap = new WeakMap();

  // Prepare elements and store their config
  elements.forEach((el) => {
    const { node } = el;
    const mirror = getInlineOption(node, 'mirror', options.mirror);
    const once = getInlineOption(node, 'once', options.once);
    const id = getInlineOption(node, 'id');
    const anchorPlacement = getInlineOption(
      node,
      'anchor-placement',
      options.anchorPlacement,
    );
    const offset = Number(getInlineOption(node, 'offset', options.offset));
    const customClassNames =
      options.useClassNames && node.getAttribute('data-aos');

    const animatedClassNames = [options.animatedClassName]
      .concat(customClassNames ? customClassNames.split(' ') : [])
      .filter((className) => typeof className === 'string');

    // Add init class
    if (options.initClassName) {
      node.classList.add(options.initClassName);
    }

    // Store element config
    elementMap.set(node, {
      mirror,
      once,
      id,
      animatedClassNames,
      animated: false,
      anchorPlacement,
      offset,
    });
  });

  // Create observers grouped by anchor placement for efficiency
  const observersByConfig = new Map();

  elements.forEach((el) => {
    const { node } = el;
    const config = elementMap.get(node);
    const { anchorPlacement, offset } = config;

    // Create unique key for this configuration
    const configKey = `${anchorPlacement}-${offset}`;

    if (!observersByConfig.has(configKey)) {
      // Create new observer for this configuration
      const rootMargin = getRootMargin(anchorPlacement, offset);
      const threshold = getThreshold(anchorPlacement);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const entryConfig = elementMap.get(entry.target);
            if (!entryConfig) return;

            const { mirror, once, animatedClassNames, id } = entryConfig;

            if (entry.isIntersecting) {
              // Element is entering viewport
              if (!entryConfig.animated) {
                addClasses(entry.target, animatedClassNames);
                fireEvent('aos:in', entry.target, id);
                entryConfig.animated = true;

                // If once=true, stop observing this element
                if (once) {
                  observer.unobserve(entry.target);
                }
              }
            } else {
              // Element is leaving viewport
              if (entryConfig.animated && mirror && !once) {
                removeClasses(entry.target, animatedClassNames);
                fireEvent('aos:out', entry.target, id);
                entryConfig.animated = false;
              }
            }
          });
        },
        {
          rootMargin,
          threshold,
        },
      );

      observersByConfig.set(configKey, observer);
    }

    // Observe this element with the appropriate observer
    const observer = observersByConfig.get(configKey);
    observer.observe(node);
  });

  // Return cleanup function
  return {
    disconnect: () => {
      observersByConfig.forEach((observer) => observer.disconnect());
      observersByConfig.clear();
    },
    observers: Array.from(observersByConfig.values()),
  };
};

/**
 * Check if IntersectionObserver is supported
 */
export const isSupported = () => {
  return (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  );
};

export default {
  createObserver,
  isSupported,
};
