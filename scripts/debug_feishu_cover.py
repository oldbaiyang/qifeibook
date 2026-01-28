#!/usr/bin/env python3
"""
Debug 飞书封面列数据
"""

import requests
import lark_oapi as lark
import json

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
SHEET_ID = '68d757' # 从之前的输出中获取

# Initialize Client
client = lark.Client.builder() \
    .app_id(APP_ID) \
    .app_secret(APP_SECRET) \
    .build()

def debug_cover():
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
    
    # 读取 row 92 (索引是从1开始还是0？API通常是1-based，之前的脚本是从行号读取)
    # 之前的脚本显示 row 92 是流俗地。
    # 我们读取第 92 行的数据，范围 A92:E92
    
    print("正在读取数据...")
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values/{SHEET_ID}!A92:E92"
    read_resp = requests.get(read_url, headers=headers)
    
    if read_resp.status_code != 200:
        print(read_resp.text)
        return
        
    data = read_resp.json()
    print(json.dumps(data, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    debug_cover()
