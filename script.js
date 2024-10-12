// script.js

// Define color variables
let wallColor = '#FFFADF';
let artworkBorderColor = '#D8DCD2';

// Define the grid size
const quadTreeGridSize = 11; // Grid is 11x11

// Gallery data
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

// Wall data
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

// Get references to the HTML elements
const mapContainer = document.getElementById("map");
const infoContainer = document.getElementById("information");

// Define the User class to manage the user's state and orientation
class User {
  constructor(startX, startY) {
    this.position = { x: startX, y: startY };
    this.orientation = 'up'; // Initial orientation
  }

  moveForward() {
    let dx = 0;
    let dy = 0;
    switch (this.orientation) {
      case 'up':
        dy = -1;
        break;
      case 'down':
        dy = 1;
        break;
      case 'left':
        dx = -1;
        break;
      case 'right':
        dx = 1;
        break;
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
      case 'up':
        dy = 1;
        break;
      case 'down':
        dy = -1;
        break;
      case 'left':
        dx = 1;
        break;
      case 'right':
        dx = -1;
        break;
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
      case 'up':
        this.orientation = 'left';
        break;
      case 'left':
        this.orientation = 'down';
        break;
      case 'down':
        this.orientation = 'right';
        break;
      case 'right':
        this.orientation = 'up';
        break;
    }
  }

  rotateRight() {
    switch (this.orientation) {
      case 'up':
        this.orientation = 'right';
        break;
      case 'right':
        this.orientation = 'down';
        break;
      case 'down':
        this.orientation = 'left';
        break;
      case 'left':
        this.orientation = 'up';
        break;
    }
  }

  canMoveTo(x, y) {
    // Check boundaries
    if (x < 1 || x > quadTreeGridSize || y < 1 || y > quadTreeGridSize) {
      return false;
    }

    // Check for walls blocking the movement from the current cell
    const currentWall = wallData.find(w => w.x === this.position.x && w.y === this.position.y);
    if (currentWall) {
      switch (this.orientation) {
        case 'up':
          if (currentWall.borderTop) return false;
          break;
        case 'down':
          if (currentWall.borderBottom) return false;
          break;
        case 'left':
          if (currentWall.borderLeft) return false;
          break;
        case 'right':
          if (currentWall.borderRight) return false;
          break;
      }
    }

    // Check for walls blocking the movement from the next cell
    const nextWall = wallData.find(w => w.x === x && w.y === y);
    if (nextWall) {
      switch (this.orientation) {
        case 'up':
          if (nextWall.borderBottom) return false;
          break;
        case 'down':
          if (nextWall.borderTop) return false;
          break;
        case 'left':
          if (nextWall.borderRight) return false;
          break;
        case 'right':
          if (nextWall.borderLeft) return false;
          break;
      }
    }

    return true;
  }
}

// Initialize the user starting near the door at grid (10,11)
const user = new User(10, 11);

// Create user marker on the map
const userMarker = document.createElement("div");
userMarker.id = "user-marker";
userMarker.style.gridRowStart = user.position.y;
userMarker.style.gridColumnStart = user.position.x;
userMarker.style.width = '100%';
userMarker.style.height = '100%';
userMarker.style.position = 'relative';
mapContainer.appendChild(userMarker);

// Add a user orientation arrow marker
const userArrow = document.createElement("div");
userArrow.id = "user-arrow";
userArrow.style.position = 'absolute';
userArrow.style.top = '50%';
userArrow.style.left = '50%';
userArrow.style.transform = 'translate(-50%, -50%) rotate(0deg)';
userArrow.style.width = '15px';
userArrow.style.height = '15px';
userArrow.style.backgroundColor = '#efefe6'; // ++++++++++++++++++++++++++++++++++ARROW COLOUR
userArrow.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
userMarker.appendChild(userArrow);

// Handle user movement with arrow keys
function updateUserMarker() {
  userMarker.style.gridRowStart = user.position.y;
  userMarker.style.gridColumnStart = user.position.x;

  // Update arrow orientation
  let rotationDegree = 0;
  switch (user.orientation) {
    case 'up':
      rotationDegree = 0;
      break;
    case 'down':
      rotationDegree = 180;
      break;
    case 'left':
      rotationDegree = 270;
      break;
    case 'right':
      rotationDegree = 90;
      break;
  }
  userArrow.style.transform = `translate(-50%, -50%) rotate(${rotationDegree}deg)`;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case "ArrowUp":
      user.moveForward();
      break;
    case "ArrowDown":
      user.moveBackward();
      break;
    case "ArrowLeft":
      user.rotateLeft();
      break;
    case "ArrowRight":
      user.rotateRight();
      break;
  }
  updateUserMarker();
  updateInformation();
});

// Function to update the information panel
function updateInformation() {
  infoContainer.textContent = `Current Position: (${user.position.x}, ${user.position.y}) - Orientation: ${user.orientation}`;
  const artwork = galleryData.find(picture => picture.x === user.position.x && picture.y === user.position.y);
  if (artwork) {
    infoContainer.textContent += ` - Near artwork ${artwork.id}`;
  }
}

