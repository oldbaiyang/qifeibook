import {
  clampListLimit,
  clampSearchLimit,
  getAuthorBooksByOffset,
  getAuthorsForSitemap,
  getBookSitemapEntries,
  getBookCount,
  getBookDetail,
  getBooks,
  getBooksByOffset,
  getCategories,
  getCategoriesForSitemap,
  getCategoryBooks,
  getCategoryBooksByOffset,
  getHomeBooks,
  getTagBooksByOffset,
  getTags,
  getTagsForSitemap,
  searchBooks,
} from "./db";
import { getCanonicalCategoryPath, isCategoryAlias } from "./categories";
import {
  SITEMAP_BOOK_PAGE_SIZE,
  TAG_INDEX_MIN_BOOKS,
  isIndexableAuthor,
  isIndexableTag,
  renderAuthorPage,
  renderAuthorSitemapXml,
  renderBookPage,
  renderBookSitemapXml,
  renderCategoryPage,
  renderCategorySitemapXml,
  renderHomePage,
  renderNotFoundPage,
  renderRobotsTxt,
  renderSearchPage,
  renderSitemapIndexXml,
  renderStaticSitemapXml,
  renderTagPage,
  renderTagSitemapXml,
} from "./templates";
import type { Env } from "./types";
import { badRequest, decodePathSegment, internalError, json, notFound, parseInteger, withCacheHeaders } from "./utils";

function requireDb(env: Env) {
  if (!env.DB) {
    throw new Error("D1 database binding `DB` is not configured.");
  }

  return env.DB;
}

const HTML_PAGE_SIZE = 20;

function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

function parsePositiveIntegerSegment(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) {
    return null;
  }

  const parsed = parseInteger(value);
  return parsed && parsed > 0 ? parsed : null;
}

function parsePageNumber(value: string | null): number | null {
  return parsePositiveIntegerSegment(value);
}

function redirectToPath(request: Request, path: string): Response {
  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = path;
  redirectUrl.search = "";
  return Response.redirect(redirectUrl.toString(), 301);
}

async function handleApiHome(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const db = requireDb(env);
  const limit = clampListLimit(parseInteger(url.searchParams.get("limit")));
  const [list, totalBooks] = await Promise.all([getHomeBooks(db, limit), getBookCount(db)]);

  return withCacheHeaders(
    json({
      books: list.books,
      totalBooks,
      nextCursor: list.nextCursor,
      hasMore: list.hasMore,
    }),
    "public, max-age=120, stale-while-revalidate=300",
  );
}

async function handleApiBooks(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const db = requireDb(env);
  const limit = clampListLimit(parseInteger(url.searchParams.get("limit")));
  const cursor = parseInteger(url.searchParams.get("cursor"));
  const list = await getBooks(db, cursor, limit);

  return withCacheHeaders(json(list), "public, max-age=120, stale-while-revalidate=300");
}

async function handleApiBookDetail(id: number, env: Env): Promise<Response> {
  const db = requireDb(env);
  const detail = await getBookDetail(db, id);

  if (!detail) {
    return notFound("Book not found");
  }

  return withCacheHeaders(json(detail), "public, max-age=300, stale-while-revalidate=600");
}

async function handleApiCategories(env: Env): Promise<Response> {
  const db = requireDb(env);
  const categories = await getCategories(db);

  return withCacheHeaders(json({ categories }), "public, max-age=600, stale-while-revalidate=1800");
}

async function handleApiCategory(request: Request, slug: string, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const db = requireDb(env);
  const limit = clampListLimit(parseInteger(url.searchParams.get("limit")));
  const cursor = parseInteger(url.searchParams.get("cursor"));
  const categoryPayload = await getCategoryBooks(db, slug, cursor, limit);

  if (!categoryPayload) {
    return notFound("Category not found");
  }

  return withCacheHeaders(json(categoryPayload), "public, max-age=300, stale-while-revalidate=900");
}

async function handleApiSearch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return badRequest("请提供搜索关键词");
  }

  const db = requireDb(env);
  const limit = clampSearchLimit(parseInteger(url.searchParams.get("limit")));
  const cursor = parseInteger(url.searchParams.get("cursor")) ?? 0;
  const payload = await searchBooks(db, query, cursor, limit);

  return withCacheHeaders(
    json({
      found: payload.total > 0,
      ...payload,
    }),
    "public, max-age=60, stale-while-revalidate=120",
  );
}

