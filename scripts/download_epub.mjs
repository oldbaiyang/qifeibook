#!/usr/bin/env node

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

const USER_AGENT = "qifeibook-epub-downloader/1.0 (+https://qifeibook.com)";
const EPUB_MIMETYPE = "application/epub+zip";
const DEFAULT_OUT_DIR = "downloads";
const MAX_CANDIDATES = 10;

function parseArgs(argv) {
  const args = {
    title: "",
    url: "",
    out: DEFAULT_OUT_DIR,
    pick: null,
    force: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--url") {
      args.url = argv[++index] ?? "";
    } else if (arg === "--out") {
      args.out = argv[++index] ?? "";
    } else if (arg === "--pick") {
      const value = Number.parseInt(argv[++index] ?? "", 10);
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("Provide --pick as a 1-based positive number.");
      }
      args.pick = value;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      args.title = args.title ? `${args.title} ${arg}` : arg;
    }
  }

  args.title = normalizeWhitespace(args.title);
  args.url = args.url.trim();
  args.out = args.out.trim() || DEFAULT_OUT_DIR;

  if (!args.help && !args.title && !args.url) {
    throw new Error('Provide a book title or --url "https://example.com/book.epub".');
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/download_epub.mjs "Book title"
  node scripts/download_epub.mjs "Book title" --out ./downloads
  node scripts/download_epub.mjs "Book title" --pick 1
  node scripts/download_epub.mjs --url "https://example.com/book.epub" --out ./downloads

Options:
  --out <dir>    Output directory. Defaults to ./downloads
  --pick <n>     Download the selected candidate from search results
  --force        Overwrite an existing output file
  --url <url>    Download an authorized EPUB direct URL
  --help         Show this help

Sources:
  Project Gutenberg, Standard Ebooks, Internet Archive public EPUB files, and authorized direct EPUB URLs.
`);
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function sanitizeFilename(value) {
  const sanitized = normalizeWhitespace(value)
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\.+$/g, "")
    .slice(0, 160)
    .trim();

  return sanitized || "book";
}

function makeOutputFilename(candidate, fallbackTitle = "book") {
  const title = candidate.title || fallbackTitle;
  const author = candidate.author ? ` - ${candidate.author}` : "";
  return `${sanitizeFilename(`${title}${author}`)}.epub`;
}

function comparable(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[《》"'“”‘’()[\]{}:：,，.。!！?？\s_-]/g, "");
}

function scoreCandidate(candidate, title) {
  const wanted = comparable(title);
  const candidateTitle = comparable(candidate.title);
  if (!wanted || !candidateTitle) return 0;
  if (candidateTitle === wanted) return 100;
  if (candidateTitle.startsWith(wanted)) return 80;
  if (candidateTitle.includes(wanted)) return 60;
  if (wanted.includes(candidateTitle)) return 40;
  return 10;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}: ${url}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xml,text/xml;q=0.9,*/*;q=0.8",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}: ${url}`);
  }

  return response.text();
}

async function searchProjectGutenberg(title) {
  const endpoint = `https://gutendex.com/books?search=${encodeURIComponent(title)}`;
  const payload = await fetchJson(endpoint);
  const results = Array.isArray(payload.results) ? payload.results : [];

  return results
    .flatMap((book) => {
      const formats = book.formats && typeof book.formats === "object" ? book.formats : {};
      const epubUrl =
        formats["application/epub+zip"] ??
        Object.entries(formats).find(([mime, url]) => mime.includes("epub") && String(url).endsWith(".epub"))?.[1];

      if (!epubUrl) return [];

      return [
        {
          source: "Project Gutenberg",
          title: normalizeWhitespace(book.title),
          author: normalizeWhitespace(book.authors?.[0]?.name ?? ""),
          url: epubUrl,
          detailUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
        },
      ];
    })
    .slice(0, MAX_CANDIDATES);
}

