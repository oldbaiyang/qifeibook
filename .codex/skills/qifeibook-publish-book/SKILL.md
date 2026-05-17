---
name: qifeibook-publish-book
description: Use when adding, publishing, syncing, or verifying a new book in the qifeibook project, especially when the user provides a title, cover, download link, asks why a book is not visible on qifeibook.com, or needs GitHub and Cloudflare D1 publishing.
---

# Qifeibook Publish Book

This project publishes from Cloudflare D1. Editing `data/mockData.ts` alone is not enough for production visibility.

## Required Flow

1. Gather or infer book metadata:
   - title, author, authorDetail, description, category, year, format, downloadLinks, keywords.
   - If only title and netdisk link are provided, enrich the missing fields before publishing.
2. Handle the cover:
   - Do not store Douban CDN URLs in final data.
   - Get a real local image file by browser save, screenshot, user file, or guarded download with Referer.
   - Upload with global `image-host-upload`.
   - Store only the returned `https://img.aqifei.top/...` URL.
3. Update local source:
   - Add the book to `data/mockData.ts`.
   - Use a unique numeric ID.
   - Reuse existing categories when reasonable.
4. Publish to D1:
   - Use `scripts/publish_book_to_d1.mjs`.
   - Prefer `--id` once the local record exists.
5. Verify production:
   - Search API.
   - Detail API.
   - Detail HTML/SEO.
   - Cover URL.
6. Commit carefully:
   - The worktree is often dirty.
   - Stage only files for the current book or workflow change.
   - Do not commit unrelated generated files or user edits.

## Commands

Check image host config:

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs --check
```

Upload a local cover:

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs /absolute/path/to/cover.jpg --json
```

Preview D1 SQL:

```bash
node scripts/publish_book_to_d1.mjs --id 1010 --dry-run
```

Publish to remote D1:

```bash
CLOUDFLARE_API_TOKEN=... node scripts/publish_book_to_d1.mjs --id 1010 --remote
```

Verify:

```bash
curl -sS 'https://qifeibook.com/api/search?q=书名'
curl -sS 'https://qifeibook.com/api/books/1010'
curl -sS 'https://qifeibook.com/book/1010' | rg '书名|封面文件名|百度网盘|<title>'
curl -I -L 'https://img.aqifei.top/img/2026/05/cover.jpg'
```

## Token Safety

Never ask the user to paste a Cloudflare token into chat. If a token appears in chat, use it only if necessary for the immediate task, do not repeat it, and tell the user to revoke it afterward.

`wrangler login` may fail with Cloudflare bot challenge. In that case, use `CLOUDFLARE_API_TOKEN` in the local shell environment.

## References

Read `docs/new-book-publishing.md` for the full checklist and rationale.
