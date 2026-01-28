#!/usr/bin/env python3
"""
修复 mockData.js 中封面 URL 不完整的问题
读取 enriched_books.json 中的 row 信息，重新从飞书获取封面，并更新 mockData.js
"""

import requests
import lark_oapi as lark
import json
import re
from pathlib import Path

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
SHEET_ID = '68d757'

# Initialize Client
client = lark.Client.builder() \
    .app_id(APP_ID) \
    .app_secret(APP_SECRET) \
    .build()

def extract_value(cell, prefer_link=False):
    if not cell:
        return ""
        
    # 处理列表形式的单元格数据
    if isinstance(cell, list):
        # 如果偏好链接，优先查找 type='url' 的 link 属性
        if prefer_link:
            for seg in cell:
                if isinstance(seg, dict) and seg.get('type') == 'url' and seg.get('link'):
                    return seg.get('link')
        
        # 否则拼接所有 text
        texts = []
        for seg in cell:
            if isinstance(seg, dict):
                texts.append(str(seg.get('text', '')))
        return "".join(texts)

    # 处理字典形式
    if isinstance(cell, dict):
        if prefer_link and cell.get('type') == 'url' and cell.get('link'):
            return cell.get('link')
        return cell.get('text', '')

    return str(cell)

def fix_covers():
    print("读取 enriched_books.json...")
    input_file = "enriched_books.json"
    if not Path(input_file).exists():
        print(f"Error: {input_file} 不存在")
        return

    with open(input_file, "r", encoding="utf-8") as f:
        books = json.load(f)
    
    if not books:
        print("没有书籍数据")
        return

    rows = [b['row'] for b in books]
    min_row = min(rows)
    max_row = max(rows)
    print(f"需要修复 {len(books)} 本书, 行号范围: {min_row} - {max_row}")

    # 获取 access token
    token_resp = client.auth.v3.tenant_access_token.internal(
        lark.api.auth.v3.InternalTenantAccessTokenRequest.builder()
        .request_body(lark.api.auth.v3.InternalTenantAccessTokenRequestBody.builder()
            .app_id(APP_ID)
            .app_secret(APP_SECRET)
            .build())
        .build()
    )
    
    access_token = None
    if hasattr(token_resp, 'data') and token_resp.data:
        access_token = token_resp.data.tenant_access_token
    elif hasattr(token_resp, 'raw'):
        resp_json = json.loads(token_resp.raw.content)
        access_token = resp_json.get('tenant_access_token')

    if not access_token:
        raise Exception("获取 Access Token 失败")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 批量读取
    range_notation = f"{SHEET_ID}!A{min_row}:B{max_row}" # 只需要 A(标题) 和 B(封面)
    print(f"从飞书读取数据: {range_notation} ...")
    
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values/{range_notation}"
    read_resp = requests.get(read_url, headers=headers)
    
    if read_resp.status_code != 200:
        print(f"读取失败: {read_resp.text}")
        return
        
    values = read_resp.json()['data']['valueRange']['values']
    
    # 构建 row -> correct_cover 映射
    # values 的索引 0 对应 min_row
    row_cover_map = {}
    for i, row_data in enumerate(values):
        current_row = min_row + i
        if len(row_data) > 1:
            # 封面在第二列 (索引 1)
            raw_cover = row_data[1]
            correct_cover = extract_value(raw_cover, prefer_link=False)
            row_cover_map[current_row] = correct_cover
            
    # 读取 mockData.js
    mockdata_path = Path("src/data/mockData.js")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    updated_count = 0
    
    for book in books:
        row = book['row']
        title = book['title']
        old_cover = book['cover']
        
        if row in row_cover_map:
            new_cover = row_cover_map[row]
            
            # 只有当新封面与旧封面不同（且更有意义）时才更新
            # 注意：old_cover 可能已经是之前的 "错误" 版本
            # 我们检查 new_cover 是否比 old_cover 长，或者包含中文
            
            if new_cover != old_cover:
                print(f"修复: {title}")
                print(f"  旧: {old_cover}")
                print(f"  新: {new_cover}")
                
                # 在 mockData.js 中替换
                # 使用书名定位，防止误替换
                # 查找 pattern: title: "书名" ... cover: "旧URL"
                # 由于 JSON 中顺序可能不固定，但 mockData 生成时是固定的。
                # 我们的生成顺序是 title, author, ..., cover
                
                # 更稳健的替换：只匹配 title 后面的 cover
                # 假设每本书的 block 都在一起
                
                # 构造正则：找到包含该 title 的 block，然后替换里面的 cover
                # 这里的 escape title 很重要
                book_block_pattern = re.compile(
                    rf'(title:\s*"{re.escape(title)}".*?cover:\s*")([^"]*)(")', 
                    re.DOTALL
                )
                
                match = book_block_pattern.search(content)
                if match:
                    current_cover_in_file = match.group(2)
                    # 只有当文件里的 cover 确实也是 "错误" 的时候才替换？
                    # 或者直接强制替换
                    new_content = book_block_pattern.sub(rf'\1{new_cover}\3', content, count=1)
                    if new_content != content:
                        content = new_content
                        updated_count += 1
                else:
                    print(f"  ⚠ 在 mockData.js 中未找到书籍块: {title}")
            else:
                print(f"跳过: {title} (封面未变)")
        else:
            print(f"⚠ 在飞书返回数据中未找到行 {row}")

    if updated_count > 0:
        with open(mockdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"\n✅ 成功修复 {updated_count} 本书的封面链接")
    else:
        print("\n没有需要更新的内容")

if __name__ == "__main__":
    fix_covers()
