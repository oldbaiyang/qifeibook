import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BookCard.module.css';

export default function BookCard({ book }) {
    return (
        <Link to={`/book/${book.id}`} className={`card ${styles.card}`}>
            <div className={styles.coverWrapper}>
                <img src={book.cover} alt={book.title} className={styles.cover} loading="lazy" />
                <div className={styles.overlay}>
                    <span className={styles.viewBtn}>查看详情</span>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title} title={book.title}>{book.title}</h3>
                <p className={styles.author}>{book.author}</p>
                <div className={styles.meta}>
                    <span className={styles.tag}>{book.category}</span>
                    <span className={styles.year}>{book.year}</span>
                </div>
            </div>
        </Link>
    );
}
