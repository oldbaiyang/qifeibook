import { books } from "@/data/mockData";
import BookList from "@/components/BookList";
import { Metadata } from "next";
import { generateBreadcrumbJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "棋飞书库 - 经典电子书免费下载 | EPUB/MOBI/PDF格式",
  alternates: {
    canonical: "https://qifeibook.com/",
  },
};

export default function Home() {
  // 按ID倒序排序（即按上架时间倒序）
  const sortedBooks = [...books].sort((a, b) => b.id - a.id);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: '首页', url: 'https://qifeibook.com/' }
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 页面头部 */}
      <header className="page-header">
        <div className="page-header-content">
          <div className="page-header-icon">📚</div>
          <div className="page-header-text">
            <h1>全部图书</h1>
            <p>
              <span className="highlight">{books.length}</span> 本精选电子书，持续更新中
            </p>
          </div>
        </div>
        <div className="page-header-decoration">
          <span className="decoration-item">✨</span>
          <span className="decoration-item">📖</span>
          <span className="decoration-item">🌟</span>
        </div>
      </header>

      {/* 图书列表 */}
      <section>
        <BookList books={sortedBooks} />
      </section>
    </div>
  );
}
