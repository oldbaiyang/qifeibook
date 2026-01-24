#!/usr/bin/env python3
"""
使用生成的封面图上传并更新
"""

import requests
import json
from pathlib import Path
import lark_oapi as lark
import re

# PicGo Server
PICGO_SERVER = 'http://127.0.0.1:36677'

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
SHEET_ID = '68d757'

# 生成的封面图路径
generated_cover = "/Users/zcy/.gemini/antigravity/brain/ae600791-163c-4825-81a3-0ff0ac54ada0/huozhe_cover_1769100595309.png"

print(f"使用生成的封面图: {generated_cover}")

# 上传到PicGo
print("\n上传到图床...")
payload = {"list": [generated_cover]}
picgo_resp = requests.post(f"{PICGO_SERVER}/upload", json=payload, timeout=30)

cdn_url = None
if picgo_resp.status_code == 200:
    result = picgo_resp.json()
    if result.get('success') and result.get('result'):
        cdn_url = result['result'][0]
        print(f"✓ 图床URL: {cdn_url}")
    else:
        print(f"✗ PicGo返回: {result}")
        exit(1)
else:
    print(f"✗ 上传失败")
    exit(1)

# 更新飞书文档
print("\n更新飞书文档...")
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
    resp_json = json.loads(token_resp.raw.content)
    access_token = resp_json.get('tenant_access_token')

if access_token:
    range_notation = f"{SHEET_ID}!B6:B6"
    update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    feishu_resp = requests.put(
        update_url,
        json={"valueRange": {"range": range_notation, "values": [[cdn_url]]}},
        headers=headers
    )
    
    if feishu_resp.status_code == 200:
        print(f"✓ 飞书文档已更新")
    else:
        print(f"✗ 更新失败: {feishu_resp.json()}")

# 更新mockData.js
print("\n更新mockData.js...")
mockdata_path = Path("src/data/mockData.js")
with open(mockdata_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'(title: "活着".*?cover: )"[^"]*"'
content = re.sub(pattern, rf'\1"{cdn_url}"', content, flags=re.DOTALL)

with open(mockdata_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"✓ mockData.js已更新")

print(f"\n✅ 完成! 新封面: {cdn_url}")
