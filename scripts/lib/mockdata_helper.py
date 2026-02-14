#!/usr/bin/env python3
"""
mockData.ts 操作模块 - 提供读取、写入和验证 mockData.ts 的功能

使用方法：
    from lib.mockdata_helper import MockDataHelper

    helper = MockDataHelper()

    # 读取现有书籍 ID
    ids = helper.read_book_ids()

    # 读取现有书籍标题
    titles = helper.read_book_titles()

    # 添加新书籍
    helper.add_books(new_books)

    # 更新书籍封面
    helper.update_covers(cover_updates)
"""

import re
from pathlib import Path
from typing import Set, List, Dict, Optional, Any
import json


class MockDataHelper:
    """mockData.ts 操作助手"""

    def __init__(self, file_path: str = "data/mockData.ts"):
        """
        初始化 MockData 助手

        Args:
            file_path: mockData.ts 文件路径
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
            backup_path = self.file_path.with_suffix('.ts.backup')
            with open(self.file_path, 'r', encoding='utf-8') as f:
                backup_content = f.read()
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(backup_content)

            # 写入新内容
            with open(self.file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ 文件已更新，备份保存在: {backup_path}")
            return True
        except Exception as e:
            print(f"写入文件失败: {e}")
            return False

    def read_book_ids(self) -> Set[int]:
        """
        读取现有的书籍 ID

        Returns:
            书籍 ID 集合
        """
        content = self._read_file()
        if not content:
            return set()

        # 匹配 "id": 123 格式（带引号）
        matches = re.findall(r'"id":\s*(\d+)', content)
        return set(int(m) for m in matches)

    def read_book_titles(self) -> Set[str]:
        """
        读取现有的书籍标题

        Returns:
            书籍标题集合
        """
        content = self._read_file()
        if not content:
            return set()

        # 匹配 "title": "书名" 格式
        matches = re.findall(r'"title":\s*"([^"]+)"', content)
        return set(matches)

    def get_next_id(self) -> int:
        """
        获取下一个可用的书籍 ID

        Returns:
            下一个 ID（如果没有现有书籍，返回 1）
        """
        ids = self.read_book_ids()
        if ids:
            return max(ids) + 1
        return 1

    def format_book_entry(self, book: Dict[str, Any], indent: int = 2) -> str:
        """
        格式化书籍条目为 TypeScript

        Args:
            book: 书籍数据字典
            indent: 缩进空格数

        Returns:
            格式化后的字符串
        """
        json_str = json.dumps(book, ensure_ascii=False, indent=indent)
        # 添加缩进
        prefix = "  " * indent
        lines = [prefix + line for line in json_str.split('\n')]
        # 最后一行不加逗号（由调用者决定）
        return '\n'.join(lines)

    def add_books(self, books: List[Dict[str, Any]]) -> bool:
        """
        添加新书籍到 mockData.ts

        Args:
            books: 书籍数据列表

        Returns:
            是否添加成功
        """
        if not books:
            print("没有需要添加的书籍")
            return False

        content = self._read_file()
        if not content:
            return False

        # 找到 books 数组的结束 ]; 位置
        pattern = re.search(r'\];\s*\nexport const', content)
        if pattern:
            bracket_pos = pattern.start() - 1
        else:
            bracket_pos = content.rfind(']')

        if bracket_pos == -1:
            print("无法找到 mockData.ts 的结束位置!")
            return False

        # 检查前一个字符是否是 }，如果是则需要添加逗号
        prefix = content[:bracket_pos]
        if prefix.rstrip().endswith('}'):
            prefix = prefix.rstrip() + ',\n'

        # 格式化新书籍条目
        formatted_entries = []
        for i, book in enumerate(books):
            entry_str = self.format_book_entry(book)
            # 除最后一个外，都添加逗号
            if i < len(books) - 1:
                entry_str += ','
            formatted_entries.append(entry_str)

        # 插入新内容
        new_content = prefix + '\n'.join(formatted_entries) + '\n' + content[bracket_pos:]

        return self._write_file(new_content)

    def update_book_field(self, book_id: int, field: str, value: Any) -> bool:
        """
        更新指定书籍的字段

        Args:
            book_id: 书籍 ID
            field: 字段名（如 'cover'）
            value: 新值

        Returns:
            是否更新成功
        """
        content = self._read_file()
        if not content:
            return False

        # 构建匹配模式：找到指定 ID 的书籍行
        pattern = rf'("id":\s*{re.escape(str(book_id))}[\s\S]*?"{re.escape(field)}": ")[^"]*(")'
        replacement = rf'\1{value}\2'

        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        if new_content == content:
            print(f"未找到 ID 为 {book_id} 的书籍")
            return False

        return self._write_file(new_content)

    def update_fields(self, updates: Dict[str, Dict[str, Any]]) -> int:
        """
        批量更新书籍字段

        Args:
            updates: 字典，键为书名，值为 {字段: 新值}

        Returns:
            成功更新的书籍数量
        """
        content = self._read_file()
        if not content:
            return 0

        success_count = 0
        for title, field_updates in updates.items():
            for field, value in field_updates.items():
                pattern = rf'("title": "{re.escape(title)}"[\s\S]*?"{re.escape(field)}": ")[^"]*(")'
                replacement = rf'\1{value}\2'
                new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
                if new_content != content:
                    content = new_content
                    success_count += 1
                    print(f"✓ 更新: {title} -> {field}")

        if success_count > 0:
            self._write_file(content)

        return success_count

    def validate(self) -> bool:
        """
        验证 mockData.ts 文件格式是否正确

        Returns:
            文件格式是否有效
        """
        content = self._read_file()
        if not content:
            return False

        # 检查基本的语法
        if 'export const books' not in content:
            print("错误: 未找到 'export const books'")
            return False

        if 'export const categories' not in content:
            print("错误: 未找到 'export const categories'")
            return False

        # 检查括号匹配
        if content.count('[') != content.count(']'):
            print("错误: 方括号不匹配")
            return False

        if content.count('{') != content.count('}'):
            print("错误: 大括号不匹配")
            return False

        return True
