// public/state/indexState.js
// Purpose: Central orchestrator for TSATELIER's state management.
// Initializes the state, provides core state functions (getState, _updateState, subscribe),
// and re-exports actions and getters from individual state modules.

import { initialState } from './initialState.js';
import { notify, subscribe as pubsubSubscribe } from './pubsub.js';
// import { pushState as historyPushState } from './history.js'; // Uncomment if/when history.js is added and used

// --- Core State Management ---

// Initialize the private _state variable with a deep clone of the initialState.
// structuredClone is a modern way to deep clone objects.
let _state = structuredClone(initialState);

// Immediately notify any subscribers about the initial state.
// This is important for modules that might subscribe early and need the starting state.
notify(_state);

/**
 * Retrieves a deep clone of the current application state.
 * Cloning ensures that the internal _state cannot be mutated directly from outside,
 * adhering to a more predictable state management pattern.
 * @returns {object} A deep clone of the current state.
 */
export function getState() {
  return structuredClone(_state);
}

/**
 * Internal function intended for use by individual state modules to update the state.
 * It takes an updater function, which receives the current state draft and can modify it.
 * After the updater function runs, it notifies all subscribers of the change.
 * @param {Function} updaterFn - A function that receives the current state (_state) and modifies it.
 */
export function _updateState(updaterFn) {
  if (typeof updaterFn !== 'function') {
    console.error("[indexState] _updateState expects a function as its argument.");
    return;
  }
  updaterFn(_state); // The updater function mutates the _state directly.
  notify(_state);    // Notify all subscribers with the new state.

  // Optional: Push state to history after updates
  // if (typeof historyPushState === 'function') {
  //   historyPushState(structuredClone(_state));
  // }
}

/**
 * Re-exports the subscribe function from pubsub.js.
 * Allows other modules to listen for state changes.
 */
export const subscribe = pubsubSubscribe;

/**
 * (Optional) Re-exports the pushState function from history.js.
 * Allows actions to push the current state to the history stack for undo/redo.
 */
// export const pushState = historyPushState; // Uncomment if/when history.js is added

// --- Module Imports & Re-exports ---
// Import all functions from individual state modules and re-export them
// so that other parts of the application can access them from this central point.

import * as deviceState from './deviceState.js';
export const {
  updateDeviceAndViewportInfo,
  getDeviceInfo,
  // setDeviceSnapshot, // Optional, if you implement it
} = deviceState;

import * as galleryMapState from './galleryMapState.js';
export const {
  setUserPosition,
  setUserOrientation,
  loadLayoutData,
  getGalleryMapInfo,
  getUser,
  getLayout,
  isCellWall, // Example helper, may move to a controller
} = galleryMapState;

import * as artworkState from './artworkState.js';
export const {
  loadAllArtworkDetails,
  getArtworkById,
  getAllArtworksInfo,
  getRichGalleryData,
} = artworkState;

import * as galleryViewState from './galleryViewState.js';
export const {
  setGalleryContainerElement,
  setGalleryViewArtwork,
  setGalleryViewTransform,
  setGalleryViewVisibility,
  getGalleryViewInfo,
} = galleryViewState;

import * as uiState from './uiState.js';
export const {
  setLoading,
  setErrorMessage,
  toggleMapVisibilityMobile,
  setInfoPanelContent,
  getUiInfo,
} = uiState;

// If you add history.js, you might re-export its functions too:
// import * as historyManager from './history.js';
// export const { applyStateSnapshot, popState, getHistoryLength, getOriginalState, clearHistory } = historyManager;


console.info('[indexState.js] TSATELIER Central State Orchestrator initialized and modules integrated.');
