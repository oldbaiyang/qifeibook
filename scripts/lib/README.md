# 网站同步工具库

提供飞书 API、mockData.ts 操作和 sitemap 管理的通用功能。

## 模块

### FeishuClient - 飞书表格 API 客户端

```python
from lib.feishu_client import FeishuClient

# 初始化客户端
client = FeishuClient(
    app_id='your_app_id',
    app_secret='your_app_secret',
    wiki_token='your_wiki_token'
)

# 读取表格数据
values = client.read_values("A1:Z100")

# 获取表头
header = values[0]
book_name_idx = header.index('书名')

# 提取书名列表
book_names = [client.extract_text(row[book_name_idx]) for row in values[1:]]

# 更新单个单元格
client.update_cell('A1', 'new value')

# 批量更新
client.batch_update({
    'A1': 'value1',
    'A2': 'value2'
})

# 根据书名查找行号
rows = client.find_rows_by_column(0, '黄色墙纸')
```

### MockDataHelper - mockData.ts 操作助手

```python
from lib.mockdata_helper import MockDataHelper

helper = MockDataHelper()

# 读取现有书籍 ID
ids = helper.read_book_ids()
print(f"现有书籍数: {len(ids)}")

# 读取现有书籍标题
titles = helper.read_book_titles()

# 获取下一个可用 ID
next_id = helper.get_next_id()

# 添加新书籍
new_books = [
    {
        "id": next_id,
        "title": "新书标题",
        "author": "作者",
        "authorDetail": "作者简介",
        "year": "2024",
        "cover": "https://example.com/cover.jpg",
        "description": "书籍简介",
        "category": "小说文学",
        "downloadLinks": [
            {"name": "夸克网盘", "url": "https://pan.quark.cn/s/xxx"}
        ],
        "size": "未知",
        "format": "EPUB",
        "publishYear": "2024"
    }
]
helper.add_books(new_books)

# 更新书籍封面
helper.update_book_field(123, 'cover', 'https://example.com/new-cover.jpg')

# 批量更新字段
helper.update_fields({
    "黄色墙纸": {"cover": "https://example.com/new-cover.jpg"},
    "哲学家的最后一课": {"cover": "https://example.com/new-cover.jpg"}
})

# 验证文件格式
if helper.validate():
    print("mockData.ts 格式正确")
```

### SitemapHelper - sitemap.xml 操作助手

```python
from lib.sitemap_helper import SitemapHelper

helper = SitemapHelper()

# 添加书籍 URL
helper.add_book_urls([123, 124, 125])

# 添加自定义 URL
helper.add_urls([
    ('https://www.qifeibook.com/category/科幻奇幻', '2024-01-01'),
    ('https://www.qifeibook.com/search', '2024-01-01')
])

# 获取 URL 数量
count = helper.get_url_count()
print(f"Sitemap 包含 {count} 个 URL")

# 移除特定 URL
helper.remove_urls('/book/100')

# 验证 sitemap 格式
if helper.validate():
    print("sitemap.xml 格式正确")
```

## 完整示例

### 示例 1: 从飞书同步新书

```python
#!/usr/bin/env python3
from lib.feishu_client import FeishuClient
from lib.mockdata_helper import MockDataHelper
from lib.sitemap_helper import SitemapHelper

# 飞书配置
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# 初始化客户端
feishu = FeishuClient(APP_ID, APP_SECRET, WIKI_TOKEN)
mockdata = MockDataHelper()
sitemap = SitemapHelper()

# 读取飞书表格数据
values = feishu.read_values()
if not values:
    print("读取表格失败")
    exit(1)

# 解析表头
header = values[0]
book_name_idx = header.index('书名')
cover_idx = header.index('封面图')
quark_idx = header.index('夸克网盘')
baidu_idx = header.index('百度网盘')
status_idx = header.index('状态')

# 读取现有书籍
existing_ids = mockdata.read_book_ids()
next_id = mockdata.get_next_id()

# 筛选新书籍（状态不为 1）
new_books = []
book_ids_for_sitemap = []

for row in values[1:]:
    if len(row) <= max(book_name_idx, status_idx):
        continue

    status = feishu.extract_text(row[status_idx])
    if status == "1":
        continue

    book_id = next_id
    book_name = feishu.extract_text(row[book_name_idx])
    if not book_name:
        continue

    # 构建书籍对象
    book = {
        "id": book_id,
        "title": book_name,
        "cover": feishu.extract_text(row[cover_idx]),
        "downloadLinks": [],
        # ... 其他字段
    }

    new_books.append(book)
    book_ids_for_sitemap.append(book_id)
    next_id += 1

# 添加到 mockData.ts
if new_books:
    mockdata.add_books(new_books)
    print(f"✓ 已添加 {len(new_books)} 本书籍")

    # 更新 sitemap
    sitemap.add_book_urls(book_ids_for_sitemap)
    print(f"✓ 已更新 sitemap")

    # 更新飞书状态
    for row_idx in row_indices:
        feishu.update_cell(f'E{row_idx}', '1')
```

### 示例 2: 批量更新书籍封面

```python
#!/usr/bin/env python3
from lib.mockdata_helper import MockDataHelper

# 书名到封面的映射
COVER_UPDATES = {
    "黄色墙纸": "https://img.aqifei.top/img/2026/02/20260214183656538",
    "格外的活法": "https://img.aqifei.top/img/2026/02/20260214183553059",
}

helper = MockDataHelper()

# 批量更新封面
field_updates = {
    title: {"cover": url}
    for title, url in COVER_UPDATES.items()
}

success_count = helper.update_fields(field_updates)
print(f"✓ 已更新 {success_count} 个封面")
```

## 注意事项

1. **备份**: 所有操作都会自动创建备份文件（.backup 扩展名）
2. **错误处理**: 建议在生产环境中添加更完善的错误处理
3. **飞书 API**: 注意飞书 API 的调用频率限制
4. **数据验证**: 在更新前建议先验证数据格式

## 扩展

如需添加更多功能，可以在对应模块中添加新方法：
- `FeishuClient`: 添加更多飞书 API 功能
- `MockDataHelper`: 添加书籍数据的批量操作
- `SitemapHelper`: 添加更多 sitemap 管理功能
