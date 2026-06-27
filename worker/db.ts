import type { AuthorSummary, BookDetail, BookSummary, CategorySummary, DownloadLinkData, TagSummary } from "@/lib/data-access";

import { getCanonicalCategoryName, getCategoryAliases, mergeCategorySummaries } from "./categories";
import type {
  AuthorBooksResponse,
  BookDetailResponse,
  BookListResponse,
  CategoryBooksResponse,
  D1DatabaseLike,
  SearchResponse,
  TagBooksResponse,
} from "./types";

interface BookRow {
  id: number;
  title: string;
  author: string;
  cover: string;
  year: string;
  category_name: string;
  category_slug: string;
}

interface BookDetailRow extends BookRow {
  author_detail: string;
  description: string;
  format: string;
  size: string;
  publish_year: string;
  keywords_json: string | null;
}

interface BookSitemapRow {
  id: number;
  created_at: string | null;
  updated_at: string | null;
}

interface DownloadLinkRow {
  name: string;
  url: string;
  code: string | null;
  provider: string;
}

interface CategoryRow {
  name: string;
  slug: string;
  book_count: number;
  description: string | null;
}

interface AuthorRow {
  name: string;
  book_count: number;
  description: string | null;
}

interface TagRow {
  name: string;
  book_count: number;
  description: string | null;
}

const DEFAULT_LIST_LIMIT = 20;
const MAX_LIST_LIMIT = 50;
const SEARCH_DEFAULT_LIMIT = 20;
const SEARCH_MAX_LIMIT = 50;

function mapBookRow(row: BookRow): BookSummary {
  const categoryName = getCanonicalCategoryName(row.category_name);

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    cover: row.cover,
    category: categoryName,
    categorySlug: categoryName,
    year: row.year,
  };
}

function mapKeywords(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapDownloadLink(row: DownloadLinkRow): DownloadLinkData {
  return {
    name: row.name,
    url: row.url,
    code: row.code ?? undefined,
    provider: row.provider,
  };
}

async function queryBookRows(db: D1DatabaseLike, whereClause: string, values: unknown[], limit: number): Promise<BookListResponse> {
  const query = `
    SELECT
      b.id,
      b.title,
      b.author,
      b.cover,
      b.year,
      c.name AS category_name,
      c.slug AS category_slug
    FROM books b
    JOIN categories c ON c.id = b.category_id
    ${whereClause}
    ORDER BY b.id DESC
    LIMIT ?
  `;

  const { results } = await db.prepare(query).bind(...values, limit + 1).all<BookRow>();
  const hasMore = results.length > limit;
  const items = results.slice(0, limit).map(mapBookRow);

  return {
    books: items,
    hasMore,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
  };
}

async function queryBookRowsByOffset(
  db: D1DatabaseLike,
  whereClause: string,
  values: unknown[],
  limit: number,
  offset: number,
): Promise<BookListResponse> {
  const query = `
    SELECT
      b.id,
      b.title,
      b.author,
      b.cover,
      b.year,
      c.name AS category_name,
      c.slug AS category_slug
    FROM books b
    JOIN categories c ON c.id = b.category_id
    ${whereClause}
    ORDER BY b.id DESC
    LIMIT ? OFFSET ?
  `;

  const { results } = await db.prepare(query).bind(...values, limit + 1, offset).all<BookRow>();
  const hasMore = results.length > limit;
  const items = results.slice(0, limit).map(mapBookRow);

  return {
    books: items,
    hasMore,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
  };
}

export function clampListLimit(value: number | null): number {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_LIST_LIMIT;
  }

  return Math.min(Math.max(value, 1), MAX_LIST_LIMIT);
}

export function clampSearchLimit(value: number | null): number {
  if (!value || Number.isNaN(value)) {
    return SEARCH_DEFAULT_LIMIT;
  }

  return Math.min(Math.max(value, 1), SEARCH_MAX_LIMIT);
}

export async function getBookCount(db: D1DatabaseLike): Promise<number> {
  const row = await db.prepare("SELECT COUNT(*) AS total FROM books").first<{ total: number }>();
  return row?.total ?? 0;
}

