import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageClick = (page) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 生成页码数组
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            // 如果总页数≤7,显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 总是显示: 1 ... 当前页-1 当前页 当前页+1 ... 最后页
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '3rem 0',
            flexWrap: 'wrap'
        }}>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #e0e0e0',
                    background: currentPage === 1 ? '#f5f5f5' : 'white',
                    color: currentPage === 1 ? '#999' : '#333',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                        e.target.style.borderColor = '#333';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                }}
            >
                上一页
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} style={{ padding: '0 0.5rem', color: '#999' }}>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        style={{
                            padding: '0.5rem 0.75rem',
                            minWidth: '36px',
                            border: '1px solid #e0e0e0',
                            background: currentPage === page ? '#333' : 'white',
                            color: currentPage === page ? 'white' : '#333',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: currentPage === page ? 'bold' : 'normal',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== page) {
                                e.target.style.background = '#f5f5f5';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== page) {
                                e.target.style.background = 'white';
                            }
                        }}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #e0e0e0',
                    background: currentPage === totalPages ? '#f5f5f5' : 'white',
                    color: currentPage === totalPages ? '#999' : '#333',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                        e.target.style.borderColor = '#333';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                }}
            >
                下一页
            </button>

            <span style={{
                marginLeft: '1rem',
                color: '#666',
                fontSize: '14px'
            }}>
                第 {currentPage} / {totalPages} 页
            </span>
        </div>
    );
}
