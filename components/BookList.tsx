"use client";

import React, { useState, useEffect, useRef } from 'react';
import BookCard from './BookCard';
import { Book } from '@/data/mockData';

interface BookListProps {
    books: Book[];
}

export default function BookList({ books }: BookListProps) {
    const [displayCount, setDisplayCount] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const booksPerLoad = 10;

    const displayedBooks = books.slice(0, displayCount);
    const hasMore = displayCount < books.length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !isLoading && hasMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [isLoading, hasMore]); // Re-create observer when these change? Or handle inside callback.
    // Actually, closure issue if loadMore depends on state. 
    // Better to use ref for observer and handle logic.
    // But standard way:

    const loadMore = () => {
        setIsLoading(true);
        // Simulate network delay for UX (optional, but good for "loading" feedback)
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + booksPerLoad, books.length));
            setIsLoading(false);
        }, 500);
    };

    return (
        <>
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
                        priority={index < 10} // Priority for initial load
                    />
                ))}
            </section>

            {/* Loading Indicator / Sentinel */}
            {(hasMore || isLoading) && (
                <div
                    ref={loaderRef}
                    role="status"
                    aria-live="polite"
                    style={{
                        textAlign: 'center',
                        padding: '2rem 0',
                        color: '#666',
                        minHeight: '80px' // Ensure visibility
                    }}
                >
                    {isLoading ? (
                        <div style={{
                            display: 'inline-block',
                            width: '30px',
                            height: '30px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} aria-hidden="true" />
                    ) : (
                        <span>加载更多...</span>
                    )}
                </div>
            )}

            {/* End of List Message */}
            {!hasMore && displayedBooks.length > 0 && (
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

            {/* No Books Message */}
            {displayedBooks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                    暂无书籍
                </div>
            )}

            <style jsx>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
        </>
    );
}
