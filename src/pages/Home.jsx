import React from 'react';
import { books, categories } from '../data/mockData';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

export default function Home() {
    const featuredBooks = books.slice(0, 4);
    const newBooks = books.slice(0, 8);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <section style={{ marginBottom: '3rem' }}>
                <div className="section-title">
                    <h2>热门推荐</h2>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {featuredBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <div className="section-title">
                    <h2>最新上架</h2>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {newBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

            <section>
                <div className="section-title">
                    <h2>分类浏览</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            to={`/category/${cat}`}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'white',
                                border: '1px solid var(--border-color)',
                                borderRadius: '99px',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.color = 'var(--primary-color)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
