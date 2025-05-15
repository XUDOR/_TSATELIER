// public/state/galleryMapState.js
// Purpose: Manages the state related to the 2D gallery map,
// including user position, orientation, and the gallery layout data.

import { _updateState, getState as getFullState } from './indexState.js';

/**
 * Sets the user's current position on the gallery map.
 * @param {number} x - The new x-coordinate of the user.
 * @param {number} y - The new y-coordinate of the user.
 */
export function setUserPosition(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    console.warn('[galleryMapState] setUserPosition: Invalid coordinates provided.', { x, y });
    return;
  }
  _updateState(currentState => {
    currentState.galleryMap.user.position.x = x;
    currentState.galleryMap.user.position.y = y;
    // console.log(`[galleryMapState] User position set to: (${x}, ${y})`);
  });
}

/**
 * Sets the user's current orientation on the gallery map.
 * @param {string} orientation - The new orientation ('up', 'down', 'left', 'right').
 */
export function setUserOrientation(orientation) {
  const validOrientations = ['up', 'down', 'left', 'right'];
  if (!validOrientations.includes(orientation)) {
    console.warn('[galleryMapState] setUserOrientation: Invalid orientation provided.', orientation);
    return;
  }
  _updateState(currentState => {
    currentState.galleryMap.user.orientation = orientation;
    // console.log(`[galleryMapState] User orientation set to: ${orientation}`);
  });
}

/**
 * Loads the gallery layout data into the state.
 * This data typically includes wall definitions and artwork placements on the map.
 * @param {Array|string} source - Either an array of layout objects or a URL string to fetch the layout JSON from.
 */
export async function loadLayoutData(source) {
  _updateState(currentState => {
    currentState.ui.isLoading = true;
    currentState.galleryMap.mapReady = false;
  });

  try {
    let layoutDataToStore = [];
    if (typeof source === 'string') { // If source is a URL
      console.log(`[galleryMapState] Fetching layout data from URL: ${source}`);
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch layout data from ${source}. Status: ${response.status}`);
      }
      layoutDataToStore = await response.json();
    } else if (Array.isArray(source)) { // If source is pre-loaded data
      console.log('[galleryMapState] Loading layout data from provided array.');
      layoutDataToStore = source;
    } else {
      throw new Error('Invalid source for layout data. Must be a URL string or an array.');
    }

    _updateState(currentState => {
      currentState.galleryMap.layout = layoutDataToStore;
      currentState.galleryMap.mapReady = true;
      currentState.ui.isLoading = false;
      console.log('[galleryMapState] Layout data loaded successfully. Items:', layoutDataToStore.length);
    });
  } catch (error) {
    console.error('[galleryMapState] Error loading layout data:', error);
    _updateState(currentState => {
      currentState.ui.errorMessage = `Could not load gallery layout: ${error.message}`;
      currentState.ui.isLoading = false;
      currentState.galleryMap.mapReady = false;
      currentState.galleryMap.layout = []; // Ensure layout is empty on error
    });
  }
}

/**
 * Retrieves a clone of the current gallery map state, including user and layout.
 * @returns {object} A deep clone of the galleryMap state.
 */
export function getGalleryMapInfo() {
  const { galleryMap } = getFullState();
  return structuredClone(galleryMap);
}

/**
 * Retrieves a clone of the user's current state (position and orientation).
 * @returns {object} A deep clone of the user state.
 */
export function getUser() {
  const { galleryMap } = getFullState();
  return structuredClone(galleryMap.user);
}

/**
 * Retrieves the raw layout data.
 * @returns {Array} A clone of the layout data array.
 */
export function getLayout() {
    const { galleryMap } = getFullState();
    return structuredClone(galleryMap.layout);
}

/**
 * (Helper/Example) Checks if a specific cell is a wall based on the loaded layout.
 * Note: More complex collision/movement logic will likely reside in a dedicated
 * navigation controller that consumes this state.
 * @param {number} x - The x-coordinate to check.
 * @param {number} y - The y-coordinate to check.
 * @returns {boolean} True if the cell is considered a wall, false otherwise.
 */
export function isCellWall(x, y) {
  const { galleryMap } = getFullState();
  if (!galleryMap.mapReady || !galleryMap.layout) {
    console.warn('[galleryMapState] isCellWall called before map is ready or layout loaded.');
    return true; // Safer to assume it's a wall if data isn't ready
  }
  const cell = galleryMap.layout.find(item => item.x === x && item.y === y);
  return cell ? cell.isWall : true; // If cell not found in layout, assume it's an impassable boundary
}


console.info('[galleryMapState.js] Gallery map state module loaded.');
