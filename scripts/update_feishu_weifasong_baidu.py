#!/usr/bin/env python3
"""更新飞书'未发送'sheet的F列下载链接"""
import requests

APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 用户提供的百度网盘数据
raw_data = """
【超级会员V9】通过百度网盘分享的文件：史记（全十册）.pdf
链接：https://pan.baidu.com/s/1AwIArTZb9geFsCzRQC8fRg?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：鲁迅全集.epub
链接：https://pan.baidu.com/s/1vW6-X7lJdaFxmMPZpjbAEw?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：费恩曼物理学讲义.epub
链接：https://pan.baidu.com/s/1eE1iE41Ssq02ACgIO8g4yg?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：塔希里亚故事集(1-9).zip
链接：https://pan.baidu.com/s/1H9JcDGGXLYDo1zwdDZi-Hg?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：南京浩劫.epub
链接：https://pan.baidu.com/s/18V3uckOswOi10E4Nx9Derw?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：王小波全集.epub
链接：https://pan.baidu.com/s/1Y7eYpXaYwgkY1mYPtlBY0Q?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：牛津高阶英汉双解词典(第9版).pdf
链接：https://pan.baidu.com/s/142Nqfdoa1EW3PP8XC1ZeRQ?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：算法导论（原书第3版）.pdf
链接：https://pan.baidu.com/s/1v6tbcEBVpXFhSqkgNvi2pA?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：银河英雄传说.epub
链接：https://pan.baidu.com/s/1iuFEerub_GNacfZkx5_heQ?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：基督山伯爵(上下).epub
链接：https://pan.baidu.com/s/1is5aumq9d5WrNDzNn3xs_A?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：中国少年儿童百科全书.pdf
链接：https://pan.baidu.com/s/1Tfwqj1eB_oqaUoZfxpMaHg?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：哥德尔、艾舍尔、巴赫.epub
链接：https://pan.baidu.com/s/1FXXy1LJkxTWj28gQ8ny0Ew?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：风与树的歌.epub
链接：https://pan.baidu.com/s/1V0i7b9im9scnsX2RmeGMdw?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：文学回忆录.epub
链接：https://pan.baidu.com/s/1s1U9ndxDfbCezp9Kbvl6XQ?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：C程序设计语言.pdf
链接：https://pan.baidu.com/s/1V4MB3KynIm66cRC4SlC2Kg?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：我在伊朗长大.epub
链接：https://pan.baidu.com/s/1ugG4pcBWBFVOjo658Zb3zw?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：资治通鉴(套装全12册).pdf
链接：https://pan.baidu.com/s/1pnzGSRrzE9dsZqFJ881XmQ?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：唐诗三百首.epub
链接：https://pan.baidu.com/s/1-OQy4MUBR9-CnXpYYQcKNQ?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：滚蛋吧!肿瘤君.epub
链接：https://pan.baidu.com/s/1UVkdumf-TQIeKj32e2bJzA?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：卡尔维诺文集.epub
链接：https://pan.baidu.com/s/1GS3KlGvF3JLWKqTulY_hOA?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：百年孤独.epub
链接：https://pan.baidu.com/s/1xkc37S8zJtRpFt5ZFEu1Jw?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：猫城小事.epub
链接：https://pan.baidu.com/s/1cor4hdDWzJafIN4pwq521Q?pwd=0000
提取码：0000

【超级会员V9】通过百度网盘分享的文件：道德经.epub
链接：https://pan.baidu.com/s/1XToLrGshU0Z7_BBSDujF9w?pwd=0000
提取码：0000
"""

def get_tenant_access_token():
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    payload = {"app_id": APP_ID, "app_secret": APP_SECRET}
    response = requests.post(url, json=payload)
    return response.json()["tenant_access_token"]

