// public/state/galleryViewState.js
// Purpose: Manages the state of the main gallery view (#gallery-container),
// including which artwork is displayed, its transformation, and visibility.
// Version 2: Does not store direct DOM element references in the state.

import { _updateState, getState as getFullState } from './indexState.js';

/**
 * Sets the ID of the artwork currently in view.
 * The actual DOM element will be managed by galleryViewManager.js using this ID.
 * @param {string|null} artworkId - The ID of the artwork, or null if no artwork is in view.
 */
export function setGalleryViewArtwork(artworkId) {
  _updateState(currentState => {
    currentState.galleryView.currentArtworkIdInView = artworkId;
    // console.log(`[galleryViewState] Artwork ID in view set to: ${artworkId}`);
  });
}

/**
 * Updates the transformation properties for the artwork currently in view.
 * @param {object} transformProps - An object containing transform properties to update.
 * Example: { translateX: 0, rotateY: 0, scale: 1, transformOrigin: 'center center' }
 * Only provided properties will be updated.
 */
export function setGalleryViewTransform(transformProps) {
  if (typeof transformProps !== 'object' || transformProps === null) {
    console.warn('[galleryViewState] setGalleryViewTransform: Invalid transformProps provided.', transformProps);
    return;
  }
  _updateState(currentState => {
    // Merge new properties with existing ones
    currentState.galleryView.currentTransform = {
      ...currentState.galleryView.currentTransform,
      ...transformProps
    };
    // console.log('[galleryViewState] Gallery view transform updated:', currentState.galleryView.currentTransform);
  });
}

/**
 * Sets the visibility state of the artwork in the gallery view.
 * @param {boolean} isVisible - True if an artwork is visible, false otherwise.
 */
export function setGalleryViewVisibility(isVisible) {
  _updateState(currentState => {
    currentState.galleryView.isVisible = !!isVisible; // Ensure boolean
    // console.log(`[galleryViewState] Gallery view visibility set to: ${!!isVisible}`);
  });
}

/**
 * Retrieves a clone of the current gallery view state.
 * @returns {object} A deep clone of the galleryView state.
 */
export function getGalleryViewInfo() {
  const { galleryView } = getFullState();
  return structuredClone(galleryView);
}

// Removed setGalleryContainerElement as the container element reference
// will be managed locally by script.js and passed to galleryViewManager.

console.info('[galleryViewState.js] Gallery view state module loaded (v2 - no DOM elements).');
