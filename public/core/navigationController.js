// public/core/navigationController.js
// Purpose: Handles user navigation logic, including movement, rotation,
// and collision detection against walls.

import {
  getState,
  getUser, // Gets { position, orientation } from galleryMapState
  setUserPosition,
  setUserOrientation,
  getLayout, // Gets the gallery layout data (walls, etc.) from galleryMapState
  // isCellWall, // We might make a more sophisticated wall check here or use getLayout directly
} from '../state/indexState.js';

/**
 * Checks if the user can move from their current position to a target cell
 * based on their orientation and wall data from the state.
 *
 * @param {number} targetX - The x-coordinate of the cell to move to.
 * @param {number} targetY - The y-coordinate of the cell to move to.
 * @param {object} currentUserState - The current user state { position, orientation }.
 * @param {Array} layoutData - The gallery layout data.
 * @returns {boolean} True if the user can move, false otherwise.
 */
function canMoveTo(targetX, targetY, currentUserState, layoutData) {
  const { position: currentPosition, orientation } = currentUserState;
  const gridSize = getState().galleryMap.gridSize; // Assuming gridSize is in galleryMap state

  // 1. Check Grid Boundaries
  if (targetX < 1 || targetX > gridSize || targetY < 1 || targetY > gridSize) {
    // console.log('[NavCtrl] Move blocked: Out of bounds');
    return false;
  }

  // 2. Check Walls
  // This logic needs to be carefully adapted from your original User.canMoveTo
  // and how wall data is structured in `layoutData` (from layout.json).
  // The layoutData is an array of cell objects:
  // e.g., { x: 1, y: 1, isWall: true, wallBorders: { left: true, top: true }, artworkId: null, artworkBorders: {} }

  const currentCellData = layoutData.find(c => c.x === currentPosition.x && c.y === currentPosition.y);
  const targetCellData = layoutData.find(c => c.x === targetX && c.y === targetY);

  // Check for a wall on the current cell blocking exit in the direction of movement
  if (currentCellData && currentCellData.isWall) {
    switch (orientation) {
      case 'up': if (currentCellData.wallBorders?.top) return false; break;
      case 'down': if (currentCellData.wallBorders?.bottom) return false; break;
      case 'left': if (currentCellData.wallBorders?.left) return false; break;
      case 'right': if (currentCellData.wallBorders?.right) return false; break;
    }
  }

  // Check for a wall on the target cell blocking entry from the direction of approach
  if (targetCellData && targetCellData.isWall) {
    switch (orientation) {
      // If moving 'up', we are trying to enter the target cell from its 'bottom' side.
      case 'up': if (targetCellData.wallBorders?.bottom) return false; break;
      // If moving 'down', we are trying to enter the target cell from its 'top' side.
      case 'down': if (targetCellData.wallBorders?.top) return false; break;
      // If moving 'left', we are trying to enter the target cell from its 'right' side.
      case 'left': if (targetCellData.wallBorders?.right) return false; break;
      // If moving 'right', we are trying to enter the target cell from its 'left' side.
      case 'right': if (targetCellData.wallBorders?.left) return false; break;
    }
    // If the target cell itself is a wall entity and doesn't have a specific border defined
    // for entry (e.g. it's a solid block), then movement is blocked.
    // The logic above handles borders. If it's just `isWall: true` without specific passable borders,
    // then it's effectively solid from all directions not explicitly opened by a missing border.
    // For simplicity, if targetCellData.isWall is true and none of the border checks above allowed passage,
    // consider it blocked. This needs to align with how your `layout.json` defines passable wall cells.
    // A simple interpretation: if targetCellData.isWall is true, and we haven't returned false yet
    // due to a specific border, it means we might be trying to move *into* the substance of a wall.
    // However, the border checks should be the primary mechanism.
    // If a cell is `isWall:true` but has NO `wallBorders` defined for the side of entry,
    // it implies that side is open. If it *has* a border for that side, it's blocked.

    // If the target cell is a wall and no specific border allowed passage, it's blocked.
    // This is a fallback if the border logic isn't exhaustive for all wall types.
    // A more precise way: if targetCellData.isWall is true, and the specific border for entry *exists and is true*, then block.
    // If targetCellData.isWall is true, and there's NO border defined for the side of entry, it implies it's open.
    // The current logic in the switch cases correctly checks if an *existing* border blocks.
    // So, if targetCellData.isWall is true, and we passed the switch, it means no *defined* border blocked us.
    // We must then ask: is the cell itself a fundamental wall block, or a cell that *can* have borders?
    // For now, the `isWall` property on the target cell itself can be a final check if no border explicitly allowed passage.
    // If `targetCellData.isWall` is true, it means this cell is part of a wall structure.
    // The border checks determine if a *face* of that wall structure is solid.
    // If `targetCellData.isWall` is true and the border checks didn't find a specific blocking border,
    // it implies that side of the wall cell is open.
    // So, the primary check is the `wallBorders`.
  }


  // If the target cell is simply marked as a wall and not passable through border checks.
  // This check is a bit redundant if wallBorders are comprehensive.
  // But if a cell can be `isWall: true` and represent a solid block without defined borders,
  // then this is needed.
  // Let's refine: if targetCellData is found and `targetCellData.isWall` is true,
  // movement is only allowed if the border checks above explicitly *didn't* return false.
  // If `targetCellData.isWall` is true and it's not a border issue, it's a wall.
  if (targetCellData && targetCellData.isWall) {
      // This condition means the cell is a wall, but the border checks above
      // didn't find a specific blocking border for the current orientation.
      // This implies the "face" of the wall we are trying to enter is open.
      // So, we should NOT return false here if border checks passed.
      // However, if the intent of `isWall` is "this entire cell is a solid block unless a border says otherwise",
      // then we might need to reconsider.
      // For now, assume `wallBorders` are authoritative for passage. If a cell is `isWall:true`
      // but has no blocking border for the entry direction, it's considered passable from that side.
      // The only time `targetCellData.isWall` alone blocks is if it has no relevant `wallBorders` defined at all
      // for the direction of entry, implying it's a solid, non-bordered wall cell.
      // The current border checks are "if border exists and is true, return false".
      // So if we reach here, it means either no border existed for that side, or it was false.
  }


  // console.log(`[NavCtrl] Move allowed to (${targetX}, ${targetY})`);
  return true;
}

