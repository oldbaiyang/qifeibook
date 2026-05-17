# 棋飞书库 Cloudflare 重构开发计划

> 历史文档：本文记录从旧 Next.js / Vercel 静态站迁移到 Cloudflare Worker + D1 的计划与过程。迁移已经完成，且旧 Next.js / React / Vercel 代码路径已在 2026-05-17 的生产路径清理中删除。本文后续出现的旧文件路径和旧命令只作为背景，不代表当前项目结构。

## 当前进度更新

更新时间：2026-05-17

当前项目已完成 Cloudflare Workers + D1 的生产切换，历史 Next.js / React / Vercel 路径已删除。生产域名 `qifeibook.com`、`www.qifeibook.com` 已绑定 Cloudflare Worker，D1 `database_id` 为 `85829f2e-86fb-40d8-8b32-f9db64e56c00`。

已落地内容：

- 阶段 0：工程基线收敛已完成，已补充 `typecheck`、Cloudflare 与 D1 脚本。
- 阶段 1：数据访问边界已建立，列表与详情 DTO 已拆分。
- 阶段 2：D1 schema、migration、SQL 导出和本地初始化脚本已建立。
- 阶段 3：Worker API 已实现，包括 `/api/home`、`/api/books`、`/api/books/:id`、`/api/categories`、`/api/category/:slug`、`/api/search`。
- 阶段 4：SEO 关键路由已由 Worker 直出，包括 `/`、`/search`、`/book/:id`、`/category/:slug`、`/sitemap.xml`、`/robots.txt`。
- 阶段 5：首页已改为首屏 20 本 + `/api/books` 游标分页加载，浏览器不再依赖整库数据渲染首页。
- 阶段 7：生产域名已切换到 Cloudflare，`www` 域名已跳转到主域名。
- 阶段 8：生产路径精简已完成，仓库只保留 Worker + D1 + Workers Assets 相关生产代码。

仍建议继续推进：

- 阶段 6 的搜索排序、缓存策略、性能验证。
- Worker API / HTML 输出的自动化测试。
- 10 万本规模下的 sitemap 分页和 D1 查询压力验证。

详细现状见 [当前开发总结](./current-development-summary.md)。

## 1. 背景

当前项目是基于 Next.js App Router 的静态电子书目录站，书籍数据直接存放在 [data/mockData.ts](/Users/zcy/dev/github/qifeibook/data/mockData.ts:1) 中，并由页面和客户端组件直接导入使用。

现状在小规模数据下可工作，但当书籍规模向 10 万本增长时，会出现以下结构性问题：

- 书籍元数据无法继续以单个 TypeScript 文件承载。
- 首页、搜索页、分类页存在将全量数据发送到前端的趋势。
- Vercel Hobby 路线不适合 10 万详情页的长期扩展。
- 当前代码对数据层、渲染层、部署层耦合较强，无法平滑迁移到新的运行时。
- 当前工程基线不稳定，`lint/build` 链路需要先修复后才能安全重构。

本计划的目标是将项目重构为：

- Cloudflare Workers 负责动态路由和 API
- Cloudflare D1 负责目录数据存储与搜索
- 静态前端壳子负责基础 UI、静态资源和非 SEO 关键页面
- 详情页、分类页、站点地图等 SEO 关键路由由 Worker 直出 HTML

## 2. 重构目标

### 2.1 业务目标

- 支持 10 万本书的目录规模。
- 保留现有内容站 SEO 能力。
- 保留首页、详情页、分类页、搜索页的核心体验。
- 保持书籍同步流程可继续演进，后续仍可从飞书或脚本导入。
- 控制平台成本，优先使用 Cloudflare 免费额度。

### 2.2 技术目标

- 去除前端对 `mockData.ts` 的直接运行时依赖。
- 建立明确的数据访问层和路由层边界。
- 将列表、详情、搜索改为数据库驱动。
- 用分页、索引和缓存保证读取成本和响应速度。
- 建立稳定的 `lint -> typecheck -> build -> deploy` 流程。

