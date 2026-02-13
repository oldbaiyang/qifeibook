import React, { useState, useEffect, useRef } from 'react';
import { books } from '../data/mockData';
import BookCard from '../components/BookCard';

export default function Home() {
    const [displayCount, setDisplayCount] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);
    const booksPerLoad = 10;

    // 按ID倒序排序（即按上架时间倒序）
    const sortedBooks = [...books].sort((a, b) => b.id - a.id);
    
    // 当前显示的书籍
    const displayedBooks = sortedBooks.slice(0, displayCount);
    const hasMore = displayCount < sortedBooks.length;

    // 加载更多书籍
    const loadMore = () => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        // 模拟加载延迟，提升用户体验
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + booksPerLoad, sortedBooks.length));
            setIsLoading(false);
        }, 300);
    };

    // 监听滚动事件
    useEffect(() => {
        const handleScroll = () => {
            // 检查是否滚动到底部
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            
            // 当距离底部 100px 时触发加载
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, displayCount]);

    // 页面SEO优化
    useEffect(() => {
        // 确保首页标题和描述正确
        document.title = '棋飞书库 - 经典电子书免费下载 | EPUB/MOBI/PDF格式';
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', '棋飞书库提供海量经典电子书免费下载，支持EPUB、MOBI、PDF等多种格式。收录《活着》、《三体》、《百年孤独》等畅销好书，网盘高速下载，无广告纯净阅读。');
        }
        
        // 更新canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', 'https://qifeibook.com/');
        
        // 添加面包屑导航结构化数据
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
            'itemListElement': [{
                '@type': 'ListItem',
                'position': 1,
                'name': '首页',
                'item': 'https://qifeibook.com/'
            }]
        });
        document.head.appendChild(script);
        
        return () => {
            const breadcrumbScript = document.getElementById('breadcrumb-jsonld');
            if (breadcrumbScript) {
                breadcrumbScript.remove();
            }
        };
    }, []);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }} ref={containerRef}>
            <section style={{ marginBottom: '3rem' }}>
                {/* SEO友好的标题结构 */}
                <header className="section-title" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        全部图书
                    </h1>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '0.5rem' }}>
                        共 {books.length} 本精选电子书，持续更新中
                    </p>
                </header>
                
                <section 
                    aria-label="图书列表"
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
                            priority={index < 10} // 优先加载前10本书的图片
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
                        <p>已展示全部 {books.length} 本书</p>
                        <p style={{ marginTop: '0.5rem', fontSize: '13px' }}>
                            感谢您的阅读，我们会持续更新更多好书
                        </p>
                    </div>
                )}
            </section>

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
