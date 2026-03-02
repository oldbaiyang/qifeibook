#!/usr/bin/env python3
"""
从飞书表格读取待同步书籍，丰富元数据后写入网站
1. 读取飞书表格：百度网盘列不为空 且 状态 != 1
2. 从豆瓣搜索补充作者、简介
3. 写入 data/mockData.ts
4. 更新 public/sitemap.xml
注意：本脚本只读取飞书表格，不修改飞书数据
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
from lib.feishu_client import FeishuClient

# Configuration
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://book.douban.com/',
}

PROJECT_ROOT = Path(__file__).parent.parent
MOCKDATA_PATH = PROJECT_ROOT / "data" / "mockData.ts"
SITEMAP_PATH = PROJECT_ROOT / "public" / "sitemap.xml"

# 分类映射
CATEGORY_MAP = {
    "历史": "历史人文",
    "人文": "历史人文",
    "传记": "历史人文",
    "科幻": "科幻奇幻",
    "奇幻": "科幻奇幻",
    "悬疑": "悬疑推理",
    "推理": "悬疑推理",
    "心理": "人文社科",
    "哲学": "人文社科",
    "社科": "人文社科",
    "教育": "人文社科",
    "政治": "人文社科",
    "经济": "经济管理",
    "经管": "经济管理",
    "商业": "经济管理",
    "管理": "经济管理",
    "科普": "科普知识",
    "科学": "科普知识",
    "励志": "励志成功",
    "成长": "励志成功",
    "散文": "小说文学",
    "诗歌": "小说文学",
    "小说": "小说文学",
    "文学": "小说文学",
    "儿童": "少儿读物",
    "童话": "少儿读物",
    "绘本": "少儿读物",
    "漫画": "少儿读物",
    "少儿": "少儿读物",
}


def clean_title(title: str) -> str:
    """清理书名，去掉当当营销文字"""
    # 去掉各种营销后缀
    clean = title
    for sep in ['【', '专供', '附赠', '赠', '当当', '自营', '印签', '签名',
                '限量', '亲签', '特签', '包邮', '人民教育出版社', '推荐名著',
                '初中语文', '课外阅读', '升级版', '名著阅读', '原著正版',
                '快乐读书吧', '爱阅读', '金波', '张抗抗']:
        idx = clean.find(sep)
        if idx > 3:  # 保留至少3个字符的标题
            clean = clean[:idx]

    # 去掉末尾标点符号
    clean = clean.rstrip(' ,，.。!！…')
    return clean.strip()


def get_search_name(title: str) -> str:
    """获取用于豆瓣搜索的精简书名"""
    clean = clean_title(title)
    # 进一步精简：去掉册/版/篇等后缀
    clean = re.sub(r'[\s]*[（(].*?[)）]', '', clean)
    clean = re.sub(r'\s*(全[二三四五六七八九十\d]+[册部卷]|套装|修订版|纪念版|精装|平装).*$', '', clean)
    clean = re.sub(r'\d+册.*$', '', clean)
    # 如果书名太长，截取前面部分
    if len(clean) > 15:
        # 尝试在常见分隔符处截断
        for sep in [' ', '：', ':', '·', '—', '　']:
            idx = clean.find(sep)
            if 2 < idx < 15:
                clean = clean[:idx]
                break
        else:
            clean = clean[:15]
    return clean.strip()


def search_douban(title: str) -> Optional[Dict]:
    """从豆瓣搜索书籍信息"""
    search_name = get_search_name(title)
    if not search_name or len(search_name) < 2:
        return None

    search_url = f"https://www.douban.com/search?cat=1001&q={quote(search_name)}"
    print(f"    搜索豆瓣: {search_name}")

    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            print(f"    搜索失败: HTTP {resp.status_code}")
            return None

        text = resp.text

        # 提取第一个搜索结果的详情页链接
        detail_match = re.search(r'href="(https://book\.douban\.com/subject/\d+/?)"', text)
        if not detail_match:
            print("    豆瓣未找到结果")
            return None

        detail_url = detail_match.group(1)
        time.sleep(1)

        # 访问详情页获取丰富信息
        detail_resp = requests.get(detail_url, headers=HEADERS, timeout=10)
        if detail_resp.status_code != 200:
            return None

        detail = detail_resp.text

        info = {}

        # 提取作者
        author_match = re.search(r'<span>\s*作者</span>.*?<a[^>]*>(.*?)</a>', detail, re.DOTALL)
        if author_match:
            info['author'] = re.sub(r'<[^>]+>', '', author_match.group(1)).strip()
            info['author'] = re.sub(r'\s+', ' ', info['author'])

        # 备用：从 #info 区块提取
        if not info.get('author'):
            author_match2 = re.search(r'作者.*?<a[^>]*>\s*(.*?)\s*</a>', detail, re.DOTALL)
            if author_match2:
                info['author'] = re.sub(r'<[^>]+>', '', author_match2.group(1)).strip()

        # 提取出版年
        year_match = re.search(r'出版年:\s*</span>\s*([\d-]+)', detail)
        if year_match:
            info['year'] = year_match.group(1).strip()[:4]

        # 提取简介 - 从 intro 区块
        # 优先获取完整简介（展开后的）
        desc_match = re.search(r'class="all hidden"[^>]*>\s*<div class="intro">\s*(.*?)\s*</div>', detail, re.DOTALL)
        if not desc_match:
            desc_match = re.search(r'<div id="link-report"[^>]*>.*?<div class="intro">\s*(.*?)\s*</div>', detail, re.DOTALL)
        if desc_match:
            desc_html = desc_match.group(1)
            # 去掉 HTML 标签
            desc = re.sub(r'<[^>]+>', '', desc_html)
            desc = re.sub(r'\s+', ' ', desc).strip()
            # 截取合理长度
            if len(desc) > 500:
                desc = desc[:497] + '...'
            info['description'] = desc

        # 提取作者简介
        author_intro_match = re.search(
            r'<span[^>]*>作者简介.*?</span>.*?<div class="intro">\s*(.*?)\s*</div>',
            detail, re.DOTALL
        )
        if author_intro_match:
            author_intro = re.sub(r'<[^>]+>', '', author_intro_match.group(1))
            author_intro = re.sub(r'\s+', ' ', author_intro).strip()
            if len(author_intro) > 200:
                author_intro = author_intro[:197] + '...'
            info['authorDetail'] = author_intro

        # 提取豆瓣标签作为分类参考
        tags = re.findall(r'<a href="/tag/[^"]*">(.*?)</a>', detail)
        if tags:
            info['tags'] = [t.strip() for t in tags[:5]]

        return info if info else None

    except Exception as e:
        print(f"    搜索异常: {e}")
        return None


def map_category(feishu_category: str, douban_tags: List[str] = None) -> str:
    """映射分类"""
    # 优先用飞书分类
    if feishu_category:
        for keyword, category in CATEGORY_MAP.items():
            if keyword in feishu_category:
                return category

    # 豆瓣标签作为候选
    if douban_tags:
        for tag in douban_tags:
            for keyword, category in CATEGORY_MAP.items():
                if keyword in tag:
                    return category

    return "小说文学"


def parse_baidu_link(link_text: str) -> Dict:
    """解析百度网盘链接，提取 URL 和提取码"""
    result = {"name": "百度网盘", "url": "", "code": "0000"}

    # 匹配链接
    url_match = re.search(r'(https?://pan\.baidu\.com/s/\S+?)[\s,，]', link_text + ' ')
    if url_match:
        result['url'] = url_match.group(1).rstrip('?')

    # 匹配提取码
    code_match = re.search(r'提取码[：:]\s*(\w+)', link_text)
    if code_match:
        result['code'] = code_match.group(1)

    return result


def parse_quark_link(link_text: str) -> Optional[Dict]:
    """解析夸克网盘链接"""
    url_match = re.search(r'(https?://pan\.quark\.cn/s/\S+?)[\s,，\]）)]', link_text + ' ')
    if url_match:
        return {"name": "夸克网盘", "url": url_match.group(1)}
    return None


def get_next_id() -> int:
    """获取下一个可用的 book ID"""
    content = MOCKDATA_PATH.read_text(encoding='utf-8')
    ids = re.findall(r'"id":\s*(\d+)', content)
    if not ids:
        ids = re.findall(r'id:\s*(\d+)', content)
    if ids:
        return max(int(i) for i in ids) + 1
    return 284


def get_existing_titles() -> Set[str]:
    """获取 mockData.ts 中已有的书名"""
    content = MOCKDATA_PATH.read_text(encoding='utf-8')
    titles = set()
    for m in re.finditer(r'(?:"title"|title):\s*["`\'](.+?)["`\']', content):
        titles.add(m.group(1).strip())
    return titles


def insert_books_to_mockdata(entries: List[Dict]) -> bool:
    """将书籍条目插入 mockData.ts"""
    content = MOCKDATA_PATH.read_text(encoding='utf-8')

    # 找到最后的 ]; 位置
    last_bracket = content.rfind('];')
    if last_bracket == -1:
        print("错误: 找不到 mockData.ts 中的 ];")
        return False

    # 格式化条目（与 sync_to_website.js 保持一致）
    formatted = []
    for entry in entries:
        json_str = json.dumps(entry, ensure_ascii=False, indent=2)
        # 每行缩进2空格
        indented = "  " + json_str.replace('\n', '\n  ')
        formatted.append(indented + ",")

    insert_text = '\n'.join(formatted) + '\n'
    new_content = content[:last_bracket] + insert_text + content[last_bracket:]

    MOCKDATA_PATH.write_text(new_content, encoding='utf-8')
    return True


def update_sitemap(book_ids: List[int]) -> bool:
    """更新 sitemap.xml"""
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

    # 插入到 </urlset> 之前
    close_tag = '</urlset>'
    idx = content.rfind(close_tag)
    if idx == -1:
        print("错误: 找不到 sitemap.xml 中的 </urlset>")
        return False

    new_content = content[:idx] + insert_text + content[idx:]
    SITEMAP_PATH.write_text(new_content, encoding='utf-8')
    return True


def main():
    print("=" * 60)
    print("飞书表格 → 网站同步脚本")
    print("（只读飞书数据，不修改飞书状态）")
    print("=" * 60)

    feishu = FeishuClient(APP_ID, APP_SECRET, WIKI_TOKEN)

    # 1. 读取飞书表格
    print("\n[步骤1] 读取飞书表格...")
    values = feishu.read_values("A1:F5000")
    if not values:
        print("无法读取飞书表格")
        return

    # 表头: A=书名, B=封面, C=夸克网盘, D=百度网盘, E=状态, F=分类
    # 找出百度网盘不为空 且 状态 != 1 的行
    candidates = []
    for i, row in enumerate(values):
        if i == 0:  # 跳过表头
            continue
        if len(row) < 4:
            continue

        title = feishu.extract_text(row[0]) if row[0] else ""
        cover = feishu.extract_text(row[1]) if len(row) > 1 and row[1] else ""
        quark = feishu.extract_text(row[2]) if len(row) > 2 and row[2] else ""
        baidu = feishu.extract_text(row[3]) if len(row) > 3 and row[3] else ""
        status = str(row[4]).strip() if len(row) > 4 and row[4] is not None else ""
        category = feishu.extract_text(row[5]) if len(row) > 5 and row[5] else ""

        # 条件: 百度网盘不为空 且 状态不为1
        if baidu and status not in ("1", "1.0"):
            candidates.append({
                "row": i + 1,
                "title": title,
                "cover": cover,
                "quark": quark,
                "baidu": baidu,
                "status": status,
                "category": category,
            })

    print(f"符合条件的书籍: {len(candidates)} 本")
    if not candidates:
        print("没有需要同步的书籍")
        return

    # 2. 与 mockData.ts 去重
    print("\n[步骤2] 与网站已有书籍去重...")
    existing_titles = get_existing_titles()
    print(f"网站已有 {len(existing_titles)} 本书")

    new_candidates = []
    for c in candidates:
        clean = clean_title(c['title'])
        # 检查清理后的书名或原书名是否已存在
        if clean in existing_titles or c['title'] in existing_titles:
            print(f"  [跳过-已存在] {c['title']}")
            continue
        # 还检查搜索名是否匹配（模糊去重）
        search_name = get_search_name(c['title'])
        found = False
        for et in existing_titles:
            if search_name and len(search_name) >= 3 and search_name in et:
                print(f"  [跳过-相似] {c['title']} ≈ {et}")
                found = True
                break
        if not found:
            new_candidates.append(c)

    print(f"去重后剩余: {len(new_candidates)} 本新书")
    if not new_candidates:
        print("没有新书需要添加")
        return

    for c in new_candidates:
        print(f"  - {c['title']}")

    # 3. 从豆瓣搜索补充元数据
    print(f"\n[步骤3] 从豆瓣搜索补充作者和简介...")
    next_id = get_next_id()
    entries = []

    for idx, c in enumerate(new_candidates):
        title = clean_title(c['title'])
        print(f"\n  [{idx+1}/{len(new_candidates)}] {title}")

        # 搜索豆瓣
        douban_info = search_douban(title)
        time.sleep(2)  # 避免被封

        author = "未知"
        author_detail = "暂无作者详情"
        year = "2024"
        description = title
        tags = []

        if douban_info:
            author = douban_info.get('author', '未知') or '未知'
            author_detail = douban_info.get('authorDetail', '暂无作者详情') or '暂无作者详情'
            year = douban_info.get('year', '2024') or '2024'
            description = douban_info.get('description', title) or title
            tags = douban_info.get('tags', [])
            print(f"    作者: {author}")
            print(f"    年份: {year}")
            print(f"    简介: {description[:60]}...")
        else:
            print(f"    未找到豆瓣信息，使用默认值")

        # 映射分类
        category = map_category(c['category'], tags)

        # 构建下载链接
        download_links = []
        if c['quark']:
            quark_link = parse_quark_link(c['quark'])
            if quark_link:
                download_links.append(quark_link)

        baidu_link = parse_baidu_link(c['baidu'])
        if baidu_link['url']:
            download_links.append(baidu_link)

        if not download_links:
            print(f"    没有有效的下载链接，跳过")
            continue

        # 构建书籍条目
        entry = {
            "id": next_id,
            "title": title,
            "author": author,
            "authorDetail": author_detail,
            "year": year,
            "cover": c['cover'] or "/default-cover.svg",
            "description": description,
            "category": category,
            "downloadLinks": download_links,
            "size": "未知",
            "format": "EPUB",
            "publishYear": year,
        }

        entries.append(entry)
        print(f"    -> ID {next_id}, 分类: {category}")
        next_id += 1

    if not entries:
        print("\n没有有效条目可以添加")
        return

    # 4. 写入 mockData.ts
    print(f"\n[步骤4] 写入 data/mockData.ts ({len(entries)} 本)...")
    if insert_books_to_mockdata(entries):
        print("  写入成功")
    else:
        print("  写入失败")
        return

    # 5. 更新 sitemap.xml
    print(f"\n[步骤5] 更新 public/sitemap.xml...")
    book_ids = [e['id'] for e in entries]
    if update_sitemap(book_ids):
        print(f"  添加了 {len(book_ids)} 个 URL")
    else:
        print("  更新失败")

    # 6. 汇总
    print("\n" + "=" * 60)
    print(f"完成！共添加 {len(entries)} 本新书到网站")
    print(f"ID 范围: {entries[0]['id']} - {entries[-1]['id']}")
    print(f"（飞书表格状态未修改，需要手动或另行更新）")
    print("=" * 60)
    print("\n添加的书籍:")
    for e in entries:
        print(f"  ID {e['id']}: {e['title']} - {e['author']} [{e['category']}]")


if __name__ == "__main__":
    main()
