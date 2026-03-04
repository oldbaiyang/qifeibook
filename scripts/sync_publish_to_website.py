#!/usr/bin/env python3
"""
将指定飞书表格中的书籍同步至网站：
1. 从《发布》sheet 页读取 百度网盘不为空 且 状态不为 1 的记录
2. 通过豆瓣抓取补充作者、简介、出版年份等信息
3. 更新到本地仓库 data/mockData.ts
4. 更新本地仓库 public/sitemap.xml
5. 在网站文件全部更新完毕后，将这些书在飞书表格中的状态修改为 1
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import requests
import re
import time
import json
from typing import List, Dict, Optional, Set
from urllib.parse import quote

# Configuration
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'
TARGET_SHEET_NAME = '发布'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://book.douban.com/',
}

PROJECT_ROOT = Path(__file__).parent.parent
MOCKDATA_PATH = PROJECT_ROOT / "data" / "mockData.ts"
SITEMAP_PATH = PROJECT_ROOT / "public" / "sitemap.xml"

def get_tokens():
    url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'
    res = requests.post(url, json={'app_id': APP_ID, 'app_secret': APP_SECRET}).json()
    token = res.get('tenant_access_token')

    wiki_url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token={WIKI_TOKEN}"
    wiki_res = requests.get(wiki_url, headers={"Authorization": f"Bearer {token}"}).json()
    obj_token = wiki_res["data"]["node"]["obj_token"]
    return token, obj_token

def get_sheet_id(token, obj_token, sheet_name):
    meta_url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{obj_token}/sheets/query"
    meta_res = requests.get(meta_url, headers={"Authorization": f"Bearer {token}"}).json()
    for s in meta_res.get('data', {}).get('sheets', []):
        if s.get('title') == sheet_name:
            return s.get('sheet_id')
    return None

def extract_feishu_cell_text(cell):
    """从飞书单元格各种可能的数据结构中提取纯文本或链接文本"""
    if cell is None:
        return ""
    if isinstance(cell, str):
        return cell.strip()
    if isinstance(cell, list):
        if not cell: return ""
        text_parts = []
        for item in cell:
            if isinstance(item, dict):
                text = item.get('text', '')
                link = item.get('link', '')
                if text:
                    text_parts.append(text)
                elif link:
                    text_parts.append(link)
        return "".join(text_parts).strip()
    return str(cell).strip()

def clean_title(title: str) -> str:
    """清理书名后缀"""
    clean = title
    for sep in ['【', '【', '专供', '附赠', '赠', '当当', '自营', '印签', '签名',
                '限量', '亲签', '特签', '包邮', '人民教育出版社', '推荐名著',
                '初中语文', '课外阅读', '升级版', '名著阅读', '原著正版',
                '快乐读书吧', '爱阅读', '金波', '张抗抗']:
        idx = clean.find(sep)
        if idx > 3:
            clean = clean[:idx]
    clean = clean.rstrip(' ,，.。!！…_')
    # 处理类似 碧血剑_20260304_152348 这样的带有长串后缀的书名
    clean = re.sub(r'_\d{8}_\d{6}.*$', '', clean)
    return clean.strip()

def get_search_name(title: str) -> str:
    clean = clean_title(title)
    clean = re.sub(r'[\s]*[（(].*?[)）]', '', clean)
    clean = re.sub(r'\s*(全[二三四五六七八九十\d]+[册部卷]|套装|修订版|纪念版|新修版|精装|平装).*$', '', clean)
    clean = re.sub(r'\d+册.*$', '', clean)
    if len(clean) > 15:
        for sep in [' ', '：', ':', '·', '—', '　']:
            idx = clean.find(sep)
            if 2 < idx < 15:
                clean = clean[:idx]
                break
        else:
            clean = clean[:15]
    return clean.strip()

def search_douban(title: str) -> Optional[Dict]:
    search_name = get_search_name(title)
    if not search_name or len(search_name) < 2:
        return None

    search_url = f"https://www.douban.com/search?cat=1001&q={quote(search_name)}"
    print(f"    豆瓣搜索: {search_name}")

    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return None

        text = resp.text
        detail_match = re.search(r'href="(https://book\.douban\.com/subject/\d+/?)"', text)
        if not detail_match:
            return None

        detail_url = detail_match.group(1)
        time.sleep(1)

        detail_resp = requests.get(detail_url, headers=HEADERS, timeout=10)
        if detail_resp.status_code != 200:
            return None

        detail = detail_resp.text
        info = {}

        author_match = re.search(r'<span>\s*作者</span>.*?<a[^>]*>(.*?)</a>', detail, re.DOTALL)
        if author_match:
            info['author'] = re.sub(r'<[^>]+>', '', author_match.group(1)).strip()
            info['author'] = re.sub(r'\s+', ' ', info['author'])

        if not info.get('author'):
            author_match2 = re.search(r'作者.*?<a[^>]*>\s*(.*?)\s*</a>', detail, re.DOTALL)
            if author_match2:
                info['author'] = re.sub(r'<[^>]+>', '', author_match2.group(1)).strip()

        year_match = re.search(r'出版年:\s*</span>\s*([\d-]+)', detail)
        if year_match:
            info['year'] = year_match.group(1).strip()[:4]

        desc_match = re.search(r'class="all hidden"[^>]*>\s*<div class="intro">\s*(.*?)\s*</div>', detail, re.DOTALL)
        if not desc_match:
            desc_match = re.search(r'<div id="link-report"[^>]*>.*?<div class="intro">\s*(.*?)\s*</div>', detail, re.DOTALL)
        if desc_match:
            desc_html = desc_match.group(1)
            desc = re.sub(r'<[^>]+>', '', desc_html)
            desc = re.sub(r'\s+', ' ', desc).strip()
            if len(desc) > 500:
                desc = desc[:497] + '...'
            info['description'] = desc

        author_intro_match = re.search(r'<span[^>]*>作者简介.*?</span>.*?<div class="intro">\s*(.*?)\s*</div>', detail, re.DOTALL)
        if author_intro_match:
            author_intro = re.sub(r'<[^>]+>', '', author_intro_match.group(1))
            author_intro = re.sub(r'\s+', ' ', author_intro).strip()
            if len(author_intro) > 200:
                author_intro = author_intro[:197] + '...'
            info['authorDetail'] = author_intro

        return info if info else None

    except Exception:
        return None

def parse_baidu_link(link_text: str) -> Dict:
    result = {"name": "百度网盘", "url": "", "code": "0000"}
    url_match = re.search(r'(https?://pan\.baidu\.com/s/\S+?)[\s,，]', link_text + ' ')
    if url_match:
        result['url'] = url_match.group(1).rstrip('?')
    code_match = re.search(r'提取码[：:]\s*(\w+)', link_text)
    if code_match:
        result['code'] = code_match.group(1)
    # 如果没匹配到密码（特别是在富文本结构被拍平的情况下）
    if "密码: " in link_text or "密码:" in link_text:
        fallback_match = re.search(r'密码[:：]\s*(\w+)', link_text)
        if fallback_match:
            result['code'] = fallback_match.group(1)

    return result

def get_next_id() -> int:
    content = MOCKDATA_PATH.read_text(encoding='utf-8')
    ids = re.findall(r'"id":\s*(\d+)', content)
    if not ids:
        ids = re.findall(r'id:\s*(\d+)', content)
    if ids:
        return max(int(i) for i in ids) + 1
    return 284

def get_existing_titles() -> Set[str]:
    content = MOCKDATA_PATH.read_text(encoding='utf-8')
    titles = set()
    for m in re.finditer(r'(?:"title"|title):\s*["`\'](.+?)["`\']', content):
        titles.add(m.group(1).strip())
    return titles

def insert_books_to_mockdata(entries: List[Dict]) -> bool:
    content = MOCKDATA_PATH.read_text(encoding='utf-8')
    last_bracket = content.rfind('];')
    if last_bracket == -1:
        return False

    formatted = []
    for entry in entries:
        json_str = json.dumps(entry, ensure_ascii=False, indent=2)
        indented = "  " + json_str.replace('\n', '\n  ')
        formatted.append(indented + ",")

    insert_text = '\n'.join(formatted) + '\n'
    new_content = content[:last_bracket] + insert_text + content[last_bracket:]
    MOCKDATA_PATH.write_text(new_content, encoding='utf-8')
    return True

def update_sitemap(book_ids: List[int]) -> bool:
    content = SITEMAP_PATH.read_text(encoding='utf-8')
    today = time.strftime('%Y-%m-%d')
    new_entries = []
    for bid in book_ids:
        entry = f"""  <url>
    <loc>https://www.qifeibook.com/book/{bid}</loc>
    <lastmod>{today}</lastmod>
    <priority>0.8</priority>
  </url>"""
        new_entries.append(entry)

    insert_text = '\n'.join(new_entries) + '\n'
    close_tag = '</urlset>'
    idx = content.rfind(close_tag)
    if idx == -1: return False

    new_content = content[:idx] + insert_text + content[idx:]
    SITEMAP_PATH.write_text(new_content, encoding='utf-8')
    return True

def update_feishu_status(token, obj_token, sheet_id, rows_to_update: List[int]):
    """批量将成功落库的对应飞书行的状态列改写为 1"""
    if not rows_to_update: return

    update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{obj_token}/values_batch_update"
    updates = []

    # 状态列在发布表中由于前面没有“分类”列，处于第 E（5）列
    # A=书名, B=封面图, C=夸克网盘, D=百度网盘, E=状态
    for row_num in rows_to_update:
        updates.append({
            "range": f"{sheet_id}!E{row_num}:E{row_num}",
            "values": [["1"]]
        })

    payload = {"valueRanges": updates}
    res = requests.post(update_url, headers={"Authorization": f"Bearer {token}"}, json=payload).json()
    if res.get('code') == 0:
        print(f"✅ 成功在飞书文档中向打上了已完成(1)更新标记：共 {len(rows_to_update)} 行")
    else:
        print(f"❌ 飞书状态回写失败: {res}")


def main():
    print("=" * 60)
    print("发布表 -> 网站入库全量流程")
    print("=" * 60)

    token, obj_token = get_tokens()
    sheet_id = get_sheet_id(token, obj_token, TARGET_SHEET_NAME)

    if not sheet_id:
        print(f"找不到名为 {TARGET_SHEET_NAME} 的子表。")
        return

    # 1. 提取发布表中书籍
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{obj_token}/values/{sheet_id}!A:Z"
    data_res = requests.get(read_url, headers={"Authorization": f"Bearer {token}"}).json()
    rows = data_res.get('data', {}).get('valueRange', {}).get('values', [])

    if not rows:
        print("发布表为空")
        return

    # 寻找表头
    headers = []
    header_idx = 0
    for idx, r in enumerate(rows):
        if not r: continue
        row_txt = [extract_feishu_cell_text(c) for c in r]
        if '书名' in row_txt and ('状态' in row_txt):
            headers = row_txt
            header_idx = idx
            break

    if not headers:
        print("未识别到有效的表头")
        return

    try:
        title_idx = headers.index('书名')
        cover_idx = headers.index('封面图')
        baidu_idx = headers.index('百度网盘')
        status_idx = headers.index('状态')
        category_idx = headers.index('分类') if '分类' in headers else -1
    except ValueError as e:
        print(f"表头字段缺失: {e}")
        return

    candidates = []
    # 收集行
    for i, row in enumerate(rows[header_idx + 1:], start=header_idx + 2):
        if not row: continue
        while len(row) <= max(status_idx, cover_idx, baidu_idx, category_idx if category_idx > -1 else 0):
            row.append("")

        title = extract_feishu_cell_text(row[title_idx])
        cover = extract_feishu_cell_text(row[cover_idx])
        baidu = extract_feishu_cell_text(row[baidu_idx])
        status = extract_feishu_cell_text(row[status_idx])
        category = extract_feishu_cell_text(row[category_idx]) if category_idx > -1 else "小说文学" # 默认武侠或者分类

        # 百度非空，且状态不等于1
        if baidu and status not in ("1", "1.0", 1):
            candidates.append({
                "row_num": i,
                "title": title,
                "cover": cover,
                "baidu": baidu,
                "status": status,
                "category": category,
            })

    print(f"在飞书中挑出未处理记录（符合要求）：{len(candidates)} 条")
    if not candidates: return

    # 2. 与网站数据防重复比对
    existing_titles = get_existing_titles()
    new_candidates = []

    for c in candidates:
        clean = clean_title(c['title'])
        if clean in existing_titles or c['title'] in existing_titles:
            print(f"  [跳过-已存在] {c['title']}")
            continue
        search_name = get_search_name(c['title'])
        found = False
        for et in existing_titles:
            if search_name and len(search_name) >= 3 and search_name in et:
                print(f"  [跳过-极为相似] {c['title']} ≈ {et}")
                found = True
                break
        if not found:
            new_candidates.append(c)

    print(f"实际进入爬取与新增流程：{len(new_candidates)} 本书")
    if not new_candidates: return

    # 3. 豆瓣信息聚合
    next_id = get_next_id()
    entries = []
    successful_feishu_rows = []

    for idx, c in enumerate(new_candidates):
        title = clean_title(c['title'])
        print(f"\n[{idx+1}/{len(new_candidates)}] 获取并组装：{title}")

        douban_info = search_douban(title)
        time.sleep(1.5)

        author = douban_info.get('author', '未知编著') if douban_info else '未知'
        author_detail = douban_info.get('authorDetail', '暂无作者说明。') if douban_info else '本书暂无作者与简介信息。'
        year = douban_info.get('year', '2024') if douban_info else '2000'
        description = douban_info.get('description', title) if douban_info else (c.get('desc', title))

        download_links = []
        parsed = parse_baidu_link(c['baidu'])
        if parsed['url']:
            download_links.append(parsed)
            # 只有抓取到了合法的百度链接才认为它是能建库的好数据
            entry = {
                "id": next_id,
                "title": title,
                "author": author,
                "authorDetail": author_detail,
                "year": year,
                "cover": c['cover'] or "/default-cover.svg",
                "description": description,
                "category": c['category'],  # 发布表可能没有分类，上方已给定默认
                "downloadLinks": download_links,
                "size": "未知",
                "format": "PDF/EPUB/MOBI",
                "publishYear": year,
            }
            entries.append(entry)
            successful_feishu_rows.append(c["row_num"])
            print(f"    入编成功 -> ID: {next_id} 作者: {author} | 链接: {parsed['url']}")
            next_id += 1
        else:
            print(f"    未能在记录中解析出合法链接结构，舍弃。原数据：{c['baidu'][:30]}")

    if not entries:
        print("\n最终无可入库条目。")
        return

    # 4. 落地 `mockData.ts` 和 `sitemap.xml`
    print(f"\n[写入阶段] 写入 {len(entries)} 条组装数据入库...")
    if insert_books_to_mockdata(entries):
        print("  - mockData.ts (网站数据源): 更新成功 ✅")
    else:
        print("  - mockData.ts: 写入异常 ❌")
        return

    book_ids = [e['id'] for e in entries]
    if update_sitemap(book_ids):
        print("  - sitemap.xml: 追加路由节点成功 ✅")
    else:
        print("  - sitemap.xml: 失败 ❌")

    # 5. 反手更新飞书 `状态` 为 1
    print("\n[状态回写阶段] 给飞书打标...")
    update_feishu_status(token, obj_token, sheet_id, successful_feishu_rows)

if __name__ == "__main__":
    main()
