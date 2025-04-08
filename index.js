const puppeteer = require('puppeteer');
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;

let browser; // Shared Puppeteer browser instance

// Launch Puppeteer before starting the server
(async () => {
    browser = await puppeteer.launch();
    console.log('Puppeteer browser launched');
})();

// Express route
app.get('/', async (req, res) => {
    try {
        const page = await browser.newPage();

        // Navigate to YouTube
        await page.goto('https://www.youtube.com');

        // Wait for the YouTube homepage to load
        await page.waitForSelector('ytd-app');

        // Take a screenshot of the YouTube homepage
        await page.screenshot({ path: 'youtube_homepage.png' });

        console.log('Screenshot captured: youtube_homepage.png');

        await page.close(); // Close the page after use

        res.send('Screenshot captured successfully!');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on ${PORT}`);
});
