import type { AuthorSummary, BookDetail, BookSummary, CategorySummary, TagSummary } from "@/lib/data-access";

export interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
}

export interface Env {
  ASSETS?: AssetBinding;
  DB?: D1DatabaseLike;
}

export interface BookListResponse {
  books: BookSummary[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface CategoryBooksResponse extends BookListResponse {
  category: CategorySummary;
}

export interface AuthorBooksResponse extends BookListResponse {
  author: AuthorSummary;
}

export interface TagBooksResponse extends BookListResponse {
  tag: TagSummary;
}

export interface SearchResponse {
  query: string;
  books: BookSummary[];
  total: number;
  nextCursor: number | null;
  hasMore: boolean;
}

export interface BookDetailResponse extends BookDetail {
  relatedBooks: BookSummary[];
}
