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
  return {
    path,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    text: await response.text(),
  };
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const baseUrl = getArg("--base", DEFAULT_BASE_URL);

  await check("search special characters return normal empty results", async () => {
    const samples = ["'test'", "%", "<script>alert(1)</script>", "[美]"];

    for (const query of samples) {
      const response = await fetchText(baseUrl, `/api/search?q=${encodeURIComponent(query)}`);
      assert(response.status === 200, `${query} returned ${response.status}: ${response.text.slice(0, 120)}`);
      assert(response.contentType.includes("application/json"), `${query} returned ${response.contentType}`);

      const payload = JSON.parse(response.text);
      assert(Array.isArray(payload.books), `${query} response did not include books array`);
      assert(payload.query === query, `${query} response did not preserve query`);
    }
  });

  await check("HTML search special characters render safely", async () => {
    const response = await fetchText(baseUrl, `/search?q=${encodeURIComponent("<script>alert(1)</script>")}`);
    assert(response.status === 200, `HTML search returned ${response.status}`);
    assert(response.contentType.includes("text/html"), `HTML search returned ${response.contentType}`);
    assert(response.text.includes("&lt;script&gt;alert(1)&lt;/script&gt;"), "query was not escaped in HTML");
    assert(!response.text.includes("<script>alert(1)</script>"), "raw script query appeared in HTML");
  });

  await check("site head declares usable icon and manifest resources", async () => {
    const home = await fetchText(baseUrl, "/");
    assert(home.status === 200, `home returned ${home.status}`);
    assert(/rel="icon"/.test(home.text), "home page is missing rel=icon");
    assert(/rel="apple-touch-icon"/.test(home.text), "home page is missing apple-touch-icon");
    assert(/rel="manifest"/.test(home.text), "home page is missing manifest");

    for (const path of ["/favicon.ico", "/apple-touch-icon.png", "/site.webmanifest"]) {
      const response = await fetch(buildUrl(baseUrl, path));
      assert(response.status === 200, `${path} returned ${response.status}`);
    }
  });

  await check("site head includes AdSense publisher script", async () => {
    const home = await fetchText(baseUrl, "/");
    assert(home.status === 200, `home returned ${home.status}`);
    assert(
      home.text.includes("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6967766161116772"),
      "home page is missing AdSense script",
    );
    assert(home.text.includes('crossorigin="anonymous"'), "AdSense script is missing crossorigin attribute");
  });

  await check("category aliases redirect to canonical category pages", async () => {
    const response = await fetch(buildUrl(baseUrl, "/category/心理力志"), { redirect: "manual" });
    assert(response.status === 301, `alias returned ${response.status}`);
    const location = response.headers.get("location") || "";
    assert(
      location === "/category/%E5%BF%83%E7%90%86%E5%8A%B1%E5%BF%97" ||
        location.endsWith("/category/%E5%BF%83%E7%90%86%E5%8A%B1%E5%BF%97"),
      `alias location was not canonical: ${location}`,
    );
  });

  await check("missing years are hidden from book cards", async () => {
    const response = await fetchText(baseUrl, "/");
    assert(response.status === 200, `home returned ${response.status}`);
    assert(!response.text.includes('<span class="book-card-year">-</span>'), "book cards still render dash years");
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
