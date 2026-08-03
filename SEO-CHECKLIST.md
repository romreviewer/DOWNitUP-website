# SEO Checklist — Getting DOWNitUP to Page 1

On-page work (done in this repo) is only half the job. Rankings for competitive terms
like "download manager", "IDM alternative", and "torrent downloader" depend heavily on
crawlability, indexing, and **backlinks**. Work through this list in order.

## 1. Indexing (do this first)

- [ ] **Google Search Console** — verify `downitup.com` (DNS TXT record is easiest),
      then submit `https://downitup.com/sitemap.xml` under Sitemaps.
- [ ] **Bing Webmaster Tools** — verify and submit the same sitemap (Bing powers
      DuckDuckGo and others).
- [ ] Use Search Console's **URL Inspection → Request Indexing** on:
      `/`, `/idm-alternative`, `/fdm-alternative`, `/torrent-downloader`,
      `/download-windows`, `/download-mac`.
- [ ] Confirm the site is served over **HTTPS with a valid certificate** and that
      `http://` and `www.` variants 301-redirect to `https://downitup.com`. (The
      current `nginx.conf` only listens on port 80 — add an HTTPS server block with
      Let's Encrypt / Certbot if not already handled by Cloudflare.)
- [ ] Check `https://downitup.com/robots.txt` and `/sitemap.xml` return 200 in production.

## 2. High-value listing sites (biggest backlink wins)

These are the sites Google already ranks for "download manager" and
"X alternative" queries — getting listed puts you on page 1 by proxy:

- [ ] **AlternativeTo** — list DOWNitUP as an alternative to IDM, FDM, ADM,
      qBittorrent, JDownloader, Xtreme Download Manager. This is the single most
      important listing for "alternative" keywords.
- [ ] **Slant** — add to "What are the best download managers?" questions.
- [ ] **Product Hunt** — launch the desktop app (good spike + permanent backlink).
- [ ] **Softpedia, MajorGeeks, FileHorse, Uptodown, FossHub** — software directories
      that accept free submissions and are trusted by Google for software queries.
- [ ] **SourceForge / GitHub** — if the desktop app is open source, a well-maintained
      GitHub repo (README with keywords + link to downitup.com) ranks on its own.
- [ ] **SaaSHub, Stackshare, LibHunt** (if open source).
- [ ] Wikipedia — only once the app has independent press coverage (don't self-add).

## 3. Community seeding (do genuinely, not spammy)

- [ ] Reddit: r/software, r/androidapps (weekly "App Thread"), r/DataHoarder,
      r/torrents — answer "what download manager do you use?" threads honestly.
- [ ] Hacker News "Show HN" for the desktop launch.
- [ ] Answer relevant Quora questions ("What is the best free IDM alternative?")
      with a real comparison, linking the landing pages.

## 4. Content & ongoing

- [ ] Ask early users for **reviews** on the Play Store and listing sites — ratings
      and review counts are ranking signals on those platforms.
- [ ] Consider a small blog/changelog section (e.g. "IDM vs FDM vs DOWNitUP",
      "How to speed up downloads") — comparison content captures long-tail traffic.
- [ ] Keep `sitemap.xml` updated whenever new pages are added.

## 5. Measure

- [ ] Track queries in Search Console weekly: `download manager`, `idm alternative`,
      `fdm alternative`, `torrent downloader`. Expect movement over 4–12 weeks,
      not days.
- [ ] Watch Core Web Vitals in Search Console; the site is static so this should
      stay green as long as images are optimized.

## What NOT to do

- Don't buy backlinks or use link farms/PBNs — Google penalties are hard to recover from.
- Don't stuff keywords into hidden text or meta tags — the visible copy already
  targets the terms naturally.
- Don't duplicate the landing pages with near-identical text for more keywords —
  thin doorway pages get penalized.
