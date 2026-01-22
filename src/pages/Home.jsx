import React from 'react';
import { books } from '../data/mockData';
import BookCard from '../components/BookCard';

export default function Home() {
    const newBooks = books.slice(0, 8);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
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
        </div>
    );
}
