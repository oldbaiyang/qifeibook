#!/usr/bin/env python3
"""
发布单本书籍到 mockData.js
用法: python3 scripts/publish_single_book.py <json_file_path>

输入 JSON 格式示例:
{
  "title": "书名",
  "author": "作者",
  "authorDetail": "作者详情",
  "year": "出版年份",
  "cover": "封面URL",
  "description": "书籍描述",
  "category": "分类",
  "quark_url": "夸克网盘链接",
  "baidu_url": "百度网盘链接",
  "baidu_code": "百度提取码"
}
"""

import json
import re
import sys
import os
from pathlib import Path

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/publish_single_book.py <json_file_path>")
        sys.exit(1)

    json_path = sys.argv[1]
    if not os.path.exists(json_path):
        print(f"Error: File {json_path} not found.")
        sys.exit(1)

    print(f"读取书籍数据: {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        book_data = json.load(f)

    # 验证必填字段
    if "title" not in book_data or not book_data["title"]:
        print("Error: Missing required field 'title'")
        sys.exit(1)

    mockdata_path = Path("src/data/mockData.js")
    print(f"读取现有数据: {mockdata_path}")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 获取当前最大 ID
    max_id = 0
    for match in re.finditer(r'id:\s*(\d+)', content):
        current_id = int(match.group(1))
        if current_id > max_id:
            max_id = current_id

    next_id = max_id + 1
    print(f"当前最大ID: {max_id}, 新书ID: {next_id}")

    # 构造数据
    title = book_data.get("title", "")
    author = book_data.get("author", "未知")
    authorDetail = book_data.get("authorDetail", "待补充")
    year = book_data.get("year", "2024")
    cover = book_data.get("cover", "")
    
    # 处理描述：转义引号和换行
    description = book_data.get("description", "").replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    if not description:
        description = title

    category = book_data.get("category", "小说文学")
    
    quark_url = book_data.get("quark_url", "")
    baidu_url = book_data.get("baidu_url", "")
    baidu_code = book_data.get("baidu_code", "")

    # 构造 downloadLinks
    links_parts = []
    if quark_url:
        links_parts.append(f"""
      {{
        name: "夸克网盘",
        url: "{quark_url}"
      }}""")
    
    if baidu_url:
        code_str = f', code: "{baidu_code}"' if baidu_code else ', code: "0000"'
        links_parts.append(f"""
      {{
        name: "百度网盘",
        url: "{baidu_url}"{code_str}
      }}""")
    
    links_str = ",".join(links_parts)

    # 构造新书对象字符串
    new_book_entry = f"""  {{
    id: {next_id},
    title: "{title}",
    author: "{author}",
    authorDetail: "{authorDetail}",
    year: "{year}",
    cover: "{cover}",
    description: "{description}",
    category: "{category}",
    downloadLinks: [{links_str}
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "{year}"
  }}"""

    # 定位 books 数组并插入
    # 1. 找到 books 定义开始
    start_pattern = r'export const books = \['
    start_match = re.search(start_pattern, content)
    if not start_match:
        print("Error: Could not find 'export const books = [' in mockData.js")
        sys.exit(1)
        
    start_index = start_match.end()
    
    # 2. 确定搜索范围：从 books 开始到下一个 export const 或文件末尾
    next_export_match = re.search(r'\nexport const', content[start_index:])
    if next_export_match:
        # books 结束应该在下一个 export 之前
        search_limit = start_index + next_export_match.start()
        search_area = content[start_index : search_limit]
    else:
        search_limit = len(content)
        search_area = content[start_index:]
        
    # 3. 在范围内找到最后一个 ];
    end_bracket_relative_index = search_area.rfind('];')
    
    if end_bracket_relative_index == -1:
        print("Error: Could not find closing '];' for books array")
        sys.exit(1)
        
    insert_pos = start_index + end_bracket_relative_index
    
    # 检查插入点前是否有逗号
    # 我们往回看非空白字符
    pre_insert_content = content[:insert_pos]
    if not pre_insert_content.rstrip().endswith(','):
        # 如果上一个元素没有逗号结尾（虽然不常见），加上逗号
        # 但要注意这里可能是空数组的情况（即 insert_pos 紧接着 start_index）
        # 如果 search_area 只有空白，说明是空数组
        if not search_area[:end_bracket_relative_index].strip():
            # 空数组，直接插入，不需要前置逗号
            prefix = ""
        else:
            # 检查最后一个非空字符
            stripped_pre = pre_insert_content.rstrip()
            if not stripped_pre.endswith(',') and not stripped_pre.endswith('['):
                 # 需要补逗号
                 # 为了保持格式，我们找到最后一个非空字符的位置并插入逗号
                 # 这里简化处理：直接在 new_book_entry 前面加逗号，如果前一个也没逗号的话
                 # 更安全的做法是：在插入前，把前面的内容修正
                 pass
                 # 简单起见，假设现有数据格式良好（每项后面都有逗号）
                 # 或者我们总是假设需要加逗号如果不是紧跟 [
    
    # 观察现有的 mockData.js，每一项后面都有逗号，包括最后一项
    # 所以我们直接插入即可。
    # 为了保险，我们可以在 new_book_entry 前加个逗号（如果不是第一个元素），
    # 或者假设前一个元素已经有逗号了。
    # 根据之前的 read 输出，最后一项 id: 84 后面有 }, (有逗号)
    # 所以直接插入是安全的。
    
    new_content = content[:insert_pos] + "\n" + new_book_entry + ",\n" + content[insert_pos:]
    
    with open(mockdata_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"✅ 成功发布书籍: {title} (ID: {next_id})")

if __name__ == "__main__":
    main()