// Initial update of information panel
updateInformation();

// Create map grid and populate it with artworks and walls
for (let y = 1; y <= quadTreeGridSize; y++) {
  for (let x = 1; x <= quadTreeGridSize; x++) {
    const cell = document.createElement('div');
    cell.classList.add('map-cell');
    cell.style.width = '100%';
    cell.style.height = '100%';
    cell.style.gridRowStart = y;
    cell.style.gridColumnStart = x;
    cell.style.position = 'relative';
    cell.style.zIndex = '1'; // Ensure all cells have a default z-index

    // Add numbering to each cell in off-white ++++++++++++++++++++++++++++++++++++>>>>NUMBER COLOUR HERE ... 
    const cellNumber = document.createElement('div');
    cellNumber.style.position = 'absolute';
    cellNumber.style.top = '2px';
    cellNumber.style.left = '2px';
    cellNumber.style.fontSize = '10px';
    cellNumber.style.color = '#EFEFE6';
    cellNumber.textContent = (y - 1) * quadTreeGridSize + x;
    cell.appendChild(cellNumber);

    // Check if this cell is a wall and apply wall borders
    const wall = wallData.find(w => w.x === x && w.y === y);
    if (wall) {
      if (wall.borderTop) cell.style.borderTop = wall.borderTop;
      if (wall.borderLeft) cell.style.borderLeft = wall.borderLeft;
      if (wall.borderRight) cell.style.borderRight = wall.borderRight;
      if (wall.borderBottom) cell.style.borderBottom = wall.borderBottom;

      // Increase z-index to ensure wall borders are on top
      cell.style.zIndex = '2';
    }

    // Check if this cell is an artwork
    const artwork = galleryData.find(picture => picture.x === x && picture.y === y);
    if (artwork) {
      // Create the artwork element
      const artworkElement = document.createElement('div');
      artworkElement.classList.add('artwork');
      artworkElement.style.position = 'absolute';
      artworkElement.style.top = '0';
      artworkElement.style.left = '0';
      artworkElement.style.margin = '0'; // Ensure no margin is applied
      artworkElement.style.padding = '0'; // Ensure no padding is applied

      artworkElement.style.width = '100%';
      artworkElement.style.height = '100%';

      artworkElement.style.border = 'none'; // Control borders separately if needed

      // Apply padding if specified
      if (artwork.paddingTop) {
        artworkElement.style.paddingTop = artwork.paddingTop;
      }
      if (artwork.paddingBottom) {
        artworkElement.style.paddingBottom = artwork.paddingBottom;
      }
      // Set horizontal padding to zero to ensure no gaps between adjacent artworks
      artworkElement.style.paddingLeft = '0';
      artworkElement.style.paddingRight = '0';

      // Apply artwork borders
      if (artwork.borderTop) artworkElement.style.borderTop = artwork.borderTop;
      if (artwork.borderLeft) artworkElement.style.borderLeft = artwork.borderLeft;
      if (artwork.borderRight) artworkElement.style.borderRight = artwork.borderRight;
      if (artwork.borderBottom) artworkElement.style.borderBottom = artwork.borderBottom;

      // Append the artwork element to the cell
      cell.appendChild(artworkElement);
    }

    mapContainer.appendChild(cell);
  }
}

// Functions to update wall and artwork styles if colors change
function updateWallStyles() {
  const wallCells = document.querySelectorAll('.map-cell');
  wallCells.forEach(cell => {
    if (cell.style.borderTop) cell.style.borderTop = cell.style.borderTop.replace(/[^ ]+$/, wallColor);
    if (cell.style.borderLeft) cell.style.borderLeft = cell.style.borderLeft.replace(/[^ ]+$/, wallColor);
    if (cell.style.borderRight) cell.style.borderRight = cell.style.borderRight.replace(/[^ ]+$/, wallColor);
    if (cell.style.borderBottom) cell.style.borderBottom = cell.style.borderBottom.replace(/[^ ]+$/, wallColor);
  });
}

function updateArtworkStyles() {
  const artworks = document.querySelectorAll('.artwork');
  artworks.forEach(artwork => {
    if (artwork.style.borderTop) artwork.style.borderTop = artwork.style.borderTop.replace(/[^ ]+$/, artworkBorderColor);
    if (artwork.style.borderLeft) artwork.style.borderLeft = artwork.style.borderLeft.replace(/[^ ]+$/, artworkBorderColor);
    if (artwork.style.borderRight) artwork.style.borderRight = artwork.style.borderRight.replace(/[^ ]+$/, artworkBorderColor);
    if (artwork.style.borderBottom) artwork.style.borderBottom = artwork.style.borderBottom.replace(/[^ ]+$/, artworkBorderColor);
  });
}

// Example usage to change colors dynamically
// wallColor = 'blue';
// artworkBorderColor = 'green';
// updateWallStyles();
// updateArtworkStyles();
