#!/usr/bin/env node
/**
 * 为 categories / authors / tags 三个表自动生成 description 字段。
 *
 * 策略：
 *   - categories：取 top 3 书名 + book_count，拼成 200-260 字描述
 *   - authors：从 books.author_detail 拉一条；无则用模板
 *   - tags：取 top 3 在该标签下的书名 + book_count，拼成 200-260 字描述
 *
 * 用法：
 *   node scripts/generate_descriptions.mjs --local     # 本地 D1
 *   node scripts/generate_descriptions.mjs --remote    # 远端 D1
 *   node scripts/generate_descriptions.mjs --dry-run   # 只生成 SQL，不写库
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(projectRoot, "db", "seed");
const outputFile = path.join(outputDir, "descriptions.sql");

const TARGET_MIN = 180;
const TARGET_MAX = 300;

function parseArgs(argv) {
  const args = { local: false, remote: false, dryRun: false };
  for (const arg of argv) {
    if (arg === "--local") args.local = true;
    else if (arg === "--remote") args.remote = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.dryRun && args.remote === args.local) {
    throw new Error("Choose exactly one target: --local, --remote, or --dry-run.");
  }
  return args;
}

function escapeSqlString(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function truncateChars(text, max) {
  if (!text) return "";
  // 用 [...str].length 正确按字符计（CJK 一个码点算 1）
  const arr = [...text];
  if (arr.length <= max) return text;
  return `${arr.slice(0, max).join("")}…`;
}

function joinTitles(titles) {
  if (!titles || titles.length === 0) return "";
  return titles.map((t) => `《${t}》`).join("");
}

function categoryDescription(name, bookCount, topTitles) {
  const titleList = joinTitles(topTitles.slice(0, 3));
  const titleClause = titleList ? `，包括${titleList}等代表性作品` : "";
  const head = `${name}分类精选 ${bookCount} 本电子书${titleClause}。`;
  const mid = `本分类围绕“${name}”主题展开，汇集该领域的经典与新作，读者可按书名、作者或关键词检索感兴趣的图书。`;
  const tail = `所有图书均提供 EPUB、MOBI、PDF 多种格式下载，覆盖 Kindle、iPad、Android 等主流电子阅读设备，方便收藏与离线阅读。棋飞书库持续整理相关电子书资源，欢迎按分类与标签浏览更多图书。`;
  return clampLength(`${head}${mid}${tail}`);
}

function authorDescription(authorDetail, name, bookCount) {
  // author_detail 可能长达数百字，统一截断到 150 字以避免与正文重复
  let bio = (authorDetail ?? "").replace(/\s+/g, " ").trim();
  if (bio) {
    // 去掉结尾标点，避免与下面追加的「。」重复
    bio = bio.replace(/[。！？，、；：…]+$/u, "");
    bio = truncateChars(bio, 150);
  }
  const head = bio
    ? `${bio}。`
    : `${name}是棋飞书库收录的作家之一，作品涵盖多种题材与体裁，受到不同年龄段读者的关注与阅读。`;
  const mid = `本站收录 ${name} 电子书 ${bookCount} 本，读者可按书名或作品系列快速定位感兴趣的图书，建立完整的阅读清单。`;
  const tail = `全部支持 EPUB、MOBI、PDF 格式免费下载导航，覆盖手机、平板、Kindle 等设备，方便收藏与离线阅读。`;
  return clampLength(`${head}${mid}${tail}`);
}

function tagDescription(name, bookCount, topTitles) {
  const titleList = joinTitles(topTitles.slice(0, 3));
  const titleClause = titleList ? `，包括${titleList}等热门代表作` : "";
  const head = `“${name}”相关电子书汇集 ${bookCount} 本精选作品${titleClause}。`;
  const mid = `本标签围绕“${name}”主题聚合图书，读者可借此发现同主题下的多部作品，快速建立阅读清单。`;
  const tail = `所有图书均提供 EPUB、MOBI、PDF 多种格式下载，覆盖手机、平板、Kindle 等主流阅读设备，方便收藏与离线阅读。棋飞书库持续整理相关电子书资源，欢迎按分类与标签浏览更多图书。`;
  return clampLength(`${head}${mid}${tail}`);
}

function clampLength(text) {
  const arr = [...text];
  if (arr.length > TARGET_MAX) {
    return `${arr.slice(0, TARGET_MAX - 1).join("")}…`;
  }
  if (arr.length >= TARGET_MIN) {
    return text;
  }
  // 短于目标下限时，追加一段不重复的扩展
  const padding = "本站持续整理相关电子书资源，欢迎按分类、作者与标签浏览更多图书，所有图书均提供 EPUB、MOBI、PDF 格式免费下载导航。";
  const combined = `${text}${padding}`;
  const combinedArr = [...combined];
  if (combinedArr.length <= TARGET_MAX) return combined;
  return `${combinedArr.slice(0, TARGET_MAX - 1).join("")}…`;
}

function runWranglerQuery(args, sql) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["wrangler", "d1", "execute", "qifeibook", ...args, "--json", "--command", sql], {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "inherit"],
      env: process.env,
    });
    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`wrangler d1 execute exited with code ${code}`));
        return;
      }
      try {
        // wrangler --json 输出形如 [{ results: [...], success: true, meta: {...} }, ...]
        const parsed = JSON.parse(stdout);
        const first = Array.isArray(parsed) ? parsed[0] : parsed;
        resolve(first?.results ?? []);
      } catch (error) {
        reject(new Error(`Failed to parse wrangler JSON output: ${error.message}\nRaw: ${stdout.slice(0, 500)}`));
      }
    });
  });
}

function runWranglerSqlFile(args, sqlFile) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["wrangler", "d1", "execute", "qifeibook", ...args, "--file", sqlFile], {
      cwd: projectRoot,
      stdio: "inherit",
      env: process.env,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`wrangler d1 execute exited with code ${code}`));
    });
  });
}

async function fetchCategories(target) {
  const sql = `
    SELECT
      c.name,
      c.book_count,
      (
        SELECT json_group_array(b.title)
        FROM (
          SELECT b2.title
          FROM books b2
          WHERE b2.category_id = c.id
          ORDER BY b2.id DESC
          LIMIT 3
        ) b
      ) AS top_titles_json
    FROM categories c
    ORDER BY c.book_count DESC, c.name ASC
  `;
  const rows = await runWranglerQuery(target, sql);
  return rows.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    topTitles: parseJsonArray(row.top_titles_json),
  }));
}

async function fetchAuthors(target) {
  const sql = `
    SELECT
      a.name,
      a.book_count,
      (
        SELECT b.author_detail
        FROM books b
        WHERE b.author = a.name
          AND b.author_detail IS NOT NULL
          AND TRIM(b.author_detail) != ''
        ORDER BY b.id DESC
        LIMIT 1
      ) AS author_detail
    FROM authors a
    ORDER BY a.book_count DESC, a.name ASC
  `;
  const rows = await runWranglerQuery(target, sql);
  return rows.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    authorDetail: row.author_detail ?? "",
  }));
}

async function fetchTags(target) {
  const sql = `
    SELECT
      t.name,
      t.book_count,
      (
        SELECT json_group_array(b.title)
        FROM (
          SELECT b2.title
          FROM books b2
          JOIN book_tags bt ON bt.book_id = b2.id
          WHERE bt.tag_name = t.name
          ORDER BY b2.id DESC
          LIMIT 3
        ) b
      ) AS top_titles_json
    FROM tags t
    ORDER BY t.book_count DESC, t.name ASC
  `;
  const rows = await runWranglerQuery(target, sql);
  return rows.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    topTitles: parseJsonArray(row.top_titles_json),
  }));
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function buildUpdateSql(lines, table, keyCol, keyValue, description) {
  lines.push(`UPDATE ${table} SET description = ${escapeSqlString(description)} WHERE ${keyCol} = ${escapeSqlString(keyValue)};`);
}

function buildSql(categories, authors, tags) {
  const lines = [
    "-- Auto-generated by scripts/generate_descriptions.mjs",
    `-- Generated at ${new Date().toISOString()}`,
    `-- Counts: categories=${categories.length}, authors=${authors.length}, tags=${tags.length}`,
    "",
  ];

  for (const c of categories) {
    const text = categoryDescription(c.name, c.bookCount, c.topTitles);
    buildUpdateSql(lines, "categories", "name", c.name, text);
  }
  lines.push("");

  for (const a of authors) {
    const text = authorDescription(a.authorDetail, a.name, a.bookCount);
    buildUpdateSql(lines, "authors", "name", a.name, text);
  }
  lines.push("");

  for (const t of tags) {
    const text = tagDescription(t.name, t.bookCount, t.topTitles);
    buildUpdateSql(lines, "tags", "name", t.name, text);
  }
  lines.push("");

  return lines.join("\n");
}

function summarizeLengths(items, label) {
  if (items.length === 0) {
    console.log(`  ${label}: 0 rows`);
    return;
  }
  const lengths = items.map((item) => [...item.text].length);
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const below = lengths.filter((l) => l < TARGET_MIN).length;
  const above = lengths.filter((l) => l > TARGET_MAX).length;
  console.log(`  ${label}: ${items.length} rows | chars min=${min} max=${max} avg=${avg} | below ${TARGET_MIN}=${below} above ${TARGET_MAX}=${above}`);
}

const args = parseArgs(process.argv.slice(2));
const target = args.dryRun ? ["--local"] : args.local ? ["--local"] : ["--remote"];

console.log("Reading categories...");
const categories = await fetchCategories(target);
const categoryTexts = categories.map((c) => ({ name: c.name, text: categoryDescription(c.name, c.bookCount, c.topTitles) }));

console.log("Reading authors...");
const authors = await fetchAuthors(target);
const authorTexts = authors.map((a) => ({ name: a.name, text: authorDescription(a.authorDetail, a.name, a.bookCount) }));

console.log("Reading tags...");
const tags = await fetchTags(target);
const tagTexts = tags.map((t) => ({ name: t.name, text: tagDescription(t.name, t.bookCount, t.topTitles) }));

console.log("\nDescription length summary (target: " + TARGET_MIN + "-" + TARGET_MAX + " chars):");
summarizeLengths(categoryTexts, "categories");
summarizeLengths(authorTexts, "authors");
summarizeLengths(tagTexts, "tags");

const sql = buildSql(categories, authors, tags);
await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, sql, "utf8");
console.log(`\nWrote ${outputFile} (${(sql.length / 1024).toFixed(1)} KB)`);

if (args.dryRun) {
  console.log("--dry-run: SQL file generated. Review then apply with --local or --remote.");
} else {
  console.log(`\nApplying to ${args.local ? "local" : "remote"} D1...`);
  await runWranglerSqlFile(target, outputFile);
  console.log(`${args.local ? "Local" : "Remote"} D1 description backfill complete.`);
}