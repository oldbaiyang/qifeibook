import React from 'react';

export default function Footer() {
    return (
        <footer style={{
            padding: '2rem 0',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            borderTop: '1px solid var(--border-color)',
            marginTop: '4rem',
            fontSize: '0.9rem'
        }}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} 棋飞书库. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem' }}>仅供学习交流，请支持正版。</p>
            </div>
        </footer>
    );
}
