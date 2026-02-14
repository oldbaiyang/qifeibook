#!/usr/bin/env python3
"""
从飞书文档同步新书籍到网站（只读模式）
"""
import requests
import re
import json
from pathlib import Path
from datetime import datetime

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 本地文件路径
MOCK_DATA_PATH = Path("data/mockData.ts")
SITEMAP_PATH = Path("public/sitemap.xml")

# 书籍补充信息
BOOK_ENRICHMENT = {
    "黄色墙纸": {
        "author": "[美] 夏洛特·珀金斯·吉尔曼",
        "authorDetail": "夏洛特·珀金斯·吉尔曼，美国著名女作家、女性主义先驱",
        "year": "1892",
        "description": "收录吉尔曼创作生涯中最具代表性的短篇小说，包括其名篇《黄色墙纸》。这部作品以细腻的笔触描绘了19世纪末女性的处境，成为女性主义文学的经典之作。"
    },
    "哲学家的最后一课": {
        "author": "朱锐",
        "authorDetail": "朱锐，中国人民大学哲学院教授，哲学家",
        "year": "2024",
        "description": "当医学宣布仅剩数十天生命时，哲学家朱锐选择以课堂的方式完成最后的思辨。本书记录了他在生命最后阶段对死亡、意义和哲学的深入思考，是一本关于如何面对终点的深刻之作。"
    },
    "父亲的解放日志": {
        "author": "[韩] 郑智我",
        "authorDetail": "郑智我，韩国新生代作家，获李箱文学奖",
        "year": "2025",
        "description": "一部关于父女关系、意识形态与个人命运的小说。故事背景设定在80年代韩国，通过女儿的视角展开对父亲理想主义与现实之间冲突的审视，探讨了历史的复杂性。"
    },
    "世界在前进": {
        "author": "[匈牙利] 克拉斯诺霍尔卡伊·拉斯洛",
        "authorDetail": "拉斯洛，匈牙利当代最伟大的作家之一，2025年诺贝尔文学奖得主",
        "year": "2025",
        "description": "匈牙利作家克拉斯诺霍尔卡伊·拉斯洛的最新短篇小说集，收录了他近年来的最新创作。作品以其独特的叙事风格和深刻的思想性著称，描绘了一个荒诞而真实的文学世界。"
    },
    "人生解忧": {
        "author": "成庆",
        "authorDetail": "成庆，上海大学历史系副教授，佛学研究者",
        "year": "2024",
        "description": "一部面向现代人的佛学入门著作。作者以清晰易懂的语言，系统讲解佛学核心思想，帮助读者在焦虑的时代找到内心的安宁与智慧。"
    },
    "我是寨子里长大的女孩": {
        "author": "扎十一惹",
        "authorDetail": "扎十一惹，90后彝族作家",
        "year": "2025",
        "description": "作者以温暖的笔触记录了自己在云南高寒山区寨子里的成长经历。这本书不仅是个人记忆，更是一个关于文化认同、家庭关系和现代转型的深刻故事。"
    },
    "玫瑰朝上": {
        "author": "[巴勒斯坦] 莫萨布·阿布·托哈",
        "authorDetail": "莫萨布·阿布·托哈，90后巴勒斯坦诗人，2025年普利策评论奖得主",
        "year": "2025",
        "description": "来自加沙的诗集，作者以诗歌记录废墟中的坚韧与希望。在战火与封锁中，诗笔成为了抵抗与存在的方式，展现了巴勒斯坦人民的生命力。"
    },
    "即使以最微弱的光": {
        "author": "[韩] 崔恩荣",
        "authorDetail": "崔恩荣，韩国作家，获李箱文学奖",
        "year": "2025",
        "description": "韩国作家崔恩荣的短篇小说集，收录了七篇作品。每个故事既独立又相互关联，以温柔的笔触探讨人与人之间的羁绊、孤独与救赎。"
    },
    "要有光": {
        "author": "梁鸿",
        "authorDetail": "梁鸿，著名非虚构作家，代表作为'梁庄三部曲'",
        "year": "2024",
        "description": "梁鸿最新非虚构作品，关注那些被困住的少年。通过田野调查和深度访谈，记录了当代中国青少年的困境与挣扎，是一部具有社会关怀的纪实之作。"
    },
    "太阳的阴影": {
        "author": "[波兰] 雷沙德·卡普钦斯基",
        "authorDetail": "雷沙德·卡普钦斯基，波兰著名记者，作家",
        "year": "2025",
        "description": "一部深入非洲的纪实作品。作者记录了在非洲大陆三十余年的记者生涯，描绘了一个复杂而真实的非洲，远离了西方媒体常见的刻板印象。"
    },
    "安史之乱": {
        "author": "张诗坪、胡可奇",
        "authorDetail": "张诗坪、胡可奇，青年历史学者",
        "year": "2025",
        "description": "深入剖析安史之乱这一唐朝转折点。通过40幅战略示意图复盘决战全貌，不仅关注战役细节，更通过财政、粮食、后勤视角解构军政博弈。"
    },
    "格外的活法": {
        "author": "[日] 吉井忍",
        "authorDetail": "吉井忍，日本作家，长期在中国生活",
        "year": "2024",
        "description": "作者走进日本的大街小巷，历时七年采访各行各业的人，记录了12种主流秩序外的'格外'活法。这些不走寻常路的人们，展现了另一种生活可能性的探索。"
    },
    "弃长安": {
        "author": "张明扬",
        "authorDetail": "张明扬，著名历史作家，代表作《入关》",
        "year": "2022",
        "description": "聚焦于安史之乱中决定唐帝国命运的关键决策——弃守长安。作者深度挖掘人性冲突与政治博弈，展现了盛世转瞬即逝的悲剧色彩与历史的冷酷逻辑。"
    },
    "南明史": {
        "author": "顾诚",
        "authorDetail": "顾诚，北京师范大学历史系教授，明清史专家",
        "year": "1997",
        "description": "中国近代史领域的'天花板'级别著作。顾诚先生以极其严谨的史料考证，推翻了许多传统成见，深入分析了南明政权内部的权力斗争。"
    },
}

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
    return resp.json()["data"]["node"]["obj_token"]

