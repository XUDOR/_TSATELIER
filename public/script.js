// public/script.js
// Main application orchestrator for TSATELIER Interactive Gallery Space

import {
  getState,
  subscribe,
  // State Setters & Getters from indexState.js
  updateDeviceAndViewportInfo,
  setGalleryContainerElement,
  loadLayoutData, // From galleryMapState
  loadAllArtworkDetails, // From artworkState
  getUser, // From galleryMapState
  getLayout, // From galleryMapState
  setInfoPanelContent, // From uiState
  toggleMapVisibilityMobile, // From uiState
  setLoading, // From uiState
  setErrorMessage, // From uiState
  // For History (if you implement UI for it)
  // recordCurrentStateForHistory, // from historyState via indexState
  // undo as undoAction, // alias if needed
} from './state/indexState.js';

import {
  initializeNavigation,
  // handleUserNavigation, // Event listeners in initializeNavigation call this internally
} from './core/navigationController.js';

import {
  initializeGalleryScene,
  updateGalleryScene,
} from './core/galleryViewManager.js';

// Import the curated artwork metadata
// Ensure you have created this file: public/data/artworkManifest.js
// and populated it with your 14 selected artworks.
import { artworkManifest } from './data/artworkManifest.js';


// --- DOM Element References (cached on init) ---
let mapElementRef;
let mapContainerElementRef;
let infoPanelElementRef; // This is the div where content goes
let mapToggleButtonRef;
let userMarkerElement; // For the 2D map
let userArrowElement;  // Arrow inside the userMarkerElement

// --- Constants ---
const APP_GRID_SIZE = 11; // Should ideally be read from state.galleryMap.gridSize after init

// --- Initialization Functions ---

/**
 * Caches references to essential DOM elements.
 */
function cacheDOMElements() {
  mapElementRef = document.getElementById('map');
  mapContainerElementRef = document.getElementById('map-container');
  infoPanelElementRef = document.getElementById('information');
  mapToggleButtonRef = document.getElementById('map-toggle-button');
  
  const galleryContainer = document.getElementById('gallery-container');
  if (galleryContainer) {
    setGalleryContainerElement(galleryContainer); // Store in state for galleryViewManager
  } else {
    console.error("CRITICAL: #gallery-container DOM element not found!");
    setErrorMessage("Gallery view cannot be initialized: Missing #gallery-container.");
  }
}

/**
 * Creates the user marker DOM elements for the 2D map.
 * These are stored globally within this script for now.
 */
function createUserMarkerForMap() {
    userMarkerElement = document.createElement("div");
    userMarkerElement.id = "user-marker";
    userMarkerElement.style.position = 'relative'; // For arrow positioning within the grid cell

    userArrowElement = document.createElement("div");
    userArrowElement.id = "user-arrow";
    // Basic styles are set here; detailed appearance (shape, color) should be in CSS.
    userArrowElement.style.position = 'absolute';
    userArrowElement.style.top = '50%';
    userArrowElement.style.left = '50%';
    userArrowElement.style.transform = 'translate(-50%, -50%) rotate(0deg)'; // Initial orientation
    userMarkerElement.appendChild(userArrowElement);

    // The marker is appended to mapElementRef in renderMapGrid after cells are created.
}

/**
 * Processes raw layout data (from layout.json) and artwork manifest
 * to create the richGalleryData array needed by artworkState.
 * @param {Array} rawLayoutCells - Array of cell objects from layout.json (now from state.galleryMap.layout).
 * @param {object} manifest - The artworkManifest object.
 * @returns {Array} An array of richGalleryData objects.
 */
