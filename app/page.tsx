import { books } from "@/data/mockData";
import BookList from "@/components/BookList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋飞书库 - 经典电子书免费下载 | EPUB/MOBI/PDF格式",
  alternates: {
    canonical: "https://qifeibook.com/",
  },
};

export default function Home() {
  // 按ID倒序排序（即按上架时间倒序）
  const sortedBooks = [...books].sort((a, b) => b.id - a.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [{
      '@type': 'ListItem',
      'position': 1,
      'name': '首页',
      'item': 'https://qifeibook.com/'
    }]
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ marginBottom: '3rem' }}>
        <header className="section-title" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            全部图书
          </h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '0.5rem' }}>
            共 {books.length} 本精选电子书，持续更新中
          </p>
        </header>

        <BookList books={sortedBooks} />
      </section>
    </div>
  );
}