async function handleBookHtml(id: number, env: Env): Promise<Response> {
  const db = requireDb(env);
  const detail = await getBookDetail(db, id);

  if (!detail) {
    return new Response(renderNotFoundPage("未找到该书籍", "当前书籍不存在或已下线。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return withCacheHeaders(
    new Response(renderBookPage(detail), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
    "public, max-age=300, stale-while-revalidate=900",
  );
}

async function handleCategoryHtml(slug: string, env: Env, page = 1): Promise<Response> {
  const db = requireDb(env);
  const payload = await getCategoryBooksByOffset(db, slug, page, HTML_PAGE_SIZE);

  if (!payload) {
    return new Response(renderNotFoundPage("未找到该分类", "当前分类不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const totalPages = getTotalPages(payload.category.bookCount, HTML_PAGE_SIZE);
  if (page > totalPages) {
    return new Response(renderNotFoundPage("未找到该分类页", "当前分类页不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return withCacheHeaders(
    new Response(renderCategoryPage(payload.category, payload.books, { currentPage: page, totalPages }), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
    "public, max-age=300, stale-while-revalidate=900",
  );
}

async function handleAuthorHtml(name: string, env: Env, page = 1): Promise<Response> {
  const db = requireDb(env);
  const payload = await getAuthorBooksByOffset(db, name, page, HTML_PAGE_SIZE);

  if (!payload) {
    return new Response(renderNotFoundPage("未找到该作者", "当前作者不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const totalPages = getTotalPages(payload.author.bookCount, HTML_PAGE_SIZE);
  if (page > totalPages) {
    return new Response(renderNotFoundPage("未找到该作者页", "当前作者页不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return withCacheHeaders(
    new Response(renderAuthorPage(payload.author, payload.books, { currentPage: page, totalPages }), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
    "public, max-age=300, stale-while-revalidate=900",
  );
}

async function handleTagHtml(name: string, env: Env, page = 1): Promise<Response> {
  const db = requireDb(env);
  const payload = await getTagBooksByOffset(db, name, page, HTML_PAGE_SIZE);

  if (!payload) {
    return new Response(renderNotFoundPage("未找到该标签", "当前标签不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const totalPages = getTotalPages(payload.tag.bookCount, HTML_PAGE_SIZE);
  if (page > totalPages) {
    return new Response(renderNotFoundPage("未找到该标签页", "当前标签页不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return withCacheHeaders(
    new Response(renderTagPage(payload.tag, payload.books, { currentPage: page, totalPages }), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
    "public, max-age=300, stale-while-revalidate=900",
  );
}

async function handleHomeHtml(env: Env, page = 1): Promise<Response> {
  const db = requireDb(env);
  const [categories, totalBooks, hotTags] = await Promise.all([
    getCategories(db),
    getBookCount(db),
    getTags(db, 5, 20),
  ]);
  const totalPages = getTotalPages(totalBooks, HTML_PAGE_SIZE);

  if (page > totalPages) {
    return new Response(renderNotFoundPage("未找到该目录页", "当前目录页不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const list = await getBooksByOffset(db, page, HTML_PAGE_SIZE);

  return withCacheHeaders(
    new Response(
      renderHomePage({
        categories,
        tags: hotTags,
        books: list.books,
        totalBooks,
        nextCursor: list.nextCursor,
        hasMore: list.hasMore,
        currentPage: page,
        totalPages,
      }),
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    ),
    "public, max-age=120, stale-while-revalidate=300",
  );
}

async function handleSearchHtml(request: Request, env: Env, page = 1): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const db = requireDb(env);
  const offset = Math.max(page - 1, 0) * HTML_PAGE_SIZE;
  const [categories, payload] = await Promise.all([
    getCategories(db),
    query ? searchBooks(db, query, offset, HTML_PAGE_SIZE) : Promise.resolve({ query: "", books: [], total: 0, nextCursor: null, hasMore: false }),
  ]);

  const totalPages = query ? Math.max(1, Math.ceil(payload.total / HTML_PAGE_SIZE)) : 1;
  if (page > 1 && page > totalPages) {
    return new Response(renderNotFoundPage("未找到该搜索页", "当前搜索结果页不存在或暂时不可用。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return withCacheHeaders(
    new Response(
      renderSearchPage({
        categories,
        query,
        books: payload.books,
        total: payload.total,
        currentPage: page,
        totalPages,
      }),
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    ),
    "public, max-age=60, stale-while-revalidate=120",
  );
}

async function handleSitemapIndex(env: Env): Promise<Response> {
  const db = requireDb(env);
  const bookCount = await getBookCount(db);

  return withCacheHeaders(
    new Response(renderSitemapIndexXml({ bookCount }), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    }),
    "public, max-age=1800, stale-while-revalidate=3600",
  );
}

async function handleStaticSitemap(): Promise<Response> {
  return withCacheHeaders(
    new Response(renderStaticSitemapXml(), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    }),
    "public, max-age=1800, stale-while-revalidate=3600",
  );
}

async function handleCategorySitemap(env: Env): Promise<Response> {
  const db = requireDb(env);
  const categories = await getCategoriesForSitemap(db);

  return withCacheHeaders(
    new Response(renderCategorySitemapXml(categories), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    }),
    "public, max-age=1800, stale-while-revalidate=3600",
  );
}

async function handleAuthorSitemap(env: Env): Promise<Response> {
  const db = requireDb(env);
  const authors = await getAuthorsForSitemap(db);

  return withCacheHeaders(
    new Response(renderAuthorSitemapXml(authors.filter(isIndexableAuthor)), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    }),
    "public, max-age=1800, stale-while-revalidate=3600",
  );
}

async function handleTagSitemap(env: Env): Promise<Response> {
  const db = requireDb(env);
  const tags = await getTagsForSitemap(db, TAG_INDEX_MIN_BOOKS);

  return withCacheHeaders(
    new Response(renderTagSitemapXml(tags.filter(isIndexableTag)), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    }),
    "public, max-age=1800, stale-while-revalidate=3600",
  );
}

async function handleBookSitemap(env: Env, page: number): Promise<Response> {
  const db = requireDb(env);
  const bookCount = await getBookCount(db);
  const totalPages = getTotalPages(bookCount, SITEMAP_BOOK_PAGE_SIZE);

  if (page > totalPages) {
    return new Response(renderNotFoundPage("未找到该 sitemap", "当前 sitemap 分片不存在。"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const entries = await getBookSitemapEntries(db, page, SITEMAP_BOOK_PAGE_SIZE);

  return withCacheHeaders(
    new Response(renderBookSitemapXml(entries), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    }),
    "public, max-age=1800, stale-while-revalidate=3600",
  );
}

function getRouteTail(pathname: string, prefix: string): string | null {
  if (!pathname.startsWith(`${prefix}/`)) {
    return null;
  }

  return pathname.slice(prefix.length + 1);
}

export async function handleWorkerRoute(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const { hostname, pathname } = url;

  // 去掉非根路径的尾斜杠，避免 /category/小说/ 与 /category/小说 共存造成重复内容
  if (pathname !== "/" && pathname.endsWith("/")) {
    const trimmed = new URL(request.url);
    trimmed.pathname = pathname.replace(/\/+$/, "") || "/";
    return Response.redirect(trimmed.toString(), 301);
  }

  try {
    if (hostname === "www.qifeibook.com") {
      const redirectUrl = new URL(request.url);
      redirectUrl.hostname = "qifeibook.com";

      return Response.redirect(redirectUrl.toString(), 301);
    }

    if (pathname === "/") {
      return await handleHomeHtml(env);
    }

    const homePageTail = getRouteTail(pathname, "/page");
    if (homePageTail) {
      const page = parsePageNumber(homePageTail);
      if (!page || page === 1) {
        return new Response(renderNotFoundPage("未找到该目录页", "当前目录页不存在或暂时不可用。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return await handleHomeHtml(env, page);
    }

    if (pathname === "/search") {
      const requestedPage = parsePageNumber(url.searchParams.get("page"));
      return await handleSearchHtml(request, env, requestedPage ?? 1);
    }

    if (pathname === "/api/health") {
      return json({
        ok: true,
        runtime: "cloudflare-worker",
        hasDatabaseBinding: Boolean(env.DB),
      });
    }

    if (pathname === "/api/home") {
      return await handleApiHome(request, env);
    }

    if (pathname === "/api/books") {
      return await handleApiBooks(request, env);
    }

    const apiBookTail = getRouteTail(pathname, "/api/books");
    if (apiBookTail) {
      const bookId = parsePositiveIntegerSegment(apiBookTail);
      if (!bookId) {
        return badRequest("Invalid book id");
      }

      return await handleApiBookDetail(bookId, env);
    }

    if (pathname === "/api/categories") {
      return await handleApiCategories(env);
    }

    const apiCategoryTail = getRouteTail(pathname, "/api/category");
    if (apiCategoryTail) {
      const slug = decodePathSegment(apiCategoryTail);
      if (!slug) {
        return badRequest("Invalid category slug");
      }

      return await handleApiCategory(request, slug, env);
    }

    if (pathname === "/api/search") {
      return await handleApiSearch(request, env);
    }

    const bookTail = getRouteTail(pathname, "/book");
    if (bookTail) {
      const bookId = parsePositiveIntegerSegment(bookTail);
      if (!bookId) {
        return new Response(renderNotFoundPage("未找到该书籍", "当前书籍不存在或已下线。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return await handleBookHtml(bookId, env);
    }

    const categoryTail = getRouteTail(pathname, "/category");
    if (categoryTail) {
      const categoryPageMatch = categoryTail.match(/^([^/]+)\/page\/(\d+)$/);
      if (categoryPageMatch) {
        const slug = decodePathSegment(categoryPageMatch[1]);
        const page = parsePageNumber(categoryPageMatch[2]);
        if (!slug || !page || page === 1) {
          return new Response(renderNotFoundPage("未找到该分类页", "当前分类页不存在或暂时不可用。"), {
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }

        if (isCategoryAlias(slug)) {
          return redirectToPath(request, `${getCanonicalCategoryPath(slug)}/page/${page}`);
        }

        return await handleCategoryHtml(slug, env, page);
      }

      const slug = decodePathSegment(categoryTail);
      if (!slug) {
        return new Response(renderNotFoundPage("未找到该分类", "当前分类不存在或暂时不可用。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      if (isCategoryAlias(slug)) {
        return redirectToPath(request, getCanonicalCategoryPath(slug));
      }

      return await handleCategoryHtml(slug, env);
    }

    const authorTail = getRouteTail(pathname, "/author");
    if (authorTail) {
      const authorPageMatch = authorTail.match(/^(.+)\/page\/(\d+)$/);
      if (authorPageMatch) {
        const name = decodePathSegment(authorPageMatch[1]).trim();
        const page = parsePageNumber(authorPageMatch[2]);
        if (!name || !page || page === 1) {
          return new Response(renderNotFoundPage("未找到该作者页", "当前作者页不存在或暂时不可用。"), {
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }

        return await handleAuthorHtml(name, env, page);
      }

      const name = decodePathSegment(authorTail).trim();
      if (!name) {
        return new Response(renderNotFoundPage("未找到该作者", "当前作者不存在或暂时不可用。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return await handleAuthorHtml(name, env);
    }

    const tagTail = getRouteTail(pathname, "/tag");
    if (tagTail) {
      const tagPageMatch = tagTail.match(/^(.+)\/page\/(\d+)$/);
      if (tagPageMatch) {
        const name = decodePathSegment(tagPageMatch[1]).trim();
        const page = parsePageNumber(tagPageMatch[2]);
        if (!name || !page || page === 1) {
          return new Response(renderNotFoundPage("未找到该标签页", "当前标签页不存在或暂时不可用。"), {
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }

        return await handleTagHtml(name, env, page);
      }

      const name = decodePathSegment(tagTail).trim();
      if (!name) {
        return new Response(renderNotFoundPage("未找到该标签", "当前标签不存在或暂时不可用。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return await handleTagHtml(name, env);
    }

    if (pathname === "/sitemap.xml") {
      return await handleSitemapIndex(env);
    }

    if (pathname === "/sitemap-index.xml") {
      return await handleSitemapIndex(env);
    }

    if (pathname === "/sitemaps/static.xml") {
      return await handleStaticSitemap();
    }

    if (pathname === "/sitemaps/categories.xml") {
      return await handleCategorySitemap(env);
    }

    if (pathname === "/sitemaps/authors.xml") {
      return await handleAuthorSitemap(env);
    }

    if (pathname === "/sitemaps/tags.xml") {
      return await handleTagSitemap(env);
    }

    const bookSitemapMatch = pathname.match(/^\/sitemaps\/books-(\d+)\.xml$/);
    if (bookSitemapMatch) {
      const page = parsePageNumber(bookSitemapMatch[1]);
      if (!page) {
        return new Response(renderNotFoundPage("未找到该 sitemap", "当前 sitemap 分片不存在。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return await handleBookSitemap(env, page);
    }

    if (pathname === "/robots.txt") {
      return new Response(renderRobotsTxt(), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=1800",
        },
      });
    }

    return null;
  } catch (error) {
    console.error("Worker route handling failed:", error);
    return internalError();
  }
}
