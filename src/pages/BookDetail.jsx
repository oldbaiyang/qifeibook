import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { books } from '../data/mockData';
import { Calendar, User, Tag } from 'lucide-react';
import styles from './BookDetail.module.css';

export default function BookDetail() {
    const { id } = useParams();
    const book = books.find(b => b && b.id === parseInt(id));
    
    // States for expanding text
    const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    useEffect(() => {
        if (book) {
            document.title = `${book.title} - ${book.author} - 免费电子书下载 - 棋飞书库`;
        }
        return () => {
            document.title = '棋飞书库 - 经典电子书免费下载 (EPUB/MOBI/PDF)';
        };
    }, [book]);

    if (!book) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>书籍不存在</div>;
    }

    // Helper to truncate text
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    // Determine if we need expansion (threshold ~200 chars or as needed)
    const authorBioThreshold = 200;
    const descThreshold = 250;
    
    const showAuthorExpand = book.authorDetail && book.authorDetail.length > authorBioThreshold;
    const showDescExpand = book.description && book.description.length > descThreshold;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className={styles.detailContainer}>
                <div className={styles.coverSection}>
                    <img src={book.cover} alt={book.title} className={styles.cover} />
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{book.title}</h1>
                    
                    <div className={styles.authorBio}>
                        {isAuthorExpanded ? book.authorDetail : truncateText(book.authorDetail, authorBioThreshold)}
                        {showAuthorExpand && (
                            <button 
                                className={styles.expandButton}
                                onClick={() => setIsAuthorExpanded(!isAuthorExpanded)}
                            >
                                {isAuthorExpanded ? '(收起)' : '(展开全部)'}
                            </button>
                        )}
                    </div>

                    <div className={styles.metaRow}>
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
                        <p>
                            {isDescExpanded ? book.description : truncateText(book.description, descThreshold)}
                        </p>
                        {showDescExpand && (
                            <button 
                                className={styles.expandButton}
                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                            >
                                {isDescExpanded ? '(收起)' : '(展开全部)'}
                            </button>
                        )}
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
