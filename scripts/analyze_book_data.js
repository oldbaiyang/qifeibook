
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../data/mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf8');

// Quick and dirty extraction of the books array
// We look for "export const books: Book[] = [" and the end of the array
const statrtMarker = 'export const books: Book[] = [';
const startIndex = content.indexOf(statrtMarker);

if (startIndex === -1) {
    console.error('Could not find books array start');
    process.exit(1);
}

const arrayContentStart = startIndex + statrtMarker.length - 1; // include '['

let jsContent = content
    .replace(/import .*?;/g, '')
    .replace(/export interface [\s\S]*?}/g, '') // remove interfaces
    .replace(/export type [\s\S]*?;/g, '')      // remove types
    .replace(/export const /g, 'const ');       // remove export from consts

// Remove type annotations like ": Book[]" or ": any"
jsContent = jsContent.replace(/: Book\[\]/g, '');
jsContent = jsContent.replace(/: DownloadLink\[\]/g, ''); // if any

// Ensure we export it at the end
jsContent += '\nmodule.exports = books;';

// Write to temp file
const tempPath = path.join(__dirname, 'temp_mockData.cjs');
fs.writeFileSync(tempPath, jsContent);

try {
    const books = require('./temp_mockData.cjs');

    // Now analyze
    const total = books.length;
    const noDesc = books.filter(b => !b.description || b.description.trim().length < 20);
    const shortDesc = books.filter(b => b.description && b.description.trim().length >= 20 && b.description.trim().length < 100);
    const noAuthorDetail = books.filter(b => !b.authorDetail || b.authorDetail.trim().length < 10);

    console.log(`=== 书籍数据完整性分析 ===`);
    console.log(`总书籍数: ${total}`);

    console.log(`\n--- 简介缺失/极短 (<20字) ---`);
    console.log(`数量: ${noDesc.length}`);
    if (noDesc.length > 0) {
        noDesc.forEach(b => console.log(`[MISSING_DESC] ${b.id} | ${b.title}`));
    }

    console.log(`\n--- 简介较短 (20-100字) ---`);
    console.log(`数量: ${shortDesc.length}`);
    if (shortDesc.length > 0) {
        // Output format: [SHORT_DESC] ID | Title | Current Length
        shortDesc.forEach(b => console.log(`[SHORT_DESC] ${b.id} | ${b.title} | Len:${b.description.trim().length}`));
    }

    console.log(`\n--- 作者介绍缺失/极短 (<10字) ---`);
    console.log(`数量: ${noAuthorDetail.length}`);
    if (noAuthorDetail.length > 0) {
        noAuthorDetail.forEach(b => console.log(`[MISSING_AUTHOR] ${b.id} | ${b.title}`));
    }

} catch (e) {
    console.error('Error parsing mockData:', e);
} finally {
    // cleanup
    // fs.unlinkSync(tempPath); 
}
