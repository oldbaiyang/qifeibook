#!/usr/bin/env python3
"""
批量修复 mockData.js 中"待补充"的元数据
"""

import re
from pathlib import Path

# 书籍信息库
METADATA = {
    "桶川跟踪狂杀人事件": {
        "author": "[日] 清水洁",
        "authorDetail": "清水洁，日本资深调查记者。",
        "year": "2021",
        "category": "历史传记",
        "description": "《桶川跟踪狂杀人事件》是一部震撼的非虚构作品。记者清水洁通过对一起女大学生被前男友骚扰并杀害案件的深入调查，揭露了警方在办案过程中的推诿、失职甚至篡改笔录的丑闻，直接推动了日本《反跟踪骚扰法》的出台。"
    },
    "少年凯歌": {
        "author": "陈凯歌",
        "authorDetail": "陈凯歌，中国著名导演。",
        "year": "2001",
        "category": "历史传记",
        "description": "《少年凯歌》是陈凯歌导演的回忆录。他以平实而富有画面感的文字，回忆了自己在文革时期的少年经历。书中充满了对那个时代的深刻反思，以及对人性、尊严和忏悔的追问，被誉为“文革回忆录中的杰作”。"
    },
    "浪潮之巅": {
        "author": "吴军",
        "authorDetail": "吴军，计算机科学家，硅谷投资人。",
        "year": "2011",
        "category": "经济管理",
        "description": "《浪潮之巅》梳理了IT产业发展历程中那些伟大的公司（如AT&T、IBM、苹果、微软、谷歌等）的兴衰史。作者从技术、市场、商业模式等多个角度，分析了它们成功的原因和衰落的教训，揭示了科技产业发展的规律。"
    },
    "昨日的世界": {
        "author": "[奥] 斯蒂芬·茨威格",
        "authorDetail": "茨威格，奥地利著名作家。",
        "year": "1942",
        "category": "历史传记",
        "description": "《昨日的世界》是茨威格的绝笔自传。他以个人的经历为线索，展现了从一战前欧洲的“太平盛世”到二战期间文明崩塌的悲剧历史。书中充满了对旧欧洲文化的怀念和对人道主义失落的悲痛。"
    },
    "爱你就像爱生命": {
        "author": "王小波 / 李银河",
        "authorDetail": "王小波，当代著名作家；李银河，社会学家。",
        "year": "2004",
        "category": "小说文学",
        "description": "《爱你就像爱生命》收录了王小波与李银河的书信。这些信件记录了两人纯真、热烈且充满智慧的爱情。王小波在信中展现了他孩子气、深情且富有诗意的一面，那句“你好哇，李银河”感动了无数读者。"
    },
    "失明症漫记": {
        "author": "[葡] 萨拉马戈",
        "authorDetail": "萨拉马戈，诺贝尔文学奖得主。",
        "year": "1995",
        "category": "小说文学",
        "description": "《失明症漫记》讲述了一场突如其来的“失明症”瘟疫席卷城市，人们纷纷失明，整个社会陷入了混乱和野蛮的状态。作者通过这个极端的寓言，深刻剖析了人性的脆弱、自私以及在绝境中仅存的善意。"
    },
    "我们仨": {
        "author": "杨绛",
        "authorDetail": "杨绛，著名作家、翻译家、学者。",
        "year": "2003",
        "category": "历史传记",
        "description": "《我们仨》是杨绛先生晚年回忆丈夫钱锺书和女儿钱瑗的散文集。全书分为两部分，第一部分以梦境的形式讲述了亲人离散的痛苦，第二部分回忆了三人一家六十年来相守相助的点滴时光，文字质朴深情，感人至深。"
    },
    "人生的枷锁": {
        "author": "[英] 威廉·萨默塞特·毛姆",
        "authorDetail": "毛姆，英国小说家、剧作家。",
        "year": "1915",
        "category": "小说文学",
        "description": "《人生的枷锁》是毛姆的半自传体长篇小说。主人公菲利普天生跛足，敏感孤僻。在成长的过程中，他经历了宗教信仰的幻灭、爱情的折磨和职业选择的迷茫，最终摆脱了种种精神枷锁，找到了适合自己的人生道路。"
    },
    "看不见的城市": {
        "author": "[意] 伊塔洛·卡尔维诺",
        "authorDetail": "卡尔维诺，意大利当代最著名的小说家之一。",
        "year": "1972",
        "category": "小说文学",
        "description": "《看不见的城市》是一部充满想象力的奇书。书中借马可·波罗之口，向忽必烈讲述了他所游历过的五十五座虚构的城市。这些城市由记忆、欲望、符号等构成，是对现代城市文明的隐喻和反思。"
    },
    "海子的诗": {
        "author": "海子",
        "authorDetail": "海子，中国当代著名诗人。",
        "year": "1995",
        "category": "小说文学",
        "description": "海子是中国当代诗坛的传奇，他的诗歌充满了神秘感、神性色彩和对土地、麦地、太阳等意象的执着。本书收录了他最著名的诗篇，如《面朝大海，春暖花开》、《祖国（以梦为马）》等，展现了他燃烧的生命力。"
    },
    "巨人的陨落": {
        "author": "[英] 肯·福莱特",
        "authorDetail": "肯·福莱特，通俗小说大师。",
        "year": "2010",
        "category": "小说文学",
        "description": "《巨人的陨落》是“世纪三部曲”的第一部。以一战为背景，通过五个家族的命运纠葛，展现了那段波澜壮阔的历史。书中融合了战争、爱情、政治阴谋等元素，情节跌宕起伏，是一部令人欲罢不能的历史通俗小说。"
    },
    "飞鸟集": {
        "author": "[印] 泰戈尔",
        "authorDetail": "泰戈尔，印度诗人、哲学家，诺贝尔文学奖得主。",
        "year": "1916",
        "category": "小说文学",
        "description": "《飞鸟集》是泰戈尔的代表作之一，收录了三百余首格言式的短诗。这些诗歌短小精悍，清新隽永，充满了对自然、爱与生命的哲思，如飞鸟般轻灵，却能给人以深刻的启迪。"
    },
    "人生的智慧": {
        "author": "[德] 叔本华",
        "authorDetail": "叔本华，德国著名哲学家。",
        "year": "1851",
        "category": "人文社科",
        "description": "《人生的智慧》是叔本华流传最广的著作之一。他从哲学的高度，探讨了如何度过幸福的一生。书中关于健康、财富、名誉以及独处等话题的论述，冷静透彻，对现代人依然具有极大的指导意义。"
    },
    "教父": {
        "author": "[美] 马里奥·普佐",
        "authorDetail": "马里奥·普佐，美国作家、编剧。",
        "year": "1969",
        "category": "小说文学",
        "description": "《教父》是黑帮小说的巅峰之作。讲述了美国黑手党柯里昂家族在老教父维托和新教父迈克尔两代人的领导下，在腥风血雨中生存和发展的故事。小说深入刻画了权力的本质、家族的羁绊以及男人的责任。"
    },
    "檀香刑": {
        "author": "莫言",
        "authorDetail": "莫言，中国首位诺贝尔文学奖得主。",
        "year": "2001",
        "category": "小说文学",
        "description": "《檀香刑》是莫言的代表作之一。小说以清末民初为背景，通过讲述一种残酷刑罚“檀香刑”的实施过程，展现了民间艺人、刽子手、官员等各色人物的命运，充满了瑰丽的想象和对本土文化的深刻挖掘。"
    },
    "面纱": {
        "author": "[英] 威廉·萨默塞特·毛姆",
        "authorDetail": "毛姆，英国小说家。",
        "year": "1925",
        "category": "小说文学",
        "description": "《面纱》讲述了爱慕虚荣的凯蒂为了报复出轨的丈夫，随其前往霍乱流行的中国内地行医的故事。在面对生死和苦难的过程中，凯蒂逐渐摆脱了精神的枷锁，获得了个人的觉醒和心灵的救赎。"
    },
    "人间草木": {
        "author": "汪曾祺",
        "authorDetail": "汪曾祺，中国当代作家、散文家。",
        "year": "1991",
        "category": "小说文学",
        "description": "《人间草木》是汪曾祺的散文集。他以淡雅质朴的文字，描写了花草树木、虫鱼鸟兽以及各地的风土人情。字里行间流露出对生活的热爱和独特的文人雅趣，读来令人心旷神怡。"
    },
    "我的天才女友": {
        "author": "[意] 埃莱娜·费兰特",
        "authorDetail": "埃莱娜·费兰特，意大利神秘作家。",
        "year": "2011",
        "category": "小说文学",
        "description": "《我的天才女友》是“那不勒斯四部曲”的第一部。讲述了两个女孩莉拉和埃莱娜在战后那不勒斯贫困社区的成长故事。小说细腻地刻画了女性之间复杂而微妙的友谊，以及环境对个人命运的塑造。"
    }
}

