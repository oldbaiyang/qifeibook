# 新书推荐与发布流程

本文档是棋飞书库当前的新书发布标准。其他 agent 收到“发布 N 本书”时，应按本文档执行完整流程，而不是只修改本地文件。

生产站读取 Cloudflare D1。`data/mockData.ts` 是本地来源和 Git 记录，修改后必须同步到远端 D1 才会上线。

## 当前规则

用户说“发布 N 本书”时，默认执行：

1. 按找书规则推荐 N 本书。
2. 获取这 N 本书的精确封面，上传到图床。
3. 用全站统一下载地址发布这些书。
4. 回填 SEO 元数据。
5. 验证生产 API、HTML、封面、下载链接和 sitemap。

全站统一下载地址来自 `worker/site.ts` 的 `UNIFIED_DOWNLOAD_URL` 常量。当前内容：

```text
https://pan.quark.cn/s/a7450333781d
```

更换链接只需修改 `worker/site.ts`。默认不添加提取码，不添加额外下载说明。

## 找书规则

候选书必须同时满足：

- qifeibook 生产站和本地数据都未收录。
- 豆瓣读书能查到明确书目，且能匹配同一本书或同一中文译本。
- 有近期大众搜索需求或榜单/社媒/作者热度信号。
- 不涉及中国政治。
- 不推荐编程、程序员技术类书，除非用户明确要求。
- 不推荐大部头漫画。
- 不推荐 5 部以上续集的长连载。
- 不再要求 2020 年前出版。
- 不再要求 Z-Library 可查。

推荐优先级：

- 大众小说、心理、自我成长、亲子教育、健康、财经、商业、生活方式、文学随笔。
- 大众搜索需求高于小众专业需求。
- 同一批里优先选可获取精确封面、作者、出版年、简介的书。

必须做生产和本地排重。示例：

```bash
node --input-type=module <<'NODE'
const titles = ["书名一", "书名二"];
const normalize = (value) => String(value || "").replace(/[《》"'“”‘’\s:：·・,，.。!！?？()（）\-—]/g, "").toLowerCase();

for (const title of titles) {
  const response = await fetch("https://qifeibook.com/api/search?q=" + encodeURIComponent(title));
  const payload = await response.json();
  const exact = (payload.books || []).filter((book) => normalize(book.title) === normalize(title));
  console.log(JSON.stringify({ title, exact: exact.map((book) => `${book.id}:${book.title}`) }));
}
NODE

rg -n '"title": "书名"|书名' data db worker lib scripts docs public
```

短标题已存在时，不要用副标题、新版、作者名变体绕过。例如站内已有《安定此心》，则不要再发布《安定此心：我当精神科医生的12000天》，除非确认是不同作品。

## 豆瓣核验

推荐和封面都应以豆瓣精确条目为准。优先使用 `subject_suggest` 获取同书条目：

```bash
node --input-type=module <<'NODE'
const title = "金钱心理学";
const payload = await fetch("https://book.douban.com/j/subject_suggest?q=" + encodeURIComponent(title), {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://book.douban.com/"
  }
}).then((response) => response.json());
console.log(JSON.stringify(payload.slice(0, 5), null, 2));
NODE
```

核验时看：

- `title`
- `author_name`
- `year`
- `url`
- `pic`

如果同一书有多个版本，优先匹配本站要发布的年份和版本。不要把 2026 新版封面用于 2023 原版记录。

## 封面处理

最终封面必须是 `https://img.aqifei.top/...`，不能是豆瓣 CDN 热链。

推荐流程：

1. 从豆瓣精确条目的 `pic` 得到文件名，例如 `s34540496.jpg`。
2. 改为大图路径：`/view/subject/l/public/s34540496.jpg`。
3. 带 `Referer: https://book.douban.com/` 下载真实图片。
4. 上传到图床。
5. 目视确认封面文字和书名一致。
6. 用 `HEAD` 验证图床 URL 返回 `200 image/jpeg`。

下载并上传示例：

```bash
node <<'NODE'
const fs = require("fs");
const path = require("path");
const { uploadToImageHost } = require("./scripts/lib/image_host_upload.cjs");

(async () => {
  const title = "书名";
  const source = "https://img9.doubanio.com/view/subject/l/public/sxxxxx.jpg";
  const response = await fetch(source, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Referer": "https://book.douban.com/"
    }
  });
  if (!response.ok) throw new Error(`download failed ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 2000 || !(buffer[0] === 0xff && buffer[1] === 0xd8)) {
    throw new Error(`invalid image ${buffer.length}`);
  }
  const outDir = path.resolve("tmp/exact-covers");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${title}.jpg`);
  fs.writeFileSync(file, buffer);
  const cdnUrl = await uploadToImageHost(file);
  console.log(JSON.stringify({ title, source, file, cdnUrl }, null, 2));
})();
NODE
```

验证：

```bash
node --input-type=module <<'NODE'
const url = "https://img.aqifei.top/img/...";
const response = await fetch(url, { method: "HEAD" });
console.log(response.status, response.headers.get("content-type"), response.headers.get("content-length"));
NODE
```

如果封面错了，只修对应书的 `cover` 字段，然后用 `scripts/publish_book_to_d1.mjs --id <id> --remote` 同步远端 D1。不要重跑 `book:publish` 添加同名书。

## 发布新书

普通新书使用：

