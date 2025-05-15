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
    // Will hold the structured layout data (walls, artwork placements on the map).
    // This will be populated by fetching/processing layout.json or from an internal definition.
    // Example item: { x: 1, y: 1, isWall: true, wallBorders: { left: true, top: true }, artworkId: null, artworkBorders: {} }
    layout: [],
    mapReady: false, // Flag to indicate if the map and its layout data are loaded
  },

  // Information about all available artworks in the gallery.
  artworks: {
    // `data` will store artwork details keyed by artworkId for quick lookup.
    // Example: 'P1': { id: 'P1', name: 'Artwork One', imageUrl: '/images/P1.jpg', ... }
    data: {},
    // `richGalleryData` will store the array of artwork objects,
    // potentially including multiple instances if an artwork spans several cells or appears in multiple places.
    // This structure is based on the TSATELIER-PROJECT-DOC-MAY5:25.pdf
    // Example item: { id: 'P7', x: 2, y: 1, wallFace: 'bottom', imageUrl: '/images/P7.jpg', actualWidth: 600, actualHeight: 400 }
    richGalleryData: [],
    allLoaded: false, // Flag to indicate if all artwork metadata has been processed
  },

  // State for the main #gallery-container where the pseudo-3D artwork view is rendered.
  galleryView: {
    containerElement: null, // Reference to the #gallery-container DOM element
    perspective: 800, // Default CSS perspective value (in px)
    perspectiveOrigin: 'center center', // Default CSS perspective-origin

    currentArtworkIdInView: null, // The ID (e.g., 'P1') of the artwork currently being displayed
    currentArtworkElement: null,  // Reference to the DOM element of the artwork being shown

    // Stores the calculated transform components for the current artwork in view.
    // This allows for individual components to be updated and then combined into a CSS string.
    currentTransform: {
      translateX: 0,    // in pixels
      rotateY: 0,       // in degrees
      scale: 1,         // unitless
      transformOrigin: 'center center', // CSS transform-origin string
    },
    isVisible: false, // Is an artwork currently being shown in the gallery view?
  },

  // General User Interface states for the application.
  ui: {
    isLoading: true, // True if the application is in a general loading state (e.g., initial data fetch)
    errorMessage: null, // Stores any critical error message to be displayed to the user
    // Example: isSidebarOpen: true, activeModal: null, etc.
    mapVisibleMobile: false, // For the map toggle button on mobile view
    infoPanelContent: '', // Content for the #information panel
  },

  // (Optional) History state can be conceptualized here, though history.js manages its own internal stack.
  // history: {
  //   canUndo: false,
  //   canRedo: false,
  // }
};

console.info('[initialState.js] TSATELIER initial state structure defined.');