const express = require("express");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 8080;

const USE_EXTERNAL_PROXY = false; // set to true if you wanna use gondola again
const proxyBase = 'http://gondola.proxy.rlwy.net:39031/proxy?url=';

let browser;

(async () => {
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('✅ Puppeteer launched');
    } catch (err) {
        console.error('❌ Launch error:', err.message);
    }
})();

app.get('/health', (req, res) => res.send('OK'));

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing `url` param');
    if (!browser) return res.status(500).send('Browser not ready');

    let page;

    try {
        page = await browser.newPage();

        // Spoof headers for stealth
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");

        // Optional: rewrite internal requests via proxy
        if (USE_EXTERNAL_PROXY) {
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                const url = request.url();
                if (url.startsWith('http')) {
                    const proxied = `${proxyBase}${encodeURIComponent(url)}`;
                    request.continue({ url: proxied });
                } else request.continue();
            });
        }

        const finalUrl = USE_EXTERNAL_PROXY
            ? `${proxyBase}${encodeURIComponent(targetUrl)}`
            : targetUrl;

        await page.goto(finalUrl, {
            timeout: 20000,
            waitUntil: 'domcontentloaded'
        });

        await page.waitForSelector('body', { timeout: 10000 });

        let html = await page.content();

        // Rewriting all links to go through /proxy again
        html = html.replace(/(href|src|action)="(.*?)"/g, (match, attr, val) => {
            if (val.startsWith("http") || val.startsWith("//")) {
                const safeUrl = val.startsWith("//") ? "https:" + val : val;
                return `${attr}="/proxy?url=${encodeURIComponent(safeUrl)}"`;
            } else if (val.startsWith("/")) {
                // Absolute path relative to domain
                const newUrl = new URL(val, targetUrl).href;
                return `${attr}="/proxy?url=${encodeURIComponent(newUrl)}"`;
            } else {
                // Relative paths
                const newUrl = new URL(val, targetUrl).href;
                return `${attr}="/proxy?url=${encodeURIComponent(newUrl)}"`;
            }
        });

        await page.close();
        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (err) {
        console.error("❌ Proxy error:", err.message);
        if (page) await page.close();
        res.status(500).send(`Proxy failed: ${err.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
