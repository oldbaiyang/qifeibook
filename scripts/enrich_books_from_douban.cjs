#!/usr/bin/env node
/**
 * 豆瓣爬虫 - 从飞书读取书名并补全信息
 *
 * 功能：读取飞书表格中的书名，从豆瓣爬取作者、封面、作者简介、内容简介
 *
 * 使用方法：
 *   node scripts/enrich_books_from_douban.cjs
 *
 * 飞书表格列结构 (A-F):
 *   A: 书名 (title)
 *   B: 作者 (author)
 *   C: 封面图片 (cover)
 *   D: 作者简介 (authorDetail)
 *   E: 书籍内容简介 (description)
 *   F: 下载链接 (downloadLinks) - 保持不变
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================
const COOKIE_FILE = path.join(__dirname, 'douban_cookies.json');

// 飞书配置
const FEISHU_APP_ID = 'cli_a5ac1fa61a78900c';
const FEISHU_APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce';
const FEISHU_WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I';
const SHEET_ID = '22j6ne';

// 处理配置
const START_ROW = 2;        // 起始行（跳过表头）
const MAX_ROWS = 500;       // 最大处理行数
const DELAY_MIN = 3000;     // 请求间隔最小值(ms)
const DELAY_MAX = 5000;     // 请求间隔最大值(ms)

// ==================== HTTP 工具函数 ====================
const https = require('https');

// 解析飞书单元格值（可能是字符串或超链接对象）
function extractCellValue(cell) {
  if (!cell) return '';

  // 如果是字符串
  if (typeof cell === 'string') {
    return cell.trim();
  }

  // 如果是对象数组（飞书超链接格式）
  if (Array.isArray(cell)) {
    const linkObj = cell.find(item => item && item.link);
    if (linkObj && linkObj.link) {
      return linkObj.link.trim();
    }
    // 可能是纯文本数组
    return cell.map(v => typeof v === 'string' ? v : (v.text || '')).join('').trim();
  }

  // 如果是单个对象
  if (typeof cell === 'object') {
    if (cell.link) return cell.link.trim();
    if (cell.text) return cell.text.trim();
  }

  return String(cell).trim();
}

function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ==================== 飞书 API ====================
async function getFeishuToken() {
  const data = await httpsRequest({
    hostname: 'open.feishu.cn',
    path: '/open-apis/auth/v3/tenant_access_token/internal',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET });

  if (!data.tenant_access_token) {
    throw new Error('获取飞书token失败: ' + JSON.stringify(data));
  }
  return data.tenant_access_token;
}

async function getSpreadsheetToken(token) {
  const data = await httpsRequest({
    hostname: 'open.feishu.cn',
    path: `/open-apis/wiki/v2/spaces/get_node?token=${FEISHU_WIKI_TOKEN}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!data.data?.node?.obj_token) {
    throw new Error('获取表格token失败: ' + JSON.stringify(data));
  }
  return data.data.node.obj_token;
}

async function readSheetRows(token, spreadsheetToken, startRow, maxRows) {
  const range = `${SHEET_ID}!A${startRow}:F${startRow + maxRows - 1}`;
  const data = await httpsRequest({
    hostname: 'open.feishu.cn',
    path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${range}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  return data.data?.valueRange?.values || [];
}

async function updateRow(token, spreadsheetToken, rowIndex, values) {
  const range = `${SHEET_ID}!A${rowIndex}:F${rowIndex}`;
  const body = { valueRange: { range, values: [values] } };

  const data = await httpsRequest({
    hostname: 'open.feishu.cn',
    path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values`,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, body);

  return data.code === 0;
}

// ==================== 豆瓣爬虫 ====================
async function scrapeDouban(page, title) {
  try {
    const searchUrl = `https://book.douban.com/subject_search?search_text=${encodeURIComponent(title)}&cat=1001`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    // 查找搜索结果
    let bookUrl = null;
    const selectors = ['.item-root a', 'a[href*="/subject/"]', '.result a'];
    for (const sel of selectors) {
      const elem = page.locator(sel).first();
      if (await elem.count() > 0) {
        bookUrl = await elem.getAttribute('href');
        if (bookUrl && bookUrl.includes('subject')) break;
        bookUrl = null;
      }
    }

    if (!bookUrl) return null;

    // 进入详情页
    await page.goto(bookUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1500);

    // ===== 提取作者 =====
    let author = '';
    try {
      const info = await page.locator('#info').textContent() || '';
      const m = info.match(/作者[:：\s]*([^\n]+)/);
      if (m) author = m[1].trim();
    } catch {}

    // ===== 提取封面 =====
    let cover = '';
    try {
      cover = await page.locator('#mainpic img').getAttribute('src') || '';
    } catch {}

    // ===== 提取内容简介 =====
    let description = '';
    try {
      // 点击展开按钮
      const expandBtn = page.locator('#link-report .j.a_show_full, #link-report a.a_show_full, #link-report [data-action="show-full"]');
      if (await expandBtn.count() > 0) {
        await expandBtn.first().click().catch(() => {});
        await page.waitForTimeout(1000);
      }

      // 尝试多个选择器
      const descSelectors = [
        '#link-report span.all.hidden',
        '#link-report div.all.hidden',
        '#link-report span.all',
        '#link-report div.all',
        '#link-report .intro',
        '#link-report'
      ];
      for (const sel of descSelectors) {
        try {
          const elem = page.locator(sel).first();
          if (await elem.count() > 0) {
            const text = await elem.textContent() || '';
            const cleaned = text.replace(/\s+/g, ' ').trim();
            if (cleaned.length > 20 && !cleaned.includes('{') && !cleaned.includes('}')) {
              description = cleaned;
              break;
            }
          }
        } catch {}
      }
    } catch {}

    // ===== 提取作者简介 =====
    let authorDetail = '';
    try {
      const authorIntroSelectors = [
        '.related_info h2:has-text("作者简介") + div',
        '.related_info h2:has-text("作者简介") + .indent',
        '.related_info:has-text("作者简介") .indent'
      ];
      for (const sel of authorIntroSelectors) {
        try {
          const elem = page.locator(sel).first();
          if (await elem.count() > 0) {
            const text = await elem.textContent() || '';
            // 清理CSS样式
            const cleaned = text
              .replace(/\.[a-z\-_]+(\s+[a-z\-_]+)*\s*\{[^}]*\}/gi, '')
              .replace(/\{[^}]+\}/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            if (cleaned.length > 10 && !cleaned.startsWith('.intro') && !cleaned.startsWith('{')) {
              authorDetail = cleaned;
              break;
            }
          }
        } catch {}
      }

      // 方法2: 正则提取
      if (!authorDetail) {
        try {
          const relatedText = await page.locator('.related_info').textContent() || '';
          const match = relatedText.match(/作者简介[：:\s]*\n?([\s\S]+?)(?=\n\s*\n|内容简介|目录|书评|$)/);
          if (match && match[1].trim().length > 10) {
            authorDetail = match[1].trim();
          }
        } catch {}
      }

      // 方法3: 从 author div 获取
      if (!authorDetail) {
        try {
          const authorDiv = page.locator('[id*="author"] .indent, [id*="author"] .intro').first();
          if (await authorDiv.count() > 0) {
            const text = await authorDiv.textContent() || '';
            const cleaned = text
              .replace(/\.[a-z\-_]+(\s+[a-z\-_]+)*\s*\{[^}]*\}/gi, '')
              .replace(/\{[^}]+\}/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            if (cleaned.length > 10) authorDetail = cleaned;
          }
        } catch {}
      }

      // 再次清理
      if (authorDetail) {
        authorDetail = authorDetail
          .replace(/\.[a-z\-_]+(\s+[a-z\-_]+)*\s*\{[^}]*\}/gi, '')
          .replace(/\{[^}]+\}/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      // 兜底
      if (!authorDetail || authorDetail.length < 5) authorDetail = author;
    } catch {
      authorDetail = author;
    }

    if (author || cover) {
      return { author, cover, description, authorDetail };
    }
    return null;
  } catch (err) {
    console.log(`    错误: ${err.message}`);
    return null;
  }
}

// ==================== 主程序 ====================
(async () => {
  console.log('========================================');
  console.log('豆瓣爬虫 - 飞书书籍信息补全');
  console.log('========================================\n');

  // 获取飞书token
  console.log('连接飞书...');
  const token = await getFeishuToken();
  const spreadsheetToken = await getSpreadsheetToken(token);
  console.log('✓ 飞书连接成功\n');

  // 读取表格数据
  console.log('读取飞书表格...');
  const rows = await readSheetRows(token, spreadsheetToken, START_ROW, MAX_ROWS);
  console.log(`✓ 读取到 ${rows.length} 行数据\n`);

  // 筛选需要处理的书籍（有书名，但缺少其他字段）
  const booksToProcess = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const title = extractCellValue(row[0]);
    const author = extractCellValue(row[1]);
    const cover = extractCellValue(row[2]);
    const authorDetail = extractCellValue(row[3]);
    const description = extractCellValue(row[4]);
    const download = extractCellValue(row[5]) || '';

    if (!title) continue; // 没有书名跳过

    // 检查是否需要补全（缺少作者或封面或简介）
    const needsEnrich = !author || !cover || !description || !authorDetail;

    if (needsEnrich) {
      booksToProcess.push({
        rowIndex: START_ROW + i,
        title,
        author,
        cover,
        authorDetail,
        description,
        download
      });
    }
  }

  if (booksToProcess.length === 0) {
    console.log('没有需要补全的书籍，退出。');
    return;
  }

  console.log(`需要处理: ${booksToProcess.length} 本书籍\n`);

  // 启动浏览器
  console.log('启动浏览器...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  // 加载cookies
  if (fs.existsSync(COOKIE_FILE)) {
    try {
      await context.addCookies(JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf-8')));
    } catch {}
  }

  const page = await context.newPage();
  await page.goto('https://www.douban.com/', { waitUntil: 'domcontentloaded' });

  console.log('\n请在浏览器中登录豆瓣！检测登录中...');

  // 检测登录
  let loggedIn = false;
  for (let i = 0; i < 90; i++) {
    await page.waitForTimeout(1000);
    const hasLogin = await page.locator('a[href*="/mine"], .nav-user-avatar').count();
    if (hasLogin > 0) {
      console.log('✓ 检测到已登录!\n');
      loggedIn = true;
      break;
    }
    if (i % 10 === 0) console.log(`  等待登录... ${90 - i}秒`);
  }

  if (!loggedIn) {
    console.log('登录超时，退出。');
    await browser.close();
    return;
  }

  // 保存cookies
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(await context.cookies(), null, 2));

  // 处理书籍
  let success = 0;
  let failed = 0;

  for (let i = 0; i < booksToProcess.length; i++) {
    const book = booksToProcess[i];
    console.log(`\n[${i + 1}/${booksToProcess.length}] ${book.title}`);

    const info = await scrapeDouban(page, book.title);

    if (info && info.author) {
      // 保留原有的下载链接
      const newRow = [
        book.title,
        info.author,
        info.cover,
        info.authorDetail,
        info.description,
        book.download
      ];

      const ok = await updateRow(token, spreadsheetToken, book.rowIndex, newRow);
      if (ok) {
        console.log(`    ✓ 已更新 (行${book.rowIndex})`);
        console.log(`      作者: ${info.author.slice(0, 20)}`);
        console.log(`      简介: ${info.description.slice(0, 30)}...`);
        success++;
      } else {
        console.log(`    ✗ 更新失败`);
        failed++;
      }
    } else {
      console.log(`    ✗ 未找到`);
      failed++;
    }

    // 随机延迟
    const delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
    await page.waitForTimeout(delay);
  }

  await browser.close();
  console.log('\n========================================');
  console.log(`完成! 成功: ${success}, 失败: ${failed}`);
  console.log('========================================');
})();
