# 棋飞书库 - 技能脚本文档

本文档记录了可复用的自动化脚本，用于书籍数据采集、处理和发布。

## 目录

1. [单书爬取](#1-单书爬取)
2. [榜单爬取](#2-榜单爬取)
3. [下载链接更新](#3-下载链接更新)
4. [同步到网站](#4-同步到网站)
5. [飞书书籍补全](#5-飞书书籍补全)
6. [移动书籍到新发布](#6-移动书籍到新发布)

---

## 1. 单书爬取

**脚本**: `scripts/scrape_douban.cjs`

**功能**: 根据书名从豆瓣爬取书籍信息，上传封面到图床，写入飞书表格。

**使用方法**:
```bash
node scripts/scrape_douban.cjs "书名"
```

**输出示例**:
```json
{
  "title": "三体",
  "author": "刘慈欣",
  "cover": "https://img.aqifei.top/img/2026/03/xxx",
  "description": "内容简介...",
  "authorDetail": "作者简介...",
  "feishuRow": 201
}
```

**工作流程**:
1. 搜索豆瓣找到书籍
2. 提取：作者、封面、内容简介、作者简介
3. 下载封面到本地
4. 上传封面到 PicList 图床
5. 写入飞书表格（A-E列）

**依赖**:
- Playwright（浏览器自动化）
- PicList 本地服务（端口 36677）
- 飞书 API

---

## 2. 榜单爬取

**脚本**: `scripts/scrape_douban_list.cjs`

**功能**: 爬取豆瓣榜单所有书籍，批量写入飞书表格。

**使用方法**:
```bash
# 从头开始
node scripts/scrape_douban_list.cjs "https://www.douban.com/doulist/1264675/"

# 从指定页开始
node scripts/scrape_douban_list.cjs "https://www.douban.com/doulist/1264675/" 10
```

**工作流程**:
1. 遍历榜单所有分页
2. 提取每本书的链接
3. 依次爬取每本书的信息
4. 上传封面到图床
5. 写入飞书表格

**配置项**:
```javascript
const DELAY_MIN = 3000;  // 请求间隔最小值(ms)
const DELAY_MAX = 6000;  // 请求间隔最大值(ms)
```

---

## 3. 下载链接更新

**脚本**: `scripts/update_download_links.cjs`

**功能**: 根据书名批量更新飞书表格中的下载链接（F列）。

**使用方法**:
```bash
node scripts/update_download_links.cjs
```

**数据格式**:
在脚本中的 `booksData` 数组添加书籍：
```javascript
const booksData = [
  { title: '书名', url: 'https://pan.baidu.com/s/xxx?pwd=0000', code: '0000' },
  // ...
];
```

**输出格式**:
```
https://pan.baidu.com/s/xxx?pwd=0000 提取码：0000
```

---

## 4. 同步到网站

**脚本**: `scripts/sync_to_website.cjs`

**功能**: 将飞书表格中有下载链接的书籍同步到 `data/mockData.ts`。

**使用方法**:
```bash
node scripts/sync_to_website.cjs
```

**工作流程**:
1. 读取飞书表格所有数据
2. 筛选有百度网盘链接的书籍
3. 排除已存在的书籍（按标题去重）
4. 自动分配 ID（从当前最大 ID +1 开始）
5. 自动分类（根据标题、作者、简介关键词）
6. 写入 `data/mockData.ts`

**分类映射**:
```javascript
const CATEGORY_MAP = {
  '小说': '文学小说',
  '历史': '历史人文',
  '哲学': '历史人文',
  '计算机': '计算机',
  '编程': '计算机',
  '经济': '经济管理',
  // ...
};
```

**飞书表格列结构 (A-F)**:
| 列 | 字段 | 说明 |
|----|------|------|
| A | 书名 | title |
| B | 作者 | author |
| C | 封面图片 | cover (URL) |
| D | 作者简介 | authorDetail |
| E | 书籍内容简介 | description |
| F | 下载链接 | downloadLinks |

---

## 5. 飞书书籍补全

**脚本**: `scripts/enrich_books_from_douban.cjs`

**功能**: 读取飞书表格中书名，从豆瓣补全缺失的字段。

**使用方法**:
```bash
node scripts/enrich_books_from_douban.cjs
```

**工作流程**:
1. 读取飞书表格
2. 筛选需要补全的行（缺少作者/封面/简介）
3. 从豆瓣爬取缺失信息
4. 上传封面到图床
5. 更新飞书表格（保留原有下载链接）

---

## 配置信息

### PicList 图床服务
```javascript
const PICLIST_HOST = '127.0.0.1';
const PICLIST_PORT = 36677;
const PICLIST_KEY = 'PicList-aesPassword';
```

### 飞书 API
```javascript
const FEISHU_APP_ID = 'cli_a5ac1fa61a78900c';
const FEISHU_APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce';
const FEISHU_WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I';
const SHEET_ID = '22j6ne';
```

### 飞书表格链接
https://my.feishu.cn/wiki/RIXjwrSs3ibf7FkOB2JcguCin8I?sheet=22j6ne

---

## 豆瓣爬虫核心修复

### 问题描述
1. **内容简介**: 获取到被截断的内容
2. **作者简介**: 直接使用作者名，没有真正提取

### 解决方案

**内容简介提取**:
```javascript
// 1. 点击展开按钮
const expandBtn = page.locator('#link-report .j.a_show_full, #link-report a.a_show_full');
if (await expandBtn.count() > 0) {
  await expandBtn.first().click();
  await page.waitForTimeout(1000);
}

// 2. 多选择器尝试
const descSelectors = [
  '#link-report span.all',
  '#link-report div.all',
  '#link-report .intro',
  '#link-report'
];
```

**作者简介提取 + CSS清理**:
```javascript
// CSS清理正则（修复 .intro p{} 格式）
const cleaned = text
  .replace(/\.[a-z\-_]+(\s+[a-z\-_]+)*\s*\{[^}]*\}/gi, '')  // 移除 .class { } 和 .class element { }
  .replace(/\{[^}]+\}/g, '')                                 // 移除残留的 { }
  .replace(/\s+/g, ' ')                                      // 合并空白
  .trim();
```

---

## 完整工作流

### 新书发布流程

```
1. 在飞书表格填入书名
      ↓
2. 运行补全脚本获取豆瓣信息
   node scripts/enrich_books_from_douban.cjs
      ↓
3. 添加下载链接到飞书表格
   node scripts/update_download_links.cjs
      ↓
4. 同步到网站
   node scripts/sync_to_website.cjs
      ↓
5. 构建部署
   npm run build
```

### 快速单书发布

```bash
# 一条命令完成爬取+写入飞书
node scripts/scrape_douban.cjs "书名"

# 然后手动添加下载链接，再同步
node scripts/sync_to_website.cjs
```

---

## 注意事项

1. **豆瓣登录**: 首次运行需要手动登录豆瓣，cookies 会保存到 `scripts/douban_cookies.json`
2. **请求频率**: 脚本有随机延迟（3-6秒），避免被封
3. **网络问题**: 飞书 API 可能偶发连接失败，重试即可
4. **去重逻辑**: 同步脚本按书名去重，已存在的书籍不会重复添加
5. **图床依赖**: 需要本地运行 PicList 服务

---

## 6. 移动书籍到新发布

**脚本**: `scripts/move_to_new_publish.py`

**功能**: 将"未发布"工作表中有下载地址的书籍移动到"新发布"工作表。

**使用方法**:
```bash
python3 scripts/move_to_new_publish.py
```

**工作流程**:
1. 连接飞书表格
2. 读取"未发布"工作表所有数据
3. 筛选有下载链接的行（包含 pan.baidu.com、pan.quark.cn 等）
4. 创建或使用已存在的"新发布"工作表
5. 将筛选出的书籍写入"新发布"工作表
6. 从"未发布"工作表删除已移动的行

**输出示例**:
```
==================================================
将未发布中有下载地址的书籍移动到新发布
==================================================
✓ 获取token成功
✓ 表格token: PjBesX31NhI3N4tR60hcc5lsnkf

当前工作表:
  - 未发布 (ID: 22j6ne)
  - 已发布 (ID: 3s5nH2)

✓ 找到未发布工作表: 未发布
✓ 读取到 1000 行数据

有下载链接的书籍: 25
无下载链接的书籍: 974

✓ 成功写入 26 行数据到新发布工作表

已移动的书籍:
  - 万物生光辉 ([英] 吉米·哈利)
  - 教父 ([美] 马里奥·普佐)
  ...

✓ 完成！
  - 已将 25 本书写入'新发布'工作表
  - 已从'未发布'工作表删除 25 行
```

**识别的下载链接格式**:
- 百度网盘: `pan.baidu.com`
- 夸克网盘: `pan.quark.cn`
- 阿里云盘: `aliyundrive.com`
- 迅雷网盘: `pan.xunlei.com`

**注意事项**:
1. 脚本会自动创建"新发布"工作表（如果不存在）
2. 删除操作从后往前执行，避免行索引变化
3. 表头行会被保留并复制到新工作表

---

## 7. 常用快速操作总结

### 常用脚本列表

| 脚本 | 功能 |
|------|------|
| `scripts/update_baidu_links_batch.py` | 批量更新飞书未发布sheet的F列下载链接 |
| `scripts/sync_books_with_links.py` | 将飞书中有下载链接的书籍同步到网站 |
| `scripts/move_to_published.py` | 将未发布sheet中有下载链接的书籍移动到已发布sheet |
| `scripts/update_sitemap.py` | 更新sitemap.xml |

### 完整发布流程

```bash
# 1. 更新飞书F列下载链接（用户提供百度网盘链接）
python scripts/update_baidu_links_batch.py

# 2. 发布书籍到网站
python scripts/sync_books_with_links.py

# 3. 构建项目
npm run build

# 4. 更新sitemap
python scripts/update_sitemap.py

# 5. 提交代码
git add data/mockData.ts public/sitemap.xml
git commit -m "feat: add new books"
git push origin main

# 6. 移动到已发布sheet
python scripts/move_to_published.py
```

### 飞书表格结构

**未发布Sheet (sheet_id: 22j6ne)**
| 列 | 字段 |
|---|---|
| A | 书名 |
| B | 作者 |
| C | 封面图片URL |
| D | 作者简介 |
| E | 书籍简介 |
| F | 下载链接 |

**已发布Sheet (sheet_id: 3s5nH2)**
| 列 | 字段 |
|---|---|
| A | ID |
| B | 书名 |
| C | 作者 |
| D | 作者简介 |
| E | 封面图片URL |
| F | 书籍简介 |
| G | 分类 |
| H | 下载链接 |

### 百度网盘链接格式

用户提供的格式：
```
【超级会员V9】通过百度网盘分享的文件：书名.epub
链接：https://pan.baidu.com/s/xxx?pwd=0000
提取码：0000
```

脚本自动提取后存入飞书F列，包含超链接和提取码。

---

## 8. 更新已有书籍信息

**场景**: 用户提供了书名列表，需要搜索并更新 `data/mockData.ts` 中错误的数据。

**完整工作流程**:

### 步骤1: 批量搜索

使用 `web_search` 一次性搜索所有书名，获取正确信息后，按以下格式输出：

```
更新书籍 {书名}

作者 {作者}

作者简介 {作者简介，以作者名开头}

内容简介 {内容简介，500字左右，包含豆瓣评分和书籍评价}

---
```

### 步骤2: 获取到内容后立即更新到网站

搜索完成后，**不要只输出内容**，要同步更新到 `data/mockData.ts`：
1. 用 `grep -n "书名" data/mockData.ts` 定位书籍 ID
2. 读取该书籍的完整 JSON 条目
3. 用 Node.js 替换更新（避免多行字符串问题）
4. 构建验证 `npm run build`
5. 提交并推送

### 步骤3: 在 mockData.ts 中定位书籍

```bash
grep -n "书名" data/mockData.ts
```

### 步骤3: 用 Node.js 脚本更新

由于 description 和 authorDetail 是多行字符串，必须用 Node.js 替换，避免 Python 的编码问题：

```javascript
node -e "
const fs = require('fs');
let content = fs.readFileSync('data/mockData.ts', 'utf8');

// 找到旧条目并替换
const oldEntry = \`  {
    \"id\": 448,
    \"title\": \"寻路中国\",
    \"author\": \"错误的作者\",
    \"authorDetail\": \"错误的简介...\",
    ...
  },\`;

const newEntry = \`  {
    \"id\": 448,
    \"title\": \"寻路中国\",
    \"author\": \"[美]彼得·海斯勒\",
    \"authorDetail\": \"正确的简介...\",
    ...
  },\`;

if (content.includes(oldEntry)) {
  content = content.replace(oldEntry, newEntry);
  fs.writeFileSync('data/mockData.ts', content, 'utf8');
  console.log('Done!');
} else {
  console.log('Pattern not found');
}
"
```

### 步骤4: 验证构建

```bash
npm run build
```

### 步骤5: 提交

```bash
git add data/mockData.ts
git commit -m "feat: update 书名 with correct author and description"
git push
```

**注意事项**:
- description 和 authorDetail 中使用中文引号「」代替英文引号
- 保持 category、downloadLinks、cover 等原有字段不变（除非用户明确要改）
- 如果找不到精确匹配，检查 mockData.ts 中实际内容的格式
- **重要**: 获取到内容后**立即更新到网站**，不要只输出内容给用户看就结束
- 提交信息格式: `feat: update 书名 with correct author and description` 或批量 `feat: update N books with correct authors and descriptions`
