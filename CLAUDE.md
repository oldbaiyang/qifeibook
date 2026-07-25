# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

棋飞书库 (qifeibook.com) is an e-book directory and download navigation site. Production is Cloudflare-only:

- Cloudflare Workers render SEO HTML and JSON APIs.
- Cloudflare D1 stores books, categories, download links, and search data.
- Cloudflare Workers Assets serves static files from `public/`.

The historical Next.js / React / Vercel application has been removed. Do not reintroduce it unless the user explicitly asks for a new frontend migration.

## Current Stack

- TypeScript with strict mode and `@/*` path alias
- Cloudflare Workers
- Cloudflare D1
- Workers Assets
- ESLint flat config
- Playwright for Douban scraping helpers

## Commands

```bash
npm run typecheck      # TypeScript validation
npm run lint           # ESLint validation
npm run cf:version     # Wrangler version through local wrapper
npm run cf:dev         # Local Worker dev
npm run cf:deploy      # Deploy Worker
```

D1 and data:

```bash
npm run db:export-sql
npm run db:setup:local
npm run db:migrate:local
npm run db:seed:local
```

SEO and data quality:

```bash
npm run seo:smoke              # Smoke test Worker SEO HTML/XML routes
npm run seo:data-quality       # Report API data quality and keyword coverage
npm run seo:keyword-backfill   # Generate keyword backfill SQL from data/mockData.ts
npm run site:regression        # Verify production regression points (icons, adsense, search, etc.)
```

Baidu push (legacy, still wired):

```bash
npm run push:baidu
npm run push:baidu:priority
```

One-shot new book (download + enrich + publish):

```bash
npm run book:publish -- --title "书名" --url "https://pan.baidu.com/s/xxx?pwd=0000" --code 0000
```

No test framework is currently configured. Run at least `npm run typecheck` and `npm run lint` before claiming code changes are complete.

## Production Architecture

Worker code:

- `worker/index.ts`: Worker entry. Runs `handleWorkerRoute` first, then falls back to `env.ASSETS` for static files. Returns a 404 HTML page when a static path is missing and the client accepts HTML.
- `worker/routes.ts`: route dispatcher. Strips trailing slashes, redirects `www` to apex, normalizes category aliases, and routes both HTML and `/api/*` paths.
- `worker/db.ts`: D1 queries and pagination/search helpers.
- `worker/templates.ts`: SEO HTML templates, JSON-LD builders, sitemap XML, robots.txt, and inline page styles.
- `worker/types.ts`: Worker-facing types (env, DTOs).
- `worker/utils.ts`: response, escaping, cache, and parsing helpers.
- `worker/authors.ts`: canonical author name lookup (strips bracket prefixes like `[美]`, normalizes whitespace) used for `/author/:name` redirects.
- `worker/categories.ts`: canonical category path/alias helpers used for `/category/:slug` 301 redirects (e.g. `心理力志` → `心理励志`).
- `worker/site.ts`: small shared site metadata (canonical host, ad client id, image host preconnect) consumed by templates.

Shared types and helpers:

- `lib/data-access/`: DTOs used by Worker queries and templates
- `lib/utils.ts`: JSON-LD and SEO utility functions used by Worker templates

D1 schema:

- `db/migrations/0001_init.sql`

Local source data:

- `data/mockData.ts` is retained as an import source and Git data record.
- Production does not read `data/mockData.ts` at runtime.

## Routes

Worker-rendered HTML includes:

- `/`
- `/page/:page`
- `/search`
- `/book/:id`
- `/author/:name` and `/author/:name/page/:page`
- `/category/:slug` and `/category/:slug/page/:page` (with 301 for known aliases)
- `/tag/:name` and `/tag/:name/page/:page`
- `/sitemap.xml` (flat GSC-compatible urlset)
- `/sitemap-index.xml` and `/sitemaps/{static,categories,authors,tags}.xml`, `/sitemaps/books-N.xml`
- `/llms.txt`
- `/robots.txt`

Worker JSON APIs include:

- `GET /api/health`
- `GET /api/home`
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/categories`
- `GET /api/category/:slug`
- `GET /api/search`

## Adding New Books

Use `docs/new-book-publishing.md` as the canonical workflow.

Key rules:

- Enrich missing metadata before publishing.
- Do not hotlink Douban cover URLs.
- Upload covers with the global `image-host-upload` skill or `scripts/lib/image_host_upload.cjs`.
- Add the local record to `data/mockData.ts`.
- Publish the record to D1 with `scripts/publish_book_to_d1.mjs`.
- Verify production search, detail API, detail HTML, and cover URL.

Useful commands:

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs --check
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs /absolute/path/to/cover.jpg --json
node scripts/publish_book_to_d1.mjs --id <book-id> --dry-run
CLOUDFLARE_API_TOKEN=... node scripts/publish_book_to_d1.mjs --id <book-id> --remote
npm run book:publish -- --title "书名" --url "<download-url>" --code 0000   # one-shot: fetch + enrich + publish
```

Do not put Cloudflare tokens in docs, commits, or chat. If a token is exposed, tell the user to revoke and recreate it.

Maintained Douban scripts require Feishu configuration through environment variables:

```bash
FEISHU_APP_ID=... FEISHU_APP_SECRET=... FEISHU_WIKI_TOKEN=... FEISHU_SHEET_ID=... node scripts/scrape_douban.cjs "书名"
```

EPUB download helper (extracts candidate links from a landing page and saves the first valid EPUB to `downloads/`):

```bash
node scripts/download_epub.mjs --url "https://example.com/land-page"
```

## Editing Guidance

- Treat `worker/`, `db/`, `lib/data-access/`, `lib/utils.ts`, and maintained scripts as the active production surface.
- Keep escaping in `worker/templates.ts` intact for any database-rendered text.
- Preserve canonical, robots meta, OpenGraph, Twitter Card, Book JSON-LD, Breadcrumb JSON-LD, and ItemList JSON-LD when changing HTML routes.
- Do not restore deleted Next.js, React, Tailwind, Vercel, or legacy Feishu sync paths as part of routine fixes.
