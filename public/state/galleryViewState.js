// public/state/galleryViewState.js
// Purpose: Manages the state of the main gallery view (#gallery-container),
// including which artwork is displayed, its transformation, and visibility.

import { _updateState, getState as getFullState } from './indexState.js';

/**
 * Stores a reference to the main gallery container DOM element in the state.
 * @param {HTMLElement} element - The DOM element for #gallery-container.
 */
export function setGalleryContainerElement(element) {
  _updateState(currentState => {
    currentState.galleryView.containerElement = element;
    if (element) {
      console.log('[galleryViewState] Gallery container element stored in state.');
    }
  });
}

/**
 * Sets the ID of the artwork currently in view and its DOM element.
 * @param {string|null} artworkId - The ID of the artwork, or null if no artwork is in view.
 * @param {HTMLElement|null} artworkElement - The DOM element of the artwork being displayed, or null.
 */
export function setGalleryViewArtwork(artworkId, artworkElement = null) {
  _updateState(currentState => {
    currentState.galleryView.currentArtworkIdInView = artworkId;
    currentState.galleryView.currentArtworkElement = artworkElement;
    // console.log(`[galleryViewState] Artwork in view set to: ${artworkId}`);
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
  // Note: DOM elements (containerElement, currentArtworkElement) are not deep cloned by structuredClone.
  // The references will be copied. This is usually fine as we don't intend to mutate these
  // specific state properties directly from outside via a getter.
  return structuredClone(galleryView);
}

console.info('[galleryViewState.js] Gallery view state module loaded.');
