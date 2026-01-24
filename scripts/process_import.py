
import json
import re
import os
import ast

# Internal Knowledge Base
METADATA_DB = {
    "城南旧事": {
        "author": "林海音",
        "authorDetail": "林海音（1918－2001），中国现代著名女作家。",
        "year": "1960",
        "description": "《城南旧事》是著名女作家林海音的自传体小说，以其七岁到十三岁的生活为背景，透过主角英子童稚的双眼，向世人展现了大人世界的悲欢离合，有一种说不出来的天真，却道尽人世复杂的情感。",
        "category": "小说文学",
        "publishYear": "1960"
    },
    "肖申克的救赎": {
        "author": "[美] 斯蒂芬·金",
        "authorDetail": "斯蒂芬·金，美国现代惊悚小说大师。",
        "year": "1982",
        "description": "《肖申克的救赎》展现了斯蒂芬·金最温情的一面。这本书收录了他的四部中篇小说，其中最为人熟知的便是《肖申克的救赎》。故事讲述了安迪·杜弗雷纳被误控杀妻入狱，在肖申克监狱中凭借智慧与希望，最终获得自由的传奇经历。",
        "category": "小说文学",
        "publishYear": "1982"
    },
    "江城": {
        "author": "[美] 彼得·海斯勒",
        "authorDetail": "彼得·海斯勒（Peter Hessler），中文名何伟，美国作家、记者。",
        "year": "2001",
        "description": "《江城》是彼得·海斯勒（何伟）的中国纪实三部曲之一。1996年，作者作为“和平队”志愿者来到中国长江边的城市涪陵，在当地师专担任英语教师。书中记录了他在涪陵两年的生活经历，以及对中国社会的观察与思考。",
        "category": "人文社科",
        "publishYear": "2001"
    },
    "朝花夕拾": {
        "author": "鲁迅",
        "authorDetail": "鲁迅，中国现代文学奠基人。",
        "year": "1928",
        "description": "《朝花夕拾》是鲁迅先生唯一的一部回忆性散文集，原名《旧事重提》。收录了《狗·猫·鼠》《阿长与〈山海经〉》《二十四孝图》《五猖会》《无常》《从百草园到三味书屋》《父亲的病》《琐记》《藤野先生》《范爱农》等十篇作品。",
        "category": "小说文学",
        "publishYear": "1928"
    },
    "基督山伯爵": {
        "author": "[法] 大仲马",
        "authorDetail": "大仲马，19世纪法国浪漫主义作家。",
        "year": "1844",
        "description": "《基督山伯爵》是通俗历史小说，法国著名作家大仲马（父）的代表作。讲述了水手爱德蒙·邓蒂斯受人陷害含冤入狱，在狱中结识了神甫法里亚，在这位疯狂“学者”的指点下，邓蒂斯成功越狱并找到了巨额宝藏，化名基督山伯爵展开复仇的故事。",
        "category": "小说文学",
        "publishYear": "1844"
    },
    "万历十五年": {
        "author": "黄仁宇",
        "authorDetail": "黄仁宇，美籍华裔历史学家。",
        "year": "1981",
        "description": "《万历十五年》是黄仁宇的成名之作。作者以大历史观的角度，通过对万历十五年（1587年）发生的一些看似微不足道的小事的叙述，剖析了明朝中后期的社会政治状况，揭示了中国传统社会走向衰落的深层原因。",
        "category": "人文社科",
        "publishYear": "1981"
    },
    "秋园": {
        "author": "杨本芬",
        "authorDetail": "杨本芬，80岁才开始写作的素人作家。",
        "year": "2020",
        "description": "《秋园》讲述了“妈妈”秋园一位普通中国女性在剧变时代中的生存故事。她的一生经历了种种苦难，却始终保持着坚韧与尊严。这本书被誉为“女性版的《活着》”。",
        "category": "小说文学",
        "publishYear": "2020"
    },
    "霍乱时期的爱情": {
        "author": "[哥伦比亚] 加西亚·马尔克斯",
        "authorDetail": "加西亚·马尔克斯，诺贝尔文学奖得主，《百年孤独》作者。",
        "year": "1985",
        "description": "《霍乱时期的爱情》是马尔克斯最著名的爱情小说。小说讲述了一段跨越半个多世纪的爱情史诗，穷尽了所有爱情的可能性，被誉为“人类有史以来最伟大的爱情小说”。",
        "category": "小说文学",
        "publishYear": "1985"
    },
    "艺术的故事": {
        "author": "[英] 贡布里希",
        "authorDetail": "E.H.贡布里希，英国艺术史家。",
        "year": "1950",
        "description": "《艺术的故事》是有关艺术史的著名畅销书。概括地叙述了从最早的洞窟绘画到当今的实验艺术的发展历程，阐述了艺术史发展的内在逻辑，是由于其通俗易懂的语言和严谨的学术态度而备受推崇。",
        "category": "人文艺术",
        "publishYear": "1950"
    },
    "置身事内": {
        "author": "兰小欢",
        "authorDetail": "兰小欢，复旦大学经济学院教授。",
        "year": "2021",
        "description": "《置身事内：中国政府与经济发展》将经济学原理与中国经济发展的实践有机融合，以地方政府投融资为主线，深入浅出地论述了中国经济的发展模式，解释了许多复杂的经济现象。",
        "category": "人文社科",
        "publishYear": "2021"
    },
    "厌女": {
        "author": "[日] 上野千鹤子",
        "authorDetail": "上野千鹤子，日本著名社会学家，女性主义学者。",
        "year": "2010",
        "description": "《厌女》是上野千鹤子的经典代表作。书中通过对“厌女症”这一概念的剖析，揭示了性别二元制下男女不平等的深层根源，以及厌女心理在社会文化中的各种表现形式。",
        "category": "人文社科",
        "publishYear": "2010"
    },
    "射雕英雄传": {
        "author": "金庸",
        "authorDetail": "金庸，武侠小说泰斗。",
        "year": "1957",
        "description": "《射雕英雄传》是金庸“射雕三部曲”的第一部。小说以宋宁宗庆元五年至成吉思汗逝世这段历史为背景，反映了南宋抵抗金国与蒙古两大强敌的斗争，塑造了郭靖、黄蓉等鲜活的人物形象。",
        "category": "小说文学",
        "publishYear": "1957"
    },
    "月亮和六便士": {
        "author": "[英] 威廉·萨默塞特·毛姆",
        "authorDetail": "毛姆，英国小说家、剧作家。",
        "year": "1919",
        "description": "《月亮和六便士》以法国画家高更为原型，讲述了证券经纪人斯特里克兰德人到中年，突然抛妻弃子，离家出走，去追寻绘画梦想的故事。月亮代表高高在上的理想，六便士代表现实的世俗生活。",
        "category": "小说文学",
        "publishYear": "1919"
    },
    "西游记（全二册）": {
        "author": "吴承恩",
        "authorDetail": "吴承恩，明代小说家。",
        "year": "16世纪",
        "description": "《西游记》是中国古代第一部浪漫主义章回体长篇神魔小说。主要讲述了孙悟空、猪八戒、沙僧、白龙马辅助唐僧西天取经，历经九九八十一难，最终修成正果的故事。",
        "category": "小说文学",
        "publishYear": "1592"
    },
    "无人生还": {
        "author": "[英] 阿加莎·克里斯蒂",
        "authorDetail": "阿加莎·克里斯蒂，推理女王。",
        "year": "1939",
        "description": "《无人生还》是阿加莎·克里斯蒂最著名的作品之一，开创了“暴风雪山庄”模式。八个素不相识的人受邀来到海岛上的别墅，晚餐时被指控犯有谋杀罪。随即，他们一个接一个地死去，死状与童谣描述的一模一样……",
        "category": "小说文学",
        "publishYear": "1939"
    },
    "树上的男爵": {
        "author": "[意] 伊塔洛·卡尔维诺",
        "authorDetail": "卡尔维诺，意大利当代最具有世界影响的作家之一。",
        "year": "1957",
        "description": "《树上的男爵》是卡尔维诺“我们的祖先”三部曲之一。讲述了12岁的柯希莫因为拒绝吃蜗牛，愤而爬上树，发誓永不落地，从此一生都在树上度过的奇特故事。他在树上建立了自己的王国，参与了当时的各种社会活动，展现了对自由和自我的坚持。",
        "category": "小说文学",
        "publishYear": "1957"
    }
}

