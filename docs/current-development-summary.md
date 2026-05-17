# 当前开发总结

更新时间：2026-05-17

## 1. 当前线上架构

棋飞书库当前生产路径已经收敛为 Cloudflare 方案：

- 运行时：Cloudflare Workers
- 数据库：Cloudflare D1
- 静态资源：Cloudflare Workers Assets，目录为 `public/`
- 生产域名：
  - `https://qifeibook.com`
  - `https://www.qifeibook.com`，会 301 跳转到主域名
- Workers Dev 地址：`https://qifeibook.richard356929.workers.dev`
- D1 database_id：`85829f2e-86fb-40d8-8b32-f9db64e56c00`

历史 Next.js / React / Vercel 代码路径已删除。当前仓库不再提供 Next 本地开发、构建或 Vercel 部署能力。

### 1.1 2026-05-17 生产路径精简记录

本次清理将仓库基线收敛到当前真实生产路径：

- 删除历史 `app/`、`components/`、`legacy_backup/`、`next.config.ts`、`postcss.config.mjs`、`vercel.json`、`public/_redirects` 和旧前端默认图标。
- 移除 Next.js、React、Tailwind、lucide、Vercel 相关依赖和 `dev/build/start` 命令。
- `tsconfig.json` 只覆盖 Worker、共享类型和项目 TypeScript 文件。
- `eslint.config.mjs` 改为普通 JS/TS 项目配置，使用 `typescript-eslint`。
- 删除旧前端辅助 `lib/constants.ts`、`lib/styles.ts`、`lib/worker-api-proxy.ts`。
- 删除一次性书籍添加、旧 Feishu 同步、旧 PicList/PicGo 封面修复、Z-Lib/Telegram/kgbook/当当等临时脚本。
- 保留当前维护脚本：D1 导出和发布、SEO 检查、数据质量、百度推送、豆瓣采集、`image-host-upload` 图床封装。
- 豆瓣采集脚本不再保存 Feishu 明文凭据，运行时通过 `FEISHU_APP_ID`、`FEISHU_APP_SECRET`、`FEISHU_WIKI_TOKEN`、`FEISHU_SHEET_ID` 注入。

本次清理后的验证基线：

```bash
npm install
npm run typecheck
npm run lint
npm run seo:smoke
npm run seo:data-quality
node scripts/publish_book_to_d1.mjs --id 1010 --dry-run
node scripts/run_wrangler_local.mjs --version
```

`seo:data-quality` 当前仍会报告既有数据质量项，例如个别空封面、空下载链接和重复书名作者组合；这些是数据修复事项，不影响本次生产路径清理。

## 2. 已完成的重构内容

### 2.1 Cloudflare Worker 路由

Worker 入口位于 `worker/index.ts`，路由分发位于 `worker/routes.ts`。

已实现的 HTML 路由：

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

已实现的 API 路由：

