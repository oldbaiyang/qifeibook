const DEFAULT_BASE_URL = "http://localhost:8787";
const DEFAULT_MAX_BOOKS = 500;
const PAGE_LIMIT = 50;
const DETAIL_BATCH_SIZE = 10;

function getArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) {
    return fallback;
  }

  return process.argv[index + 1];
}

function buildUrl(baseUrl, path) {
  return new URL(path, baseUrl).toString();
}

async function fetchJson(baseUrl, path) {
  const response = await fetch(buildUrl(baseUrl, path), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }

  return response.json();
}

async function fetchBookSummaries(baseUrl, maxBooks) {
  const books = [];
  let cursor = null;

  while (books.length < maxBooks) {
    const path = cursor
      ? `/api/books?limit=${PAGE_LIMIT}&cursor=${encodeURIComponent(String(cursor))}`
      : `/api/books?limit=${PAGE_LIMIT}`;
    const payload = await fetchJson(baseUrl, path);
    const pageBooks = Array.isArray(payload.books) ? payload.books : [];

    books.push(...pageBooks);

    if (!payload.hasMore || !payload.nextCursor || pageBooks.length === 0) {
      break;
    }

    cursor = payload.nextCursor;
  }

  return books.slice(0, maxBooks);
}

async function fetchDetails(baseUrl, books) {
  const details = [];

  for (let index = 0; index < books.length; index += DETAIL_BATCH_SIZE) {
    const batch = books.slice(index, index + DETAIL_BATCH_SIZE);
    const results = await Promise.allSettled(batch.map((book) => fetchJson(baseUrl, `/api/books/${book.id}`)));

    for (const result of results) {
      if (result.status === "fulfilled") {
        details.push(result.value);
      }
    }
  }

  return details;
}

function sample(items, limit = 20) {
  return items.slice(0, limit);
}

function getKeywordStats(details) {
  const keywordCounts = new Map();
  const booksWithKeywords = [];

  for (const book of details) {
    const keywords = Array.isArray(book.keywords) ? book.keywords.filter((keyword) => String(keyword || "").trim()) : [];

    if (keywords.length > 0) {
      booksWithKeywords.push(book.id);
    }

    for (const keyword of keywords) {
      const normalizedKeyword = String(keyword).trim();
      keywordCounts.set(normalizedKeyword, (keywordCounts.get(normalizedKeyword) ?? 0) + 1);
    }
  }

  const topKeywords = [...keywordCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .map(([name, count]) => ({ name, count }));

  return {
    booksWithKeywords: booksWithKeywords.length,
    keywordCoverageRate: details.length === 0 ? 0 : Number((booksWithKeywords.length / details.length).toFixed(4)),
    emptyKeywords: sample(details.filter((book) => !booksWithKeywords.includes(book.id)).map((book) => book.id)),
    uniqueKeywords: keywordCounts.size,
    indexableKeywords: topKeywords.filter((keyword) => keyword.count >= 3).length,
    topKeywords: sample(topKeywords, 20),
  };
}

function analyze(books, details) {
  const duplicateGroups = new Map();

  for (const book of books) {
    const key = `${book.title || ""}::${book.author || ""}`;
    const group = duplicateGroups.get(key) || [];
    group.push(book.id);
    duplicateGroups.set(key, group);
  }

  const duplicateTitleAuthor = [...duplicateGroups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids }));

  return {
    scannedSummaries: books.length,
    scannedDetails: details.length,
    emptyCovers: sample(books.filter((book) => !book.cover).map((book) => book.id)),
    missingCategories: sample(books.filter((book) => !book.category || !book.categorySlug).map((book) => book.id)),
    shortTitles: sample(books.filter((book) => String(book.title || "").trim().length < 2).map((book) => book.id)),
    emptyDescriptions: sample(details.filter((book) => !String(book.description || "").trim()).map((book) => book.id)),
    emptyDownloadLinks: sample(details.filter((book) => !Array.isArray(book.downloadLinks) || book.downloadLinks.length === 0).map((book) => book.id)),
    keywordStats: getKeywordStats(details),
    duplicateTitleAuthor: sample(duplicateTitleAuthor),
  };
}

async function main() {
  const baseUrl = getArg("--base", DEFAULT_BASE_URL);
  const maxBooks = Number.parseInt(getArg("--max", String(DEFAULT_MAX_BOOKS)), 10);
  const books = await fetchBookSummaries(baseUrl, Number.isFinite(maxBooks) ? maxBooks : DEFAULT_MAX_BOOKS);
  const details = await fetchDetails(baseUrl, books);

  console.log(JSON.stringify(analyze(books, details), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