MOCK_DATA_PATH = "src/data/mockData.js"

def parse_link_content(raw_str):
    url = ""
    try:
        if raw_str.startswith("["):
            lst = ast.literal_eval(raw_str)
            for item in lst:
                if item.get('type') == 'url':
                    url = item.get('link') or item.get('text')
                    break
        else:
            url = raw_str
    except:
        pass
    return url

def get_max_id(content):
    ids = re.findall(r'id:\s*(\d+)', content)
    if ids:
        return max(map(int, ids))
    return 0

def process_import():
    # 1. Read filtered books
    with open("filtered_books.json", "r", encoding="utf-8") as f:
        feishu_books = json.load(f)
    
    # 2. Read existing mockData to find max ID
    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        existing_content = f.read()
    
    current_id = get_max_id(existing_content)
    print(f"Current Max ID: {current_id}")
    
    new_book_entries = []
    
    for book in feishu_books:
        current_id += 1
        title = book.get('title', '').strip()
        cover_raw = book.get('cover', '')
        cover = parse_link_content(cover_raw)
        
        quark_raw = book.get('quark', '')
        quark_url = parse_link_content(quark_raw)
        
        baidu_raw = book.get('baidu', '')
        baidu_url = parse_link_content(baidu_raw)
        baidu_code = "0000"
        if "?pwd=" in baidu_url:
            parts = baidu_url.split("?pwd=")
            if len(parts) > 1:
                baidu_code = parts[1]

        # Cleanup query params from baidu url for display? No keep it.
        
        meta = METADATA_DB.get(title, {
            "author": "Unknown",
            "authorDetail": "",
            "year": "Unknown",
            "description": "暂无简介",
            "category": "其他",
            "publishYear": "Unknown"
        })
        
        new_entry = f"""  {{
    id: {current_id},
    title: "{title}",
    author: "{meta['author']}",
    authorDetail: "{meta['authorDetail']}",
    year: "{meta['year']}",
    cover: "{cover}",
    description: "{meta['description']}",
    category: "{meta['category']}",
    downloadLinks: [
      {{
        name: "夸克网盘",
        url: "{quark_url}"
      }},
      {{
        name: "百度网盘",
        url: "{baidu_url}",
        code: "{baidu_code}"
      }}
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "{meta['publishYear']}"
  }},"""
        new_book_entries.append(new_entry)
        
    print(f"Prepared {len(new_book_entries)} new entries.")
    
    # 3. Append to mockData.js
    # We need to insert before the closing '];' or just find the last object.
    # Assuming the file ends with '];\n' or similar.
    
    # Find the last closing brace and comma, or just the end of array
    # A robust way is to replace the last '];' with our entries + '];'
    
    # NOTE: The file might have comments or whitespace.
    # Let's simple naive replace: search for the last '}' and append comma and new entries.
    # Wait, the structure is `export const books = [ ... ];`
    
    if "];" in existing_content:
        # Easy case
        parts = existing_content.rsplit("];", 1)
        new_content = parts[0].rstrip() + ",\n" + "\n".join(new_book_entries) + "\n];" + parts[1]
        
        with open(MOCK_DATA_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {MOCK_DATA_PATH}")
    else:
        print("Error: Could not find closing bracket in mockData.js")
        return

if __name__ == "__main__":
    process_import()
