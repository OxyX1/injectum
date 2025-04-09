import express from 'express';
import puppeteer from 'puppeteer';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Intercept network requests to rewrite links
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Rewrite URLs to go through the proxy
        const rewrittenUrl = `http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)}`;
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
            const rewrittenHref = `http://localhost:3000/proxy?url=${encodeURIComponent(originalHref)}`;
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
  } catch (error) {
    console.error('Error with Puppeteer:', error);
    res.status(500).send('Something went wrong with the proxy.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
