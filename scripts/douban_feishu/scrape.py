
import requests
from bs4 import BeautifulSoup
import lark_oapi as lark
import json
import time

# Configuration
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# Initialize Client
client = lark.Client.builder() \
    .app_id(APP_ID) \
    .app_secret(APP_SECRET) \
    .build()

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
        # Robust token retrieval
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
        
        # Query Sheets Info first
        print(f"正在准备操作飞书文档: {real_token}...")
        sheet_query_url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{real_token}/sheets/query"
        resp = requests.get(sheet_query_url, headers=headers)
        
        if resp.status_code == 200 and resp.json().get('code') == 0:
            target_sheet_id = resp.json()['data']['sheets'][0]['sheet_id']
            print(f"发现电子表格，Sheet ID: {target_sheet_id}")
            
            # 1. 每一行都读取出来，建立映射 {Title: {'row': index, 'cover': cover}}
            print("正在读取现有数据进行比对...")
            # 读取 A:B 列
            read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{real_token}/values/{target_sheet_id}!A:B"
            read_resp = requests.get(read_url, headers=headers)
            
            existing_data = {}
            if read_resp.status_code == 200 and read_resp.json().get('code') == 0:
                values = read_resp.json()['data']['valueRange']['values']
                # values is list of list, e.g. [['Title', 'Cover'], ['Book1', 'http...'], ...]
                # Start index depends on if there is header. Let's assume user might have processed data or empty.
                # However, range A:B might return empty if sheet is empty.
                if values:
                    for i, row in enumerate(values):
                        # Row index in Sheet is 1-based. Python enumerate i=0 corresponds to Row 1.
                        row_idx = i + 1 
                        title = row[0] if len(row) > 0 else ""
                        cover = row[1] if len(row) > 1 else ""
                        
                        if title: # Key by title
                            existing_data[title] = {'row': row_idx, 'cover': cover}
            
            print(f"已读取 {len(existing_data)} 条现有数据。")
            
            # 2. 准备 Update 和 Insert 列表
            to_insert = []
            to_update = [] # List of {'range': '...', 'values': [[cover]]}
            
            for book in books:
                title = book['title']
                new_cover = book['cover']
                
                if title in existing_data:
                    # Exists, check if cover needs update
                    existing_cover = existing_data[title]['cover']
                    if not existing_cover and new_cover:
                        # B列为空且新数据有封面 -> 需要更新
                        row_idx = existing_data[title]['row']
                        print(f"更新封面 - 书名: {title}, 行号: {row_idx}")
                        to_update.append({
                            "range": f"{target_sheet_id}!B{row_idx}:B{row_idx}",
                            "values": [[new_cover]]
                        })
                    else:
                        # 都有内容，或者新数据也没封面 -> 跳过
                        # print(f"跳过 - 书名: {title}")
                        pass
                else:
                    # New book
                    # print(f"新增 - 书名: {title}")
                    to_insert.append([title, new_cover])
            
            # 3. 执行批量更新 (Batch Update)
            if to_update:
                print(f"正在批量更新 {len(to_update)} 条数据的封面...")
                batch_update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{real_token}/values_batch_update"
                # Batch update API limits? Usually 100 ranges is safe. 
                # Let's chunk if necessary, but 250 is likely fine for v2.
                # Check limits: V2 batch update supports up to 1000 ranges.
                
                payload = {
                    "valueRanges": to_update
                }
                update_resp = requests.post(batch_update_url, headers=headers, json=payload)
                print(f"批量更新结果: {update_resp.json().get('msg')}")
            else:
                print("没有需要更新封面的数据。")
                
            # 4. 执行追加 (Append)
            if to_insert:
                print(f"正在追加 {len(to_insert)} 本新书...")
                # Chunk inserts to be safe
                append_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{real_token}/values_append"
                
                # Append process
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
                print("没有需要新增的书籍。")

        else:
            err = resp.json()
            print(f"不是电子表格或无权限/无法获取Sheet信息: {err.get('code')} - {err.get('msg')}")
            if err.get('code') == 99991672:
                 print("【错误】缺少权限。请添加 sheets:spreadsheet 权限。")
            elif err.get('code') == 1254003:
                 print("【错误】Token无效，请检查是否为 Wiki Token。")

    except Exception as e:
        print(f"发生异常: {e}")
