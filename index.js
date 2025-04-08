const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 39031;

app.use(cors());

const PROXY_BASE = `http://localhost:${port}/proxy?url=`;

app.get('/proxy', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('Missing URL');

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });

        const contentType = response.headers['content-type'];

        // Only transform HTML
        if (contentType && contentType.includes('text/html')) {
            const $ = cheerio.load(response.data);

            // Rewriting all src, href, form action, etc.
            $('*[src]').each((_, el) => {
                let src = $(el).attr('src');
                if (src && !src.startsWith('data:')) {
                    const abs = new URL(src, url).href;
                    $(el).attr('src', PROXY_BASE + encodeURIComponent(abs));
                }
            });

            $('*[href]').each((_, el) => {
                let href = $(el).attr('href');
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    const abs = new URL(href, url).href;
                    $(el).attr('href', PROXY_BASE + encodeURIComponent(abs));
                }
            });

            $('form').each((_, el) => {
                let action = $(el).attr('action');
                if (action) {
                    const abs = new URL(action, url).href;
                    $(el).attr('action', PROXY_BASE + encodeURIComponent(abs));
                }
            });

            // Inject a base tag (optional for relative URLs)
            $('head').prepend(`<base href="${url}">`);

            res.set('Content-Type', 'text/html');
            res.send($.html());
        } else {
            // Just pipe non-HTML (JS, CSS, images, etc.)
            res.set('Content-Type', contentType);
            res.send(response.data);
        }

    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).send('Error fetching URL');
    }
});

app.listen(port, () => {
    console.log(`Advanced proxy running on http://localhost:${port}`);
});
