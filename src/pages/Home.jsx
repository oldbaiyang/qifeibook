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

    return (
        <div className="container" style={{ padding: '2rem 1rem' }} ref={containerRef}>
            <section style={{ marginBottom: '3rem' }}>
                <div className="section-title" style={{ marginBottom: '2rem' }}>
                    <h2>全部图书</h2>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '0.5rem' }}>
                        共 {books.length} 本书
                    </p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {displayedBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

                {/* 加载状态指示器 */}
                {isLoading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 0',
                        color: '#666'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '30px',
                            height: '30px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ marginTop: '1rem' }}>加载中...</p>
                    </div>
                )}

                {/* 没有更多数据提示 */}
                {!hasMore && !isLoading && displayedBooks.length > 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 0',
                        color: '#999',
                        fontSize: '14px'
                    }}>
                        已展示全部 {books.length} 本书
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
