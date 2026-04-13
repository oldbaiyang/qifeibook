# -*- coding: utf-8 -*-
import re

# 准备书籍数据
new_book = '''  {
    "id": 958,
    "title": "价值",
    "author": "张磊",
    "authorDetail": "张磊，高瓴资本创始人兼首席执行官，耶鲁大学校友。他于2005年创立高瓴资本，在他的带领下，高瓴已成为亚洲地区资产管理规模最大的投资机构之一。张磊倡导价值投资与长期主义，强调时间的力量，支持并参与了一批伟大企业的诞生与成长，如微信等。他的投资理念深刻影响了中国乃至全球的投资界。",
    "year": "2020",
    "cover": "https://img.aqifei.top/img/2026/04/1776079195480-blob",
    "description": "《价值》是高瓴资本创始人兼首席执行官张磊的首部力作，全书历时15年潜心撰写，凝聚了作者从求学到创业、从投资到管理的丰富经验与深刻思考。本书以「价值」为主题，围绕价值投资的本质与实践，系统阐述了张磊的投资理念与方法论。全书共分为多个章节，从哲学、历史、实践等多个维度探讨价值创造的真谛。作者提出了三条投资哲学：守正用奇、弱水三千但取一瓢、桃李不言下自成蹊；以及长期主义、延迟满足、自我驱动、终身学习等核心价值观。书中通过详述高瓴资本投资腾讯、京东、百济神州、蓝月亮等经典案例，展现了如何发现伟大企业、如何陪伴企业成长、如何穿越周期实现价值投资。此外，张磊还提出了「三把火理论」，强调价值观、知识、能力是个人与组织最核心的资产，不可被火烧掉。本书语言平实，却蕴含深刻的商业智慧，适合投资者、企业家、管理者及所有追求自我提升的读者阅读。豆瓣评分8.3，得到了众多读者的关注与讨论，被誉为「价值投资的实践指南」。无论你是投资新手还是资深人士，阅读本书都将帮助你更好地理解价值、时间和长期主义的真正含义。",
    "category": "投资理财",
    "downloadLinks": [
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1y8fJLpAihx8yT4GoTzIg_w?pwd=0000",
        "code": "0000"
      }
    ],
    "size": "",
    "format": "epub",
    "publishYear": "2020"
  }'''

# 读取文件
with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到最后一个 },\n的位置
last_book_end = content.rfind('  },')
if last_book_end == -1:
    print("Error: Could not find insertion point")
    exit(1)

# 在最后一个书籍条目后插入新书
insert_pos = last_book_end + 3  # after "  },"
new_content = content[:insert_pos] + ',\n' + new_book + content[insert_pos:]

# 写回文件
with open('data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Book added successfully!")
print("New book ID: 958")
print("Title: 价值")