### 2.3 非目标

- 本次重构不处理电子书文件本体托管。
- 本次重构不引入用户系统、评论系统、收藏系统。
- 本次重构不追求一次性替换所有内容生产脚本。
- 本次重构不强制保留 Next.js 作为最终前端框架。

## 3. 当前系统问题清单

### 3.1 数据层问题

- [data/mockData.ts](/Users/zcy/dev/github/qifeibook/data/mockData.ts:1) 既是数据模型又是数据库，缺少存储边界。
- 书籍字段未分层，列表页和详情页共享同一份重数据结构。
- `downloadLinks`、`authorDetail`、`description` 等详情字段对列表场景过重。
- 分类统计由客户端现算，见 [components/Header.tsx](/Users/zcy/dev/github/qifeibook/components/Header.tsx:1)。

### 3.2 渲染层问题

- 首页和搜索页存在将整库数据带到浏览器的趋势。
- [app/search/SearchContent.tsx](/Users/zcy/dev/github/qifeibook/app/search/SearchContent.tsx:1) 为客户端全量搜索，不适合大体量目录。
- [components/BookList.tsx](/Users/zcy/dev/github/qifeibook/components/BookList.tsx:1) 的无限加载基于本地数组切片，不适合数据库分页。
- 详情页相关推荐依赖随机排序，见 [app/book/[id]/page.tsx](/Users/zcy/dev/github/qifeibook/app/book/[id]/page.tsx:77)。

### 3.3 工程问题

- 当前存在多套 ESLint 配置。
- `.gitignore` 不完整，导致临时目录和缓存进入工作区。
- 缺少正式的类型检查命令和重构期验证脚本。
- README 仍是默认 Next 模板，不适合作为后续项目基线。

### 3.4 部署问题

- 当前架构默认绑定 Vercel 习惯，不适合 Cloudflare 目标部署形态。
- 大量静态详情页不是 10 万本规模下的长期可持续路径。
- 搜索和 SEO 页面尚未设计为 Cloudflare 原生路由模式。

## 4. 目标系统概览

目标系统由四个部分组成：

- 数据导入链路：从现有脚本或飞书导出元数据，生成标准化 SQL 或 JSON 批数据。
- D1 数据库：承载书籍、分类、下载链接、搜索索引。
- Worker 服务层：提供 HTML 路由、JSON API、站点地图、缓存控制。
- 静态前端壳子：提供 UI 框架、静态资源、非 SEO 关键交互页。

## 5. 分阶段开发计划

## 阶段 0：工程基线收敛

### 目标

- 在不改变现网行为的情况下清理工程环境。

### 任务

- 保留唯一 ESLint 配置。
- 修复 `.gitignore`。
- 补充 `npm run typecheck`。
- 确认 `npm run lint`、`npm run build` 可稳定执行。
- 将 README 替换为真实项目说明。
- 建立 `docs/` 目录，纳入架构和实施文档。

### 交付物

- 稳定的本地验证命令。
- 清晰的仓库基线文档。

### 完成标准

- 重构分支上 `lint/typecheck/build` 可连续执行成功。

## 阶段 1：数据层抽象

### 目标

- 把页面与 `mockData.ts` 解耦，为数据库迁移铺路。

### 任务

- 新建数据访问层，例如 `lib/data-access/`。
- 抽象统一接口：
  - `getHomeBooks`
  - `getBookById`
  - `getBooksByCategory`
  - `getCategoryStats`
  - `searchBooks`
- 将页面和组件改为依赖接口而非静态文件。
- 定义 `BookSummary`、`BookDetail`、`CategorySummary` 等类型。

### 交付物

- 统一数据访问接口。
- 列表页和详情页的轻重字段分层。

### 完成标准

- 页面代码中不再直接 import `books` 常量，允许仅保留迁移适配层内部使用。

## 阶段 2：数据库设计与导入链路

### 目标

- 在 Cloudflare D1 中建立正式数据模型，并支持从当前数据源导入。

### 任务

