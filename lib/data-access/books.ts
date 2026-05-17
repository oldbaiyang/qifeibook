import { books, type Book as SourceBook, type DownloadLink as SourceDownloadLink } from "@/data/mockData";

import type {
  BookDetail,
  BookSummary,
  BooksPageData,
  CategoryBooksPageData,
  CategoryPageData,
  CategorySummary,
  DownloadLinkData,
  HomePageData,
  SearchBooksResult,
} from "./types";

const DEFAULT_LIST_LIMIT = 20;
const MAX_LIST_LIMIT = 50;
const DEFAULT_SEARCH_LIMIT = 20;
const MAX_SEARCH_LIMIT = 50;

function getCategorySlug(category: string): string {
  return category;
}

function mapDownloadLink(link: SourceDownloadLink): DownloadLinkData {
  return {
    ...link,
    provider: link.name.includes("夸克") ? "quark" : link.name.includes("百度") ? "baidu" : "other",
  };
}

function toBookSummary(book: SourceBook): BookSummary {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    category: book.category,
    categorySlug: getCategorySlug(book.category),
    year: book.year,
  };
}

function toBookDetail(book: SourceBook): BookDetail {
  return {
    ...toBookSummary(book),
    authorDetail: book.authorDetail,
    description: book.description,
    format: book.format,
    size: book.size,
    publishYear: book.publishYear,
    keywords: book.keywords ?? [],
    downloadLinks: book.downloadLinks.map(mapDownloadLink),
  };
}

function getSortedSourceBooks(): SourceBook[] {
  return [...books].sort((left, right) => right.id - left.id);
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function clampLimit(limit: number | null | undefined, defaultLimit: number, maxLimit: number): number {
  if (!limit || Number.isNaN(limit)) {
    return defaultLimit;
  }

  return Math.min(Math.max(limit, 1), maxLimit);
}

function normalizeCursor(cursor: number | null | undefined): number | null {
  if (!cursor || Number.isNaN(cursor)) {
    return null;
  }

  return cursor;
}

function paginateBooks(sourceBooks: SourceBook[], cursor: number | null, limit: number): BooksPageData {
  const filteredBooks = cursor ? sourceBooks.filter((book) => book.id < cursor) : sourceBooks;
  const pageBooks = filteredBooks.slice(0, limit + 1).map(toBookSummary);
  const hasMore = pageBooks.length > limit;
  const items = pageBooks.slice(0, limit);

  return {
    books: items,
    hasMore,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
  };
}

export function getBookCount(): number {
  return books.length;
}

export function getHomeBooks(limit?: number): BookSummary[] {
  const sortedBooks = getSortedSourceBooks().map(toBookSummary);
  return typeof limit === "number" ? sortedBooks.slice(0, limit) : sortedBooks;
}

export function getHomePageData(limit?: number): HomePageData {
  const normalizedLimit = clampLimit(limit, DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);
  const page = paginateBooks(getSortedSourceBooks(), null, normalizedLimit);

  return {
    ...page,
    totalBooks: getBookCount(),
  };
}

export function getBooksPage(cursor?: number | null, limit?: number): BooksPageData {
  const normalizedLimit = clampLimit(limit, DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);
  const normalizedCursor = normalizeCursor(cursor);

  return paginateBooks(getSortedSourceBooks(), normalizedCursor, normalizedLimit);
}

export function getBookRouteParams(): Array<{ id: string }> {
  return books.map((book) => ({
    id: String(book.id),
  }));
}

export function getBookDetailById(id: number): BookDetail | undefined {
  const book = books.find((item) => item.id === id);
  return book ? toBookDetail(book) : undefined;
}

export function getRelatedBooksById(id: number, limit = 5): BookSummary[] {
  const currentBook = books.find((item) => item.id === id);
  if (!currentBook) {
    return [];
  }

  return getSortedSourceBooks()
    .filter((book) => book.category === currentBook.category && book.id !== currentBook.id)
    .slice(0, limit)
    .map(toBookSummary);
}

export function getCategoryStats(): CategorySummary[] {
  const counts = new Map<string, number>();

  for (const book of books) {
    counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, bookCount]) => ({
      name,
      slug: getCategorySlug(name),
      bookCount,
    }))
    .sort((left, right) => {
      if (right.bookCount !== left.bookCount) {
        return right.bookCount - left.bookCount;
      }

      return left.name.localeCompare(right.name, "zh-CN");
    });
}

export function getCategoryRouteParams(): Array<{ id: string }> {
  return getCategoryStats().map((category) => ({
    id: category.slug,
  }));
}

export function getCategoryPageData(categorySlug: string): CategoryPageData | undefined {
  const categoryName = decodeURIComponent(categorySlug);
  const category = getCategoryStats().find((item) => item.name === categoryName);

  if (!category) {
    return undefined;
  }

  const categoryBooks = getSortedSourceBooks()
    .filter((book) => book.category === category.name)
    .map(toBookSummary);

  return {
    category,
    books: categoryBooks,
  };
}

export function getCategoryBooksPage(
  categorySlug: string,
  cursor?: number | null,
  limit?: number,
): CategoryBooksPageData | undefined {
  const categoryName = decodeURIComponent(categorySlug);
  const category = getCategoryStats().find((item) => item.name === categoryName);

  if (!category) {
    return undefined;
  }

  const normalizedLimit = clampLimit(limit, DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);
  const normalizedCursor = normalizeCursor(cursor);
  const categoryBooks = getSortedSourceBooks().filter((book) => book.category === category.name);
  const page = paginateBooks(categoryBooks, normalizedCursor, normalizedLimit);

  return {
    category,
    ...page,
  };
}

export function searchBooks(query: string, cursor?: number | null, limit?: number): SearchBooksResult {
  const normalizedQuery = normalizeQuery(query);
  const normalizedLimit = clampLimit(limit, DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT);
  const normalizedCursor = Math.max(normalizeCursor(cursor) ?? 0, 0);

  if (!normalizedQuery) {
    return {
      query: query.trim(),
      total: 0,
      books: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  const matchedBooks = getSortedSourceBooks()
    .filter((book) => {
      const matchesTitle = book.title.toLowerCase().includes(normalizedQuery);
      const matchesAuthor = book.author.toLowerCase().includes(normalizedQuery);
      const matchesKeywords = (book.keywords ?? []).some((keyword) =>
        keyword.toLowerCase().includes(normalizedQuery),
      );

      return matchesTitle || matchesAuthor || matchesKeywords;
    })
    .map(toBookSummary);
  const pageBooks = matchedBooks.slice(normalizedCursor, normalizedCursor + normalizedLimit + 1);
  const hasMore = pageBooks.length > normalizedLimit;
  const items = pageBooks.slice(0, normalizedLimit);

  return {
    query: query.trim(),
    total: matchedBooks.length,
    books: items,
    hasMore,
    nextCursor: hasMore ? normalizedCursor + normalizedLimit : null,
  };
}
