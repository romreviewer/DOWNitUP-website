'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const { handleUpdateRequest } = require('./update-api');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

const PRIVATE_FILES = new Set([
  'package.json',
  'server.js',
  'update-api.js',
  'update-api.test.js'
]);

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);

  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

function resolveStaticPath(requestPathname) {
  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(requestPathname);
  } catch {
    return null;
  }

  const normalizedPath = path.normalize(decodedPathname).replace(/^(\.\.[/\\])+/, '');
  const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^[/\\]/, '');
  const pathSegments = relativePath.split(/[\\/]/);

  if (pathSegments.some((segment) => segment.startsWith('.')) || PRIVATE_FILES.has(relativePath)) {
    return null;
  }

  const absolutePath = path.join(PUBLIC_DIR, relativePath);
  const rootRelativePath = path.relative(PUBLIC_DIR, absolutePath);

  if (rootRelativePath.startsWith('..') || path.isAbsolute(rootRelativePath)) {
    return null;
  }

  return absolutePath;
}

function sendStatic(req, res, pathname) {
  const filePath = resolveStaticPath(pathname);

  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      sendStatic(req, res, path.join(pathname, 'index.html'));
      return;
    }

    const candidatePaths = [filePath];
    if (path.extname(filePath) === '') {
      candidatePaths.push(`${filePath}.html`);
    }

    serveFirstExisting(req, res, candidatePaths);
  });
}

function serveFirstExisting(req, res, candidatePaths) {
  const [filePath, ...rest] = candidatePaths;

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      if (rest.length > 0) {
        serveFirstExisting(req, res, rest);
        return;
      }

      serveNotFound(req, res);
      return;
    }

    const headers = {
      'Content-Type': MIME_TYPES.get(path.extname(filePath)) || 'application/octet-stream',
      'Content-Length': stats.size
    };

    if (/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$/i.test(filePath)) {
      headers['Cache-Control'] = 'public, max-age=2592000, immutable';
    }

    res.writeHead(200, headers);

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  });
}

function serveNotFound(req, res) {
  const notFoundPath = path.join(PUBLIC_DIR, '404.html');

  fs.stat(notFoundPath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : 'Not found');
      return;
    }

    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': stats.size
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(notFoundPath).pipe(res);
  });
}

function requestListener(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/checkupdate/downitup/desktop') {
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      res.end();
      return;
    }

    const result = handleUpdateRequest(url);
    sendJson(res, result.status, result.body);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  sendStatic(req, res, url.pathname);
}

if (require.main === module) {
  const server = http.createServer(requestListener);

  server.listen(PORT, HOST, () => {
    console.log(`DOWNitUP website listening on http://${HOST}:${PORT}`);
  });
}

module.exports = {
  requestListener
};
