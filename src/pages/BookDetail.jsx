import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { books } from '../data/mockData';
import { Calendar, User, Tag } from 'lucide-react';
import styles from './BookDetail.module.css';

export default function BookDetail() {
    const { id } = useParams();
    const book = books.find(b => b.id === parseInt(id));

    if (!book) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>书籍不存在</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className={styles.detailContainer}>
                <div className={styles.coverSection}>
                    <img src={book.cover} alt={book.title} className={styles.cover} />
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{book.title}</h1>
                    <div className={styles.metaRow}>
                        <span className={styles.author}>
                            <User size={16} />
                            {book.authorDetail}
                        </span>
                        <span className={styles.metaItem}>
                            <Calendar size={16} />
                            {book.year}
                        </span>
                        <Link to={`/category/${book.category}`} className={styles.categoryTag}>
                            <Tag size={16} />
                            {book.category}
                        </Link>
                    </div>

                    <div className={styles.description}>
                        <h3 className={styles.sectionHeader}>内容简介</h3>
                        <p>{book.description}</p>
                    </div>



                    <div className={styles.actions}>
                        <div className={styles.downloadSection}>
                            <h3 className={styles.sectionHeader}>下载地址</h3>
                            {book.downloadLinks ? (
                                book.downloadLinks.map((link, index) => (
                                    <div key={index} className={styles.downloadLinkItem}>
                                        <div className={styles.providerName}>{link.name}</div>
                                        <div className={styles.linkContainer}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                {link.url}
                                            </a>
                                            {link.code && <span className={styles.extractCode}>提取码: {link.code}</span>}
                                        </div>
                                    </div>
                                ))
                            ) : book.downloadLink ? (
                                <div className={styles.downloadLinkItem}>
                                    <div className={styles.providerName}>下载链接</div>
                                    <div className={styles.linkContainer}>
                                        <a href={book.downloadLink} target="_blank" rel="noopener noreferrer">{book.downloadLink}</a>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
