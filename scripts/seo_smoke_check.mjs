const DEFAULT_BASE_URL = "http://localhost:8787";
const DEFAULT_FETCH_TIMEOUT_MS = 20000;
const DEFAULT_FETCH_RETRIES = 2;

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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithRetry(url, options = {}) {
  const timeoutMs = Number.parseInt(getArg("--timeout-ms", String(DEFAULT_FETCH_TIMEOUT_MS)), 10);
  const retries = Number.parseInt(getArg("--retries", String(DEFAULT_FETCH_RETRIES)), 10);
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_FETCH_TIMEOUT_MS);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } catch (error) {
      lastError = error;
      if (attempt >= retries) {
        break;
      }
      await sleep(500 * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

async function fetchText(baseUrl, path) {
  const response = await fetchWithRetry(buildUrl(baseUrl, path));
  const text = await response.text();

  return {
    path,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    text,
  };
}

async function fetchJson(baseUrl, path) {
  const response = await fetchWithRetry(buildUrl(baseUrl, path), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }

  return response.json();
}

function checkHtml(page, options = {}) {
  const canonicalMatch = page.text.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const jsonLdBlocks = [...page.text.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  const parsedJsonLdBlocks = jsonLdBlocks.flatMap((block) => {
    try {
      return [JSON.parse(block)];
    } catch {
      return [];
    }
  });
  const checks = {
    okStatus: page.status >= 200 && page.status < 300,
    hasTitle: /<title>[^<]+<\/title>/i.test(page.text),
    hasDescription: /<meta\s+name="description"\s+content="[^"]+"/i.test(page.text),
    hasCanonical: Boolean(canonicalMatch),
    canonicalUsesProductionHost: canonicalMatch ? canonicalMatch[1].startsWith("https://qifeibook.com/") : false,
    hasRobots: /<meta\s+name="robots"\s+content="[^"]+"/i.test(page.text),
    hasH1: /<h1[\s>]/i.test(page.text),
    hasJsonLd: /type="application\/ld\+json"/i.test(page.text),
    jsonLdParses: jsonLdBlocks.length > 0 && jsonLdBlocks.every((block) => {
      try {
        JSON.parse(block);
        return true;
      } catch {
        return false;
      }
    }),
  };

  if (options.robots) {
    checks.hasExpectedRobots = new RegExp(`<meta\\s+name="robots"\\s+content="${options.robots}"`, "i").test(page.text);
  }

  if (options.canonical) {
    checks.hasExpectedCanonical = canonicalMatch?.[1] === options.canonical;
  }

  if (options.jsonLdType) {
    checks.hasExpectedJsonLdType = parsedJsonLdBlocks.some((block) => {
      if (block?.["@type"] === options.jsonLdType) {
        return true;
      }
      return Array.isArray(block?.["@graph"]) && block["@graph"].some((node) => node?.["@type"] === options.jsonLdType);
    });
  }

  return {
    path: page.path,
    status: page.status,
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

function checkText(page, expectedPattern) {
  const checks = {
    okStatus: page.status >= 200 && page.status < 300,
    isText: page.contentType.includes("text/plain"),
    hasExpectedContent: expectedPattern.test(page.text),
  };

  return {
    path: page.path,
    status: page.status,
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

function checkXml(page, expectedPattern) {
  const checks = {
    okStatus: page.status >= 200 && page.status < 300,
    isXml: page.contentType.includes("xml"),
    hasExpectedRoot: expectedPattern.test(page.text),
  };

  return {
    path: page.path,
    status: page.status,
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

function checkRobots(page) {
  const checks = {
    okStatus: page.status >= 200 && page.status < 300,
    hasSitemap: /Sitemap:\s*https:\/\/qifeibook\.com\/sitemap\.xml/i.test(page.text),
    blocksApi: /Disallow:\s*\/api\//i.test(page.text),
  };

  return {
    path: page.path,
    status: page.status,
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

function checkCategorySitemap(page) {
  const aliasPaths = [
    "/category/%E4%B8%AD%E5%8C%BB%E5%85%BB%E7%94%9F",
    "/category/%E5%8E%86%E5%8F%B2",
    "/category/%E5%B0%8F%E8%AF%B4%E6%96%87%E5%AD%A6",
    "/category/%E5%BF%83%E7%90%86%E5%8A%9B%E5%BF%97",
    "/category/%E5%BF%83%E7%90%86%E7%99%BE%E7%A7%91",
    "/category/%E5%BF%83%E7%90%86%E8%87%AA%E5%8A%A9",
    "/category/%E6%8E%A8%E7%90%86%E5%B0%8F%E8%AF%B4",
    "/category/%E7%A7%91%E5%B9%BB%E6%82%AC%E7%96%91",
    "/category/%E7%A7%91%E6%99%AE%E7%99%BE%E7%A7%91",
    "/category/%E7%A7%91%E6%99%AE%E8%AF%BB%E7%89%A9",
    "/category/%E7%AB%A5%E4%B9%A6%E7%BB%98%E6%9C%AC",
    "/category/%E7%BD%91%E7%BB%9C%E6%96%87%E5%AD%A6",
    "/category/%E9%83%BD%E5%B8%82%E8%A8%80%E6%83%85",
  ];
  const locs = [...page.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const aliasedLocs = aliasPaths.map((path) => `https://qifeibook.com${path}`).filter((url) => locs.includes(url));
  const xmlCheck = checkXml(page, /<urlset[\s>]/i);

  return {
    ...xmlCheck,
    checks: {
      ...xmlCheck.checks,
      excludesCategoryAliasUrls: aliasedLocs.length === 0,
    },
    aliasedLocs,
    pass: xmlCheck.pass && aliasedLocs.length === 0,
  };
}

async function main() {
  const baseUrl = getArg("--base", DEFAULT_BASE_URL);
  const booksPayload = await fetchJson(baseUrl, "/api/books?limit=1");
  const sampleBook = Array.isArray(booksPayload.books) ? booksPayload.books[0] : null;
  const sampleAuthor = Array.isArray(booksPayload.books) && booksPayload.books[0]?.author
    ? String(booksPayload.books[0].author)
    : null;
  const pages = await Promise.all([
    fetchText(baseUrl, "/"),
    fetchText(baseUrl, "/page/2"),
    fetchText(baseUrl, "/search"),
    sampleBook?.id ? fetchText(baseUrl, `/book/${encodeURIComponent(String(sampleBook.id))}`) : null,
    sampleAuthor ? fetchText(baseUrl, `/author/${encodeURIComponent(sampleAuthor)}`) : null,
    fetchText(baseUrl, "/sitemap.xml"),
    fetchText(baseUrl, "/sitemap-index.xml"),
    fetchText(baseUrl, "/sitemaps/static.xml"),
    fetchText(baseUrl, "/sitemaps/categories.xml"),
    fetchText(baseUrl, "/sitemaps/authors.xml"),
    fetchText(baseUrl, "/sitemaps/tags.xml"),
    fetchText(baseUrl, "/sitemaps/books-1.xml"),
    fetchText(baseUrl, "/robots.txt"),
    fetchText(baseUrl, "/llms.txt"),
  ]);

  const results = [
    checkHtml(pages[0]),
    checkHtml(pages[1]),
    checkHtml(pages[2], { canonical: "https://qifeibook.com/search", robots: "noindex,follow" }),
    ...(pages[3] ? [checkHtml(pages[3], { jsonLdType: "FAQPage" })] : []),
    ...(pages[4] ? [checkHtml(pages[4])] : []),
    checkXml(pages[5], /<urlset[\s>]/i),
    checkXml(pages[6], /<sitemapindex[\s>]/i),
    checkXml(pages[7], /<urlset[\s>]/i),
    checkCategorySitemap(pages[8]),
    checkXml(pages[9], /<urlset[\s>]/i),
    checkXml(pages[10], /<urlset[\s>]/i),
    checkXml(pages[11], /<urlset[\s>]/i),
    checkRobots(pages[12]),
    checkText(pages[13], /## Popular Categories/i),
  ];

  console.log(JSON.stringify(results, null, 2));

  if (results.some((result) => !result.pass)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
