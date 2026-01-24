#!/usr/bin/env python3
"""
将筛选出的书籍添加到 mockData.js
"""

import json
import re
from pathlib import Path

def parse_feishu_cell(cell_str):
    """解析飞书单元格中的 URL"""
    if not cell_str:
        return ""
    
    # 尝试从 JSON 字符串中提取 URL
    try:
        # cell_str 格式: "[{'link': 'url', 'text': 'url', 'type': 'url'}]"
        import ast
        data = ast.literal_eval(cell_str)
        if isinstance(data, list) and len(data) > 0:
            for item in data:
                if isinstance(item, dict) and item.get('type') == 'url':
                    return item.get('link', '')
    except:
        pass
    
    return cell_str

# 读取筛选结果
print("读取筛选结果...")
with open("filtered_books.json", "r", encoding="utf-8") as f:
    books = json.load(f)

# 读取现有的 mockData.js
print("读取现有书籍数据...")
mockdata_path = Path("src/data/mockData.js")
with open(mockdata_path, "r", encoding="utf-8") as f:
    content = f.read()

# 获取当前最大 ID
max_id = 0
for match in re.finditer(r'id:\s*(\d+)', content):
    max_id = max(max_id, int(match.group(1)))

print(f"当前最大 ID: {max_id}")

# 准备新书籍数据
new_books_code = []
next_id = max_id + 1

print(f"\n准备添加 {len(books)} 本书...\n")

for book in books:
    title = book['title']
    cover = parse_feishu_cell(book['cover'])
    quark = parse_feishu_cell(book['quark'])
    baidu = parse_feishu_cell(book['baidu'])
    
    # 提取提取码
    baidu_code = ""
    if "?pwd=" in baidu:
        baidu_code = baidu.split('?pwd=')[1].split('&')[0]
        baidu = baidu.split('?pwd=')[0]
    
    print(f"[{next_id}] {title}")
    print(f"    封面: {cover[:60]}...")
    print(f"    夸克: {quark}")
    print(f"    百度: {baidu} (提取码: {baidu_code})")
    
    # 生成书籍对象代码
    book_code = f"""  {{
    id: {next_id},
    title: "{title}",
    author: "待补充",
    authorDetail: "待补充",
    year: "2024",
    cover: "{cover}",
    description: "{title}",
    category: "文学",
    downloadLinks: ["""
    
    links = []
    if quark:
        links.append(f"""
      {{
        name: "夸克网盘",
        url: "{quark}",
        code: "无"
      }}""")
    
    if baidu:
        links.append(f"""
      {{
        name: "百度网盘",
        url: "{baidu}",
        code: "{baidu_code if baidu_code else '无'}"
      }}""")
    
    book_code += ",".join(links)
    book_code += """
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  }"""
    
    new_books_code.append(book_code)
    next_id += 1

# 查找 books 数组的结尾并插入新书
# 查找最后一个 '}' 在 books 数组中
books_pattern = r'(export const books = \[.*?\n)(\];)'
match = re.search(books_pattern, content, re.DOTALL)

if match:
    books_content = match.group(1)
    # 在最后一个书籍对象后面添加
    new_content = books_content.rstrip() + ",\n" + ",\n".join(new_books_code) + "\n" + match.group(2)
    
    # 替换原内容
    updated_content = content[:match.start()] + new_content + content[match.end():]
    
    # 写回文件
    with open(mockdata_path, "w", encoding="utf-8") as f:
        f.write(updated_content)
    
    print(f"\n✅ 成功添加 {len(books)} 本书到 mockData.js")
else:
    print("\n❌ 未找到 books 数组,请检查文件格式")