- 新建 `wrangler` 配置和 D1 数据库。
- 编写建表 migration。
- 编写从 `mockData.ts` 到 SQL/SQLite 的导出脚本。
- 编写本地 D1 导入与校验脚本。
- 为书籍、分类、下载链接、FTS 建立索引。

### 交付物

- `migrations/` SQL 文件。
- `scripts/export_books_to_sql.ts` 或等价脚本。
- 本地可重复初始化 D1 的命令文档。

### 完成标准

- 本地 D1 可导入现有数据，并能完成基础列表/详情查询。

## 阶段 3：Worker API 最小可用版本

### 目标

- 先建立 API，再替换前端消费方式。

### 任务

- 创建 Worker 项目入口。
- 实现以下最小 API：
  - `GET /api/books`
  - `GET /api/books/:id`
  - `GET /api/categories`
  - `GET /api/category/:slug`
  - `GET /api/search`
- 设计统一响应格式。
- 加入基础缓存头和错误处理。

### 交付物

- 本地可运行的 Worker API。
- 基本数据查询测试用例。

### 完成标准

- 当前前端可通过 API 获取首页、详情和分类数据。

## 阶段 4：SEO 关键路由迁移

### 目标

- 用 Worker 直出 HTML 保留内容站 SEO 能力。

### 任务

- 实现 `/book/:id` HTML 渲染。
- 实现 `/category/:slug` HTML 渲染。
- 实现 `/sitemap.xml` 动态生成。
- 输出 title、description、canonical、OpenGraph、JSON-LD。
- 设计 404 和错误页输出。

### 交付物

- Worker HTML 模板渲染层。
- 详情页和分类页的 SEO 输出实现。

### 完成标准

- 详情页和分类页在关闭 JS 的情况下仍可访问核心内容。

## 阶段 5：静态前端壳子改造

### 目标

- 前端只负责壳子和交互，不再承载整库数据。

### 任务

- 评估保留 Next 静态输出还是迁到 Vite。
- 实现首页、搜索页、通用布局的静态化。
- 改造 `BookList` 为游标分页模式。
- 改造 `Header` 为服务端注入分类摘要或 API 拉取。
- 将 Breadcrumb、Footer 等纯展示组件尽量转为静态渲染。

### 交付物

- 静态 `dist/` 输出物。
- 对接 Worker API 的前端壳子。

### 完成标准

- 浏览器首包不再包含整库书籍数据。

## 阶段 6：搜索、缓存与性能优化

### 目标

- 在 10 万本规模下保持可接受的搜索和列表性能。

### 任务

- 用 D1 FTS5 实现搜索索引。
- 搜索结果采用分页和最小字段返回。
- 热门详情页和分类页加入 Cloudflare Cache。
- 为列表 API 设计短缓存和 `stale-while-revalidate` 策略。
- 优化站点地图分页生成。

### 交付物

- 可用的全文检索能力。
- 可落地的缓存规则说明。

### 完成标准

- 常见查询不出现全表扫描。
- 列表和详情接口在预期数据量下可保持稳定响应。

## 阶段 7：灰度切换与收尾

### 目标

- 平滑替换现网部署，降低迁移风险。

### 任务

- 设计新旧环境对照检查表。
- 上线前抓取关键 URL 做 HTML 对比。
- 校验 sitemap、canonical、metadata、结构化数据。
- 配置 Cloudflare 自定义域名、缓存规则、路由规则。
- 逐步切换流量。
- 下线旧的 Vercel 生产路由。

### 交付物

- 上线清单。
- 回滚方案。

### 完成标准

- 切流后关键页面可访问，搜索引擎关键元信息保持完整。

## 6. 任务分解与依赖关系

### 6.1 必须先完成的事项

- 阶段 0 必须先于所有功能重构。
- 阶段 1 必须先于数据库与 API 重构。
- 阶段 2 必须先于阶段 3 和阶段 4。

### 6.2 可以并行推进的事项

