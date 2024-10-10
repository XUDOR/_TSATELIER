// Placeholder data representing pictures in the gallery
const galleryData = [
  { id: 'P1', x: 10, y: 8 },
  { id: 'P2', x: 10, y: 7 },
  { id: 'P3', x: 10, y: 6 },
  { id: 'P4', x: 6, y: 5 },
  { id: 'P5', x: 5, y: 5 },
  { id: 'P6', x: 9, y: 6 },
  { id: 'P7', x: 4, y: 7 },
  { id: 'P8', x: 3, y: 9 },
  { id: 'P9', x: 6, y: 4 },
  { id: 'P10', x: 8, y: 4 },
  { id: 'P11', x: 9, y: 11 },
  { id: 'P12', x: 4, y: 8 },
  { id: 'P13', x: 7, y: 3 },
  { id: 'P14', x: 8, y: 2 },
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

  move(dx, dy) {
    const newX = this.position.x + dx;
    const newY = this.position.y + dy;

    if (newX >= 1 && newX <= quadTreeGridSize && newY >= 1 && newY <= quadTreeGridSize) {
      this.position.x = newX;
      this.position.y = newY;
    }
  }

  updateOrientation(direction) {
    this.orientation = direction;
  }
}

// Initialize the user starting near the door at grid #2
const user = new User(3, 1);

// Create user marker on the map
const userMarker = document.createElement("div");
userMarker.id = "user-marker";
userMarker.style.gridRowStart = user.position.y;
userMarker.style.gridColumnStart = user.position.x;
userMarker.style.width = '20px';
userMarker.style.height = '20px';
userMarker.style.backgroundColor = 'olive';
mapContainer.appendChild(userMarker);

// Add a user orientation arrow marker
const userArrow = document.createElement("div");
userArrow.id = "user-arrow";
userArrow.style.position = 'absolute';
userArrow.style.width = '15px';
userArrow.style.height = '15px';
userArrow.style.backgroundColor = 'white';
userMarker.appendChild(userArrow);

// Quad-Tree implementation to manage the gallery space
class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    const { x, y, w, h } = this.boundary;
    const nw = new Rectangle(x, y, w / 2, h / 2);
    const ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
    const sw = new Rectangle(x, y + h / 2, w / 2, h / 2);
    const se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);

    this.northwest = new QuadTree(nw, this.capacity);
    this.northeast = new QuadTree(ne, this.capacity);
    this.southwest = new QuadTree(sw, this.capacity);
    this.southeast = new QuadTree(se, this.capacity);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northwest.insert(point) || this.northeast.insert(point) ||
          this.southwest.insert(point) || this.southeast.insert(point)) {
        return true;
      }
    }
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (point.x >= this.x &&
            point.x < this.x + this.w &&
            point.y >= this.y &&
            point.y < this.y + this.h);
  }
}

// Initialize the Quad-Tree for the gallery space
const boundary = new Rectangle(0, 0, 11, 11);
const quadTree = new QuadTree(boundary, 4);

// Insert all pictures into the Quad-Tree
galleryData.forEach(picture => {
  quadTree.insert({ x: picture.x, y: picture.y, id: picture.id });
});

// Handle user movement with arrow keys
const quadTreeGridSize = 11; // Grid is 11x11

function moveUser(dx, dy, direction) {
  user.move(dx, dy);
  user.updateOrientation(direction);
  updateUserMarker();
  updateInformation();
}

function updateUserMarker() {
  userMarker.style.gridRowStart = user.position.y;
  userMarker.style.gridColumnStart = user.position.x;

  // Update arrow orientation
  switch(user.orientation) {
    case 'up':
      userArrow.style.transform = 'rotate(0deg)';
      break;
    case 'down':
      userArrow.style.transform = 'rotate(180deg)';
      break;
    case 'left':
      userArrow.style.transform = 'rotate(270deg)';
      break;
    case 'right':
      userArrow.style.transform = 'rotate(90deg)';
      break;
  }
}

// Event listener for arrow keys
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case "ArrowUp":
      if (user.orientation === 'up') moveUser(0, -1, 'up');
      else if (user.orientation === 'down') moveUser(0, 1, 'down');
      else if (user.orientation === 'left') moveUser(-1, 0, 'left');
      else if (user.orientation === 'right') moveUser(1, 0, 'right');
      break;
    case "ArrowDown":
      if (user.orientation === 'up') moveUser(0, 1, 'down');
      else if (user.orientation === 'down') moveUser(0, -1, 'up');
      else if (user.orientation === 'left') moveUser(1, 0, 'right');
      else if (user.orientation === 'right') moveUser(-1, 0, 'left');
      break;
    case "ArrowLeft":
      user.updateOrientation('left');
      updateUserMarker();
      break;
    case "ArrowRight":
      user.updateOrientation('right');
      updateUserMarker();
      break;
  }
});

// Update information panel
function updateInformation() {
  infoContainer.textContent = `Current Position: (${user.position.x}, ${user.position.y}) - Orientation: ${user.orientation}`;
  galleryData.forEach(picture => {
    if (picture.x === user.position.x && picture.y === user.position.y) {
      infoContainer.textContent += ` - Near artwork ${picture.id}`;
    }
  });
}

// Initial update of information panel
updateInformation();

// Create map grid and populate it with artworks
galleryData.forEach(picture => {
  const cell = document.createElement('div');
  cell.classList.add('map-cell');
  cell.style.border = '1px solid #ccc';
  cell.style.width = '100%';
  cell.style.height = '100%';
  cell.style.gridRowStart = picture.y;
  cell.style.gridColumnStart = picture.x;
  cell.style.backgroundColor = 'yellow';
  cell.textContent = picture.id;
  mapContainer.appendChild(cell);
});