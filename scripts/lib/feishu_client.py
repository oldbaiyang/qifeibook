#!/usr/bin/env python3
"""
飞书表格 API 客户端 - 提供飞书表格操作的通用功能

使用方法：
    from lib.feishu_client import FeishuClient

    client = FeishuClient(
        app_id='your_app_id',
        app_secret='your_app_secret',
        wiki_token='your_wiki_token'
    )

    # 读取表格数据
    values = client.read_values()

    # 更新单元格
    client.update_cell('A1', 'new value')

    # 批量更新
    client.batch_update({
        'A1': 'value1',
        'A2': 'value2'
    })
"""

import requests
from typing import Optional, List, Dict, Any


class FeishuClient:
    """飞书表格 API 客户端"""

    def __init__(self, app_id: str, app_secret: str, wiki_token: str):
        """
        初始化飞书客户端

        Args:
            app_id: 飞书应用 ID
            app_secret: 飞书应用密钥
            wiki_token: 飞书 Wiki token
        """
        self.app_id = app_id
        self.app_secret = app_secret
        self.wiki_token = wiki_token
        self._access_token: Optional[str] = None
        self._spreadsheet_token: Optional[str] = None
        self._sheet_id: Optional[str] = None

    def get_access_token(self) -> Optional[str]:
        """获取飞书访问令牌"""
        url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
        resp = requests.post(url, json={"app_id": self.app_id, "app_secret": self.app_secret})
        data = resp.json()
        token = data.get("tenant_access_token")
        if token:
            self._access_token = token
        return token

    def get_headers(self) -> Dict[str, str]:
        """获取请求头"""
        if not self._access_token:
            self.get_access_token()
        return {"Authorization": f"Bearer {self._access_token}"}

    def get_spreadsheet_token(self) -> Optional[str]:
        """获取电子表格 token"""
        url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token={self.wiki_token}"
        headers = self.get_headers()
        resp = requests.get(url, headers=headers)
        data = resp.json()
        token = data.get("data", {}).get("node", {}).get("obj_token")
        if token:
            self._spreadsheet_token = token
        return token

    def get_sheet_id(self) -> Optional[str]:
        """获取第一个工作表 ID"""
        if not self._spreadsheet_token:
            self.get_spreadsheet_token()
        if not self._spreadsheet_token:
            return None

        url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{self._spreadsheet_token}/sheets/query"
        headers = self.get_headers()
        resp = requests.get(url, headers=headers)
        data = resp.json()
        sheets = data.get("data", {}).get("sheets", [])
        if sheets:
            self._sheet_id = sheets[0].get("sheet_id")
        return self._sheet_id

    @staticmethod
    def extract_text(cell: Any) -> str:
        """
        提取单元格文本

        Args:
            cell: 单元格数据（可以是字符串、字典或列表）

        Returns:
            提取的文本内容
        """
        if not cell:
            return ""

        # 处理字符串
        if isinstance(cell, str):
            return cell.strip()

        # 处理字典（飞书单元格格式）
        if isinstance(cell, dict):
            if "link" in cell:
                return cell.get("link", "").strip()
            if "text" in cell:
                return cell.get("text", "").strip()
            if "user" in cell:
                return cell.get("user", {}).get("name", "").strip()
            return str(cell).strip()

        # 处理列表
        if isinstance(cell, list):
            result = ""
            for c in cell:
                result += FeishuClient.extract_text(c)
            return result.strip()

        return str(cell).strip()

    def read_values(self, range_str: str = "A1:Z2000") -> Optional[List[List[Any]]]:
        """
        读取表格数据

        Args:
            range_str: 数据范围（默认 A1:Z2000）

        Returns:
            二维数组表示的表格数据
        """
        if not self.get_sheet_id():
            return None

        url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{self._spreadsheet_token}/values/{self._sheet_id}!{range_str}"
        headers = self.get_headers()
        resp = requests.get(url, headers=headers)

        if resp.status_code != 200:
            print(f"读取表格失败: {resp.json()}")
            return None

        data = resp.json()
        values = data.get('data', {}).get('valueRange', {}).get('values', [])
        return values

    def update_cell(self, cell_range: str, value: Any) -> bool:
        """
        更新单个单元格

        Args:
            cell_range: 单元格范围（如 'A1' 或 'A1:B1'）
            value: 要设置的值

        Returns:
            是否更新成功
        """
        if not self.get_sheet_id():
            return False

        url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{self._spreadsheet_token}/values"
        headers = self.get_headers()
        payload = {
            "valueRange": {
                "range": f"{self._sheet_id}!{cell_range}:{cell_range}",
                "values": [[value]]
            }
        }

        resp = requests.put(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("code") == 0:
                return True
            else:
                print(f"更新失败: {data}")
                return False
        else:
            print(f"更新失败 HTTP {resp.status_code}")
            return False

    def batch_update(self, updates: Dict[str, Any]) -> int:
        """
        批量更新单元格

        Args:
            updates: 字典，键为单元格位置（如 'A1'），值为要设置的内容

        Returns:
            成功更新的单元格数量
        """
        success_count = 0
        for cell_range, value in updates.items():
            if self.update_cell(cell_range, value):
                success_count += 1
                print(f"✓ 更新成功: {cell_range}")
            else:
                print(f"✗ 更新失败: {cell_range}")
        return success_count

    def find_rows_by_column(self, column_index: int, value: str, header_row: bool = True) -> List[int]:
        """
        根据列值查找行号

        Args:
            column_index: 列索引（从 0 开始）
            value: 要查找的值
            header_row: 是否包含表头行

        Returns:
            匹配的行号列表（从 1 开始）
        """
        values = self.read_values()
        if not values:
            return []

        result = []
        start_idx = 1 if header_row else 0
        for idx, row in enumerate(values[start_idx:], start=start_idx):
            if len(row) > column_index:
                cell_value = self.extract_text(row[column_index])
                if cell_value == value:
                    result.append(idx)
        return result
