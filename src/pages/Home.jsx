import React, { useState } from 'react';
import { books } from '../data/mockData';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    // 计算分页
    const totalPages = Math.ceil(books.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = books.slice(startIndex, startIndex + booksPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <section style={{ marginBottom: '3rem' }}>
                <div className="section-title" style={{ marginBottom: '2rem' }}>
                    <h2>全部图书</h2>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '0.5rem' }}>
                        共 {books.length} 本书
                    </p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {currentBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </div>
    );
}