async function searchInternetArchive(title) {
  const query = `title:(${JSON.stringify(title)}) AND mediatype:texts`;
  const url = new URL("https://archive.org/advancedsearch.php");
  url.searchParams.set("q", query);
  url.searchParams.append("fl[]", "identifier");
  url.searchParams.append("fl[]", "title");
  url.searchParams.append("fl[]", "creator");
  url.searchParams.set("rows", "10");
  url.searchParams.set("output", "json");

  const payload = await fetchJson(url.toString());
  const docs = Array.isArray(payload.response?.docs) ? payload.response.docs : [];
  const candidates = [];

  for (const doc of docs) {
    if (!doc.identifier) continue;

    try {
      const metadata = await fetchJson(`https://archive.org/metadata/${encodeURIComponent(doc.identifier)}`);
      const epubFile = metadata.files?.find((file) => {
        const name = String(file.name ?? "");
        const format = String(file.format ?? "");
        return name.toLowerCase().endsWith(".epub") || /epub/i.test(format);
      });

      if (!epubFile?.name) continue;

      const creator = Array.isArray(doc.creator) ? doc.creator[0] : doc.creator;
      candidates.push({
        source: "Internet Archive",
        title: normalizeWhitespace(doc.title),
        author: normalizeWhitespace(creator ?? ""),
        url: `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${encodeURI(epubFile.name)}`,
        detailUrl: `https://archive.org/details/${encodeURIComponent(doc.identifier)}`,
      });
    } catch (error) {
      console.warn(`Skipping Internet Archive item ${doc.identifier}: ${error.message}`);
    }
  }

  return candidates.slice(0, MAX_CANDIDATES);
}

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function searchStandardEbooks(title) {
  const html = await fetchText(`https://standardebooks.org/ebooks?query=${encodeURIComponent(title)}`);
  const candidates = [];
  const seen = new Set();
  const linkPattern = /<a[^>]+href="(\/ebooks\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html)) !== null && candidates.length < MAX_CANDIDATES) {
    const href = decodeHtml(match[1]);
    if (seen.has(href) || href.includes("/downloads/")) continue;

    const text = decodeHtml(match[2].replace(/<[^>]+>/g, " "));
    const label = normalizeWhitespace(text);
    if (!label || comparable(label).length < 2) continue;
    seen.add(href);

    const detailUrl = `https://standardebooks.org${href}`;
    const downloadUrl = await findStandardEbooksDownloadUrl(detailUrl);
    if (downloadUrl) {
      candidates.push({
        source: "Standard Ebooks",
        title: label,
        author: "",
        url: downloadUrl,
        detailUrl,
      });
    }
  }

  return candidates;
}

async function findStandardEbooksDownloadUrl(detailUrl) {
  const html = await fetchText(detailUrl);
  const links = [...html.matchAll(/href="([^"]+\.epub)"/gi)]
    .map((match) => decodeHtml(match[1]))
    .filter((href) => !href.includes(".kepub.") && !href.includes("_advanced."));
  const href = links[0];
  if (!href) return "";

  const url = new URL(href.startsWith("http") ? href : `https://standardebooks.org${href}`);
  url.searchParams.set("source", "download");
  return url.toString();
}

async function searchAllSources(title) {
  const searches = await Promise.allSettled([
    withSourceName("Project Gutenberg", searchProjectGutenberg(title)),
    withSourceName("Standard Ebooks", searchStandardEbooks(title)),
    withSourceName("Internet Archive", searchInternetArchive(title)),
  ]);
  const candidates = searches.flatMap((result) => {
    if (result.status === "fulfilled") return result.value;
    console.warn(`Search source failed (${result.reason.sourceName}): ${result.reason.message}`);
    return [];
  });

  return dedupeCandidates(candidates)
    .map((candidate) => ({ ...candidate, score: scoreCandidate(candidate, title) }))
    .sort((a, b) => b.score - a.score || a.source.localeCompare(b.source))
    .slice(0, MAX_CANDIDATES);
}

async function withSourceName(sourceName, promise) {
  try {
    return await promise;
  } catch (error) {
    error.sourceName = sourceName;
    throw error;
  }
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const deduped = [];

  for (const candidate of candidates) {
    const key = candidate.url;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(candidate);
  }

  return deduped;
}

function printCandidates(candidates) {
  console.log("Multiple EPUB candidates found. Re-run with --pick <n> to download one:\n");
  candidates.forEach((candidate, index) => {
    const author = candidate.author ? ` - ${candidate.author}` : "";
    console.log(`${index + 1}. [${candidate.source}] ${candidate.title}${author}`);
    console.log(`   ${candidate.detailUrl || candidate.url}`);
  });
}

function isAllowedEpubResponse(url, response) {
  const pathname = new URL(response.url || url).pathname.toLowerCase();
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  return (
    pathname.endsWith(".epub") ||
    contentType.includes("application/epub+zip") ||
    contentType.includes("application/zip") ||
    contentType.includes("application/octet-stream")
  );
}

