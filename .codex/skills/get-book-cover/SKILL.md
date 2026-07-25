---
name: get-book-cover
description: Use in the qifeibook project when fetching a book cover, converting a Douban cover into a qifeibook image-host URL, uploading a local cover image, or verifying that a cover URL is usable before publishing book metadata.
---

# Get Book Cover

Use this skill to produce a final cover URL suitable for qifeibook book records. Final cover values should be `https://img.aqifei.top/...` URLs, not Douban CDN hotlinks.

## Preferred Flow

1. Work from `/Users/zcy/dev/github/qifeibook`.
2. If the user already provides an `https://img.aqifei.top/...` URL, verify it:

```bash
curl -I -L 'https://img.aqifei.top/img/...'
```

3. If the user provides a local image file, upload it with the project wrapper or global image-host script:

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs /absolute/path/to/cover.jpg --json
```

4. If the user provides only a title, try the maintained Douban fetcher first:

```bash
node scripts/lib/douban_cover_fetcher.cjs "书名"
```

For ambiguous titles, include the author or subtitle in the search query when using the module API:

```js
const { fetchDoubanCovers } = require("./scripts/lib/douban_cover_fetcher.cjs");
const results = await fetchDoubanCovers([
  { title: "历史的温度8", search: "历史的温度8 张玮" },
]);
console.log(results);
```

The fetcher opens Douban with Playwright, intercepts the real `doubanio.com/view/subject/` image bytes, uploads through `scripts/lib/image_host_upload.cjs`, and returns `cdnUrl`.

## Browser Fallback

Use this if the script misses the right edition or Douban blocks the automated path. The demonstrated manual workflow is:

1. Open `https://db.aqifei.top/qifeibook`.
2. Use the "找封面图" tab or button.
3. Enter the book title and click "找封面图" or "自动获取封面".
4. If this opens Douban search, pick the correct book result.
5. On the Douban book page, click the cover image link to open the raw image, usually like:

```text
https://img9.doubanio.com/view/subject/l/public/s35492625.jpg
```

6. Right-click the raw image and choose "复制图片", not just "复制图片地址".
7. Return to `https://db.aqifei.top/qifeibook` and paste into the upload area that says "点击上传封面图 或直接粘贴截图".
8. Wait for the preview and "图片地址" field.
9. Click "复制" and verify the resulting `https://img.aqifei.top/...` URL by opening it or using `curl -I -L`.

Do not store the raw Douban URL in `data/mockData.ts` or D1 records. It is acceptable as an intermediate source only.

## Validation

Before using a cover in publishing:

- Confirm the final URL begins with `https://img.aqifei.top/`.
- Confirm it returns `HTTP 200` through `curl -I -L`.
- Prefer a real book cover image, not a screenshot with browser UI or surrounding page chrome.
- For qifeibook publishing, pass the verified URL to `npm run book:publish -- --title "书名" --cover "URL" --url "下载链接"` or update the relevant local record and publish through the existing D1 workflow.

## Failure Handling

- If the title has multiple editions, ask for or infer the intended author, publisher, subtitle, or year before uploading.
- If upload fails, run the image-host config check:

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs --check
```

- If Douban image download returns 418 or an empty file, use the Playwright fetcher or browser-copy fallback instead of direct `curl` hotlink download.
