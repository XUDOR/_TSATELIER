// script.js - Complete Updated Version (April 20, 2025)

// Define color variables
let wallColor = '#87857B';
let artworkBorderColor = '#D8DCD2';

// Define the grid size
const quadTreeGridSize = 11; // Grid is 11x11

// Gallery data (assuming this remains unchanged)
const galleryData = [
  // Artworks at (2,1), (3,1), and (4,1) with id 'P7'
  { id: 'P7', x: 2, y: 1, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P7', x: 3, y: 1, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P7', x: 4, y: 1, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (8,1), (9,1), and (10,1) with id 'P6'
  { id: 'P6', x: 8, y: 1, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P6', x: 9, y: 1, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P6', x: 10, y: 1, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (1,3) and (1,4) with id 'P8'
  { id: 'P8', x: 1, y: 3, borderLeft: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P8', x: 1, y: 4, borderLeft: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (11,2) and (11,3) with id 'P5'
  { id: 'P5', x: 11, y: 2, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P5', x: 11, y: 3, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (11,5) and (11,6) with id 'P4'
  { id: 'P4', x: 11, y: 5, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P4', x: 11, y: 6, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (5,6) and (6,6) with id 'P9'
  { id: 'P9', x: 5, y: 6, borderBottom: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P9', x: 6, y: 6, borderBottom: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (5,7) and (6,7) with id 'P14'
  { id: 'P14', x: 5, y: 7, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P14', x: 6, y: 7, borderTop: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (7,8), (7,9), and (7,10) with id 'P13'
  { id: 'P13', x: 7, y: 8, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P13', x: 7, y: 9, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P13', x: 7, y: 10, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artwork at (8,8) with id 'P2'
  { id: 'P2', x: 8, y: 8, borderLeft: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (11,8) and (11,9) with id 'P3'
  { id: 'P3', x: 11, y: 8, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P3', x: 11, y: 9, borderRight: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (1,9) and (1,10) with id 'P10'
  { id: 'P10', x: 1, y: 9, borderLeft: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P10', x: 1, y: 10, borderLeft: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artwork at (8,10) with id 'P1'
  { id: 'P1', x: 8, y: 10, borderLeft: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artworks at (2,11) and (3,11) with id 'P11'
  { id: 'P11', x: 2, y: 11, borderBottom: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
  { id: 'P11', x: 3, y: 11, borderBottom: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },

  // Artwork at (6,11) with id 'P12'
  { id: 'P12', x: 6, y: 11, borderBottom: `3px solid ${artworkBorderColor}`, paddingTop: '1px', paddingBottom: '1px' },
];

// Wall data (assuming this remains unchanged)
const wallData = [
  // Row 1 (Top Wall)
  { x: 1, y: 1, borderLeft: `2px solid ${wallColor}`, borderTop: `2px solid ${wallColor}` },
  { x: 2, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 3, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 4, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 5, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 6, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 7, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 8, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 9, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 10, y: 1, borderTop: `2px solid ${wallColor}` },
  { x: 11, y: 1, borderTop: `2px solid ${wallColor}`, borderRight: `2px solid ${wallColor}` },

  // Left Wall (x = 1)
  { x: 1, y: 2, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 3, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 4, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 5, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 6, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 7, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 8, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 9, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 10, borderLeft: `2px solid ${wallColor}` },
  { x: 1, y: 11, borderLeft: `2px solid ${wallColor}`, borderBottom: `2px solid ${wallColor}` },

  // Right Wall (x = 11)
  { x: 11, y: 2, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 3, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 4, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 5, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 6, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 7, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 8, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 9, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 10, borderRight: `2px solid ${wallColor}` },
  { x: 11, y: 11, borderRight: `2px solid ${wallColor}`, borderBottom: `2px solid ${wallColor}` },

  // Bottom Wall (y = 11)
  { x: 2, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 3, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 4, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 5, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 6, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 7, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 8, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 9, y: 11, borderBottom: `2px solid ${wallColor}` },
  { x: 10, y: 11, borderBottom: `2px solid ${wallColor}` },

  // Inner Walls (Horizontal Wall at y = 6)
  { x: 4, y: 6, borderBottom: `3px solid ${wallColor}` },
  { x: 5, y: 6, borderBottom: `3px solid ${wallColor}` },
  { x: 6, y: 6, borderBottom: `3px solid ${wallColor}` },
  { x: 7, y: 6, borderBottom: `3px solid ${wallColor}` },

  // Inner Walls (Vertical Wall at x = 7)
  { x: 7, y: 7, borderRight: `3px solid ${wallColor}` },
  { x: 7, y: 8, borderRight: `3px solid ${wallColor}` },
  { x: 7, y: 9, borderRight: `3px solid ${wallColor}` },
  { x: 7, y: 10, borderRight: `3px solid ${wallColor}` },
  { x: 7, y: 11, borderRight: `3px solid ${wallColor}` },
];

// --- Get references to HTML elements ---
const mapElement = document.getElementById("map"); // The grid container div
const mapContainerElement = document.getElementById("map-container"); // The parent container for map + header
const infoContainer = document.getElementById("information");
const mapToggleButton = document.getElementById("map-toggle-button");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");


// --- User Class ---
class User {
  constructor(startX, startY) {
    this.position = { x: startX, y: startY };
    this.orientation = 'up'; // Initial orientation
  }

  moveForward() {
    let dx = 0;
    let dy = 0;
    switch (this.orientation) {
      case 'up': dy = -1; break;
      case 'down': dy = 1; break;
      case 'left': dx = -1; break;
      case 'right': dx = 1; break;
    }
    const newX = this.position.x + dx;
    const newY = this.position.y + dy;
    if (this.canMoveTo(newX, newY)) {
      this.position.x = newX;
      this.position.y = newY;
    }
  }

  moveBackward() {
    let dx = 0;
    let dy = 0;
    switch (this.orientation) {
      case 'up': dy = 1; break;
      case 'down': dy = -1; break;
      case 'left': dx = 1; break;
      case 'right': dx = -1; break;
    }
    const newX = this.position.x + dx;
    const newY = this.position.y + dy;
    if (this.canMoveTo(newX, newY)) {
      this.position.x = newX;
      this.position.y = newY;
    }
  }

  rotateLeft() {
    switch (this.orientation) {
      case 'up': this.orientation = 'left'; break;
      case 'left': this.orientation = 'down'; break;
      case 'down': this.orientation = 'right'; break;
      case 'right': this.orientation = 'up'; break;
    }
  }

  rotateRight() {
    switch (this.orientation) {
      case 'up': this.orientation = 'right'; break;
      case 'right': this.orientation = 'down'; break;
      case 'down': this.orientation = 'left'; break;
      case 'left': this.orientation = 'up'; break;
    }
  }

  canMoveTo(x, y) {
    // Check boundaries
    if (x < 1 || x > quadTreeGridSize || y < 1 || y > quadTreeGridSize) return false;

    // Check for walls blocking movement from current cell
    const currentWall = wallData.find(w => w.x === this.position.x && w.y === this.position.y);
    if (currentWall) {
      switch (this.orientation) {
        case 'up': if (currentWall.borderTop) return false; break;
        case 'down': if (currentWall.borderBottom) return false; break;
        case 'left': if (currentWall.borderLeft) return false; break;
        case 'right': if (currentWall.borderRight) return false; break;
      }
    }

    // Check for walls blocking movement into next cell
    const nextWall = wallData.find(w => w.x === x && w.y === y);
    if (nextWall) {
      switch (this.orientation) {
        case 'up': if (nextWall.borderBottom) return false; break; // Coming from below
        case 'down': if (nextWall.borderTop) return false; break; // Coming from above
        case 'left': if (nextWall.borderRight) return false; break; // Coming from right
        case 'right': if (nextWall.borderLeft) return false; break; // Coming from left
      }
    }
    return true;
  }
}

// --- Initialize the user ---
const user = new User(10, 11); // Start near the door

// --- Create User Marker Element (but don't append yet) ---
const userMarker = document.createElement("div");
userMarker.id = "user-marker";
// Styles for marker container (like width, height, relative positioning) handled by CSS
userMarker.style.position = 'relative'; // Crucial for absolute positioning of the arrow within

// --- Create User Arrow Element ---
const userArrow = document.createElement("div");
userArrow.id = "user-arrow";
// Styles for arrow (size, color, shape, absolute positioning) handled by CSS
// We only need to control the transform for rotation here
userArrow.style.position = 'absolute';
userArrow.style.top = '50%';
userArrow.style.left = '50%';
userArrow.style.transform = 'translate(-50%, -50%) rotate(0deg)'; // Initial orientation
userMarker.appendChild(userArrow); // Arrow is inside the marker

// --- Update User Marker Position and Rotation ---
function updateUserMarker() {
  // Set the grid position of the marker container DIV
  userMarker.style.gridRowStart = user.position.y;
  userMarker.style.gridColumnStart = user.position.x;

  // Rotate the arrow element inside the marker container
  let rotationDegree = 0;
  switch (user.orientation) {
    case 'up': rotationDegree = 0; break;
    case 'down': rotationDegree = 180; break;
    case 'left': rotationDegree = 270; break;
    case 'right': rotationDegree = 90; break;
  }
  userArrow.style.transform = `translate(-50%, -50%) rotate(${rotationDegree}deg)`;
}

// --- Update Information Panel ---
function updateInformation() {
  const currentSquareNumber = (user.position.y - 1) * quadTreeGridSize + user.position.x;
  let infoText = `Pos: (${user.position.x}, ${user.position.y}) | Sq: ${currentSquareNumber} | Facing: ${user.orientation}`;
  const artwork = galleryData.find(picture => picture.x === user.position.x && picture.y === user.position.y);
  if (artwork) {
    infoText += ` - Near: ${artwork.id}`;
  }
  infoContainer.textContent = infoText; // Update the text content
}

// --- Create Map Grid and Populate ---
function createMapGrid() {
    mapElement.innerHTML = ''; // Clear previous grid content first

    for (let y = 1; y <= quadTreeGridSize; y++) {
        for (let x = 1; x <= quadTreeGridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('map-cell');
            // CSS grid handles the flow, direct row/col styles not needed here
            cell.style.position = 'relative'; // For positioning children like numbers/artwork
            cell.style.zIndex = '1';          // Base z-index

            // Add cell numbering (optional to display via CSS later)
            const cellNumber = document.createElement('div');
            // Styles for number element (pos, size, color) handled by CSS mostly
            cellNumber.style.position = 'absolute';
            cellNumber.style.top = '2px';
            cellNumber.style.left = '2px';
            cellNumber.style.fontSize = '10px'; // Keep small
            cellNumber.style.color = '#EFEFE6'; // Or use CSS variable
            cellNumber.textContent = (y - 1) * quadTreeGridSize + x;
            cellNumber.style.display = 'none'; // Hidden by default
            cell.appendChild(cellNumber);

            // Apply Wall Borders from wallData
            const wall = wallData.find(w => w.x === x && w.y === y);
            if (wall) {
                if (wall.borderTop) cell.style.borderTop = wall.borderTop;
                if (wall.borderLeft) cell.style.borderLeft = wall.borderLeft;
                if (wall.borderRight) cell.style.borderRight = wall.borderRight;
                if (wall.borderBottom) cell.style.borderBottom = wall.borderBottom;
                cell.style.zIndex = '2'; // Ensure walls are above base cell
            }

            // Apply Artwork Borders from galleryData
            const artwork = galleryData.find(picture => picture.x === x && picture.y === y);
            if (artwork) {
                const artworkElement = document.createElement('div');
                artworkElement.classList.add('artwork');
                // Base styles (width, height, position, z-index=5) handled by CSS
                artworkElement.style.margin = '0';
                artworkElement.style.padding = '0'; // Base padding

                // Apply specific padding from data if needed
                if (artwork.paddingTop) artworkElement.style.paddingTop = artwork.paddingTop;
                if (artwork.paddingBottom) artworkElement.style.paddingBottom = artwork.paddingBottom;
                artworkElement.style.paddingLeft = '0'; // Ensure no horizontal gaps
                artworkElement.style.paddingRight = '0';

                // ** Apply specific artwork borders (Ensure NO 'border: none' line was here) **
                if (artwork.borderTop) artworkElement.style.borderTop = artwork.borderTop;
                if (artwork.borderLeft) artworkElement.style.borderLeft = artwork.borderLeft;
                if (artwork.borderRight) artworkElement.style.borderRight = artwork.borderRight;
                if (artwork.borderBottom) artworkElement.style.borderBottom = artwork.borderBottom;

                cell.appendChild(artworkElement); // Add artwork div to the cell
            }
            mapElement.appendChild(cell); // Add the completed cell to the map grid
        }
    }
    // After all cells are in the grid, append the user marker element
    mapElement.appendChild(userMarker);
}


// --- Central Handler for User Actions ---
function handleUserAction(action) {
    switch (action) {
        case "up":    user.moveForward(); break;
        case "down":  user.moveBackward(); break;
        case "left":  user.rotateLeft(); break;
        case "right": user.rotateRight(); break;
    }
    updateUserMarker(); // Update visual position/rotation
    updateInformation(); // Update text info
}

// --- Keyboard Event Listener ---
document.addEventListener('keydown', (e) => {
    // Use a map for cleaner key handling
    const keyActionMap = {
        "ArrowUp": "up",
        "ArrowDown": "down",
        "ArrowLeft": "left",
        "ArrowRight": "right"
    };
    const action = keyActionMap[e.key];
    if (action) {
        handleUserAction(action);
    }
});

// --- On-Screen Navigation Button Event Listeners ---
// Use optional chaining (?) in case elements aren't found
btnUp?.addEventListener('click', () => handleUserAction('up'));
btnDown?.addEventListener('click', () => handleUserAction('down'));
btnLeft?.addEventListener('click', () => handleUserAction('left'));
btnRight?.addEventListener('click', () => handleUserAction('right'));

// --- Map Toggle Button Event Listener ---
mapToggleButton?.addEventListener('click', () => {
    // Toggle the class on the container that holds the map and its header
    mapContainerElement.classList.toggle('map-collapsed');

    // Optional: Update button icon/text for visual feedback
    const icon = mapToggleButton.querySelector('.toggle-icon');
    if (icon) {
        if (mapContainerElement.classList.contains('map-collapsed')) {
            icon.textContent = '▶'; // Or other appropriate icon/text
            mapToggleButton.setAttribute('aria-expanded', 'false'); // Accessibility
        } else {
            icon.textContent = '▼'; // Or other appropriate icon/text
            mapToggleButton.setAttribute('aria-expanded', 'true'); // Accessibility
        }
    }
});


// --- Initial Setup on Page Load ---
createMapGrid();      // Draw the map and artwork/walls
updateUserMarker();   // Place the user marker in the correct starting cell/orientation
updateInformation();  // Display the initial user position and info

// --- Functions to update styles dynamically (if needed, keep as is) ---
function updateWallStyles() {
    const wallCells = document.querySelectorAll('.map-cell');
    wallCells.forEach(cell => {
        // Example: Update border color dynamically
        if (cell.style.borderTop?.includes('solid')) cell.style.borderTop = cell.style.borderTop.replace(/solid .+$/, `solid ${wallColor}`);
        if (cell.style.borderLeft?.includes('solid')) cell.style.borderLeft = cell.style.borderLeft.replace(/solid .+$/, `solid ${wallColor}`);
        if (cell.style.borderRight?.includes('solid')) cell.style.borderRight = cell.style.borderRight.replace(/solid .+$/, `solid ${wallColor}`);
        if (cell.style.borderBottom?.includes('solid')) cell.style.borderBottom = cell.style.borderBottom.replace(/solid .+$/, `solid ${wallColor}`);
     });
}

function updateArtworkStyles() {
    const artworks = document.querySelectorAll('.artwork');
    artworks.forEach(artwork => {
         // Example: Update border color dynamically
        if (artwork.style.borderTop?.includes('solid')) artwork.style.borderTop = artwork.style.borderTop.replace(/solid .+$/, `solid ${artworkBorderColor}`);
        if (artwork.style.borderLeft?.includes('solid')) artwork.style.borderLeft = artwork.style.borderLeft.replace(/solid .+$/, `solid ${artworkBorderColor}`);
        if (artwork.style.borderRight?.includes('solid')) artwork.style.borderRight = artwork.style.borderRight.replace(/solid .+$/, `solid ${artworkBorderColor}`);
        if (artwork.style.borderBottom?.includes('solid')) artwork.style.borderBottom = artwork.style.borderBottom.replace(/solid .+$/, `solid ${artworkBorderColor}`);
    });
}

// Example usage to change colors dynamically (keep commented out unless needed)
// wallColor = 'blue';
// artworkBorderColor = 'green';
// updateWallStyles();
// updateArtworkStyles();