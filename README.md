# 棋飞书库

棋飞书库是一个电子书目录和下载导航站。当前生产架构已经收敛为 `Cloudflare Workers + Cloudflare D1 + Workers Assets`：Worker 负责 HTML/JSON 路由，D1 负责书籍、分类、下载链接和搜索数据，`public/` 中的静态文件由 Workers Assets 提供。

旧的 Next.js / React / Vercel 前端路径已删除，不再提供 `npm run dev`、`npm run build` 或 `npm start`。

## 当前技术栈

- Cloudflare Workers
- Cloudflare D1
- Cloudflare Workers Assets
- TypeScript
- ESLint
- Playwright，用于豆瓣信息和封面采集脚本

## 常用命令

```bash
npm run typecheck
npm run lint
npm run cf:version
npm run cf:dev
npm run cf:deploy
```

D1 与数据维护：

```bash
npm run db:export-sql
npm run db:setup:local
npm run db:migrate:local
npm run db:seed:local
```

SEO 与数据质量：

```bash
npm run seo:smoke
npm run seo:data-quality
npm run site:regression
npm run seo:keyword-backfill
```

新书发布：

```bash
node scripts/publish_book_to_d1.mjs --id <book-id> --dry-run
CLOUDFLARE_API_TOKEN=... node scripts/publish_book_to_d1.mjs --id <book-id> --remote
```

豆瓣采集脚本如需写入飞书，必须通过环境变量提供 `FEISHU_APP_ID`、`FEISHU_APP_SECRET`、`FEISHU_WIKI_TOKEN`、`FEISHU_SHEET_ID`，不要把凭据写入仓库。

## 当前目录说明

- `worker/`：Cloudflare Worker 入口、路由、D1 查询、HTML 模板和工具函数
- `db/migrations/`：Cloudflare D1 schema migration
- `lib/data-access/`：Worker 和脚本共享的数据访问类型
- `lib/utils.ts`：Worker HTML 使用的 JSON-LD 和 SEO 辅助函数
- `data/mockData.ts`：本地导入源和 Git 数据记录，不是生产运行时数据库
- `scripts/`：D1 导出、单书发布、SEO 校验、百度推送、豆瓣采集和图床上传封装
- `public/`：Workers Assets 静态文件
- `docs/`：当前架构、发布流程和历史重构设计文档

## 生产信息

- 主域名：`https://qifeibook.com`
- `https://www.qifeibook.com` 会跳转到主域名
- Workers Dev：`https://qifeibook.richard356929.workers.dev`
- D1 database_id：`85829f2e-86fb-40d8-8b32-f9db64e56c00`

生产页面和 API 都读取 D1。只修改 `data/mockData.ts` 不会让线上出现新书，必须继续执行 `scripts/publish_book_to_d1.mjs --remote`。

## 当前生产能力摘要

- 搜索使用 D1 FTS，并对特殊字符、单字词和 FTS 异常提供 `LIKE` 兜底，避免用户输入导致 500。
- 分类页会合并常见别名和错别字分类，例如 `心理力志` 会 301 到 `心理励志`。
- 首页首屏卡片、下拉加载、分页入口和 SEO pagination 同时保留；缺失年份的图书不再显示 `-`。
- 全站 head 包含 favicon、Apple touch icon、web manifest、图床 preconnect，以及 AdSense 发布商脚本。
- `npm run site:regression` 会检查线上关键回归点，包括搜索特殊字符、图标/manifest、AdSense、分类重定向和缺失年份展示。

## 文档

- [当前开发总结](./docs/current-development-summary.md)
- [新书发布流程](./docs/new-book-publishing.md)
- [自动化脚本文档](./SKILLS.md)
- [Cloudflare 重构开发计划](./docs/cloudflare-refactor-plan.md)，历史背景
- [Cloudflare 重构详细设计](./docs/cloudflare-refactor-design.md)，历史背景

## 后续方向

- 为 Worker API 和 HTML 输出补充集成测试。
- 完善 D1 导入后的数据质量校验。
- 优化搜索排序与分页体验。
- 按 10 万本规模拆分 sitemap。
- 完善缓存策略和线上观测。
