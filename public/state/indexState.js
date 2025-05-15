// public/state/indexState.js
// Purpose: Central orchestrator for TSATELIER's state management.
// Version 2: Adjusted exports from galleryViewState.

import { initialState } from './initialState.js'; // Ensure this is v2
import { notify, subscribe as pubsubSubscribe } from './pubsub.js';
// import { pushState as historyPushState, recordCurrentStateForHistory } from './history.js'; // Assuming history.js is present

// --- Core State Management ---
let _state = structuredClone(initialState);
notify(_state);

export function getState() {
  return structuredClone(_state);
}

export function _updateState(updaterFn) {
  if (typeof updaterFn !== 'function') {
    console.error("[indexState] _updateState expects a function as its argument.");
    return;
  }
  updaterFn(_state);
  notify(_state);

  // Optional: Push state to history after updates
  // if (typeof recordCurrentStateForHistory === 'function') {
  //   recordCurrentStateForHistory(); // Call the specific function from history.js
  // }
}

export const subscribe = pubsubSubscribe;
// export const pushState = historyPushState; // If you want to expose the direct push from history

// --- Module Imports & Re-exports ---

import * as deviceState from './deviceState.js';
export const {
  updateDeviceAndViewportInfo,
  getDeviceInfo,
} = deviceState;

import * as galleryMapState from './galleryMapState.js';
export const {
  setUserPosition,
  setUserOrientation,
  loadLayoutData,
  getGalleryMapInfo,
  getUser,
  getLayout,
  isCellWall,
} = galleryMapState;

import * as artworkState from './artworkState.js';
export const {
  loadAllArtworkDetails,
  getArtworkById,
  getAllArtworksInfo,
  getRichGalleryData,
} = artworkState;

import * as galleryViewState from './galleryViewState.js'; // Ensure this is v2
export const {
  // setGalleryContainerElement, // REMOVED from exports
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

// If using history.js
import * as historyManager from './history.js'; // Assuming history.js is present
export const { 
    applyStateSnapshot, 
    undo, // Assuming history.js exports 'undo'
    recordCurrentStateForHistory, // Assuming history.js exports this
    getHistoryLength, 
    clearHistory 
} = historyManager;


console.info('[indexState.js] TSATELIER Central State Orchestrator initialized (v2).');
