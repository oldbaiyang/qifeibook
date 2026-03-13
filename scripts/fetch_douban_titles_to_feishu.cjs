#!/usr/bin/env node
/**
 * 豆瓣榜单爬虫 - 只爬取书名并写入飞书表格
 *
 * 功能：
 * 1. 爬取豆瓣榜单所有书名
 * 2. 检查书名是否已存在于未发布/已发布/新发布三个sheet页
 * 3. 将新书名插入到未发布sheet页的最后
 *
 * 使用方法：
 *   node scripts/fetch_douban_titles_to_feishu.cjs "榜单URL"
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const COOKIE_FILE = path.join(__dirname, 'douban_cookies.json');

// 飞书配置
const FEISHU_APP_ID = 'cli_a5ac1fa61a78900c';
const FEISHU_APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce';
const FEISHU_WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I';

// Sheet ID
const SHEET_UNPUBLISHED = '22j6ne';  // 未发布
const SHEET_PUBLISHED = '3s5nH2';     // 已发布
const SHEET_NEW_PUBLISH = 'OhClMF';   // 新发布

// 配置
const DELAY_MIN = 1000;
const DELAY_MAX = 2000;

// 获取命令行参数
const listUrl = process.argv[2] || 'https://www.douban.com/doulist/1264675/';

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

async function readSheetValues(token, spreadsheetToken, sheetId, range = 'A1:A1000') {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'open.feishu.cn',
      path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${sheetId}!${range}`,
      headers: { Authorization: `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data?.valueRange?.values || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function appendSheetValues(token, spreadsheetToken, sheetId, startRow, values) {
  return new Promise((resolve, reject) => {
    const endRow = startRow + values.length - 1;
    const body = JSON.stringify({
      valueRange: {
        range: `${sheetId}!A${startRow}:A${endRow}`,
        values: values
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

// 提取单元格值
function extractCellValue(cell) {
  if (!cell) return '';
  if (typeof cell === 'string') return cell.trim();
  if (Array.isArray(cell)) {
    const linkObj = cell.find(item => item && item.link);
    if (linkObj && linkObj.link) return linkObj.link.trim();
    return cell.map(v => typeof v === 'string' ? v : (v.text || '')).join('').trim();
  }
  if (typeof cell === 'object') {
    return cell.link || cell.text || '';
  }
  return String(cell).trim();
}

// ==================== 主程序 ====================

async function main() {
  console.log('========================================');
  console.log('豆瓣榜单爬虫 - 书名采集');
  console.log('========================================\n');

  // 连接飞书
  console.log('连接飞书...');
  const token = await getFeishuToken();
  const spreadsheetToken = await getSpreadsheetToken(token);
  console.log('✓ 飞书连接成功\n');

  // 读取三个sheet页的所有书名
  console.log('读取已有书名...');
  const [unpublishedRows, publishedRows, newPublishRows] = await Promise.all([
    readSheetValues(token, spreadsheetToken, SHEET_UNPUBLISHED, 'A1:A1000'),
    readSheetValues(token, spreadsheetToken, SHEET_PUBLISHED, 'A1:A2000'),
    readSheetValues(token, spreadsheetToken, SHEET_NEW_PUBLISH, 'A1:A500')
  ]);

  // 提取所有已有书名
  const existingTitles = new Set();
  for (const row of unpublishedRows) {
    const title = extractCellValue(row[0]);
    if (title && title !== '书名') existingTitles.add(title);
  }
  for (const row of publishedRows) {
    const title = extractCellValue(row[0]);
    if (title && title !== '书名') existingTitles.add(title);
  }
  for (const row of newPublishRows) {
    const title = extractCellValue(row[0]);
    if (title && title !== '书名') existingTitles.add(title);
  }

  console.log(`✓ 已有书名: ${existingTitles.size} 本`);
  console.log(`  - 未发布: ${unpublishedRows.length - 1} 行`);
  console.log(`  - 已发布: ${publishedRows.length - 1} 行`);
  console.log(`  - 新发布: ${newPublishRows.length - 1} 行\n`);

  // 启动浏览器（静默模式）
  console.log('启动浏览器（静默模式）...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  // 加载 cookies
  if (fs.existsSync(COOKIE_FILE)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf-8'));
    await context.addCookies(cookies);
    console.log('✓ 已加载cookies');
  }

  const page = await context.newPage();

  // 爬取榜单
  console.log(`\n爬取榜单: ${listUrl}`);
  const allTitles = [];
  let pageNum = 1;

  while (true) {
    const pageUrl = listUrl.endsWith('/') ? `${listUrl}?start=${(pageNum - 1) * 25}` : `${listUrl}?start=${(pageNum - 1) * 25}`;
    console.log(`\n第 ${pageNum} 页: ${pageUrl}`);

    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // 检查是否需要登录
      const needLogin = await page.locator('text=登录').count() > 0 && await page.locator('.nav-user-account').count() === 0;
      if (needLogin) {
        console.log('✗ 需要登录豆瓣！');
        break;
      }

      // 提取书名
      const items = await page.locator('.doulist-item').all();
      if (items.length === 0) {
        console.log('  没有更多内容');
        break;
      }

      for (const item of items) {
        try {
          const titleLink = item.locator('.title a').first();
          const title = await titleLink.textContent();
          if (title) {
            const cleanTitle = title.trim();
            allTitles.push(cleanTitle);
            console.log(`  ${allTitles.length}. ${cleanTitle}`);
          }
        } catch (e) {
          // 忽略单个项目错误
        }
      }

      // 检查是否有下一页
      const nextLink = page.locator('.next a');
      if (await nextLink.count() === 0) {
        console.log('  已到最后一页');
        break;
      }

      pageNum++;
      const delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
      await page.waitForTimeout(delay);
    } catch (e) {
      console.log(`  页面加载失败: ${e.message}`);
      break;
    }
  }

  await browser.close();
  console.log(`\n✓ 爬取完成，共 ${allTitles.length} 个书名`);

  // 过滤已存在的书名
  const newTitles = allTitles.filter(title => !existingTitles.has(title));
  console.log(`✓ 去重后: ${newTitles.length} 本新书名`);
  console.log(`  已存在: ${allTitles.length - newTitles.length} 本`);

  if (newTitles.length === 0) {
    console.log('\n没有新书名需要添加');
    return;
  }

  // 显示要添加的书名
  console.log('\n要添加的书名:');
  newTitles.forEach((title, i) => {
    console.log(`  ${i + 1}. ${title}`);
  });

  // 找到未发布sheet的最后一行
  const lastRow = unpublishedRows.length;
  const startRow = lastRow + 1;

  console.log(`\n写入飞书表格（从第 ${startRow} 行开始）...`);

  // 准备写入数据
  const valuesToWrite = newTitles.map(title => [title]);

  // 写入飞书
  const success = await appendSheetValues(token, spreadsheetToken, SHEET_UNPUBLISHED, startRow, valuesToWrite);

  if (success) {
    console.log(`✓ 成功写入 ${newTitles.length} 个书名到未发布工作表`);
  } else {
    console.log('✗ 写入失败');
  }

  console.log('\n========================================');
  console.log('完成!');
  console.log('========================================');
}

main().catch(console.error);
