const puppeteer = require('puppeteer');

(async () => {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to YouTube
    await page.goto('https://www.youtube.com');

    // Wait for the YouTube homepage to load
    await page.waitForSelector('ytd-app'); // Waits for the main YouTube component to load

    // Take a screenshot of the YouTube homepage
    await page.screenshot({ path: 'youtube_homepage.png' });

    console.log('Screenshot captured: youtube_homepage.png');

    // Close the browser
    await browser.close();
})();
