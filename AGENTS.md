# AGENTS.md

This file provides current guidance for Codex / agent work in this repository.

## Project Overview

棋飞书库 (qifeibook.com) is an e-book directory and download navigation site. The production architecture is now:

- Cloudflare Workers
- Cloudflare D1
- Cloudflare Workers Assets
- Worker-rendered SEO HTML
- JSON APIs backed by D1

Production domains:

- `https://qifeibook.com`
- `https://www.qifeibook.com`, redirected to `qifeibook.com`
- Workers dev URL: `https://qifeibook.richard356929.workers.dev`

D1 database:

- `database_id`: `85829f2e-86fb-40d8-8b32-f9db64e56c00`

The historical Next.js / React / Vercel path has been removed. Do not reintroduce Next.js, React, Tailwind, Vercel DNS, or Vercel-oriented deployment assumptions unless explicitly requested.

## Current Tech Stack

- **Cloudflare Workers** for production routing and HTML/API responses
- **Cloudflare D1** for book, category, download-link, and search data
- **Cloudflare Workers Assets** for static files in `public/`
- **TypeScript** with strict mode and `@/*` path alias
- **ESLint** for static validation
- **Playwright** for maintained Douban scraping helpers

## Common Commands

```bash
npm run typecheck      # TypeScript validation
npm run lint           # ESLint validation
npm run cf:dev         # Local Cloudflare Worker dev
npm run cf:deploy      # Deploy Cloudflare Worker
npm run cf:version     # Wrangler version through local wrapper
```

D1 / data setup:

```bash
npm run db:export-sql
npm run db:setup:local
npm run db:migrate:local
npm run db:seed:local
```

SEO / data validation:

```bash
npm run seo:smoke             # Smoke test Worker SEO HTML/XML routes
npm run seo:data-quality      # Report API data quality and keyword coverage
npm run seo:keyword-backfill  # Generate keyword backfill SQL from data/mockData.ts
```

Baidu push scripts still exist:

```bash
npm run push:baidu
npm run push:baidu:priority
```

No test framework is currently configured. For code changes, run at least:

```bash
npm run typecheck
npm run lint
```

For production-facing Worker changes, deploy with:

```bash
npm run cf:deploy
```

## Current Architecture

### Production Routing

Cloudflare routing is configured in `wrangler.jsonc`.

Worker code:

- `worker/index.ts`: Worker entry
- `worker/routes.ts`: route dispatcher
- `worker/db.ts`: D1 queries and pagination/search helpers
- `worker/templates.ts`: HTML templates and inline page styles
- `worker/types.ts`: Worker-facing types
- `worker/utils.ts`: response, escaping, parsing, cache helpers

Worker-rendered HTML routes:

- `/`
- `/search`
- `/page/:page`
- `/book/:id`
- `/author/:name`
- `/author/:name/page/:page`
- `/category/:slug`
- `/category/:slug/page/:page`
- `/tag/:name`
- `/tag/:name/page/:page`
- `/sitemap.xml`
- `/sitemap-index.xml`
- `/sitemaps/static.xml`
- `/sitemaps/categories.xml`
- `/sitemaps/authors.xml`
- `/sitemaps/tags.xml`
- `/sitemaps/books-1.xml`
- `/robots.txt`

Worker JSON API routes:

