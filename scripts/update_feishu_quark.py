#!/usr/bin/env python3
"""
更新飞书表格的夸克网盘链接
"""
import requests

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 书名和夸克网盘链接映射
BOOK_QUARK_LINKS = {
    "玫瑰朝上": "https://pan.quark.cn/s/a0766ef3f16b",
    "黄色墙纸": "https://pan.quark.cn/s/484a601b995f",
    "要有光": "https://pan.quark.cn/s/3f7d48725781",
    "格外的活法": "https://pan.quark.cn/s/1f7e97afd7eb",
    "弃长安": "https://pan.quark.cn/s/27cbc7014cb7",
    "我是寨子里长大的女孩": "https://pan.quark.cn/s/75fc6ba1245f",
    "父亲的解放日志": "https://pan.quark.cn/s/26078de1fbb0",
    "安史之乱": "https://pan.quark.cn/s/a844719a8336",
    "南明史": "https://pan.quark.cn/s/bab55d79eb6b",
    "太阳的阴影": "https://pan.quark.cn/s/41477b98ccc7",
    "世界在前进": "https://pan.quark.cn/s/4bccb74e24e0",
    "即使以最微弱的光": "https://pan.quark.cn/s/cc3399e4ed96",
    "哲学家的最后一课": "https://pan.quark.cn/s/0bb296195f28",
    "人生解忧": "https://pan.quark.cn/s/81d9a42f320d",
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

    # 处理字符串
    if isinstance(cell, str):
        return cell.strip()

    # 处理字典（飞书单元格格式）
    if isinstance(cell, dict):
        # 链接类型
        if "link" in cell:
            return cell.get("link", "").strip()
        # 文本类型
        if "text" in cell:
            return cell.get("text", "").strip()
        # 用户类型
        if "user" in cell:
            return cell.get("user", {}).get("name", "").strip()
        return str(cell).strip()

    # 处理列表
    if isinstance(cell, list):
        result = ""
        for c in cell:
            result += extract_text(c)
        return result.strip()

    return str(cell).strip()

def update_quark_links():
    """更新夸克网盘链接"""
    print("=" * 60)
    print("更新飞书表格 - 夸克网盘链接")
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
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values/{sheet_id}!A1:Z500"
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
    quark_idx = header.index('夸克网盘') if '夸克网盘' in header else 2

    print(f"\n书名列索引: {book_name_idx}, 夸克网盘列索引: {quark_idx}")

    # 更新计数
    updated = 0
    not_found = 0
    processed = 0

    # 遍历每一行，查找对应书籍并更新夸克链接
    print("\n开始匹配和更新...")
    for row_idx, row in enumerate(values[1:], start=2):  # 从第2行开始（第1行是表头）
        if len(row) <= book_name_idx:
            continue

        book_name = extract_text(row[book_name_idx])
        if not book_name:
            continue

        processed += 1

        # 查找匹配的夸克链接（精确匹配）
        quark_link = BOOK_QUARK_LINKS.get(book_name)

        if quark_link:
            # 更新夸克网盘列
            update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values"
            update_payload = {
                "valueRange": {
                    "range": f"{sheet_id}!{chr(65 + quark_idx)}{row_idx}:{chr(65 + quark_idx)}{row_idx}",
                    "values": [[quark_link]]
                }
            }

            update_resp = requests.put(update_url, json=update_payload, headers=headers)
            if update_resp.status_code == 200:
                data = update_resp.json()
                if data.get("code") == 0:
                    print(f"✓ 已更新: {book_name}")
                    updated += 1
                else:
                    print(f"✗ 更新失败: {book_name} - {data}")
            else:
                print(f"✗ 更新失败: {book_name} - HTTP {update_resp.status_code}")
        else:
            not_found += 1

    print("\n" + "=" * 60)
    print(f"完成! 处理 {processed} 行，更新 {updated} 个链接，未找到匹配 {not_found} 个")
    print("=" * 60)

if __name__ == "__main__":
    update_quark_links()
