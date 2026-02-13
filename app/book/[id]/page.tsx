import { books } from "@/data/mockData";
import BookCard from "@/components/BookCard";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedBooks from "@/components/RelatedBooks";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag } from "lucide-react";
import styles from "./page.module.css";
import { generateBookJsonLd } from "@/lib/utils";
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
        openGraph: {
            title: `《${book.title}》${book.author}`,
            description: desc,
            url: `https://qifeibook.com/book/${id}`,
            siteName: "棋飞书库",
            type: "book",
            locale: "zh_CN",
            images: [
                {
                    url: book.cover,
                    width: 300,
                    height: 420,
                    alt: `${book.title}封面`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `《${book.title}》${book.author}`,
            description: desc,
            images: [book.cover],
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

    const jsonLd = generateBookJsonLd(book, id);

    return (
        <article className="px-4 py-8 md:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <BreadcrumbNav items={[
                { name: "首页", href: "/" },
                { name: book.category, href: `/category/${book.category}` },
                { name: book.title }
            ]} />

            <div className={styles.detailContainer}>
                <div className={styles.coverSection}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={book.cover}
                        alt={`${book.title}封面`}
                        className={styles.cover}
                        loading="eager"
                        width={300}
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
                        <p className="whitespace-pre-wrap">
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

            <RelatedBooks books={relatedBooks} />
        </article>
    );
}
