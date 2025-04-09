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

// Define a route for proxy interaction
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url; // Retrieve the target URL from the query parameters

    if (!targetUrl) {
        return res.status(400).send('Error: URL query parameter is required');
    }

    try {
        const page = await browser.newPage();

        // Navigate to the target URL via Puppeteer
        await page.goto(targetUrl);

        // Wait for the page to load completely
        await page.waitForSelector('body');

        // Capture a screenshot of the proxied page (optional)
        await page.screenshot({ path: 'proxied_page.png' });
        console.log(`Screenshot captured for: ${targetUrl}`);

        await page.close(); // Close the page instance

        res.send(`Proxied request to ${targetUrl} was successful`);
    } catch (error) {
        console.error('Error while proxying:', error);
        res.status(500).send('An error occurred while proxying the request');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
