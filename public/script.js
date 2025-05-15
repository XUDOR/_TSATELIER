// public/script.js
// Main application orchestrator for TSATELIER Interactive Gallery Space
// Version 4: Fixes for data loading path and DOM element cloning.

import {
  getState,
  subscribe,
  updateDeviceAndViewportInfo,
  // setGalleryContainerElement, // Removed, container passed to init
  loadLayoutData,
  loadAllArtworkDetails,
  getUser,
  getLayout,
  setInfoPanelContent,
  toggleMapVisibilityMobile,
  setLoading,
  setErrorMessage,
  recordCurrentStateForHistory, // Assuming history.js is integrated
} from './state/indexState.js';

import {
  initializeNavigation,
} from './core/navigationController.js';

import {
  initializeGalleryScene,
  updateGalleryScene,
} from './core/galleryViewManager.js';

import { artworkManifest } from './data/artworkManifest.js';

// --- DOM Element References ---
let mapElementRef;
let mapContainerElementRef;
let infoPanelElementRef;
let mapToggleButtonRef;
let userMarkerElement;
let userArrowElement;
let galleryContainerRef; // Local ref for the gallery container

// --- Constants ---
const APP_GRID_SIZE = 11;

// --- Initialization Functions ---

function cacheDOMElements() {
  mapElementRef = document.getElementById('map');
  mapContainerElementRef = document.getElementById('map-container');
  infoPanelElementRef = document.getElementById('information');
  mapToggleButtonRef = document.getElementById('map-toggle-button');
  galleryContainerRef = document.getElementById('gallery-container'); // Cache locally

  if (!galleryContainerRef) {
    console.error("CRITICAL: #gallery-container DOM element not found!");
    setErrorMessage("Gallery view cannot be initialized: Missing #gallery-container.");
  }
  // No longer setting galleryContainerElement in state
}

function createUserMarkerForMap() {
    userMarkerElement = document.createElement("div");
    userMarkerElement.id = "user-marker";
    userMarkerElement.style.position = 'relative';

    userArrowElement = document.createElement("div");
    userArrowElement.id = "user-arrow";
    userArrowElement.style.position = 'absolute';
    userArrowElement.style.top = '50%';
    userArrowElement.style.left = '50%';
    userArrowElement.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    userMarkerElement.appendChild(userArrowElement);
}

function processDataForArtworkState(rawLayoutCells, manifest) {
    const richGalleryDataArray = [];
    if (!rawLayoutCells || rawLayoutCells.length === 0) {
        console.warn("[DataProcessing] Raw layout data is empty for artwork processing.");
        return richGalleryDataArray;
    }
    if (!manifest || Object.keys(manifest).length === 0) {
        console.warn("[DataProcessing] Artwork manifest is empty.");
        return richGalleryDataArray;
    }
    rawLayoutCells.forEach(cell => {
        if (cell.artworkId) {
            const meta = manifest[cell.artworkId];
            if (!meta) {
                console.warn(`[DataProcessing] No metadata for artworkId: ${cell.artworkId} at (${cell.x}, ${cell.y})`);
                return;
            }
            let wallFace = null;
            if (cell.artworkBorders) {
                if (cell.artworkBorders.top) wallFace = 'bottom';
                else if (cell.artworkBorders.bottom) wallFace = 'top';
                else if (cell.artworkBorders.left) wallFace = 'right';
                else if (cell.artworkBorders.right) wallFace = 'left';
            }
            if (wallFace) {
                richGalleryDataArray.push({
                    id: cell.artworkId, instanceId: `${cell.artworkId}-${cell.x}-${cell.y}`,
                    x: cell.x, y: cell.y, wallFace: wallFace, imageUrl: meta.imageUrl,
                    actualWidth: meta.actualWidth, actualHeight: meta.actualHeight,
                    name: meta.name || `Artwork ${cell.artworkId}`, description: meta.description || '',
                    medium: meta.medium || '', exhibition: meta.exhibition || '',
                    dimensionsOriginal: meta.dimensionsOriginal || '',
                });
            } else {
                console.warn(`[DataProcessing] Artwork ${cell.artworkId} at (${cell.x},${cell.y}) lacks artworkBorder for wallFace.`);
            }
        }
    });
    return richGalleryDataArray;
}

