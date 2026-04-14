#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# New book data
new_book = """  {
    "id": 976,
    "title": "极品家丁",
    "author": "禹岩",
    "authorDetail": "禹岩，著名网络作家，以其幽默风趣的文笔和天马行空的想象力著称。代表作《极品家丁》开创了家丁流网络小说的先河，在网络文学界具有重要影响力。其作品通常以现代人穿越到古代为背景，融合了历史、职场、商场等多种元素，语言轻松幽默，情节跌宕起伏，深受读者喜爱。",
    "year": "",
    "cover": "https://img.aqifei.top/img/2026/04/1776161862516-blob",
    "description": "《极品家丁》是一部融合穿越、历史、职场与爱情元素的网络小说，故事背景设定在一个项羽取得楚汉战争胜利的平行时空。现代销售经理林晚荣因意外穿越到大华朝，成为萧家大宅中一名普通的家丁。在这个全新的异世界里，林晚荣凭借现代人的智慧和商业头脑，在商场、官场、战场和情场中左右逢源，玩转风云。\\n\\n故事以林晚荣在家丁岗位上的崛起为主线，逐步展开了一幅宏大的历史画卷。他兴办实业、经营社团，用现代经营理念改变着这个古老的时代。从小小的家丁到搅动天下风云的关键人物，林晚荣的传奇之路充满了智慧与幽默。\\n\\n豆瓣评分7.8分，收获了众多读者的好评。书中那句「暮晓春来迟，先于百花知。岁岁种桃花，开在断肠时」更成为经典名句。《极品家丁》不仅是一部轻松的穿越爽文，更展现了主人公在逆境中奋发向上、用智慧改变命运的励志主题。小说情节紧凑，人物塑造丰满，尤其是对主角林晚荣机智圆滑、痞气中带着真情的性格刻画入微，令人印象深刻。",
    "category": "穿越小说",
    "downloadLinks": [
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/18rH8Vh8qAL8d_hQaiJG81g?pwd=0000",
        "code": "0000"
      }
    ],
    "size": "",
    "format": "epub",
    "publishYear": ""
  },"""

# Read the file
with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find position to insert (after the opening bracket of books array)
insert_pattern = 'export const books: Book[] = [\n'
insert_pos = content.find(insert_pattern) + len(insert_pattern)

# Insert the new book
new_content = content[:insert_pos] + '\n' + new_book + '\n' + content[insert_pos:]

# Write back
with open('data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Book added successfully!")
