import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '页面未找到_棋飞书库',
    description: '抱歉，您访问的页面不存在。棋飞书库提供海量经典电子书免费下载，支持EPUB、MOBI、PDF格式。',
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto">
                <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">页面未找到</h1>
                <p className="text-gray-600 mb-8">
                    抱歉，您访问的页面不存在或已被移除。
                </p>
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        返回首页
                    </Link>
                    <p className="text-sm text-gray-500">
                        或者试试搜索您想要的书籍
                    </p>
                    <Link
                        href="/search"
                        className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        搜索书籍
                    </Link>
                </div>
            </div>
        </div>
    );
}
