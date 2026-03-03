#!/usr/bin/env node
/**
 * 豆瓣封面获取工具 — 通过豆瓣搜索页 + Playwright 网络拦截获取高清封面
 *
 * 原理：
 *   豆瓣图片 CDN (doubanio.com) 对直接下载做了反爬保护，
 *   但浏览器在渲染搜索结果时会正常加载图片。
 *   本工具通过 Playwright 的 page.route() 拦截浏览器实际发出的图片请求，
 *   直接获取原始图片二进制数据（约 540x800px，30-140KB），绕过 CDN 反爬。
 *
 * 用法：
 *   // 作为模块引入
 *   const { fetchDoubanCovers } = require('./lib/douban_cover_fetcher.cjs');
 *   const results = await fetchDoubanCovers([
 *     { title: '三体', search: '三体 刘慈欣' },
 *     { title: '活着', search: '活着 余华' },
 *   ]);
 *   // results: [{ title: '三体', cdnUrl: 'https://img.aqifei.top/...' }, ...]
 *
 *   // 命令行直接运行
 *   node scripts/lib/douban_cover_fetcher.cjs "三体" "活着" "百年孤独"
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PICLIST_API = 'http://127.0.0.1:36677/upload';
const TEMP_DIR = path.join(__dirname, '..', 'temp_covers_fetcher');

/**
 * 上传图片到本地 PicList 图床
 * @param {string} imagePath - 图片文件绝对路径
 * @returns {Promise<string>} CDN URL
 */
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
            reject(new Error(`PicList 返回异常: ${data.slice(0, 200)}`));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('PicList 上传超时')); });
    req.write(body);
    req.end();
  });
}

/**
 * 批量获取豆瓣封面并上传到图床
 *
 * @param {Array<{title: string, search?: string}>} books
 *   - title: 书名（用于输出和文件命名）
 *   - search: 搜索关键词（可选，默认用 title）
 * @param {Object} [options]
 *   - delay: [min, max] 请求间隔秒数，默认 [3, 6]
 *   - upload: 是否上传到图床，默认 true
 *   - saveTo: 保存图片到指定目录（不指定则用临时目录，处理完删除）
 *   - quiet: 静默模式，不输出日志，默认 false
 * @returns {Promise<Array<{title: string, cdnUrl?: string, localPath?: string, error?: string}>>}
 */
async function fetchDoubanCovers(books, options = {}) {
  const {
    delay = [3, 6],
    upload = true,
    saveTo = null,
    quiet = false,
  } = options;

  const log = quiet ? () => {} : console.log;
  const outputDir = saveTo || TEMP_DIR;

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const results = [];

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const searchText = book.search || book.title;
    log(`[${i + 1}/${books.length}] ${book.title}`);

    const page = await context.newPage();
    let coverData = null;
    let coverFilename = '';

    try {
      // 拦截 doubanio 图片请求，捕获原始二进制数据
      await page.route(/img\d+\.doubanio\.com\/view\/subject\//, async (route) => {
        if (!coverData) {
          try {
            const response = await route.fetch();
            const body = await response.body();
            // 验证 JPEG (ff d8) 或 PNG (89 50) 魔术字节
            if (body.length > 2000 && ((body[0] === 0xff && body[1] === 0xd8) || (body[0] === 0x89 && body[1] === 0x50))) {
              coverData = body;
              coverFilename = route.request().url().split('/').pop();
            }
            await route.fulfill({ response });
          } catch {
            await route.continue().catch(() => {});
          }
        } else {
          await route.continue().catch(() => {});
        }
      });

      const searchUrl = 'https://search.douban.com/book/subject_search?search_text=' + encodeURIComponent(searchText);
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      // 等待搜索结果和封面图片加载
      await page.waitForTimeout(5000);
      await page.unrouteAll({ behavior: 'ignoreErrors' });

      if (coverData && coverData.length > 2000) {
        const safeName = book.title.replace(/[^\w\u4e00-\u9fff]/g, '_');
        const ext = (coverData[0] === 0x89) ? 'png' : 'jpg';
        const imgPath = path.join(outputDir, `${safeName}.${ext}`);
        fs.writeFileSync(imgPath, coverData);
        log(`  封面: ${coverFilename} (${(coverData.length / 1024).toFixed(1)} KB)`);

        const result = { title: book.title, localPath: imgPath };

        if (upload) {
          try {
            result.cdnUrl = await uploadToPicList(imgPath);
            log(`  图床: ${result.cdnUrl}`);
          } catch (err) {
            result.error = `上传失败: ${err.message}`;
            log(`  ${result.error}`);
          }
          // 上传后删除临时文件（除非指定了 saveTo）
          if (!saveTo) {
            try { fs.unlinkSync(imgPath); } catch {}
          }
        }

        results.push(result);
      } else {
        log('  未拦截到有效图片');
        results.push({ title: book.title, error: '未获取到封面' });
      }
    } catch (err) {
      log(`  错误: ${err.message}`);
      results.push({ title: book.title, error: err.message });
      await page.unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
    } finally {
      await page.close();
    }

    // 随机延迟
    if (i < books.length - 1) {
      const wait = delay[0] + Math.random() * (delay[1] - delay[0]);
      await new Promise(r => setTimeout(r, wait * 1000));
    }
  }

  await browser.close();

  // 清理临时目录
  if (!saveTo) {
    try {
      if (fs.existsSync(TEMP_DIR)) {
        fs.readdirSync(TEMP_DIR).forEach(f => fs.unlinkSync(path.join(TEMP_DIR, f)));
        fs.rmdirSync(TEMP_DIR);
      }
    } catch {}
  }

  return results;
}

// ====== 命令行入口 ======
// node scripts/lib/douban_cover_fetcher.cjs "三体" "活着" "百年孤独"
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('用法: node douban_cover_fetcher.cjs "书名1" "书名2" ...');
    console.log('示例: node douban_cover_fetcher.cjs "三体" "活着"');
    process.exit(0);
  }

  const books = args.map(title => ({ title, search: title }));

  console.log('='.repeat(60));
  console.log(`豆瓣封面获取 (${books.length} 本)`);
  console.log('='.repeat(60));

  fetchDoubanCovers(books).then(results => {
    const success = results.filter(r => r.cdnUrl);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`完成: ${success.length}/${results.length} 本成功`);

    if (success.length > 0) {
      console.log('\n结果:');
      success.forEach(r => console.log(`  ${r.title}: ${r.cdnUrl}`));
    }

    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      console.log('\n失败:');
      failed.forEach(r => console.log(`  ${r.title}: ${r.error}`));
    }

    process.exit(0);
  }).catch(err => {
    console.error('致命错误:', err);
    process.exit(1);
  });
}

module.exports = { fetchDoubanCovers, uploadToPicList };
