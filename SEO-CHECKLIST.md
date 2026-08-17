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
- [ ] Merge the canonical redirect locations from `nginx.conf` into the active TLS
      server block, then confirm HTTP, `www`, `.html`, and trailing-slash variants
      return one-hop 301 redirects to `https://downitup.com/<clean-path>`.
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
- [ ] **SourceForge / GitHub Releases** — maintain accurate versioned binaries,
      release notes, file sizes, and checksums that link back to downitup.com.
- [ ] **SaaSHub and Stackshare** — describe DOWNitUP accurately as freeware; do not
      select open-source categories or badges.
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
- [x] ~~Consider a small blog/changelog section~~ — done: `/blog` with 6 guides/comparisons
      plus an `/about` page were added (2026-08). Add new articles over time (e.g. more
      comparison content) to capture long-tail traffic.
- [ ] Keep `sitemap.xml` updated whenever new pages are added.
- [ ] Update `releases.json` for every release; download pages and the desktop update
      API use it as their shared release source.

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
