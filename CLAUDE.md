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
npm run seo:smoke
npm run seo:data-quality
npm run seo:keyword-backfill
```

No test framework is currently configured. Run at least `npm run typecheck` and `npm run lint` before claiming code changes are complete.

## Production Architecture

Worker code:

- `worker/index.ts`: Worker entry
- `worker/routes.ts`: route dispatcher
- `worker/db.ts`: D1 queries
- `worker/templates.ts`: SEO HTML templates and inline styles
- `worker/types.ts`: Worker-facing types
- `worker/utils.ts`: response, escaping, cache, and parsing helpers

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
- `/search`
- `/page/:page`
- `/book/:id`
- `/author/:name`
- `/category/:slug`
- `/tag/:name`
- `/sitemap.xml`
- `/sitemap-index.xml`
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
```

Do not put Cloudflare tokens in docs, commits, or chat. If a token is exposed, tell the user to revoke and recreate it.

Maintained Douban scripts require Feishu configuration through environment variables:

```bash
FEISHU_APP_ID=... FEISHU_APP_SECRET=... FEISHU_WIKI_TOKEN=... FEISHU_SHEET_ID=... node scripts/scrape_douban.cjs "书名"
```

## Editing Guidance

- Treat `worker/`, `db/`, `lib/data-access/`, `lib/utils.ts`, and maintained scripts as the active production surface.
- Keep escaping in `worker/templates.ts` intact for any database-rendered text.
- Preserve canonical, robots meta, OpenGraph, Twitter Card, Book JSON-LD, Breadcrumb JSON-LD, and ItemList JSON-LD when changing HTML routes.
- Do not restore deleted Next.js, React, Tailwind, Vercel, or legacy Feishu sync paths as part of routine fixes.
