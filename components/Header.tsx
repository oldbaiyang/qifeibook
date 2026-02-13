"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Search } from 'lucide-react';
import { books } from '../data/mockData';
import styles from './Header.module.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const router = useRouter();

    // 统计每个分类的书籍数量
    const categoryCount: Record<string, number> = {};
    books.forEach(book => {
        categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
    });

    // 按数量排序的分类
    const sortedCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // 根据书籍数量计算标签大小
    const getTagSize = (category: string) => {
        const count = categoryCount[category] || 0;
        if (count >= 50) return styles.tagLarge;
        if (count >= 10) return styles.tagMedium;
        if (count >= 5) return styles.tagSmall;
        return styles.tagTiny;
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
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
            </div>

            {/* 标签云 */}
            <div className={styles.tagCloudContainer}>
                <div className={`container ${styles.tagCloud}`}>
                    <Link href="/" className={`${styles.tag} ${styles.tagHome}`}>
                        全部
                    </Link>
                    {sortedCategories.map(cat => (
                        <Link
                            key={cat}
                            href={`/category/${cat}`}
                            className={`${styles.tag} ${getTagSize(cat)}`}
                        >
                            {cat}
                            <span className={styles.tagCount}>{categoryCount[cat]}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
