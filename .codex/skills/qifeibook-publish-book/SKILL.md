---
name: qifeibook-publish-book
description: Use when adding, updating, batch publishing, syncing, or verifying books in the qifeibook project. Trigger when the user provides a book title, cover URL, download link, asks to publish books, update book metadata, update sitemap, asks why a book is not visible on qifeibook.com, or needs Cloudflare D1 publishing.
---

# Qifeibook Publish Book

This project publishes from Cloudflare D1. Editing `data/mockData.ts` alone is not enough for production visibility.

Prefer the automation script for normal new-book publishing:

```bash
npm run book:publish -- \
  --title "书名" \
  --cover "https://img.aqifei.top/img/..." \
  --url "https://pan.quark.cn/s/..."
```

The script enriches metadata from public book data, writes `data/mockData.ts`, reads the Cloudflare token from macOS Keychain when available, publishes to remote D1, and verifies production. Pass overrides when the user provides them:

```bash
npm run book:publish -- \
  --title "书名" \
  --author "作者" \
  --cover "https://img.aqifei.top/img/..." \
  --url "https://pan.quark.cn/s/..." \
  --category "外国文学"
```

Preview without writing files, uploading covers, or publishing:

```bash
npm run book:publish -- --title "书名" --cover "https://img.aqifei.top/img/..." --url "https://pan.quark.cn/s/..." --dry-run
```

## Required Flow

1. Gather or infer book metadata:
   - title, author, authorDetail, description, category, year, format, downloadLinks, keywords.
   - If only title and netdisk link are provided, enrich the missing fields before publishing.
2. Handle the cover:
   - Do not store Douban CDN URLs in final data.
   - If the user provides an `https://img.aqifei.top/...` URL, use it directly after `curl -I -L` confirms `HTTP 200`.
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
5. Backfill SEO metadata:
   - Run `node scripts/backfill_seo_meta.mjs --remote` after publishing.
   - This updates `authors`, `tags`, and `book_tags` tables in D1.
   - New author/tag pages will return 404 until this step runs.
6. Verify production:
   - Search API.
   - Detail API.
   - Detail HTML/SEO.
   - Cover URL.
   - Author page (if new author).
   - Tag pages (if new tags).
7. Commit carefully:
   - The worktree is often dirty.
   - Stage only files for the current book or workflow change.
   - Do not commit unrelated generated files or user edits.

## New Book Automation

Use `scripts/add_and_publish_book.mjs` through `npm run book:publish` for ordinary publishing.

Important behavior:

- It refuses exact duplicate titles unless `--force` is passed.
- It assigns the next numeric ID.
- It infers provider names from URLs, including Quark links.
- It publishes to remote D1 by default.
- It reads `CLOUDFLARE_API_TOKEN` from the environment, or from macOS Keychain item:
  - account: `qifeibook`
  - service: `qifeibook-cloudflare-api-token`
- It verifies production detail/search/HTML after remote publish.

For batch publishing, run books sequentially, not in parallel. If a network request fails after a book is added locally, do not run the same `book:publish` command again because duplicate protection will stop it; instead publish the added ID directly:

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/publish_book_to_d1.mjs --id 1033 --remote
```

After publishing all books in a batch, backfill SEO metadata once:

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/backfill_seo_meta.mjs --remote
```

Then verify with the production checks below.

Use explicit `--category` when the automatic category is likely wrong:

- `外国文学`: translated classics and foreign literary fiction.
- `文学小说`: Chinese literary fiction.
- `科幻奇幻`: science fiction or fantasy novels.
- `商业经济`: business, investing, management, entrepreneurship.
- `社会文化`: media, sociology, politics, culture.
- `心理学` or `心理励志`: psychology/self-help/growth.

## Updating Existing Books

If the user says “修改” or supplies metadata for an existing title:

1. Locate the local record:

```bash
rg -n '"title": "书名"|书名' data/mockData.ts
```

2. Patch only the requested fields unless the user asks for broader cleanup.
3. Run:

```bash
npm run typecheck
npm run lint
node scripts/publish_book_to_d1.mjs --id BOOK_ID --dry-run
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/publish_book_to_d1.mjs --id BOOK_ID --remote
```

4. If author or keywords changed, backfill SEO metadata:

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/backfill_seo_meta.mjs --remote
```

5. Verify production API and HTML.

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

Use Keychain token without printing it:

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/publish_book_to_d1.mjs --id 1010 --remote
```

Backfill SEO metadata (authors/tags):

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/backfill_seo_meta.mjs --remote
```

Verify:

```bash
curl -sS 'https://qifeibook.com/api/search?q=书名'
curl -sS 'https://qifeibook.com/api/books/1010'
curl -sS 'https://qifeibook.com/book/1010' | rg '书名|封面文件名|百度网盘|<title>'
curl -I -L 'https://img.aqifei.top/img/2026/05/cover.jpg'
```

After batches, verify compactly:

```bash
for id in 1034 1035; do
  curl -sS "https://qifeibook.com/api/books/$id"
  curl -sS "https://qifeibook.com/book/$id" | rg '书名|封面文件名|夸克网盘|百度网盘|<title>'
done
```

## Sitemap

Production sitemap is Worker/D1 driven. New remote D1 books appear in:

- `https://qifeibook.com/sitemap.xml`
- `https://qifeibook.com/sitemaps/books-1.xml`

Verify after publishing:

```bash
curl -sS 'https://qifeibook.com/sitemap.xml' | rg '/book/1034'
curl -sS 'https://qifeibook.com/sitemaps/books-1.xml' | rg '/book/1034'
```

The legacy Baidu push scripts read `public/sitemap.xml`. If the user asks to update sitemap, sync the production sitemap into that file only after confirming production contains the new book IDs:

```bash
node - <<'NODE'
const fs = require("fs");
(async () => {
  const response = await fetch("https://qifeibook.com/sitemap.xml");
  if (!response.ok) throw new Error(`Failed to fetch sitemap: ${response.status}`);
  const xml = await response.text();
  fs.writeFileSync("public/sitemap.xml", xml.endsWith("\n") ? xml : `${xml}\n`, "utf8");
  console.log(`Updated public/sitemap.xml with ${(xml.match(/<loc>/g) || []).length} URLs`);
})();
NODE
```

## Token Safety

Never ask the user to paste a Cloudflare token into chat. If a token appears in chat, use it only if necessary for the immediate task, do not repeat it, and tell the user to revoke it afterward. Prefer the Keychain entry above.

`wrangler login` may fail with Cloudflare bot challenge. In that case, use `CLOUDFLARE_API_TOKEN` in the local shell environment.

## References

Read `docs/new-book-publishing.md` for the full checklist and rationale.
