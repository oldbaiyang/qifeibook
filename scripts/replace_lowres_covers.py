#!/usr/bin/env python3
"""
替换飞书表格中低分辨率的当当封面图
- 读取飞书表格中状态为 0 的新书
- 从豆瓣搜索高分辨率封面 (>600x400)
- 下载并检查分辨率，上传到图床
- 更新飞书表格中的封面列
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import requests
import re
import time
import struct
import zlib
from io import BytesIO
from typing import List, Optional, Tuple
from urllib.parse import quote
from lib.feishu_client import FeishuClient

# Configuration
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
PICGO_SERVER = 'http://127.0.0.1:36677'

MIN_WIDTH = 600
MIN_HEIGHT = 400

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://book.douban.com/',
}


def get_image_size(data: bytes) -> Optional[Tuple[int, int]]:
    """从图片二进制数据中解析宽高，支持 JPEG/PNG，不依赖 Pillow"""
    if len(data) < 24:
        return None

    # PNG
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        w = struct.unpack('>I', data[16:20])[0]
        h = struct.unpack('>I', data[20:24])[0]
        return (w, h)

    # JPEG
    if data[:2] == b'\xff\xd8':
        try:
            offset = 2
            while offset < len(data) - 1:
                while offset < len(data) and data[offset] != 0xFF:
                    offset += 1
                while offset < len(data) and data[offset] == 0xFF:
                    offset += 1
                if offset >= len(data):
                    break
                marker = data[offset]
                offset += 1
                # SOF markers (0xC0 - 0xCF, except 0xC4 and 0xCC)
                if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                              0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    if offset + 7 <= len(data):
                        h = struct.unpack('>H', data[offset+3:offset+5])[0]
                        w = struct.unpack('>H', data[offset+5:offset+7])[0]
                        return (w, h)
                    break
                elif marker == 0xD9:  # EOI
                    break
                elif marker in (0xD0, 0xD1, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0x01):
                    continue
                else:
                    if offset + 2 <= len(data):
                        length = struct.unpack('>H', data[offset:offset+2])[0]
                        offset += length
                    else:
                        break
        except Exception:
            pass
    return None


def search_douban_cover(title: str) -> Optional[str]:
    """从豆瓣搜索高分辨率封面"""
    # 清理书名：去掉副标题、版本信息等
    clean = title
    for sep in ['：', ':', '（', '(', '【', ' —', '——']:
        clean = clean.split(sep)[0]
    clean = re.sub(r'\d+册.*$', '', clean)
    clean = re.sub(r'全[二三四五六七八九十\d]+[册部卷].*$', '', clean)
    clean = re.sub(r'(套装|精装|平装|典藏|珍藏|纪念|签名|印签|专享|当当|自营|限量|赠|附赠).*$', '', clean)
    clean = clean.strip()

    if not clean:
        return None

    # 搜索豆瓣
    search_url = f"https://www.douban.com/search?cat=1001&q={quote(clean)}"
    print(f"    搜索豆瓣: {clean}")

    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            print(f"    搜索失败: HTTP {resp.status_code}")
            return None

        # 匹配搜索结果中的封面图
        match = re.search(
            r'<img src="(https://img\d\.doubanio\.com/view/subject/[sml]/public/[^"]+\.jpg)"',
            resp.text
        )
        if match:
            thumb_url = match.group(1)
            # 替换为大图: /s/ -> /l/, /m/ -> /l/
            large_url = re.sub(r'/view/subject/[sm]/', '/view/subject/l/', thumb_url)
            return large_url

        print("    豆瓣未找到封面")
        return None

    except Exception as e:
        print(f"    搜索异常: {e}")
        return None


def download_and_check(url: str) -> Optional[Tuple[bytes, int, int]]:
    """下载图片并检查分辨率，返回 (data, width, height) 或 None"""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            print(f"    下载失败: HTTP {resp.status_code}")
            return None

        data = resp.content
        if len(data) < 1000:
            print(f"    图片太小: {len(data)} bytes")
            return None

        size = get_image_size(data)
        if not size:
            print(f"    无法解析图片尺寸")
            return None

        w, h = size
        print(f"    分辨率: {w}x{h}")

        if w >= MIN_WIDTH or h >= MIN_HEIGHT:
            return (data, w, h)
        else:
            print(f"    分辨率不足 (需要 >={MIN_WIDTH}x{MIN_HEIGHT})")
            return None

    except Exception as e:
        print(f"    下载异常: {e}")
        return None


def upload_to_piclist(image_path: Path) -> Optional[str]:
    """上传到 PicList 图床"""
    try:
        resp = requests.post(
            f"{PICGO_SERVER}/upload",
            json={"list": [str(image_path.absolute())]},
            timeout=30
        )
        if resp.status_code == 200:
            result = resp.json()
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
        print(f"    PicList 上传失败: {resp.text[:100]}")
    except requests.exceptions.ConnectionError:
        print("    PicList 服务未启动")
    except Exception as e:
        print(f"    上传异常: {e}")
    return None


def main():
    print("=" * 50)
    print("替换低分辨率封面图 (从豆瓣搜索高清封面)")
    print(f"最低分辨率要求: {MIN_WIDTH}x{MIN_HEIGHT}")
    print("=" * 50)

    feishu = FeishuClient(APP_ID, APP_SECRET, WIKI_TOKEN)
    temp_dir = Path(__file__).parent / "temp_images_hires"
    temp_dir.mkdir(exist_ok=True)

    try:
        # 1. 读取飞书表格中所有数据
        print("\n读取飞书表格...")
        values = feishu.read_values("A1:F5000")
        if not values:
            print("无法读取飞书表格")
            return

        # 2. 找出状态为 0 的行（新添加的书，尚未同步）
        spreadsheet_token = feishu.get_spreadsheet_token()
        sheet_id = feishu.get_sheet_id()

        targets = []
        for i, row in enumerate(values):
            if i == 0:  # 跳过表头
                continue
            if len(row) < 2:
                continue

            title = feishu.extract_text(row[0]) if row[0] else ""
            cover = feishu.extract_text(row[1]) if len(row) > 1 and row[1] else ""
            status = str(row[4]) if len(row) > 4 and row[4] is not None else ""

            # 只处理状态为 0 的新书
            if title and status in ("0", "0.0"):
                targets.append({
                    "row": i + 1,  # 飞书行号从 1 开始
                    "title": title,
                    "cover": cover,
                })

        print(f"找到 {len(targets)} 本待处理的新书")

        if not targets:
            print("没有需要替换封面的书籍")
            return

        # 3. 逐本处理
        success_count = 0
        skip_count = 0
        fail_count = 0

        for idx, book in enumerate(targets):
            title = book['title']
            row_num = book['row']
            print(f"\n[{idx+1}/{len(targets)}] {title} (行{row_num})")

            # 搜索豆瓣封面
            douban_url = search_douban_cover(title)
            if not douban_url:
                fail_count += 1
                time.sleep(1)
                continue

            # 下载并检查分辨率
            result = download_and_check(douban_url)
            if not result:
                # 如果大图失败，尝试中图
                mid_url = douban_url.replace('/view/subject/l/', '/view/subject/m/')
                if mid_url != douban_url:
                    print("    尝试中等尺寸...")
                    result = download_and_check(mid_url)

            if not result:
                fail_count += 1
                time.sleep(1.5)
                continue

            data, w, h = result

            # 保存临时文件
            img_path = temp_dir / f"hires_{idx}_{int(time.time())}.jpg"
            with open(img_path, 'wb') as f:
                f.write(data)

            # 上传到图床
            cdn_url = upload_to_piclist(img_path)
            img_path.unlink(missing_ok=True)

            if not cdn_url:
                fail_count += 1
                time.sleep(1)
                continue

            # 更新飞书表格
            print(f"    新封面: {cdn_url}")
            update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values"
            resp = requests.put(update_url, headers=feishu.get_headers(), json={
                "valueRange": {
                    "range": f"{sheet_id}!B{row_num}:B{row_num}",
                    "values": [[cdn_url]]
                }
            })
            resp_data = resp.json()
            if resp_data.get('code') == 0:
                print(f"    飞书更新成功 ({w}x{h})")
                success_count += 1
            else:
                print(f"    飞书更新失败: {resp_data.get('msg')}")
                fail_count += 1

            # 避免请求过快被豆瓣封禁
            time.sleep(2)

        # 4. 汇总
        print("\n" + "=" * 50)
        print(f"处理完成:")
        print(f"  成功替换: {success_count}")
        print(f"  未找到高清封面: {fail_count}")
        print(f"  总计处理: {len(targets)}")
        print("=" * 50)

    except Exception as e:
        print(f"\n执行出错: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if temp_dir.exists():
            for f in temp_dir.iterdir():
                f.unlink()
            if not any(temp_dir.iterdir()):
                temp_dir.rmdir()


if __name__ == "__main__":
    main()
