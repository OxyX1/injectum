const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Proxy route to forward game URLs
app.get('/proxy', async (req, res) => {
    const { url } = req.query; // Expect a 'url' query parameter

    if (!url) {
        return res.status(400).json({ error: 'Missing game URL' });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                // Add more headers if needed to bypass CORS or referrer blocking
            },
            responseType: 'stream', // We stream the response
        });

        // Pipe the game content to the client
        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res); // Forward the stream to the client
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Failed to fetch the game' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
