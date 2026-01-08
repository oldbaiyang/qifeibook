import React from 'react';
import { useParams } from 'react-router-dom';
import { books } from '../data/mockData';
import BookCard from '../components/BookCard';

export default function Category() {
    const { id } = useParams();
    const categoryBooks = books.filter(book => book.category === id);

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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {categoryBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 0',
                    color: 'var(--text-secondary)'
                }}>
                    暂无该分类的书籍
                </div>
            )}
        </div>
    );
}