```bash
npm run book:publish -- \
  --title "书名" \
  --author "作者" \
  --category "分类" \
  --year "出版年" \
  --cover "https://img.aqifei.top/img/..." \
  --url "https://pan.quark.cn/s/a7450333781d" \
  --metadata-query "豆瓣精确检索词"
```

注意：

- 批量发布必须串行执行，不要并行写 D1。
- `--metadata-query` 应使用豆瓣可命中的书名或“书名 作者”。
- 有繁体书名时，优先使用豆瓣精确书名，避免书名和封面文字不一致。
- `book:publish` 会写入 `data/mockData.ts`，发布远端 D1，并尝试生产验证。
- 如果 D1 已写入，但最后验证出现 `fetch failed`，不要重跑同一条 `book:publish`。用新增 ID 直接验证或补发：

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/publish_book_to_d1.mjs --id <book-id> --remote
```

## SEO 回填

批量发布完成后执行一次：

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/backfill_seo_meta.mjs --remote
```

这会更新：

- `authors`
- `tags`
- `book_tags`

新增作者页和标签页依赖这一步。

## 真实书评

书评必须真实可核验。禁止生成或编造书评。

当前数据结构：

- D1 表：`book_reviews`
- 迁移：`db/migrations/0003_book_reviews.sql`
- 导入脚本：`scripts/import_book_reviews.mjs`
- 样例数据：`data/verifiedBookReviews.json`

详情页只在 `book.reviews.length > 0` 时展示“热门书评”。没有真实来源记录的书不展示书评模块。

每条书评数据必须包含：

- `bookId`
- `platform`，例如 `豆瓣读书`、`当当`、`京东读书`、`微信读书`、`得到电子书`
- `rating`，如果来源明确给出评分才填
- `date`，如果来源明确给出日期才填
- `content`，可使用短摘录或基于真实评论整理的摘要；不要搬运长篇全文
- `sourceUrl`
- `sortOrder`

导入：

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)" \
  node scripts/import_book_reviews.mjs --file data/verifiedBookReviews.json --remote
```

页面展示时匿名为“平台网友”，不展示真实用户 ID。不得把没有来源 URL 的内容写入 `book_reviews`。

## 生产验证

发布后必须验证生产站。

示例：

```bash
node --input-type=module <<'NODE'
const expected = [
  [1982, "北歐時間", "https://img.aqifei.top/img/2026/07/1785039662197-____.jpg"]
];
const download = "https://pan.quark.cn/s/a7450333781d";
const sitemap = await fetch("https://qifeibook.com/sitemap.xml").then((response) => response.text());

for (const [id, title, cover] of expected) {
  const detail = await fetch(`https://qifeibook.com/api/books/${id}?verify=${Date.now()}`).then((response) => response.json());
  const html = await fetch(`https://qifeibook.com/book/${id}?verify=${Date.now()}`, {
    headers: { "cache-control": "no-cache" }
  }).then((response) => response.text());
  const search = await fetch(`https://qifeibook.com/api/search?q=${encodeURIComponent(title)}`).then((response) => response.json());
  const coverHead = await fetch(cover, { method: "HEAD" });
  const ok =
    detail.id === id &&
    detail.title === title &&
    detail.cover === cover &&
    detail.downloadLinks?.[0]?.url === download &&
    html.includes(title) &&
    html.includes(cover) &&
    (search.books || []).some((book) => book.id === id) &&
    sitemap.includes(`/book/${id}`) &&
    coverHead.status === 200;
  console.log(JSON.stringify({ id, title, ok, coverStatus: coverHead.status }));
  if (!ok) process.exitCode = 1;
}
NODE
```

成功标准：

- 搜索 API 能找到新书 ID。
- `/api/books/:id` 返回正确标题、作者、封面、下载链接。
- `/book/:id` HTML 包含标题和封面 URL。
- 下载地址是统一夸克链接。
- 封面图床 URL 返回 `200 image/jpeg`。
- `/sitemap.xml` 包含 `/book/:id`。
- 真实书评只在有 `book_reviews` 记录时展示。

最后跑：

```bash
npm run typecheck
npm run lint
git diff --check
npm run seo:smoke -- --base https://qifeibook.com
```

## 常见故障

- 首页暂时看不到新书：先看搜索、详情 API、sitemap。首页可能受排序、分页或边缘缓存影响。
- 本地有书但线上没有：通常是还没发布到远端 D1。
- `fetch failed` 出现在 D1 写入之后：确认输出里已有 `Published book <id>`，然后按 ID 直接验证，不要重跑添加命令。
- 封面和书名不一致：使用豆瓣精确 subject 的 `pic` 重新下载、上传、只更新 cover 字段，再按 ID 发布。
- 豆瓣封面返回 418 或空文件：带 Referer 下载，或使用 `scripts/lib/douban_cover_fetcher.cjs` / 浏览器复制图片兜底。
- 书评来源不明确：不要展示，不要导入。
- 默认 `npm run seo:smoke` 打本地 `localhost:8787`；验证生产要加 `-- --base https://qifeibook.com`。

## Token 安全

不要要求用户在聊天里粘贴 Cloudflare token。优先从 macOS Keychain 读取：

```bash
CLOUDFLARE_API_TOKEN="$(security find-generic-password -a qifeibook -s qifeibook-cloudflare-api-token -w)"
```

如果 token 已经出现在聊天、issue 或日志中，应提醒用户撤销并重建。
