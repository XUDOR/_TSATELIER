// public/utils/helpers.js
export function mapRange(value, inMin, inMax, outMin, outMax) {
  const clampedValue = Math.max(inMin, Math.min(value, inMax));
  return ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// You can add other general utility functions here as needed.
// For example, a debounce function if you anticipate needing it soon:
export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

console.info('[helpers.js] Utilities loaded.');