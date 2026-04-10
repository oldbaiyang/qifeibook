import { Metadata } from 'next';
import SearchContentWrapper from './SearchContent';
import { generateWebsiteJsonLd } from '@/lib/utils';

export const metadata: Metadata = {
    title: '搜索书籍_免费电子书搜索引擎_棋飞书库',
    description: '在棋飞书库搜索您想看的电子书，支持书名、作者名搜索。提供 EPUB、MOBI、PDF 格式的免费下载，夸克网盘、百度网盘高速下载。',
    keywords: ['电子书搜索', '免费电子书下载', '书籍搜索引擎', 'EPUB下载', 'MOBI下载', 'PDF下载'],
    alternates: {
        canonical: 'https://qifeibook.com/search',
    },
    openGraph: {
        title: '搜索书籍_棋飞书库',
        description: '在棋飞书库搜索您想看的电子书，支持书名、作者名搜索，免费高速下载',
        url: 'https://qifeibook.com/search',
        siteName: '棋飞书库',
        type: 'website',
        locale: 'zh_CN',
    },
    twitter: {
        card: 'summary',
        title: '搜索书籍_棋飞书库',
        description: '在棋飞书库搜索您想看的电子书，免费高速下载',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function SearchPage() {
    const jsonLd = generateWebsiteJsonLd();

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SearchContentWrapper />
        </div>
    );
}
