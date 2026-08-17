'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { requestListener } = require('./server');
const releases = require('./releases.json');

const ROOT = __dirname;
const SITE_ORIGIN = 'https://downitup.com';

function sitemapEntries() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function fileForUrl(urlString) {
  const { pathname } = new URL(urlString, SITE_ORIGIN);
  if (pathname === '/') return path.join(ROOT, 'index.html');
  if (pathname === '/blog') return path.join(ROOT, 'blog', 'index.html');
  return path.join(ROOT, `${pathname.slice(1)}.html`);
}

function matchContent(html, expression, label, filePath) {
  const match = html.match(expression);
  assert.ok(match, `${path.relative(ROOT, filePath)} is missing ${label}`);
  return match[1].replace(/\s+/g, ' ').trim();
}

test('every sitemap URL has complete, unique canonical metadata', () => {
  const urls = sitemapEntries();
  const titles = new Set();
  const descriptions = new Set();

  assert.ok(urls.length >= 19, 'sitemap should include all authority and content pages');

  for (const url of urls) {
    const filePath = fileForUrl(url);
    assert.ok(fs.existsSync(filePath), `${url} has no matching HTML file`);
    const html = fs.readFileSync(filePath, 'utf8');
    const title = matchContent(html, /<title>([^<]+)<\/title>/i, 'title', filePath);
    const description = matchContent(html, /<meta\s+name="description"\s+content="([^"]+)"/i, 'meta description', filePath);
    const canonical = matchContent(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i, 'canonical URL', filePath);

    assert.match(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i, `${url} is missing an H1`);
    assert.equal(canonical, url, `${url} has a mismatched canonical URL`);
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    assert.ok(!descriptions.has(description), `duplicate description: ${description}`);
    assert.doesNotMatch(html, /<meta\s+name="keywords"/i, `${url} contains an ignored meta keywords tag`);
    titles.add(title);
    descriptions.add(description);

    for (const script of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      assert.doesNotThrow(() => JSON.parse(script[1]), `${url} contains invalid JSON-LD`);
    }
  }
});

test('internal links resolve to public files and use clean URLs', () => {
  const htmlFiles = sitemapEntries().map(fileForUrl);

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf8');
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|#)/.test(href)) continue;
      assert.doesNotMatch(href, /\.html(?:[?#]|$)/, `${path.relative(ROOT, filePath)} links to a .html URL`);

      const hrefPath = href.split(/[?#]/)[0];
      if (/\.(?:css|js|png|ico|webmanifest|json)$/i.test(hrefPath)) {
        const assetPath = hrefPath.startsWith('/')
          ? path.join(ROOT, hrefPath.slice(1))
          : path.resolve(path.dirname(filePath), hrefPath);
        assert.ok(fs.existsSync(assetPath), `${path.relative(ROOT, filePath)} has broken asset link ${href}`);
        continue;
      }

      const resolved = new URL(href, `${SITE_ORIGIN}/${path.relative(ROOT, filePath).replace(/index\.html$|\.html$/g, '')}`);
      if (resolved.origin !== SITE_ORIGIN) continue;
      const target = resolved.pathname === '/releases.json'
        ? path.join(ROOT, 'releases.json')
        : fileForUrl(`${SITE_ORIGIN}${resolved.pathname}`);
      assert.ok(fs.existsSync(target), `${path.relative(ROOT, filePath)} has broken link ${href}`);
    }
  }
});

test('release manifest contains verifiable desktop artifacts', () => {
  for (const platform of ['windows', 'macos', 'linux']) {
    const release = releases.platforms[platform];
    assert.equal(release.status, 'beta');
    assert.match(release.version, /^\d+\.\d+\.\d+$/);
    assert.ok(release.artifacts.length > 0);
    for (const artifact of release.artifacts) {
      assert.ok(artifact.sizeBytes > 1_000_000);
      assert.match(artifact.sha256, /^[a-f0-9]{64}$/);
      assert.match(artifact.url, /^https:\/\/github\.com\/romreviewer\//);
    }
  }
});

test('local server redirects duplicate URL forms', () => {
  function request(url, host = 'downitup.com') {
    const response = { statusCode: null, headers: {}, ended: false };
    requestListener({ url, method: 'GET', headers: { host } }, {
      writeHead(statusCode, headers = {}) {
        response.statusCode = statusCode;
        response.headers = headers;
      },
      end() {
        response.ended = true;
      }
    });
    return response;
  }

  const htmlResponse = request('/download-windows.html');
  assert.equal(htmlResponse.statusCode, 301);
  assert.equal(htmlResponse.headers.Location, '/download-windows');

  const slashResponse = request('/blog/');
  assert.equal(slashResponse.statusCode, 301);
  assert.equal(slashResponse.headers.Location, '/blog');

  const wwwResponse = request('/help?source=test', 'www.downitup.com');
  assert.equal(wwwResponse.statusCode, 301);
  assert.equal(wwwResponse.headers.Location, 'https://downitup.com/help?source=test');
});
