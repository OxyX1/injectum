app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    console.log('[+] Loading:', targetUrl);

    // Launch browser with persistent user data (caching, cookies, etc.)
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            userDataDir: './user-data' // persists across sessions
        });

        const page = await browser.newPage();

        try {
            await page.goto(targetUrl, { waitUntil: 'networkidle2' });

            // Get HTML content
            const content = await page.content();

            // Load content into Cheerio for rewriting
            const $ = cheerio.load(content);

            // Rewrite all href/src/links to go through the proxy
            $('[href], [src], [action]').each((i, el) => {
                const attr = el.attribs.href ? 'href' : el.attribs.src ? 'src' : 'action';
                const val = $(el).attr(attr);
                if (val && !val.startsWith('javascript:') && !val.startsWith('data:') && !val.startsWith('#')) {
                    const fullUrl = new URL(val, targetUrl).toString();
                    $(el).attr(attr, proxyBase + encodeURIComponent(fullUrl));
                }
            });

            res.send($.html());
        } catch (err) {
            console.error('Error loading page content:', err);
            res.status(500).send('Failed to load the page content.');
        }
    } catch (err) {
        console.error('Error launching browser:', err);
        res.status(500).send('Failed to launch the browser or load the page.');
    } finally {
        if (browser) await browser.close();
    }
});
