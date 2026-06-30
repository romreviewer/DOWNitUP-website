# DOWNitUP Website

Landing page for [DOWNitUP](https://play.google.com/store/apps/details?id=com.romreviewertools.downitup) — a free, fast download manager and torrent client for Android (desktop coming soon).

## Features

- Modern dark glassmorphism design
- Fully responsive (mobile, tablet, desktop)
- SEO optimized with structured data (JSON-LD), Open Graph, and keyword targeting
- Comparison table vs IDM, ADM, qBittorrent
- FAQ section for search visibility
- Scroll-triggered animations
- Privacy policy page

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Node.js for the desktop update API
- Google Fonts (Inter)
- No frontend frameworks or build tools

## Local Development

Open `index.html` in a browser, or serve with any static file server:

```bash
npx serve .
```

To run the website with the desktop update API:

```bash
npm start
```

The server listens on `http://localhost:3000` by default and exposes:

```http
GET /checkupdate/downitup/desktop
```

Release metadata can be changed without code edits:

```bash
DESKTOP_LATEST_VERSION_CODE=2 \
DESKTOP_LATEST_VERSION_NAME=1.0.1 \
DESKTOP_DOWNLOAD_URL=https://downitup.com \
DESKTOP_RELEASE_NOTES_URL=https://downitup.com/releases \
DESKTOP_RELEASE_PUBLISHED_AT=2026-06-30T00:00:00Z \
npm start
```
