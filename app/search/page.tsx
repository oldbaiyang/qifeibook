"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { books } from '@/data/mockData';
import BookList from '@/components/BookList';
import Link from 'next/link';
import { Metadata } from 'next';

// Metadata needs to be exported from a Server Component or handled differently in Client Component.
// Since this is a client component for search params, we can't export metadata that depends on search params easily in the same file if we want to use hooks.
// But actually, we can export metadata from a layout or a wrapper server component.
// For now, let's just set document title in useEffect or use a wrapper.
// Next.js recommended way for search pages:
// page.tsx (Server Component) -> SearchResults (Client Component)
// But to keep it simple and consistent with previous pages, I will make page.tsx a client component first.
// Wait, "use client" pages cannot export generateMetadata.
// So I should keep page.tsx as Server Component and use a client component for the search logic.
// But search params are dynamic.
// In Next.js 15, `searchParams` prop in page is a Promise.
// But for static site generation (which we are doing), search pages are usually dynamic.
// We can force dynamic rendering for search page.

// Let's create a Client Component for the list.

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    // Filter books
    const searchResults = books.filter(book => {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return false;
        return (
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        );
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="section-title" style={{
                marginBottom: '2rem',
                borderBottom: '1px solid #eee',
                paddingBottom: '1rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    搜索结果: "{query}"
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    共 {searchResults.length} 个结果
                </span>
            </div>

            {searchResults.length > 0 ? (
                <BookList books={searchResults} />
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>没有找到相关书籍</p>
                    <p>请尝试搜索书名或作者关键词</p>
                    <Link href="/" style={{
                        display: 'inline-block',
                        marginTop: '2rem',
                        color: '#3b82f6',
                        textDecoration: 'none'
                    }}>
                        返回首页
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '2rem' }}>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