export async function getHomeBooks(db: D1DatabaseLike, limit: number): Promise<BookListResponse> {
  return queryBookRows(db, "", [], limit);
}

export async function getBooks(db: D1DatabaseLike, cursor: number | null, limit: number): Promise<BookListResponse> {
  if (!cursor) {
    return queryBookRows(db, "", [], limit);
  }

  return queryBookRows(db, "WHERE b.id < ?", [cursor], limit);
}

export async function getBooksByOffset(db: D1DatabaseLike, page: number, limit: number): Promise<BookListResponse> {
  const offset = Math.max(page - 1, 0) * limit;
  return queryBookRowsByOffset(db, "", [], limit, offset);
}

export async function getCategories(db: D1DatabaseLike): Promise<CategorySummary[]> {
  const { results } = await db
    .prepare(
      `
        SELECT
          name,
          slug,
          book_count,
          description
        FROM categories
        ORDER BY book_count DESC, name ASC
      `,
    )
    .all<CategoryRow>();

  return mergeCategorySummaries(
    results.map((row) => ({
      name: row.name,
      slug: row.slug,
      bookCount: row.book_count,
      description: row.description ?? undefined,
    })),
  );
}

export async function getCategoryBySlug(db: D1DatabaseLike, slug: string): Promise<CategorySummary | null> {
  const aliases = getCategoryAliases(slug);
  const placeholders = aliases.map(() => "?").join(", ");
  const row = await db
    .prepare(
      `
        SELECT
          SUM(book_count) AS book_count,
          MAX(description) AS description
        FROM categories
        WHERE slug IN (${placeholders})
      `,
    )
    .bind(...aliases)
    .first<{ book_count: number | null; description: string | null }>();

  if (!row?.book_count) {
    return null;
  }

  const name = getCanonicalCategoryName(slug);
  return {
    name,
    slug: name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
  };
}

function buildCategoryWhereClause(slug: string, cursor?: number | null): { clause: string; values: unknown[] } {
  const aliases = getCategoryAliases(slug);
  const placeholders = aliases.map(() => "?").join(", ");

  if (cursor) {
    return {
      clause: `WHERE c.slug IN (${placeholders}) AND b.id < ?`,
      values: [...aliases, cursor],
    };
  }

  return {
    clause: `WHERE c.slug IN (${placeholders})`,
    values: aliases,
  };
}

