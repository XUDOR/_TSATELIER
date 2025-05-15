// public/state/initialState.js

/**
 * Defines the initial structure and default values for the entire
 * TSATELIER application state. This serves as the blueprint for the
 * "single source of truth."
 */
export const initialState = {
  // Manages browser window properties, device type, and orientation.
  device: {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    type: 'desktop', // Default, will be updated by deviceState.js
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait', // Initial guess
  },

  // State related to the 2D navigation map itself.
  galleryMap: {
    gridSize: 11, // As defined in the original script.js
    user: {
      position: { x: 10, y: 11 }, // Default starting position from original script.js
      orientation: 'up', // 'up', 'down', 'left', 'right'
    },
    layout: [],
    mapReady: false,
  },

  // Information about all available artworks in the gallery.
  artworks: {
    data: {},
    richGalleryData: [],
    allLoaded: false,
  },

  // State for the main #gallery-container where the pseudo-3D artwork view is rendered.
  galleryView: {
    // REMOVED: containerElement: null,
    perspective: 800,
    perspectiveOrigin: 'center center',
    currentArtworkIdInView: null, // The ID (e.g., 'P1') of the artwork currently being displayed
    // REMOVED: currentArtworkElement: null,
    currentTransform: {
      translateX: 0,
      rotateY: 0,
      scale: 1,
      transformOrigin: 'center center',
    },
    isVisible: false,
  },

  // General User Interface states for the application.
  ui: {
    isLoading: true,
    errorMessage: null,
    mapVisibleMobile: false,
    infoPanelContent: '',
  },
};

console.info('[initialState.js] TSATELIER initial state structure defined (v2 - no DOM elements).');
