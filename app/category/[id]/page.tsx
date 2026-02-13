import { books } from "@/data/mockData";
import BookList from "@/components/BookList";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const categories = Array.from(new Set(books.map((book) => book.category)));
    return categories.map((category) => ({
        id: category,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    // Decode automatically? Next.js params are usually decoded. 
    // But if URL is encoded, it might be. Let's decode to be safe.
    const category = decodeURIComponent(id);
    const categoryBooks = books.filter((book) => book.category === category);

    const sampleBooks = categoryBooks.slice(0, 5).map(b => `《${b.title}》`).join('、');

    return {
        title: `${category}电子书推荐_${categoryBooks.length}本精选好书免费下载_棋飞书库`,
        description: `${category}电子书推荐：共${categoryBooks.length}本精选好书免费下载，包括${sampleBooks}等。支持EPUB、MOBI、PDF格式，夸克网盘、百度网盘高速下载。`,
        alternates: {
            canonical: `https://qifeibook.com/category/${id}`, // use encoded id in URL
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { id } = await params;
    const category = decodeURIComponent(id);
    const categoryBooks = books.filter((book) => book.category === category);

    if (categoryBooks.length === 0) {
        notFound();
    }

    // Add JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': '首页',
                'item': 'https://qifeibook.com/'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': category,
                'item': `https://qifeibook.com/category/${id}`
            }
        ]
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav aria-label="breadcrumb" style={{ marginBottom: '1.5rem' }}>
                <ol style={{
                    display: 'flex',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#999',
                    alignItems: 'center',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                }}>
                    <li>
                        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            首页
                        </Link>
                    </li>
                    <li aria-hidden="true" style={{ color: '#ccc', userSelect: 'none' }}>›</li>
                    <li aria-current="page" style={{ color: '#333', fontWeight: '500' }}>
                        {category}
                    </li>
                </ol>
            </nav>

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: '#1a1a1a'
                }}>
                    {category}
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#666',
                    fontWeight: 'normal'
                }}>
                    共 {categoryBooks.length} 本精选图书
                </p>
                <p style={{
                    color: '#888',
                    fontSize: '13px',
                    marginTop: '0.75rem',
                    maxWidth: '800px',
                    lineHeight: '1.6'
                }}>
                    本分类收录了{categoryBooks.length}本{category}相关电子书，支持EPUB、MOBI、PDF格式免费下载。
                    所有书籍均经过精心挑选，提供夸克网盘、百度网盘等多种下载方式。
                </p>
            </header>

            <section aria-label={`${category}图书列表`}>
                <BookList books={categoryBooks} />
            </section>
        </div>
    );
}
