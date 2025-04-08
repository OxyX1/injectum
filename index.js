const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL: 1 hour

// Use the dynamically assigned port from Railway or default to 39031
const PORT = process.env.PORT || 39031;

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.result;
    if (!targetUrl) {
        return res.status(400).send("Missing 'result' query parameter!");
    }

    // Check if the response is cached
    if (cache.has(targetUrl)) {
        console.log("Serving cached content");
        return res.send(cache.get(targetUrl));
    }

    try {
        // Fetch the target URL content
        const response = await axios.get(targetUrl);
        cache.set(targetUrl, response.data); // Store the response in the cache
        console.log("Serving fresh content");
        res.set('Content-Type', response.headers['content-type']);
        return res.send(response.data);
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
        return res.status(500).send("Failed to fetch target URL");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}/`);
});
