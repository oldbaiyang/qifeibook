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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "棋飞书库 - 经典电子书免费下载",
    description: "海量经典电子书免费下载，支持EPUB、MOBI、PDF格式",
    url: "https://qifeibook.com",
    siteName: "棋飞书库",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "https://qifeibook.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "棋飞书库 - 经典电子书免费下载",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "棋飞书库 - 经典电子书免费下载",
    description: "海量经典电子书免费下载，支持EPUB、MOBI、PDF格式",
  },
  alternates: {
    canonical: "https://qifeibook.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Bing Webmaster Tools */}
        <meta name="msvalidate.01" content="D89EDBE447BD6F73923A6CCE80DC9943" />

        {/* Sogou Site Verification */}
        <meta name="sogou_site_verification" content="HnQSusxk4n" />

        {/* Google AdSense */}
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6967766161116772" crossOrigin="anonymous" />

        {/* Structured Data for SEO */}
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "棋飞书库",
            "url": "https://qifeibook.com",
            "description": "免费电子书下载网站，提供小说、文学、历史、科幻等各类电子书资源",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://qifeibook.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>
      </head>
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
