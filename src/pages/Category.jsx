import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { books } from '../data/mockData';
import BookCard from '../components/BookCard';

export default function Category() {
    const { id } = useParams();
    const [displayCount, setDisplayCount] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const booksPerLoad = 10;

    // 获取当前分类的所有书籍
    const categoryBooks = books.filter(book => book.category === id);
    
    // 当前显示的书籍
    const displayedBooks = categoryBooks.slice(0, displayCount);
    const hasMore = displayCount < categoryBooks.length;

    // 加载更多书籍
    const loadMore = () => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + booksPerLoad, categoryBooks.length));
            setIsLoading(false);
        }, 300);
    };

    // 监听滚动事件
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, displayCount]);

    // SEO优化
    useEffect(() => {
        // 更新页面标题
        document.title = `${id} - 免费电子书下载 - 棋飞书库`;
        
        // 更新meta描述
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const sampleBooks = categoryBooks.slice(0, 3).map(b => b.title).join('、');
            metaDescription.setAttribute('content', `${id}分类提供${categoryBooks.length}本精选电子书免费下载，包括${sampleBooks}等好书。支持EPUB、MOBI、PDF格式，网盘高速下载。`);
        }
        
        // 更新canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', `https://qifeibook.com/category/${encodeURIComponent(id)}`);
        
        // 添加面包屑结构化数据
        const existingScript = document.getElementById('breadcrumb-jsonld');
        if (existingScript) {
            existingScript.remove();
        }
        const script = document.createElement('script');
        script.id = 'breadcrumb-jsonld';
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
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
                    'name': id,
                    'item': `https://qifeibook.com/category/${encodeURIComponent(id)}`
                }
            ]
        });
        document.head.appendChild(script);
        
        return () => {
            const breadcrumbScript = document.getElementById('breadcrumb-jsonld');
            if (breadcrumbScript) {
                breadcrumbScript.remove();
            }
        };
    }, [id, categoryBooks]);

    // 当分类改变时重置显示数量
    useEffect(() => {
        setDisplayCount(10);
        setIsLoading(false);
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            {/* 面包屑导航 */}
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
                        <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            首页
                        </Link>
                    </li>
                    <li aria-hidden="true" style={{ color: '#ccc', userSelect: 'none' }}>›</li>
                    <li aria-current="page" style={{ color: '#333', fontWeight: '500' }}>
                        {id}
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
                    {id}
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#666',
                    fontWeight: 'normal'
                }}>
                    共 {categoryBooks.length} 本精选图书
                </p>
                {categoryBooks.length > 0 && (
                    <p style={{ 
                        color: '#888', 
                        fontSize: '13px', 
                        marginTop: '0.75rem',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        本分类收录了{categoryBooks.length}本{id}相关电子书，支持EPUB、MOBI、PDF格式免费下载。
                        所有书籍均经过精心挑选，提供夸克网盘、百度网盘等多种下载方式。
                    </p>
                )}
            </header>

            {categoryBooks.length > 0 ? (
                <>
                    <section
                        aria-label={`${id}图书列表`}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '2rem',
                            marginBottom: '2rem'
                        }}
                    >
                        {displayedBooks.map((book, index) => (
                            <BookCard 
                                key={book.id} 
                                book={book}
                                priority={index < 10}
                            />
                        ))}
                    </section>

                    {/* 加载状态指示器 */}
                    {isLoading && (
                        <div 
                            role="status"
                            aria-live="polite"
                            style={{
                                textAlign: 'center',
                                padding: '2rem 0',
                                color: '#666'
                            }}
                        >
                            <div style={{
                                display: 'inline-block',
                                width: '30px',
                                height: '30px',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #3498db',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} aria-hidden="true" />
                            <p style={{ marginTop: '1rem' }}>加载更多书籍...</p>
                        </div>
                    )}

                    {/* 没有更多数据提示 */}
                    {!hasMore && !isLoading && displayedBooks.length > 0 && (
                        <div 
                            role="status"
                            style={{
                                textAlign: 'center',
                                padding: '2rem 0',
                                color: '#999',
                                fontSize: '14px'
                            }}
                        >
                            已展示全部 {categoryBooks.length} 本书
                        </div>
                    )}
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    color: '#666'
                }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                        暂无该分类的书籍
                    </p>
                    <Link 
                        to="/" 
                        style={{ 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            fontSize: '0.95rem'
                        }}
                    >
                        返回首页浏览其他分类 →
                    </Link>
                </div>
            )}

            {/* CSS 动画 */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
