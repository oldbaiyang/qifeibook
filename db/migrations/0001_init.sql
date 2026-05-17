CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  book_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  slug TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  author_detail TEXT,
  description TEXT,
  cover TEXT,
  year TEXT,
  publish_year TEXT,
  format TEXT,
  size TEXT,
  category_id INTEGER NOT NULL,
  keywords_json TEXT,
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE download_links (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  code TEXT,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE VIRTUAL TABLE books_fts USING fts5(
  title,
  author,
  description,
  keywords,
  content='',
  tokenize='unicode61'
);

CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_books_category_id_id ON books(category_id, id DESC);
CREATE INDEX idx_books_id_desc ON books(id DESC);
CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_download_links_book_id ON download_links(book_id);
