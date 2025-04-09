const puppeteer = require('puppeteer');
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;

let browser;

// Launch Puppeteer browser on startup
(async () => {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Railway compatibility
    });
    console.log('Puppeteer browser launched');
})();

// Define a route for the proxy
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url; // Get the target URL from the query parameter
    const proxyBase = 'http://gondola.proxy.rlwy.net:39031/proxy?url='; // Proxy base URL

    if (!targetUrl) {
        return res.status(400).send('Error: URL query parameter is required');
    }

    try {
        const page = await browser.newPage();

        // Intercept requests and rewrite them to use the proxy
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const url = request.url();

            if (url.startsWith('http')) {
                // Rewrite external links to include the proxy
                const proxiedUrl = `${proxyBase}${encodeURIComponent(url)}`;
                request.continue({ url: proxiedUrl });
            } else {
                // Allow internal requests to proceed normally
                request.continue();
            }
        });

        // Navigate to the proxied target URL
        await page.goto(`${proxyBase}${encodeURIComponent(targetUrl)}`);

        // Wait for the page to load completely
        await page.waitForSelector('body');

        // Get the full HTML content of the page with rewritten links
        const content = await page.content();

        await page.close();

        // Send the rewritten HTML content as the response
        res.set('Content-Type', 'text/html');
        res.send(content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while proxying the request');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