function processDataForArtworkState(rawLayoutCells, manifest) {
    const richGalleryDataArray = [];
    if (!rawLayoutCells || rawLayoutCells.length === 0) {
        console.warn("[DataProcessing] Raw layout data is empty or missing for artwork processing.");
        return richGalleryDataArray; // Return empty if no layout to process
    }
    if (!manifest || Object.keys(manifest).length === 0) {
        console.warn("[DataProcessing] Artwork manifest is empty or missing.");
        return richGalleryDataArray; // Return empty if no manifest to reference
    }

    rawLayoutCells.forEach(cell => {
        if (cell.artworkId) { // Check if this cell has an artwork
            const meta = manifest[cell.artworkId];
            if (!meta) {
                console.warn(`[DataProcessing] No metadata in manifest for artworkId: ${cell.artworkId} at cell (${cell.x}, ${cell.y})`);
                return; // Skip this artwork instance if no metadata found
            }

            let wallFace = null;
            // Derive wallFace from artworkBorders (the side of the cell the artwork is on)
            if (cell.artworkBorders) {
                if (cell.artworkBorders.top) wallFace = 'bottom'; // Art on top edge of cell faces DOWN
                else if (cell.artworkBorders.bottom) wallFace = 'top'; // Art on bottom edge of cell faces UP
                else if (cell.artworkBorders.left) wallFace = 'right'; // Art on left edge of cell faces RIGHT
                else if (cell.artworkBorders.right) wallFace = 'left'; // Art on right edge of cell faces LEFT
            }

            if (wallFace) {
                richGalleryDataArray.push({
                    id: cell.artworkId, // ID of the artwork piece (e.g., "MERIDIANS_I")
                    instanceId: `${cell.artworkId}-${cell.x}-${cell.y}`, // Unique ID for this specific placement
                    x: cell.x, // Grid x-coordinate of this artwork instance's cell
                    y: cell.y, // Grid y-coordinate of this artwork instance's cell
                    wallFace: wallFace, // The direction this artwork instance is facing
                    imageUrl: meta.imageUrl,
                    actualWidth: meta.actualWidth,
                    actualHeight: meta.actualHeight,
                    name: meta.name || `Artwork ${cell.artworkId}`,
                    description: meta.description || '',
                    medium: meta.medium || '', // Added from manifest
                    exhibition: meta.exhibition || '', // Added from manifest
                    dimensionsOriginal: meta.dimensionsOriginal || '', // Added from manifest
                });
            } else {
                // This warning is important for debugging your layout.json
                console.warn(`[DataProcessing] Artwork ${cell.artworkId} at cell (${cell.x},${cell.y}) has no defined 'artworkBorders' or it's empty. Cannot determine wallFace.`);
            }
        }
    });
    return richGalleryDataArray;
}

/**
 * Main data initialization sequence.
 * Fetches layout from server, processes it with local artworkManifest,
 * and loads all data into the central state.
 */
async function initializeApplicationData() {
  try {
    setLoading(true); // Update UI state to indicate loading
    
    // 1. Load Grid Layout Data (from /data/layout.json served by server.js)
    // This action populates state.galleryMap.layout and sets state.galleryMap.mapReady
    await loadLayoutData('/data/layout.json'); // This is an async function from galleryMapState.js

    const currentAppState = getState(); // Get the state *after* layout data should be loaded
    if (!currentAppState.galleryMap.mapReady) {
        // loadLayoutData should have set an error message in uiState if it failed.
        throw new Error("Layout data failed to load or map not marked as ready. Check console for details from galleryMapState.");
    }

    // 2. Process the loaded layout data with the local artworkManifest
    const rawLayout = currentAppState.galleryMap.layout; // This is the array of cell objects from layout.json
    const richGalleryData = processDataForArtworkState(rawLayout, artworkManifest);

    if (richGalleryData.length === 0) {
        console.warn("[AppInit] No rich artwork data was processed. Check layout.json for artworkId entries and artworkManifest.js for corresponding IDs and artworkBorders in layout.json.");
    }

    // 3. Load Processed Artwork Instance Data (richGalleryData) into artworkState
    // This populates state.artworks.data (unique artwork details) and state.artworks.richGalleryData (all instances)
    loadAllArtworkDetails(richGalleryData); // This is a synchronous state update

    console.log("[AppInit] Application data (layout and artworks) processed and loaded into state.");
    // setLoading(false); // Keep loading true until the entire app UI is ready

  } catch (error) {
    console.error("[AppInit] CRITICAL ERROR during data initialization:", error);
    setErrorMessage(`App data error: ${error.message}`); // Update UI state with error
    setLoading(false); // Ensure loading is false on critical error
    throw error; // Re-throw to stop further app initialization if data load fails
  }
}

