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
            // Update page title
            document.title = `${book.title} - ${book.author} | 免费电子书下载 - 棋飞书库`;
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                const desc = book.description ? book.description.substring(0, 150) + '...' : `${book.title}免费下载，支持EPUB、MOBI、PDF格式`;
                metaDescription.setAttribute('content', `${book.title} - ${book.author}。${desc} 棋飞书库提供高速网盘下载。`);
            }
            
            // Update canonical URL
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.setAttribute('href', `https://qifeibook.com/book/${id}`);
            
            // Add JSON-LD structured data
            const existingScript = document.getElementById('book-jsonld');
            if (existingScript) {
                existingScript.remove();
            }
            const script = document.createElement('script');
            script.id = 'book-jsonld';
            script.type = 'application/ld+json';
            script.text = JSON.stringify({
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
            });
            document.head.appendChild(script);
        }
        
        return () => {
            document.title = '棋飞书库 - 经典电子书免费下载 | EPUB/MOBI/PDF格式';
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', '棋飞书库提供海量经典电子书免费下载，支持EPUB、MOBI、PDF等多种格式。收录《活着》、《三体》、《百年孤独》等畅销好书，网盘高速下载，无广告纯净阅读。');
            }
            const bookScript = document.getElementById('book-jsonld');
            if (bookScript) {
                bookScript.remove();
            }
        };
    }, [book, id]);

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
        <article className="container" style={{ padding: '2rem 1rem' }} itemScope itemType="https://schema.org/Book">
            <nav aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
                <ol style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    <li><Link to="/" style={{ color: '#3b82f6' }}>首页</Link></li>
                    <li>/</li>
                    <li><Link to={`/category/${book.category}`} style={{ color: '#3b82f6' }}>{book.category}</Link></li>
                    <li>/</li>
                    <li aria-current="page" style={{ color: '#333' }}>{book.title}</li>
                </ol>
            </nav>
            
            <div className={styles.detailContainer}>
                <div className={styles.coverSection}>
                    <img 
                        src={book.cover} 
                        alt={`${book.title}封面`} 
                        className={styles.cover}
                        itemProp="image"
                        loading="eager"
                    />
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.title} itemProp="name">{book.title}</h1>
                    
                    <div className={styles.authorBio} itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span itemProp="name">{isAuthorExpanded ? book.authorDetail : truncateText(book.authorDetail, authorBioThreshold)}</span>
                        {showAuthorExpand && (
                            <button 
                                className={styles.expandButton}
                                onClick={() => setIsAuthorExpanded(!isAuthorExpanded)}
                                aria-expanded={isAuthorExpanded}
                            >
                                {isAuthorExpanded ? '(收起)' : '(展开全部)'}
                            </button>
                        )}
                    </div>

                    <div className={styles.metaRow}>
                        <span className={styles.metaItem} itemProp="datePublished">
                            <Calendar size={16} />
                            {book.year}
                        </span>
                        <Link to={`/category/${book.category}`} className={styles.categoryTag} itemProp="genre">
                            <Tag size={16} />
                            {book.category}
                        </Link>
                    </div>

                    <div className={styles.description} itemProp="description">
                        <h2 className={styles.sectionHeader}>内容简介</h2>
                        <p>
                            {isDescExpanded ? book.description : truncateText(book.description, descThreshold)}
                        </p>
                        {showDescExpand && (
                            <button 
                                className={styles.expandButton}
                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                aria-expanded={isDescExpanded}
                            >
                                {isDescExpanded ? '(收起)' : '(展开全部)'}
                            </button>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.downloadSection}>
                            <h2 className={styles.sectionHeader}>下载地址</h2>
                            {book.downloadLinks ? (
                                book.downloadLinks.map((link, index) => (
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
                                ))
                            ) : book.downloadLink ? (
                                <div className={styles.downloadLinkItem}>
                                    <div className={styles.providerName}>下载链接</div>
                                    <div className={styles.linkContainer}>
                                        <a 
                                            href={book.downloadLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer nofollow"
                                        >
                                            {book.downloadLink}
                                        </a>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
