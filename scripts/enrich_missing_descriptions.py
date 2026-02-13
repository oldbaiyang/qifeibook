#!/usr/bin/env python3
"""
自动补充缺失书籍信息 (基于 AI 生成内容)
"""

import re
from pathlib import Path

# 针对缺失简介的10本书生成的内容
book_info = {
    "三国演义（全二册）": {
        "description": "《三国演义》是中国古典四大名著之一，描写了从东汉末年到西晋初年之间近一百年的历史风云。全书反映了三国时代的政治军事斗争，反映了三国时代各类社会矛盾的渗透与转化，概括了这一时代的历史巨变，塑造了一批咤叱风云的英雄人物。",
        "authorDetail": "罗贯中，元末明初小说家，中国古典四大名著作者之一。"
    },
    "福尔摩斯探案全集（上中下）": {
        "description": "《福尔摩斯探案全集》是英国作家阿瑟·柯南·道尔创作的侦探小说集，主角歇洛克·福尔摩斯是一位才华横溢的咨询侦探。全集收录了《血字的研究》、《四签名》、《巴斯克维尔的猎犬》、《恐怖谷》等4部长篇小说和56部短篇小说，展示了福尔摩斯惊人的观察力和逻辑推理能力。",
        "authorDetail": "阿瑟·柯南·道尔，英国作家，医生，因塑造了夏洛克·福尔摩斯这一侦探形象而闻名世界。"
    },
    "重构契丹早期史": {
        "description": "本书综合利用汉文文献和契丹文字资料，对契丹早期的起源传说、部族结构、社会形态以及建立辽朝前的历史进行了深入考证和重构。作者通过严谨的史料梳理，对许多传统观点提出了挑战和修正，是研究契丹史和辽史的重要学术著作。",
        "authorDetail": "康鹏，历史学者，专注于辽金史、民族史研究。"
    },
    "蛋镇诗社": {
        "description": "《蛋镇诗社》是一部充满奇幻色彩和乡土气息的小说。作者虚构了一个名为“蛋镇”的地方，那里的人们热爱诗歌，生活与诗意交织。小说通过一系列荒诞而温情的故事，展现了小镇居民的日常生活、喜怒哀乐以及他们对美好事物的执着追求，探讨了文学与生活的关系。",
        "authorDetail": "朱山坡，广西著名作家，其作品风格独特，擅长描绘南方小镇的魔幻现实。"
    },
    "黛莱丝的一生": {
        "description": "《黛莱丝的一生》是诺贝尔文学奖得主弗朗索瓦·莫里亚克的代表作。小说讲述了主人公黛莱丝因厌倦沉闷的家庭生活而企图毒死丈夫，最终被家庭放逐到巴黎的故事。作者以细腻的心理描写，刻画了一个在传统道德与个人欲望之间挣扎的女性形象，深刻揭示了资产阶级家庭的虚伪和压抑。",
        "authorDetail": "弗朗索瓦·莫里亚克，法国小说家，1952年诺贝尔文学奖得主。"
    },
    "交子：世界金融史的中国贡献": {
        "description": "本书详细讲述了北宋时期四川地区产生的世界上第一张纸币“交子”的诞生、发展及其背后的经济逻辑。作者将交子置于世界金融史的宏大背景下考察，探讨了中国古代金融创新的智慧及其对后世的影响，是一部兼具学术性和可读性的经济史著作。",
        "authorDetail": "李劼，经济史研究者，致力于中国古代金融史的梳理与解析。"
    },
    "敌友难辨：冷战谍海逸史": {
        "description": "本书聚焦于冷战时期的间谍战，挖掘了许多鲜为人知的历史细节。作者通过解密档案和当事人回忆，还原了美苏双方在情报领域的激烈较量，讲述了双重间谍、叛逃者以及情报人员在忠诚与背叛之间的挣扎，展现了冷战大背景下个人命运的波折。",
        "authorDetail": "本·麦金泰尔（Ben Macintyre），英国历史学家、专栏作家，擅长谍战纪实写作。"
    },
    "聪明人说话前在想什么？": {
        "description": "说话不仅是沟通的工具，更是思维的体现。本书深入分析了聪明人在开口说话前的思维过程，包括如何倾听、如何快速组织语言、如何换位思考以及如何控制情绪。通过丰富的案例和实用技巧，帮助读者提升沟通能力，学会像聪明人一样思考和表达。",
        "authorDetail": "田中泰延，日本知名广告策划人、自由撰稿人，以犀利幽默的文字风格著称。"
    },
    "愚蠢的核弹：古巴导弹危机新史": {
        "description": "本书利用最新的解密档案，重新审视了1962年的古巴导弹危机。作者挑战了传统的叙事，揭示了危机期间美苏双方领导人的误判、混乱以及核战争一触即发的惊险时刻。书中指出，危机的和平解决更多是由于运气而非高超的策略，是一部发人深省的历史著作。",
        "authorDetail": "沙希利·浦洛基（Serhii Plokhy），哈佛大学乌克兰史教授，多部历史畅销书作者。"
    },
    "明熹宗传：木匠皇帝朱由校": {
        "description": "明熹宗朱由校是明朝第15位皇帝，因酷爱木工而被称为“木匠皇帝”。本书详细记述了他短暂而充满争议的一生，包括他与魏忠贤的关系、任由宦官专权导致朝政腐败的过程，以及他在位期间明朝内忧外患的局势。作者力图还原一个真实的明熹宗形象。",
        "authorDetail": "樊树志，复旦大学历史系教授，明史研究权威专家。"
    }
}

