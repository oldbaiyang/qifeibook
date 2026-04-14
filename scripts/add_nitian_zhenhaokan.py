#!/usr/bin/env python3
# -*- coding: utf-8 -*-

new_book = """  {
    "id": 978,
    "title": "你今天真好看",
    "author": "莉兹·克里莫",
    "authorDetail": "莉兹·克里莫（Liz Climo），美国漫画家、插画家，以其治愈系的漫画作品闻名。她从小喜欢画画，是左撇子，这让她在创作中形成了独特的视角。她的作品风格简洁、线条流畅、色彩温暖，常以动物为主角，展现日常生活中温馨有趣的小瞬间。她的代表作《你今天真好看》深受全球读者喜爱，被翻译成多种语言。此外，她还出版了《你今天真好看2》等作品，继续用画笔传递爱与温暖。",
    "year": "",
    "cover": "https://img.aqifei.top/img/2026/04/1776162300592-blob",
    "description": "《你今天真好看》是一本清新暖萌的漫画集，由美国漫画家莉兹·克里莫创作。书中收录了150多张逗趣漫画，每一幅都充满了温暖与治愈的力量。这些漫画以可爱的动物为主角，包括兔子、恐龙、棕熊、企鹅、乌龟、狮子、大象、伞蜥、獾、土拨鼠等各种萌物，它们在生活中演绎着一个个简单而有趣的小故事。书中的对话俏皮可爱，情节轻松温馨，让人忍俊不禁。无论是友情、亲情还是爱情，这些漫画都以最真挚的方式呈现，让读者在会心一笑的同时，也能感受到生活中的美好与善意。这本书的豆瓣评分高达8.6分，受到了广大读者的热烈追捧。许多读者评价说，这本书是「床头必备」「治愈良药」，适合在任何心情下阅读。它不仅适合独自阅读品味，也适合与朋友、家人分享，传递快乐与温暖。整本书的设计装帧精美，纸质优良，漫画色彩鲜明，给人以视觉上的享受。无论你是学生党、上班族还是亲子阅读，这都是一本能够让你放松身心、忘却烦恼的温馨读物。在这个快节奏的时代，《你今天真好看》以其独特的魅力，成为了无数人心中的一束光，照亮了每一个需要温暖的日子。此外，这本书的每一幅漫画都蕴含着生活的智慧与幽默，让人在阅读过程中不断发现惊喜。无论是清晨的第一缕阳光下，还是夜晚的睡前时光，翻开这本书，都能让你感受到生活的甜蜜与温馨。它不仅是一本漫画书，更是一本能够触动人心的情感治愈手册。",
    "category": "漫画绘本",
    "downloadLinks": [
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1Y-0UNfIaFI94JA2EnBergg?pwd=0000",
        "code": "0000"
      }
    ],
    "size": "",
    "format": "epub",
    "publishYear": ""
  },"""

with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

insert_pattern = 'export const books: Book[] = [\n'
insert_pos = content.find(insert_pattern) + len(insert_pattern)

new_content = content[:insert_pos] + '\n' + new_book + '\n' + content[insert_pos:]

with open('data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Book added successfully!")