// --- UI Update Functions (called by state subscriber or during init) ---

/**
 * Renders the 2D map grid based on layout data from the state.
 */
function renderMapGrid() {
  if (!mapElementRef) {
    console.error("[RenderMap] Map DOM element not cached (mapElementRef is null). Cannot render grid.");
    return;
  }
  mapElementRef.innerHTML = ''; // Clear previous grid (user marker will be re-added)

  const { galleryMap } = getState(); // Get the relevant slice of state
  const layoutCells = galleryMap.layout; // This is the array of cell objects from layout.json
  const gridSize = galleryMap.gridSize || APP_GRID_SIZE; // Use state's gridSize or fallback

  if (!galleryMap.mapReady || !layoutCells || layoutCells.length === 0) {
    mapElementRef.textContent = "Map data loading or unavailable...";
    console.warn("[RenderMap] Map not ready or layout data is empty. Cannot render map grid.");
    return;
  }
  
  // Ensure mapElementRef is styled as a grid container by CSS or here
  mapElementRef.style.display = 'grid';
  mapElementRef.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  mapElementRef.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  // Create a map of cell data for efficient lookup by "x-y" string key
  const cellDataMap = new Map();
  layoutCells.forEach(cell => cellDataMap.set(`${cell.x}-${cell.y}`, cell));

  for (let r = 1; r <= gridSize; r++) { // row (y)
    for (let c = 1; c <= gridSize; c++) { // column (x)
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('map-cell');
      // cellDiv.title = `Cell (${c},${r})`; // For hover debugging

      const cellDetails = cellDataMap.get(`${c}-${r}`);
      if (cellDetails) {
        // Apply Wall Borders from cellDetails.wallBorders
        if (cellDetails.isWall && cellDetails.wallBorders) {
          // Use CSS variables if defined, otherwise fallback to a default color
          const wallBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-map-border').trim() || '#87857B';
          if (cellDetails.wallBorders.top) cellDiv.style.borderTop = `2px solid ${wallBorderColor}`;
          if (cellDetails.wallBorders.bottom) cellDiv.style.borderBottom = `2px solid ${wallBorderColor}`;
          if (cellDetails.wallBorders.left) cellDiv.style.borderLeft = `2px solid ${wallBorderColor}`;
          if (cellDetails.wallBorders.right) cellDiv.style.borderRight = `2px solid ${wallBorderColor}`;
        }
        // Apply Artwork Markers on the map (visual indicators, not the 3D view)
        if (cellDetails.artworkId && cellDetails.artworkBorders) {
          const artworkMapMarker = document.createElement('div');
          artworkMapMarker.classList.add('artwork-on-map-marker'); // Style this class in CSS
          // Example: Simple dot or small square. Could be color-coded.
          // artworkMapMarker.title = `Artwork: ${cellDetails.artworkId}`;
          const artworkBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-map-artwork-border').trim() || '#D8DCD2';
          if (cellDetails.artworkBorders.top) artworkMapMarker.style.cssText = `position:absolute; top:0; left:0; right:0; height:3px; background-color:${artworkBorderColor};`;
          else if (cellDetails.artworkBorders.bottom) artworkMapMarker.style.cssText = `position:absolute; bottom:0; left:0; right:0; height:3px; background-color:${artworkBorderColor};`;
          else if (cellDetails.artworkBorders.left) artworkMapMarker.style.cssText = `position:absolute; top:0; bottom:0; left:0; width:3px; background-color:${artworkBorderColor};`;
          else if (cellDetails.artworkBorders.right) artworkMapMarker.style.cssText = `position:absolute; top:0; bottom:0; right:0; width:3px; background-color:${artworkBorderColor};`;
          cellDiv.appendChild(artworkMapMarker);
        }
      }
      mapElementRef.appendChild(cellDiv);
    }
  }
  // Re-append user marker after clearing and rebuilding grid
  if(userMarkerElement) {
    mapElementRef.appendChild(userMarkerElement);
  } else {
    console.warn("[RenderMap] userMarkerElement not created before map render, cannot append.");
  }
  // console.log("[RenderMap] Map grid rendered.");
}

