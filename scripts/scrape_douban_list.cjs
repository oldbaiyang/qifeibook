#!/usr/bin/env node
/**
 * 豆瓣榜单爬虫 - 爬取榜单并写入飞书表格
 *
 * 使用方法：
 *   node scripts/scrape_douban_list.cjs "榜单URL" [起始页]
 *   node scripts/scrape_douban_list.cjs "https://www.douban.com/doulist/1264675/"
 *   node scripts/scrape_douban_list.cjs "https://www.douban.com/doulist/1264675/" 2  # 从第2页开始
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { uploadToImageHost } = require('./lib/image_host_upload.cjs');

const COOKIE_FILE = path.join(__dirname, 'douban_cookies.json');
const TEMP_DIR = '/tmp/douban_covers';

// 飞书配置：不要在仓库中保存凭据，运行前通过环境变量提供。
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const FEISHU_WIKI_TOKEN = process.env.FEISHU_WIKI_TOKEN;
const SHEET_ID = process.env.FEISHU_SHEET_ID;

// 配置
const DELAY_MIN = 3000;
const DELAY_MAX = 6000;

// 获取命令行参数
const listUrl = process.argv[2];
const startPage = parseInt(process.argv[3]) || 1;

if (!listUrl) {
  console.error('用法: node scrape_douban_list.cjs "榜单URL" [起始页]');
  process.exit(1);
}

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET || !FEISHU_WIKI_TOKEN || !SHEET_ID) {
  console.error('缺少飞书环境变量：FEISHU_APP_ID、FEISHU_APP_SECRET、FEISHU_WIKI_TOKEN、FEISHU_SHEET_ID');
  process.exit(1);
}

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * 清理CSS样式文本
 */