def get_sheet_id(access_token, spreadsheet_token):
    """获取第一个工作表ID"""
    url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/query"
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    return resp.json()["data"]["sheets"][0]["sheet_id"]

def extract_text(cell):
    """提取单元格文本"""
    if not cell:
        return ""
    if isinstance(cell, str):
        return cell.strip()
    if isinstance(cell, dict):
        if "link" in cell:
            return cell.get("link", "").strip()
        if "text" in cell:
            return cell.get("text", "").strip()
        if "user" in cell:
            return cell.get("user", {}).get("name", "").strip()
        return str(cell).strip()
    if isinstance(cell, list):
        result = ""
        for c in cell:
            result += extract_text(c)
        return result.strip()
    return str(cell).strip()

def read_existing_books():
    """读取现有的书籍ID"""
    try:
        with open(MOCK_DATA_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            # 匹配 "id": 123 格式（带引号）
            matches = re.findall(r'"id":\s*(\d+)', content)
            return set(int(m) for m in matches)
    except:
        return set()

def read_existing_titles():
    """读取现有的书籍标题"""
    try:
        with open(MOCK_DATA_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            title_matches = re.findall(r'"title":\s*"([^"]+)"', content)
            return set(matches[1] for matches in title_matches)
    except:
        return set()

def sync_new_books():
    """同步新书籍到网站"""
    print("=" * 60)
    print("飞书到网站同步工具（只读模式）")
    print("=" * 60)

    # 获取访问令牌
    print("正在获取访问令牌...")
    token = get_access_token()
    if not token:
        print("获取访问令牌失败!")
        return
    print("✓ 获取访问令牌成功")

    # 获取表格和工作表ID
    print("正在获取表格信息...")
    spreadsheet_token = get_spreadsheet_token(token)
    sheet_id = get_sheet_id(token, spreadsheet_token)

    print(f"表格ID: {spreadsheet_token}")
    print(f"工作表ID: {sheet_id}")

    # 读取表格数据
    print("正在读取表格数据...")
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values/{sheet_id}!A1:Z2000"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(read_url, headers=headers)

    if resp.status_code != 200:
        print(f"读取表格失败: {resp.json()}")
        return

    values = resp.json().get('data', {}).get('valueRange', {}).get('values', [])
    if not values:
        print("表格为空!")
        return

    print(f"✓ 读取到 {len(values)} 行数据")

    # 解析表头
    header = values[0]
    book_name_idx = header.index('书名') if '书名' in header else 0
    cover_idx = header.index('封面图') if '封面图' in header else 1
    quark_idx = header.index('夸克网盘') if '夸克网盘' in header else 2
    baidu_idx = header.index('百度网盘') if '百度网盘' in header else 3
    status_idx = header.index('状态') if '状态' in header else 4
    category_idx = header.index('分类') if '分类' in header else 5

    print(f"\n书名列索引: {book_name_idx}, 封面图索引: {cover_idx}")
    print(f"夸克网盘列索引: {quark_idx}, 百度网盘列索引: {baidu_idx}")
    print(f"状态列索引: {status_idx}, 分类列索引: {category_idx}")

    # 读取现有书籍ID和标题
    existing_ids = read_existing_books()
    existing_titles = read_existing_titles()

    print(f"\n现有书籍数: {len(existing_titles)}")

    # 筛选需要新增的书籍（夸克或百度不为空，状态不为1）
    new_books = []
    row_indices = []

    for row_idx, row in enumerate(values[1:], start=2):  # 从第2行开始（第1行是表头）
        if len(row) <= max(book_name_idx, status_idx, quark_idx, baidu_idx):
            continue

        book_name = extract_text(row[book_name_idx])
        if not book_name:
            continue

        # 检查是否已存在
        if book_name in existing_titles:
            continue

        # 检查状态
        status = extract_text(row[status_idx])
        if status == "1":
            continue

        # 检查是否有网盘链接
        quark = extract_text(row[quark_idx])
        baidu = extract_text(row[baidu_idx])

        if not quark and not baidu:
            continue

        # 获取封面
        cover = extract_text(row[cover_idx])

        # 获取分类
        category = extract_text(row[category_idx]) if len(row) > category_idx else "小说文学"

        new_books.append({
            "rowIndex": row_idx,
            "title": book_name,
            "cover": cover,
            "quark": quark,
            "baidu": baidu,
            "category": category
        })
        row_indices.append(row_idx)

    print(f"\n找到 {len(new_books)} 本待新增书籍")

    if not new_books:
        print("没有需要新增的书籍")
        return

    # 生成书籍条目
    entries = []
    next_id = max(existing_ids) + 1 if existing_ids else 1

    for book in new_books:
        # 获取作者和简介
        enrichment = BOOK_ENRICHMENT.get(book['title'], {})
        author = enrichment.get("author", "未知")
        author_detail = enrichment.get("authorDetail", "暂无详情")
        year = enrichment.get("year", "2024")
        description = enrichment.get("description", book['title'])

        # 映射分类
        category_mapping = {
            "小说文学": "小说文学",
            "历史传记": "历史传记",
            "人文社科": "人文社科",
            "科幻奇幻": "科幻奇幻",
            "诗歌": "诗歌",
        }
        mapped_category = category_mapping.get(book['category'], "小说文学")

        # 构造下载链接
        download_links = []
        if book['quark']:
            download_links.append({"name": "夸克网盘", "url": book['quark']})
        if book['baidu']:
            # 分离URL和提取码
            parts = book['baidu'].split('提取码:')
            url = parts[0].strip() if parts else book['baidu']
            code = parts[1].strip() if len(parts) > 1 else "0000"
            download_links.append({"name": "百度网盘", "url": url, "code": code})

        # 获取文件格式
        file_format = "EPUB" if book['title'].endswith('.pdf') is False else "PDF"
        if 'pdf' in book['title'].lower():
            file_format = "PDF"
        else:
            file_format = "EPUB"

        entry = {
            "id": next_id,
            "title": book['title'],
            "author": author,
            "authorDetail": author_detail,
            "year": year,
            "cover": book['cover'] if book['cover'] else "",
            "description": description,
            "category": mapped_category,
            "downloadLinks": download_links,
            "size": "未知",
            "format": file_format,
            "publishYear": year
        }
        entries.append(entry)
        next_id += 1

    # 更新 mockData.ts
    print(f"\n正在更新 {MOCK_DATA_PATH}...")
    with open(MOCK_DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # 找到 books 数组的结束 ]; (不是最后一个 ])
    # 查找 ]; 后面跟着 export const 的位置
    pattern = re.search(r'\];\s*\nexport const', content)
    if pattern:
        # 找到 ]; 的位置，我们需要在 ] 之前插入
        # pattern.start() 指向 ;，所以 bracket_pos = pattern.start() - 1 指向 ]
        bracket_pos = pattern.start() - 1
    else:
        # 如果没找到，回退到原来的方法
        bracket_pos = content.rfind(']')

    if bracket_pos == -1:
        print("无法找到 mockData.ts 的结束位置!")
        return

    # 使用 JSON.stringify 正确格式化
    formatted_entries = []
    for entry in entries:
        json_str = json.dumps(entry, ensure_ascii=False, indent=2)
        # 保留原始缩进（两个空格）
        formatted = "  " + json_str
        formatted_entries.append(formatted + ",")

    # 插入新内容（在 ] 之前插入）
    # 检查前一个字符是否是 }，如果是则需要添加逗号
    prefix = content[:bracket_pos]
    if prefix.strip().endswith('}'):
        # 为最后一本书添加逗号
        prefix = prefix.rstrip() + ',\n'

    new_content = prefix + '\n'.join(formatted_entries) + '\n' + content[bracket_pos:]

    with open(MOCK_DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✓ 已新增 {len(entries)} 本书籍到 {MOCK_DATA_PATH}")

    # 更新 sitemap
    print(f"\n正在更新 {SITEMAP_PATH}...")
    with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
        sitemap = f.read()

    # 生成sitemap条目
    today = datetime.now().strftime('%Y-%m-%d')
    sitemap_entries = []
    for entry in entries:
        sitemap_entries.append(f"  <url>\n    <loc>https://www.qifeibook.com/book/{entry['id']}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>0.8</priority>\n  </url>")

    # 找到 </urlset> 标签
    closing_tag = '</urlset>'
    new_sitemap = sitemap.replace(closing_tag, '\n'.join(sitemap_entries) + '\n' + closing_tag)

    with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
        f.write(new_sitemap)

    print(f"✓ 已更新 sitemap，新增 {len(entries)} 个URL")

    # 更新飞书状态
    print(f"\n正在更新飞书状态...")
    update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values"

    updated_count = 0
    for row_idx in row_indices:
        update_payload = {
            "valueRange": {
                "range": f"{sheet_id}!{chr(65 + status_idx)}{row_idx}:{chr(65 + status_idx)}{row_idx}",
                "values": [["1"]]
            }
        }

        update_resp = requests.put(update_url, json=update_payload, headers=headers)
        if update_resp.status_code == 200:
            data = update_resp.json()
            if data.get("code") == 0:
                print(f"  ✓ 状态更新成功")
                updated_count += 1
            else:
                print(f"  ✗ 状态更新失败: {data}")
        else:
            print(f"  ✗ 状态更新失败 HTTP {update_resp.status_code}")

    print(f"\n✓ 已更新 {updated_count} 个状态为 1")

    print("\n" + "=" * 60)
    print(f"完成! 新增 {len(entries)} 本书")
    print("=" * 60)
    print(f"\n注意: 本次操作仅读取飞书表格数据，未修改飞书表格")

if __name__ == "__main__":
    sync_new_books()
