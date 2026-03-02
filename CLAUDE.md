# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

棋飞书库 (qifeibook.com) is a Next.js SSG (Static Site Generation) e-book library website. It provides free e-book downloads with cloud storage links (Quark, Baidu). The site is SEO-optimized with dynamic metadata generation, JSON-LD structured data, and Baidu search engine integration.

## Tech Stack

- **Next.js 16** with App Router and React 19
- **Tailwind CSS v4** (zero-config, via `@tailwindcss/postcss`)
- **TypeScript** with strict mode and `@/*` path alias (maps to project root)
- **lucide-react** for icons

## Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build (SSG)
npm start            # Start production server
npm run lint         # ESLint (flat config, ignores legacy_backup/, scripts/, dist/, .next/)
npm run push:baidu   # Push sitemap to Baidu (requires BAIDU_PUSH_TOKEN in .env)
```

No test framework is configured.

## Architecture

### Data Layer

`data/mockData.ts` is the single source of truth — a static TypeScript array of `Book` objects serving as the entire database. All pages import directly from this file. There is no API layer or database.

```typescript
interface Book {
  id: number; title: string; author: string; authorDetail: string;
  year: string; cover: string; description: string; category: string;
  downloadLinks: DownloadLink[]; size: string; format: string; publishYear: string;
}
interface DownloadLink { name: string; url: string; code?: string; }
```

### Rendering Strategy

All pages use SSG. Book detail and category pages use `generateStaticParams()` to pre-render at build time. The search page (`/search`) is the only client-rendered page (uses `useSearchParams`).

| Route | File | Rendering |
|-------|------|-----------|
| `/` | `app/page.tsx` | SSG — all books sorted by ID desc |
| `/book/[id]` | `app/book/[id]/page.tsx` | SSG via `generateStaticParams()` |
| `/category/[id]` | `app/category/[id]/page.tsx` | SSG — `id` is the category name string |
| `/search?q=...` | `app/search/page.tsx` | Client-side filtering |

### Server vs Client Components

- **Server components**: `Footer`, `RelatedBooks`, page components (homepage, book detail, category)
- **Client components** (`"use client"`): `Header` (search bar + category tag cloud computed from `books`), `BookList` (infinite scroll via IntersectionObserver, loads 10 at a time), `BookCard`, `BreadcrumbNav`

### Styling Approach (Hybrid)

Three styling methods are used — follow the pattern of the component you're modifying:
1. **Tailwind v4** — inline utility classes, plus shared constants in `lib/styles.ts`
2. **CSS Modules** — component-scoped styles (`BookCard.module.css`, `Header.module.css`, `BookCardSkeleton.module.css`, `app/book/[id]/page.module.css`)
3. **Global CSS** — `app/globals.css` defines CSS custom properties, reusable classes (`.container`, `.btn`, `.card`, `.book-grid`), and responsive grid breakpoints

### Utilities (`lib/`)

- `lib/utils.ts` — JSON-LD structured data generators, text truncation, date formatting
- `lib/constants.ts` — site config constants (URLs, thresholds, error messages)
- `lib/styles.ts` — Tailwind class constants and `mergeClasses` utility

### SEO

- `generateMetadata()` on book and category pages for dynamic titles, OpenGraph, and Twitter cards
- JSON-LD structured data (Book schema, breadcrumbs) generated via `lib/utils.ts`
- `public/sitemap.xml` updated by sync scripts
- Google Analytics (GA4) and Baidu site verification in `app/layout.tsx`

## Adding New Books

**Manual:** Add entries to `data/mockData.ts` following the `Book` interface. New books should have the highest `id` (homepage sorts descending).

**Feishu Sync:** Add books to Feishu spreadsheet, then run `node scripts/sync_to_website.js` to auto-update `data/mockData.ts` and `public/sitemap.xml`.

## Environment Variables

- `BAIDU_PUSH_TOKEN`: Required for `npm run push:baidu`
- Feishu credentials are hardcoded in `scripts/sync_to_website.js`

## Legacy

`legacy_backup/` contains the original Vite + React SPA codebase. It is excluded from ESLint and not part of the active project.