- `GET /api/health`
- `GET /api/home`
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/categories`
- `GET /api/category/:slug`
- `GET /api/search`

HTML 页面由 `worker/templates.ts` 直出，保留 SEO 所需的 title、description、canonical、OpenGraph、Twitter Card、JSON-LD 与面包屑结构。

### 2.2 D1 数据库与数据导入

已建立 D1 schema，migration 位于 `db/migrations/0001_init.sql`。

当前表结构包括：

- `books`
- `categories`
- `download_links`
- `books_fts`

已建立的关键索引包括：

- `idx_categories_slug`
- `idx_books_category_id_id`
- `idx_books_id_desc`
- `idx_books_slug`
- `idx_download_links_book_id`

已有脚本支持从现有书籍数据导出 SQL 并初始化本地 D1：

- `npm run db:export-sql`
- `npm run db:setup:local`
- `npm run db:migrate:local`
- `npm run db:seed:local`
- `node scripts/publish_book_to_d1.mjs --id <book-id> --dry-run`

SEO 与数据质量脚本：

- `npm run seo:smoke`
- `npm run seo:data-quality`
- `npm run seo:keyword-backfill`

关键词与标签页数据说明：

- `scripts/seo_keywords.mjs` 定义了分类与内容关键词的派生规则。
- `scripts/export_books_to_sql.mjs` 已接入关键词派生逻辑，导出的 `books.keywords_json` 和 `books_fts.keywords` 会带上派生关键词。
- `scripts/generate_keyword_backfill_sql.mjs` 会生成本地事务版与远程 D1 安全版关键词回填 SQL。
- `db/seed/*.sql` 为生成产物，已被 `.gitignore` 忽略，需要时通过脚本重新生成。

### 2.3 数据访问层

已新增 `lib/data-access/`，用于统一类型和数据访问边界。

Worker 侧数据库查询集中在 `worker/db.ts`，主要能力包括：

- 首页图书列表
- 游标分页图书列表
- 书籍详情
- 分类列表
- 分类页图书列表
- 搜索
- sitemap 数据

列表场景使用轻量字段，详情场景再读取作者简介、内容简介、下载链接等完整字段，避免把详情重字段带入首页。

## 3. 已完成的页面与交互优化

### 3.1 首页

首页现在由 Worker 直出首屏 HTML，并使用 `/api/books` 做下拉分页加载。

当前行为：

- 首页首屏展示最新 20 本书。
- 用户下拉到底部时自动加载下一批 20 本。
- 图书列表使用卡片布局。
- 热门分类首屏只展示 8 个分类，剩余分类放入“展开全部分类”。
- 首页标题栏已压缩高度，移除了多余的装饰性徽标、统计胶囊、搜索标题和搜索提示文案。
- 搜索框保留在首页头部，支持书名、作者、关键词搜索。

### 3.2 书籍详情页

详情页已经重新设计为更适合阅读和下载的结构。

当前布局：

- 左侧为书籍信息卡，包括封面、作者、分类、格式、出版年、下载源数量等。
- 右侧内容顺序为：
  - 作者简介
  - 内容简介
  - 下载地址
  - 相关推荐

已完成的细节优化：

- 作者简介放在内容简介上方。
- 下载地址放在内容简介下方。
- 内容简介支持“展开完整简介 / 收起简介”。
- 展开后的内容与预览文本保持在同一段中连续显示，不再拆成两段。
- 下载区移除了多余说明、推荐标签、provider 标签、格式和年份标签。
- 下载区保留核心信息：网盘名称、提取码、前往下载、复制提取码。

### 3.3 SEO 与基础可访问性

当前 Worker HTML 输出保留：

- 动态 title
- meta description
- canonical
- OpenGraph
- Twitter Card
- Book JSON-LD
- Breadcrumb JSON-LD
- ItemList JSON-LD
- sitemap
- robots.txt

搜索输入在移除可见 label 后，保留了 `aria-label`。

已完成的 SEO 结构优化：

- `/search` canonical 修正为 `/search`，并输出 `noindex,follow`。
- 首页、分类、作者、标签等列表页输出 ItemList JSON-LD。
- 图书详情页保留 Book JSON-LD 和 Breadcrumb JSON-LD，并增强图片、简介、格式等字段。
- 已新增 crawlable pagination：`/page/:page`、`/category/:slug/page/:page`。
- 已新增作者页：`/author/:name`、`/author/:name/page/:page`。
- 作者页索引策略：至少 2 本书才 `index,follow`；泛作者名如 `佚名`、`匿名`、`未知`、`多人` 以及纯国家/标签括号名如 `[美]` 不进入可索引 sitemap。
- 已新增标签页：`/tag/:name`、`/tag/:name/page/:page`。
- 标签页索引策略：至少 3 本书且名称有效才进入 sitemap；薄标签页可渲染但输出 `noindex,follow`。
- 图书详情页关键词会渲染为可点击标签链接。

当前 sitemap 策略：

- `/sitemap.xml` 为 flat `urlset`，用于 Google Search Console 兼容提交。
- `/sitemap-index.xml` 保留 split sitemap index。
- 子 sitemap 包括 `/sitemaps/static.xml`、`/sitemaps/categories.xml`、`/sitemaps/authors.xml`、`/sitemaps/tags.xml`、`/sitemaps/books-1.xml`。
- `robots.txt` 指向 `https://qifeibook.com/sitemap.xml`。

## 4. 当前部署与验证流程

常用验证命令：

```bash
npm run typecheck
npm run lint
npm run seo:smoke
```

Cloudflare 部署命令：

```bash
npm run cf:deploy
```

最近一次已验证通过的 Worker 部署：

- Cloudflare Worker Version ID：`7ee2260d-4a42-45b5-8939-b4f5c65713fe`
- 验证内容：首页、详情页、搜索页、分页、作者页、标签页、sitemap、robots.txt 均已按 Worker SEO 输出生效。

最近一次已验证通过的远程 D1 数据更新：

- 日期：2026-04-30
- 执行内容：远程 D1 关键词回填，SQL 来源为 `db/seed/keywords_backfill.remote.sql`。
- 执行结果：610 条查询成功，写入 609 行。
- D1 bookmark：`0000006b-00000036-0000505c-350fd5610c32dfaef31dfb7cd8c7f8c2`
- 生产验证：`https://qifeibook.com/sitemap.xml` 当前包含 768 个 `<loc>` URL，并包含标签 URL。
- 生产验证：`https://qifeibook.com/tag/网络小说` 输出 `index,follow`、canonical 正确，并展示 361 本相关书籍。

## 5. 当前注意事项

- `data/mockData.ts` 仍保留为历史数据源和导入来源，不应再作为线上页面运行时数据库使用。
- 线上页面当前以 Worker + D1 为准。
- 继续开发时，优先修改 `worker/`、`lib/data-access/`、`db/` 和相关脚本。
- 不要恢复已删除的 Next.js / React / Tailwind / Vercel 路径；如需新前端，应作为新的架构决策单独评估。
- 新书发布以 `docs/new-book-publishing.md` 为准，封面上传使用全局 `image-host-upload`。
- 对外页面的结构性改动应同时检查 SEO HTML 输出。
- 部署前至少执行 `npm run typecheck` 和 `npm run lint`。
- 涉及 SEO 路由时同步执行 `npm run seo:smoke`。
- 涉及关键词、标签或导入数据时同步执行 `npm run seo:data-quality`。

## 6. 后续建议

优先级较高的后续工作：

- 增加 Worker API / HTML 输出的最小集成测试。
- 继续扩展 D1 导入脚本的数据校验报告。
- 优化搜索排序，区分标题精确命中、作者命中和描述命中。
- sitemap 后续按 10 万本规模拆分页。
- 为热门详情页、分类页制定更明确的缓存策略和线上观测方式。