function toLikePattern(value: string): string {
  return `%${value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
}

export async function getCategoryBooks(
  db: D1DatabaseLike,
  slug: string,
  cursor: number | null,
  limit: number,
): Promise<CategoryBooksResponse | null> {
  const category = await getCategoryBySlug(db, slug);

  if (!category) {
    return null;
  }

  const categoryFilter = buildCategoryWhereClause(slug, cursor);
  const list = await queryBookRows(db, categoryFilter.clause, categoryFilter.values, limit);

  return {
    category,
    ...list,
  };
}

export async function getCategoryBooksByOffset(
  db: D1DatabaseLike,
  slug: string,
  page: number,
  limit: number,
): Promise<CategoryBooksResponse | null> {
  const category = await getCategoryBySlug(db, slug);

  if (!category) {
    return null;
  }

  const offset = Math.max(page - 1, 0) * limit;
  const categoryFilter = buildCategoryWhereClause(slug);
  const list = await queryBookRowsByOffset(db, categoryFilter.clause, categoryFilter.values, limit, offset);

  return {
    category,
    ...list,
  };
}

export async function getAuthors(db: D1DatabaseLike): Promise<AuthorSummary[]> {
  const { results } = await db
    .prepare(
      `
        SELECT
          name,
          book_count,
          description
        FROM authors
        ORDER BY book_count DESC, name ASC
      `,
    )
    .all<AuthorRow>();

  return results.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
  }));
}

export async function getAuthorByName(db: D1DatabaseLike, name: string): Promise<AuthorSummary | null> {
  const row = await db
    .prepare(
      `
        SELECT
          name,
          book_count,
          description
        FROM authors
        WHERE name = ?
      `,
    )
    .bind(name)
    .first<AuthorRow>();

  if (!row) {
    return null;
  }

  return {
    name: row.name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
  };
}

export async function getAuthorBooksByOffset(
  db: D1DatabaseLike,
  name: string,
  page: number,
  limit: number,
): Promise<AuthorBooksResponse | null> {
  const author = await getAuthorByName(db, name);

  if (!author) {
    return null;
  }

  const offset = Math.max(page - 1, 0) * limit;
  const list = await queryBookRowsByOffset(db, "WHERE b.author = ?", [name], limit, offset);

  return {
    author,
    ...list,
  };
}

export async function getTags(db: D1DatabaseLike, minBookCount = 1, limit?: number): Promise<TagSummary[]> {
  const query = `
    SELECT
      name,
      book_count,
      description
    FROM tags
    WHERE book_count >= ?
    ORDER BY book_count DESC, name ASC
    ${typeof limit === "number" ? "LIMIT ?" : ""}
  `;
  const stmt = db.prepare(query);
  const { results } = typeof limit === "number"
    ? await stmt.bind(minBookCount, limit).all<TagRow>()
    : await stmt.bind(minBookCount).all<TagRow>();

  return results.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
  }));
}

export async function getTagByName(db: D1DatabaseLike, name: string): Promise<TagSummary | null> {
  const row = await db
    .prepare(
      `
        SELECT
          name,
          book_count,
          description
        FROM tags
        WHERE name = ?
      `,
    )
    .bind(name)
    .first<TagRow>();

  if (!row) {
    return null;
  }

  return {
    name: row.name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
  };
}

export async function getTagBooksByOffset(
  db: D1DatabaseLike,
  name: string,
  page: number,
  limit: number,
): Promise<TagBooksResponse | null> {
  const tag = await getTagByName(db, name);

  if (!tag) {
    return null;
  }

  const offset = Math.max(page - 1, 0) * limit;
  const query = `
    SELECT
      b.id,
      b.title,
      b.author,
      b.cover,
      b.year,
      c.name AS category_name,
      c.slug AS category_slug
    FROM books b
    JOIN categories c ON c.id = b.category_id
    JOIN book_tags bt ON bt.book_id = b.id
    WHERE bt.tag_name = ?
    ORDER BY b.id DESC
    LIMIT ? OFFSET ?
  `;

  const { results } = await db.prepare(query).bind(name, limit + 1, offset).all<BookRow>();
  const hasMore = results.length > limit;
  const items = results.slice(0, limit).map(mapBookRow);

  return {
    tag,
    books: items,
    hasMore,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
  };
}

export async function getBookDetail(db: D1DatabaseLike, id: number): Promise<BookDetailResponse | null> {
  const detailRow = await db
    .prepare(
      `
        SELECT
          b.id,
          b.title,
          b.author,
          b.cover,
          b.year,
          c.name AS category_name,
          c.slug AS category_slug,
          b.author_detail,
          b.description,
          b.format,
          b.size,
          b.publish_year,
          b.keywords_json
        FROM books b
        JOIN categories c ON c.id = b.category_id
        WHERE b.id = ?
      `,
    )
    .bind(id)
    .first<BookDetailRow>();

  if (!detailRow) {
    return null;
  }

  const [downloadLinks, relatedBooks] = await Promise.all([
    db.prepare("SELECT name, url, code, provider FROM download_links WHERE book_id = ? ORDER BY id ASC")
      .bind(id)
      .all<DownloadLinkRow>(),
    db
      .prepare(
        `
          SELECT
            b.id,
            b.title,
            b.author,
            b.cover,
            b.year,
            c.name AS category_name,
            c.slug AS category_slug
          FROM books b
          JOIN categories c ON c.id = b.category_id
          WHERE b.id != ? AND c.slug IN (${getCategoryAliases(detailRow.category_slug).map(() => "?").join(", ")})
          ORDER BY b.id DESC
          LIMIT 5
        `,
      )
      .bind(id, ...getCategoryAliases(detailRow.category_slug))
      .all<BookRow>(),
  ]);

  const detail: BookDetail = {
    ...mapBookRow(detailRow),
    authorDetail: detailRow.author_detail,
    description: detailRow.description,
    format: detailRow.format,
    size: detailRow.size,
    publishYear: detailRow.publish_year,
    keywords: mapKeywords(detailRow.keywords_json),
    downloadLinks: downloadLinks.results.map(mapDownloadLink),
  };

  return {
    ...detail,
    relatedBooks: relatedBooks.results.map(mapBookRow),
  };
}

export async function searchBooks(
  db: D1DatabaseLike,
  query: string,
  offset: number,
  limit: number,
): Promise<SearchResponse> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return {
      query: "",
      books: [],
      total: 0,
      nextCursor: null,
      hasMore: false,
    };
  }

  const searchSegments = normalizedQuery.match(/[\p{L}\p{N}_]+/gu)?.filter(Boolean) ?? [];
  const searchTerm = searchSegments.map((segment) => `${segment}*`).join(" ");

  if (!searchTerm) {
    return {
      query: normalizedQuery,
      books: [],
      total: 0,
      nextCursor: null,
      hasMore: false,
    };
  }

  const shouldUseFts = searchSegments.every((segment) => [...segment].length > 1);
  const likeQuery = toLikePattern(normalizedQuery);

  if (!shouldUseFts) {
    return searchBooksWithLike(db, normalizedQuery, offset, limit);
  }

  try {
    const { results } = await db
      .prepare(
        `
          SELECT
            b.id,
            b.title,
            b.author,
            b.cover,
            b.year,
            c.name AS category_name,
            c.slug AS category_slug
          FROM books_fts f
          JOIN books b ON b.id = CAST(f.rowid AS INTEGER)
          JOIN categories c ON c.id = b.category_id
          WHERE books_fts MATCH ?
          ORDER BY
            CASE
              WHEN b.title = ? THEN 0
              WHEN b.title LIKE ? ESCAPE '\\' THEN 1
              WHEN b.author = ? THEN 2
              WHEN b.author LIKE ? ESCAPE '\\' THEN 3
              WHEN b.keywords_json LIKE ? ESCAPE '\\' THEN 4
              ELSE 5
            END,
            bm25(books_fts),
            b.id DESC
          LIMIT ? OFFSET ?
        `,
      )
      .bind(
        searchTerm,
        normalizedQuery,
        likeQuery,
        normalizedQuery,
        likeQuery,
        likeQuery,
        limit + 1,
        offset,
      )
      .all<BookRow>();

    const totalRow = await db
      .prepare(
        `
          SELECT COUNT(*) AS total
          FROM books_fts
          WHERE books_fts MATCH ?
        `,
      )
      .bind(searchTerm)
      .first<{ total: number }>();

    const hasMore = results.length > limit;
    const items = results.slice(0, limit).map(mapBookRow);

    return {
      query: normalizedQuery,
      books: items,
      total: totalRow?.total ?? items.length,
      hasMore,
      nextCursor: hasMore ? offset + limit : null,
    };
  } catch {
    return searchBooksWithLike(db, normalizedQuery, offset, limit);
  }
}

async function searchBooksWithLike(
  db: D1DatabaseLike,
  normalizedQuery: string,
  offset: number,
  limit: number,
): Promise<SearchResponse> {
  const likeQuery = toLikePattern(normalizedQuery);
  const { results } = await db
    .prepare(
      `
        SELECT
          b.id,
          b.title,
          b.author,
          b.cover,
          b.year,
          c.name AS category_name,
          c.slug AS category_slug
        FROM books b
        JOIN categories c ON c.id = b.category_id
        WHERE b.title LIKE ? ESCAPE '\\'
          OR b.author LIKE ? ESCAPE '\\'
          OR b.description LIKE ? ESCAPE '\\'
          OR b.keywords_json LIKE ? ESCAPE '\\'
        ORDER BY
          CASE
            WHEN b.title = ? THEN 0
            WHEN b.title LIKE ? ESCAPE '\\' THEN 1
            WHEN b.author = ? THEN 2
            WHEN b.author LIKE ? ESCAPE '\\' THEN 3
            WHEN b.keywords_json LIKE ? ESCAPE '\\' THEN 4
            ELSE 5
          END,
          b.id DESC
        LIMIT ? OFFSET ?
      `,
    )
    .bind(
      likeQuery,
      likeQuery,
      likeQuery,
      likeQuery,
      normalizedQuery,
      likeQuery,
      normalizedQuery,
      likeQuery,
      likeQuery,
      limit + 1,
      offset,
    )
    .all<BookRow>();

  const totalRow = await db
    .prepare(
      `
        SELECT COUNT(*) AS total
        FROM books b
        WHERE b.title LIKE ? ESCAPE '\\'
          OR b.author LIKE ? ESCAPE '\\'
          OR b.description LIKE ? ESCAPE '\\'
          OR b.keywords_json LIKE ? ESCAPE '\\'
      `,
    )
    .bind(likeQuery, likeQuery, likeQuery, likeQuery)
    .first<{ total: number }>();

  const hasMore = results.length > limit;
  const items = results.slice(0, limit).map(mapBookRow);

  return {
    query: normalizedQuery,
    books: items,
    total: totalRow?.total ?? items.length,
    hasMore,
    nextCursor: hasMore ? offset + limit : null,
  };
}

export async function getBookSitemapEntries(
  db: D1DatabaseLike,
  page: number,
  pageSize: number,
): Promise<Array<{ id: number; lastmod?: string }>> {
  const offset = Math.max(page - 1, 0) * pageSize;
  const { results } = await db
    .prepare(
      `
        SELECT
          id,
          created_at,
          updated_at
        FROM books
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `,
    )
    .bind(pageSize, offset)
    .all<BookSitemapRow>();

  return results.map((row) => ({
    id: row.id,
    lastmod: row.updated_at || row.created_at || undefined,
  }));
}

/**
 * 给 sitemap 用的扩展版查询：额外带 description + updatedAt。
 * 通过关联子查询取该分类/作者/标签下最近一本书的 updated_at，
 * 只在生成 sitemap 时调用，避免给每页加载增加开销。
 */
export async function getCategoriesForSitemap(db: D1DatabaseLike): Promise<CategorySummary[]> {
  const { results } = await db
    .prepare(
      `
        SELECT
          c.name,
          c.slug,
          c.book_count,
          c.description,
          (SELECT MAX(b.updated_at) FROM books b WHERE b.category_id = c.id) AS updated_at
        FROM categories c
        ORDER BY c.book_count DESC, c.name ASC
      `,
    )
    .all<CategoryRow & { updated_at: string | null }>();

  return results.map((row) => ({
    name: row.name,
    slug: row.slug,
    bookCount: row.book_count,
    description: row.description ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }));
}

export async function getAuthorsForSitemap(db: D1DatabaseLike): Promise<AuthorSummary[]> {
  const { results } = await db
    .prepare(
      `
        SELECT
          a.name,
          a.book_count,
          a.description,
          (SELECT MAX(b.updated_at) FROM books b WHERE b.author = a.name) AS updated_at
        FROM authors a
        ORDER BY a.book_count DESC, a.name ASC
      `,
    )
    .all<AuthorRow & { updated_at: string | null }>();

  return results.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }));
}

export async function getTagsForSitemap(db: D1DatabaseLike, minBookCount = 1): Promise<TagSummary[]> {
  const { results } = await db
    .prepare(
      `
        SELECT
          t.name,
          t.book_count,
          t.description,
          (
            SELECT MAX(b.updated_at)
            FROM book_tags bt
            JOIN books b ON b.id = bt.book_id
            WHERE bt.tag_name = t.name
          ) AS updated_at
        FROM tags t
        WHERE t.book_count >= ?
        ORDER BY t.book_count DESC, t.name ASC
      `,
    )
    .bind(minBookCount)
    .all<TagRow & { updated_at: string | null }>();

  return results.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
    description: row.description ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }));
}
