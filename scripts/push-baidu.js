import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
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

// Extract URLs using regex
const urlRegex = /<loc>(.*?)<\/loc>/g;
let match;
const urls = [];

while ((match = urlRegex.exec(sitemapContent)) !== null) {
    let url = match[1];
    // Force www if not present
    if (url.startsWith('https://qifeibook.com/')) {
        url = url.replace('https://qifeibook.com/', 'https://www.qifeibook.com/');
    }
    urls.push(url);
}

const uniqueUrls = [...new Set(urls)];
console.log(`Found ${uniqueUrls.length} unique URLs.`);

if (uniqueUrls.length === 0) {
    console.error('No URLs found!');
    process.exit(1);
}

const postData = uniqueUrls.join('\n');

console.log('Pushing URLs to Baidu...');
try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: postData
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Result:', result);

    if (result.success) {
        console.log(`✅ Successfully pushed ${result.success} URLs.`);
        console.log(`Remaining quota: ${result.remain}`);
    } else {
        console.error('❌ Push failed:', result.message || 'Unknown error');
    }
} catch (error) {
    console.error('Error pushing to Baidu:', error);
}
