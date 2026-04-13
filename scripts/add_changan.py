# -*- coding: utf-8 -*-
import re

# 准备书籍数据
new_book = '''  {
    "id": 957,
    "title": "长安十二时辰",
    "author": "马伯庸",
    "authorDetail": "马伯庸，作家，中国作家协会会员，擅长历史悬疑推理。其作品被称为「历史可能性」小说，即遵循历史的固有规律，不改变历史大事，但细节上的东西则精益求精，给读者提供一种历史可能性。他著有《古董局中局》、《长安十二时辰》等长篇代表作，擅长在真实历史背景中融入虚构情节，让读者在享受阅读乐趣的同时，了解丰富的历史文化知识。其文笔精炼，视角独特，在文学界和读者中均获得了极高的评价。",
    "year": "2019",
    "cover": "https://img.aqifei.top/img/2026/04/1776078029689-blob",
    "description": "《长安十二时辰》讲述了唐天宝三年，元月十四日，上元节。长安城灯火辉煌，百姓沉浸在一片喜庆之中，却不知一场吞噬一切的劫难已悄然逼近。突厥、狼卫等势力暗中潜入，暗杀、绑架、纵火等恐怖事件接连发生，整座长安城危在旦夕。\\n\\n在这千钧一发之际，孤胆英雄张小敬（不良人）与天才少年李必（靖安司司丞）临危受命，必须在短短十二个时辰内揪出真凶，化解危机。小说以其紧张刺激的节奏、抽丝剥茧的悬疑推理，带领读者深入大唐帝国的心脏，感受那个盛世背后的暗流涌动。\\n\\n《长安十二时辰》是马伯庸的长篇代表作，被誉为「历史可能性」小说的典范之作。作者凭借扎实的史学功底和天马行空的想象力，真实还原了唐代长安城108坊的布局与风貌，从服饰饮食到天文历法，从政治博弈到民间百态，无不细致入微，让读者仿佛身临其境。\\n\\n本书在豆瓣读书上评分高达8.3分（评分数据来源于豆瓣读书，具体分数可能随时间变化），获得了广大读者的高度评价。读者称赞其「突破真实与虚构界限，打造令人窒息的历史悬疑巨制」，「干货满满，植入了非常多唐代长安的风俗人情，容易融入时代背景」。虽然有部分读者认为其精彩程度略逊于作者的《古董局中局》，但丝毫不影响其作为年度最佳历史悬疑小说之一的地位。\\n\\n该书不仅在文学上取得了巨大成功，更被改编为同名电视剧，由当红演员易烊千玺、雷佳音领衔主演，进一步引发了全民阅读热潮，成为近年来最具影响力的历史悬疑文学作品之一。",
    "category": "悬疑推理",
    "downloadLinks": [
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1pA9gyNfBnoilB-6NavN8Cg?pwd=0000",
        "code": "0000"
      }
    ],
    "size": "",
    "format": "epub",
    "publishYear": "2019"
  }'''

# 读取文件
with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到最后一个 },\n的位置，在最后一个书籍条目后插入新书
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
print(f"New book ID: 957")
print(f"Title: 长安十二时辰")