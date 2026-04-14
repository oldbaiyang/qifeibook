#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# New book data - using literal \n\n to represent paragraph breaks
new_book = """  {
    "id": 977,
    "title": "太荒吞天诀",
    "author": "铁马飞桥",
    "authorDetail": "铁马飞桥，纵横中文网签约作家，擅长玄幻小说创作，笔下作品以热血激情、想象力丰富著称。其代表作《太荒吞天诀》自上线以来，深受读者喜爱，连载期间点击量持续攀升，成为玄幻小说中的热门作品。作者善于构建宏大的世界观，刻画人物成长与情感冲突，在网络文学界拥有一定的知名度。",
    "year": "",
    "cover": "https://img.aqifei.top/img/2026/04/1776161979173-blob",
    "description": "《太荒吞天诀》是纵横中文网签约作家铁马飞桥创作的奇幻玄幻类网络小说。故事以十大仙帝之一的柳无邪为主角，因争夺传说中的吞天神鼎，遭到整个仙界的围攻，最终陨落。然而，命运让他得以重生，回到真武大陆，成为徐家的上门女婿。带着前世的记忆与神鼎的力量，柳无邪在新世界中踏上复仇与成长之路。他以卑微的身份为起点，凭借过人的天赋和不屈的意志，逐步揭露隐藏在大陆深处的阴谋，收服强横的妖兽，击败各路强敌，最终踏上巅峰之路。\\n\\n小说以「吞天神鼎」为核心线索，融合了东方玄幻的修炼体系与热血战斗元素，情节跌宕起伏，节奏紧凑。作者通过对主角内心世界的细腻描写，展现了从废材到强者的蜕变过程，充满了热血与感动。同时，小说中交织着家族恩怨、师徒情义、爱恨情仇等多元情感线，使故事更加丰富立体。\\n\\n在人物设定上，柳无邪从一个被迫入赘的废物赘婿，逐步成长为睥睨天下的强者，经历了无数次的生死考验与磨练。其成长轨迹体现了个人奋斗的精神，也映射出在逆境中不屈不挠的价值观。配角如徐家小姐、神秘师父等角色亦各具特色，为故事增色不少。\\n\\n在豆瓣上，该书评分约为7.6分，读者评价普遍认为其剧情构思新颖、世界观宏大，能够吸引人一路追读。部分读者赞赏其升级体系完整、战斗场面描写精彩，但也有声音指出部分情节略显套路化，后期存在注水之嫌。总体而言，《太荒吞天诀》是一部适合喜欢玄幻、修真题材的读者打发时间的主流爽文，虽有不足之处，但仍具备一定的阅读价值。",
    "category": "玄幻小说",
    "downloadLinks": [
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1YhIbo-xyXs_rFEXgPjXXtg?pwd=0000",
        "code": "0000"
      }
    ],
    "size": "",
    "format": "txt",
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