def get_sheet_id(token, sheet_name="未发布"):
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/metainfo"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    data = response.json()
    for sheet in data["data"]["sheets"]:
        if sheet["title"] == sheet_name:
            return sheet["sheetId"]
    raise Exception(f"未找到名为 '{sheet_name}' 的 sheet")

def read_sheet_data(token, sheet_id):
    """读取表格数据 A:H"""
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values/{sheet_id}!A:H"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    return response.json()

def update_cell(token, sheet_id, row_num, col, value):
    """更新单个单元格"""
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    range_str = f"{sheet_id}!{col}{row_num}:{col}{row_num}"
    payload = {
        "valueRange": {
            "range": range_str,
            "values": [[value]]
        }
    }
    response = requests.put(url, headers=headers, json=payload)
    return response.json()

def parse_book_links():
    """解析用户提供的百度网盘链接"""
    book_links_map = {}
    blocks = raw_data.strip().split('\n\n')
    for block in blocks:
        lines = block.split('\n')
        name = ""
        link = ""
        for line in lines:
            if "分享的文件：" in line:
                full_name = line.split("分享的文件：")[1].strip()
                # 去掉后缀
                name = full_name.split('.')[0].split('_')[0]
            elif line.startswith("链接："):
                link = line.replace("链接：", "").strip()
        if name and link:
            book_links_map[name] = link
    return book_links_map

def main():
    print("=" * 60)
    print("开始更新飞书'未发布'sheet的F列下载链接")
    print("=" * 60)

    # 解析百度网盘数据
    book_links_map = parse_book_links()
    print(f"\n解析到 {len(book_links_map)} 个百度网盘链接:")
    for name, link in book_links_map.items():
        print(f"  - {name}")

    # 获取token
    token = get_tenant_access_token()
    print(f"\n获取token成功")

    # 获取sheet ID
    try:
        sheet_id = get_sheet_id(token, "未发布")
        print(f"找到'未发布'sheet, ID: {sheet_id}")
    except Exception as e:
        print(f"错误: {e}")
        return

    # 读取表格数据
    data = read_sheet_data(token, sheet_id)
    if data.get("code") != 0:
        print(f"读取表格失败: {data}")
        return

    rows = data.get("data", {}).get("valueRange", {}).get("values", [])
    print(f"表格共有 {len(rows)} 行数据")

    # 匹配并更新
    matched = 0
    unmatched_sheet = []

    for idx, row in enumerate(rows):
        if not row or len(row) < 1:
            continue
        # 获取书名（假设在A列）
        title = row[0]
        if not title:
            continue
        title = str(title).strip()

        # 尝试匹配
        matched_link = None
        for book_name, link in book_links_map.items():
            # 模糊匹配：书名包含或被包含
            if book_name in title or title in book_name:
                matched_link = link
                break

        if matched_link:
            row_num = idx + 1  # 飞书行号从1开始
            # 构建富文本格式
            cell_items = [
                {"type": "text", "text": "百度网盘: "},
                {"type": "url", "text": matched_link, "link": matched_link},
                {"type": "text", "text": " (密码: 0000)"}
            ]

            result = update_cell(token, sheet_id, row_num, "F", cell_items)
            if result.get("code") == 0:
                print(f"✅ 更新成功: {title} -> {matched_link[:50]}...")
                matched += 1
            else:
                print(f"❌ 更新失败: {title}, 错误: {result}")
        else:
            unmatched_sheet.append(title)

    print(f"\n" + "=" * 60)
    print(f"更新完成！成功: {matched} 本, 失败: {len(unmatched_sheet)} 本")
    print("=" * 60)

    if unmatched_sheet:
        print(f"\n飞书表格中未匹配的书籍 ({len(unmatched_sheet)} 本):")
        for t in unmatched_sheet[:20]:  # 只显示前20个
            print(f"  - {t}")
        if len(unmatched_sheet) > 20:
            print(f"  ... 还有 {len(unmatched_sheet) - 20} 本")

if __name__ == "__main__":
    main()