def fix_metadata():
    mockdata_path = Path("src/data/mockData.js")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    count = 0
    for title, meta in METADATA.items():
        print(f"正在修复: {title}")
        
        # 1. 替换 Author
        # 匹配 title: "书名", author: "..." 
        # 注意：这里需要跨行匹配，且不使用 re.escape(title) 以防特殊字符问题，但 title 通常安全
        # 稳健的正则：title:\s*"{re.escape(title)}".*?author:\s*"[^"]*"
        
        # 为了避免匹配太宽，我们使用非贪婪匹配
        # 更新 Author
        content = re.sub(
            rf'(title:\s*"{re.escape(title)}".*?author:\s*)"[^"]*"', 
            rf'\1"{meta["author"]}"', 
            content, 
            flags=re.DOTALL, 
            count=1
        )
        
        # 更新 AuthorDetail
        content = re.sub(
            rf'(title:\s*"{re.escape(title)}".*?authorDetail:\s*)"[^"]*"', 
            rf'\1"{meta["authorDetail"]}"', 
            content, 
            flags=re.DOTALL, 
            count=1
        )
        
        # 更新 Year
        content = re.sub(
            rf'(title:\s*"{re.escape(title)}".*?year:\s*)"[^"]*"', 
            rf'\1"{meta["year"]}"', 
            content, 
            flags=re.DOTALL, 
            count=1
        )
        
        # 更新 Category
        content = re.sub(
            rf'(title:\s*"{re.escape(title)}".*?category:\s*)"[^"]*"', 
            rf'\1"{meta["category"]}"', 
            content, 
            flags=re.DOTALL, 
            count=1
        )
        
        # 更新 Description
        desc = meta["description"].replace('\n', '\\n').replace('"', '\\"')
        content = re.sub(
            rf'(title:\s*"{re.escape(title)}".*?description:\s*)"[^"]*"', 
            rf'\1"{desc}"', 
            content, 
            flags=re.DOTALL, 
            count=1
        )
        
        count += 1
        print(f"✓ 已处理: {title}")

    with open(mockdata_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\n✅ 成功更新 {count} 本书的元数据")

if __name__ == "__main__":
    fix_metadata()
