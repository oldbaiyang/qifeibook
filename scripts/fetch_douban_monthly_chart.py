#!/usr/bin/env python3
"""
抓取豆瓣本月图书榜单，去重后将书名和封面插入飞书表格

流程：
1. 抓取豆瓣月度榜单页面
2. 读取飞书表格现有书名，去重
3. 下载封面图 → 上传 PicList 图床
4. 插入飞书表格（A列书名，B列封面图）
"""

import sys
import os
import re
import time
import requests
from pathlib import Path
from typing import List, Dict, Optional

sys.path.insert(0, os.path.dirname(__file__))

from lib.feishu_client import FeishuClient
from lib.douban_client import DoubanClient

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# PicList 配置
PICLIST_SERVER = 'http://127.0.0.1:36677'

# 豆瓣月度榜单 URL
CHART_URL = 'https://book.douban.com/chart?subcat=all'


def fetch_chart_books(client: DoubanClient) -> List[Dict[str, str]]:
    """抓取豆瓣月度榜单"""
    print("正在抓取豆瓣月度图书榜单...")
    resp = client.get(CHART_URL, skip_delay=True)
    if not resp or resp.status_code != 200:
        print(f"  抓取失败")
        return []

    html = resp.text
    books = []

    # 提取封面图和链接
    img_pattern = r'<a[^>]*href="(https://book\.douban\.com/subject/\d+/)"[^>]*>\s*<img[^>]*class="subject-cover"[^>]*src="([^"]+)"[^>]*/>'
    img_matches = re.findall(img_pattern, html)

    for href, cover in img_matches:
        # 提取书名
        title_pattern = rf'<a class="fleft"[^>]*href="{re.escape(href)}"[^>]*>([^<]+)</a>'
        title_match = re.search(title_pattern, html)
        if not title_match:
            continue

        title = title_match.group(1).strip()
        # 升级为大图
        large_cover = cover.replace('/s/public/', '/l/public/')

        books.append({
            'title': title,
            'cover': large_cover,
            'douban_url': href,
        })

    print(f"  榜单共 {len(books)} 本书")
    return books


def upload_to_piclist(image_path: str) -> Optional[str]:
    """上传图片到 PicList 图床"""
    try:
        resp = requests.post(
            f"{PICLIST_SERVER}/upload",
            json={"list": [os.path.abspath(image_path)]},
            timeout=30
        )
        if resp.status_code == 200:
            result = resp.json()
            # 兼容多种返回格式
            if 'fullResult' in result and result['fullResult']:
                first = result['fullResult'][0]
                if isinstance(first, dict) and 'imgUrl' in first:
                    return first['imgUrl']
                elif isinstance(first, str):
                    return first
            if result.get('success') and result.get('result'):
                urls = result['result']
                if urls and isinstance(urls[0], str):
                    return urls[0]
    except Exception as e:
        print(f"    上传失败: {e}")
    return None


def main():
    print("=" * 60)
    print("豆瓣月度榜单 → 飞书表格")
    print("=" * 60)

    # 初始化客户端
    douban = DoubanClient(delay=(2.0, 4.0), max_retries=3)
    feishu = FeishuClient(APP_ID, APP_SECRET, WIKI_TOKEN)

    # 创建临时目录
    temp_dir = Path(__file__).parent / "temp_chart_covers"
    temp_dir.mkdir(exist_ok=True)

    try:
        # 1. 抓取豆瓣榜单
        chart_books = fetch_chart_books(douban)
        if not chart_books:
            print("未获取到榜单数据，退出")
            return

        # 2. 读取飞书现有书名
        print("\n读取飞书表格现有书名...")
        existing_titles = set()
        values = feishu.read_values("A1:A5000")
        if values:
            for row in values:
                if row:
                    title = feishu.extract_text(row[0])
                    if title:
                        existing_titles.add(title)
        print(f"  飞书已有 {len(existing_titles)} 本书")

        # 3. 去重
        new_books = [b for b in chart_books if b['title'] not in existing_titles]
        skipped = len(chart_books) - len(new_books)
        print(f"\n去重结果: {len(new_books)} 本新书, {skipped} 本已存在")

        if not new_books:
            print("所有榜单书籍已存在，无需添加")
            return

        # 4. 下载封面 + 上传图床
        print(f"\n处理封面...")
        to_insert = []
        for idx, book in enumerate(new_books):
            title = book['title']
            print(f"  [{idx+1}/{len(new_books)}] {title}")

            # 下载封面
            safe_name = re.sub(r'[^\w]', '_', title)
            img_path = temp_dir / f"chart_{safe_name}.jpg"

            if not douban.download_image(book['cover'], str(img_path)):
                print(f"    封面下载失败，跳过")
                continue

            # 上传到图床
            cdn_url = upload_to_piclist(str(img_path))
            img_path.unlink(missing_ok=True)

            if cdn_url:
                print(f"    上传成功: {cdn_url}")
                to_insert.append([title, cdn_url])
            else:
                print(f"    上传图床失败，跳过")

        # 5. 写入飞书
        if to_insert:
            print(f"\n写入飞书表格 {len(to_insert)} 条...")
            # 刷新 token
            feishu._access_token = None
            spreadsheet_token = feishu.get_spreadsheet_token()
            sheet_id = feishu.get_sheet_id()

            url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values_append"
            headers = feishu.get_headers()

            # 补齐列数 (A-F: 书名, 封面, 夸克, 百度, 状态, 备注)
            rows = [[title, cover, "", "", 0, ""] for title, cover in to_insert]

            resp = requests.post(url, headers=headers, json={
                "valueRange": {
                    "range": f"{sheet_id}!A:F",
                    "values": rows
                }
            })
            result = resp.json()
            if result.get("code") == 0:
                print(f"  写入成功!")
            else:
                print(f"  写入结果: {result.get('msg', resp.text[:100])}")

        print(f"\n{'=' * 60}")
        print(f"完成! 共添加 {len(to_insert)} 本新书到飞书表格")
        print(f"豆瓣请求统计: {douban.stats}")
        print(f"{'=' * 60}")

    finally:
        # 清理临时文件
        if temp_dir.exists():
            for f in temp_dir.iterdir():
                f.unlink(missing_ok=True)
            temp_dir.rmdir()


if __name__ == "__main__":
    main()
