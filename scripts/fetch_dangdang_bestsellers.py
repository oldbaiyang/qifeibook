#!/usr/bin/env python3
"""
爬取当当图书畅销榜，下载封面上传图床，写入飞书表格
- 爬取当当近7日畅销榜 + 新书热卖榜
- 与飞书表格已有书名和 mockData.ts 已有书名去重
- 封面通过本地 PicList 服务上传到图床
- 书名 + 封面 CDN URL 追加到飞书表格
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import requests
from bs4 import BeautifulSoup
import time
import re
from typing import List, Set, Optional
from lib.feishu_client import FeishuClient

# Configuration - 与现有脚本保持一致
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# PicList Server
PICGO_SERVER = 'http://127.0.0.1:36677'

# 请求头
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'http://bang.dangdang.com/',
}

# 当当畅销榜 URL
# 01.00.00.00.00.00 = 所有图书
# recent7 = 近7日, recent30 = 近30日, 24hours = 近24小时
DANGDANG_CHARTS = [
    {
        'name': '近7日畅销榜',
        'url': 'http://bang.dangdang.com/books/bestsellers/01.00.00.00.00.00-recent7-0-0-1-{page}',
        'pages': 3,  # 每页 20 本，3 页 = 60 本
    },
    {
        'name': '新书热卖榜',
        'url': 'http://bang.dangdang.com/books/newhotsales/01.00.00.00.00.00-recent7-0-0-1-{page}',
        'pages': 2,
    },
]


def load_mockdata_titles() -> Set[str]:
    """从 data/mockData.ts 加载已有书名"""
    mockdata_path = Path(__file__).parent.parent / "data" / "mockData.ts"
    titles = set()
    if not mockdata_path.exists():
        return titles

    content = mockdata_path.read_text(encoding='utf-8')
    # 匹配 title: "..." 或 title: '...'
    for match in re.finditer(r'title:\s*["\'](.+?)["\']', content):
        titles.add(match.group(1).strip())

    return titles


def fetch_dangdang_chart(chart_config: dict) -> List[dict]:
    """爬取当当某个榜单"""
    name = chart_config['name']
    url_template = chart_config['url']
    max_pages = chart_config['pages']
    books = []

    print(f"\n正在抓取当当{name}...")

    for page in range(1, max_pages + 1):
        url = url_template.format(page=page)
        print(f"  第 {page} 页: {url}")

        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            if response.status_code != 200:
                print(f"  HTTP {response.status_code}，跳过")
                continue

            response.encoding = 'gb2312'
            soup = BeautifulSoup(response.text, 'html.parser')

            # 当当畅销榜的每本书在 ul.bang_list li 中
            items = soup.select('ul.bang_list li')
            if not items:
                # 备用选择器
                items = soup.select('.bang_list_box .list_num li')

            if not items:
                print(f"  未找到书籍条目，尝试备用解析...")
                # 再尝试另一种结构
                items = soup.select('.list_num li')

            page_count = 0
            for item in items:
                # 获取书名
                title = ""
                title_elem = item.select_one('.name a')
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    # 当当有时书名带有副标题，取主标题
                    title = title.split('（')[0].split('(')[0].strip()

                if not title:
                    continue

                # 获取封面图
                cover = ""
                img = item.select_one('.pic img')
                if img:
                    # 当当图片可能在 data-original 或 src 属性
                    cover = img.get('data-original') or img.get('src', '')

                # 升级封面图到大图
                if cover:
                    # 当当封面 URL 中 _b_ 为大图，_s_ 为缩略图
                    cover = cover.replace('_b_', '_b_').replace('_s_', '_b_')

                if title and cover and 'no_image' not in cover:
                    books.append({
                        'title': title,
                        'cover': cover,
                        'source': name,
                    })
                    page_count += 1

            print(f"    获取 {page_count} 本")

        except Exception as e:
            print(f"  异常: {e}")

        time.sleep(1.5)

    print(f"  {name}共获取 {len(books)} 本")
    return books


def download_image(url: str, save_path: Path) -> bool:
    """下载图片到本地"""
    try:
        # 当当图片需要特定的 Referer
        headers = {**HEADERS, 'Referer': 'http://bang.dangdang.com/'}
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200 and len(response.content) > 1000:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"    下载失败: HTTP {response.status_code}, size={len(response.content)}")
            return False
    except Exception as e:
        print(f"    下载异常: {e}")
        return False


def upload_to_piclist(image_path: Path) -> Optional[str]:
    """通过本地 PicList 服务上传到图床"""
    try:
        resp = requests.post(
            f"{PICGO_SERVER}/upload",
            json={"list": [str(image_path.absolute())]},
            timeout=30
        )
        if resp.status_code == 200:
            result = resp.json()
            # 检查 fullResult
            if 'fullResult' in result and result['fullResult']:
                first = result['fullResult'][0]
                if isinstance(first, dict) and 'imgUrl' in first:
                    return first['imgUrl']
                elif isinstance(first, str):
                    return first
            # 备用: result 字段
            if result.get('success') and result.get('result'):
                urls = result['result']
                if urls and isinstance(urls[0], str):
                    return urls[0]
        print(f"    PicList 上传失败: {resp.text[:100]}")
    except requests.exceptions.ConnectionError:
        print("    PicList 服务未启动，请先启动 PicList 应用")
    except Exception as e:
        print(f"    上传异常: {e}")
    return None


def main():
    print("=" * 50)
    print("当当图书畅销榜 → 飞书表格同步脚本")
    print("=" * 50)

    # 初始化飞书客户端
    feishu = FeishuClient(APP_ID, APP_SECRET, WIKI_TOKEN)
    temp_dir = Path(__file__).parent / "temp_images_dangdang"
    temp_dir.mkdir(exist_ok=True)

    try:
        # 1. 加载已有书名（飞书 + mockData.ts 双重去重）
        print("\n读取已有书籍用于去重...")
        existing_titles: Set[str] = set()

        # 从飞书表格读取
        values = feishu.read_values("A1:A5000")
        if values:
            for row in values:
                if row:
                    title = feishu.extract_text(row[0])
                    if title:
                        existing_titles.add(title)
        print(f"  飞书表格已有 {len(existing_titles)} 本书")

        # 从 mockData.ts 读取
        mockdata_titles = load_mockdata_titles()
        existing_titles.update(mockdata_titles)
        print(f"  mockData.ts 已有 {len(mockdata_titles)} 本书")
        print(f"  合计去重池 {len(existing_titles)} 本书")

        # 2. 爬取当当榜单
        all_books = []
        for chart in DANGDANG_CHARTS:
            books = fetch_dangdang_chart(chart)
            all_books.extend(books)
            time.sleep(2)

        print(f"\n共爬取 {len(all_books)} 本书")

        # 3. 去重
        seen_titles = set()
        new_books = []
        for book in all_books:
            title = book['title']
            if title in existing_titles or title in seen_titles:
                print(f"  [跳过-已存在] {title}")
                continue
            seen_titles.add(title)
            new_books.append(book)

        print(f"去重后剩余 {len(new_books)} 本新书")

        if not new_books:
            print("\n没有新书需要添加")
            return

        # 4. 检查 PicList 服务是否可用
        try:
            requests.get(f"{PICGO_SERVER}/heartbeat", timeout=3)
        except Exception:
            print(f"\n⚠ 警告：PicList 服务 ({PICGO_SERVER}) 未响应，请确保已启动")
            print("  继续尝试上传...")

        # 5. 下载封面 → 上传图床 → 收集数据
        print(f"\n处理 {len(new_books)} 本新书的封面...")
        spreadsheet_token = feishu.get_spreadsheet_token()
        sheet_id = feishu.get_sheet_id()

        if not spreadsheet_token or not sheet_id:
            print("无法获取飞书表格信息，退出")
            return

        to_insert = []
        for idx, book in enumerate(new_books):
            title = book['title']
            print(f"  [{idx+1}/{len(new_books)}] {title}")

            # 下载封面
            img_path = temp_dir / f"dangdang_{idx}_{int(time.time())}.jpg"
            if not download_image(book['cover'], img_path):
                print(f"    封面下载失败，跳过")
                continue

            # 上传到图床
            cdn_url = upload_to_piclist(img_path)
            img_path.unlink(missing_ok=True)

            if cdn_url:
                print(f"    封面: {cdn_url}")
                # 格式: [书名, 封面, 夸克, 百度, 状态, 分类]
                to_insert.append([title, cdn_url, "", "", 0, ""])
            else:
                print(f"    上传失败，跳过")

            time.sleep(0.5)

        # 6. 写入飞书表格
        if not to_insert:
            print("\n没有成功处理任何封面")
            return

        print(f"\n正在写入飞书表格 {len(to_insert)} 条...")
        # 刷新 token 避免过期
        feishu._access_token = None
        spreadsheet_token = feishu.get_spreadsheet_token()
        sheet_id = feishu.get_sheet_id()

        url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values_append"
        headers = feishu.get_headers()

        for i in range(0, len(to_insert), 100):
            chunk = to_insert[i:i+100]
            resp = requests.post(url, headers=headers, json={
                "valueRange": {
                    "range": f"{sheet_id}!A:F",
                    "values": chunk
                }
            })
            data = resp.json()
            if data.get('code') == 0:
                print(f"  批次 {i//100 + 1} 成功写入 {len(chunk)} 条")
            else:
                print(f"  批次 {i//100 + 1} 写入失败: {data.get('msg', resp.text[:100])}")

        print("\n" + "=" * 50)
        print(f"完成！共添加 {len(to_insert)} 本新书到飞书表格")
        print("=" * 50)

    except Exception as e:
        print(f"\n执行出错: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # 清理临时文件
        if temp_dir.exists():
            for f in temp_dir.iterdir():
                f.unlink()
            if not any(temp_dir.iterdir()):
                temp_dir.rmdir()


if __name__ == "__main__":
    main()