/**
 * Updates the position and rotation of the user marker on the 2D map.
 */
function updateUserMarkerOnMap() {
  if (!userMarkerElement || !userArrowElement) {
    // This might be called by subscriber before elements are ready on initial load.
    // console.warn("[UpdateMarker] User marker or arrow element not available yet.");
    return;
  }
  const userState = getUser(); // From galleryMapState (already cloned)
  userMarkerElement.style.gridRowStart = userState.position.y;
  userMarkerElement.style.gridColumnStart = userState.position.x;

  let rotationDegree = 0;
  switch (userState.orientation) {
    case 'up': rotationDegree = 0; break;
    case 'down': rotationDegree = 180; break;
    case 'left': rotationDegree = 270; break;
    case 'right': rotationDegree = 90; break;
  }
  userArrowElement.style.transform = `translate(-50%, -50%) rotate(${rotationDegree}deg)`;
}

/**
 * Updates the content of the HTML information panel based on current state.
 */
function updateInformationPanel() {
  if (!infoPanelElementRef) return;

  const userState = getUser(); // { position, orientation }
  const { artworks, galleryMap, galleryView, device } = getState(); // Get relevant state slices
  const gridSize = galleryMap.gridSize || APP_GRID_SIZE;

  const currentSquareNumber = (userState.position.y - 1) * gridSize + userState.position.x;
  let infoLines = [
    `Device: ${device.type} (${device.viewportWidth}x${device.viewportHeight}) ${device.orientation}`,
    `User: (${userState.position.x}, ${userState.position.y}) | Cell: ${currentSquareNumber} | Facing: ${userState.orientation}`
  ];

  // Artwork user is standing in/near (from 2D map layout)
  const cellUserIsIn = galleryMap.layout.find(c => c.x === userState.position.x && c.y === userState.position.y);
  if (cellUserIsIn && cellUserIsIn.artworkId && artworks.data[cellUserIsIn.artworkId]) {
      const artMeta = artworks.data[cellUserIsIn.artworkId];
      infoLines.push(`At: ${artMeta.name || artMeta.id} (${artMeta.dimensionsOriginal || 'N/A'})`);
  }

  // Artwork currently being viewed in the 3D gallery
  if (galleryView.currentArtworkIdInView && artworks.data[galleryView.currentArtworkIdInView]) {
      const viewedArt = artworks.data[galleryView.currentArtworkIdInView];
      infoLines.push(`Viewing: ${viewedArt.name || viewedArt.id} (${viewedArt.dimensionsOriginal || 'N/A'})`);
      if(viewedArt.medium) infoLines.push(`Medium: ${viewedArt.medium}`);
      if(viewedArt.exhibition) infoLines.push(`Exhibition: ${viewedArt.exhibition}`);
  }
  
  setInfoPanelContent(infoLines.join('<br>')); // Update state; subscriber will update DOM
}

/**
 * Handles state changes from the pubsub system and triggers relevant UI updates.
 * @param {object} newState - The new application state (cloned).
 */
