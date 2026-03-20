import { books } from "@/data/mockData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedBooks from "@/components/RelatedBooks";
import ExpandableText from "@/components/ExpandableText";
import DownloadCard from "@/components/DownloadCard";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Tag,
  FileText,
  HardDrive,
  BookOpen,
  User,
  Cloud,
} from "lucide-react";
import styles from "./page.module.css";
import { generateBookJsonLd, generateBreadcrumbJsonLd } from "@/lib/utils";

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

  const desc = book.description
    ? book.description.substring(0, 120)
    : `${book.title}免费下载`;

  return {
    title: `《${book.title}》${book.author}_EPUB/MOBI/PDF免费下载_棋飞书库`,
    description: `《${book.title}》${book.author}著。${desc} 支持EPUB、MOBI、PDF格式，夸克网盘、百度网盘免费高速下载。`,
    keywords: book.keywords,
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

  // Related books calculation
  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  const jsonLd = generateBookJsonLd(book, id);

  // 面包屑 JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "首页", url: "https://qifeibook.com/" },
    { name: book.category, url: `https://qifeibook.com/category/${encodeURIComponent(book.category)}` },
    { name: book.title, url: `https://qifeibook.com/book/${id}` }
  ]);

  return (
    <article className="px-4 py-8 md:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <BreadcrumbNav
        items={[
          { name: "首页", href: "/" },
          { name: book.category, href: `/category/${book.category}` },
          { name: book.title },
        ]}
      />

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

          {/* 元信息：格式、大小、出版年份 */}
          <div className="metaInfo">
            <span className="metaInfoItem">
              <FileText size={14} />
              {book.format || "EPUB"}
            </span>
            <span className="metaDivider"></span>
            <span className="metaInfoItem">
              <HardDrive size={14} />
              {book.size || "未知"}
            </span>
            {book.publishYear && (
              <>
                <span className="metaDivider"></span>
                <span className="metaInfoItem">
                  <Calendar size={14} />
                  {book.publishYear}年出版
                </span>
              </>
            )}
            <span className="metaDivider"></span>
            <Link
              href={`/category/${book.category}`}
              className="metaInfoItem"
              style={{ color: "var(--primary-color)" }}
            >
              <Tag size={14} />
              {book.category}
            </Link>
          </div>

          {/* 作者简介 */}
          {book.authorDetail && (
            <div className="sectionBlock">
              <h2 className="sectionTitle">
                <User size={16} />
                作者简介
              </h2>
              <ExpandableText text={book.authorDetail} maxLines={2} />
            </div>
          )}

          {/* 内容简介 */}
          {book.description && (
            <div className="sectionBlock">
              <h2 className="sectionTitle">
                <BookOpen size={16} />
                内容简介
              </h2>
              <ExpandableText text={book.description} maxLines={4} />
            </div>
          )}

          {/* 下载区域 */}
          <div className="sectionBlock" style={{ borderLeftColor: "#10b981" }}>
            <h2 className="sectionTitle" style={{ color: "#10b981" }}>
              <Cloud size={16} />
              下载地址
            </h2>
            <div className={styles.downloadSection}>
              {book.downloadLinks.map((link, index) => (
                <DownloadCard
                  key={index}
                  name={link.name}
                  url={link.url}
                  code={link.code}
                  format={book.format || "EPUB"}
                  size={book.size || "未知"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedBooks books={relatedBooks} />
    </article>
  );
}