async function downloadCandidate(candidate, outDir, { force }) {
  const response = await fetch(candidate.url, {
    redirect: "follow",
    headers: {
      Accept: `${EPUB_MIMETYPE},application/zip,application/octet-stream;q=0.8,*/*;q=0.1`,
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Download failed ${response.status}: ${candidate.url}`);
  }

  if (!isAllowedEpubResponse(candidate.url, response)) {
    const contentType = response.headers.get("content-type") ?? "unknown";
    throw new Error(`Refusing non-EPUB response. Content-Type: ${contentType}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  validateEpub(bytes);

  await mkdir(outDir, { recursive: true });
  const filename = makeOutputFilename(candidate);
  const filePath = path.resolve(outDir, filename);

  try {
    await writeFile(filePath, bytes, { flag: force ? "w" : "wx" });
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error(`Output file already exists: ${filePath}. Use --force to overwrite.`);
    }

    await rm(filePath, { force: true }).catch(() => {});
    throw error;
  }

  return filePath;
}

function validateEpub(bytes) {
  if (bytes.length === 0) {
    throw new Error("Downloaded file is empty.");
  }

  if (bytes.length < 22 || bytes.readUInt32LE(0) !== 0x04034b50) {
    throw new Error("Downloaded file is not a valid ZIP/EPUB file.");
  }

  const mimetype = readZipEntry(bytes, "mimetype");
  if (!mimetype) {
    throw new Error("Invalid EPUB: missing mimetype file.");
  }

  if (mimetype.toString("utf8").trim() !== EPUB_MIMETYPE) {
    throw new Error("Invalid EPUB: mimetype is not application/epub+zip.");
  }
}

function readZipEntry(bytes, wantedName) {
  const eocdOffset = findEndOfCentralDirectory(bytes);
  if (eocdOffset === -1) return null;

  const totalEntries = bytes.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = bytes.readUInt32LE(eocdOffset + 16);
  let offset = centralDirectoryOffset;

  for (let entry = 0; entry < totalEntries; entry += 1) {
    if (offset + 46 > bytes.length || bytes.readUInt32LE(offset) !== 0x02014b50) return null;

    const method = bytes.readUInt16LE(offset + 10);
    const compressedSize = bytes.readUInt32LE(offset + 20);
    const filenameLength = bytes.readUInt16LE(offset + 28);
    const extraLength = bytes.readUInt16LE(offset + 30);
    const commentLength = bytes.readUInt16LE(offset + 32);
    const localHeaderOffset = bytes.readUInt32LE(offset + 42);
    const filenameStart = offset + 46;
    const filenameEnd = filenameStart + filenameLength;
    const filename = bytes.subarray(filenameStart, filenameEnd).toString("utf8");

    if (filename === wantedName) {
      return readLocalZipEntry(bytes, localHeaderOffset, method, compressedSize);
    }

    offset = filenameEnd + extraLength + commentLength;
  }

  return null;
}

function readLocalZipEntry(bytes, localHeaderOffset, method, compressedSize) {
  if (localHeaderOffset + 30 > bytes.length || bytes.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    return null;
  }

  const filenameLength = bytes.readUInt16LE(localHeaderOffset + 26);
  const extraLength = bytes.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + filenameLength + extraLength;
  const dataEnd = dataStart + compressedSize;
  if (dataEnd > bytes.length) return null;

  const payload = bytes.subarray(dataStart, dataEnd);
  if (method === 0) return payload;
  if (method === 8) return inflateRawSync(payload);
  return null;
}

function findEndOfCentralDirectory(bytes) {
  const minOffset = Math.max(0, bytes.length - 22 - 0xffff);

  for (let offset = bytes.length - 22; offset >= minOffset; offset -= 1) {
    if (bytes.readUInt32LE(offset) === 0x06054b50) return offset;
  }

  return -1;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const outDir = path.resolve(args.out);
  let candidate;

  if (args.url) {
    candidate = {
      source: "Direct URL",
      title: args.title || path.basename(new URL(args.url).pathname, ".epub") || "book",
      author: "",
      url: args.url,
      detailUrl: args.url,
    };
  } else {
    const candidates = await searchAllSources(args.title);
    if (candidates.length === 0) {
      throw new Error(`No legal EPUB candidates found for: ${args.title}`);
    }

    if (args.pick === null) {
      if (candidates.length === 1) {
        candidate = candidates[0];
      } else {
        printCandidates(candidates);
        return;
      }
    } else {
      candidate = candidates[args.pick - 1];
      if (!candidate) {
        throw new Error(`--pick ${args.pick} is out of range. Found ${candidates.length} candidates.`);
      }
    }
  }

  const filePath = await downloadCandidate(candidate, outDir, { force: args.force });
  console.log(`Downloaded: ${filePath}`);
}

run().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
