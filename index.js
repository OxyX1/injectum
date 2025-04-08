const express = require("express");
const puppeteer = require("puppeteer");
const { URL } = require("url");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_PROXY = "https://gondola.proxy.rlwy.net/proxy?url=";

// Function to rewrite URLs to go through the proxy
function rewrite(url, baseUrl) {
  if (!url || url.startsWith("data:") || url.startsWith("javascript:")) return url; // Ignore data URLs and javascript URLs
  try {
    const fullUrl = new URL(url, baseUrl).href; // Resolve relative URL to absolute
    return BASE_PROXY + encodeURIComponent(fullUrl); // Route through the proxy
  } catch (error) {
    return url; // Return original URL if it can't be resolved
  }
}

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url= param.");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Intercept network requests
  page.on("request", (request) => {
    const url = request.url();

    // Rewrite all URLs for the requested resources
    const rewrittenUrl = rewrite(url, targetUrl);

    if (["document", "script", "stylesheet", "image", "font", "xhr", "fetch", "media"].includes(request.resourceType())) {
      // Continue request for document, CSS, JS, images, fonts, etc.
      request.continue({ url: rewrittenUrl });
    } else {
      // Block any other types of requests, like WebSocket, etc.
      request.abort();
    }
  });

  try {
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 25000 });

    // Wait for the body to load to ensure the page is ready
    await page.waitForSelector('body');

    let content = await page.content();
    
    // Rewrite URLs in the content of the page
    const rewrittenContent = content.replace(/(href|src|action)=['"](?!https?:\/\/)([^'"]+)['"]/g, (match, p1, p2) => {
      const rewrittenUrl = rewrite(p2, targetUrl);
      return `${p1}='${rewrittenUrl}'`; // Rewrite URL for href, src, and action attributes
    });

    await browser.close();

    res.setHeader("Content-Type", "text/html");
    res.send(rewrittenContent);
  } catch (err) {
    await browser.close();
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Proxy is running at http://localhost:${PORT}/proxy?url=https://example.com`);
});