async function initializeApplicationData() {
  try {
    setLoading(true);
    
    // ***** FIX 1: Use the correct API endpoint for layout.json *****
    await loadLayoutData('/api/layout'); 

    const currentAppState = getState();
    if (!currentAppState.galleryMap.mapReady) {
        throw new Error("Layout data failed to load or map not ready.");
    }

    const rawLayout = currentAppState.galleryMap.layout;
    const richGalleryData = processDataForArtworkState(rawLayout, artworkManifest);
    if (richGalleryData.length === 0) {
        console.warn("[AppInit] No rich artwork data processed. Check layout and manifest.");
    }
    loadAllArtworkDetails(richGalleryData);
    console.log("[AppInit] Application data processed.");

  } catch (error) {
    console.error("[AppInit] CRITICAL ERROR initializing application data:", error);
    setErrorMessage(`App data error: ${error.message}`);
    throw error;
  } finally {
    // setLoading(false); // Moved to end of initializeApp
  }
}

// --- UI Update Functions ---
function renderMapGrid() {
  if (!mapElementRef) return;
  mapElementRef.innerHTML = '';
  const { galleryMap } = getState();
  const layoutCells = galleryMap.layout;
  const gridSize = galleryMap.gridSize || APP_GRID_SIZE;

  if (!galleryMap.mapReady || !layoutCells || layoutCells.length === 0) {
    mapElementRef.textContent = "Map data loading...";
    return;
  }
  
  mapElementRef.style.display = 'grid';
  mapElementRef.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  mapElementRef.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  const cellDataMap = new Map();
  layoutCells.forEach(cell => cellDataMap.set(`${cell.x}-${cell.y}`, cell));

  for (let r = 1; r <= gridSize; r++) {
    for (let c = 1; c <= gridSize; c++) {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('map-cell');
      const cellDetails = cellDataMap.get(`${c}-${r}`);
      if (cellDetails) {
        const wallBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-map-border').trim() || '#87857B';
        if (cellDetails.isWall && cellDetails.wallBorders) {
          if (cellDetails.wallBorders.top) cellDiv.style.borderTop = `2px solid ${wallBorderColor}`;
          if (cellDetails.wallBorders.bottom) cellDiv.style.borderBottom = `2px solid ${wallBorderColor}`;
          if (cellDetails.wallBorders.left) cellDiv.style.borderLeft = `2px solid ${wallBorderColor}`;
          if (cellDetails.wallBorders.right) cellDiv.style.borderRight = `2px solid ${wallBorderColor}`;
        }
        if (cellDetails.artworkId && cellDetails.artworkBorders) {
          const artworkMapMarker = document.createElement('div');
          artworkMapMarker.classList.add('artwork-on-map-marker');
          const artBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-map-artwork-border').trim() || '#D8DCD2';
          if (cellDetails.artworkBorders.top) artworkMapMarker.style.cssText = `position:absolute; top:0; left:0; right:0; height:3px; background-color:${artBorderColor};`;
          else if (cellDetails.artworkBorders.bottom) artworkMapMarker.style.cssText = `position:absolute; bottom:0; left:0; right:0; height:3px; background-color:${artBorderColor};`;
          else if (cellDetails.artworkBorders.left) artworkMapMarker.style.cssText = `position:absolute; top:0; bottom:0; left:0; width:3px; background-color:${artBorderColor};`;
          else if (cellDetails.artworkBorders.right) artworkMapMarker.style.cssText = `position:absolute; top:0; bottom:0; right:0; width:3px; background-color:${artBorderColor};`;
          cellDiv.appendChild(artworkMapMarker);
        }
      }
      mapElementRef.appendChild(cellDiv);
    }
  }
  if(userMarkerElement) mapElementRef.appendChild(userMarkerElement);
}

