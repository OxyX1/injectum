const http = require('http');
const httpProxy = require('http-proxy');
const cheerio = require('cheerio');
const url = require('url');

const proxy = httpProxy.createProxyServer({ changeOrigin: true });
const PORT = process.env.PORT || 8080;
const PROXY_BASE_URL = `http://localhost:${PORT}`;

http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const target = queryObject.result;

  if (!target) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing "result" query parameter');
    return;
  }

  // Forward the request
  proxy.web(req, res, { target }, error => {
    console.error('Error during proxying:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  });

  // Rewrite the HTML in the response
  proxy.on('proxyRes', (proxyRes, req, res) => {
    let body = '';
    proxyRes.on('data', chunk => {
      body += chunk;
    });

    proxyRes.on('end', () => {
      if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
        const $ = cheerio.load(body);

        // Rewrite all anchor links and forms to point to the proxy
        $('a').each((i, elem) => {
          const href = $(elem).attr('href');
          if (href) {
            $(elem).attr('href', `${PROXY_BASE_URL}/proxy?result=${encodeURIComponent(url.resolve(target, href))}`);
          }
        });

        $('form').each((i, elem) => {
          const action = $(elem).attr('action');
          if (action) {
            $(elem).attr('action', `${PROXY_BASE_URL}/proxy?result=${encodeURIComponent(url.resolve(target, action))}`);
          }
        });

        // Send the modified HTML back to the client
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end($.html());
      } else {
        // Forward non-HTML responses as-is
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(body);
      }
    });
  });
}).listen(PORT, () => {
  console.log(`Proxy with full rewriting running at ${PROXY_BASE_URL}`);
});
