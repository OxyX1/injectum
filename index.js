const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 39031; // You can change this port if needed

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Custom CORS handling for all routes to make sure it's allowed
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all domains (be cautious in production)
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Proxy route to forward game URLs with query parameters
app.get('/proxy', async (req, res) => {
    const { url } = req.query; // Expect a 'url' query parameter

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        console.log('Fetching URL:', url);  // Debug log for the URL being fetched

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            responseType: 'stream', // Stream the response for large files or games
        });

        console.log('Fetched data successfully'); // Confirm successful fetch

        // Forward the headers and content of the response
        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res); // Pipe the game content directly to the client
    } catch (error) {
        console.error('Error fetching the game:', error);
        res.status(500).json({ error: 'Failed to fetch the URL. Please try again later.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
