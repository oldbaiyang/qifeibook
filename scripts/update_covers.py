#!/usr/bin/env python3
"""更新特定书籍的封面"""
import re

# 书名到新封面的映射
COVER_UPDATES = {
    "黄色墙纸": "https://img.aqifei.top/img/2026/02/20260214183656538",
    "格外的活法": "https://img.aqifei.top/img/2026/02/20260214183553059",
    "哲学家的最后一课": "https://img.aqifei.top/img/2026/02/20260214183613769",
    "即使以最微弱的光": "https://img.aqifei.top/img/2026/02/20260214183633816",
    "玫瑰朝上": "https://img.aqifei.top/img/2026/02/20260214183535816",
}

# 读取文件
with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 更新封面
for title, new_cover in COVER_UPDATES.items():
    # 查找书名并更新 cover URL
    old_cover_pattern = rf'("title": "{re.escape(title)}"[\s\S]*?"cover": ")[^"]*(")'
    content = re.sub(old_cover_pattern, rf'\1{new_cover}\2', content, flags=re.DOTALL)

# 写回文件
with open('data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("封面更新完成！")
for title, new_cover in COVER_UPDATES.items():
    print(f"✓ {title}")
