#!/usr/bin/env node
/**
 * 豆瓣书籍信息爬虫 - 爬取并写入飞书表格
 *
 * 使用方法：
 *   node scripts/scrape_douban.cjs "书名"
 *   node scripts/scrape_douban.cjs "活着"
 *
 * 输出格式：JSON
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

// 获取命令行参数
const bookTitle = process.argv[2];

if (!bookTitle) {
  console.error('用法: node scrape_douban.cjs "书名"');
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
      path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${SHEET_ID}!A1:A200`,
      headers: { Authorization: `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const values = json.data?.valueRange?.values || [];
          // 找到第一个空行（从第2行开始，跳过表头）
          for (let i = 1; i < values.length; i++) {
            if (!values[i][0] || values[i][0].trim() === '') {
              resolve(i + 1);
              return;
            }
          }
          // 如果没有空行，返回最后一行+1
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

/**
 * 从豆瓣爬取书籍信息
 */
async function scrapeBook(page, title) {
  // 搜索
  const searchUrl = `https://book.douban.com/subject_search?search_text=${encodeURIComponent(title)}&cat=1001`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);

  // 查找第一个结果
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

  if (!bookUrl) {
    return { error: '未找到书籍' };
  }

  // 进入详情页
  await page.goto(bookUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);

  const result = {
    title,
    doubanUrl: bookUrl,
    author: '',
    cover: '',
    description: '',
    authorDetail: ''
  };

  // 提取作者
  try {
    const info = await page.locator('#info').textContent() || '';
    const m = info.match(/作者[:：\s]*([^\n]+)/);
    if (m) result.author = m[1].trim();
  } catch {}

  // 提取并下载封面，然后上传到 image-host-upload
  try {
    const coverImg = page.locator('#mainpic img');
    const coverUrl = await coverImg.getAttribute('src') || '';

    if (coverUrl) {
      console.error(`下载封面: ${coverUrl}`);

      // 生成临时文件路径
      const ext = coverUrl.includes('.jpg') ? 'jpg' : coverUrl.includes('.png') ? 'png' : 'jpg';
      const safeName = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30);
      const localPath = path.join(TEMP_DIR, `${safeName}.${ext}`);

      // 使用 CDP 下载图片（绕过防盗链）
      const client = await page.context().newCDPSession(page);
      await client.send('Page.enable');

      // 右键点击图片并保存
      await coverImg.click({ button: 'right' });
      await page.waitForTimeout(500);

      // 直接通过 fetch 下载（带 referer）
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

      // 写入本地文件
      fs.writeFileSync(localPath, Buffer.from(response));
      console.error(`已保存: ${localPath}`);

      console.error('上传到 image-host-upload...');
      const uploadedUrl = await uploadToImageHost(localPath);
      result.cover = uploadedUrl;
      console.error(`上传成功: ${uploadedUrl}`);

      // 删除临时文件
      fs.unlinkSync(localPath);
    }
  } catch (err) {
    console.error(`封面处理失败: ${err.message}`);
  }

  // 提取内容简介
  try {
    // 点击展开
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

// 主程序
(async () => {
  console.error(`搜索: ${bookTitle}`);

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
  console.error('检测登录...');
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    if (await page.locator('a[href*="/mine"], .nav-user-avatar').count() > 0) {
      console.error('已登录');
      break;
    }
  }

  // 保存cookies
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(await context.cookies(), null, 2));

  // 爬取
  const result = await scrapeBook(page, bookTitle);

  // 保存cookies
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(await context.cookies(), null, 2));

  await browser.close();

  // 写入飞书表格
  if (!result.error && result.author) {
    console.error('\n写入飞书表格...');
    try {
      const token = await getFeishuToken();
      const spreadsheetToken = await getSpreadsheetToken(token);
      const emptyRow = await findEmptyRow(token, spreadsheetToken);

      // A:书名 B:作者 C:封面 D:作者简介 E:内容简介
      const values = [
        result.title,
        result.author,
        result.cover,
        result.authorDetail,
        result.description
      ];

      const success = await writeToFeishu(token, spreadsheetToken, emptyRow, values);

      if (success) {
        result.feishuRow = emptyRow;
        console.error(`✓ 已写入飞书表格第 ${emptyRow} 行`);
      } else {
        result.feishuError = '写入失败';
        console.error('✗ 写入飞书失败');
      }
    } catch (err) {
      result.feishuError = err.message;
      console.error(`✗ 飞书错误: ${err.message}`);
    }
  }

  // 输出JSON
  console.log(JSON.stringify(result, null, 2));
})();