- 阶段 2 的数据库设计与阶段 5 的前端壳子梳理可以并行。
- 阶段 3 的 API 层与阶段 4 的 HTML 模板层可以并行。
- 阶段 6 的缓存与性能压测可在阶段 4 和阶段 5 完成后集中开展。

## 7. 里程碑建议

### 里程碑 M1：可迁移基线

- 完成阶段 0 和阶段 1。
- 当前应用仍能跑。
- 数据访问边界已建立。

### 里程碑 M2：数据进入 D1

- 完成阶段 2。
- 本地 D1 可重复初始化。
- 有脚本可从旧数据导入新库。

### 里程碑 M3：API 驱动运行

- 完成阶段 3。
- 首页、详情、分类、搜索不再依赖本地全量数据。

### 里程碑 M4：SEO 路由可运行

- 完成阶段 4。
- Worker 直出详情页、分类页、站点地图。

### 里程碑 M5：Cloudflare 生产就绪

- 完成阶段 5、阶段 6、阶段 7。
- 新架构具备生产切换条件。

## 8. 测试策略

### 8.1 自动化测试

- 数据访问层单元测试。
- SQL migration 与种子导入校验。
- Worker API 集成测试。
- 关键 HTML 输出快照测试。

### 8.2 手工验证

- 首页、详情页、分类页、搜索页访问。
- 中文分类 slug 与 URL 编码。
- 下载链接渲染正确性。
- meta 标签与 JSON-LD 输出。
- sitemap 条目数量与分页。

### 8.3 性能验证

- 1 万本、5 万本、10 万本模拟数据查询测试。
- 搜索接口查询延迟监测。
- 热门页缓存命中率抽样验证。

## 9. 风险与应对

### 风险 1：前端与数据库边界没有真正切开

- 影响：迁移中途会反复回退到静态文件依赖。
- 对策：阶段 1 完成前不启动后续大规模页面改造。

### 风险 2：D1 查询设计不当导致免费额度消耗过快

- 影响：高频接口被行读取数拖垮。
- 对策：所有列表都使用索引和游标分页，避免深分页和全表计数。

### 风险 3：SEO 输出在迁移后退化

- 影响：搜索引擎收录和自然流量下滑。
- 对策：Worker 直出详情页与分类页，保留结构化数据和 sitemap。

### 风险 4：旧脚本数据质量不稳定

- 影响：数据库导入后出现脏数据、重复分类、字段缺失。
- 对策：导入脚本加入标准化步骤和校验报告。

### 风险 5：前端壳子迁移成本超预期

- 影响：重构周期拉长。
- 对策：先 API 化，再决定是否迁出 Next。

## 10. 人日估算建议

以下为单人主导情况下的保守估算：

- 阶段 0：1 到 2 天
- 阶段 1：2 到 4 天
- 阶段 2：2 到 4 天
- 阶段 3：3 到 5 天
- 阶段 4：3 到 5 天
- 阶段 5：3 到 6 天
- 阶段 6：2 到 4 天
- 阶段 7：1 到 2 天

整体建议预留：17 到 32 天。

如果优先追求最小可上线版本，可先做：

- 阶段 0
- 阶段 1
- 阶段 2
- 阶段 3
- 阶段 4 的详情页、分类页、sitemap 最小实现

这样通常能在 10 到 16 天内做出可灰度验证的版本。

## 11. 上线原则

- 不做一次性 Big Bang 切换。
- 先本地跑通，再预发，再灰度。
- 先切非核心页面，再切核心 SEO 页面。
- 任意阶段都要保留可回滚路径。

## 12. 第一阶段立即执行清单

建议下一步直接执行下面 8 项：

- 修复 ESLint 配置冲突。
- 修复 `.gitignore`。
- 新建 `docs/` 文档目录。
- 新建 `lib/data-access/` 数据访问层目录。
- 定义 `BookSummary`、`BookDetail`、`CategorySummary` 类型。
- 将首页、详情页、分类页改为依赖数据访问函数。
- 引入 `wrangler`。
- 起草 D1 schema 和 migration 初稿。
