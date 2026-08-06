#!/usr/bin/env node

import { createRequire } from "node:module";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawn } from "node:child_process";

import { deriveBookKeywords } from "./seo_keywords.mjs";
import { UNIFIED_DOWNLOAD_URL } from "../lib/unified-download.mjs";

const require = createRequire(import.meta.url);
const { uploadToImageHost } = require("./lib/image_host_upload.cjs");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourceFile = path.join(projectRoot, "data", "mockData.ts");
const KEYCHAIN_SERVICE = "qifeibook-cloudflare-api-token";
const KEYCHAIN_ACCOUNT = "qifeibook";

function parseArgs(argv) {
  const args = {
    title: "",
    url: "",
    code: "",
    provider: "",
    cover: "",
    author: "",
    category: "",
    year: "",
    format: "epub",
    remote: true,
    dryRun: false,
    force: false,
    skipMetadata: false,
    skipCoverUpload: false,
    skipPublish: false,
    metadataQuery: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--title") {
      args.title = argv[++index] ?? "";
    } else if (arg === "--url") {
      args.url = argv[++index] ?? "";
    } else if (arg === "--code") {
      args.code = argv[++index] ?? "";
    } else if (arg === "--provider") {
      args.provider = argv[++index] ?? "";
    } else if (arg === "--cover") {
      args.cover = argv[++index] ?? "";
    } else if (arg === "--author") {
      args.author = argv[++index] ?? "";
    } else if (arg === "--category") {
      args.category = argv[++index] ?? "";
    } else if (arg === "--year" || arg === "--publish-year") {
      args.year = argv[++index] ?? "";
    } else if (arg === "--format") {
      args.format = argv[++index] ?? "epub";
    } else if (arg === "--no-remote") {
      args.remote = false;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--skip-metadata") {
      args.skipMetadata = true;
    } else if (arg === "--skip-cover-upload") {
      args.skipCoverUpload = true;
    } else if (arg === "--skip-publish") {
      args.skipPublish = true;
    } else if (arg === "--metadata-query") {
      args.metadataQuery = argv[++index] ?? "";
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.title = args.title.trim();
  args.url = args.url.trim();

  if (!args.title) {
    throw new Error('Provide --title "书名".');
  }

  if (!args.url && !args.dryRun) {
    args.url = UNIFIED_DOWNLOAD_URL;
  }

  return args;
}

function extractBooksArray(sourceText) {
  const marker = "export const books: Book[] =";
  const markerIndex = sourceText.indexOf(marker);
  const arrayStart = sourceText.indexOf("[", markerIndex + marker.length);
  const arrayEnd = sourceText.lastIndexOf("];");

  if (markerIndex === -1 || arrayStart === -1 || arrayEnd === -1) {
    throw new Error("Unable to extract books array from data/mockData.ts.");
  }

  const arrayLiteral = sourceText.slice(arrayStart, arrayEnd + 1);
  const books = Function(`"use strict"; return (${arrayLiteral});`)();
  return { books, arrayStart, arrayEnd };
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeComparable(value) {
  return normalizeText(value).toLowerCase().replace(/[《》"'“”‘’\s]/g, "");
}

function decodeHtml(value) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    middot: "·",
  };

  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => entities[name] ?? match);
}

function stripHtml(value) {
  return decodeHtml(value)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function excerpt(value, maxLength = 380) {
  const text = normalizeText(value);
  return text.length > maxLength ? `${text.slice(0, maxLength)}。` : text;
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://book.douban.com/",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}: ${url}`);
  }

  return response.text();
}

async function fetchDoubanSuggestion(title) {
  const url = `https://book.douban.com/j/subject_suggest?q=${encodeURIComponent(title)}`;
  const payload = JSON.parse(await fetchText(url, { headers: { Accept: "application/json" } }));
  if (!Array.isArray(payload) || payload.length === 0) return null;

  const normalizedTitle = normalizeComparable(title);
  return (
    payload.find((item) => normalizeComparable(item.title) === normalizedTitle) ??
    payload.find((item) => normalizeComparable(item.title).includes(normalizedTitle)) ??
    payload[0]
  );
}

function extractSectionAfterHeading(html, heading) {
  const headingIndex = html.indexOf(`<span>${heading}</span>`);
  if (headingIndex === -1) return "";

  const afterHeading = html.slice(headingIndex);
  const sectionMatch = afterHeading.match(/<div class="indent[^>]*>([\s\S]*?)(?:<h2>|<link rel=|<div id="collector"|$)/);
  return sectionMatch ? stripHtml(sectionMatch[1]) : "";
}

function extractInfoField(html, label) {
  const infoMatch = html.match(/<div id="info"[^>]*>([\s\S]*?)<\/div>/);
  if (!infoMatch) return "";

  const info = stripHtml(infoMatch[1]);
  const line = info.split("\n").find((candidate) => candidate.includes(label));
  if (!line) return "";

  return normalizeText(line.replace(new RegExp(`^${label}\\s*[:：]?\\s*`), ""));
}

async function fetchDoubanDetail(suggestion) {
  if (!suggestion?.url) return {};

  const html = await fetchText(suggestion.url);
  const description = extractSectionAfterHeading(html, "内容简介");
  const authorDetail = extractSectionAfterHeading(html, "作者简介");
  const authorFromInfo = extractInfoField(html, "作者");
  const published = extractInfoField(html, "出版年");

  return {
    doubanUrl: suggestion.url,
    title: suggestion.title,
    author: authorFromInfo || suggestion.author_name || "",
    year: String(published || suggestion.year || "").match(/\d{4}/)?.[0] ?? "",
    cover: suggestion.pic || "",
    description,
    authorDetail,
  };
}

function inferCategory(book, existingCategories) {
  if (book.category) return book.category;

  const text = [book.title, book.description].join(" ");
  const rules = [
    ["悬疑推理", ["悬疑", "推理", "侦探", "刑侦", "犯罪", "谜案"]],
    ["科幻奇幻", ["科幻", "奇幻", "未来", "赛博朋克"]],
    ["历史人文", ["历史", "王朝", "帝国", "战争"]],
    ["社会文化", ["社会学", "人类学", "文化研究", "公共", "社会"]],
    ["科普读物", ["科学", "宇宙", "物理", "数学", "生物", "人工智能"]],
    ["商业经济", ["商业", "经济", "管理", "创业", "投资"]],
    ["心理学", ["心理", "情绪", "人格", "咨询"]],
    ["家庭教育", ["家庭教育", "亲子", "育儿"]],
    ["艺术设计", ["艺术", "设计", "美学"]],
    ["外国文学", ["外国文学", "英国作家", "美国作家", "日本作家", "法国作家", "德国作家"]],
  ];

  for (const [category, patterns] of rules) {
    if (patterns.some((pattern) => text.includes(pattern)) && existingCategories.has(category)) {
      return category;
    }
  }

  return existingCategories.has("文学小说") ? "文学小说" : [...existingCategories][0] ?? "文学小说";
}

function inferProvider(url, provider) {
  if (provider) return provider;
  if (url.includes("pan.quark.cn")) return "夸克网盘";
  if (url.includes("pan.baidu.com")) return "百度网盘";
  if (url.includes("aliyundrive.com") || url.includes("alipan.com")) return "阿里云盘";
  if (url.includes("xunlei.com")) return "迅雷云盘";
  return "下载链接";
}

function buildFallbackDescription(book) {
  const author = book.author || "作者";
  const category = book.category || "文学小说";
  return `《${book.title}》是${author}的作品，适合关注${category}、主题阅读和电子书收藏的读者。书中围绕人物、情节与时代背景展开，兼具可读性和讨论空间。\n\n本条目根据公开书目信息整理，保留书名、作者、出版年份、分类、下载方式和关键词，方便读者在棋飞书库中检索、浏览和获取电子书资源。`;
}

function buildFallbackAuthorDetail(book) {
  if (!book.author) return "作者信息待补充。本条目根据公开书目信息整理，后续可继续完善作者简介。";
  return `${book.author}，作家。本条目根据公开书目信息整理，后续可继续完善作者经历、代表作品和创作特点。`;
}

async function prepareCover(url, title, { skipCoverUpload }) {
  if (!url) return "";
  if (url.includes("img.aqifei.top")) return url;
  if (skipCoverUpload) return url;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://book.douban.com/",
    },
  });

  if (!response.ok) {
    throw new Error(`Cover download failed ${response.status}: ${url}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const ext = contentType.includes("png") ? "png" : "jpg";
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "qifeibook-cover-"));
  const safeTitle = title.replace(/[^\da-zA-Z\u4e00-\u9fa5_-]/g, "_").slice(0, 40);
  const localPath = path.join(tempDir, `${safeTitle}.${ext}`);

  try {
    await writeFile(localPath, Buffer.from(await response.arrayBuffer()));
    return await uploadToImageHost(localPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function formatBookObject(book) {
  return JSON.stringify(book, null, 4).replace(/^/gm, "  ");
}

async function writeBookToSource(sourceText, book, arrayStart) {
  const insertAt = arrayStart + 1;
  const bookText = `\n\n${formatBookObject(book)},`;
  await writeFile(sourceFile, `${sourceText.slice(0, insertAt)}${bookText}${sourceText.slice(insertAt)}`, "utf8");
}

function getCloudflareApiToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;

  try {
    return execFileSync("security", [
      "find-generic-password",
      "-a",
      KEYCHAIN_ACCOUNT,
      "-s",
      KEYCHAIN_SERVICE,
      "-w",
    ], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: options.stdio ?? "inherit",
      env: { ...process.env, ...(options.env ?? {}) },
    });

    let stdout = "";
    if (child.stdout) child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function publishBook(bookId, remote) {
  const args = ["scripts/publish_book_to_d1.mjs", "--id", String(bookId), remote ? "--remote" : "--local"];
  const env = {};

  if (remote) {
    const token = getCloudflareApiToken();
    if (!token) {
      throw new Error(`Remote publish needs CLOUDFLARE_API_TOKEN or macOS Keychain item ${KEYCHAIN_SERVICE}.`);
    }
    env.CLOUDFLARE_API_TOKEN = token;
  }

  await runCommand(process.execPath, args, { env });
}

async function verifyOnline(book) {
  const searchUrl = `https://qifeibook.com/api/search?q=${encodeURIComponent(book.title)}`;
  const detailUrl = `https://qifeibook.com/api/books/${book.id}`;
  const htmlUrl = `https://qifeibook.com/book/${book.id}`;

  const [search, detail, html] = await Promise.all([
    fetch(searchUrl).then((response) => response.json()),
    fetch(detailUrl).then((response) => response.json()),
    fetch(htmlUrl).then((response) => response.text()),
  ]);

  const foundInSearch = search.found === true && search.books?.some((candidate) => Number(candidate.id) === book.id);
  const detailOk = Number(detail.id) === book.id && detail.downloadLinks?.length > 0;
  const htmlOk = html.includes(book.title) && html.includes(book.cover) && html.includes(book.downloadLinks[0].name);

  if (!foundInSearch || !detailOk || !htmlOk) {
    throw new Error(`Production verification failed: search=${foundInSearch}, detail=${detailOk}, html=${htmlOk}`);
  }

  return { searchUrl, detailUrl, htmlUrl };
}

async function buildBook(args, existingBooks) {
  const existingCategories = new Set(existingBooks.map((book) => book.category).filter(Boolean));
  let metadata = {};

  if (!args.skipMetadata) {
    try {
      const suggestion = await fetchDoubanSuggestion(args.metadataQuery || args.title);
      metadata = await fetchDoubanDetail(suggestion);
    } catch (error) {
      console.warn(`Metadata lookup failed, using fallback fields: ${error.message}`);
    }
  }

  const book = {
    id: Math.max(0, ...existingBooks.map((candidate) => Number(candidate.id) || 0)) + 1,
    title: args.title,
    author: args.author || metadata.author || "未知作者",
    authorDetail: "",
    year: args.year || metadata.year || "",
    cover: args.cover || metadata.cover || "",
    description: "",
    category: args.category || "",
    downloadLinks: [
      {
        name: inferProvider(args.url, args.provider),
        url: args.url,
        ...(args.code ? { code: args.code } : {}),
      },
    ],
    size: "",
    format: args.format,
    publishYear: args.year || metadata.year || "",
    keywords: [],
  };

  book.category = inferCategory({ ...book, description: metadata.description ?? "" }, existingCategories);
  book.description = excerpt(metadata.description) || buildFallbackDescription(book);
  book.authorDetail = excerpt(metadata.authorDetail) || buildFallbackAuthorDetail(book);
  book.cover = await prepareCover(book.cover, book.title, {
    skipCoverUpload: args.skipCoverUpload || args.dryRun,
  });

  if (!book.cover) {
    throw new Error("No cover found. Provide --cover <image-url>.");
  }

  book.keywords = deriveBookKeywords({
    ...book,
    keywords: [
      book.title,
      book.author,
      book.category,
      ...(book.description.includes("悬疑") ? ["悬疑推理"] : []),
      ...(book.description.includes("刑侦") ? ["刑侦悬疑"] : []),
      ...(book.description.includes("网络") ? ["网络文学"] : []),
    ],
  });

  return book;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceText = await readFile(sourceFile, "utf8");
  const { books, arrayStart } = extractBooksArray(sourceText);
  const duplicate = books.find((book) => normalizeComparable(book.title) === normalizeComparable(args.title));

  if (duplicate && !args.force) {
    throw new Error(`Book already exists: ${duplicate.title} (id ${duplicate.id}). Use --force to add another edition.`);
  }

  const book = await buildBook(args, books);

  if (args.dryRun) {
    console.log(JSON.stringify(book, null, 2));
    return;
  }

  await writeBookToSource(sourceText, book, arrayStart);
  console.log(`Added book ${book.id}: ${book.title}`);

  if (args.skipPublish) {
    console.log(`Skipped D1 publish for ${book.id}: ${book.title} (--skip-publish).`);
    return;
  }

  await publishBook(book.id, args.remote);
  console.log(`Published book ${book.id} to ${args.remote ? "remote" : "local"} D1.`);

  if (args.remote) {
    const verification = await verifyOnline(book);
    console.log(`Verified production: ${verification.htmlUrl}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
