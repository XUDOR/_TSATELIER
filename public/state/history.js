// public/state/history.js
// Purpose: Manages state history for undo/redo operations using full application state snapshots.
// Adapted for TSATELIER's state structure.

import {
  // Getters from indexState (not typically needed here if snapshots are passed to pushState)
  // getState,

  // Setters from indexState, categorized by the state slice they affect
  // Device State
  updateDeviceAndViewportInfo, // Note: This recalculates. If snapshot has specific values, a dedicated setter might be better.
                               // For now, we'll assume re-triggering update is acceptable or initialState has a more direct setter.
                               // Let's assume initialState.device can be directly set for simplicity in snapshot restoration.

  // Gallery Map State
  setUserPosition,
  setUserOrientation,
  loadLayoutData, // This re-fetches/reprocesses; for history, direct state set is better.

  // Artwork State
  loadAllArtworkDetails, // Similar to loadLayoutData, direct set is better for history.

  // Gallery View State
  setGalleryContainerElement, // Usually set once, might not need to be in history snapshots often.
  setGalleryViewArtwork,
  setGalleryViewTransform,
  setGalleryViewVisibility,

  // UI State
  setLoading,
  setErrorMessage,
  toggleMapVisibilityMobile, // This is a toggle; for history, direct set of the boolean is better.
  setInfoPanelContent,

  // Core _updateState to directly manipulate state for snapshot restoration
  _updateState,
  getState // To get the current state for pushing

} from './indexState.js'; // Assuming all necessary setters will be exported

const stateHistory = [];
const MAX_HISTORY_LENGTH = 20; // Max number of states to keep in history

/**
 * Applies a given state snapshot to the application.
 * This function will call individual state setters or directly update
 * parts of the state tree for more complex/direct restorations.
 * @param {object} snapshot - The state snapshot object to apply.
 */
export function applyStateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    console.error('[history] applyStateSnapshot: Invalid snapshot provided.', snapshot);
    return;
  }
  console.log('[history] Applying state snapshot...');

  // For robust snapshot application, it's often best to update the state
  // as directly as possible to avoid side effects from regular setters
  // that might, for example, re-fetch data or re-calculate derived values
  // when all we want is to restore the exact previous raw state.
  // We'll use a mix: direct _updateState for some, specific setters for others.

  _updateState(currentState => {
    // Device State
    if (snapshot.device) {
      currentState.device = structuredClone(snapshot.device);
      // After direct update, ensure DOM attributes are synced if deviceState setters normally do that
      const root = document.documentElement;
      root.dataset.deviceType = currentState.device.type;
      root.dataset.orientation = currentState.device.orientation;
    }

    // GalleryMap State
    if (snapshot.galleryMap) {
      currentState.galleryMap.user = structuredClone(snapshot.galleryMap.user);
      // For layout, if it's static once loaded, it might not need to be in every snapshot.
      // If it can change, it should be restored.
      currentState.galleryMap.layout = structuredClone(snapshot.galleryMap.layout || []);
      currentState.galleryMap.mapReady = snapshot.galleryMap.mapReady !== undefined ? snapshot.galleryMap.mapReady : currentState.galleryMap.mapReady;
    }

    // Artworks State
    if (snapshot.artworks) {
      // Similar to layout, if artwork details are static after initial load,
      // they might not need to be in every snapshot.
      currentState.artworks.data = structuredClone(snapshot.artworks.data || {});
      currentState.artworks.richGalleryData = structuredClone(snapshot.artworks.richGalleryData || []);
      currentState.artworks.allLoaded = snapshot.artworks.allLoaded !== undefined ? snapshot.artworks.allLoaded : currentState.artworks.allLoaded;
    }

    // GalleryView State
    if (snapshot.galleryView) {
      // containerElement and currentArtworkElement are DOM refs, don't clone/restore directly from typical snapshot.
      // These should be re-established by the view logic based on IDs.
      currentState.galleryView.currentArtworkIdInView = snapshot.galleryView.currentArtworkIdInView;
      currentState.galleryView.currentTransform = structuredClone(snapshot.galleryView.currentTransform);
      currentState.galleryView.isVisible = snapshot.galleryView.isVisible;
      // The actual DOM element for currentArtworkElement will be updated by galleryViewManager
      // based on currentArtworkIdInView.
    }

    // UI State
    if (snapshot.ui) {
      currentState.ui.isLoading = snapshot.ui.isLoading;
      currentState.ui.errorMessage = snapshot.ui.errorMessage;
      currentState.ui.mapVisibleMobile = snapshot.ui.mapVisibleMobile;
      currentState.ui.infoPanelContent = snapshot.ui.infoPanelContent;
    }
  });

  // After the state is updated by _updateState, the notify() call within _updateState
  // will trigger subscribers. UI components should then re-render based on the new state.
  // For example, galleryViewManager would re-check currentArtworkIdInView and update the DOM.

  console.log('[history] State snapshot applied. UI should re-render based on new state.');
}

/**
 * Pushes a clone of the current application state onto the history stack.
 * @param {object} stateToPush - The current state object (usually from getState()).
 */
export function pushStateToHistory(stateToPush) {
  if (!stateToPush || typeof stateToPush !== 'object') {
    console.error("[history] pushStateToHistory: Invalid state object provided.", stateToPush);
    return;
  }
  // Create a deep clone of the state to store in history
  const snapshotClone = structuredClone(stateToPush);

  // Manage history length
  if (stateHistory.length >= MAX_HISTORY_LENGTH) {
    stateHistory.shift(); // Remove the oldest state
  }
  stateHistory.push(snapshotClone);
  // console.log(`[history] State snapshot pushed. History length: ${stateHistory.length}`);
}

/**
 * Pops the most recent state from the history stack and applies it.
 * If no history is available, it does nothing.
 */
export function undo() {
  if (stateHistory.length > 1) { // Keep at least the initial state
    stateHistory.pop(); // Remove the current state (which is the last one pushed)
    const  previousState = stateHistory[stateHistory.length -1]; // Get the new "current"
    if (previousState) {
      applyStateSnapshot(structuredClone(previousState)); // Apply a clone of it
      console.log('[history] Undo: Applied previous state.');
    }
  } else if (stateHistory.length === 1) {
     const  initialStateCopy = stateHistory[0];
     applyStateSnapshot(structuredClone(initialStateCopy)); // Re-apply the initial state
     console.warn("[history] Undo: Reverted to initial state. No further undo history.");
  }
  else {
    console.warn("[history] Undo: History is empty or only initial state remains.");
  }
}


// --- Simpler History API (more aligned with typical undo) ---

/**
 * Pushes the current application state (obtained via getState) to the history stack.
 * This is a convenience wrapper around pushStateToHistory(getState()).
 */
export function recordCurrentStateForHistory() {
    const currentState = getState();
    pushStateToHistory(currentState);
}


// (Redo functionality would require a separate redo stack and is more complex)
// export function redo() { ... }


export function getHistoryLength() {
  return stateHistory.length;
}

/**
 * Clears the entire state history.
 * Optionally, pushes the current state as the new initial historical state.
 * @param {boolean} recordCurrentAsInitial - If true, current state becomes the new history base.
 */
export function clearHistory(recordCurrentAsInitial = true) {
  stateHistory.length = 0; // Clear the array
  if (recordCurrentAsInitial) {
    recordCurrentStateForHistory(); // Add the current state as the new baseline
  }
  console.log("[history] History cleared.", recordCurrentAsInitial ? "Current state recorded as new initial." : "");
}

console.info('[history.js] History management module loaded.');
