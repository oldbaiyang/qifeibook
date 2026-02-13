"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import { Book } from '@/data/mockData';

interface BookListProps {
    books: Book[];
}

export default function BookList({ books }: BookListProps) {
    const [displayCount, setDisplayCount] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const booksPerLoad = 10;

    const displayedBooks = books.slice(0, displayCount);
    const hasMore = displayCount < books.length;

    // 使用 useCallback 避免函数重新创建
    const loadMore = useCallback(() => {
        if (isLoading) return;
        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + booksPerLoad, books.length));
            setIsLoading(false);
        }, 500);
    }, [isLoading, booksPerLoad, books.length]);

    useEffect(() => {
        // 只创建一次 observer
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const first = entries[0];
                    // 检查最新状态而不是依赖闭包
                    if (first.isIntersecting) {
                        loadMore();
                    }
                },
                { threshold: 0.1 }
            );
        }

        const currentLoader = loaderRef.current;
        const observer = observerRef.current;

        if (currentLoader && hasMore && !isLoading) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasMore, isLoading, loadMore]); // 只在必要时重新设置观察

    // 清理 observer
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <>
            <section
                aria-label="图书列表"
                className="book-grid"
            >
                {displayedBooks.map((book, index) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        priority={index < 10}
                    />
                ))}
                {isLoading && (
                    <>
                        {Array.from({ length: Math.min(booksPerLoad, books.length - displayCount) }).map((_, index) => (
                            <BookCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </>
                )}
            </section>

            {/* Loading Indicator / Sentinel */}
            {hasMore && !isLoading && (
                <div
                    ref={loaderRef}
                    role="status"
                    aria-live="polite"
                    className="text-center py-10"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-full text-gray-500 text-sm">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        <span>下滑加载更多</span>
                    </div>
                </div>
            )}

            {/* End of List Message */}
            {!hasMore && displayedBooks.length > 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <div style={{ maxWidth: '320px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #e2e8f0)' }}></div>
                            <div style={{
                                width: '44px', height: '44px',
                                background: '#eff6ff',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.25rem',
                                flexShrink: 0,
                            }}>📚</div>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #e2e8f0)' }}></div>
                        </div>
                        <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
                            已展示全部 <span style={{ color: '#2563eb' }}>{books.length}</span> 本书
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            感谢您的阅读，我们会持续更新更多好书
                        </p>
                    </div>
                </div>
            )}

            {/* No Books Message */}
            {displayedBooks.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📭</span>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium text-lg">暂无书籍</p>
                            <p className="text-gray-400 text-sm mt-1">请稍后再来查看</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
