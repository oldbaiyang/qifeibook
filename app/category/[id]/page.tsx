import { books } from "@/data/mockData";
import BookList from "@/components/BookList";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateBreadcrumbJsonLd } from "@/lib/utils";

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
            canonical: `https://qifeibook.com/category/${id}`,
        },
        openGraph: {
            title: `${category}电子书推荐`,
            description: `共${categoryBooks.length}本精选好书免费下载，包括${sampleBooks}等`,
            url: `https://qifeibook.com/category/${id}`,
            siteName: "棋飞书库",
            type: "website",
            locale: "zh_CN",
        },
        twitter: {
            card: "summary",
            title: `${category}电子书推荐`,
            description: `共${categoryBooks.length}本精选好书免费下载`,
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
    const jsonLd = generateBreadcrumbJsonLd([
        { name: '首页', url: 'https://qifeibook.com/' },
        { name: category, url: `https://qifeibook.com/category/${id}` }
    ]);

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <BreadcrumbNav items={[
                { name: "首页", href: "/" },
                { name: category }
            ]} />

            {/* 分类头部 */}
            <header className="page-header category-header">
                <div className="page-header-content">
                    <div className="page-header-icon">📖</div>
                    <div className="page-header-text">
                        <h1>{category}</h1>
                        <p>
                            共 <span className="highlight">{categoryBooks.length}</span> 本精选图书
                        </p>
                    </div>
                </div>
            </header>

            <section aria-label={`${category}图书列表`}>
                <BookList books={categoryBooks} />
            </section>
        </div>
    );
}
