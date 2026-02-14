#!/usr/bin/env python3
"""
重置飞书表格中特定书籍的状态为空
"""
import requests

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 需要重置状态的书名
BOOKS_TO_RESET = [
    "黄色墙纸",
    "哲学家的最后一课",
    "父亲的解放日志",
    "世界在前进",
    "人生解忧",
    "我是寨子里长大的女孩",
    "玫瑰朝上",
    "即使以最微弱的光",
    "要有光",
    "太阳的阴影",
    "安史之乱",
    "格外的活法",
    "弃长安",
    "南明史",
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

def reset_status():
    """重置状态为空"""
    print("=" * 60)
    print("重置飞书表格状态")
    print("=" * 60)

    token = get_access_token()
    if not token:
        print("获取访问令牌失败!")
        return
    print("✓ 获取访问令牌成功")

    spreadsheet_token = get_spreadsheet_token(token)
    sheet_id = get_sheet_id(token, spreadsheet_token)
    print(f"表格ID: {spreadsheet_token}")
    print(f"工作表ID: {sheet_id}")

    # 读取表格数据
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

    header = values[0]
    book_name_idx = header.index('书名') if '书名' in header else 0
    status_idx = header.index('状态') if '状态' in header else 4

    print(f"\n书名列索引: {book_name_idx}, 状态列索引: {status_idx}")

    # 重置计数
    reset_count = 0
    not_found = 0

    for row_idx, row in enumerate(values[1:], start=2):
        if len(row) <= max(book_name_idx, status_idx):
            continue

        book_name = extract_text(row[book_name_idx])
        if not book_name:
            continue

        if book_name in BOOKS_TO_RESET:
            # 重置状态为空
            update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values"
            update_payload = {
                "valueRange": {
                    "range": f"{sheet_id}!{chr(65 + status_idx)}{row_idx}:{chr(65 + status_idx)}{row_idx}",
                    "values": [[""]]
                }
            }

            update_resp = requests.put(update_url, json=update_payload, headers=headers)
            if update_resp.status_code == 200:
                data = update_resp.json()
                if data.get("code") == 0:
                    print(f"✓ 已重置: {book_name}")
                    reset_count += 1
                else:
                    print(f"✗ 重置失败: {book_name} - {data}")
            else:
                print(f"✗ 重置失败: {book_name} - HTTP {update_resp.status_code}")

    print("\n" + "=" * 60)
    print(f"完成! 重置 {reset_count} 个状态")
    print("=" * 60)

if __name__ == "__main__":
    reset_status()
