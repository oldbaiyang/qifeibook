#!/usr/bin/env node

import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { deriveBookKeywords } from "./seo_keywords.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourceFile = path.join(projectRoot, "data", "mockData.ts");

function parseArgs(argv) {
  const args = {
    id: null,
    title: null,
    remote: false,
    local: false,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--id") {
      args.id = Number(argv[index + 1]);
      index += 1;
    } else if (arg === "--title") {
      args.title = argv[index + 1];
      index += 1;
    } else if (arg === "--remote") {
      args.remote = true;
    } else if (arg === "--local") {
      args.local = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.id && !args.title) {
    throw new Error("Provide --id <bookId> or --title <bookTitle>.");
  }

  if (!args.dryRun && args.remote === args.local) {
    throw new Error("Choose exactly one target: --remote or --local. Use --dry-run to print SQL only.");
  }

  return args;
}

function extractBooksArray(sourceText) {
  const marker = "export const books: Book[] =";
  const markerIndex = sourceText.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error("Unable to locate exported books array in data/mockData.ts");
  }

  const arrayStart = sourceText.indexOf("[", markerIndex);
  const arrayEnd = sourceText.lastIndexOf("];");

  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error("Unable to extract books array literal from data/mockData.ts");
  }

  const arrayLiteral = sourceText.slice(arrayStart, arrayEnd + 1);
  return Function(`"use strict"; return (${arrayLiteral});`)();
}

function normalizeText(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function requireText(value, fieldName) {
  const text = normalizeText(value);
  if (!text) {
    throw new Error(`Book is missing required field: ${fieldName}`);
  }
  return text;
}

function escapeSql(value) {
  if (value === null || value === undefined || value === "") {
    return "NULL";
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

function integerSql(value) {
  return Number.isFinite(value) ? String(value) : "NULL";
}

function providerFor(linkName) {
  if (linkName.includes("夸克")) return "quark";
  if (linkName.includes("百度")) return "baidu";
  if (linkName.includes("阿里")) return "aliyun";
  if (linkName.includes("迅雷")) return "xunlei";
  return "other";
}

function buildSql(book) {
  const id = Number(book.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid book id: ${book.id}`);
  }

  const title = requireText(book.title, "title");
  const author = normalizeText(book.author) || "未知作者";
  const authorDetail = normalizeText(book.authorDetail);
  const description = normalizeText(book.description);
  const cover = normalizeText(book.cover);
  const year = normalizeText(book.year);
  const publishYear = normalizeText(book.publishYear);
  const format = normalizeText(book.format);
  const size = normalizeText(book.size);
  const category = requireText(book.category, "category");
  const keywords = deriveBookKeywords(book);
  const links = Array.isArray(book.downloadLinks) ? book.downloadLinks : [];

  const lines = [
    `-- Publish ${title} (${id}) to qifeibook D1`,
    "PRAGMA foreign_keys = ON;",
    "",
    `INSERT OR IGNORE INTO categories (slug, name, book_count) VALUES (${escapeSql(category)}, ${escapeSql(category)}, 0);`,
    "",
    `INSERT INTO books (id, slug, title, author, author_detail, description, cover, year, publish_year, format, size, category_id, keywords_json, created_at, updated_at) VALUES (${integerSql(id)}, NULL, ${escapeSql(title)}, ${escapeSql(author)}, ${escapeSql(authorDetail)}, ${escapeSql(description)}, ${escapeSql(cover)}, ${escapeSql(year)}, ${escapeSql(publishYear)}, ${escapeSql(format)}, ${escapeSql(size)}, (SELECT id FROM categories WHERE name = ${escapeSql(category)}), ${escapeSql(JSON.stringify(keywords))}, datetime('now'), datetime('now')) ON CONFLICT(id) DO UPDATE SET title = excluded.title, author = excluded.author, author_detail = excluded.author_detail, description = excluded.description, cover = excluded.cover, year = excluded.year, publish_year = excluded.publish_year, format = excluded.format, size = excluded.size, category_id = excluded.category_id, keywords_json = excluded.keywords_json, updated_at = datetime('now');`,
    "",
    `DELETE FROM download_links WHERE book_id = ${integerSql(id)};`,
  ];

  for (const link of links) {
    const linkName = normalizeText(link.name) || "下载链接";
    const url = normalizeText(link.url);
    if (!url) continue;

    lines.push(
      `INSERT INTO download_links (id, book_id, provider, name, url, code) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM download_links), ${integerSql(id)}, ${escapeSql(providerFor(linkName))}, ${escapeSql(linkName)}, ${escapeSql(url)}, ${escapeSql(link.code)});`,
    );
  }

  lines.push("");
  lines.push("INSERT INTO books_fts(books_fts) VALUES('delete-all');");
  lines.push(
    "INSERT INTO books_fts (rowid, title, author, description, keywords) SELECT id, title, author, description, COALESCE(keywords_json, '') FROM books;",
  );
  lines.push("UPDATE categories SET book_count = (SELECT COUNT(*) FROM books WHERE books.category_id = categories.id);");
  lines.push("");

  return lines.join("\n");
}

function runWrangler(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join("scripts", "run_wrangler_local.mjs"), ...args], {
      cwd: projectRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        WRANGLER_FORCE_NONINTERACTIVE: process.env.WRANGLER_FORCE_NONINTERACTIVE || "1",
      },
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`wrangler exited with code ${code}`));
      }
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceText = await readFile(sourceFile, "utf8");
  const books = extractBooksArray(sourceText);
  const book = books.find((candidate) => (
    args.id ? Number(candidate.id) === args.id : normalizeText(candidate.title) === args.title
  ));

  if (!book) {
    throw new Error(args.id ? `Book id not found: ${args.id}` : `Book title not found: ${args.title}`);
  }

  const sql = buildSql(book);
  if (args.dryRun) {
    console.log(sql);
    return;
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "qifeibook-d1-"));
  const sqlFile = path.join(tempDir, `publish-book-${book.id}.sql`);

  try {
    await writeFile(sqlFile, sql, "utf8");
    await runWrangler([
      "d1",
      "execute",
      "qifeibook",
      args.remote ? "--remote" : "--local",
      "--file",
      sqlFile,
    ]);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  console.log(`Published book ${book.id}: ${book.title}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
