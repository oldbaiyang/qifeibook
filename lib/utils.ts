/**
 * 公共工具函数
 */

interface BreadcrumbItem {
    name: string;
    url: string;
}

/**
 * 生成面包屑导航的 JSON-LD 结构化数据
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url
        }))
    };
}

/**
 * 生成图书的 JSON-LD 结构化数据
 */
export function generateBookJsonLd(book: any, bookId: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Book',
        'name': book.title,
        'author': {
            '@type': 'Person',
            'name': book.author
        },
        'description': book.description,
        'image': book.cover,
        'datePublished': book.year,
        'inLanguage': 'zh-CN',
        'url': `https://qifeibook.com/book/${bookId}`,
        'publisher': {
            '@type': 'Organization',
            'name': '棋飞书库'
        },
        'genre': book.category
    };
}

/**
 * 截断文本到指定长度
 */
export function truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) : text;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * 获取当前年份（用于版权信息）
 */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}

/**
 * 生成页面标题
 */
export function generatePageTitle(title: string, siteName: string = '棋飞书库'): string {
    return `${title}_${siteName}`;
}

/**
 * 生成页面描述
 */
export function generatePageDescription(text: string, maxLength: number = 160): string {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    return truncateText(cleanText, maxLength);
}