- `GET /api/health`
- `GET /api/home`
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/categories`
- `GET /api/category/:slug`
- `GET /api/search`

### Data Layer

Production reads from D1, not directly from `data/mockData.ts`.

D1 schema lives in:

- `db/migrations/0001_init.sql`

Tables:

- `books`
- `categories`
- `download_links`
- `books_fts`

Important indexes:

- `idx_categories_slug`
- `idx_books_category_id_id`
- `idx_books_id_desc`
- `idx_books_slug`
- `idx_download_links_book_id`

`data/mockData.ts` remains as a historical/static source and import source. Do not treat it as the production runtime database for new Worker-facing features.

Shared data-access types live in:

- `lib/data-access/`

Keyword/tag SEO data is generated from:

- `scripts/seo_keywords.mjs`: curated keyword derivation rules
- `scripts/generate_keyword_backfill_sql.mjs`: generates local and remote-safe keyword backfill SQL
- `scripts/export_books_to_sql.mjs`: exports seed SQL with derived `keywords_json` and FTS keywords

Generated SQL files in `db/seed/*.sql` are ignored by git. Re-run the scripts instead of editing generated SQL manually.

### Rendering Strategy

Production SEO pages are Worker-rendered HTML.

The Worker templates preserve:

- dynamic `<title>`
- meta description
- canonical
- robots meta, including `noindex,follow` for search and thin author/tag pages
- OpenGraph
- Twitter Card
- Book JSON-LD
- Breadcrumb JSON-LD
- ItemList JSON-LD for homepage/category/author/tag listing pages
- sitemap
- robots.txt

Escaping is important. Any imported or database text rendered into HTML must be passed through the existing escaping helpers.

## Current UI / Product State

### Homepage

Current homepage behavior:

- Worker renders first-page HTML.
- First page shows the newest 20 books.
- Infinite scroll loads 20 more books at the bottom through `/api/books`.
- Book list uses card layout, not a plain list.
- Popular categories show only 8 categories initially.
- Remaining categories are under “展开全部分类”.
- Header has been compressed.
- Removed decorative header elements:
  - “精选电子书目录”
  - category/stat pills
  - visible “快速找书” label
  - trial-search hint text
- Search input remains and has `aria-label`.

### SEO / Crawlable Pages

Current SEO behavior:

- `/search` is crawlable for discovery but marked `noindex,follow`; canonical is `/search`.
- Pagination is crawlable through `/page/:page` and `/category/:slug/page/:page`, with rel prev/next where relevant.
- Author pages exist at `/author/:name`; indexable author pages require at least 2 books and exclude generic names such as `佚名`, `匿名`, `未知`, `多人`, and pure bracket labels such as `[美]`.
- Tag pages exist at `/tag/:name`; indexable tag pages require at least 3 books and a useful tag name.
- Book detail keyword chips link to tag pages.
- Thin author/tag pages can render for users but should output `noindex,follow`.

Sitemap behavior:

- `/sitemap.xml` is a flat `urlset` for Google Search Console compatibility.
- `/sitemap-index.xml` is retained as the split sitemap index.
- Child sitemaps include static, categories, authors, tags, and books.
- `robots.txt` points to `https://qifeibook.com/sitemap.xml`.

### Book Detail Page

Current detail page layout:

- Left sticky info card with cover and quick metadata.
- Main content order:
  - 作者简介
  - 内容简介
  - 下载地址
  - 相关推荐

Current detail behavior:

- 作者简介 is above 内容简介.
- 下载地址 is below 内容简介.
- 内容简介 supports 展开完整简介 / 收起简介.
- Expanded content continues in the same paragraph; do not split it into a second visible block.
- Download cards only show:
  - netdisk/source name, for example 百度网盘
  - 提取码
  - 前往下载
  - 复制提取码
- Removed from download cards:
  - “立即下载” kicker
  - explanatory subtitle
  - 推荐下载 label
  - provider badge such as `baidu`
  - format/year/size pills

## Repository Layout

- `worker/`: current production Worker implementation
- `db/migrations/`: D1 migrations
- `lib/data-access/`: shared data-access DTOs and boundaries
- `data/`: historical/static book data and import source
- `scripts/`: maintained scraping, image upload, SQL export, D1 publishing, SEO, and Baidu push scripts
- `docs/`: current architecture, design, and development summary
- `public/`: static assets served by Workers Assets

Important docs:

- `docs/current-development-summary.md`
- `docs/cloudflare-refactor-plan.md`
- `docs/cloudflare-refactor-design.md`
- `SKILLS.md`

## Development Rules For Future Agents

- Treat `worker/` as the production surface.
- Do not add new runtime dependencies on `data/mockData.ts` for production pages.
- Keep homepage and detail page changes in `worker/templates.ts` unless the architecture is intentionally changed.
- Keep D1 query changes in `worker/db.ts`.
- Keep route behavior changes in `worker/routes.ts`.
- Before deploy, run `npm run typecheck` and `npm run lint`.
- After deploy, verify the relevant production HTML or API response with `curl` when possible.
- Preserve SEO output when changing HTML routes.
- Preserve the current Cloudflare custom-domain setup.
- For future image and cover uploads, use the global `image-host-upload` skill through `scripts/lib/image_host_upload.cjs`; do not depend on local PicList/PicGo services unless the user explicitly requests a legacy script.
- Do not restore deleted Next.js, React, Tailwind, Vercel, or legacy Feishu sync paths as part of routine fixes.
- Avoid destructive git operations. The repo may contain many unrelated untracked scripts and data files.

## Data Import / Book Management Notes

Existing automation scripts are still present and may be used or adapted:

| Script | Purpose |
|--------|---------|
| `scripts/export_books_to_sql.mjs` | Export current book data to SQL seed |
| `scripts/generate_keyword_backfill_sql.mjs` | Generate keyword backfill SQL for local and remote D1 |
| `scripts/seo_keywords.mjs` | Shared keyword derivation rules for seed/backfill |
| `scripts/report_data_quality.mjs` | Check API data quality and keyword coverage |
| `scripts/seo_smoke_check.mjs` | Smoke test SEO HTML/XML endpoints |
| `scripts/publish_book_to_d1.mjs` | Publish one local `data/mockData.ts` book record to local or remote D1 |
| `scripts/scrape_douban.cjs` | Legacy single-book Douban scrape; cover upload uses `image-host-upload` |
| `scripts/scrape_douban_list.cjs` | Legacy Douban list scrape; cover upload uses `image-host-upload` |
| `scripts/lib/image_host_upload.cjs` | Project wrapper for the global `image-host-upload` skill |
| `scripts/lib/douban_cover_fetcher.cjs` | Douban cover fetch helper |

For the canonical new-book workflow, see `docs/new-book-publishing.md`. For detailed legacy script usage, see `SKILLS.md`.

## Current Follow-Up Priorities

- Add minimal integration tests for Worker API and HTML output.
- Keep expanding D1 import validation reports beyond current coverage checks.
- Improve search ranking: exact title match, author match, keyword match, description match.
- Split sitemap for 100k-book scale.
- Define production cache policy and observability checks.

## Last Documented Production Version

Last verified Cloudflare Worker version:

- `7ee2260d-4a42-45b5-8939-b4f5c65713fe`

Verified behavior:

- Homepage popular category count is 8.
- Homepage first page and pagination are Worker/API driven.
- Detail page download and description layout changes are live.
- Search page is `noindex,follow` with canonical `/search`.
- Crawlable pagination, author pages, tag pages, split sitemaps, and flat GSC-compatible `/sitemap.xml` are live.
- `/sitemaps/authors.xml` excludes generic/thin author names.
- `/sitemaps/tags.xml` is live.

Last verified production data update:

- Date: 2026-04-30
- Remote D1 keyword backfill executed with `db/seed/keywords_backfill.remote.sql`.
- D1 bookmark after execution: `0000006b-00000036-0000505c-350fd5610c32dfaef31dfb7cd8c7f8c2`.
- Remote execution processed 610 queries and wrote 609 rows.
- Production `/sitemap.xml` verified with 768 `<loc>` URLs and includes tag URLs.
- Production `/tag/网络小说` verified as `index,follow`, canonicalized, and listing 361 books.