function updateUserMarkerOnMap() {
  if (!userMarkerElement || !userArrowElement) return;
  const userState = getUser();
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

function updateInformationPanel() {
  if (!infoPanelElementRef) return;
  const userState = getUser();
  const { artworks, galleryMap, galleryView, device } = getState();
  const gridSize = galleryMap.gridSize || APP_GRID_SIZE;
  const currentSquareNumber = (userState.position.y - 1) * gridSize + userState.position.x;
  let infoLines = [
    `Device: ${device.type} (${device.viewportWidth}x${device.viewportHeight}) ${device.orientation}`,
    `User: (${userState.position.x}, ${userState.position.y}) | Cell: ${currentSquareNumber} | Facing: ${userState.orientation}`
  ];
  const cellUserIsIn = galleryMap.layout.find(c => c.x === userState.position.x && c.y === userState.position.y);
  if (cellUserIsIn && cellUserIsIn.artworkId && artworks.data[cellUserIsIn.artworkId]) {
      const artMeta = artworks.data[cellUserIsIn.artworkId];
      infoLines.push(`At: ${artMeta.name || artMeta.id} (${artMeta.dimensionsOriginal || 'N/A'})`);
  }
  if (galleryView.currentArtworkIdInView && artworks.data[galleryView.currentArtworkIdInView]) {
      const viewedArt = artworks.data[galleryView.currentArtworkIdInView];
      infoLines.push(`Viewing: ${viewedArt.name || viewedArt.id} (${viewedArt.dimensionsOriginal || 'N/A'})`);
      if(viewedArt.medium) infoLines.push(`Medium: ${viewedArt.medium}`);
      if(viewedArt.exhibition) infoLines.push(`Exhibition: ${viewedArt.exhibition}`);
  }
  setInfoPanelContent(infoLines.join('<br>'));
}

function handleStateChange(newState) {
  updateUserMarkerOnMap();
  updateInformationPanel();
  updateGalleryScene();
  if (infoPanelElementRef && infoPanelElementRef.innerHTML !== newState.ui.infoPanelContent) {
    infoPanelElementRef.innerHTML = newState.ui.infoPanelContent;
  }
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
  document.body.classList.toggle('app-is-loading', newState.ui.isLoading);
  const errorDisplayElement = document.getElementById('app-error-display');
  if (errorDisplayElement) {
    errorDisplayElement.textContent = newState.ui.errorMessage || '';
    errorDisplayElement.style.display = newState.ui.errorMessage ? 'block' : 'none';
  }
}

async function initializeApp() {
  console.log("[AppInit] Initializing TSATELIER Application (Modular v4)...");
  setLoading(true);
  cacheDOMElements();

  updateDeviceAndViewportInfo();
  window.addEventListener('resize', updateDeviceAndViewportInfo);
  window.addEventListener('orientationchange', updateDeviceAndViewportInfo);

  try {
    await initializeApplicationData();
  } catch (e) {
    console.error("[AppInit] Halting app initialization due to data loading failure.");
    // Error message is set in uiState, subscriber will handle display.
    // setLoading(false) was called in initializeApplicationData's catch.
    return; 
  }

  createUserMarkerForMap();
  renderMapGrid(); // Depends on layout data in state
  
  // Pass the cached galleryContainerRef to initializeGalleryScene
  if (galleryContainerRef) {
    initializeGalleryScene(galleryContainerRef); // Depends on artwork data in state
  } else {
      console.error("[AppInit] Cannot initialize gallery scene, container not found.");
      setErrorMessage("Gallery scene cannot be initialized.");
  }
  
  initializeNavigation();

  updateUserMarkerOnMap();
  updateInformationPanel();
  updateGalleryScene();

  if (mapToggleButtonRef) {
    mapToggleButtonRef.addEventListener('click', () => toggleMapVisibilityMobile());
  }

  subscribe(handleStateChange);
  
  if (typeof recordCurrentStateForHistory === 'function') {
    recordCurrentStateForHistory(); // Record initial state for undo
  }

  setLoading(false);
  console.log("[AppInit] TSATELIER Application Initialized and Ready.");
}

document.addEventListener('DOMContentLoaded', initializeApp);
