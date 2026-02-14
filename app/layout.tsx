import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "棋飞书库 - 经典电子书免费下载 | EPUB/MOBI/PDF格式",
  description: "棋飞书库提供海量经典电子书免费下载，支持EPUB、MOBI、PDF等多种格式。收录《活着》、《三体》、《百年孤独》等畅销好书，网盘高速下载，无广告纯净阅读体验。",
  keywords: "电子书下载,免费电子书,Kindle电子书,EPUB下载,MOBI下载,PDF电子书,经典文学,畅销书,棋飞书库",
  authors: [{ name: "棋飞书库" }],
  verification: {
    other: {
      "baidu-site-verification": "codeva-wgQ1i6Efrq"
    }
  },
  openGraph: {
    title: "棋飞书库 - 经典电子书免费下载",
    description: "海量经典电子书免费下载，支持EPUB、MOBI、PDF格式",
    url: "https://qifeibook.com",
    siteName: "棋飞书库",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary",
    title: "棋飞书库 - 经典电子书免费下载",
    description: "海量经典电子书免费下载，支持EPUB、MOBI、PDF格式",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Header />
        <main className="min-h-[calc(100vh-300px)]">
          {children}
        </main>
        <Footer />

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3P6YQRFTHE" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3P6YQRFTHE');
          `}
        </Script>
      </body>
    </html>
  );
}
