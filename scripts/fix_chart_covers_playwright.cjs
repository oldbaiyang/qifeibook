#!/usr/bin/env node
/**
 * 用 Playwright 修复飞书表格中的坏封面
 *
 * 原因：豆瓣 CDN (doubanio.com) 对直接下载做了反爬保护，
 *       用 requests 下载的"图片"实际是 HTML，上传图床后显示为坏图。
 *
 * 方案：用无头浏览器打开豆瓣书籍详情页，浏览器能正常加载图片，
 *       通过 route 拦截图片响应获取真实二进制数据，保存后上传图床。
 *
 * 流程：
 *   1. 读取飞书表格，找到今天上传的坏封面行（img.aqifei.top/img/2026/03/202603031012*）
 *   2. 用豆瓣榜单解析出书名 → 豆瓣URL 映射
 *   3. 用 Playwright 打开每本书的豆瓣详情页，拦截封面图片
 *   4. 上传到 PicList 图床
 *   5. 更新飞书表格的封面列
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ====== 配置 ======
const FEISHU_APP_ID = 'cli_a5ac1fa61a78900c';
const FEISHU_APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce';
const FEISHU_WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I';
const PICLIST_API = 'http://127.0.0.1:36677/upload';

const TEMP_DIR = path.join(__dirname, 'temp_playwright_covers');

// 豆瓣月度榜单书籍 → 详情页 URL（从之前的抓取结果）
const CHART_BOOKS = [
  { title: '咸的玩笑', url: 'https://book.douban.com/subject/37833272/' },
  { title: '真事隐：康熙废储与正史虚构', url: 'https://book.douban.com/subject/37920184/' },
  { title: '凯罗斯', url: 'https://book.douban.com/subject/37825000/' },
  { title: '烧纸', url: 'https://book.douban.com/subject/37281710/' },
  { title: '镖⼈：卷十三', url: 'https://book.douban.com/subject/37668521/' },
  { title: '故纸浮生.1-2', url: 'https://book.douban.com/subject/37648813/' },
  { title: '东京平常日3', url: 'https://book.douban.com/subject/37497858/' },
  { title: '天色已晚', url: 'https://book.douban.com/subject/37890167/' },
  { title: '蟫', url: 'https://book.douban.com/subject/37830736/' },
  { title: '她们的西南联大岁月', url: 'https://book.douban.com/subject/37897740/' },
  { title: '鹅之书', url: 'https://book.douban.com/subject/37374594/' },
  { title: '女校之星 3', url: 'https://book.douban.com/subject/37842725/' },
  { title: '跑外卖：一个女骑手的世界', url: 'https://book.douban.com/subject/37462151/' },
  { title: '拒绝参加游戏', url: 'https://book.douban.com/subject/37897227/' },
  { title: '在世与认知', url: 'https://book.douban.com/subject/37112076/' },
  { title: '黄色墙纸：吉尔曼女性小说选', url: 'https://book.douban.com/subject/37663131/' },
  { title: '法兰克福学派入门讲座：从卢卡奇到布莱希特', url: 'https://book.douban.com/subject/37563197/' },
  { title: '旷野的慰藉', url: 'https://book.douban.com/subject/37931089/' },
  { title: '大限将至', url: 'https://book.douban.com/subject/37447244/' },
];

// ====== 飞书 API ======
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.request(url, { method: 'GET', timeout: 15000, ...options }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function getFeishuToken() {
  const res = await httpRequest('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET }),
  });
  return res.data.tenant_access_token;
}

async function getSpreadsheetInfo(token) {
  const res = await httpRequest(
    `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${FEISHU_WIKI_TOKEN}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const spreadsheetToken = res.data.data.node.obj_token;

  const res2 = await httpRequest(
    `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/query`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const sheetId = res2.data.data.sheets[0].sheet_id;

  return { spreadsheetToken, sheetId };
}

async function readFeishuValues(token, spreadsheetToken, sheetId, range) {
  const res = await httpRequest(
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${sheetId}!${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data.valueRange.values || [];
}

function extractText(cell) {
  if (!cell) return '';
  if (typeof cell === 'string') return cell.trim();
  if (Array.isArray(cell)) return cell.map(extractText).join('').trim();
  if (typeof cell === 'object') {
    if (cell.link) return cell.link.trim();
    if (cell.text) return cell.text.trim();
    return String(cell).trim();
  }
  return String(cell).trim();
}

async function updateFeishuCell(token, spreadsheetToken, sheetId, cellRange, value) {
  const res = await httpRequest(
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valueRange: {
          range: `${sheetId}!${cellRange}`,
          values: [[value]],
        },
      }),
    }
  );
  return res.data.code === 0;
}

// ====== PicList 上传 ======
function uploadToPicList(imagePath) {
  return new Promise((resolve, reject) => {
    const absPath = path.resolve(imagePath);
    const body = JSON.stringify({ list: [absPath] });
    const req = http.request(PICLIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 30000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.fullResult && result.fullResult[0]) {
            const first = result.fullResult[0];
            resolve(typeof first === 'string' ? first : first.imgUrl || null);
          } else if (result.success && result.result && result.result[0]) {
            resolve(result.result[0]);
          } else {
            reject(new Error(`Upload response: ${data.slice(0, 200)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('upload timeout')); });
    req.write(body);
    req.end();
  });
}

// ====== Playwright 截取封面 ======
async function downloadCoverWithBrowser(browser, bookUrl, savePath) {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(bookUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // 等待封面图加载
    const mainpic = page.locator('#mainpic img');
    await mainpic.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

    if (await mainpic.count() > 0) {
      // 对封面元素截图
      const coverData = await mainpic.screenshot({ type: 'jpeg', quality: 95 });
      if (coverData && coverData.length > 500) {
        fs.writeFileSync(savePath, coverData);
        return true;
      }
    }

    console.log('    未找到封面元素');
    return false;
  } catch (err) {
    console.log(`    浏览器错误: ${err.message}`);
    return false;
  } finally {
    await context.close();
  }
}

// ====== 主流程 ======
(async () => {
  console.log('='.repeat(60));
  console.log('Playwright 修复豆瓣月榜封面');
  console.log('='.repeat(60));

  // 确保临时目录存在
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  // 1. 飞书认证
  console.log('\n[1/5] 飞书认证...');
  const token = await getFeishuToken();
  if (!token) { console.log('飞书认证失败'); process.exit(1); }
  const { spreadsheetToken, sheetId } = await getSpreadsheetInfo(token);
  console.log(`  spreadsheet: ${spreadsheetToken}, sheet: ${sheetId}`);

  // 2. 读取飞书现有数据，找到需要修复的行
  console.log('\n[2/5] 读取飞书表格，查找需要修复的行...');
  const values = await readFeishuValues(token, spreadsheetToken, sheetId, 'A1:B5000');

  // 建立书名 → 行号映射（找今天上传的坏封面，或匹配榜单书名）
  const chartTitles = new Set(CHART_BOOKS.map(b => b.title));
  const titleToRow = {};   // title -> row number (1-based)
  const titleToCover = {}; // title -> current cover url

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length < 1) continue;
    const title = extractText(row[0]);
    const cover = row.length > 1 ? extractText(row[1]) : '';
    if (chartTitles.has(title)) {
      titleToRow[title] = i + 1; // 1-based
      titleToCover[title] = cover;
    }
  }

  // 过滤出需要修复的书（封面为空、或包含今天上传的坏图）
  const booksToFix = CHART_BOOKS.filter(b => {
    const row = titleToRow[b.title];
    if (!row) return false; // 不在飞书里的跳过
    const cover = titleToCover[b.title] || '';
    // 今天上传的坏图特征: img.aqifei.top/img/2026/03/20260303
    return !cover || cover.includes('20260303') || cover.includes('aqifei');
  });

  console.log(`  飞书中匹配到 ${Object.keys(titleToRow).length} 本榜单书`);
  console.log(`  需要修复封面: ${booksToFix.length} 本`);

  if (booksToFix.length === 0) {
    console.log('没有需要修复的封面');
    process.exit(0);
  }

  // 3. 启动浏览器
  console.log('\n[3/5] 启动浏览器...');
  const browser = await chromium.launch({ headless: true });

  // 4. 逐本处理
  console.log('\n[4/5] 下载封面并上传图床...');
  const results = [];

  for (let i = 0; i < booksToFix.length; i++) {
    const book = booksToFix[i];
    const row = titleToRow[book.title];
    console.log(`  [${i + 1}/${booksToFix.length}] ${book.title} (行 ${row})`);

    const safeName = book.title.replace(/[^\w\u4e00-\u9fff]/g, '_');
    const imgPath = path.join(TEMP_DIR, `${safeName}.jpg`);

    // 下载封面
    const downloaded = await downloadCoverWithBrowser(browser, book.url, imgPath);
    if (!downloaded) {
      console.log('    封面获取失败，跳过');
      continue;
    }

    const fileSize = fs.statSync(imgPath).size;
    console.log(`    封面已保存 (${(fileSize / 1024).toFixed(1)} KB)`);

    // 上传图床
    try {
      const cdnUrl = await uploadToPicList(imgPath);
      console.log(`    上传成功: ${cdnUrl}`);
      results.push({ title: book.title, row, cdnUrl });
    } catch (err) {
      console.log(`    上传失败: ${err.message}`);
    }

    // 清理临时文件
    try { fs.unlinkSync(imgPath); } catch {}

    // 随机延迟 2-4 秒
    const delay = 2000 + Math.random() * 2000;
    await new Promise(r => setTimeout(r, delay));
  }

  await browser.close();

  // 5. 更新飞书表格
  if (results.length > 0) {
    console.log(`\n[5/5] 更新飞书表格 ${results.length} 条封面...`);
    // 刷新 token
    const newToken = await getFeishuToken();

    for (const item of results) {
      const cellRange = `B${item.row}:B${item.row}`;
      const ok = await updateFeishuCell(newToken, spreadsheetToken, sheetId, cellRange, item.cdnUrl);
      console.log(`  ${ok ? '✓' : '✗'} 行 ${item.row}: ${item.title}`);
    }
  }

  // 清理临时目录
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.readdirSync(TEMP_DIR).forEach(f => fs.unlinkSync(path.join(TEMP_DIR, f)));
      fs.rmdirSync(TEMP_DIR);
    }
  } catch {}

  console.log(`\n${'='.repeat(60)}`);
  console.log(`完成! 成功修复 ${results.length}/${booksToFix.length} 本封面`);
  console.log('='.repeat(60));

  process.exit(0);
})();
