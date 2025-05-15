// public/state/uiState.js
// Purpose: Manages general User Interface states for the application,
// such as loading status, error messages, and visibility of UI elements.

import { _updateState, getState as getFullState } from './indexState.js';

/**
 * Sets the application's global loading state.
 * @param {boolean} isLoading - True if the application is currently loading data or performing a lengthy operation.
 */
export function setLoading(isLoading) {
  _updateState(currentState => {
    currentState.ui.isLoading = !!isLoading; // Ensure boolean
    // console.log(`[uiState] isLoading set to: ${!!isLoading}`);
  });
}

/**
 * Sets an error message to be potentially displayed to the user.
 * @param {string|null} message - The error message string, or null to clear any existing error.
 */
export function setErrorMessage(message) {
  _updateState(currentState => {
    currentState.ui.errorMessage = message;
    if (message) {
      console.error(`[uiState] Error message set: ${message}`);
    } else {
      // console.log('[uiState] Error message cleared.');
    }
  });
}

/**
 * Toggles the visibility state of the map, typically for mobile views.
 */
export function toggleMapVisibilityMobile() {
  _updateState(currentState => {
    currentState.ui.mapVisibleMobile = !currentState.ui.mapVisibleMobile;
    // console.log(`[uiState] Map visibility (mobile) toggled to: ${currentState.ui.mapVisibleMobile}`);
  });
}

/**
 * Sets the content for the information panel.
 * @param {string} htmlContent - The HTML or text content to display in the info panel.
 */
export function setInfoPanelContent(htmlContent) {
    _updateState(currentState => {
        currentState.ui.infoPanelContent = htmlContent;
    });
}

/**
 * Retrieves a clone of the current UI state.
 * @returns {object} A deep clone of the UI state.
 */
export function getUiInfo() {
  const { ui } = getFullState();
  return structuredClone(ui);
}

// Add other UI-related state management functions as needed, for example:
// export function setActiveTool(toolName) { ... }
// export function openModal(modalId, modalData) { ... }
// export function closeModal() { ... }

console.info('[uiState.js] UI state module loaded.');