# 读取 mockData.ts (注意路径)
mockdata_path = Path("src/data/mockData.ts")
if not mockdata_path.exists():
    mockdata_path = Path("data/mockData.ts")

with open(mockdata_path, "r", encoding="utf-8") as f:
    content = f.read()

count = 0
# 更新每本书的信息
for title, info in book_info.items():
    if title not in content:
        # 尝试模糊匹配或跳过
        print(f"⚠️ 未找到书籍: {title}")
        continue

    print(f"更新: {title}")
    
    # 构建正则表达式以匹配特定书籍的块
    # 假设格式: { ... title: "Title", ... }
    # 我们需要找到包含 title 的那个对象块，并替换其中的 description 和 authorDetail
    
    # 策略 1: 简单替换 author: "..." (如果原本是空的或短的)
    # 但这里我们要针对特定 title。
    # 我们可以先定位到 title，然后向后查找 description: "..."
    # 或者向前查找 author: "..."
    
    # 正则查找： title: "Title" ... description: "OldDesc"
    # 注意: description 可能在前也可能在后，而且可能有换行
    
    # 更加稳健的方法：
    # 匹配 { ... title: "Title" ... } 整个块，然后替换内部
    
    # 由于文件可能很大，简单的正则替换可能出错。
    # 这里的 mockData 格式比较规范。
    
    # 替换 description
    # 查找: title: "Title", ... description: "..." 
    # 或者: description: "...", ... title: "Title"
    
    # 让我们假设 title 在 description 之前或附近。
    # 我们用 re.sub 结合函数来处理
    
    def replace_desc(match):
        block = match.group(0)
        # 在这个块内替换 description
        new_desc = info['description'].replace('"', '\\"').replace('\n', '\\n')
        # 替换现有的 description: "..." 或 "description": "..."
        # 能够匹配多行 description
        block = re.sub(r'(["\']?description["\']?:\s*)"(?:[^"\\]|\\.)*"', f'\\1"{new_desc}"', block, flags=re.DOTALL)
        
        # 替换 authorDetail (如果存在对应 key)
        if 'authorDetail' in info:
             new_detail = info['authorDetail']
             # 如果原块中有 authorDetail
             if re.search(r'["\']?authorDetail["\']?:', block):
                 block = re.sub(r'(["\']?authorDetail["\']?:\s*)"(?:[^"\\]|\\.)*"', f'\\1"{new_detail}"', block)
             else:
                 # 如果没有，插入到 author 后面
                 # 查找 author: "..." 或 "author": "..."
                 block = re.sub(r'((["\']?author["\']?:\s*".*?",))', f'\\1\n    authorDetail: "{new_detail}",', block)
                 
        return block

    # 匹配包含特定 title 的整个对象块 {}
    # 支持 title: "Title" 或 "title": "Title"
    # 关键修改: [^{]*? 确保匹配到的是 title 所属的那个 { (即之间没有其他 {)
    pattern = rf'({{([^{{]*?)(?:["\']?title["\']?:\s*"{re.escape(title)}").*?}})'
    
    new_content, n = re.subn(pattern, replace_desc, content, flags=re.DOTALL)
    
    if n > 0:
        content = new_content
        count += 1
        print(f"  ✅ 成功更新")
    else:
        print(f"  ❌ 未匹配到数据块")

# 写回文件
with open(mockdata_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\n✅ 共更新 {count} 本书的信息")
