/**
 * *******************************************************
 * AOS-IO (Animate on scroll - IntersectionObserver version)
 * High-performance alternative using IntersectionObserver API
 * *******************************************************
 */
import './../sass/aosio.scss';

// Modules & helpers
import debounce from 'lodash.debounce';

import mutationObserver from './libs/observer';
import intersectionObserver from './libs/intersectionObserver';

import detect from './helpers/detector';
import elements from './helpers/elements';

/**
 * Private variables
 */
let $aosElements = [];
let observers = null;
let initialized = false;

/**
 * Default options
 */
let options = {
  offset: 120,
  delay: 0,
  easing: 'ease',
  duration: 400,
  disable: false,
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
  startEvent: 'DOMContentLoaded',
  animatedClassName: 'aos-animate',
  initClassName: 'aos-init',
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
};

/**
 * Check if AOS should be disabled based on provided setting
 */
const isDisabled = function (optionDisable) {
  return (
    optionDisable === true ||
    (optionDisable === 'mobile' && detect.mobile()) ||
    (optionDisable === 'phone' && detect.phone()) ||
    (optionDisable === 'tablet' && detect.tablet()) ||
    (typeof optionDisable === 'function' && optionDisable() === true)
  );
};

/**
 * Initialize IntersectionObservers for all elements
 */
const initializeObservers = function () {
  // Get fresh list of elements
  $aosElements = elements();

  // Disconnect any existing observers
  if (observers) {
    observers.disconnect();
  }

  // Create new IntersectionObservers
  observers = intersectionObserver.createObserver($aosElements, options);

  return $aosElements;
};

/**
 * Refresh AOS
 */
const refresh = function (initialize = false) {
  if (initialize) initialized = true;
  if (initialized) initializeObservers();
};

/**
 * Hard refresh
 * Recreate observers with new elements
 */
const refreshHard = function () {
  if (isDisabled(options.disable)) {
    return disable();
  }

  refresh();
};

/**
 * Disable AOS
 * Disconnect all observers and remove classes
 */
const disable = function () {
  if (observers) {
    observers.disconnect();
    observers = null;
  }

  $aosElements.forEach(function (el) {
    el.node.removeAttribute('data-aos');
    el.node.removeAttribute('data-aos-easing');
    el.node.removeAttribute('data-aos-duration');
    el.node.removeAttribute('data-aos-delay');

    if (options.initClassName) {
      el.node.classList.remove(options.initClassName);
    }

    if (options.animatedClassName) {
      el.node.classList.remove(options.animatedClassName);
    }
  });
};

/**
 * Initializing AOS
 * - Create options merging defaults with user defined options
 * - Set attributes on <body> as global setting - CSS relies on it
 * - Attach MutationObserver to detect dynamically added elements
 * - Create IntersectionObservers for all AOS elements
 */
const init = function init(settings) {
  options = Object.assign(options, settings);

  // Check for IntersectionObserver support
  if (!intersectionObserver.isSupported()) {
    console.warn(
      'AOS-IO: IntersectionObserver is not supported in this browser. Please use the standard AOS version or a polyfill.',
    );
    return;
  }

  // Create initial array with elements
  $aosElements = elements();

  /**
   * Disable mutation observing if not supported
   */
  if (!options.disableMutationObserver && !mutationObserver.isSupported()) {
    console.info(`
      aos: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `);
    options.disableMutationObserver = true;
  }

  /**
   * Observe [data-aos] elements
   * If something is loaded by AJAX, refresh observers
   */
  if (!options.disableMutationObserver) {
    mutationObserver.ready('[data-aos]', refreshHard);
  }

  /**
   * Don't init plugin if option `disable` is set
   * or when browser is not supported
   */
  if (isDisabled(options.disable)) {
    return disable();
  }

  /**
   * Set global settings on body, based on options
   * so CSS can use it
   */
  document
    .querySelector('body')
    .setAttribute('data-aos-easing', options.easing);

  document
    .querySelector('body')
    .setAttribute('data-aos-duration', options.duration);

  document.querySelector('body').setAttribute('data-aos-delay', options.delay);

  /**
   * Handle initializing based on startEvent
   */
  if (['DOMContentLoaded', 'load'].indexOf(options.startEvent) === -1) {
    // Listen to custom startEvent
    document.addEventListener(options.startEvent, function () {
      refresh(true);
    });
  } else {
    window.addEventListener('load', function () {
      refresh(true);
    });
  }

  if (
    options.startEvent === 'DOMContentLoaded' &&
    ['complete', 'interactive'].indexOf(document.readyState) > -1
  ) {
    // Initialize AOS if default startEvent was already fired
    refresh(true);
  }

  /**
   * Refresh observers on window resize (debounced)
   * This recalculates rootMargin for percentage-based placements
   */
  window.addEventListener(
    'resize',
    debounce(refresh, options.debounceDelay, true),
  );

  window.addEventListener(
    'orientationchange',
    debounce(refresh, options.debounceDelay, true),
  );

  return $aosElements;
};

/**
 * Export Public API
 */

export default {
  init,
  refresh,
  refreshHard,
};
