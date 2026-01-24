#!/usr/bin/env python3
"""
修复封面URL和分类标签
"""

import json
import re
from pathlib import Path

# 读取原始飞书数据
with open("filtered_books.json", "r", encoding="utf-8") as f:
    books = json.load(f)

# 从飞书数据中提取完整的封面URL
cover_map = {}
for book in books:
    title = book['title']
    cover_str = book['cover']
    
    # 解析飞书返回的封面数据
    # 格式: "[{'link': 'url_part1', ...}, {'text': 'title_part', ...}]"
    try:
        import ast
        data = ast.literal_eval(cover_str)
        
        # 组合完整URL: link + text
        url_part = ""
        text_part = ""
        
        for item in data:
            if isinstance(item, dict):
                if item.get('type') == 'url' and 'link' in item:
                    url_part = item['link']
                elif item.get('type') == 'text' and 'text' in item:
                    text_part = item['text']
        
        # 完整URL = url_part + text_part (如果url_part以_结尾)
        if url_part.endswith('_'):
            full_url = url_part + text_part
        else:
            full_url = url_part
        
        cover_map[title] = full_url
        print(f"{title:20} → {full_url}")
    except:
        print(f"✗ 解析失败: {title}")

print(f"\n共解析 {len(cover_map)} 个封面URL\n")

# 读取 mockData.js
mockdata_path = Path("src/data/mockData.js")
with open(mockdata_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. 修复封面URL
for title, full_url in cover_map.items():
    # 查找当前的不完整URL
    current_pattern = rf'(title: "{re.escape(title)}".*?cover: "https://img\.aqifei\.top/img/2026/01/\d+_)"'
    
    content = re.sub(
        current_pattern,
        rf'\1{re.escape(title)}"',
        content,
        flags=re.DOTALL
    )

print("✓ 封面URL已修复\n")

# 2. 将"文学"改为"小说文学"
content = content.replace('category: "文学"', 'category: "小说文学"')
print("✓ 分类标签已更新为'小说文学'\n")

# 写回文件
with open(mockdata_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ 完成!")
