#!/usr/bin/env python3
"""
批量上传3本书的封面
"""

import requests
import json
from pathlib import Path
import lark_oapi as lark
import re
import glob

PICGO_SERVER = 'http://127.0.0.1:36677'
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
SHEET_ID = '68d757'

def upload_and_update(book_title, cover_path, feishu_row):
    """上传封面并更新"""
    
    print(f"\n=== {book_title} ===")
    
    # 上传到PicGo
    print("上传到图床...")
    payload = {"list": [cover_path]}
    resp = requests.post(f"{PICGO_SERVER}/upload", json=payload, timeout=30)
    
    if resp.status_code == 200 and resp.json().get('success'):
        cdn_url = resp.json()['result'][0]
        print(f"✓ 图床URL: {cdn_url}")
    else:
        print(f"✗ 上传失败")
        return False
    
    # 更新飞书
    print("更新飞书文档...")
    client = lark.Client.builder().app_id(APP_ID).app_secret(APP_SECRET).build()
    token_resp = client.auth.v3.tenant_access_token.internal(
        lark.api.auth.v3.InternalTenantAccessTokenRequest.builder()
        .request_body(lark.api.auth.v3.InternalTenantAccessTokenRequestBody.builder()
            .app_id(APP_ID).app_secret(APP_SECRET).build())
        .build()
    )
    
    access_token = None
    if hasattr(token_resp, 'data') and token_resp.data:
        access_token = token_resp.data.tenant_access_token
    elif hasattr(token_resp, 'raw'):
        access_token = json.loads(token_resp.raw.content).get('tenant_access_token')
    
    if access_token:
        update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values"
        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        
        resp = requests.put(
            update_url,
            json={"valueRange": {"range": f"{SHEET_ID}!B{feishu_row}:B{feishu_row}", "values": [[cdn_url]]}},
            headers=headers
        )
        
        if resp.status_code == 200:
            print(f"✓ 飞书文档已更新")
    
    # 更新mockData.js
    print("更新mockData.js...")
    mockdata_path = Path("src/data/mockData.js")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    pattern = rf'(title: "{re.escape(book_title)}".*?cover: )"[^"]*"'
    content = re.sub(pattern, rf'\1"{cdn_url}"', content, flags=re.DOTALL)
    
    with open(mockdata_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"✓ mockData.js已更新")
    print(f"✅ {book_title} 完成!")
    return True

if __name__ == "__main__":
    brain_dir = "/Users/zcy/.gemini/antigravity/brain/ae600791-163c-4825-81a3-0ff0ac54ada0"
    
    # 需要修复的书籍列表
    # 格式: "书名": {"image_path": "路径", "row": 飞书行号}
    books_to_fix = {
        "新名字的故事": {
            "image_path": "/Users/zcy/.gemini/antigravity/brain/ae600791-163c-4825-81a3-0ff0ac54ada0/new_name_story_cover_1769137830172.png",
            "row": 24
        },
        "笑傲江湖（全四册）": {
            "image_path": "/Users/zcy/.gemini/antigravity/brain/ae600791-163c-4825-81a3-0ff0ac54ada0/xiaoao_jianghu_cover_1769137848494.png",
            "row": 41
        },
        "局外人": {
            "image_path": "/Users/zcy/.gemini/antigravity/brain/ae600791-163c-4825-81a3-0ff0ac54ada0/stranger_camus_cover_1769137886125.png",
            "row": 35
        }
    }
    
    for title, data in books_to_fix.items():
        image_path = data["image_path"]
        row = data["row"]
        
        if Path(image_path).exists():
            upload_and_update(title, image_path, row)
        else:
            print(f"✗ 未找到 {title} 的封面: {image_path}")
