# -*- coding: utf-8 -*-

book_id = 981
title = "镖人"
author = "许先哲"
authorDetail = '许先哲，青年漫画家，2015年开始在网络平台连载长篇漫画《镖人》。在此之前，他从未接受过专业的绘画训练，仅凭对历史和武侠的热爱，以及对漫画艺术的执着追求，用四年时间潜心研究隋唐历史，走访丝绸之路，搜集创作素材。《镖人》是他的处女作，一经推出便在网络上引发广泛关注。他以水墨风格的粗犷画风、紧凑的剧情编排和深厚的历史底蕴著称，被认为是近年来最具国际影响力的中国原创漫画家之一。'
description = '《镖人》是一部以隋末唐初为时代背景的长篇武侠漫画，由青年漫画家许先哲创作。故事发生在隋末民乱前夕，朝纲崩坏、江湖动荡的乱世之中。主人公刀马是一位武功高强、身份神秘的镖客，他带着年幼的儿子小七行走于刀光剑影的江湖之上，以护镖为生。刀马看似放荡不羁、嗜财如命，实则重情重义、武艺超群。在一次护镖途中，刀马被卷入一场关乎朝廷与江湖的命运漩涡之中，被迫面对曾经的恩怨情仇。漫画以单元剧的形式展开，通过一个个惊心动魄的镖局任务，展现了隋末乱世的众生相——有侠肝义胆的江湖义士，也有阴险狡诈的朝堂权贵；有感人至深的父子情深，也有荡气回肠的江湖恩怨。《镖人》以粗犷有力的水墨画风、紧张刺激的动作场面和跌宕起伏的剧情，被誉为「硬核武侠漫画」的典范之作。该作品在豆瓣上获得了8.4分的高评价（21224人评价），最新卷第十二册更是达到了8.9分，口碑持续走高。漫画不仅在国内拥有大量忠实读者，还登陆日本知名电子阅读平台「uchaコミック」连载，获得日本市场的认可。脱口秀大师李诞、实力演员万茜、知名作家马伯庸、知名动画导演田晓鹏等各界名人纷纷鼎力推荐。《镖人》用漫画的形式重新诠释了武侠精神，展现了中国原创漫画的独特魅力与深厚底蕴，是近年来不可多得的国漫佳作。'
cover = "https://img.aqifei.top/img/2026/04/1776737197414-blob"
category = "武侠小说"
downloadUrl = "https://pan.baidu.com/s/1dUxzgmslvPfSnyC14V3KLA"
downloadCode = "0000"

entry = '''  {
    "id": %d,
    "title": "%s",
    "author": "%s",
    "authorDetail": "%s",
    "year": "",
    "cover": "%s",
    "description": "%s",
    "category": "%s",
    "downloadLinks": [
      {
        "name": "百度网盘",
        "url": "%s",
        "code": "%s"
      }
    ],
    "size": "",
    "format": "epub",
    "publishYear": ""
  }''' % (book_id, title, author, authorDetail, cover, description, category, downloadUrl, downloadCode)

with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the position just before the final ]; (including newline before it)
# We need to insert after the last complete book entry
# The file ends with "  }\n\n];\n" or similar
# Strategy: find "\n];" and work back

idx = content.rfind('\n];')
if idx == -1:
    print("ERROR: Could not find insertion point")
    exit(1)

# We want to insert just before the newline that precedes ];
# But the previous line already has a comma after }
# So we replace the newline with our new entry + newline

# content[:idx] ends with newline before ];
# content[idx:] is \n];

# We need to replace content[:idx] which ends with \n with our insertion
# The text at idx-1 is the newline before \n];
# We want: content[:idx] + entry + \n + ];
# But content[:idx] ends at the \n before ];
# So we need content[:idx] + \n + entry + \n + content[idx:]

# Actually let's trace:
# Original ending: "...\n  }\n\n];"
# idx points to the \n before ];
# content[:idx] = "...\n  }\n"
# content[idx:] = "\n];"
# Result: "...\n  }\n" + ",\n" + entry + "\n" + "\n];"
# = "...\n  }\n,\n<entry>\n\n];"

# But the issue is content[:idx] actually includes the newline at the end
# Let me check what's at idx-1, idx, idx+1

# Actually content[:idx] ends at position idx-1 (excluded)
# So if idx is the position of \n in \n], content[:idx] excludes that \n
# content[idx] is the \n

# Let me try a different approach - just find the last "  }" before ];

# Find all occurrences of "  }" and take the last one that's before ];
last_brace_pos = content.rfind('  }')
# Verify this is before ];
semi_brace_pos = content.rfind('];')
if last_brace_pos > semi_brace_pos:
    print("ERROR: Could not find correct insertion point")
    exit(1)

# The text after last_brace_pos should be }, and then eventually ];
# Let's insert right after "  }," pattern

# Find "  }," before ];
search_from = content[:semi_brace_pos]
last_comma_brace = search_from.rfind('  },')
if last_comma_brace == -1:
    print("ERROR: Could not find '  },' pattern")
    exit(1)

# Insert after this pattern
new_content = content[:last_comma_brace + 4] + '\n' + entry + '\n' + content[last_comma_brace + 4:]

with open('data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Book added successfully!")
print("Title: %s" % title)
print("ID: %d" % book_id)
print("Category: %s" % category)