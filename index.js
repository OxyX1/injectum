const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // For deployment compatibility
    });

    const page = await browser.newPage();

    // Navigate to the proxy URL for Roblox
    const proxyUrl = 'http://gondola.proxy.rlwy.net:39031/proxy?url=https://roblox.com';
    await page.goto(proxyUrl);

    // Wait for the page to load completely
    await page.waitForSelector('body');

    // Optionally, capture a screenshot of the proxied page
    await page.screenshot({ path: 'roblox_via_proxy.png' });

    console.log('Screenshot captured: roblox_via_proxy.png');

    // Close the browser
    await browser.close();
})();
