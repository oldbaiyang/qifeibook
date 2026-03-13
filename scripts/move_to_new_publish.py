#!/usr/bin/env python3
"""
将未发布sheet中有下载地址的书籍移动到新发布sheet

使用方法：
    python scripts/move_to_new_publish.py
"""

import requests
import json

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'


def get_tenant_access_token():
    """获取飞书访问令牌"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    payload = {"app_id": APP_ID, "app_secret": APP_SECRET}
    response = requests.post(url, json=payload)
    data = response.json()
    if data.get("tenant_access_token"):
        return data["tenant_access_token"]
    raise Exception(f"获取token失败: {data}")


def get_spreadsheet_token(token):
    """获取电子表格token"""
    url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token={WIKI_TOKEN}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    data = response.json()
    spreadsheet_token = data.get("data", {}).get("node", {}).get("obj_token")
    if spreadsheet_token:
        return spreadsheet_token
    raise Exception(f"获取表格token失败: {data}")


def get_all_sheets(token, spreadsheet_token):
    """获取所有工作表"""
    url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/query"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    data = response.json()
    sheets = data.get("data", {}).get("sheets", [])
    return sheets


def create_sheet(token, spreadsheet_token, title):
    """创建新的工作表"""
    url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{spreadsheet_token}/sheets"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "title": title
    }
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    if data.get("code") == 0:
        return data.get("data", {}).get("sheet", {})
    print(f"创建sheet失败: {data}")
    return None


def read_sheet_values(token, spreadsheet_token, sheet_id, range_str="A1:Z1000"):
    """读取工作表数据"""
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values/{sheet_id}!{range_str}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    data = response.json()
    return data.get("data", {}).get("valueRange", {}).get("values", [])


def write_sheet_values(token, spreadsheet_token, sheet_id, range_str, values):
    """写入工作表数据"""
    # 计算实际需要的范围
    rows = len(values)
    cols = max(len(row) for row in values) if values else 1
    end_col = chr(ord('A') + cols - 1)
    actual_range = f"{sheet_id}!A1:{end_col}{rows}"

    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "valueRange": {
            "range": actual_range,
            "values": values
        }
    }
    response = requests.put(url, headers=headers, json=payload)
    data = response.json()
    if data.get("code") != 0:
        print(f"写入失败详情: {json.dumps(data, ensure_ascii=False)}")
    return data.get("code") == 0


def delete_rows(token, spreadsheet_token, sheet_id, start_row, end_row):
    """删除指定行"""
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/dimension_range"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "dimension": {
            "sheetId": sheet_id,
            "majorDimension": "ROWS",
            "startIndex": start_row,
            "endIndex": end_row
        }
    }
    response = requests.delete(url, headers=headers, json=payload)
    data = response.json()
    return data.get("code") == 0


def parse_cell_value(cell):
    """解析单元格值"""
    if not cell:
        return ""

    if isinstance(cell, str):
        return cell.strip()

    if isinstance(cell, dict):
        if "link" in cell:
            return cell.get("link", "").strip()
        if "text" in cell:
            return cell.get("text", "").strip()

    if isinstance(cell, list):
        for item in cell:
            if isinstance(item, dict) and "link" in item:
                return item.get("link", "").strip()
        return "".join(str(x) if isinstance(x, str) else "" for x in cell)

    return str(cell).strip()


def has_download_link(row):
    """检查行是否有下载链接"""
    if len(row) < 6:
        return False

    download_link = row[5]  # 第6列是下载链接
    if not download_link:
        return False

    link_str = parse_cell_value(download_link)
    # 检查是否包含网盘链接
    return any(domain in link_str.lower() for domain in ['pan.baidu.com', 'pan.quark.cn', 'aliyundrive.com', 'pan.xunlei.com'])


def main():
    print("=" * 50)
    print("将未发布中有下载地址的书籍移动到新发布")
    print("=" * 50)

    # 获取token
    token = get_tenant_access_token()
    print(f"✓ 获取token成功")

    spreadsheet_token = get_spreadsheet_token(token)
    print(f"✓ 表格token: {spreadsheet_token}")

    # 获取所有sheet
    sheets = get_all_sheets(token, spreadsheet_token)
    print(f"\n当前工作表:")
    for s in sheets:
        print(f"  - {s['title']} (ID: {s['sheet_id']})")

    # 找到未发布sheet
    unpublished_sheet = None
    for s in sheets:
        if "未发布" in s['title']:
            unpublished_sheet = s
            break

    if not unpublished_sheet:
        print("\n✗ 未找到'未发布'工作表")
        return

    print(f"\n✓ 找到未发布工作表: {unpublished_sheet['title']}")

    # 读取未发布数据
    values = read_sheet_values(token, spreadsheet_token, unpublished_sheet['sheet_id'])
    if not values:
        print("✗ 未发布工作表没有数据")
        return

    print(f"✓ 读取到 {len(values)} 行数据")

    # 分析数据
    header = values[0] if values else []
    print(f"\n表头: {header[:6]}...")

    # 找出有下载链接的行
    rows_with_links = []
    rows_without_links = []
    for i, row in enumerate(values[1:], start=1):  # 跳过表头
        if has_download_link(row):
            rows_with_links.append((i, row))
        else:
            rows_without_links.append((i, row))

    print(f"\n有下载链接的书籍: {len(rows_with_links)}")
    print(f"无下载链接的书籍: {len(rows_without_links)}")

    if not rows_with_links:
        print("\n没有需要移动的书籍")
        return

    # 检查或创建新发布sheet
    new_publish_sheet = None
    for s in sheets:
        if s['title'] == '新发布':
            new_publish_sheet = s
            print(f"\n✓ 找到已存在的'新发布'工作表")
            break

    if not new_publish_sheet:
        print(f"\n创建'新发布'工作表...")
        new_publish_sheet = create_sheet(token, spreadsheet_token, '新发布')
        if new_publish_sheet:
            print(f"✓ 创建成功: {new_publish_sheet.get('sheet_id')}")
        else:
            print("✗ 创建失败")
            return

    # 写入数据到新发布sheet
    print(f"\n写入数据到新发布工作表...")

    # 先写入表头
    write_data = [header]
    for _, row in rows_with_links:
        # 确保每行有足够的列
        padded_row = row + [''] * (len(header) - len(row)) if len(row) < len(header) else row[:len(header)]
        write_data.append(padded_row)

    if write_sheet_values(token, spreadsheet_token, new_publish_sheet['sheet_id'], "A1", write_data):
        print(f"✓ 成功写入 {len(write_data)} 行数据到新发布工作表")
    else:
        print("✗ 写入失败")
        return

    # 从未发布sheet删除已移动的行（从后往前删除，避免索引变化）
    print(f"\n从未发布工作表删除已移动的行...")

    # 获取要删除的行号（从后往前排序）
    rows_to_delete = sorted([i for i, _ in rows_with_links], reverse=True)

    # 删除行
    deleted_count = 0
    for row_idx in rows_to_delete:
        # 飞书行索引从0开始，但要跳过表头，所以实际删除的是 row_idx 行
        if delete_rows(token, spreadsheet_token, unpublished_sheet['sheet_id'], row_idx, row_idx + 1):
            deleted_count += 1
            title = parse_cell_value(values[row_idx][0]) if len(values[row_idx]) > 0 else "未知"
            print(f"  ✓ 删除: {title}")
        else:
            title = parse_cell_value(values[row_idx][0]) if len(values[row_idx]) > 0 else "未知"
            print(f"  ✗ 删除失败: {title}")

    # 显示已移动的书籍
    print(f"\n已移动的书籍列表:")
    for i, row in rows_with_links[:10]:
        title = parse_cell_value(row[0]) if len(row) > 0 else "未知"
        author = parse_cell_value(row[1]) if len(row) > 1 else ""
        print(f"  - {title} ({author})")
    if len(rows_with_links) > 10:
        print(f"  ... 还有 {len(rows_with_links) - 10} 本")

    print(f"\n✓ 完成！")
    print(f"  - 已将 {len(rows_with_links)} 本书写入'新发布'工作表")
    print(f"  - 已从'未发布'工作表删除 {deleted_count} 行")


if __name__ == "__main__":
    main()
