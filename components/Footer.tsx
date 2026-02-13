import React from 'react';

export default function Footer() {
    return (
        <footer className="py-8 text-center border-t mt-16 text-sm" style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-color)'
        }}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} 棋飞书库. All rights reserved.</p>
                <p className="mt-2">仅供学习交流，请支持正版。</p>
            </div>
        </footer>
    );
}
