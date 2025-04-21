// server.js

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

// Serve static files (HTML, CSS, client-side JS)
// express.static middleware serves files from the specified directory.
// path.join is used to create correct paths regardless of the operating system.
// Since server.js is in the 'server' directory, we go up one level ('..')
// to find the 'public' directory.
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API Routes ---

// Define a GET endpoint to serve the gallery layout data
app.get('/api/layout', (req, res) => {
    // Construct the absolute path to the layout JSON file.
    // Go up one level ('..') from __dirname (which is the 'server' directory)
    // and then into the 'data' directory.
    const layoutPath = path.join(__dirname, '..', 'data', 'layout.json');

    // Read the layout file asynchronously
    fs.readFile(layoutPath, 'utf8', (err, data) => {
        // Handle potential file reading errors
        if (err) {
            console.error("Error reading layout file:", layoutPath, err);
            // Send a 500 Internal Server Error response if the file can't be read
            return res.status(500).json({ error: 'Could not load gallery layout.' });
        }

        // Try to parse the file content as JSON
        try {
            const layoutData = JSON.parse(data);
            // Send the parsed JSON data back to the client
            res.json(layoutData);
        } catch (parseErr) {
            // Handle potential JSON parsing errors
            console.error("Error parsing layout JSON:", parseErr);
            // Send a 500 Internal Server Error response if the JSON is invalid
            return res.status(500).json({ error: 'Could not parse gallery layout data.' });
        }
    });
});

// --- Optional: Catch-all for Single Page Applications ---
// If you were building a SPA with client-side routing (like React Router),
// you might uncomment this to send index.html for any unknown routes.
// For this project, it's likely not needed yet.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the gallery at: http://localhost:${PORT}`);
});