/**
 * Processes user navigation actions (move forward, backward, rotate).
 * @param {string} action - The navigation action ('up', 'down', 'left', 'right' from input).
 * 'up' means move forward, 'down' means move backward.
 * 'left' means rotate left, 'right' means rotate right.
 */
export function handleUserNavigation(action) {
  const currentUserState = getUser(); // Get current { position, orientation }
  const layout = getLayout(); // Get wall data

  if (!layout || layout.length === 0) {
    console.warn("[NavCtrl] Layout data not available. Navigation disabled.");
    return;
  }

  let { x: newX, y: newY } = currentUserState.position;
  let newOrientation = currentUserState.orientation;
  let moved = false;
  let rotated = false;

  switch (action) {
    case 'moveForward': // Renamed from 'up' for clarity
      switch (currentUserState.orientation) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }
      if (canMoveTo(newX, newY, currentUserState, layout)) {
        setUserPosition(newX, newY);
        moved = true;
      }
      break;

    case 'moveBackward': // Renamed from 'down' for clarity
      switch (currentUserState.orientation) {
        case 'up': newY++; break;
        case 'down': newY--; break;
        case 'left': newX++; break;
        case 'right': newX--; break;
      }
      if (canMoveTo(newX, newY, currentUserState, layout)) {
        setUserPosition(newX, newY);
        moved = true;
      }
      break;

    case 'rotateLeft': // Renamed from 'left'
      switch (currentUserState.orientation) {
        case 'up': newOrientation = 'left'; break;
        case 'left': newOrientation = 'down'; break;
        case 'down': newOrientation = 'right'; break;
        case 'right': newOrientation = 'up'; break;
      }
      setUserOrientation(newOrientation);
      rotated = true;
      break;

    case 'rotateRight': // Renamed from 'right'
      switch (currentUserState.orientation) {
        case 'up': newOrientation = 'right'; break;
        case 'right': newOrientation = 'down'; break;
        case 'down': newOrientation = 'left'; break;
        case 'left': newOrientation = 'up'; break;
      }
      setUserOrientation(newOrientation);
      rotated = true;
      break;
    default:
      console.warn(`[NavCtrl] Unknown navigation action: ${action}`);
      return;
  }

  if (moved || rotated) {
    // console.log(`[NavCtrl] Action: ${action}, New State: Pos(${newX},${newY}), Orient(${newOrientation})`);
    // The state update will trigger pubsub, and other modules (like galleryViewManager)
    // will react to the new user position/orientation.
  }
}

/**
 * Initializes navigation by setting up event listeners for keyboard and UI buttons.
 * This function should be called once when the application starts.
 */
export function initializeNavigation() {
  // Map DOM element IDs to navigation actions
  const navButtonActions = {
    'btn-up': 'moveForward',
    'btn-down': 'moveBackward',
    'btn-left': 'rotateLeft',
    'btn-right': 'rotateRight',
  };

  // Keyboard listeners
  document.addEventListener('keydown', (e) => {
    let action = null;
    switch (e.key) {
      case "ArrowUp": action = 'moveForward'; break;
      case "ArrowDown": action = 'moveBackward'; break;
      case "ArrowLeft": action = 'rotateLeft'; break;
      case "ArrowRight": action = 'rotateRight'; break;
    }
    if (action) {
      e.preventDefault(); // Prevent default arrow key scroll
      handleUserNavigation(action);
    }
  });

  // Button listeners
  for (const btnId in navButtonActions) {
    const button = document.getElementById(btnId);
    if (button) {
      button.addEventListener('click', () => handleUserNavigation(navButtonActions[btnId]));
    } else {
      console.warn(`[NavCtrl] Navigation button #${btnId} not found.`);
    }
  }
  console.log('[NavCtrl] Navigation initialized (keyboard and button listeners set up).');
}

console.info('[navigationController.js] Navigation controller module loaded.');
