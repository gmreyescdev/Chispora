(function () {
  "use strict";

  const DEFAULTS = { textSize: "normal", highContrast: false, reducedMotion: false, hideTimers: false };

  function normalize(settings) {
    const source = settings && typeof settings === "object" ? settings : {};
    return {
      textSize: source.textSize === "large" ? "large" : "normal",
      highContrast: source.highContrast === true,
      reducedMotion: source.reducedMotion === true,
      hideTimers: source.hideTimers === true
    };
  }

  function attributes(settings) {
    const value = normalize(settings);
    return {
      textSize: value.textSize,
      contrast: value.highContrast ? "high" : "standard",
      reducedMotion: String(value.reducedMotion),
      hideTimers: String(value.hideTimers)
    };
  }

  function shouldReduceMotion(settings, systemPreference) {
    return Boolean(systemPreference || normalize(settings).reducedMotion);
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.accessibilityEngine = { defaults: DEFAULTS, normalize: normalize, attributes: attributes, shouldReduceMotion: shouldReduceMotion };
})();
