# 棋飞书库自动化脚本文档

本文档只记录当前仍保留并维护的项目脚本。线上站点读取 Cloudflare D1，不以旧 Next.js 静态站或飞书同步脚本作为生产发布路径。

## 核心原则

- 生产架构：Cloudflare Worker + D1 + Workers Assets。
- 本地数据源：`data/mockData.ts` 只作为导入源和 Git 记录。
- 生产发布：必须通过 `scripts/publish_book_to_d1.mjs` 写入远程 D1。
- 封面上传：默认使用全局 `image-host-upload` skill，不依赖 PicList/PicGo。
- Token 安全：不要把 `CLOUDFLARE_API_TOKEN` 写入文档、提交或聊天；泄露后立即撤销并重建。

## 新书发布

完整流程见 [docs/new-book-publishing.md](./docs/new-book-publishing.md)。

常用命令：

```bash
# 检查图床配置
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs --check

# 上传封面
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs /absolute/path/to/cover.jpg --json

# 预览 D1 SQL
node scripts/publish_book_to_d1.mjs --id <book-id> --dry-run

# 写入远程 D1
CLOUDFLARE_API_TOKEN=... node scripts/publish_book_to_d1.mjs --id <book-id> --remote

# 线上验证
curl -sS 'https://qifeibook.com/api/search?q=书名'
curl -sS 'https://qifeibook.com/api/books/<book-id>'
curl -sS 'https://qifeibook.com/book/<book-id>' | rg '书名|Book|og:image'
```

## 当前保留脚本

| 脚本 | 用途 |
| --- | --- |
| `scripts/run_wrangler_local.mjs` | 通过本地依赖运行 Wrangler，避免全局版本差异 |
| `scripts/setup_local_d1.mjs` | 初始化本地 D1 |
| `scripts/export_books_to_sql.mjs` | 从 `data/mockData.ts` 导出 D1 seed SQL |
| `scripts/publish_book_to_d1.mjs` | 将单本本地书籍记录发布到本地或远程 D1 |
| `scripts/seo_keywords.mjs` | 关键词和标签派生规则 |
| `scripts/generate_keyword_backfill_sql.mjs` | 生成关键词回填 SQL |
| `scripts/seo_smoke_check.mjs` | 检查 Worker SEO HTML/XML 路由 |
| `scripts/report_data_quality.mjs` | 检查 API 数据质量和关键词覆盖 |
| `scripts/push-baidu.js` | 百度普通推送 |
| `scripts/push-baidu-priority.js` | 百度优先推送 |
| `scripts/scrape_douban.cjs` | 按书名采集单本豆瓣信息和封面 |
| `scripts/scrape_douban_list.cjs` | 采集豆瓣列表中的多本书 |
| `scripts/lib/image_host_upload.cjs` | 项目级图床上传封装，调用全局 `image-host-upload` |
| `scripts/lib/douban_cover_fetcher.cjs` | 豆瓣封面抓取辅助 |

## D1 与 SEO

```bash
npm run db:export-sql
npm run db:setup:local
npm run db:migrate:local
npm run db:seed:local
npm run seo:smoke
npm run seo:data-quality
npm run seo:keyword-backfill
```

`db/seed/*.sql` 是生成物，已被 `.gitignore` 忽略。需要更新 seed 或关键词回填时重新运行脚本，不要手工编辑生成 SQL。

## 豆瓣采集

单本采集：

```bash
FEISHU_APP_ID=... FEISHU_APP_SECRET=... FEISHU_WIKI_TOKEN=... FEISHU_SHEET_ID=... \
node scripts/scrape_douban.cjs "书名"
```

列表采集：

```bash
FEISHU_APP_ID=... FEISHU_APP_SECRET=... FEISHU_WIKI_TOKEN=... FEISHU_SHEET_ID=... \
node scripts/scrape_douban_list.cjs "https://www.douban.com/doulist/1264675/"
FEISHU_APP_ID=... FEISHU_APP_SECRET=... FEISHU_WIKI_TOKEN=... FEISHU_SHEET_ID=... \
node scripts/scrape_douban_list.cjs "https://www.douban.com/doulist/1264675/" 10
```

采集脚本会通过 `scripts/lib/image_host_upload.cjs` 上传封面。不要把豆瓣 CDN 地址作为最终封面写入书籍数据。

飞书凭据必须通过环境变量传入，不要写入脚本、文档或提交。

## 图床上传

当前项目默认使用全局 `image-host-upload` skill。

项目脚本统一调用：

```js
const { uploadToImageHost } = require("./lib/image_host_upload.cjs");
```

手动检查配置：

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs --check
```

手动上传图片：

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs /absolute/path/to/cover.png --json
```

配置文件优先使用全局路径 `/Users/zcy/.codex/image-host-upload.env`，也可以在项目 `.env` 中覆盖。需要的键包括 `S3_ACCESS_KEY_ID`、`S3_SECRET_ACCESS_KEY`、`S3_BUCKET`、`S3_ENDPOINT`、`S3_PUBLIC_BASE_URL`。

## 验证清单

生产路径改动完成后至少执行：

```bash
npm run typecheck
npm run lint
node scripts/publish_book_to_d1.mjs --id 1010 --dry-run
node scripts/run_wrangler_local.mjs --version
```

涉及 Worker 路由、SEO 或数据时再执行：

```bash
npm run seo:smoke
npm run seo:data-quality
curl -sS https://qifeibook.com/api/health
curl -sS 'https://qifeibook.com/api/search?q=瓦尔登湖'
curl -sS https://qifeibook.com/book/1010 | rg '瓦尔登湖|Book|og:image'
```
