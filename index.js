const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const app = express();

puppeteer.use(StealthPlugin());

const PORT = process.env.PORT || 8080;
let browser;

(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-features=site-per-process",
        ],
    });
    console.log("✅ Puppeteer launched");
})();

app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("❌ Missing ?url param");
    if (!browser) return res.status(503).send("⏳ Browser not ready");

    let page;
    try {
        page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        );

        // block fonts, tracking pixels, etc. for speed
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const type = req.resourceType();
            if (["font", "image", "media"].includes(type)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Go to the page, fast mode
        await page.goto(targetUrl, {
            waitUntil: "domcontentloaded",
            timeout: 90000, // 90 seconds max
        });

        // wait for basic content to show
        await page.waitForSelector("body", { timeout: 15000 });

        let html = await page.content();

        // rewrite all URLs to stay inside proxy
        html = html.replace(/(src|href|action)=["']([^"']+)["']/g, (match, attr, val) => {
            if (val.startsWith("data:") || val.startsWith("javascript:") || val.startsWith("about:")) {
                return match;
            }

            try {
                const newUrl = new URL(val, targetUrl).href;
                return `${attr}="/proxy?url=${encodeURIComponent(newUrl)}"`;
            } catch {
                return match;
            }
        });

        await page.close();
        res.set("Content-Type", "text/html");
        res.send(html);
    } catch (err) {
        console.error("❌ Proxy error:", err.message);
        if (page) await page.close();
        res.status(500).send(`Proxy failed: ${err.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Mirror proxy running: http://localhost:${PORT}/proxy?url=https://example.com`);
});
