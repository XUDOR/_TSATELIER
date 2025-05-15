// public/state/deviceState.js
// Purpose: Manage device-specific state (type, orientation, viewport dimensions)
// and make this information available to the application.

import { _updateState, getState as getFullState } from './indexState.js';

// Define breakpoints for device classification.
// These can be adjusted to match your CSS media query breakpoints if desired.
const MOBILE_MAX_WIDTH = 767;  // Example: Common breakpoint for mobile
const TABLET_MAX_WIDTH = 1024; // Example: Common breakpoint for tablet

/**
 * Classifies the device type based on its width.
 * @param {number} width - The current viewport width.
 * @returns {string} - 'mobile', 'tablet', or 'desktop'.
 */
function classifyDeviceType(width) {
  if (width <= MOBILE_MAX_WIDTH) return 'mobile';
  if (width <= TABLET_MAX_WIDTH) return 'tablet';
  return 'desktop';
}

/**
 * Determines the current screen orientation.
 * Uses screen.orientation API if available, otherwise falls back to comparing width and height.
 * @returns {string} - 'landscape' or 'portrait'.
 */
function getCurrentOrientation() {
  if (window.screen?.orientation?.type) {
    if (window.screen.orientation.type.startsWith('landscape')) return 'landscape';
    if (window.screen.orientation.type.startsWith('portrait')) return 'portrait';
  }
  // Fallback for browsers that don't support screen.orientation or for when it's not informative
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

/**
 * Updates the device state with the current viewport width, height,
 * classified device type, and orientation.
 * This function should be called on initial load and whenever the window is resized
 * or its orientation changes.
 */
export function updateDeviceAndViewportInfo() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const newDeviceType = classifyDeviceType(viewportWidth);
  const newOrientation = getCurrentOrientation();

  _updateState(currentState => {
    const device = currentState.device; // Get a mutable reference to the device slice of the state
    let changed = false;

    // Check if any device-related property has actually changed
    if (device.viewportWidth !== viewportWidth) {
      device.viewportWidth = viewportWidth;
      changed = true;
    }
    if (device.viewportHeight !== viewportHeight) {
      device.viewportHeight = viewportHeight;
      changed = true;
    }
    if (device.type !== newDeviceType) {
      device.type = newDeviceType;
      changed = true;
    }
    if (device.orientation !== newOrientation) {
      device.orientation = newOrientation;
      changed = true;
    }

    if (changed) {
      // Optional: Update data attributes on the <html> element for CSS targeting
      const root = document.documentElement;
      root.dataset.deviceType = device.type; // e.g., data-device-type="desktop"
      root.dataset.orientation = device.orientation; // e.g., data-orientation="landscape"

      // Optional: Set CSS custom properties for vw/vh units if your CSS uses them extensively
      // root.style.setProperty('--vw-unit', `${device.viewportWidth * 0.01}px`);
      // root.style.setProperty('--vh-unit', `${device.viewportHeight * 0.01}px`);

      console.log(
        `[deviceState] Viewport/Device Updated: ${device.type} (${device.viewportWidth}w × ${device.viewportHeight}h) - ${device.orientation}`
      );
    }
  });
}

/**
 * Retrieves a clone of the current device state.
 * @returns {object} A deep clone of the device state.
 */
export function getDeviceInfo() {
  const { device } = getFullState(); // Get the complete current state
  return structuredClone(device); // Return a clone to prevent direct mutation
}

// (Optional) A function to restore device state from a snapshot,
// e.g., if loading saved session data. Not strictly needed for initial setup.
/*
export function setDeviceSnapshot(type, orientation, viewportWidth, viewportHeight) {
  _updateState(currentState => {
    const device = currentState.device;
    device.type = type;
    device.orientation = orientation;
    if (typeof viewportWidth === 'number') device.viewportWidth = viewportWidth;
    if (typeof viewportHeight === 'number') device.viewportHeight = viewportHeight;

    const root = document.documentElement;
    root.dataset.deviceType = device.type;
    root.dataset.orientation = device.orientation;

    console.log(
      `[deviceState] Device Snapshot Applied: ${device.type} (${device.viewportWidth}w × ${device.viewportHeight}h) - ${device.orientation}`
    );
  });
}
*/

console.info('[deviceState.js] Device state module loaded.');
