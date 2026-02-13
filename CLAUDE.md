# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

棋飞书库 (qifeibook.com) is a Next.js SSG (Static Site Generation) e-book library website. It provides free e-book downloads with cloud storage links (Quark, Baidu). The site is SEO-optimized with dynamic metadata generation, JSON-LD structured data, and Baidu search engine integration.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Push sitemap to Baidu Search Engine (requires BAIDU_PUSH_TOKEN in .env)
npm run push:baidu
```

## Architecture

### Data Source
- **`data/mockData.ts`**: Single source of truth for all book data. Contains a TypeScript array of `Book` objects with metadata like title, author, cover URL, download links, categories, etc.

### App Structure (Next.js App Router)
- **`app/page.tsx`**: Homepage - displays all books sorted by ID (descending, newest first)
- **`app/book/[id]/page.tsx`**: Dynamic book detail pages using `generateStaticParams()`
- **`app/category/[id]/page.tsx`**: Category listing pages, also using `generateStaticParams()`
- **`app/search/page.tsx`**: Client-side search functionality (uses `useSearchParams`)

### Key Components
- **`components/BookList.tsx`**: Client component with infinite scroll loading (Intersection Observer)
- **`components/BookCard.tsx`**: Individual book card component
- **`components/Header.tsx`**: Site navigation header
- **`components/Footer.tsx`**: Site footer

### SEO & Metadata
- Uses `generateMetadata()` for dynamic page titles and descriptions
- JSON-LD structured data for books and breadcrumbs
- Sitemap auto-generation during build (`public/sitemap.xml`)
- Baidu site verification code in `app/layout.tsx`

### Sync Scripts (scripts/)
- **`sync_to_website.js`**: Fetches new books from Feishu (飞书) spreadsheet API and syncs to `data/mockData.ts` and `public/sitemap.xml`. Requires Feishu app credentials.
- **`push-baidu.js`**: Pushes sitemap URLs to Baidu search engine for indexing. Requires `BAIDU_PUSH_TOKEN` environment variable.
- **`fetch_unsynced.js`**: Helper script for Feishu data fetching.

## Adding New Books

### Method 1: Manual Edit
Directly edit `data/mockData.ts` to add book entries. Follow the `Book` interface:
```typescript
{
  id: number,
  title: string,
  author: string,
  authorDetail: string,
  year: string,
  cover: string,
  description: string,
  category: string,
  downloadLinks: DownloadLink[],
  size: string,
  format: string,
  publishYear: string
}
```

### Method 2: Feishu Sync
1. Add books to Feishu spreadsheet with columns: 书名, 夸克网盘, 百度网盘, 状态, 封面图, 分类
2. Run `node scripts/sync_to_website.js` to sync new books (status != 1) to the codebase
3. The script auto-updates `data/mockData.ts`, `public/sitemap.xml`, and marks synced items

## Environment Variables

Required for certain scripts:
- `BAIDU_PUSH_TOKEN`: For `npm run push:baidu` - Baidu search engine API token

Note: Feishu credentials in `sync_to_website.js` are hardcoded (consider moving to .env for better security).

## Build & Deploy

The project uses Next.js static generation. Run `npm run build` to generate the `.next` folder with static HTML/CSS/JS. The site can be deployed to Vercel, Netlify, or any static hosting provider.

After deployment, run `npm run push:baidu` to notify Baidu of new pages.
