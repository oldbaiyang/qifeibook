import React from 'react';
import Link from 'next/link';
import styles from './BookCard.module.css';
import { Book } from '@/data/mockData';

interface BookCardProps {
    book: Book;
    priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
    return (
        <article itemScope itemType="https://schema.org/Book">
            <Link
                href={`/book/${book.id}`}
                className={`card ${styles.card}`}
                title={`${book.title} - ${book.author} | 免费下载`}
            >
                <div className={styles.coverWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={book.cover}
                        alt={`${book.title}封面图片`}
                        className={styles.cover}
                        loading={priority ? "eager" : "lazy"}
                        decoding={priority ? "sync" : "async"}
                        itemProp="image"
                        width="200"
                        height="280"
                    />
                    <div className={styles.overlay}>
                        <span className={styles.viewBtn}>查看详情</span>
                    </div>
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title} title={book.title} itemProp="name">
                        {book.title}
                    </h3>
                    <p className={styles.author} itemProp="author">
                        {book.author}
                    </p>
                    <div className={styles.meta}>
                        <span className={styles.tag} itemProp="genre">{book.category}</span>
                        <span className={styles.year} itemProp="datePublished">{book.year}</span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
