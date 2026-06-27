export interface DownloadLinkData {
  name: string;
  url: string;
  code?: string;
  provider: string;
}

export interface BookSummary {
  id: number;
  title: string;
  author: string;
  cover: string;
  category: string;
  categorySlug: string;
  year: string;
}

export interface BookDetail extends BookSummary {
  authorDetail: string;
  description: string;
  format: string;
  size: string;
  publishYear: string;
  keywords: string[];
  downloadLinks: DownloadLinkData[];
}

export interface CategorySummary {
  name: string;
  slug: string;
  bookCount: number;
  description?: string;
}

export interface AuthorSummary {
  name: string;
  bookCount: number;
  description?: string;
}

export interface TagSummary {
  name: string;
  bookCount: number;
  description?: string;
}

export interface BooksPageData {
  books: BookSummary[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface HomePageData extends BooksPageData {
  totalBooks: number;
}

export interface CategoryBooksPageData extends BooksPageData {
  category: CategorySummary;
}

export interface CategoryPageData {
  category: CategorySummary;
  books: BookSummary[];
}

export interface SearchBooksResult extends BooksPageData {
  query: string;
  total: number;
}
