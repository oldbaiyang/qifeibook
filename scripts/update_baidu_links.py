#!/usr/bin/env python3
"""
将百度网盘分享链接写入飞书表格对应书名的百度网盘列(D列)
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import requests
from lib.feishu_client import FeishuClient

APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 百度网盘链接数据: 文件名 -> 格式化后的链接
BAIDU_LINKS = {
    "波西和皮普": "https://pan.baidu.com/s/1e86GmSjfANq909MTNGc_sQ 提取码:0000",
    "钢铁是怎样炼成的": "https://pan.baidu.com/s/1bXb3ti5RqOCCck53rey0kw 提取码:0000",
    "读读童谣和儿歌": "https://pan.baidu.com/s/1GX0RynV1yRDNv6QDvqWSQg 提取码:0000",
    "见春天": "https://pan.baidu.com/s/1nljV8lJZJ92a1gbex6NpYw 提取码:0000",
    "快乐读书吧": "https://pan.baidu.com/s/1ZFk1JeoqraQjaQ3p5R5s3A 提取码:0000",
    "女生会学习": "https://pan.baidu.com/s/1W0C8TrzUTUitZQ39x56rgw 提取码:0000",
    "寻秦记": "https://pan.baidu.com/s/1j1SALabF1uh4uFKm2h7CZw 提取码:0000",
    "灰尘的旅行": "https://pan.baidu.com/s/1NjFw5plWRGLxapMA9wyo0w 提取码:0000",
    "经典常谈": "https://pan.baidu.com/s/1kUitYFHF9tJ2Slxw_9QF_A 提取码:0000",
    "小狗钱钱": "https://pan.baidu.com/s/1RcVA_es3AtfGgA4JiqyiaA 提取码:0000",
    "骆驼祥子": "https://pan.baidu.com/s/1yPchb7VCa-zynUhD15fCAQ 提取码:0000",
    "被讨厌的勇气": "https://pan.baidu.com/s/1hN4l8mHDam7bJhznU-jshg 提取码:0000",
    "我从未如此眷恋人间": "https://pan.baidu.com/s/1sWNkoyzdWujWAdkTIuGw5A 提取码:0000",
}


def main():
    print("=" * 50)
    print("写入百度网盘链接到飞书表格")
    print("=" * 50)

    feishu = FeishuClient(APP_ID, APP_SECRET, WIKI_TOKEN)

    # 1. 读取飞书表格
    print("\n读取飞书表格...")
    values = feishu.read_values("A1:F5000")
    if not values:
        print("无法读取飞书表格")
        return

    spreadsheet_token = feishu.get_spreadsheet_token()
    sheet_id = feishu.get_sheet_id()

    # 2. 匹配书名，找到对应行号
    # 一个关键词可能匹配多行（如"钢铁是怎样炼成的"出现在多个版本中）
    # 对每个关键词，匹配所有包含该关键词的行
    matches = []  # (row_num, title, keyword, link)

    for i, row in enumerate(values):
        if i == 0:  # 跳过表头
            continue
        if not row or not row[0]:
            continue

        title = feishu.extract_text(row[0])
        if not title:
            continue

        # 检查该行的百度网盘列(D列，index=3)是否已有内容
        existing_baidu = ""
        if len(row) > 3 and row[3]:
            existing_baidu = feishu.extract_text(row[3])

        for keyword, link in BAIDU_LINKS.items():
            if keyword in title:
                row_num = i + 1  # 飞书行号从 1 开始
                if existing_baidu:
                    print(f"  [跳过-已有链接] 行{row_num} {title}")
                else:
                    matches.append((row_num, title, keyword, link))
                break  # 一行只匹配一个关键词

    print(f"\n找到 {len(matches)} 行需要更新")

    if not matches:
        print("没有需要更新的行")
        return

    # 3. 批量更新
    # 使用 values_batch_update 一次性更新所有匹配行的 D 列
    update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values_batch_update"
    headers = feishu.get_headers()

    value_ranges = []
    for row_num, title, keyword, link in matches:
        value_ranges.append({
            "range": f"{sheet_id}!D{row_num}:D{row_num}",
            "values": [[link]]
        })
        print(f"  行{row_num}: {title} <- {link[:50]}...")

    # 分批更新，每批最多 50 个
    for i in range(0, len(value_ranges), 50):
        chunk = value_ranges[i:i+50]
        resp = requests.post(update_url, headers=headers, json={
            "valueRanges": chunk
        })
        data = resp.json()
        if data.get('code') == 0:
            print(f"\n批次 {i//50 + 1}: 成功更新 {len(chunk)} 行")
        else:
            print(f"\n批次 {i//50 + 1}: 更新失败 - {data.get('msg', resp.text[:100])}")

    print("\n" + "=" * 50)
    print(f"完成！共更新 {len(matches)} 行百度网盘链接")
    print("=" * 50)


if __name__ == "__main__":
    main()
