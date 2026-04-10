/**
 * 公共工具函数
 */

interface BreadcrumbItem {
    name: string;
    url: string;
}

/**
 * 生成 WebSite JSON-LD 结构化数据（包含 SearchAction）
 */
export function generateWebsiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': '棋飞书库',
        'url': 'https://qifeibook.com',
        'description': '免费电子书下载网站，提供小说、文学、历史、科幻等各类电子书资源',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://qifeibook.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    };
}

/**
 * 生成 FAQPage JSON-LD 结构化数据
 */
export function generateFaqJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': '棋飞书库的书籍从哪里来？',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': '棋飞书库的书籍主要来自网络公开资源，经过整理和分类后提供给用户免费下载。我们尊重知识产权，仅提供书籍资源的导航和整理服务。'
                }
            },
            {
                '@type': 'Question',
                'name': '下载的电子书是什么格式？',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': '我们提供的电子书主要包含 EPUB、MOBI、PDF 三种常见格式。不同书籍支持的格式可能不同，请查看每本书的详情页选择适合您的版本。'
                }
            },
            {
                '@type': 'Question',
                'name': '如何获取书籍的下载链接？',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': '每本书详情页都提供夸克网盘和百度网盘两种下载方式。点击相应的下载按钮即可跳转到网盘页面，部分书籍可能需要输入提取码。'
                }
            },
            {
                '@type': 'Question',
                'name': '下载书籍是否收费？',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': '棋飞书库的所有书籍资源均免费下载使用。我们不收取任何费用，如遇到收费情况请警惕可能的诈骗行为。'
                }
            },
            {
                '@type': 'Question',
                'name': '支持哪些阅读设备？',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'EPUB 格式支持绝大多数电子书阅读器（如 Kindle、iPad、各品牌阅读器）及手机阅读APP；MOBI 格式主要支持 Kindle 设备；PDF 格式可在任何设备上查看。'
                }
            }
        ]
    };
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
    // 解析文件格式
    const formats = book.format ? book.format.split(',').map((f: string) => f.trim().toUpperCase()) : ['EPUB'];

    const baseData: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        'name': book.title,
        'author': {
            '@type': 'Person',
            'name': book.author
        },
        'description': book.description,
        'image': book.cover,
        'datePublished': book.publishYear || book.year,
        'inLanguage': 'zh-CN',
        'url': `https://qifeibook.com/book/${bookId}`,
        'publisher': {
            '@type': 'Organization',
            'name': '棋飞书库'
        },
        'genre': book.category,
        'bookFormat': 'EBook',
        'encodingFormat': formats,
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'CNY',
            'availability': 'https://schema.org/InStock',
            'seller': {
                '@type': 'Organization',
                'name': '棋飞书库'
            }
        }
    };

    // 只有当 book.rating 存在时才添加 aggregateRating
    if (book.rating) {
        baseData.aggregateRating = {
            '@type': 'AggregateRating',
            'ratingValue': book.rating,
            'bestRating': '10',
            'worstRating': '0'
        };
    }

    return baseData;
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
