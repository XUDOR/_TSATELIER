// Placeholder data representing pictures in the gallery
const galleryData = [
  { id: 'P1', x: 8, y: 10, borderLeft: '2px solid olive' },
  { id: 'P2', x: 8, y: 9, borderLeft: '2px solid olive' },
  { id: 'P3', x: 9, y: 9, borderRight: '2px solid olive' },
  { id: 'P4', x: 6, y: 6, borderTop: '2px solid olive' },
  { id: 'P5', x: 7, y: 7, borderBottom: '2px solid olive' },
  { id: 'P6', x: 9, y: 8, borderRight: '2px solid olive' },
  { id: 'P7', x: 3, y: 3 },
  { id: 'P8', x: 3, y: 4 },
  { id: 'P9', x: 5, y: 6 },
  { id: 'P10', x: 10, y: 10 },
  { id: 'P11', x: 11, y: 11 },
  { id: 'P12', x: 4, y: 8 },
  { id: 'P13', x: 8, y: 11 },
  { id: 'P14', x: 7, y: 12 },
];

const wallData = [
  // Horizontal wall at y = 6, x from 5 to 8
  { x: 5, y: 6, borderTop: '2px solid gray' },
  { x: 6, y: 6, borderTop: '2px solid gray' },
  { x: 7, y: 6, borderTop: '2px solid gray' },
  { x: 8, y: 6, borderTop: '2px solid gray' },
  // Vertical wall at x = 8, y from 7 to 11
  { x: 8, y: 7, borderLeft: '3px solid black' },
  { x: 8, y: 8, borderLeft: '3px solid black' },
  { x: 8, y: 9, borderLeft: '3px solid black' },
  { x: 8, y: 10, borderLeft: '3px solid black' },
  { x: 8, y: 11, borderLeft: '3px solid black' },
];

const galleryContainer = document.getElementById("gallery-container");
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

    if (newX >= 1 && newX <= quadTreeGridSize && newY >= 1 && newY <= quadTreeGridSize) {
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

    if (newX >= 1 && newX <= quadTreeGridSize && newY >= 1 && newY <= quadTreeGridSize) {
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
}

// Initialize the user starting near the door at grid #120 (x:10, y:11)
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
userArrow.style.backgroundColor = 'white';
userArrow.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
userMarker.appendChild(userArrow);

// Handle user movement with arrow keys
const quadTreeGridSize = 11; // Grid is 11x11

function updateUserMarker() {
  userMarker.style.gridRowStart = user.position.y;
  userMarker.style.gridColumnStart = user.position.x;

  // Update arrow orientation
  let rotationDegree = 0;
  switch(user.orientation) {
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
  switch(e.key) {
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

    // Initialize cell borders
    cell.style.borderTop = '1px solid #ccc';
    cell.style.borderLeft = '1px solid #ccc';
    cell.style.borderRight = '1px solid #ccc';
    cell.style.borderBottom = '1px solid #ccc';

    // Add numbering to each cell in baby blue
    const cellNumber = document.createElement('div');
    cellNumber.style.position = 'absolute';
    cellNumber.style.top = '2px';
    cellNumber.style.left = '2px';
    cellNumber.style.fontSize = '10px';
    cellNumber.style.color = 'deepskyblue';
    cellNumber.textContent = (y - 1) * quadTreeGridSize + x;
    cell.appendChild(cellNumber);

    // Check if this cell is a wall
    const wall = wallData.find(w => w.x === x && w.y === y);
    if (wall) {
      if (wall.borderTop) cell.style.borderTop = wall.borderTop;
      if (wall.borderLeft) cell.style.borderLeft = wall.borderLeft;
      if (wall.borderRight) cell.style.borderRight = wall.borderRight;
      if (wall.borderBottom) cell.style.borderBottom = wall.borderBottom;
    }

    // Check if this cell is an artwork
    const artwork = galleryData.find(picture => picture.x === x && picture.y === y);
    if (artwork) {
      if (artwork.borderTop) cell.style.borderTop = artwork.borderTop;
      if (artwork.borderLeft) cell.style.borderLeft = artwork.borderLeft;
      if (artwork.borderRight) cell.style.borderRight = artwork.borderRight;
      if (artwork.borderBottom) cell.style.borderBottom = artwork.borderBottom;
      // Optionally, set a background color to indicate artwork
      // cell.style.backgroundColor = 'olive';
    }

    mapContainer.appendChild(cell);
  }
}
