#!/usr/bin/env python3
"""
同步豆瓣2025年度榜单到飞书表格
下载封面图并上传到 PicList 图床
"""
import requests
import json
import time
import re
from pathlib import Path

# 配置
PICLIST_SERVER = 'http://127.0.0.1:36677'
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 豆瓣2025年度榜单书籍（已去重）
BOOKS = [
    {"title": "燕子呢喃，白鹤鸣叫", "id": "37290908"},
    {"title": "黄色墙纸", "id": "37138375"},
    {"title": "世界在前进", "id": "37521480"},
    {"title": "即使以最微弱的光", "id": "37286972"},
    {"title": "太阳的阴影", "id": "37315103"},
    {"title": "要有光", "id": "37407380"},
    {"title": "哲学家的最后一课", "id": "37269363"},
    {"title": "格外的活法", "id": "36331621"},
    {"title": "看不见的中东", "id": "37076175"},
    {"title": "父亲的解放日志", "id": "37200304"},
    {"title": "玫瑰朝上", "id": "37261282"},
    {"title": "人生解忧", "id": "37103197"},
    {"title": "我是寨子里长大的女孩", "id": "37399110"},
]

def get_access_token():
    """获取飞书访问令牌"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    resp = requests.post(url, json={"app_id": APP_ID, "app_secret": APP_SECRET})
    return resp.json().get("tenant_access_token")

def get_spreadsheet_token(access_token):
    """获取电子表格token"""
    url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token={WIKI_TOKEN}"
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取表格token失败: {data}")
        return None
    return data["data"]["node"]["obj_token"]

def get_first_sheet_id(access_token, spreadsheet_token):
    """获取第一个工作表ID"""
    url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/query"
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    data = resp.json()
    if data.get("code") != 0:
        print(f"获取工作表ID失败: {data}")
        return None
    return data["data"]["sheets"][0]["sheet_id"]

def download_and_upload_cover(book_id, title):
    """
    下载豆瓣封面并上传到 PicList
    参考: https://github.com/aefASAA/Download-of-the-cover-image-of-Douban-books
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://book.douban.com/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }
    douban_url = f"https://book.douban.com/subject/{book_id}/"

    try:
        print(f"\n[1/3] 正在访问豆瓣: {douban_url}")
        resp = requests.get(douban_url, headers=headers, timeout=10)

        if resp.status_code != 200:
            print(f"访问失败: {resp.status_code}")
            return None

        # 查找封面图链接 - 匹配大图
        patterns = [
            r'https://img\d+\.doubanio\.com/view/subject/l/public/s\d+\.jpg',
            r'"image":"(https://img\d+\.doubanio\.com/view/subject/l/public/s\d+\.jpg)"',
            r'id="mainpic"[^>]*>.*?<img[^>]*src="(https://img\d+\.doubanio\.com/[^"]+)"',
        ]

        img_url = None
        for pattern in patterns:
            match = re.search(pattern, resp.text, re.DOTALL)
            if match:
                img_url = match.group(1) if len(match.groups()) > 0 else match.group(0)
                # 确保是大图
                img_url = img_url.replace('/m/', '/l/')
                img_url = img_url.replace('/s/', '/l/')
                break

        if not img_url:
            print(f"未能找到 {title} 的封面图链接")
            return None

        print(f"[2/3] 找到封面: {img_url}")

        # 下载图片
        img_resp = requests.get(img_url, headers=headers, timeout=10)
        if img_resp.status_code != 200:
            print(f"下载图片失败: {img_resp.status_code}")
            return None

        # 保存临时文件 - 转换为JPEG格式
        temp_dir = Path("temp_covers")
        temp_dir.mkdir(exist_ok=True)
        temp_path = temp_dir / f"douban_{book_id}.jpg"

        # 如果原始图片不是JPEG格式，进行转换
        try:
            from PIL import Image
            import io

            img = Image.open(io.BytesIO(img_resp.content))
            # 转换为RGB模式（处理可能的RGBA格式）
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            img.save(temp_path, 'JPEG', quality=95)
        except ImportError:
            # 如果没有PIL，直接保存
            with open(temp_path, "wb") as f:
                f.write(img_resp.content)

        print(f"[3/3] 正在上传到 PicList...")

        # 上传到 PicList
        payload = {"list": [str(temp_path.absolute())]}
        upload_resp = requests.post(
            f"{PICLIST_SERVER}/upload",
            json=payload,
            timeout=30
        )

        if upload_resp.status_code == 200:
            result = upload_resp.json()
            if result.get('success') and result.get('result'):
                cdn_url = result['result'][0]
                print(f"上传成功: {cdn_url}")
                return cdn_url

        print(f"上传失败: {upload_resp.text}")
        return None

    except Exception as e:
        print(f"处理 {title} 时出错: {e}")
        import traceback
        traceback.print_exc()
        return None

def add_to_feishu(access_token, spreadsheet_token, sheet_id, book_data):
    """添加书籍到飞书表格"""
    if not book_data:
        print("没有可写入的数据")
        return

    # 先添加行数据
    values = [
        [
            book['title'],
            book['cover'],  # URL
            "",
            "0",
            "2025年度榜单"
        ]
        for book in book_data
    ]

    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values_prepend"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # 添加书籍
    payload = {
        "valueRange": {
            "range": f"{sheet_id}!A2:E{2 + len(values) - 1}",
            "values": values
        }
    }

    print(f"\n正在将 {len(values)} 本书写入飞书表格...")
    resp = requests.post(url, json=payload, headers=headers)
    data = resp.json()

    if data.get("code") != 0:
        print(f"写入失败: {data}")
        return False

    print(f"✓ 成功写入 {len(values)} 本书!")
    print("\n提示: 请在飞书表格中手动将B列设置为'图片'类型")
    print("操作步骤:")
    print("  1. 右键点击B列标题")
    print("  2. 选择 '列类型' → '图片'")
    print("  3. 图片将自动显示")

    return True

def main():
    print("=" * 60)
    print("豆瓣2025年度榜单 - 飞书同步工具")
    print("=" * 60)

    # 获取飞书配置
    print("\n[初始化] 获取飞书配置...")
    token = get_access_token()
    if not token:
        print("获取飞书访问令牌失败!")
        return

    ss_token = get_spreadsheet_token(token)
    if not ss_token:
        return

    sheet_id = get_first_sheet_id(token, ss_token)
    if not sheet_id:
        return

    print(f"表格ID: {ss_token}")
    print(f"工作表ID: {sheet_id}")

    # 处理每本书
    results = []
    for i, book in enumerate(BOOKS, 1):
        print(f"\n[{i}/{len(BOOKS)}] 处理: {book['title']}")
        cover_url = download_and_upload_cover(book['id'], book['title'])

        if cover_url:
            results.append({"title": book['title'], "cover": cover_url})
            time.sleep(0.5)  # 避免请求过快
        else:
            print(f"跳过: {book['title']}")

    # 写入飞书
    if results:
        add_to_feishu(token, ss_token, sheet_id, results)

        print("\n" + "=" * 60)
        print(f"完成! 共处理 {len(results)} 本书")
        print("=" * 60)
        for book in results:
            print(f"  - {book['title']}")
    else:
        print("\n没有成功处理任何书籍")

if __name__ == "__main__":
    main()
