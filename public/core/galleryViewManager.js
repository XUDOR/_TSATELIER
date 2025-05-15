// public/core/galleryViewManager.js
// Purpose: Manages the pseudo-3D display of artworks in the #gallery-container
// based on user navigation.

import {
  getState,
  getUser, // From galleryMapState: { position, orientation }
  getRichGalleryData, // From artworkState: array of all artwork instances
  getGalleryViewInfo, // From galleryViewState: { containerElement, currentArtworkIdInView, ... }
  setGalleryViewArtwork,
  setGalleryViewTransform,
  setGalleryViewVisibility,
  // No direct DOM element access here other than what's passed in or managed via state.
} from '../state/indexState.js';
import { mapRange } from '../utils/helpers.js';

// Constants for visual calculations, can be tuned.
// These were defined in the TSATELIER-PROJECT-DOC-MAY5:25.pdf
const MAX_VIEWING_ANGLE_Y = 60; // Max degrees for rotateY
const MAX_PERPENDICULAR_DIST_FOR_ANGLE = 3; // Max grid cells away perpendicularly for full angle effect
const MIN_VIEW_DISTANCE_FOR_SCALE = 1; // Min grid cells distance for scaling effect to start
const MAX_VIEW_DISTANCE_FOR_SCALE = 5; // Max grid cells distance for artwork to appear smallest
const MIN_SCALE_VALUE = 0.80; // Smallest an artwork can scale down to
const MAX_SCALE_VALUE = 1.0;  // Largest an artwork can scale up to (usually its normal size)

// Cache for the DOM elements representing artworks in the gallery view.
// Keyed by artwork ID (e.g., 'P1', 'P7').
let galleryArtworkDOMElements = {};

/**
 * Initializes the gallery view by creating DOM elements for each unique artwork
 * and appending them to the gallery container. These elements are initially hidden.
 * This should be called once after the main gallery container element is available
 * and artwork details have been loaded.
 */
export function initializeGalleryScene() {
  const { artworks: artworkStateData, galleryView: galleryViewConfig } = getState();
  const container = galleryViewConfig.containerElement;

  if (!container) {
    console.error("[GalleryViewManager] Gallery container DOM element not found in state. Cannot initialize scene.");
    return;
  }
  if (!artworkStateData.allLoaded) {
    console.warn("[GalleryViewManager] Artwork data not yet loaded. Initialization might be incomplete.");
    // Proceeding to create elements, but they might lack background images if imageUrls aren't there yet.
  }

  container.innerHTML = ''; // Clear any existing content
  galleryArtworkDOMElements = {}; // Reset the cache

  // We need unique artwork IDs to create the display elements.
  // `artworkStateData.data` (keyed by ID) is suitable for this.
  const uniqueArtworks = artworkStateData.data;

  for (const artworkId in uniqueArtworks) {
    if (Object.hasOwnProperty.call(uniqueArtworks, artworkId)) {
      const artDetails = uniqueArtworks[artworkId];
      const artElement = document.createElement('div');
      artElement.className = 'artwork-view'; // CSS will style this
      artElement.id = `gallery-view-item-${artDetails.id}`; // Unique ID for the DOM element
      if (artDetails.imageUrl) {
        artElement.style.backgroundImage = `url('${artDetails.imageUrl}')`;
      } else {
        // Placeholder if no image - useful for debugging
        artElement.textContent = artDetails.id;
        artElement.style.display = 'flex';
        artElement.style.alignItems = 'center';
        artElement.style.justifyContent = 'center';
        artElement.style.fontSize = '2rem';
        artElement.style.color = 'white';
        artElement.style.backgroundColor = '#333'; // Dark placeholder
      }
      // Elements are hidden by default via CSS (.artwork-view { display: none; opacity: 0; })
      // and made visible by adding a 'visible' class.
      container.appendChild(artElement);
      galleryArtworkDOMElements[artDetails.id] = artElement;
    }
  }
  console.log(`[GalleryViewManager] Gallery scene initialized. ${Object.keys(galleryArtworkDOMElements).length} artwork view elements created.`);
}

