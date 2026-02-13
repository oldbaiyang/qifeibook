import { books } from "@/data/mockData";
import BookCard from "@/components/BookCard";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag } from "lucide-react";
import styles from "./page.module.css";
// Note: legacy module css used specific classes. I verified they match usage here.

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return books.map((book) => ({
        id: book.id.toString(),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const book = books.find((b) => b.id === parseInt(id));
    if (!book) return {};

    const desc = book.description ? book.description.substring(0, 120) : `${book.title}免费下载`;

    return {
        title: `《${book.title}》${book.author}_EPUB/MOBI/PDF免费下载_棋飞书库`,
        description: `《${book.title}》${book.author}著。${desc} 支持EPUB、MOBI、PDF格式，夸克网盘、百度网盘免费高速下载。`,
        alternates: {
            canonical: `https://qifeibook.com/book/${id}`,
        },
    };
}

export default async function BookDetailPage({ params }: Props) {
    const { id } = await params;
    const book = books.find((b) => b.id === parseInt(id));

    if (!book) {
        notFound();
    }

    // Note: Server Components don't support useState for "Expand/Collapse".
    // To keep it simple for now, we will show full content OR implementation a Client Component wrapper.
    // The user wants "Migrate to Next.js SSG".
    // If I output full content in HTML, it's BETTER for SEO.
    // So I will output FULL CONTENT in the server component.
    // If I really want expand/collapse, I should make a client component for the description.
    // But full content is better for SEO.
    // So I will render full content mostly.
    // However, description might be long.
    // I'll render it fully.

    // Related books calculation
    const relatedBooks = books
        .filter(b => b.category === book.category && b.id !== book.id)
        .sort(() => 0.5 - Math.random()) // Random sort on server might be static per build?
        // Yes, generateStaticParams means it's built ONCE.
        // So "random" will be fixed at build time.
        // This is acceptable for SSG. Or use a deterministic seed.
        .slice(0, 5);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        'name': book.title,
        'author': {
            '@type': 'Person',
            'name': book.author
        },
        'description': book.description,
        'image': book.cover,
        'datePublished': book.year,
        'inLanguage': 'zh-CN',
        'url': `https://qifeibook.com/book/${id}`,
        'publisher': {
            '@type': 'Organization',
            'name': '棋飞书库'
        },
        'genre': book.category
    };

    return (
        <article className="container" style={{ padding: '2rem 1rem' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
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
                    <li><Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>首页</Link></li>
                    <li aria-hidden="true" style={{ color: '#ccc', userSelect: 'none' }}>›</li>
                    <li><Link href={`/category/${book.category}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{book.category}</Link></li>
                    <li aria-hidden="true" style={{ color: '#ccc', userSelect: 'none' }}>›</li>
                    <li aria-current="page" style={{ color: '#333' }}>{book.title}</li>
                </ol>
            </nav>

            <div className={styles.detailContainer}>
                <div className={styles.coverSection}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={book.cover}
                        alt={`${book.title}封面`}
                        className={styles.cover}
                        loading="eager"
                        width={300} // Approximate
                    />
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{book.title}</h1>

                    <div className={styles.authorBio}>
                        <span>{book.authorDetail}</span>
                    </div>

                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>
                            <Calendar size={16} />
                            {book.year}
                        </span>
                        <Link href={`/category/${book.category}`} className={styles.categoryTag}>
                            <Tag size={16} />
                            {book.category}
                        </Link>
                    </div>

                    <div className={styles.description}>
                        <h2 className={styles.sectionHeader}>内容简介</h2>
                        <p style={{ whiteSpace: 'pre-wrap' }}>
                            {book.description}
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.downloadSection}>
                            <h2 className={styles.sectionHeader}>下载地址</h2>
                            {book.downloadLinks.map((link, index) => (
                                <div key={index} className={styles.downloadLinkItem}>
                                    <div className={styles.providerName}>{link.name}</div>
                                    <div className={styles.linkContainer}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            title={`${book.title} - ${link.name}`}
                                        >
                                            {link.url}
                                        </a>
                                        {link.code && <span className={styles.extractCode}>提取码: {link.code}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 相关推荐 */}
            {relatedBooks.length > 0 && (
                <section style={{ marginTop: '3rem' }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        color: 'var(--text-primary)'
                    }}>
                        你可能还喜欢
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {relatedBooks.map(b => (
                            <BookCard key={b.id} book={b} />
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}
