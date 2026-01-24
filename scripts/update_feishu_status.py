#!/usr/bin/env python3
"""
更新飞书文档中已导入书籍的状态为1
"""

import requests
import lark_oapi as lark
import json

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

def update_statuses():
    """更新已导入书籍的状态为1"""
    
    # 读取已导入的书籍
    print("读取已导入书籍列表...")
    with open("filtered_books.json", "r", encoding="utf-8") as f:
        books = json.load(f)
    
    print(f"共需更新 {len(books)} 本书的状态\n")
    
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
    
    # 批量更新状态
    success_count = 0
    
    for book in books:
        row = book['row']
        title = book['title']
        
        # 更新第E列(状态列,索引4)为"1"
        # 飞书 API 使用 A1 表示法,E列第row行为 E{row}
        range_notation = f"{SHEET_ID}!E{row}:E{row}"
        
        update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values"
        
        payload = {
            "valueRange": {
                "range": range_notation,
                "values": [["1"]]
            }
        }
        
        try:
            resp = requests.put(update_url, json=payload, headers=headers)
            
            if resp.status_code == 200 and resp.json().get('code') == 0:
                print(f"✓ [{row}] {title:30} → 状态已更新为1")
                success_count += 1
            else:
                print(f"✗ [{row}] {title:30} → 更新失败: {resp.json()}")
        except Exception as e:
            print(f"✗ [{row}] {title:30} → 异常: {e}")
    
    print(f"\n完成! 成功更新 {success_count}/{len(books)} 本书的状态")

if __name__ == "__main__":
    try:
        update_statuses()
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()
