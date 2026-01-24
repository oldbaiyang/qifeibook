#!/usr/bin/env python3
"""
从飞书文档读取书籍数据并筛选
筛选条件:夸克网盘或百度网盘列不为空 且 状态列不为1
"""

import requests
import lark_oapi as lark
import json

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# Initialize Client
client = lark.Client.builder() \
    .app_id(APP_ID) \
    .app_secret(APP_SECRET) \
    .build()

def read_feishu_books():
    """读取飞书文档中的书籍数据"""
    
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
        import json
        resp_json = json.loads(token_resp.raw.content)
        access_token = resp_json.get('tenant_access_token')

    if not access_token:
        raise Exception("获取 Access Token 失败")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 查询 Sheet 信息
    print("正在查询文档...")
    sheet_query_url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{WIKI_TOKEN}/sheets/query"
    resp = requests.get(sheet_query_url, headers=headers)
    
    if resp.status_code != 200 or resp.json().get('code') != 0:
        raise Exception(f"查询 Sheet 失败: {resp.text}")
    
    sheet_id = resp.json()['data']['sheets'][0]['sheet_id']
    print(f"Sheet ID: {sheet_id}")
    
    # 读取所有数据 (假设列: A=书名 B=封面 C=夸克网盘 D=百度网盘 E=状态)
    # 实际列可能不同,需要先读取表头确认
    print("\n正在读取数据...")
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values/{sheet_id}!A:Z"
    read_resp = requests.get(read_url, headers=headers)
    
    if read_resp.status_code != 200 or read_resp.json().get('code') != 0:
        raise Exception(f"读取数据失败: {read_resp.text}")
    
    values = read_resp.json()['data']['valueRange']['values']
    
    if not values:
        print("文档为空")
        return []
    
    # 打印表头以供用户确认列位置
    print(f"\n表头(前10列): {values[0][:10]}")
    print(f"总行数: {len(values)}\n")
    
    # 假设列结构(需要根据实际调整):
    # A=书名, B=封面, C=夸克网盘, D=百度网盘, E=状态
    # 筛选条件: (C不为空 或 D不为空) 且 E!=1
    
    filtered_books = []
    
    for i, row in enumerate(values[1:], start=2):  # 跳过表头
        if len(row) < 5:  # 至少需要5列
            continue
        
        title = row[0] if len(row) > 0 else ""
        cover = row[1] if len(row) > 1 else ""
        quark = row[2] if len(row) > 2 else ""
        baidu = row[3] if len(row) > 3 else ""
        status = row[4] if len(row) > 4 else ""
        
        # 提取文本(如果是对象)
        def extract_text(cell):
            if isinstance(cell, dict):
                return cell.get('text', '')
            return str(cell) if cell else ""
        
        title = extract_text(title)
        cover = extract_text(cover)
        quark = extract_text(quark)
        baidu = extract_text(baidu)
        status = extract_text(status)
        
        # 筛选条件
        has_pan = bool(quark.strip() or baidu.strip())
        status_ok = status.strip() != "1"
        
        if has_pan and status_ok:
            filtered_books.append({
                "row": i,
                "title": title,
                "cover": cover,
                "quark": quark,
                "baidu": baidu,
                "status": status
            })
            print(f"✓ [{i}] {title[:30]:30} 夸克:{bool(quark):5} 百度:{bool(baidu):5} 状态:{status}")
    
    print(f"\n共筛选出 {len(filtered_books)} 本书")
    
    # 保存到 JSON 文件
    with open("filtered_books.json", "w", encoding="utf-8") as f:
        json.dump(filtered_books, f, ensure_ascii=False, indent=2)
    
    print(f"已保存到 filtered_books.json")
    
    return filtered_books

if __name__ == "__main__":
    try:
        books = read_feishu_books()
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()
