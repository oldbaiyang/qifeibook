import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    }, [isLoading, hasMore, displayCount, id]);

    // 当分类改变时重置显示数量
    useEffect(() => {
        setDisplayCount(10);
        setIsLoading(false);
    }, [id]);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="section-title">
                <h2>{id}</h2>
                <span style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 'normal',
                    marginLeft: 'auto'
                }}>
                    共 {categoryBooks.length} 本书
                </span>
            </div>

            {categoryBooks.length > 0 ? (
                <>
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
                            已展示全部 {categoryBooks.length} 本书
                        </div>
                    )}
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    color: 'var(--text-secondary)'
                }}>
                    暂无该分类的书籍
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
