import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const TOKEN = process.env.BAIDU_PUSH_TOKEN;

if (!TOKEN) {
    console.error('Error: BAIDU_PUSH_TOKEN is not defined in .env file');
    process.exit(1);
}

const API_URL = `http://data.zz.baidu.com/urls?site=https://www.qifeibook.com&token=${TOKEN}`;

console.log('Reading sitemap from:', SITEMAP_PATH);
const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Extract URLs
const urlRegex = /<loc>(.*?)<\/loc>/g;
let match;
const urls = [];

while ((match = urlRegex.exec(sitemapContent)) !== null) {
    let url = match[1];
    if (url.startsWith('https://qifeibook.com/')) {
        url = url.replace('https://qifeibook.com/', 'https://www.qifeibook.com/');
    }
    urls.push(url);
}

// Prioritize URLs
const priorityUrls = {
    homepage: [],
    search: [],
    categories: [],
    topBooks: [],
    otherBooks: []
};

urls.forEach(url => {
    if (url === 'https://www.qifeibook.com/') {
        priorityUrls.homepage.push(url);
    } else if (url.includes('/search')) {
        priorityUrls.search.push(url);
    } else if (url.includes('/category/')) {
        priorityUrls.categories.push(url);
    } else if (url.includes('/book/')) {
        // Extract book ID
        const bookId = parseInt(url.split('/book/')[1]);
        // Top books are recent ones (higher IDs)
        if (bookId > 350) {
            priorityUrls.topBooks.push(url);
        } else {
            priorityUrls.otherBooks.push(url);
        }
    }
});

console.log('\n📊 URL Distribution:');
console.log(`  Homepage: ${priorityUrls.homepage.length}`);
console.log(`  Search: ${priorityUrls.search.length}`);
console.log(`  Categories: ${priorityUrls.categories.length}`);
console.log(`  Top Books (ID > 350): ${priorityUrls.topBooks.length}`);
console.log(`  Other Books: ${priorityUrls.otherBooks.length}`);
console.log(`  Total: ${urls.length}`);

// Build priority list (limit to 10 URLs for daily quota)
const urlsToPush = [
    ...priorityUrls.homepage,
    ...priorityUrls.search,
    ...priorityUrls.categories.slice(0, 5), // Top 5 categories
    ...priorityUrls.topBooks.slice(0, 3)    // Top 3 newest books
].slice(0, 10);

console.log(`\n🎯 Pushing ${urlsToPush.length} priority URLs:\n`);
urlsToPush.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

const postData = urlsToPush.join('\n');

console.log('\n⏳ Pushing to Baidu...');
try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: postData
    });

    const result = await response.json();
    console.log('\n📡 Response:');
    console.log('  Status:', response.status);
    console.log('  Result:', JSON.stringify(result, null, 2));

    if (result.success !== undefined) {
        console.log(`\n✅ Successfully pushed ${result.success} URLs`);
        if (result.remain !== undefined) {
            console.log(`📊 Remaining quota today: ${result.remain}`);
        }
    } else if (result.error) {
        console.error(`\n❌ Push failed: ${result.message || 'Unknown error'}`);
        if (result.message === 'over quota') {
            console.log('\n💡 Tip: Daily quota exceeded. Try again tomorrow after 00:00.');
        }
    }
} catch (error) {
    console.error('\n❌ Error pushing to Baidu:', error.message);
}
