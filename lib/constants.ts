/**
 * 项目常量配置
 */

// 站点信息
export const SITE_NAME = '棋飞书库';
export const SITE_URL = 'https://qifeibook.com';
export const SITE_DESCRIPTION = '海量经典电子书免费下载，支持EPUB、MOBI、PDF格式';

// 分页配置
export const BOOKS_PER_LOAD = 10;
export const INITIAL_BOOKS_COUNT = 10;

// 图片配置
export const DEFAULT_COVER = '/default-cover.svg';
export const IMAGE_WIDTH = 300;
export const IMAGE_HEIGHT = 420;
export const IMAGE_ASPECT_RATIO = 140 / 100;

// SEO 配置
export const META_DESCRIPTION_LENGTH = 160;
export const META_TITLE_LENGTH = 60;

// 加载延迟（毫秒）
export const LOADING_DELAY = 500;

// 网盘提供商
export const DISK_PROVIDERS = {
    QUARK: '夸克网盘',
    BAIDU: '百度网盘',
    ALI: '阿里云盘',
} as const;

// 书籍格式
export const BOOK_FORMATS = {
    EPUB: 'EPUB',
    MOBI: 'MOBI',
    PDF: 'PDF',
    AZW3: 'AZW3',
    TXT: 'TXT',
} as const;

// 社交媒体配置
export const SOCIAL = {
    TWITTER_CARD: 'summary',
    TWITTER_CARD_LARGE: 'summary_large_image',
    OG_TYPE_WEBSITE: 'website',
    OG_TYPE_BOOK: 'book',
} as const;

// 分类配置
export const CATEGORY_THRESHOLDS = {
    LARGE: 50,    // 大分类
    MEDIUM: 10,   // 中等分类
    SMALL: 5,     // 小分类
} as const;

// 错误消息
export const ERROR_MESSAGES = {
    BOOK_NOT_FOUND: '未找到该书籍',
    CATEGORY_NOT_FOUND: '未找到该分类',
    NETWORK_ERROR: '网络错误，请稍后重试',
    IMAGE_LOAD_ERROR: '图片加载失败',
} as const;
