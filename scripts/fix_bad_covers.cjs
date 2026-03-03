#!/usr/bin/env node
/**
 * 修复 8 本坏封面 — 用非 headless Playwright 绕过豆瓣反爬
 *
 * 策略：
 * 1. 禁用自动化标识（AutomationControlled）
 * 2. 用 networkidle 确保图片完全加载
 * 3. 等待 img 元素的 naturalWidth > 1（确认图片渲染完成）
 * 4. 对 #mainpic img 元素截图
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PICLIST_API = 'http://127.0.0.1:36677/upload';
const TEMP_DIR = path.join(__dirname, 'temp_fix_covers');

const BOOKS_TO_FIX = [
  { row: 318, title: '烧纸', url: 'https://book.douban.com/subject/37281710/' },
  { row: 325, title: '鹅之书', url: 'https://book.douban.com/subject/37374594/' },
  { row: 326, title: '女校之星 3', url: 'https://book.douban.com/subject/37842725/' },
  { row: 327, title: '跑外卖：一个女骑手的世界', url: 'https://book.douban.com/subject/37462151/' },
  { row: 328, title: '拒绝参加游戏', url: 'https://book.douban.com/subject/37897227/' },
  { row: 329, title: '在世与认知', url: 'https://book.douban.com/subject/37112076/' },
  { row: 330, title: '黄色墙纸：吉尔曼女性小说选', url: 'https://book.douban.com/subject/37663131/' },
  { row: 331, title: '法兰克福学派入门讲座：从卢卡奇到布莱希特', url: 'https://book.douban.com/subject/37563197/' },
];

// 还需要处理首次跳过的咸的玩笑
BOOKS_TO_FIX.push({ row: 315, title: '咸的玩笑', url: 'https://book.douban.com/subject/37833272/' });

function uploadToPicList(imagePath) {
  return new Promise((resolve, reject) => {
    const absPath = path.resolve(imagePath);
    const body = JSON.stringify({ list: [absPath] });
    const req = http.request(PICLIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 60000,
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
            reject(new Error(`Upload failed: ${data.slice(0, 200)}`));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('upload timeout')); });
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log('修复坏封面 (9本)\n');

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  // 启动浏览器 — 关键：伪装成真实浏览器
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  // 注入脚本隐藏 webdriver 标识
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const results = [];

  for (let i = 0; i < BOOKS_TO_FIX.length; i++) {
    const book = BOOKS_TO_FIX[i];
    console.log(`[${i + 1}/${BOOKS_TO_FIX.length}] ${book.title}`);

    const page = await context.newPage();
    try {
      await page.goto(book.url, { waitUntil: 'networkidle', timeout: 30000 });

      // 等待封面图元素
      const mainpic = page.locator('#mainpic img');
      await mainpic.waitFor({ state: 'visible', timeout: 10000 });

      // 等待图片真正加载完成（naturalWidth > 1）
      await page.waitForFunction(() => {
        const img = document.querySelector('#mainpic img');
        return img && img.naturalWidth > 1 && img.complete;
      }, { timeout: 10000 });

      // 额外等待确保渲染完成
      await page.waitForTimeout(1000);

      // 截图
      const safeName = book.title.replace(/[^\w\u4e00-\u9fff]/g, '_');
      const imgPath = path.join(TEMP_DIR, `${safeName}.jpg`);
      const coverData = await mainpic.screenshot({ type: 'jpeg', quality: 95 });

      if (coverData && coverData.length > 3000) {
        fs.writeFileSync(imgPath, coverData);
        console.log(`  截图成功 (${(coverData.length / 1024).toFixed(1)} KB)`);

        // 上传图床
        try {
          const cdnUrl = await uploadToPicList(imgPath);
          console.log(`  上传成功: ${cdnUrl}`);
          results.push({ ...book, cdnUrl });
        } catch (err) {
          console.log(`  上传失败: ${err.message}`);
        }

        try { fs.unlinkSync(imgPath); } catch {}
      } else {
        console.log(`  截图太小 (${coverData ? coverData.length : 0} bytes)，图片未加载`);
      }
    } catch (err) {
      console.log(`  错误: ${err.message}`);
    } finally {
      await page.close();
    }

    // 随机延迟 3-6 秒
    const delay = 3000 + Math.random() * 3000;
    await new Promise(r => setTimeout(r, delay));
  }

  await browser.close();

  // 输出结果供后续更新飞书
  console.log(`\n截图成功: ${results.length}/${BOOKS_TO_FIX.length}`);
  if (results.length > 0) {
    const outputPath = path.join(__dirname, 'fix_covers_result.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`结果已保存到 ${outputPath}`);
  }

  // 清理临时目录
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.readdirSync(TEMP_DIR).forEach(f => fs.unlinkSync(path.join(TEMP_DIR, f)));
      fs.rmdirSync(TEMP_DIR);
    }
  } catch {}

  process.exit(0);
})();
