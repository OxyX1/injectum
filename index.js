const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

// Create a proxy server
const proxy = httpProxy.createProxyServer();

http.createServer((req, res) => {
  // Parse the query parameters to extract the `result` URL
  const queryObject = url.parse(req.url, true).query;
  const target = queryObject.result;

  if (!target) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing "result" query parameter');
    return;
  }

  console.log(`Proxying request to: ${target}`);

  // Forward the request to the target site
  proxy.web(req, res, { target }, error => {
    console.error('Error during proxying:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  });
}).listen(process.env.PORT || 8080);

console.log('Dynamic proxy engine running at http://localhost:39031');
