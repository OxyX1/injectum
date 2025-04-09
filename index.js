const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fetch = require("node-fetch");
const app = express();

puppeteer.use(StealthPlugin());

const PORT = process.env.PORT || 8080;
let browser;

(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("✅ Puppeteer ready");
})();

app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("❌ Missing ?url param");

    let page;
    try {
        page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        );

        // Faster load w/ domcontentloaded
        await page.goto(targetUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        await page.waitForSelector("body", { timeout: 10000 });

        let html = await page.content();
        await page.close();

        // Rewrite assets
        html = html.replace(/(src|href|action)=["']([^"']+)["']/g, (match, attr, val) => {
            if (val.startsWith("data:") || val.startsWith("javascript:") || val.startsWith("about:")) {
                return match;
            }

            try {
                const newUrl = new URL(val, targetUrl).href;
                return `${attr}="/asset?url=${encodeURIComponent(newUrl)}"`;
            } catch {
                return match;
            }
        });

        res.set("Content-Type", "text/html");
        res.send(html);
    } catch (err) {
        console.error("❌ Proxy error:", err.message);
        if (page) await page.close();
        res.status(500).send("Proxy failed: " + err.message);
    }
});

// 💾 Lightweight asset proxy (CSS, JS, images)
app.get("/asset", async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).send("Missing ?url param");

    try {
        const response = await fetch(fileUrl);
        const contentType = response.headers.get("content-type") || "application/octet-stream";
        res.set("Content-Type", contentType);
        const buffer = await response.buffer();
        res.send(buffer);
    } catch (err) {
        console.error("❌ Asset load error:", err.message);
        res.status(500).send("Failed to load asset");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Turbo Proxy running at http://localhost:${PORT}/proxy?url=https://example.com`);
});
