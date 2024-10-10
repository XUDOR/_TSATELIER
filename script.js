// Placeholder data representing pictures in the gallery
const galleryData = [
  { id: 1, x: 20, y: 30 },
  { id: 2, x: 80, y: 300 },
  { id: 3, x: 150, y: 400 },
  { id: 4, x: 300, y: 450 },
  { id: 5, x: 500, y: 100 },
  { id: 6, x: 600, y: 50 },
  { id: 7, x: 700, y: 60 },
  { id: 8, x: 150, y: 600 },
  { id: 9, x: 450, y: 650 },
  { id: 10, x: 200, y: 500 },
  { id: 11, x: 300, y: 550 },
  { id: 12, x: 400, y: 620 },
  { id: 13, x: 500, y: 700 },
  { id: 14, x: 350, y: 480 },
];

const galleryContainer = document.getElementById("gallery-container");
const mapContainer = document.getElementById("map");
const infoContainer = document.getElementById("information");
const userPosition = { x: 700, y: 700 }; // Start at the door (lower right corner)

// Creating placeholder pictures
galleryData.forEach(picture => {
  const picElement = document.createElement("div");
  picElement.classList.add("picture");
  picElement.style.transform = `translate(${picture.x}px, ${picture.y}px)`;
  galleryContainer.appendChild(picElement);
});

// Create user marker on the map
const userMarker = document.createElement("div");
userMarker.id = "user-marker";
mapContainer.appendChild(userMarker);

// Handle user movement with arrow keys
document.addEventListener('keydown', (e) => {
  switch(e.key) {
      case "ArrowUp":
          userPosition.y -= 10;
          break;
      case "ArrowDown":
          userPosition.y += 10;
          break;
      case "ArrowLeft":
          userPosition.x -= 10;
          break;
      case "ArrowRight":
          userPosition.x += 10;
          break;
  }
  updatePictures();
  updateMap();
  updateInformation();
});

// Update pictures based on user position
function updatePictures() {
  galleryData.forEach((picture, index) => {
      const picElement = galleryContainer.children[index];
      const distance = Math.sqrt(
          Math.pow(picture.x - userPosition.x, 2) +
          Math.pow(picture.y - userPosition.y, 2)
      );
      const scale = Math.max(1, 200 / distance);
      picElement.style.transform = `translate(${picture.x}px, ${picture.y}px) scale(${scale})`;
  });
}

// Update user marker on the map
function updateMap() {
  const mapWidth = mapContainer.clientWidth;
  const mapHeight = mapContainer.clientHeight;

  const scaledX = (userPosition.x / 1000) * mapWidth;
  const scaledY = (userPosition.y / 1000) * mapHeight;

  userMarker.style.left = `${scaledX}px`;
  userMarker.style.top = `${scaledY}px`;
}

// Update information panel
function updateInformation() {
  infoContainer.textContent = `Current Position: (${userPosition.x}, ${userPosition.y})`;
}