function handleStateChange(newState) {
  // console.log("[StateChange] Detected state change. New user pos:", newState.galleryMap.user.position);

  // Update UI elements based on changes in the new state.
  // These functions read from the state internally.
  updateUserMarkerOnMap();
  updateInformationPanel();
  updateGalleryScene(); // For the 3D view

  // Update info panel DOM from uiState.infoPanelContent (which was set by updateInformationPanel)
  if (infoPanelElementRef && infoPanelElementRef.innerHTML !== newState.ui.infoPanelContent) {
    infoPanelElementRef.innerHTML = newState.ui.infoPanelContent;
  }

  // Mobile map toggle DOM update
  if (mapContainerElementRef && mapToggleButtonRef) {
    const icon = mapToggleButtonRef.querySelector('.toggle-icon');
    if (newState.ui.mapVisibleMobile) {
        mapContainerElementRef.classList.remove('map-collapsed');
        if(icon) icon.textContent = '▼';
        mapToggleButtonRef.setAttribute('aria-expanded', 'true');
    } else {
        mapContainerElementRef.classList.add('map-collapsed');
        if(icon) icon.textContent = '▶';
        mapToggleButtonRef.setAttribute('aria-expanded', 'false');
    }
  }

  // Loading indicator on body (add a class like 'app-is-loading' to body in CSS)
  if (newState.ui.isLoading) {
    document.body.classList.add('app-is-loading');
  } else {
    document.body.classList.remove('app-is-loading');
  }

  // Error message display
  const errorDisplayElement = document.getElementById('app-error-display');
  if (errorDisplayElement) {
    if (newState.ui.errorMessage) {
        errorDisplayElement.textContent = newState.ui.errorMessage;
        errorDisplayElement.style.display = 'block';
    } else {
        errorDisplayElement.textContent = '';
        errorDisplayElement.style.display = 'none';
    }
  }
}

/**
 * Main application initialization function.
 */
async function initializeApp() {
  console.log("[AppInit] Initializing TSATELIER Application (Modular)...");
  setLoading(true); // Set initial loading state
  cacheDOMElements();

  // Initialize device state and set up listeners for window resize/orientation
  updateDeviceAndViewportInfo(); // Initial call
  window.addEventListener('resize', updateDeviceAndViewportInfo);
  window.addEventListener('orientationchange', updateDeviceAndViewportInfo);

  try {
    // Load layout (from /data/layout.json) and artwork metadata (from artworkManifest.js) into state
    await initializeApplicationData(); // This is crucial and async
  } catch (e) {
    console.error("[AppInit] Stopping app initialization due to data loading failure.");
    // Error message should have been set in uiState by initializeApplicationData
    // The state subscriber (if already active, or first call to handleStateChange) will display it.
    // For safety, explicitly update error display here too.
    const errorDisplayElement = document.getElementById('app-error-display');
    if(errorDisplayElement) {
        errorDisplayElement.textContent = getState().ui.errorMessage || "Critical data loading error.";
        errorDisplayElement.style.display = 'block';
    }
    setLoading(false);
    return; // Stop further initialization
  }

  // Create the user marker for the 2D map (must be done before first map render if map clears children)
  createUserMarkerForMap();

  // Initial render of the 2D map grid (uses data from galleryMapState)
  renderMapGrid();

  // Initialize navigation controls (keyboard, buttons) - this sets up event listeners
  initializeNavigation(); // From navigationController.js

  // Initialize the 3D gallery scene (creates hidden divs for artworks in #gallery-container)
  // This needs the #gallery-container to be set in state and artwork data to be loaded
  initializeGalleryScene(); // From galleryViewManager.js

  // Perform initial UI updates based on the fully loaded state
  updateUserMarkerOnMap();  // Place user marker correctly
  updateInformationPanel(); // Populate info panel
  updateGalleryScene();     // Show initial 3D view if applicable

  // Setup mobile map toggle listener (if the button exists)
  if (mapToggleButtonRef) {
    mapToggleButtonRef.addEventListener('click', () => {
        toggleMapVisibilityMobile(); // Dispatch action to update state, subscriber handles DOM
    });
  } else {
    console.warn("[AppInit] Mobile map toggle button #map-toggle-button not found.");
  }

  // Subscribe to all subsequent state changes to keep UI reactive
  subscribe(handleStateChange);

  setLoading(false); // All initial setup is complete
  console.log("[AppInit] TSATELIER Application Initialized and Ready.");

  // Example: If you want to record the initial state for history
  // This requires history.js to be integrated into indexState.js
  // import { recordCurrentStateForHistory } from './state/indexState.js';
  // if (typeof recordCurrentStateForHistory === 'function') recordCurrentStateForHistory();
}

// --- Application Start ---
// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', initializeApp);
