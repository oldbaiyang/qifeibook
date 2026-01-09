import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Menu } from 'lucide-react';
import { categories } from '../data/mockData';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo}>
                    <BookOpen className={styles.logoIcon} />
                    <span>棋飞书库</span>
                </Link>

                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="搜索书名、作者..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className={styles.searchBtn} onClick={handleSearch}>
                        <Search size={20} />
                    </button>
                </div>

                <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu size={24} />
                </button>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>首页</Link>
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            to={`/category/${cat}`}
                            className={styles.navLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {cat}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
