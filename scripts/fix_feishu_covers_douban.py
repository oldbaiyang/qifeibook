#!/usr/bin/env python3
"""
Batch repair zhishikoo covers by searching Douban
"""

import requests
import re
import os
import time
import json
import lark_oapi as lark
from pathlib import Path
from urllib.parse import quote

# Feishu Config
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
SHEET_ID = '68d757'

# PicGo Config
PICGO_SERVER = 'http://127.0.0.1:36677/upload'

# Headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://book.douban.com/'
}

def get_feishu_client():
    return lark.Client.builder().app_id(APP_ID).app_secret(APP_SECRET).build()

def get_feishu_token(client):
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

def fetch_books_to_fix(token):
    # Fetch rows where status is 0 (or we can just check if cover contains zhishikoo)
    # We'll fetch the last 50 rows to be safe
    # Or fetch all and filter. Sheet is small (<300 rows)
    
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values/{SHEET_ID}!A:E"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print(f"Failed to fetch sheet: {resp.text}")
        return []
        
    data = resp.json()
    rows = data['data']['valueRange']['values']
    
    targets = []
    # Skip header
    for i, row in enumerate(rows):
        if i == 0: continue
        
        # Row index is i+1 (if starting from 1)
        # But wait, Feishu API response `values` index 0 is row 1 (if range was A:E)
        # Yes.
        
        # Check if cover (col index 1) contains 'zhishikoo'
        title = row[0] if len(row) > 0 else ""
        cover = row[1] if len(row) > 1 else ""
        
        # We process if cover is from zhishikoo OR cover is empty?
        # User asked to fix "newly added books".
        # New books have Status (index 4) as "0" or empty? My script set it to "0".
        # Let's target rows with "zhishikoo.com" in cover.
        
        # Extract Text from cell if it's a dict/list
        if isinstance(cover, list) and len(cover) > 0 and 'text' in cover[0]:
             cover = cover[0]['text']
        elif isinstance(cover, dict) and 'text' in cover:
             cover = cover['text']
        
        if "zhishikoo.com" in str(cover):
            targets.append({
                "row": i + 1, # 1-based index for logging/updates
                "title": str(title),
                "cover": str(cover)
            })
            
    return targets

def search_douban_cover(title):
    # Clean title
    clean_title = title.split('：')[0].split(':')[0].strip()
    search_url = f"https://www.douban.com/search?cat=1001&q={quote(clean_title)}"
    print(f"  Searching Douban: {clean_title}")
    
    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            print(f"  Search failed: {resp.status_code}")
            return None
            
        # Extract first result image
        # Pattern: <a class="nbg" ... ><img src="..."></a>
        # The result list usually starts with <div class="result">
        
        match = re.search(r'<div class="result">.*?<img src="(https://img\d\.doubanio\.com/view/subject/s/public/.*?.jpg)"', resp.text, re.DOTALL)
        if match:
            thumb_url = match.group(1)
            # Try to get large image by replacing /s/public/ with /l/public/
            large_url = thumb_url.replace('/s/public/', '/l/public/')
            return large_url
            
        # Fallback regex
        match = re.search(r'<img src="(https://img\d\.doubanio\.com/view/subject/s/public/.*?.jpg)"', resp.text)
        if match:
             return match.group(1).replace('/s/public/', '/l/public/')
             
        print("  No cover found in search results")
        return None
        
    except Exception as e:
        print(f"  Error searching: {e}")
        return None

def download_and_upload(url, title):
    try:
        print(f"  Downloading: {url}")
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return None
            
        ext = url.split('.')[-1]
        filename = f"temp/fix_{title}.{ext}"
        with open(filename, "wb") as f:
            f.write(resp.content)
            
        print(f"  Uploading to PicGo...")
        abs_path = os.path.abspath(filename)
        picgo_resp = requests.post(PICGO_SERVER, json={"list": [abs_path]})
        
        if picgo_resp.status_code == 200:
            res = picgo_resp.json()
            if res.get('success'):
                os.remove(filename)
                return res['result'][0]
        return None
    except Exception as e:
        print(f"  Upload error: {e}")
        return None

def update_feishu_row(token, row_index, new_cover):
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Update Column B (Cover)
    range_notation = f"{SHEET_ID}!B{row_index}:B{row_index}"
    
    payload = {
        "valueRange": {
            "range": range_notation,
            "values": [[new_cover]]
        }
    }
    
    resp = requests.put(url, headers=headers, json=payload)
    if resp.status_code == 200:
        print(f"  ✓ Updated Feishu row {row_index}")
    else:
        print(f"  ✗ Failed to update Feishu: {resp.text}")

def main():
    if not os.path.exists("temp"):
        os.makedirs("temp")
        
    client = get_feishu_client()
    token = get_feishu_token(client)
    if not token:
        print("Auth failed")
        return
        
    print("Fetching books from Feishu...")
    targets = fetch_books_to_fix(token)
    print(f"Found {len(targets)} books with zhishikoo covers.")
    
    # Process only 5 at a time to avoid timeout
    targets = targets[:5]
    
    for book in targets:
        title = book['title']
        row = book['row']
        print(f"\nProcessing [{row}] {title}...")
        
        douban_cover = search_douban_cover(title)
        if not douban_cover:
            print("  Skipping (No Douban cover found)")
            time.sleep(1)
            continue
            
        picgo_url = download_and_upload(douban_cover, title)
        if picgo_url:
            print(f"  New Cover: {picgo_url}")
            update_feishu_row(token, row, picgo_url)
        else:
            print("  Skipping (Upload failed)")
            
        time.sleep(2) # Be nice to Douban

if __name__ == "__main__":
    main()
