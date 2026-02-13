"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { books } from '@/data/mockData';
import BookList from '@/components/BookList';
import Link from 'next/link';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const searchResults = books.filter(book => {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return false;
        return (
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        );
    });

    return (
        <div>
            {/* 搜索结果头部 */}
            <header className="page-header">
                <div className="page-header-content">
                    <div className="page-header-icon">🔍</div>
                    <div className="page-header-text">
                        <h1>搜索结果: &ldquo;{query}&rdquo;</h1>
                        <p>
                            {searchResults.length > 0 ? (
                                <>找到 <span className="highlight">{searchResults.length}</span> 本相关书籍</>
                            ) : (
                                '未找到相关书籍'
                            )}
                        </p>
                    </div>
                </div>
            </header>

            {/* 搜索结果列表 */}
            {searchResults.length > 0 ? (
                <section>
                    <BookList books={searchResults} />
                </section>
            ) : (
                <div className="text-center py-20">
                    <div className="inline-flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                            <BookOpen size={36} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-gray-700 font-medium text-lg mb-1">
                                没有找到与 &ldquo;{query}&rdquo; 相关的书籍
                            </p>
                            <p className="text-gray-400 text-sm">
                                请尝试更换关键词，或搜索书名、作者名
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            返回首页
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="px-4 py-8 text-center text-gray-500">
                <Search size={24} className="mx-auto mb-2 animate-pulse" />
                加载中...
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

