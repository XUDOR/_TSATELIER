// server.js
// Express server for Interactive Gallery

// Import required modules
const express = require('express');
const path = require('path'); // Node.js module for working with file paths
const fs = require('fs');   // Node.js module for interacting with the file system

// Initialize the Express application
const app = express();

// Define the port the server will listen on
// Use the environment variable PORT if available (for deployment), otherwise default to 3000
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// Serve static files (HTML, CSS, client-side JS) from the 'public' directory
// This means any file in `_TSATELIER/public/` can be accessed directly by its path.
// e.g., http://localhost:3000/script.js will serve public/script.js
// e.g., http://localhost:3000/images/MERIDIANS_I.jpg will serve public/images/MERIDIANS_I.jpg
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API and Data Routes ---

// Define a GET endpoint to serve the gallery layout data (layout.json)
// Accessed by the client at: /api/layout
app.get('/api/layout', (req, res) => {
    // Construct the absolute path to the layout.json file in the root 'data' directory
    const layoutPath = path.join(__dirname, '..', 'data', 'layout.json');

    fs.readFile(layoutPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading layout.json file:", layoutPath, err);
            return res.status(500).json({ error: 'Could not load gallery layout.' });
        }
        try {
            const layoutData = JSON.parse(data);
            res.json(layoutData); // Send as JSON
        } catch (parseErr) {
            console.error("Error parsing layout.json:", parseErr);
            return res.status(500).json({ error: 'Could not parse gallery layout data.' });
        }
    });
});

// NEW: Define a GET endpoint to serve the artworkManifest.js file
// The client-side import `import { artworkManifest } from './data/artworkManifest.js';`
// (relative to script.js in the public folder) will resolve to the browser requesting:
// http://localhost:3000/data/artworkManifest.js
// This route will now handle that request.
app.get('/data/artworkManifest.js', (req, res) => {
    // Construct the absolute path to the artworkManifest.js file in the root 'data' directory
    const manifestPath = path.join(__dirname, '..', 'data', 'artworkManifest.js');

    fs.readFile(manifestPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading artworkManifest.js file:", manifestPath, err);
            // Send a 404 if the file is not found, as the client specifically asked for this file path
            return res.status(404).type('text/plain').send('Artwork manifest not found.');
        }
        // Send the file content as JavaScript
        res.type('application/javascript').send(data);
    });
});


// --- Optional: Catch-all for Single Page Applications (SPA) ---
// If you were building a SPA with client-side routing (like React Router),
// you might uncomment this to send index.html for any unknown GET routes.
// For this project, it's likely not needed if all assets are correctly pathed.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the gallery at: http://localhost:${PORT}`);
    console.log(`Serving static files from: ${path.join(__dirname, '..', 'public')}`);
    console.log(`API endpoint for layout: /api/layout`);
    console.log(`Data endpoint for artwork manifest: /data/artworkManifest.js`);
});
