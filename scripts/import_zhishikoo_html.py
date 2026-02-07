#!/usr/bin/env python3
"""
Parse temp/zhishikoo_source.html and upload books to Feishu
"""

import os
import json
import requests
import lark_oapi as lark
from bs4 import BeautifulSoup
from pathlib import Path

# Feishu Config
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
SHEET_ID = '68d757'

# PicGo Config
PICGO_SERVER = 'http://127.0.0.1:36677/upload'

# Headers for downloading images
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.zhishikoo.com/'
}

def get_feishu_token():
    client = lark.Client.builder().app_id(APP_ID).app_secret(APP_SECRET).build()
    resp = client.auth.v3.tenant_access_token.internal(
        lark.api.auth.v3.InternalTenantAccessTokenRequest.builder()
        .request_body(lark.api.auth.v3.InternalTenantAccessTokenRequestBody.builder()
            .app_id(APP_ID).app_secret(APP_SECRET).build())
        .build()
    )
    
    if hasattr(resp, 'data') and resp.data:
        return resp.data.tenant_access_token
    elif hasattr(resp, 'raw'):
        data = json.loads(resp.raw.content)
        return data.get('tenant_access_token')
    return None

def download_and_upload_cover(url, title):
    try:
        # 1. Download
        print(f"  Downloading cover: {url}")
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            print(f"  Failed to download: {resp.status_code}")
            return url # Fallback to original
            
        # Save to temp
        ext = url.split('.')[-1]
        if '?' in ext: ext = ext.split('?')[0]
        if len(ext) > 4: ext = 'jpg'
        
        filename = f"temp/{title}_cover.{ext}"
        with open(filename, 'wb') as f:
            f.write(resp.content)
            
        # 2. Upload to PicGo
        print(f"  Uploading to PicGo...")
        abs_path = os.path.abspath(filename)
        picgo_resp = requests.post(PICGO_SERVER, json={"list": [abs_path]})
        
        if picgo_resp.status_code == 200:
            res = picgo_resp.json()
            if res.get('success'):
                picgo_url = res['result'][0]
                print(f"  ✓ PicGo URL: {picgo_url}")
                # Clean up
                os.remove(filename)
                return picgo_url
            else:
                print(f"  PicGo error: {res}")
        else:
            print(f"  PicGo HTTP error: {picgo_resp.status_code}")
            
    except Exception as e:
        print(f"  Error processing cover: {e}")
        
    return url # Fallback

def main():
    html_path = "temp/zhishikoo_source.html"
    if not os.path.exists(html_path):
        print("HTML file not found")
        return

    print("Parsing HTML...")
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    books = []
    # Selector based on provided HTML: .post.grid
    items = soup.select('.post.grid')
    
    for item in items:
        # Title: h3 > a (text or title attr)
        h3 = item.select_one('h3 > a')
        if not h3: continue
        
        # Clean title: "书名(epub+azw3+mobi)" -> "书名"
        raw_title = h3.get_text().strip()
        title = raw_title.split('(')[0].strip()
        
        # Cover: .img > a > img[src]
        img = item.select_one('.img img')
        cover_url = img['src'] if img else ""
        
        print(f"Found: {title}")
        
        # Process Cover
        final_cover = download_and_upload_cover(cover_url, title)
        
        books.append([title, final_cover, "", "", "0"]) # 0 for Status

    print(f"\nTotal books found: {len(books)}")
    if not books:
        return

    print("\nUploading to Feishu...")
    token = get_feishu_token()
    if not token:
        print("Failed to get Feishu token")
        return

    # Append to Sheet
    # API: /sheets/v2/spreadsheets/{spreadsheetToken}/values_append
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values_append"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "valueRange": {
            "range": f"{SHEET_ID}!A:E",
            "values": books
        }
    }
    
    resp = requests.post(url, headers=headers, json=payload)
    print(f"Feishu Response: {resp.text}")

if __name__ == "__main__":
    main()
