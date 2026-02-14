#!/usr/bin/env python3
"""
sitemap.xml 操作模块 - 提供更新 sitemap 的功能

使用方法：
    from lib.sitemap_helper import SitemapHelper

    helper = SitemapHelper()

    # 添加新 URL
    helper.add_urls([
        ('https://example.com/page1', '2024-01-01'),
        ('https://example.com/page2', '2024-01-02')
    ])
"""

from pathlib import Path
from datetime import datetime
from typing import List, Tuple, Optional
import re


class SitemapHelper:
    """sitemap.xml 操作助手"""

    def __init__(self, file_path: str = "public/sitemap.xml"):
        """
        初始化 sitemap 助手

        Args:
            file_path: sitemap.xml 文件路径
        """
        self.file_path = Path(file_path)

    def _read_file(self) -> Optional[str]:
        """读取文件内容"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"文件不存在: {self.file_path}")
            return None
        except Exception as e:
            print(f"读取文件失败: {e}")
            return None

    def _write_file(self, content: str) -> bool:
        """写入文件内容"""
        try:
            # 备份原文件
            backup_path = self.file_path.with_suffix('.xml.backup')
            with open(self.file_path, 'r', encoding='utf-8') as f:
                backup_content = f.read()
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(backup_content)

            # 写入新内容
            with open(self.file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ sitemap 已更新，备份保存在: {backup_path}")
            return True
        except Exception as e:
            print(f"写入文件失败: {e}")
            return False

    def add_urls(self, urls: List[Tuple[str, str]], priority: float = 0.8) -> int:
        """
        添加新 URL 到 sitemap

        Args:
            urls: URL 列表，每个元素为 (url, lastmod) 元组
            priority: URL 优先级（默认 0.8）

        Returns:
            成功添加的 URL 数量
        """
        if not urls:
            print("没有需要添加的 URL")
            return 0

        content = self._read_file()
        if not content:
            return 0

        # 找到 </urlset> 标签
        closing_tag = '</urlset>'
        if closing_tag not in content:
            print("错误: sitemap.xml 格式不正确，未找到 </urlset> 标签")
            return 0

        # 生成 sitemap 条目
        today = datetime.now().strftime('%Y-%m-%d')
        sitemap_entries = []
        for url in urls:
            url_str, lastmod = url
            sitemap_entries.append(f"""  <url>
    <loc>{url_str}</loc>
    <lastmod>{lastmod or today}</lastmod>
    <priority>{priority}</priority>
  </url>""")

        # 插入新内容
        new_content = content.replace(closing_tag, '\n'.join(sitemap_entries) + '\n' + closing_tag)

        if self._write_file(new_content):
            return len(urls)
        return 0

    def add_book_urls(self, book_ids: List[int], priority: float = 0.8) -> int:
        """
        添加书籍 URL 到 sitemap

        Args:
            book_ids: 书籍 ID 列表
            priority: URL 优先级（默认 0.8）

        Returns:
            成功添加的 URL 数量
        """
        base_url = "https://www.qifeibook.com/book"
        today = datetime.now().strftime('%Y-%m-%d')
        urls = [(f"{base_url}/{book_id}", today) for book_id in book_ids]
        return self.add_urls(urls, priority)

    def remove_urls(self, url_pattern: str) -> int:
        """
        移除匹配模式的 URL

        Args:
            url_pattern: 要移除的 URL 模式（正则表达式）

        Returns:
            移除的 URL 数量
        """
        content = self._read_file()
        if not content:
            return 0

        # 移除匹配的 URL 条目
        pattern = rf'  <url>[\s\S]*?{re.escape(url_pattern)}[\s\S]*?</url>'
        matches = re.findall(pattern, content, re.DOTALL)
        new_content = re.sub(pattern, '', content, flags=re.DOTALL)

        if new_content != content:
            self._write_file(new_content)
            return len(matches)
        return 0

    def get_url_count(self) -> int:
        """
        获取 sitemap 中的 URL 数量

        Returns:
            URL 数量
        """
        content = self._read_file()
        if not content:
            return 0

        matches = re.findall(r'<loc>([^<]+)</loc>', content)
        return len(matches)

    def validate(self) -> bool:
        """
        验证 sitemap.xml 格式是否正确

        Returns:
            sitemap 格式是否有效
        """
        content = self._read_file()
        if not content:
            return False

        # 检查基本的 XML 标签
        required_tags = ['<?xml', '<urlset', '</urlset>', '<url>', '<loc>', '</url>']
        for tag in required_tags:
            if tag not in content:
                print(f"错误: sitemap.xml 缺少标签: {tag}")
                return False

        return True
