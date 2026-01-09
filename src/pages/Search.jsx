import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { books } from '../data/mockData';
import BookCard from '../components/BookCard';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // Filter books based on query (case-insensitive title or author match)
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
            <div className="section-title">
                <h2>搜索结果: "{query}"</h2>
                <span style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 'normal',
                    marginLeft: 'auto'
                }}>
                    共 {searchResults.length} 个结果
                </span>
            </div>

            {searchResults.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {searchResults.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    color: 'var(--text-secondary)'
                }}>
                    <p>没有找到相关书籍</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>请尝试其他关键词</p>
                </div>
            )}
        </div>
    );
}
