const express = require("express");
const puppeteer = require("puppeteer");
const { URL } = require("url");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_PROXY = "https://gondola.proxy.rlwy.net/proxy?url=";

function rewriteAll(html, baseUrl) {
  const rewrite = (url) => {
    if (!url || url.startsWith("data:") || url.startsWith("javascript:")) return url;
    try {
      const full = new URL(url, baseUrl).href;
      return BASE_PROXY + encodeURIComponent(full);
    } catch {
      return url;
    }
  };

  return html
    .replace(/(src|href|action)=["']([^"']+)["']/gi, (_, attr, url) => {
      return `${attr}="${rewrite(url)}"`;
    })
    .replace(/(window\.location\s*=\s*["'])([^"']+)(["'])/gi, (_, p1, url, p3) => {
      return `${p1}${rewrite(url)}${p3}`;
    })
    .replace(/(location\.href\s*=\s*["'])([^"']+)(["'])/gi, (_, p1, url, p3) => {
      return `${p1}${rewrite(url)}${p3}`;
    })
    .replace(/fetch\(["']([^"']+)["']/gi, (_, url) => {
      return `fetch("${rewrite(url)}"`;
    })
    .replace(/["']url\(([^)]+)\)["']/gi, (_, url) => {
      return `"url(${rewrite(url.replace(/["']/g, ""))})"`;
    });
}

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url= param.");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      const url = req.url();

      // Allow assets & main request
      if (["document", "script", "stylesheet", "image", "xhr", "fetch", "font"].includes(req.resourceType())) {
        req.continue();
      } else {
        req.abort();
      }
    });

    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 25000 });
    await page.waitForTimeout(1000);

    let content = await page.content();
    const rewritten = rewriteAll(content, targetUrl);

    await browser.close();
    res.setHeader("Content-Type", "text/html");
    res.send(rewritten);
  } catch (err) {
    await browser.close();
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Full Proxy Live: http://localhost:${PORT}/proxy?url=https://example.com`);
});
