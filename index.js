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
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

        await page.setRequestInterception(true);

        // Proxy all requests to stay inside /proxy
        page.on("request", (request) => {
            const url = request.url();
            const type = request.resourceType();

            // Only proxy html, css, js, images, etc
            if (["document", "stylesheet", "script", "image", "xhr", "fetch"].includes(type)) {
                const newUrl = `/proxy?url=${encodeURIComponent(url)}`;
                if (url.startsWith("http")) {
                    request.continue({ url: `http://localhost:${PORT}${newUrl}` });
                } else {
                    request.continue();
                }
            } else {
                request.continue();
            }
        });

        await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 30000 });

        let html = await page.content();

        // Rewrite all absolute & relative src/href/action links
        html = html.replace(/(src|href|action)=["']([^"']+)["']/g, (match, attr, val) => {
            if (val.startsWith("data:") || val.startsWith("javascript:") || val.startsWith("about:")) {
                return match; // skip
            }

            try {
                const newUrl = new URL(val, targetUrl).href;
                return `${attr}="/proxy?url=${encodeURIComponent(newUrl)}"`;
            } catch {
                return match; // invalid URL
            }
        });

        res.set("Content-Type", "text/html");
        res.send(html);
        await page.close();
    } catch (err) {
        console.error("❌ Proxy error:", err.message);
        if (page) await page.close();
        res.status(500).send(`Proxy failed: ${err.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Mirror proxy live at http://localhost:${PORT}/proxy?url=https://example.com`);
});
