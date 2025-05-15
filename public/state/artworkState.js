// public/state/artworkState.js
// Purpose: Manages information about all available artworks in the gallery,
// including their metadata like image source, dimensions, and placement details.

import { _updateState, getState as getFullState } from './indexState.js';

/**
 * Loads and processes an array of artwork details into the state.
 * This function populates both a keyed object for quick lookup (`state.artworks.data`)
 * and keeps the original array structure (`state.artworks.richGalleryData`).
 *
 * @param {Array<Object>} artworkArray - An array of artwork objects. Each object should conform to
 * the structure expected (e.g., { id, name, imageUrl, description, actualWidth, actualHeight, x, y, wallFace }).
 * The `x`, `y`, and `wallFace` here refer to the specific instance of an artwork on a wall.
 */
export function loadAllArtworkDetails(artworkArray) {
  if (!Array.isArray(artworkArray)) {
    console.error('[artworkState] loadAllArtworkDetails: Input must be an array.');
    _updateState(currentState => {
        currentState.ui.errorMessage = 'Failed to load artwork details: Invalid data format.';
        currentState.artworks.allLoaded = false;
    });
    return;
  }

  _updateState(currentState => {
    // Clear previous data to prevent duplicates if called multiple times,
    // or merge if that's the desired behavior (for now, we'll clear).
    currentState.artworks.data = {};
    currentState.artworks.richGalleryData = structuredClone(artworkArray); // Store the full array

    artworkArray.forEach(art => {
      if (!art.id) {
        console.warn('[artworkState] Skipping artwork with no ID:', art);
        return;
      }
      // Store the primary details of each unique artwork ID in the 'data' object.
      // If an artwork ID might appear multiple times in richGalleryData (e.g. different instances of the same print),
      // this will store the details from the first encountered instance with that ID.
      // The richGalleryData array will retain all instances.
      if (!currentState.artworks.data[art.id]) {
          currentState.artworks.data[art.id] = {
              id: art.id,
              name: art.name || `Artwork ${art.id}`, // Default name if not provided
              imageUrl: art.imageUrl,
              description: art.description || '',
              actualWidth: art.actualWidth || 0, // Store actual image width if known
              actualHeight: art.actualHeight || 0, // Store actual image height if known
              // Note: x, y, wallFace are specific to an *instance* in richGalleryData,
              // so they might not be stored directly on the primary artwork.data[art.id]
              // unless you define a "primary" instance.
          };
      }
    });

    currentState.artworks.allLoaded = true;
    currentState.ui.isLoading = false; // Assuming this is part of a larger loading sequence
    console.log('[artworkState] All artwork details processed. Unique artwork IDs loaded:', Object.keys(currentState.artworks.data).length);
    console.log('[artworkState] Total artwork instances in richGalleryData:', currentState.artworks.richGalleryData.length);
  });
}

/**
 * Retrieves the details for a specific artwork by its ID.
 * This fetches from the `state.artworks.data` object.
 * @param {string} artworkId - The unique ID of the artwork.
 * @returns {Object|null} A clone of the artwork's details, or null if not found.
 */
export function getArtworkById(artworkId) {
  const { artworks } = getFullState();
  if (artworks.data && artworks.data[artworkId]) {
    return structuredClone(artworks.data[artworkId]);
  }
  return null;
}

/**
 * Retrieves all artwork information.
 * @returns {object} An object containing:
 * - `dataById`: A clone of the artwork details keyed by ID.
 * - `richGalleryDataList`: A clone of the full list of artwork instances.
 */
export function getAllArtworksInfo() {
  const { artworks } = getFullState();
  return {
    dataById: structuredClone(artworks.data),
    richGalleryDataList: structuredClone(artworks.richGalleryData)
  };
}

/**
 * Retrieves the list of artwork instances (richGalleryData).
 * This is useful for finding all placements of artworks on the map.
 * @returns {Array<Object>} A clone of the richGalleryData array.
 */
export function getRichGalleryData() {
    const { artworks } = getFullState();
    return structuredClone(artworks.richGalleryData);
}


console.info('[artworkState.js] Artwork state module loaded.');
