-- 0002_seo_meta.sql
-- 为分类/作者/标签补全 SEO 元数据：description 字段 + 实体化表

ALTER TABLE categories ADD COLUMN description TEXT;

-- 作者实体表（name 为主键，与 books.author 一致）
CREATE TABLE authors (
  name TEXT PRIMARY KEY,
  description TEXT,
  book_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);
CREATE INDEX idx_authors_book_count ON authors(book_count DESC);

-- 标签实体表（name 为主键）
CREATE TABLE tags (
  name TEXT PRIMARY KEY,
  description TEXT,
  book_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);
CREATE INDEX idx_tags_book_count ON tags(book_count DESC);

-- 书↔标签多对多关联
CREATE TABLE book_tags (
  book_id INTEGER NOT NULL,
  tag_name TEXT NOT NULL,
  PRIMARY KEY (book_id, tag_name),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
CREATE INDEX idx_book_tags_tag ON book_tags(tag_name);
CREATE INDEX idx_book_tags_book ON book_tags(book_id);