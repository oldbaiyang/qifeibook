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
        <div className="px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-8 border-b border-gray-200 pb-4 flex items-baseline justify-between">
                <h2 className="text-xl font-bold">
                    搜索结果: "{query}"
                </h2>
                <span className="text-sm text-gray-600">
                    共 {searchResults.length} 个结果
                </span>
            </div>

            {searchResults.length > 0 ? (
                <BookList books={searchResults} />
            ) : (
                <div className="text-center py-16 text-gray-600">
                    <p className="text-xl mb-4">没有找到相关书籍</p>
                    <p>请尝试搜索书名或作者关键词</p>
                    <Link href="/" className="inline-block mt-8 text-blue-500 no-underline hover:underline">
                        返回首页
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="px-4 py-8">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