function cleanCss(text) {
  return text
    .replace(/\.[a-z\-_]+(\s+[a-z\-_]+)*\s*\{[^}]*\}/gi, '')
    .replace(/\{[^}]+\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ==================== 飞书 API ====================

async function getFeishuToken() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET
    });
    const req = https.request({
      hostname: 'open.feishu.cn',
      path: '/open-apis/auth/v3/tenant_access_token/internal',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.tenant_access_token) {
            resolve(json.tenant_access_token);
          } else {
            reject(new Error('获取token失败: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getSpreadsheetToken(token) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'open.feishu.cn',
      path: `/open-apis/wiki/v2/spaces/get_node?token=${FEISHU_WIKI_TOKEN}`,
      headers: { Authorization: `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.data?.node?.obj_token) {
            resolve(json.data.node.obj_token);
          } else {
            reject(new Error('获取表格token失败: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function findEmptyRow(token, spreadsheetToken) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'open.feishu.cn',
      path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${SHEET_ID}!A1:A500`,
      headers: { Authorization: `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const values = json.data?.valueRange?.values || [];
          for (let i = 1; i < values.length; i++) {
            if (!values[i][0] || values[i][0].trim() === '') {
              resolve(i + 1);
              return;
            }
          }
          resolve(values.length + 1);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function writeToFeishu(token, spreadsheetToken, rowIndex, values) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      valueRange: {
        range: `${SHEET_ID}!A${rowIndex}:E${rowIndex}`,
        values: [values]
      }
    });
    const req = https.request({
      hostname: 'open.feishu.cn',
      path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.code === 0);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ==================== 豆瓣爬虫 ====================

/**
 * 从榜单页面提取书籍链接
 */
async function extractBookLinks(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);

  const links = await page.evaluate(() => {
    const items = [];
    // 榜单中的书籍链接
    document.querySelectorAll('.doulist-item .title a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.includes('/subject/')) {
        items.push({
          title: a.textContent.trim(),
          url: href
        });
      }
    });
    return items;
  });

  return links;
}

/**
 * 检查是否有下一页
 */
async function hasNextPage(page) {
  try {
    const nextLink = await page.locator('.next a').getAttribute('href', { timeout: 3000 });
    return nextLink || null;
  } catch {
    return null;
  }
}

/**
 * 从书籍详情页提取信息
 */
async function scrapeBookDetail(page, bookUrl) {
  await page.goto(bookUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);

  const result = {
    doubanUrl: bookUrl,
    title: '',
    author: '',
    cover: '',
    description: '',
    authorDetail: ''
  };

  // 提取书名
  try {
    result.title = await page.locator('h1 span').first().textContent() || '';
    result.title = result.title.trim();
  } catch {}

  // 提取作者
  try {
    const info = await page.locator('#info').textContent() || '';
    const m = info.match(/作者[:：\s]*([^\n]+)/);
    if (m) result.author = m[1].trim();
  } catch {}

  // 提取并下载封面
  try {
    const coverImg = page.locator('#mainpic img');
    const coverUrl = await coverImg.getAttribute('src') || '';

    if (coverUrl) {
      const ext = coverUrl.includes('.jpg') ? 'jpg' : coverUrl.includes('.png') ? 'png' : 'jpg';
      const safeName = (result.title || 'book').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30);
      const localPath = path.join(TEMP_DIR, `${safeName}.${ext}`);

      // 通过 fetch 下载（带 referer）
      const response = await page.evaluate(async (url) => {
        const res = await fetch(url, {
          headers: {
            'Referer': 'https://book.douban.com/',
            'User-Agent': navigator.userAgent
          }
        });
        const blob = await res.blob();
        const buffer = await blob.arrayBuffer();
        return Array.from(new Uint8Array(buffer));
      }, coverUrl);

      fs.writeFileSync(localPath, Buffer.from(response));

      const uploadedUrl = await uploadToImageHost(localPath);
      result.cover = uploadedUrl;

      fs.unlinkSync(localPath);
    }
  } catch (err) {
    console.error(`    封面处理失败: ${err.message}`);
  }

  // 提取内容简介
  try {
    const expandBtn = page.locator('#link-report .j.a_show_full, #link-report a.a_show_full');
    if (await expandBtn.count() > 0) {
      await expandBtn.first().click().catch(() => {});
      await page.waitForTimeout(1000);
    }

    const descSelectors = [
      '#link-report span.all',
      '#link-report div.all',
      '#link-report .intro',
      '#link-report'
    ];
    for (const sel of descSelectors) {
      const elem = page.locator(sel).first();
      if (await elem.count() > 0) {
        const text = await elem.textContent() || '';
        const cleaned = text.replace(/\s+/g, ' ').trim();
        if (cleaned.length > 20 && !cleaned.includes('{')) {
          result.description = cleaned;
          break;
        }
      }
    }
  } catch {}

  // 提取作者简介
  try {
    const authorSelectors = [
      '.related_info h2:has-text("作者简介") + div',
      '.related_info h2:has-text("作者简介") + .indent',
      '.related_info:has-text("作者简介") .indent'
    ];

    for (const sel of authorSelectors) {
      const elem = page.locator(sel).first();
      if (await elem.count() > 0) {
        const text = await elem.textContent() || '';
        const cleaned = cleanCss(text);
        if (cleaned.length > 10 && !cleaned.startsWith('.intro')) {
          result.authorDetail = cleaned;
          break;
        }
      }
    }

    if (!result.authorDetail && result.author) {
      result.authorDetail = result.author;
    }
  } catch {}

  return result;
}

// ==================== 主程序 ====================
(async () => {
  console.log('========================================');
  console.log('豆瓣榜单爬虫');
  console.log('========================================');
  console.log(`榜单: ${listUrl}`);
  console.log(`起始页: ${startPage}`);
  console.log('');

  // 获取飞书token
  console.log('连接飞书...');
  const token = await getFeishuToken();
  const spreadsheetToken = await getSpreadsheetToken(token);
  console.log('✓ 飞书连接成功\n');

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

  // 检测登录
  console.log('检测登录...');
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    if (await page.locator('a[href*="/mine"], .nav-user-avatar').count() > 0) {
      console.log('✓ 已登录\n');
      break;
    }
  }

  // 保存cookies
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(await context.cookies(), null, 2));

  // 收集所有书籍链接
  const allBooks = [];
  let currentUrl = listUrl;
  let pageNum = 1;

  // 如果指定了起始页，跳转到对应页面
  if (startPage > 1) {
    const start = (startPage - 1) * 25;
    currentUrl = `${listUrl}?start=${start}&sort=seq&playable=0&sub_type=`;
    pageNum = startPage;
  }

  while (currentUrl) {
    console.log(`获取第 ${pageNum} 页...`);
    const books = await extractBookLinks(page, currentUrl);
    console.log(`  找到 ${books.length} 本书`);

    allBooks.push(...books);

    // 检查下一页
    const nextUrl = await hasNextPage(page);
    if (nextUrl) {
      currentUrl = nextUrl.startsWith('http') ? nextUrl : `https://www.douban.com${nextUrl}`;
      pageNum++;
      await page.waitForTimeout(2000);
    } else {
      currentUrl = null;
    }
  }

  console.log(`\n共找到 ${allBooks.length} 本书\n`);

  // 爬取每本书
  let success = 0;
  let failed = 0;

  for (let i = 0; i < allBooks.length; i++) {
    const book = allBooks[i];
    console.log(`\n[${i + 1}/${allBooks.length}] ${book.title}`);

    try {
      const result = await scrapeBookDetail(page, book.url);

      if (result.author) {
        // 获取下一个空行
        const emptyRow = await findEmptyRow(token, spreadsheetToken);

        // 写入飞书
        const values = [
          result.title,
          result.author,
          result.cover,
          result.authorDetail,
          result.description
        ];

        const ok = await writeToFeishu(token, spreadsheetToken, emptyRow, values);

        if (ok) {
          console.log(`  ✓ 已写入第 ${emptyRow} 行`);
          success++;
        } else {
          console.log(`  ✗ 写入失败`);
          failed++;
        }
      } else {
        console.log(`  ✗ 未找到作者信息`);
        failed++;
      }
    } catch (err) {
      console.log(`  ✗ 错误: ${err.message}`);
      failed++;
    }

    // 随机延迟
    const delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
    await page.waitForTimeout(delay);
  }

  // 保存cookies
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(await context.cookies(), null, 2));

  await browser.close();

  console.log('\n========================================');
  console.log(`完成! 成功: ${success}, 失败: ${failed}`);
  console.log('========================================');
})();