/**
 * Finds the artwork instance the user is currently "looking at".
 * @param {object} currentUser - The user state { position, orientation }.
 * @param {Array} allArtworkInstances - The richGalleryData array from artworkState.
 * @returns {object|null} The artwork instance object from richGalleryData, or null.
 */
function findTargetArtworkInstance(currentUser, allArtworkInstances) {
  if (!currentUser || !allArtworkInstances) return null;

  let targetX = currentUser.position.x;
  let targetY = currentUser.position.y;
  let expectedWallFaceOfArtwork; // The wall face the artwork should have if the user is looking at it.

  // Determine the coordinates of the cell directly in front of the user
  // and the orientation of the wall the user is facing.
  switch (currentUser.orientation) {
    case 'up': targetY--; expectedWallFaceOfArtwork = 'bottom'; break; // User looks up, artwork on wall above, facing down
    case 'down': targetY++; expectedWallFaceOfArtwork = 'top'; break;    // User looks down, artwork on wall below, facing up
    case 'left': targetX--; expectedWallFaceOfArtwork = 'right'; break;  // User looks left, artwork on wall to left, facing right
    case 'right': targetX++; expectedWallFaceOfArtwork = 'left'; break;   // User looks right, artwork on wall to right, facing left
    default: return null;
  }

  // Find an artwork instance at the target cell that is on the correctly oriented wall.
  const targetArtwork = allArtworkInstances.find(artInstance =>
    artInstance.x === targetX &&
    artInstance.y === targetY &&
    artInstance.wallFace === expectedWallFaceOfArtwork
  );
  
  // TODO: Implement adjacent wall checks as described in TSATELIER-PROJECT-DOC-MAY5:25.pdf (Section 4.2, Point 4)
  // This would handle cases where the user is beside a wall looking along it.
  // For now, we only check the cell directly in front.

  return targetArtwork || null;
}

/**
 * Calculates the CSS transform properties for an artwork based on the user's
 * position and orientation relative to the artwork.
 * @param {object} currentUser - The user state { position, orientation }.
 * @param {object} artworkInstance - The specific artwork instance from richGalleryData.
 * @returns {object} An object with `transform` (string) and `origin` (string) properties.
 */
