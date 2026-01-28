#!/usr/bin/env python3
"""
生成 sitemap.xml
"""

import re
import datetime
from pathlib import Path

# 站点域名 - 请修改为实际域名
SITE_DOMAIN = "https://qifeibook.com"

def generate_sitemap():
    # 读取 mockData.js
    mockdata_path = Path("src/data/mockData.js")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 提取数组内容
    # 假设 books = [...] 格式
    # 我们只提取 id
    # pattern: id: (\d+)
    ids = re.findall(r'id: (\d+)', content)
    
    print(f"找到 {len(ids)} 本书")

    # XML 头部
    xml_content = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    # 首页
    current_date = datetime.date.today().isoformat()
    xml_content.append(f"""
    <url>
        <loc>{SITE_DOMAIN}/</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    """)

    # 书籍详情页
    for book_id in ids:
        xml_content.append(f"""
    <url>
        <loc>{SITE_DOMAIN}/book/{book_id}</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
        """)

    # XML 尾部
    xml_content.append('</urlset>')

    # 写入 public/sitemap.xml
    output_path = Path("public/sitemap.xml")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml_content))
    
    print(f"✅ Sitemap 已生成: {output_path} ({len(ids) + 1} URLs)")

if __name__ == "__main__":
    generate_sitemap()
