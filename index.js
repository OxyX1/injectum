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
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Error: URL query parameter is required');
    }

    try {
        const page = await browser.newPage();

        // Navigate to the target URL
        await page.goto(targetUrl);

        // Wait for the page to load completely
        await page.waitForSelector('body');

        // Get the full HTML content of the page
        const content = await page.content();

        await page.close();

        // Send the HTML content as the response
        res.set('Content-Type', 'text/html'); // Specify the correct MIME type
        res.send(content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
