import express from 'express';
import puppeteer from 'puppeteer';

// Initialize express app
const app = express();

// Your proxy endpoint
app.get('/proxy', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Intercept network requests to rewrite links
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Rewrite URLs to go through the proxy
      const rewrittenUrl = `https://improved-space-telegram-jj7xwjxj9pxpcjpvp-3000.app.github.dev/proxy?url=${encodeURIComponent(url)}`;
      request.continue({ url: rewrittenUrl });
    } else {
      request.continue();
    }
  });

  // Load the page
  await page.goto(url);

  // Modify the content to rewrite all relative links
  await page.evaluate(() => {
    const rewriteLinks = (element) => {
      if (element.tagName === 'A') {
        const originalHref = element.getAttribute('href');
        if (originalHref) {
          const rewrittenHref = `/proxy?url=${encodeURIComponent(originalHref)}`;
          element.setAttribute('href', rewrittenHref);
        }
      }
    };

    // Rewriting links in the page
    document.querySelectorAll('a').forEach(rewriteLinks);
  });

  // Get the page content after modifications
  const modifiedContent = await page.content();

  // Send the modified content as the response
  res.send(modifiedContent);

  await browser.close();
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Proxy server running at http://localhost:3000');
});