function calculateArtworkTransformStyle(currentUser, artworkInstance) {
  if (!currentUser || !artworkInstance) {
    return { transform: 'rotateY(0deg) scale(1)', origin: 'center center' }; // Default if no artwork
  }

  // User's position
  const ux = currentUser.position.x;
  const uy = currentUser.position.y;

  // Artwork's position (anchor cell for this instance)
  const ax = artworkInstance.x;
  const ay = artworkInstance.y;

  let angleY = 0;
  let scale = 1.0;
  let transformOrigin = 'center center';

  // Calculate vector from user to the wall cell the artwork is on.
  // This is different from user to artwork's *center* if artwork spans multiple cells.
  // For simplicity, we use artworkInstance.x, artworkInstance.y as the wall cell.
  const deltaXUserToArtWall = ax - ux; // Positive if art wall is to user's right
  const deltaYUserToArtWall = ay - uy; // Positive if art wall is below user

  // Determine perpendicular distance and distance along the wall based on artwork's wallFace
  // This logic adapts from TSATELIER-PROJECT-DOC-MAY5:25.pdf (section 4.3, 5.3)
  switch (artworkInstance.wallFace) {
    case 'bottom': // Artwork on a 'top' wall (e.g., y=1), facing 'bottom' (towards increasing y)
    case 'top':    // Artwork on a 'bottom' wall (e.g., y=11), facing 'top' (towards decreasing y)
      // User is looking North (up) or South (down).
      // Perpendicular distance is along X-axis relative to artwork's X.
      // ux is user's x, ax is artwork's x.
      const perpDistX = ux - ax; // If user is left of art, this is negative. If right, positive.
      angleY = mapRange(Math.abs(perpDistX), 0, MAX_PERPENDICULAR_DIST_FOR_ANGLE, 0, MAX_VIEWING_ANGLE_Y);
      
      if (perpDistX < 0) { // User is to the LEFT of the artwork's center column
        angleY = angleY; // Positive angle (e.g., artwork rotates to show its right side)
        transformOrigin = Math.abs(perpDistX) > 0.1 ? 'left center' : 'center center';
      } else if (perpDistX > 0) { // User is to the RIGHT of the artwork's center column
        angleY = -angleY; // Negative angle (e.g., artwork rotates to show its left side)
        transformOrigin = Math.abs(perpDistX) > 0.1 ? 'right center' : 'center center';
      } else {
        angleY = 0; // User is directly in line with artwork's X
        transformOrigin = 'center center';
      }
      // Scale based on distance along Y-axis (how far user is from the wall plane)
      const distY = Math.abs(deltaYUserToArtWall); // Should be 1 if directly in front
      scale = mapRange(distY, MIN_VIEW_DISTANCE_FOR_SCALE, MAX_VIEW_DISTANCE_FOR_SCALE, MAX_SCALE_VALUE, MIN_SCALE_VALUE);
      break;

    case 'right': // Artwork on a 'left' wall (e.g., x=1), facing 'right' (towards increasing x)
    case 'left':  // Artwork on a 'right' wall (e.g., x=11), facing 'left' (towards decreasing x)
      // User is looking West (left) or East (right).
      // Perpendicular distance is along Y-axis relative to artwork's Y.
      // uy is user's y, ay is artwork's y.
      const perpDistY = uy - ay; // If user is above art, this is negative. If below, positive.
      angleY = mapRange(Math.abs(perpDistY), 0, MAX_PERPENDICULAR_DIST_FOR_ANGLE, 0, MAX_VIEWING_ANGLE_Y);

      // This part needs careful thought: how should vertical offset translate to rotateY?
      // The PDF suggested rotating around Y based on HORIZONTAL offset even for side walls.
      // Let's assume rotateY is primarily for horizontal perspective.
      // If we want a vertical tilt (rotateX), that's a separate calculation.
      // For now, let's make rotateY react to user's X relative to the wall plane.
      // If artwork is on left wall (wallFace='right'), user's X vs artwork's X matters.
      // If artwork is on right wall (wallFace='left'), user's X vs artwork's X matters.

      // Let's use the X distance from the user to the wall plane for angleY
      const distXToWall = Math.abs(deltaXUserToArtWall); // Should be 1 if directly in front
      angleY = mapRange(distXToWall, 0, MAX_PERPENDICULAR_DIST_FOR_ANGLE, 0, MAX_VIEWING_ANGLE_Y);

      if (artworkInstance.wallFace === 'right') { // Artwork on left wall, user looking right
         // If user is further "into" the room (larger X than artwork's X, but this is deltaXUserToArtWall)
         // This needs to be based on user's orientation and which side of the artwork's center they are.
         // Let's simplify: if user is looking right at a left wall, the artwork should appear angled.
         // The sign of rotation depends on perpDistY (user's Y relative to artwork's Y)
        angleY = (perpDistY < 0) ? -angleY : angleY; // Viewing from top-ish or bottom-ish
        transformOrigin = 'left center'; // Pivot from the edge attached to the wall
      } else { // Artwork on right wall, user looking left
        angleY = (perpDistY < 0) ? angleY : -angleY; // Viewing from top-ish or bottom-ish
        transformOrigin = 'right center'; // Pivot from the edge attached to the wall
      }
      // Scale based on distance along X-axis (how far user is from the wall plane)
      scale = mapRange(distXToWall, MIN_VIEW_DISTANCE_FOR_SCALE, MAX_VIEW_DISTANCE_FOR_SCALE, MAX_SCALE_VALUE, MIN_SCALE_VALUE);
      break;

    default:
      // Should not happen if artworkInstance.wallFace is always valid
      return { transform: 'rotateY(0deg) scale(1)', origin: 'center center' };
  }

  // Clamp scale to reasonable values
  scale = Math.max(MIN_SCALE_VALUE / 2, Math.min(scale, MAX_SCALE_VALUE * 1.2)); // Allow slight larger for close views

  const transformString = `translateX(0px) rotateY(${angleY.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
  
  return {
    transform: transformString,
    origin: transformOrigin,
    // For state update, parse out the values if needed
    calculated: { rotateY: angleY, scale: scale, transformOrigin: transformOrigin, translateX: 0 }
  };
}


/**
 * Main function to update the gallery view.
 * Determines the target artwork, calculates its transform, and updates the DOM.
 * This should be called whenever the user's position or orientation changes.
 */
export function updateGalleryScene() {
  const currentUser = getUser(); // Get current user state { position, orientation }
  const { artworks: artworkStateData, galleryView: currentGalleryViewState } = getState();
  const allArtworkInstances = artworkStateData.richGalleryData;

  if (!currentUser || !allArtworkInstances || allArtworkInstances.length === 0) {
    // console.warn("[GalleryViewManager] Cannot update scene: missing user or artwork data.");
    // Ensure any currently visible artwork is hidden if data is missing
    if (currentGalleryViewState.currentArtworkIdInView && galleryArtworkDOMElements[currentGalleryViewState.currentArtworkIdInView]) {
      galleryArtworkDOMElements[currentGalleryViewState.currentArtworkIdInView].classList.remove('visible');
    }
    setGalleryViewArtwork(null, null);
    setGalleryViewVisibility(false);
    return;
  }

  const targetArtworkInstance = findTargetArtworkInstance(currentUser, allArtworkInstances);
  const newTargetId = targetArtworkInstance ? targetArtworkInstance.id : null;

  // If the artwork in view is changing (or going from something to nothing / nothing to something)
  if (currentGalleryViewState.currentArtworkIdInView !== newTargetId) {
    // Hide the previously visible artwork DOM element (if any)
    if (currentGalleryViewState.currentArtworkIdInView && galleryArtworkDOMElements[currentGalleryViewState.currentArtworkIdInView]) {
      galleryArtworkDOMElements[currentGalleryViewState.currentArtworkIdInView].classList.remove('visible');
    }

    // Update the state with the new artwork ID and its DOM element
    const newArtworkElement = newTargetId ? galleryArtworkDOMElements[newTargetId] : null;
    setGalleryViewArtwork(newTargetId, newArtworkElement);

    // Show the new artwork's DOM element (if any)
    if (newArtworkElement) {
      newArtworkElement.classList.add('visible');
      setGalleryViewVisibility(true);
    } else {
      setGalleryViewVisibility(false);
    }
  }

  // If there is an artwork currently in view (either new or same as before), update its transform
  if (newTargetId && galleryArtworkDOMElements[newTargetId] && targetArtworkInstance) {
    const { transform, origin, calculated } = calculateArtworkTransformStyle(currentUser, targetArtworkInstance);
    const elementToTransform = galleryArtworkDOMElements[newTargetId];

    elementToTransform.style.transformOrigin = origin;
    elementToTransform.style.transform = transform;

    // Update the galleryView state with the new transform details
    setGalleryViewTransform(calculated);
  } else if (!newTargetId && currentGalleryViewState.isVisible) {
    // If no artwork should be in view, but state says one is visible, ensure it's marked not visible.
    // This case should ideally be handled by the block above, but as a safeguard:
    setGalleryViewVisibility(false);
  }
}

console.info('[galleryViewManager.js] Gallery View Manager module loaded.');
