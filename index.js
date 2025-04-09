const puppeteer = require('puppeteer');
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const USE_EXTERNAL_PROXY = true; // toggle this to false if you want to drop the external proxy
const proxyBase = 'http://gondola.proxy.rlwy.net:39031/proxy?url=';

let browser;

// Launch Puppeteer browser on startup
(async () => {
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('✅ Puppeteer browser launched');
    } catch (err) {
        console.error('❌ Failed to launch Puppeteer:', err.message);
    }
})();

// Health check
app.get('/health', (req, res) => {
    res.send('OK');
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('❌ Error: URL query parameter is required');

    if (!browser) return res.status(500).send('❌ Browser not ready yet');

    let page;
    try {
        page = await browser.newPage();

        // Intercept and rewrite requests
        if (USE_EXTERNAL_PROXY) {
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                const url = request.url();
                if (url.startsWith('http')) {
                    const proxiedUrl = `${proxyBase}${encodeURIComponent(url)}`;
                    request.continue({ url: proxiedUrl });
                } else {
                    request.continue();
                }
            });
        }

        // Retry logic (try up to 3 times)
        let tries = 0;
        let success = false;
        let content = '';

        while (tries < 3 && !success) {
            try {
                const finalUrl = USE_EXTERNAL_PROXY
                    ? `${proxyBase}${encodeURIComponent(targetUrl)}`
                    : targetUrl;

                await page.goto(finalUrl, {
                    timeout: 15000,
                    waitUntil: 'domcontentloaded'
                });

                await page.waitForSelector('body', { timeout: 5000 });

                content = await page.content();
                success = true;
            } catch (err) {
                tries++;
                console.warn(`⚠️ Try ${tries} failed:`, err.message);
                if (tries >= 3) throw err;
            }
        }

        await page.close();

        res.set('Content-Type', 'text/html');
        res.send(content);

    } catch (error) {
        console.error('🔥 Proxy error:', error.message);
        if (page) await page.close();
        res.status(500).send(`❌ Proxy failed: ${error.message}`);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
