# 新书发布流程

本文档是棋飞书库发布单本新书的标准流程。当前生产站以 Cloudflare Worker + D1 为准，`data/mockData.ts` 只是本地数据源和 Git 记录，不会自动让线上显示新书。

## 输入清单

发布前至少准备：

- 书名
- 下载地址和提取码
- 作者
- 作者简介
- 内容简介
- 分类
- 出版年、格式
- 封面图床 URL
- SEO 关键词

用户只提供书名和下载地址时，先补全作者、简介、分类、关键词，再发布。补全内容要适合详情页 SEO，不要只写一句话。

## 封面处理

封面不要直接保存豆瓣 CDN 地址。豆瓣图片可能在浏览器里返回 `HTTP 418` 或被防盗链拦截。

标准做法：

1. 从浏览器、豆瓣详情页、带 Referer 的下载、截图或用户提供文件中拿到真实图片文件。
2. 使用全局 `image-host-upload` 上传到图床。
3. 只把图床 URL 写入项目数据和 D1。

检查图床配置：

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs --check
```

上传本地图片：

```bash
node /Users/zcy/.codex/skills/image-host-upload/scripts/upload-image.mjs /absolute/path/to/cover.jpg --json
```

项目脚本调用统一入口：

```js
const { uploadToImageHost } = require("./scripts/lib/image_host_upload.cjs");
```

## 本地数据

把新书追加到 `data/mockData.ts` 的 `books` 数组顶部。字段示例：

```ts
{
  "id": 1010,
  "title": "瓦尔登湖",
  "author": "亨利·戴维·梭罗",
  "authorDetail": "作者简介...",
  "year": "1854",
  "cover": "https://img.aqifei.top/img/2026/05/walden-cover.jpg",
  "description": "内容简介...",
  "category": "外国文学",
  "downloadLinks": [
    {
      "name": "百度网盘",
      "url": "https://pan.baidu.com/s/xxx?pwd=0000",
      "code": "0000"
    }
  ],
  "size": "",
  "format": "epub",
  "publishYear": "1854",
  "keywords": ["书名", "作者", "分类", "主题词"]
}
```

注意：

- ID 不要和现有书重复。
- 分类名要复用现有分类，除非确实需要新增。
- `keywords` 会影响标签页和搜索召回，至少包括书名、作者、分类、主题词。

## 发布到 Cloudflare D1

生产站读取 D1。修改 `data/mockData.ts` 后，还必须写入远程 D1。

推荐使用单书发布脚本：

```bash
CLOUDFLARE_API_TOKEN=... node scripts/publish_book_to_d1.mjs --id 1010 --remote
```

或按标题发布：

```bash
CLOUDFLARE_API_TOKEN=... node scripts/publish_book_to_d1.mjs --title "瓦尔登湖" --remote
```

先查看将执行的 SQL：

```bash
node scripts/publish_book_to_d1.mjs --id 1010 --dry-run
```

安全要求：

- 不要把 `CLOUDFLARE_API_TOKEN` 写入 `.env` 后提交。
- 不要把 token 发到聊天、issue、commit 或文档里。
- 如果 token 泄露，发布完成后立即在 Cloudflare 控制台撤销并重建。

如果 Wrangler OAuth 登录被 Cloudflare bot challenge 拦截，使用 Cloudflare 控制台创建 API Token。最低需要 D1 edit 权限；如果还要部署 Worker，再增加 Workers Scripts edit 权限。

## GitHub 提交

只提交和本次新书直接相关的文件。仓库可能有很多无关未提交改动，提交前必须检查暂存区：

```bash
git status --short
git diff --cached --stat
git diff --cached
```

如果 `data/mockData.ts` 混有多本书或其它修正，使用部分暂存，只把本次新书条目提交。

提交示例：

```bash
git add -p data/mockData.ts
git commit -m "feat: add walden"
git push origin main
```

## 验证

发布后必须验证生产站，而不是只看本地文件。

搜索 API：

```bash
curl -sS 'https://qifeibook.com/api/search?q=瓦尔登湖'
```

详情 API：

```bash
curl -sS 'https://qifeibook.com/api/books/1010'
```

详情 HTML 和 SEO：

```bash
curl -sS 'https://qifeibook.com/book/1010' | rg '瓦尔登湖|walden-cover|百度网盘|<title>'
```

封面：

```bash
curl -I -L 'https://img.aqifei.top/img/2026/05/walden-cover.jpg'
```

成功标准：

- 搜索 API 返回 `found: true` 和正确 `id`。
- `/api/books/:id` 返回下载链接、图床封面、关键词。
- `/book/:id` 有正确 title、meta、Book JSON-LD、封面和下载卡片。
- 图床 URL 返回 `HTTP 200`。

## 常见问题

- 网站首页看不到新书：先用搜索和 `/api/books/:id` 验证。首页可能受分页、排序或缓存影响。
- 本地有书但线上没有：通常是还没写入远程 D1。
- 豆瓣封面打不开：不要热链豆瓣，先转存到图床。
- `wrangler login` 返回 403 bot challenge：改用 `CLOUDFLARE_API_TOKEN`。
- 已经把 token 发出来：立即撤销，重新创建。
