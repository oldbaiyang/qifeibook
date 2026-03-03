const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PICLIST_API = 'http://127.0.0.1:36677/upload';
const TEMP_DIR = path.join(__dirname, 'temp_hires_covers');

// 所有19本书 + 咸的玩笑
const ALL_BOOKS = [
  { title: '咸的玩笑', search: '咸的玩笑' },
  { title: '真事隐：康熙废储与正史虚构', search: '真事隐 康熙废储' },
  { title: '凯罗斯', search: '凯罗斯 珍妮·埃彭贝克' },
  { title: '烧纸', search: '烧纸 李沧东' },
  { title: '镖⼈：卷十三', search: '镖人 卷十三' },
  { title: '故纸浮生.1-2', search: '故纸浮生' },
  { title: '东京平常日3', search: '东京平常日3' },
  { title: '天色已晚', search: '天色已晚' },
  { title: '蟫', search: '蟫 漫画' },
  { title: '她们的西南联大岁月', search: '她们的西南联大岁月' },
  { title: '鹅之书', search: '鹅之书' },
  { title: '女校之星 3', search: '女校之星 3' },
  { title: '跑外卖：一个女骑手的世界', search: '跑外卖 一个女骑手的世界' },
  { title: '拒绝参加游戏', search: '拒绝参加游戏' },
  { title: '在世与认知', search: '在世与认知' },
  { title: '黄色墙纸：吉尔曼女性小说选', search: '黄色墙纸 吉尔曼' },
  { title: '法兰克福学派入门讲座：从卢卡奇到布莱希特', search: '法兰克福学派入门讲座' },
  { title: '旷野的慰藉', search: '旷野的慰藉' },
  { title: '大限将至', search: '大限将至' },
];

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
  console.log('='.repeat(60));
  console.log('高清封面获取 — 豆瓣搜索页 + 网络拦截');
  console.log('='.repeat(60));

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

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

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const results = [];

  for (let i = 0; i < ALL_BOOKS.length; i++) {
    const book = ALL_BOOKS[i];
    console.log(`\n[${i + 1}/${ALL_BOOKS.length}] ${book.title}`);

    const page = await context.newPage();
    let coverData = null;
    let coverUrl = '';

    try {
      // 拦截 doubanio 图片请求，捕获原始图片数据
      await page.route(/img\d+\.doubanio\.com\/view\/subject\//, async (route) => {
        const url = route.request().url();
        // 只捕获第一张封面图的原始数据
        if (!coverData) {
          try {
            const response = await route.fetch();
            const body = await response.body();
            const ct = response.headers()['content-type'] || '';
            // 验证是真实图片
            if (body.length > 2000 && ((body[0] === 0xff && body[1] === 0xd8) || (body[0] === 0x89 && body[1] === 0x50))) {
              coverData = body;
              coverUrl = url;
            }
            await route.fulfill({ response });
          } catch {
            await route.continue().catch(() => {});
          }
        } else {
          await route.continue().catch(() => {});
        }
      });

      const searchUrl = 'https://search.douban.com/book/subject_search?search_text=' + encodeURIComponent(book.search);
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // 取消路由避免页面关闭后出错
      await page.unrouteAll({ behavior: 'ignoreErrors' });

      if (coverData && coverData.length > 2000) {
        const safeName = book.title.replace(/[^\w\u4e00-\u9fff]/g, '_');
        const imgPath = path.join(TEMP_DIR, `${safeName}.jpg`);
        fs.writeFileSync(imgPath, coverData);
        console.log(`  拦截成功: ${coverUrl.split('/').pop()} (${(coverData.length / 1024).toFixed(1)} KB)`);

        try {
          const cdnUrl = await uploadToPicList(imgPath);
          console.log(`  上传成功: ${cdnUrl}`);
          results.push({ title: book.title, cdnUrl });
        } catch (err) {
          console.log(`  上传失败: ${err.message}`);
        }

        try { fs.unlinkSync(imgPath); } catch {}
      } else {
        console.log('  未拦截到有效图片');
      }
    } catch (err) {
      console.log(`  错误: ${err.message}`);
      await page.unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
    } finally {
      await page.close();
    }

    // 随机延迟 3-6 秒
    const delay = 3000 + Math.random() * 3000;
    await new Promise(r => setTimeout(r, delay));
  }

  await browser.close();

  // 保存结果
  console.log(`\n${'='.repeat(60)}`);
  console.log(`成功获取高清封面: ${results.length}/${ALL_BOOKS.length}`);

  if (results.length > 0) {
    const outputPath = path.join(__dirname, 'hires_covers_result.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`结果已保存到 ${outputPath}`);
  }

  // 清理
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.readdirSync(TEMP_DIR).forEach(f => fs.unlinkSync(path.join(TEMP_DIR, f)));
      fs.rmdirSync(TEMP_DIR);
    }
  } catch {}

  process.exit(0);
})();
