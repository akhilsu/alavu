import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('./dist/', import.meta.url)));
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const resource = decodeURIComponent(url.pathname);
    const target = path.resolve(root, '.' + (resource === '/' ? '/index.html' : resource));
    if (!target.startsWith(root + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(target);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(target)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
      'Cache-Control': 'no-cache',
    });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, '0.0.0.0', () => console.log(`Alavu ready at http://localhost:${port}`));
