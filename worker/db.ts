import type { AuthorSummary, BookDetail, BookSummary, CategorySummary, DownloadLinkData, TagSummary } from "@/lib/data-access";

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
}

interface AuthorRow {
  name: string;
  book_count: number;
}

interface TagRow {
  name: string;
  book_count: number;
}

const DEFAULT_LIST_LIMIT = 20;
const MAX_LIST_LIMIT = 50;
const SEARCH_DEFAULT_LIMIT = 20;
const SEARCH_MAX_LIMIT = 50;

function mapBookRow(row: BookRow): BookSummary {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    cover: row.cover,
    category: row.category_name,
    categorySlug: row.category_slug,
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
          book_count
        FROM categories
        ORDER BY book_count DESC, name ASC
      `,
    )
    .all<CategoryRow>();

  return results.map((row) => ({
    name: row.name,
    slug: row.slug,
    bookCount: row.book_count,
  }));
}

export async function getCategoryBySlug(db: D1DatabaseLike, slug: string): Promise<CategorySummary | null> {
  const row = await db
    .prepare(
      `
        SELECT
          name,
          slug,
          book_count
        FROM categories
        WHERE slug = ?
      `,
    )
    .bind(slug)
    .first<CategoryRow>();

  if (!row) {
    return null;
  }

  return {
    name: row.name,
    slug: row.slug,
    bookCount: row.book_count,
  };
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

  const whereClause = cursor
    ? "WHERE c.slug = ? AND b.id < ?"
    : "WHERE c.slug = ?";
  const values = cursor ? [slug, cursor] : [slug];
  const list = await queryBookRows(db, whereClause, values, limit);

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
  const list = await queryBookRowsByOffset(db, "WHERE c.slug = ?", [slug], limit, offset);

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
          author AS name,
          COUNT(*) AS book_count
        FROM books
        WHERE TRIM(author) != ''
        GROUP BY author
        ORDER BY book_count DESC, author ASC
      `,
    )
    .all<AuthorRow>();

  return results.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
  }));
}

export async function getAuthorByName(db: D1DatabaseLike, name: string): Promise<AuthorSummary | null> {
  const row = await db
    .prepare(
      `
        SELECT
          author AS name,
          COUNT(*) AS book_count
        FROM books
        WHERE author = ?
        GROUP BY author
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

export async function getTags(db: D1DatabaseLike, minBookCount = 1): Promise<TagSummary[]> {
  const { results } = await db
    .prepare(
      `
        SELECT
          keyword AS name,
          COUNT(DISTINCT book_id) AS book_count
        FROM (
          SELECT
            b.id AS book_id,
            TRIM(CAST(j.value AS TEXT)) AS keyword
          FROM books b,
          json_each(CASE WHEN json_valid(b.keywords_json) THEN b.keywords_json ELSE '[]' END) j
          WHERE TRIM(CAST(j.value AS TEXT)) != ''
        )
        GROUP BY keyword
        HAVING COUNT(DISTINCT book_id) >= ?
        ORDER BY book_count DESC, keyword ASC
      `,
    )
    .bind(minBookCount)
    .all<TagRow>();

  return results.map((row) => ({
    name: row.name,
    bookCount: row.book_count,
  }));
}

export async function getTagByName(db: D1DatabaseLike, name: string): Promise<TagSummary | null> {
  const row = await db
    .prepare(
      `
        SELECT
          keyword AS name,
          COUNT(DISTINCT book_id) AS book_count
        FROM (
          SELECT
            b.id AS book_id,
            TRIM(CAST(j.value AS TEXT)) AS keyword
          FROM books b,
          json_each(CASE WHEN json_valid(b.keywords_json) THEN b.keywords_json ELSE '[]' END) j
          WHERE TRIM(CAST(j.value AS TEXT)) = ?
        )
        GROUP BY keyword
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
    WHERE EXISTS (
      SELECT 1
      FROM json_each(CASE WHEN json_valid(b.keywords_json) THEN b.keywords_json ELSE '[]' END) j
      WHERE TRIM(CAST(j.value AS TEXT)) = ?
    )
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
          WHERE b.id != ? AND c.slug = ?
          ORDER BY b.id DESC
          LIMIT 5
        `,
      )
      .bind(id, detailRow.category_slug)
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

  const searchTerm = normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => `${segment}*`)
    .join(" ");

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
        ORDER BY bm25(books_fts), b.id DESC
        LIMIT ? OFFSET ?
      `,
    )
    .bind(searchTerm, limit + 1, offset)
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
