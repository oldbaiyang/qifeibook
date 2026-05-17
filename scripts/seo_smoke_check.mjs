const DEFAULT_BASE_URL = "http://localhost:8787";

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

async function fetchText(baseUrl, path) {
  const response = await fetch(buildUrl(baseUrl, path));
  const text = await response.text();

  return {
    path,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    text,
  };
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

function checkHtml(page, options = {}) {
  const checks = {
    okStatus: page.status >= 200 && page.status < 300,
    hasTitle: /<title>[^<]+<\/title>/i.test(page.text),
    hasDescription: /<meta\s+name="description"\s+content="[^"]+"/i.test(page.text),
    hasCanonical: /<link\s+rel="canonical"\s+href="[^"]+"/i.test(page.text),
    hasRobots: /<meta\s+name="robots"\s+content="[^"]+"/i.test(page.text),
    hasH1: /<h1[\s>]/i.test(page.text),
    hasJsonLd: /type="application\/ld\+json"/i.test(page.text),
  };

  if (options.robots) {
    checks.hasExpectedRobots = new RegExp(`<meta\\s+name="robots"\\s+content="${options.robots}"`, "i").test(page.text);
  }

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

async function main() {
  const baseUrl = getArg("--base", DEFAULT_BASE_URL);
  const booksPayload = await fetchJson(baseUrl, "/api/books?limit=1");
  const sampleAuthor = Array.isArray(booksPayload.books) && booksPayload.books[0]?.author
    ? String(booksPayload.books[0].author)
    : null;
  const pages = await Promise.all([
    fetchText(baseUrl, "/"),
    fetchText(baseUrl, "/page/2"),
    fetchText(baseUrl, "/search"),
    sampleAuthor ? fetchText(baseUrl, `/author/${encodeURIComponent(sampleAuthor)}`) : null,
    fetchText(baseUrl, "/sitemap.xml"),
    fetchText(baseUrl, "/sitemap-index.xml"),
    fetchText(baseUrl, "/sitemaps/static.xml"),
    fetchText(baseUrl, "/sitemaps/categories.xml"),
    fetchText(baseUrl, "/sitemaps/authors.xml"),
    fetchText(baseUrl, "/sitemaps/tags.xml"),
    fetchText(baseUrl, "/sitemaps/books-1.xml"),
    fetchText(baseUrl, "/robots.txt"),
  ]);

  const results = [
    checkHtml(pages[0]),
    checkHtml(pages[1]),
    checkHtml(pages[2], { robots: "noindex,follow" }),
    ...(pages[3] ? [checkHtml(pages[3])] : []),
    checkXml(pages[4], /<urlset[\s>]/i),
    checkXml(pages[5], /<sitemapindex[\s>]/i),
    checkXml(pages[6], /<urlset[\s>]/i),
    checkXml(pages[7], /<urlset[\s>]/i),
    checkXml(pages[8], /<urlset[\s>]/i),
    checkXml(pages[9], /<urlset[\s>]/i),
    checkXml(pages[10], /<urlset[\s>]/i),
    checkRobots(pages[11]),
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
