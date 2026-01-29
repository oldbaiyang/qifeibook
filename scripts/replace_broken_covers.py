#!/usr/bin/env python3
"""
修复指定书籍的封面：
1. 从豆瓣获取高清封面
2. 上传到本地 PicGo
3. 更新 mockData.js
"""

import requests
import re
import os
import time
from pathlib import Path

# 目标书籍及其豆瓣 ID (或者搜索关键词)
# 为了准确，我这里直接使用搜索结果中看起来最靠谱的 ID
TARGET_BOOKS = {
    "浪潮之巅": "6713426",
    "昨日的世界": "20424526"
}

MANUAL_COVERS = {
    "桶川跟踪狂杀人事件": "https://img9.doubanio.com/view/subject/l/public/s33827824.jpg"
}

PICGO_SERVER = 'http://127.0.0.1:36677/upload'
TEMP_DIR = Path("temp_covers")
TEMP_DIR.mkdir(exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://book.douban.com/'
}

def get_douban_cover(subject_id):
    url = f"https://book.douban.com/subject/{subject_id}/"
    print(f"Fetching Douban page: {url}")
    try:
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code != 200:
            print(f"Failed to fetch page: {resp.status_code}")
            return None
        
        # 尝试提取高清封面
        # 1. 尝试 JSON-LD 中的 image (通常最准)
        match = re.search(r'"image":\s*"(https://img\d\.doubanio\.com/view/subject/l/public/.*?\.jpg)"', resp.text)
        if match:
            return match.group(1)

        # 2. 尝试 og:image
        match = re.search(r'<meta property="og:image" content="(.*?)"', resp.text)
        if match:
            return match.group(1)

        # 3. 尝试 img 标签 (l/public, m/public, s/public)
        # 优先找 l (large)
        match = re.search(r'<img src="(https://img\d\.doubanio\.com/view/subject/l/public/.*?\.jpg)"', resp.text)
        if match:
            return match.group(1)
            
        # 备用: 找 content 区域的主图
        match = re.search(r'<a class="nbg"[^>]*href="([^"]*)"', resp.text)
        if match and match.group(1).endswith('.jpg'):
            return match.group(1)
            
        return None
    except Exception as e:
        print(f"Error fetching douban cover: {e}")
        return None

def download_image(url, filename):
    print(f"Downloading image: {url}")
    try:
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code == 200:
            file_path = TEMP_DIR / filename
            with open(file_path, "wb") as f:
                f.write(resp.content)
            return str(file_path)
    except Exception as e:
        print(f"Error downloading image: {e}")
    return None

def upload_to_picgo(file_path):
    print(f"Uploading to PicGo: {file_path}")
    try:
        # PicGo 上传接口需要 list 字段
        payload = {"list": [str(file_path)]}
        resp = requests.post(PICGO_SERVER, json=payload)
        if resp.status_code == 200:
            res_json = resp.json()
            if res_json.get("success"):
                return res_json["result"][0]
            else:
                 print(f"PicGo error: {res_json}")
        else:
            print(f"PicGo HTTP error: {resp.status_code}")
    except Exception as e:
        print(f"Error uploading to PicGo: {e}")
    return None

def update_mockdata(title, new_cover_url):
    mockdata_path = Path("src/data/mockData.js")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 精确匹配 title 对应的 block
    # pattern: title: "BookName" ... cover: "OldUrl"
    # 我们需要更稳健的正则，确保只替换该书的 cover
    
    # 查找 title 所在的位置
    title_pattern = rf'title:\s*"{re.escape(title)}"'
    title_match = re.search(title_pattern, content)
    
    if not title_match:
        print(f"Could not find book in mockData.js: {title}")
        return False
        
    start_pos = title_match.start()
    
    # 从 start_pos 开始找 cover: "..."
    # 假设 cover 就在 title 后面不远
    cover_pattern = re.compile(r'cover:\s*"([^"]*)"')
    cover_match = cover_pattern.search(content, pos=start_pos)
    
    if cover_match:
        # 确保这个 cover 属于这本书 (例如，在下一个 title 之前)
        next_title = re.search(r'title:\s*"', content[start_pos+1:])
        limit = len(content)
        if next_title:
            limit = start_pos + 1 + next_title.start()
            
        if cover_match.start() < limit:
            old_cover = cover_match.group(1)
            # 执行替换
            # 这里的 span 是相对于 content 的
            span = cover_match.span(1) # group 1 is the url inside quotes
            new_content = content[:span[0]] + new_cover_url + content[span[1]:]
            
            with open(mockdata_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {title}: {old_cover} -> {new_cover_url}")
            return True
        else:
            print(f"Cover found but seems to belong to next book for {title}")
    else:
        print(f"Cover field not found for {title}")
    
    return False

def main():
    # 1. Process Douban IDs
    for title, douban_id in TARGET_BOOKS.items():
        print(f"\nProcessing: {title}")
        cover_url = get_douban_cover(douban_id)
        if not cover_url:
            print("Skipping due to missing cover URL")
            continue
            
        # 下载
        ext = cover_url.split('.')[-1]
        filename = f"{title}_{douban_id}.{ext}"
        local_path = download_image(cover_url, filename)
        
        if not local_path:
            print("Skipping due to download failure")
            continue
            
        # 上传
        abs_path = os.path.abspath(local_path)
        picgo_url = upload_to_picgo(abs_path)
        if not picgo_url:
            print("Skipping due to upload failure")
            continue
            
        # 更新
        update_mockdata(title, picgo_url)
        time.sleep(1)

    # 2. Process Manual Covers
    if 'MANUAL_COVERS' in globals():
        for title, url in MANUAL_COVERS.items():
            print(f"\nProcessing Manual: {title}")
            ext = url.split('.')[-1]
            filename = f"{title}_manual.{ext}"
            local_path = download_image(url, filename)
            
            if not local_path:
                print("Skipping due to download failure")
                continue
                
            abs_path = os.path.abspath(local_path)
            picgo_url = upload_to_picgo(abs_path)
            if not picgo_url:
                print("Skipping due to upload failure")
                continue
                
            update_mockdata(title, picgo_url)
            time.sleep(1)

if __name__ == "__main__":
    main()
