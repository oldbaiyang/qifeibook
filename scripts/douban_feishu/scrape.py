
import requests
from bs4 import BeautifulSoup
import lark_oapi as lark
import json
import time
import re
import base64
import os
from pathlib import Path

# Configuration
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# PicGo Server Configuration
PICGO_SERVER = 'http://127.0.0.1:36677'

# Initialize Client
client = lark.Client.builder() \
    .app_id(APP_ID) \
    .app_secret(APP_SECRET) \
    .build()

def upload_to_picgo(image_path):
    """
    Upload image to PicGo Server and return the image bed URL.
    PicGo Server expects file paths, not base64.
    """
    try:
        # Call PicGo Server API with file path
        upload_url = f"{PICGO_SERVER}/upload"
        payload = {
            "list": [str(image_path)]  # Send absolute file path
        }
        
        response = requests.post(upload_url, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            
            # Debug output (uncomment if needed)
            # print(f"  PicGo Response: {result}")
            
            # Check for fullResult with imgUrl
            if 'fullResult' in result:
                full_result = result['fullResult']
                if isinstance(full_result, list) and len(full_result) > 0:
                    first_item = full_result[0]
                    if isinstance(first_item, dict) and 'imgUrl' in first_item:
                        return first_item['imgUrl']
                    elif isinstance(first_item, str):
                        return first_item
            
            # Fallback: check result field
            if result.get('success') and result.get('result'):
                urls = result['result']
                if isinstance(urls, list) and len(urls) > 0:
                    if isinstance(urls[0], str):
                        return urls[0]
                    elif isinstance(urls[0], dict) and 'imgUrl' in urls[0]:
                        return urls[0]['imgUrl']
        
        print(f"  PicGo 上传失败: {response.json().get('message', response.text[:100])}")
        return None
        
    except Exception as e:
        print(f"  PicGo 上传异常: {e}")
        return None


def download_image(url, save_path):
    """
    Download image from URL to local path.
    使用浏览器 UA 来尝试绕过豆瓣的反爬
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://book.douban.com/'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"下载失败 {url}: {response.status_code}")
            return False
    except Exception as e:
        print(f"下载异常 {url}: {e}")
        return False

def scrape_douban_top250():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    books = []
    
    print("正在爬取豆瓣 Top 250...")
    for start in range(0, 250, 25):
        url = f'https://book.douban.com/top250?start={start}'
        print(f"正在抓取 {url}...")
        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"抓取失败 {url}: {response.status_code}")
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            items = soup.find_all('tr', class_='item')
            
            for item in items:
                # 抓取书名
                title = ""
                title_div = item.find('div', class_='pl2')
                if title_div:
                    link = title_div.find('a')
                    title = link['title'] if link.has_attr('title') else link.get_text(strip=True)
                    title = title.replace('\n', '').strip()
                
                # 抓取封面图
                cover = ""
                pic_div = item.find('td', valign='top').find('a', class_='nbg')
                if pic_div:
                    img_tag = pic_div.find('img')
                    if img_tag and img_tag.has_attr('src'):
                        cover = img_tag['src']

                if title:
                    books.append({'title': title, 'cover': cover})
            
            time.sleep(1) # Be nice
        except Exception as e:
            print(f"抓取异常 {url}: {e}")

    print(f"共抓取 {len(books)} 本书。")
    return books

if __name__ == "__main__":
    books = scrape_douban_top250()
    
    # Save to local file first
    with open("douban_top250.json", "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    print("已保存到 douban_top250.json")
    
    # Create temp directory for images
    temp_dir = Path("temp_images")
    temp_dir.mkdir(exist_ok=True)
    
    try:
        # Get tenant_access_token
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
            print(f"获取 Access Token 失败: {token_resp.msg}")
            exit(1)

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        real_token = WIKI_TOKEN
        
        # Query Sheets Info
        print(f"正在准备操作飞书文档: {real_token}...")
        sheet_query_url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{real_token}/sheets/query"
        resp = requests.get(sheet_query_url, headers=headers)
        
        if resp.status_code == 200 and resp.json().get('code') == 0:
            target_sheet_id = resp.json()['data']['sheets'][0]['sheet_id']
            print(f"发现电子表格，Sheet ID: {target_sheet_id}")
            
            # 1. 读取现有数据
            print("正在读取现有数据...")
            read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{real_token}/values/{target_sheet_id}!A:B"
            read_resp = requests.get(read_url, headers=headers)
            
            existing_data = {}
            if read_resp.status_code == 200 and read_resp.json().get('code') == 0:
                values = read_resp.json()['data']['valueRange']['values']
                if values:
                    for i, row in enumerate(values):
                        row_idx = i + 1 
                        title = row[0] if len(row) > 0 else ""
                        cover = row[1] if len(row) > 1 else ""
                        if title:
                            existing_data[title] = {'row': row_idx, 'cover': cover}
            
            print(f"已读取 {len(existing_data)} 条现有数据。")
            
            # 2. 处理封面图:下载 -> PicGo上传 -> 获取图床URL
            to_insert = []
            to_update = [] 
            
            print("开始处理封面图(下载 -> PicGo上传)...")
            
            for idx, book in enumerate(books):
                title = book['title']
                douban_cover = book['cover']
                
                print(f"\n[{idx+1}/{len(books)}] {title}")
                
                if not douban_cover:
                    print("  跳过:无封面")
                    continue
                
                # 下载图片
                img_filename = f"{idx+1:03d}_{title[:20]}.jpg".replace('/', '_')
                img_path = temp_dir / img_filename
                
                print(f"  下载中...")
                if not download_image(douban_cover, img_path):
                    print(f"  下载失败,跳过")
                    continue
                
                # 上传到 PicGo (需要绝对路径字符串)
                print(f"  上传到图床...")
                cdn_url = upload_to_picgo(img_path.absolute())
                
                if not cdn_url:
                    print(f"  上传失败,跳过")
                    # 清理本地文件
                    img_path.unlink(missing_ok=True)
                    continue
                
                print(f"  图床URL: {cdn_url}")
                
                # 清理本地文件(成功后删除)
                img_path.unlink(missing_ok=True)
                
                # 判断是更新还是新增
                if title in existing_data:
                    existing_cover = existing_data[title]['cover']
                    # 如果已有图床链接且相同,跳过
                    if existing_cover == cdn_url:
                        print(f"  已存在相同链接,跳过")
                        continue
                    
                    row_idx = existing_data[title]['row']
                    to_update.append({
                        "range": f"{target_sheet_id}!B{row_idx}:B{row_idx}",
                        "values": [[cdn_url]]
                    })
                else:
                    to_insert.append([title, cdn_url])
            
            # 3. 执行批量更新
            if to_update:
                print(f"\n正在批量更新 {len(to_update)} 条数据的封面...")
                chunk_size = 50 
                for i in range(0, len(to_update), chunk_size):
                    chunk = to_update[i:i+chunk_size]
                    batch_update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{real_token}/values_batch_update"
                    payload = {"valueRanges": chunk}
                    update_resp = requests.post(batch_update_url, headers=headers, json=payload)
                    print(f"更新批次 {i//chunk_size + 1} 结果: {update_resp.json().get('msg')}")
            else:
                print("\n无需更新封面。")
                
            # 4. 执行追加
            if to_insert:
                print(f"\n正在追加 {len(to_insert)} 本新书...")
                append_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{real_token}/values_append"
                chunk_size = 100
                for i in range(0, len(to_insert), chunk_size):
                    chunk = to_insert[i:i+chunk_size]
                    payload = {
                        "valueRange": {
                            "range": f"{target_sheet_id}!A:B",
                            "values": chunk
                        }
                    }
                    append_resp = requests.post(append_url, headers=headers, json=payload)
                    print(f"追加批次 {i//chunk_size + 1} 结果: {append_resp.json().get('msg')}")
            else:
                print("\n没有需要新增的书籍。")

        else:
            err = resp.json()
            print(f"无法获取Sheet信息: {err}")

    except Exception as e:
        print(f"发生异常: {e}")
    finally:
        # 清理临时目录
        if temp_dir.exists():
            for f in temp_dir.iterdir():
                f.unlink()
            temp_dir.rmdir()
