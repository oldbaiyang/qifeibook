export interface DownloadLink {
  name: string;
  url: string;
  code?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  authorDetail: string;
  year: string;
  cover: string;
  description: string;
  category: string;
  downloadLinks: DownloadLink[];
  size: string;
  format: string;
  publishYear: string;
}

export const books: Book[] = [
  {
    id: 1,
    title: "哈利·波特全集",
    author: "J.K. Rowling",
    authorDetail: "J.K. Rowling [英]",
    year: "2000-2007",
    cover: "https://img.aqifei.top/img/2026/01/20260109003428345",
    description: `《哈利·波特》（Harry Potter）是英国作家J.K.罗琳（J. K. Rowling）于1997年至2007年间所著的魔幻文学系列小说，共7部。该系列被翻译成73种语言，所有版本总销售量超过4.5亿本，名列世界上最畅销小说系列。
    
    本全集包含《哈利·波特与魔法石》、《哈利·波特与密室》、《哈利·波特与阿兹卡班的囚徒》、《哈利·波特与火焰杯》、《哈利·波特与凤凰社》、《哈利·波特与混血王子》以及大结局《哈利·波特与死亡圣器》。
    
    故事的主角哈利·波特是一名年幼的巫师，他自幼父母双亡，寄居在刻薄的姨妈家里。在11岁生日那天，他收到了霍格沃茨魔法学校的录取通知书，从此踏入了一个充满神奇与冒险的魔法世界。在这里，他结识了挚友罗恩·韦斯莱和赫敏·格兰杰，并在邓布利多校长的指引下，学习各种魔法课程，参与惊心动魄的魁地奇比赛，探索霍格沃茨城堡的秘密。
    
    然而，魔法世界并非总是风平浪静。史上最危险的黑巫师伏地魔，那个杀害了哈利父母的凶手，正试图卷土重来，妄图统治整个魔法世界。哈利发现自己与伏地魔之间存在着神秘的联系，这一宿命将两人紧紧纠缠。随着哈利的成长，他不仅要面对青春期的烦恼、学业的压力，更要逐步揭开伏地魔复活的阴谋，寻找并摧毁伏地魔的魂器。
    
    整个系列小说情节跌宕起伏，悬念丛生。从初入魔法世界的惊奇与温馨，到后期对抗黑暗势力的沉重与牺牲，罗琳为读者构建了一个庞大而严谨的魔法世界观。书中探讨了爱、友谊、勇气、选择以及死亡等深刻主题。哈利与朋友们在面对困难和危险时展现出的无畏精神，以及为了通过爱与正义战胜邪恶所付出的努力，深深打动了全球亿万读者的心。这不仅仅是一部儿童文学，更是一部关于成长的史诗。`,
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/cf944b266963"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1nVmUXsXNyx2pq8GQIs_zug?pwd=0000",
        code: "0000"
      }
    ],
    size: "10MB",
    format: "epub, mobi, azw3, pdf",
    publishYear: "2000-2007",
  },
  {
    id: 2,
    title: "明朝那些事儿(套装全7册)",
    author: "当年明月",
    authorDetail: "当年明月 [中]",
    year: "2006-2009",
    cover: "https://img.aqifei.top/img/2026/01/20260109162804278",
    description: "《明朝那些事儿》主要讲述的是从1344年到1644年这三百年间关于明朝的一些故事。以史料为基础，以年代和具体人物为主线，并加入了小说的笔法，语言幽默风趣。对明朝十七帝和其他王公权贵和小人物的命运进行全景展示，尤其对官场政治、战争、帝王心术着墨最多，并加入对当时政治经济制度、人伦道德的演义。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4d8bfc5c0bfe"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YxR23j2peqN1xk_2bEGDUg?pwd=0000",
        code: "0000"
      }
    ],
    size: "Unknown",
    format: "epub, mobi, azw3, pdf",
    publishYear: "2006-2009",
  },
  {
    id: 3,
    title: "膝盖之上",
    author: "小春多梦",
    authorDetail: "小春多梦 [中]",
    year: "2023",
    cover: "https://img.aqifei.top/img/2026/01/20260122155108270",
    description: "《膝盖之上》讲述了留学生陈斯绒在法拉利F1车队实习期间，与她的顶头上司罗曼·凯撒（Roman Caesar）之间发生的一段充满张力的爱情故事。陈斯绒在职场压力下寻求心理寄托，意外发现她在网络上依赖的Dom竟然就是她在现实生活中敬畏的上司。两人在从“上下级”到“恋人”的关系转变中，共同面对内心的挣扎与职业的挑战，最终治愈彼此。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3e05c115e989"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1fZmaPE4Z5qKk-o_8l7zlCA?pwd=tm7p",
        code: "tm7p"
      }
    ],
    size: "Unknown",
    format: "epub, mobi, azw3, pdf",
    publishYear: "2023",
  },
  {
    id: 4,
    title: "九诗心",
    author: "黄晓丹",
    authorDetail: "黄晓丹 [中]",
    year: "2024",
    cover: "https://img.aqifei.top/img/2026/01/20260122160753650",
    description: "《九诗心：暗夜里的文学启明》是一部古典诗歌研究著作，探讨了古诗如何回应时代的变局和生活的处境。书中选取了屈原、李陵、曹丕、陶渊明、杜甫、欧阳修、李清照、文天祥、吴梅村等九位在动荡中求索人生方向的诗人，以细腻的笔触挖掘他们不为人知的一面。作者通过扎实的文献校勘和文史互证，展现了这些诗人在面对孤独、流亡、生死等困境时，如何将痛苦转化为文学表达，并在大的时代纷乱中获得个体的从容和内心的稳定。",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ba20aa8982ff"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Bg6vPQKRn-6JX0OKpsaqFA?pwd=0000",
        code: "0000"
      }
    ],
    size: "Unknown",
    format: "epub, mobi, azw3, pdf",
    publishYear: "2024",
  },
  {
    id: 5,
    title: "红楼梦",
    author: "曹雪芹",
    authorDetail: "曹雪芹 [清]",
    year: "1791",
    cover: "https://img.aqifei.top/img/2026/01/20260122204247304",
    description: "《红楼梦》，中国古代章回体长篇小说，中国古典四大名著之一，一般认为是清代作家曹雪芹所著。小说以贾、史、王、薛四大家族的兴衰为背景，以富贵公子贾宝玉为视角，以贾宝玉与林黛玉、薛宝钗的爱情婚姻悲剧为主线，描绘了一批举止见识出于须眉之上的闺阁佳人的人生百态，展现了真正的人性美和悲剧美，可以说是一部从各个角度展现女性美以及中国古代社会世态百相的史诗性著作。",
    category: "古典文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8f9236a8436e"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1_haN-On6B4ajnlr1LACx-w?pwd=0000",
        code: "0000"
      }
    ],
    size: "Unknown",
    format: "epub, mobi, azw3, pdf",
    publishYear: "1791",
  },
  {
    id: 6,
    title: "活着",
    author: "余华",
    authorDetail: "余华,当代著名作家,中国先锋文学代表人物",
    year: "1993",
    cover: "https://img.aqifei.top/img/2026/01/huozhe_cover_1769100595309",
    description: "地主少爷富贵嗜赌成性,终于赌光了家业一贫如洗。穷困之中的富贵因为母亲生病前去求医,没想到半路上被国民党部队抓了壮丁,后被解放军所俘虏,回到家乡他才知道母亲已经去世,妻子家珍含辛茹苦带大了一双儿女,但女儿不幸变成了聋哑人,儿子机灵活泼……",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3ef7601d780d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1cLqbOh1ZUjw7dkJ1fNeRKA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 7,
    title: "三体全集",
    author: "刘慈欣",
    authorDetail: "刘慈欣,中国科幻小说代表作家,雨果奖得主",
    year: "2008",
    cover: "https://img.aqifei.top/img/2026/01/santi_cover_1769100754655",
    description: "文化大革命如火如荼地进行,天文学家叶文洁在其间历经劫难,被带到军方绝秘计划'红岸工程'。叶文洁以太阳为天线,向宇宙发出地球文明的第一声啼鸣,取得了探寻外星文明的突破性进展。三颗无规则运行的太阳主导下,四光年外的'三体文明'百余次毁灭与重生,正被逼迫不得不逃离母星,而恰在此时,他们接收到了地球发来的信息……",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0bc4efa3a22d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ImUoyRme7Kto_520jn3wjA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 8,
    title: "百年孤独",
    author: "[哥伦比亚] 加西亚·马尔克斯",
    authorDetail: "加西亚·马尔克斯,哥伦比亚作家,诺贝尔文学奖得主,魔幻现实主义文学代表",
    year: "1967",
    cover: "https://img.aqifei.top/img/2026/01/006_%E7%99%BE%E5%B9%B4%E5%AD%A4%E7%8B%AC",
    description: "《百年孤独》是魔幻现实主义文学的代表作,描写了布恩迪亚家族七代人的传奇故事,以及加勒比海沿岸小镇马孔多的百年兴衰,反映了拉丁美洲一个世纪以来风云变幻的历史。作品融入神话传说、民间故事、宗教典故等因素,巧妙地糅合了现实与虚幻,展现出一个瑰丽的想象世界。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/91903cd664b7",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1z6r98_pIv1m6SRAanqx4ng",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 9,
    title: "飘",
    author: "[美] 玛格丽特·米切尔",
    authorDetail: "玛格丽特·米切尔,美国作家,《飘》是其唯一的长篇小说",
    year: "1936",
    cover: "https://img.aqifei.top/img/2026/01/007_%E9%A3%98",
    description: "《飘》是一部有关战争的小说,但作者没有把着眼点放在战场上。除了亚特兰大之围,作者详细描述过战争,其余的战争场面几乎都是一笔带过。她以女性特有的细腻、真切和委婉,从女主人公的心理感受上反映战争的动荡和残酷,塑造了郝思嘉这个性格复杂、极富魅力的女性形象。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fbb2fb362c85",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1gu-vTvY8XI3G1ocn1FBZog",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 10,
    title: "动物农场",
    author: "[英] 乔治·奥威尔",
    authorDetail: "乔治·奥威尔,英国作家,《1984》《动物农场》作者",
    year: "1945",
    cover: "https://img.aqifei.top/img/2026/01/008_%E5%8A%A8%E7%89%A9%E5%86%9C%E5%9C%BA",
    description: "农场的一群动物成功地进行了一场'革命',将压榨他们的人类东家赶出农场,建立起一个平等的动物社会。然而,动物领袖,那些聪明的猪们最终却篡夺了革命的果实,成为比人类东家更加独裁和极权的统治者。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7a292b491c0e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/12G71NXNtGWe8ji7WM7ja9w",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 11,
    title: "房思琪的初恋乐园",
    author: "林奕含",
    authorDetail: "林奕含,台湾作家,本书是其唯一一部长篇小说",
    year: "2017",
    cover: "https://img.aqifei.top/img/2026/01/009_%E6%88%BF%E6%80%9D%E7%90%AA%E7%9A%84%E5%88%9D%E6%81%8B%E4%B9%90%E5%9B%AD",
    description: "令人心碎却无能为力的真实故事。向死而生的文学绝唱。李银河、张悦然、冯唐、詹宏志、蒋方舟 万千读者 强力推荐!这是一部惊人而特别的小说,小说作者既具有高度敏锐的感受力、又是一个近乎疯狂的语言天才。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3d6b0f692dc8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1k3mnJIDrxWRrORhlmpjPtQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 12,
    title: "三国演义（全二册）",
    author: "[明] 罗贯中",
    authorDetail: "罗贯中,元末明初小说家,中国古典长篇章回小说四大名著之一《三国演义》作者",
    year: "明代",
    cover: "https://img.aqifei.top/img/2026/01/010_%E4%B8%89%E5%9B%BD%E6%BC%94%E4%B9%89%EF%BC%88%E5%85%A8%E4%BA%8C%E5%86%8C%EF%BC%89",
    description: "三国演义（全二册）",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ecb69f8fdfb4",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1D1Rt6id3GtbIrsg-fVcCHg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 13,
    title: "福尔摩斯探案全集（上中下）",
    author: "[英] 阿瑟·柯南·道尔",
    authorDetail: "阿瑟·柯南·道尔,英国作家,侦探小说之父,福尔摩斯系列创作者",
    year: "1887-1927",
    cover: "https://img.aqifei.top/img/2026/01/011_%E7%A6%8F%E5%B0%94%E6%91%A9%E6%96%AF%E6%8E%A2%E6%A1%88%E5%85%A8%E9%9B%86%EF%BC%88%E4%B8%8A%E4%B8%AD%E4%B8%8B%EF%BC%89",
    description: "福尔摩斯探案全集（上中下）",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/192a5978a1d1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ISC1Ma6X-Wrf06GhkbMFcw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 14,
    title: "白夜行",
    author: "[日] 东野圭吾",
    authorDetail: "东野圭吾,日本推理小说家,代表作《白夜行》《嫌疑人X的献身》等",
    year: "1999",
    cover: "https://img.aqifei.top/img/2026/01/012_%E7%99%BD%E5%A4%9C%E8%A1%8C",
    description: "《白夜行》将无望却坚守的凄凉爱情和执著而缜密的冷静推理完美结合。一九七三年,大阪一栋废弃建筑内发现一名遭利器刺死的男子。此后十九年,嫌疑人之女雪穗与被害者之子桐原亮司走上截然不同的人生道路,一个跻身上流社会,一个却在底层游走,而他们身边的人,却接二连三地离奇死去,警察经过十九年的艰辛追踪,终于使真相大白……",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1b5f8805ac56",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1fgKH8JE92uz0teC2ebjqUA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 15,
    title: "呐喊",
    author: "鲁迅",
    authorDetail: "鲁迅,中国现代文学的奠基人之一,伟大的文学家、思想家、革命家",
    year: "1923",
    cover: "https://img.aqifei.top/img/2026/01/nahan_cover_1769101171677",
    description: "《呐喊》是鲁迅1918年至1922年所作的短篇小说的结集,收有《狂人日记》《孔乙己》《药》《阿Q正传》《故乡》等14篇作品。当时正值'五四运动'时期,作者创作小说意在描写'病态社会的不幸的人们',揭示旧中国的社会问题,唤醒麻木的中国民众。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/23c14a222059",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1KQ_cehgyDboDYRNgu7pLaQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 16,
    title: "小王子",
    author: "[法] 圣埃克苏佩里",
    authorDetail: "圣埃克苏佩里,法国作家、飞行员,《小王子》作者",
    year: "1943",
    cover: "https://img.aqifei.top/img/2026/01/015_%E5%B0%8F%E7%8E%8B%E5%AD%90",
    description: "小王子是一个超凡脱俗的仙童,他住在一颗只比他大一丁点儿的小行星上。陪伴他的是一朵他非常喜爱的小玫瑰花。但玫瑰花的虚荣心伤害了小王子对她的感情。小王子告别小行星,开始了遨游太空的旅行。他先后访问了六个行星,各种见闻使他陷入忧伤,他感到大人们荒唐可笑、太不正常。",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7008bdde6339",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1yROrPfvs8IfWG5qpRRDH8w",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 17,
    title: "安徒生童话故事集",
    author: "[丹麦] 安徒生",
    authorDetail: "安徒生,丹麦作家,世界著名童话作家",
    year: "1835-1872",
    cover: "https://img.aqifei.top/img/2026/01/016_%E5%AE%89%E5%BE%92%E7%94%9F%E7%AB%A5%E8%AF%9D%E6%95%85%E4%BA%8B%E9%9B%86",
    description: "《安徒生童话》是丹麦作家安徒生创作的童话集。该作爱憎分明,热情歌颂劳动人民、赞美他们的善良和纯洁的优秀品德;无情地揭露和批判王公贵族们的愚蠢、无能、贪婪和残暴。其中较为闻名的故事有《小美人鱼》、《丑小鸭》、《卖火柴的小女孩》、《拇指姑娘》等。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/9b93b29f8e27",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1HXzAYXSDjUoodcfK99CBFQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 18,
    title: "撒哈拉的故事",
    author: "三毛",
    authorDetail: "三毛,台湾著名女作家,本名陈懋平",
    year: "1976",
    cover: "https://img.aqifei.top/img/2026/01/017_%E6%92%92%E5%93%88%E6%8B%89%E7%9A%84%E6%95%85%E4%BA%8B",
    description: "三毛作品中最膾炙人口的《撒哈拉的故事》,是她在撒哈拉沙漠生活时的见闻,以及她思考和感怀的结晶。不论是爱情、友谊、还是对大自然的热爱,都反映在她的作品里,广受读者喜爱。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d9df6e2a26da",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1P_KEd37SxbLjtT6BP96jXw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 19,
    title: "失踪的孩子",
    author: "[意] 埃莱娜·费兰特",
    authorDetail: "埃莱娜·费兰特,意大利作家,'那不勒斯四部曲'作者",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/01/018_%E5%A4%B1%E8%B8%AA%E7%9A%84%E5%AD%A9%E5%AD%90",
    description: "《失踪的孩子》是'那不勒斯四部曲'的第四部,也是完结篇。时间跨度长达半个世纪。通过莉拉和埃莱娜的个人命运、恩怨纠葛,描绘了二战后意大利政治、经济和社会状况的变迁,展现了一幅意大利现当代的史诗画卷。",
    category: "亲子教育",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/aaf04d88373a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ToiBGAfyT8JCkQaQD6Gr_A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 20,
    title: "天龙八部",
    author: "金庸",
    authorDetail: "金庸,本名查良镛,武侠小说泰斗,香港'四大才子'之一",
    year: "1963",
    cover: "https://img.aqifei.top/img/2026/01/tianlong_cover_1769101187012",
    description: "《天龙八部》以宋哲宗时代为背景,通过宋、辽、大理、西夏、吐蕃等王国之间的武林恩怨和民族矛盾,从哲学的高度对人生和社会进行审视和描写,展示了一幅波澜壮阔的生活画卷,将人性、情感和浩 然正气发挥到了极致。其故事之离奇曲折、涉及人物之众多、历史背景之广泛、武侠战役之庞大、想象力之丰富,当属'金书'之最。",
    category: "武侠仙侠",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f869c985a33b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YKfIjHTAD-7QBbzLsotfyA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 21,
    title: "卡拉马佐夫兄弟",
    author: "[俄] 陀思妥耶夫斯基",
    authorDetail: "陀思妥耶夫斯基,19世纪俄国批判现实主义作家",
    year: "1880",
    cover: "https://img.aqifei.top/img/2026/01/karamazov_cover_1769101204306",
    description: "《卡拉马佐夫兄弟》是陀思妥耶夫斯基的代表作之一,也是他的最后一部小说。小说通过一桩真实发生过的弑父案,描写老卡拉马佐夫同三个儿子即两代人之间的尖锐冲突。老卡拉马佐夫贪婪好色,独占妻子留给儿子们的遗产,并与长子德米特里为一个风流女子争风吃醋。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f2b20745310f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/12pJ3jxyPmey6PfTBObx2-A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 22,
    title: "新名字的故事",
    author: "[意] 埃莱娜·费兰特",
    authorDetail: "埃莱娜·费兰特,意大利当代匿名作家,'那不勒斯四部曲'作者",
    year: "2012",
    cover: "https://img.aqifei.top/img/2026/01/new_name_story_cover_1769137830172",
    description: "《新名字的故事》是'那不勒斯四部曲'的第二部,描述了莉拉和埃莱娜的青年时代。在她们的人生中,痛苦和幸福、愤怒和压抑、希望和绝望依然紧紧交织。她们在各自的生活中努力挣扎,试图找到属于自己的位置。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a9ae562485ca",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1JqpOLmXigcb2aQ-TpyVecA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 23,
    title: "杀死一只知更鸟",
    author: "[美] 哈珀·李",
    authorDetail: "哈珀·李,美国作家,普利策小说奖得主",
    year: "1960",
    cover: "https://img.aqifei.top/img/2026/01/022_%E6%9D%80%E6%AD%BB%E4%B8%80%E5%8F%AA%E7%9F%A5%E6%9B%B4%E9%B8%9F",
    description: "《杀死一只知更鸟》讲述了20世纪30年代美国南方一个小镇上,律师阿提克斯为一名被指控强奸白人女子的黑人辩护的故事。小说通过两个孩子的视角,展现了种族偏见、社会不公以及成长的阵痛,是一部感人至深的经典之作。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bfcdaf434f30",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1LWnA4cJjy2crcc9FH4ffMQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 24,
    title: "野草",
    author: "鲁迅",
    authorDetail: "鲁迅,中国现代文学奠基人",
    year: "1927",
    cover: "https://img.aqifei.top/img/2026/01/024_%E9%87%8E%E8%8D%89",
    description: "《野草》是鲁迅先生唯一的一部散文诗集,收录了他在1924年至1926年间创作的23篇散文诗。作品以隐晦的象征、富于诗意的意象和充满张力的语言,表达了作者对现实的绝望、抗争以及对生命意义的深刻思考。",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/958a250e7cdb",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1BwWGmgsOIw5eaQ4t4sqlcA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 25,
    title: "沉默的大多数",
    author: "王小波",
    authorDetail: "王小波,中国当代著名学者、作家",
    year: "1997",
    cover: "https://img.aqifei.top/img/2026/01/026_%E6%B2%89%E9%BB%98%E7%9A%84%E5%A4%A7%E5%A4%9A%E6%95%B0",
    description: "《沉默的大多数》是王小波的一部杂文随笔集。作者以幽默智慧的笔触,对社会现象、文化传统、人性心理等进行了深入的剖析和批判,倡导自由、理性、独立的思考精神。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/20550325982e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/19VrO0tD0qSnrHEjgY-kb0A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 26,
    title: "罗杰疑案",
    author: "[英] 阿加莎·克里斯蒂",
    authorDetail: "阿加莎·克里斯蒂,英国侦探小说女王",
    year: "1926",
    cover: "https://img.aqifei.top/img/2026/01/027_%E7%BD%97%E6%9D%B0%E7%96%91%E6%A1%88",
    description: "《罗杰疑案》是阿加莎·克里斯蒂的成名作,也是侦探小说史上的经典之作。小说讲述了住在金艾博特村的富翁罗杰·艾克罗伊德离奇身亡,大侦探波洛介入调查的故事。结局出人意料,开创了侦探小说的一种全新模式。",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/299a9e58020d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YS0BpDaEXB9MyQ3kbLlVoQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 27,
    title: "悉达多",
    author: "[德] 赫尔曼·黑塞",
    authorDetail: "赫尔曼·黑塞,德国作家,诺贝尔文学奖得主",
    year: "1922",
    cover: "https://img.aqifei.top/img/2026/01/028_%E6%82%89%E8%BE%BE%E5%A4%9A",
    description: "《悉达多》讲述了古印度贵族青年悉达多为了追求心灵的安宁和生命的真谛,离家出走,历经各种人生体验,最终在流水的启示下悟道的故事。这是一部关于自我发现和精神成长的寓言。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/896fef00a279",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1kEVhCsNPAg4yzHUHTDXa4Q",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 28,
    title: "我与地坛",
    author: "史铁生",
    authorDetail: "史铁生,中国当代著名作家",
    year: "1991",
    cover: "https://img.aqifei.top/img/2026/01/029_%E6%88%91%E4%B8%8E%E5%9C%B0%E5%9D%9B",
    description: "《我与地坛》是史铁生的散文代表作。作者身患残疾,在最狂妄的年龄失去了双腿。他在地坛的古园中沉思冥想,对生命、死亡、命运等终极问题进行了深刻的感悟。文字深沉凝重,感人肺腑。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5a7dc43ef8ce",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1x_vA_nnsJTnacvY_J2OUrQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 29,
    title: "许三观卖血记",
    author: "余华",
    authorDetail: "余华,中国当代先锋文学代表作家",
    year: "1995",
    cover: "https://img.aqifei.top/img/2026/01/030_%E8%AE%B8%E4%B8%89%E8%A7%82%E5%8D%96%E8%A1%80%E8%AE%B0",
    description: "《许三观卖血记》讲述了丝厂送茧工许三观靠卖血度过人生一个个难关的故事。小说以卖血为主线,串联起许三观的一生,展现了小人物在苦难生活中的生存智慧和顽强生命力。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/37793dd949a8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/19Q2boiSsBkgYq1tKXLOvlw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 30,
    title: "彷徨",
    author: "鲁迅",
    authorDetail: "鲁迅,中国现代文学奠基人",
    year: "1926",
    cover: "https://img.aqifei.top/img/2026/01/031_%E5%BD%B7%E5%BE%A8",
    description: "《彷徨》是鲁迅的第二部小说集,收录了他在1924年至1925年间创作的11篇小说,包括《祝福》《在酒楼上》《伤逝》等。作品反映了五四运动后知识分子的苦闷和彷徨,以及对社会现实的深刻批判。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b01d79543fe5",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1XPDIHk_yTMtEnDfO2NK2NQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 31,
    title: "局外人",
    author: "[法] 阿尔贝·加缪",
    authorDetail: "阿尔贝·加缪,法国作家、哲学家,存在主义文学代表人物,诺贝尔文学奖得主",
    year: "1942",
    cover: "https://img.aqifei.top/img/2026/01/stranger_camus_cover_1769137886125",
    description: "《局外人》是加缪的成名作。小说塑造了默尔索这个'局外人'形象,他对母亲的死、女友的感情、杀人等都表现得冷漠无动于衷。小说揭示了世界的荒诞性以及人与社会的疏离。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1625454f849e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1DQtOKJfvNV0EDyzw3dmmuQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 32,
    title: "白鹿原",
    author: "陈忠实",
    authorDetail: "陈忠实,中国当代著名作家,茅盾文学奖得主",
    year: "1993",
    cover: "https://img.aqifei.top/img/2026/01/033_%E7%99%BD%E9%B9%BF%E5%8E%9F",
    description: "《白鹿原》是一部渭河平原50年变迁的雄奇史诗,一轴中国农村斑斓多彩、触目惊心的长幅画卷。小说以白嘉轩为叙事核心,描写了白鹿两家三代人的恩怨纠葛,展现了从清末民初到建国之初中国农村的历史演变。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f0177e4b262a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1jB2c6NoAz7Y7EQ9Ry8jUcQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 33,
    title: "乡土中国",
    author: "费孝通",
    authorDetail: "费孝通,中国著名社会学家、人类学家",
    year: "1947",
    cover: "https://img.aqifei.top/img/2026/01/034_%E4%B9%A1%E5%9C%9F%E4%B8%AD%E5%9B%BD",
    description: "《乡土中国》是费孝通先生的一部社会学经典著作。书中探讨了中国基层传统社会结构及其运作逻辑,提出了'差序格局'、'礼治秩序'、'无讼'等重要概念,深刻剖析了中国乡土社会的特点。",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8ceb6400a7cf",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1UWTD2UFCKZOWv6US0AtN0w",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 34,
    title: "平凡的世界（全三部）",
    author: "路遥",
    authorDetail: "路遥,中国当代作家,茅盾文学奖得主",
    year: "1986",
    cover: "https://img.aqifei.top/img/2026/01/035_%E5%B9%B3%E5%87%A1%E7%9A%84%E4%B8%96%E7%95%8C%EF%BC%88%E5%85%A8%E4%B8%89%E9%83%A8%EF%BC%89",
    description: "《平凡的世界》是一部全景式地表现中国当代城乡社会生活的长篇小说。小说以孙少安和孙少平两兄弟为中心,刻画了当时社会各阶层众多普通人的形象;劳动与爱情、挫折与追求、痛苦与欢乐、日常生活与巨大社会冲突纷繁地交织在一起,深刻地展示了普通人在大时代历史进程中所走过的艰难曲折的道路。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4a768f98c6d8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1wAQY2KgqwkpMK6ABANxasA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 35,
    title: "人类简史",
    author: "[以] 尤瓦尔·赫拉利",
    authorDetail: "尤瓦尔·赫拉利,以色列历史学家",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/036_%E4%BA%BA%E7%B1%BB%E7%AE%80%E5%8F%B2",
    description: "《人类简史:从动物到上帝》从大历史的视角,审视了人类历史上的三次革命:认知革命、农业革命和科学革命。作者以新颖的观点和宏大的视野,探讨了人类如何从一种不起眼的动物演变为地球的主宰,以及人类社会的未来走向。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/85aa2770d791",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1smgFTJrobagz6SnpKTgIdg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 36,
    title: "围城",
    author: "钱钟书",
    authorDetail: "钱钟书,中国现代著名学者、作家",
    year: "1947",
    cover: "https://img.aqifei.top/img/2026/01/037_%E5%9B%B4%E5%9F%8E",
    description: "《围城》是钱钟书先生唯一的一部长篇小说,被誉为'新儒林外史'。小说以方鸿渐的经历为主线,描绘了抗战初期知识分子的群像,揭示了'围城'困境:城外的人想冲进去,城里的人想逃出来。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/516c123922ff",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/16urEJQxnt-16RpX4oS8B_g",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 37,
    title: "笑傲江湖（全四册）",
    author: "金庸",
    authorDetail: "金庸,武侠小说泰斗",
    year: "1967",
    cover: "https://img.aqifei.top/img/2026/01/xiaoao_jianghu_cover_1769137848494",
    description: "《笑傲江湖》属于金庸的后期作品。小说通过叙述华山派大弟子令狐冲的经历,反映了武林各派争霸夺权的血腥斗争,揭露了伪君子和野心家的丑恶面目,歌颂了令狐冲追求自由、不畏强权的独立人格。",
    category: "武侠仙侠",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/789e85f6e6b3",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1tR1XhjtPe83y_EKsxhElSQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 38,
    title: "献给阿尔吉侬的花束",
    author: "[美] 丹尼尔·凯斯",
    authorDetail: "丹尼尔·凯斯,美国作家,心理学家",
    year: "1959",
    cover: "https://img.aqifei.top/img/2026/01/039_%E7%8C%AE%E7%BB%99%E9%98%BF%E5%B0%94%E5%90%89%E4%BE%AC%E7%9A%84%E8%8A%B1%E6%9D%9F",
    description: "查理·高登是低智商者,他参加了一项提高智力的实验手术。手术后,他的智商逐渐提高,变成了一个天才。然而,他发现原本的朋友和同事开始排斥他,他也发现了社会中隐藏的残酷真相。同时,同样接受手术的实验白鼠阿尔吉侬出现了退化现象,预示着查理的命运......",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/837da4b14c90",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1H9BTizUuydmJF-qxcjnl5g",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 39,
    title: "东方快车谋杀案",
    author: "[英] 阿加莎·克里斯蒂",
    authorDetail: "阿加莎·克里斯蒂,侦探小说女王",
    year: "1934",
    cover: "https://img.aqifei.top/img/2026/01/040_%E4%B8%9C%E6%96%B9%E5%BF%AB%E8%BD%A6%E8%B0%8B%E6%9D%80%E6%A1%88",
    description: "午夜过后,一场大雪迫使东方快车停了下来。侦探波洛在列车上。第二天早上,大家发现萨缪埃尔·雷切特死在了他的包厢里,身中十二刀。车上的乘客都有嫌疑,波洛展开了调查,最终揭开了一个惊人的秘密。",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3750135cda50",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1AsNMnLUBHUsXsvVFvubO6A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 40,
    title: "故事新编",
    author: "鲁迅",
    authorDetail: "鲁迅,中国现代文学奠基人",
    year: "1936",
    cover: "https://img.aqifei.top/img/2026/01/041_%E6%95%85%E4%BA%8B%E6%96%B0%E7%BC%96",
    description: "《故事新编》是鲁迅的最后一部小说集,收录了他在1922年至1935年间创作的8篇历史小说。作者以远古神话和历史传说为题材,注入现代意识,进行了大胆的改编和重构,充满了奇特的想象和辛辣的讽刺。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/45cd53792d6f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1xgBdJEbYMQ-M1UEVm82mUQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 41,
    title: "城南旧事",
    author: "林海音",
    authorDetail: "林海音（1918－2001），中国现代著名女作家。",
    year: "1960",
    cover: "https://img.aqifei.top/img/2026/01/042_%E5%9F%8E%E5%8D%97%E6%97%A7%E4%BA%8B",
    description: "《城南旧事》是著名女作家林海音的自传体小说，以其七岁到十三岁的生活为背景，透过主角英子童稚的双眼，向世人展现了大人世界的悲欢离合，有一种说不出来的天真，却道尽人世复杂的情感。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e9c1264b2616"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/11oxtjSj8E-jCAmUm-tjmcQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1960"
  },
  {
    id: 42,
    title: "肖申克的救赎",
    author: "[美] 斯蒂芬·金",
    authorDetail: "斯蒂芬·金，美国现代惊悚小说大师。",
    year: "1982",
    cover: "https://img9.doubanio.com/view/subject/s/public/s4007145.jpg",
    description: "《肖申克的救赎》展现了斯蒂芬·金最温情的一面。这本书收录了他的四部中篇小说，其中最为人熟知的便是《肖申克的救赎》。故事讲述了安迪·杜弗雷纳被误控杀妻入狱，在肖申克监狱中凭借智慧与希望，最终获得自由的传奇经历。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7c47641857cf"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1x3_E9oG4g6nQdEjo36qZ0Q?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1982"
  },
  {
    id: 43,
    title: "江城",
    author: "[美] 彼得·海斯勒",
    authorDetail: "彼得·海斯勒（Peter Hessler），中文名何伟，美国作家、记者。",
    year: "2001",
    cover: "https://img.aqifei.top/img/2026/01/044_%E6%B1%9F%E5%9F%8E",
    description: "《江城》是彼得·海斯勒（何伟）的中国纪实三部曲之一。1996年，作者作为“和平队”志愿者来到中国长江边的城市涪陵，在当地师专担任英语教师。书中记录了他在涪陵两年的生活经历，以及对中国社会的观察与思考。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b122918d6ffb"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1oxefRP9avFOTSi5xTRniwQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2001"
  },
  {
    id: 44,
    title: "朝花夕拾",
    author: "鲁迅",
    authorDetail: "鲁迅，中国现代文学奠基人。",
    year: "1928",
    cover: "https://img.aqifei.top/img/2026/01/045_%E6%9C%9D%E8%8A%B1%E5%A4%95%E6%8B%BE",
    description: "《朝花夕拾》是鲁迅先生唯一的一部回忆性散文集，原名《旧事重提》。收录了《狗·猫·鼠》《阿长与〈山海经〉》《二十四孝图》《五猖会》《无常》《从百草园到三味书屋》《父亲的病》《琐记》《藤野先生》《范爱农》等十篇作品。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8288c900f48c"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1zv8xzuTNxjamYMMJ6ZodaA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1928"
  },
  {
    id: 45,
    title: "基督山伯爵",
    author: "[法] 大仲马",
    authorDetail: "大仲马，19世纪法国浪漫主义作家。",
    year: "1844",
    cover: "https://img9.doubanio.com/view/subject/s/public/s3248016.jpg",
    description: "《基督山伯爵》是通俗历史小说，法国著名作家大仲马（父）的代表作。讲述了水手爱德蒙·邓蒂斯受人陷害含冤入狱，在狱中结识了神甫法里亚，在这位疯狂“学者”的指点下，邓蒂斯成功越狱并找到了巨额宝藏，化名基督山伯爵展开复仇的故事。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f428289da1c9"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1nx3DEidl-L7kb4-0ys7Pgw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1844"
  },
  {
    id: 46,
    title: "万历十五年",
    author: "黄仁宇",
    authorDetail: "黄仁宇，美籍华裔历史学家。",
    year: "1981",
    cover: "https://img9.doubanio.com/view/subject/s/public/s1800355.jpg",
    description: "《万历十五年》是黄仁宇的成名之作。作者以大历史观的角度，通过对万历十五年（1587年）发生的一些看似微不足道的小事的叙述，剖析了明朝中后期的社会政治状况，揭示了中国传统社会走向衰落的深层原因。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d316f1a9dbf5"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/12gb1y91iTIyDS7wsQOCGZg?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1981"
  },
  {
    id: 47,
    title: "秋园",
    author: "杨本芬",
    authorDetail: "杨本芬，80岁才开始写作的素人作家。",
    year: "2020",
    cover: "https://img.aqifei.top/img/2026/01/048_%E7%A7%8B%E5%9B%AD",
    description: "《秋园》讲述了“妈妈”秋园一位普通中国女性在剧变时代中的生存故事。她的一生经历了种种苦难，却始终保持着坚韧与尊严。这本书被誉为“女性版的《活着》”。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e20a37ca8107"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1zLahtxLfZE2kZW-yjcStNg?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2020"
  },
  {
    id: 48,
    title: "霍乱时期的爱情",
    author: "[哥伦比亚] 加西亚·马尔克斯",
    authorDetail: "加西亚·马尔克斯，诺贝尔文学奖得主，《百年孤独》作者。",
    year: "1985",
    cover: "https://img.aqifei.top/img/2026/01/049_%E9%9C%8D%E4%B9%B1%E6%97%B6%E6%9C%9F%E7%9A%84%E7%88%B1%E6%83%85",
    description: "《霍乱时期的爱情》是马尔克斯最著名的爱情小说。小说讲述了一段跨越半个多世纪的爱情史诗，穷尽了所有爱情的可能性，被誉为“人类有史以来最伟大的爱情小说”。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4cea718a45d5"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1mkdFbr4ALVLWRgKNcj6V4Q?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1985"
  },
  {
    id: 49,
    title: "艺术的故事",
    author: "[英] 贡布里希",
    authorDetail: "E.H.贡布里希，英国艺术史家。",
    year: "1950",
    cover: "https://img.aqifei.top/img/2026/01/050_%E8%89%BA%E6%9C%AF%E7%9A%84%E6%95%85%E4%BA%8B",
    description: "《艺术的故事》是有关艺术史的著名畅销书。概括地叙述了从最早的洞窟绘画到当今的实验艺术的发展历程，阐述了艺术史发展的内在逻辑，是由于其通俗易懂的语言和严谨的学术态度而备受推崇。",
    category: "艺术设计",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/59f77bc4347d"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1s79ErWqOBaXd2JkDeL9c5Q?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1950"
  },
  {
    id: 50,
    title: "置身事内",
    author: "兰小欢",
    authorDetail: "兰小欢，复旦大学经济学院教授。",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/051_%E7%BD%AE%E8%BA%AB%E4%BA%8B%E5%86%85",
    description: "《置身事内：中国政府与经济发展》将经济学原理与中国经济发展的实践有机融合，以地方政府投融资为主线，深入浅出地论述了中国经济的发展模式，解释了许多复杂的经济现象。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/241201af5143"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1zV1CNKQwvHf5q2MG0fRMJA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2021"
  },
  {
    id: 51,
    title: "厌女",
    author: "[日] 上野千鹤子",
    authorDetail: "上野千鹤子，日本著名社会学家，女性主义学者。",
    year: "2010",
    cover: "https://img.aqifei.top/img/2026/01/052_%E5%8E%8C%E5%A5%B3",
    description: "《厌女》是上野千鹤子的经典代表作。书中通过对“厌女症”这一概念的剖析，揭示了性别二元制下男女不平等的深层根源，以及厌女心理在社会文化中的各种表现形式。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/42a40e6f767f"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1d5Or43XFweMuYHKep2SOlw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2010"
  },
  {
    id: 52,
    title: "射雕英雄传",
    author: "金庸",
    authorDetail: "金庸，武侠小说泰斗。",
    year: "1957",
    cover: "https://img9.doubanio.com/view/subject/s/public/s2157336.jpg",
    description: "《射雕英雄传》是金庸“射雕三部曲”的第一部。小说以宋宁宗庆元五年至成吉思汗逝世这段历史为背景，反映了南宋抵抗金国与蒙古两大强敌的斗争，塑造了郭靖、黄蓉等鲜活的人物形象。",
    category: "武侠仙侠",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a4f6f43f9c0f"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1p5KrO8-8eMHH8Wl3TaAStA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1957"
  },
  {
    id: 53,
    title: "月亮和六便士",
    author: "[英] 威廉·萨默塞特·毛姆",
    authorDetail: "毛姆，英国小说家、剧作家。",
    year: "1919",
    cover: "https://img.aqifei.top/img/2026/01/054_%E6%9C%88%E4%BA%AE%E5%92%8C%E5%85%AD%E4%BE%BF%E5%A3%AB",
    description: "《月亮和六便士》以法国画家高更为原型，讲述了证券经纪人斯特里克兰德人到中年，突然抛妻弃子，离家出走，去追寻绘画梦想的故事。月亮代表高高在上的理想，六便士代表现实的世俗生活。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/87d8de2ada7c"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1JlahBHpHj8ka8Hiy_869XQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1919"
  },
  {
    id: 54,
    title: "西游记（全二册）",
    author: "吴承恩",
    authorDetail: "吴承恩，明代小说家。",
    year: "16世纪",
    cover: "https://img9.doubanio.com/view/subject/s/public/s1627374.jpg",
    description: "《西游记》是中国古代第一部浪漫主义章回体长篇神魔小说。主要讲述了孙悟空、猪八戒、沙僧、白龙马辅助唐僧西天取经，历经九九八十一难，最终修成正果的故事。",
    category: "古典文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/798789cc7ab9"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Z37owwZJngo26tz6vfVo3A?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1592"
  },
  {
    id: 55,
    title: "无人生还",
    author: "[英] 阿加莎·克里斯蒂",
    authorDetail: "阿加莎·克里斯蒂，推理女王。",
    year: "1939",
    cover: "https://img.aqifei.top/img/2026/01/056_%E6%97%A0%E4%BA%BA%E7%94%9F%E8%BF%98",
    description: "《无人生还》是阿加莎·克里斯蒂最著名的作品之一，开创了“暴风雪山庄”模式。八个素不相识的人受邀来到海岛上的别墅，晚餐时被指控犯有谋杀罪。随即，他们一个接一个地死去，死状与童谣描述的一模一样……",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4b207fe1fb18"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1yNItt9Tb3FUAptSlx1s3SQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1939"
  },
  {
    id: 56,
    title: "树上的男爵",
    author: "[意] 伊塔洛·卡尔维诺",
    authorDetail: "卡尔维诺，意大利当代最具有世界影响的作家之一。",
    year: "1957",
    cover: "https://img9.doubanio.com/view/subject/s/public/s8968135.jpg",
    description: "《树上的男爵》是卡尔维诺“我们的祖先”三部曲之一。讲述了12岁的柯希莫因为拒绝吃蜗牛，愤而爬上树，发誓永不落地，从此一生都在树上度过的奇特故事。他在树上建立了自己的王国，参与了当时的各种社会活动，展现了对自由和自我的坚持。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/182d735c26c3"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1cSDEDag-irEz1GqX0oxdVA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1957"
  },
  {
    id: 57,
    title: "追风筝的人",
    author: "[美] 卡勒德·胡赛尼",
    authorDetail: "卡勒德·胡赛尼，美籍阿富汗裔作家。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/058_%E8%BF%BD%E9%A3%8E%E7%AD%9D%E7%9A%84%E4%BA%BA",
    description: "《追风筝的人》讲述了12岁的阿富汗富家少爷阿米尔与仆人哈桑情同手足。然而，在一次风筝比赛后，发生了一件悲惨不堪的事，阿米尔为自己的懦弱感到自责和痛苦，逼走了哈桑。多年以后，阿米尔为了赎罪，再次踏上故土……",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5fe5536ec0ec"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/11Fakp5rKN-pM3USVdAXknA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2003"
  },
  {
    id: 58,
    title: "寻路中国",
    author: "[美] 彼得·海斯勒",
    authorDetail: "彼得·海斯勒（何伟），美国作家、记者。",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/059_%E5%AF%BB%E8%B7%AF%E4%B8%AD%E5%9B%BD",
    description: "《寻路中国》是“中国纪实三部曲”的最终卷。作者驾车漫游中国，从乡村到城市，记录了中国社会的巨大变迁，探寻了普通人在现代化进程中的命运。",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/da86e7967235"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1xnLHIROlAeEungbgS6qFQw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2011"
  },
  {
    id: 59,
    title: "刀锋",
    author: "[英] 威廉·萨默塞特·毛姆",
    authorDetail: "毛姆，英国著名小说家。",
    year: "1944",
    cover: "https://img.aqifei.top/img/2026/01/060_%E5%88%80%E9%94%8B",
    description: "《刀锋》是毛姆的代表作之一。小说写一个参加一战的美国青年飞行员拉里，在目睹战友牺牲后，寻找人生意义的过程。他拒绝了优渥的生活，游历世界，最终在古老的东方找到了灵魂的归宿。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8de2d1756bab"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1kTbLbYvmJQlQGhuOjh1PhA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1944"
  },
  {
    id: 60,
    title: "格林童话全集",
    author: "[德] 格林兄弟",
    authorDetail: "格林兄弟，德国民间文学搜集整编者。",
    year: "1812",
    cover: "https://img.aqifei.top/img/2026/01/061_%E6%A0%BC%E6%9E%97%E7%AB%A5%E8%AF%9D%E5%85%A8%E9%9B%86",
    description: "《格林童话》是德国格林兄弟搜集、整理的德国民间文学童话集。收录了《灰姑娘》、《白雪公主》、《小红帽》、《睡美人》等脍炙人口的故事，是世界儿童文学的瑰宝。",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0e2d2ef081e8"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Ft-NIpcX06MzAxINU8g7Rw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1812"
  },
  {
    id: 61,
    title: "太白金星有点烦",
    author: "马伯庸",
    authorDetail: "马伯庸，著名作家。",
    year: "2023",
    cover: "https://img.aqifei.top/img/2026/01/taibai_venus_cover_1769415361385",
    description: "《太白金星有点烦》是马伯庸的“见微知著”系列历史小说。借太白金星的视角，讲述了西天取经项目背后的繁杂职场故事，将神话故事解构为职场生存指南，幽默诙谐中透着对人性的洞察。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e455e54ea0b8"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Jw9JSUa3TJ6G_5HZwo53uA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2023"
  },
  {
    id: 62,
    title: "可能性的艺术",
    author: "刘瑜",
    authorDetail: "刘瑜，清华大学政治学系副教授。",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/01/possibility_politcs_cover_1769415345343",
    description: "《可能性的艺术：比较政治学30讲》是刘瑜老师关于比较政治学的普及读物。书中通过对不同国家政治制度的比较分析，探讨了民主、转型、国家能力等核心政治议题，引导读者建立一种比较的、开放的政治视野。",
    category: "艺术设计",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/059c25c1a5d8"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/16ODoMzjrCVyEHGxH0cC-qQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2022"
  },
  {
    id: 63,
    title: "刘擎西方现代思想讲义",
    author: "刘擎",
    authorDetail: "刘擎，华东师范大学紫江特聘教授。",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/065_%E5%88%98%E6%93%8E%E8%A5%BF%E6%96%B9%E7%8E%B0%E4%BB%A3%E6%80%9D%E6%83%B3%E8%AE%B2%E4%B9%89",
    description: "《刘擎西方现代思想讲义》通过梳理韦伯、尼采、萨特等19位著名思想家的学术思想，清晰地展现了西方现代思想的演变脉络，帮助读者理解现代人的困境与出路。",
    category: "哲学思想",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bfbdf97f4af9"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1c9NOlSxRmzraP-a22DYl4w?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2021"
  },
  {
    id: 64,
    title: "鼠疫",
    author: "[法] 阿尔贝·加缪",
    authorDetail: "加缪，诺贝尔文学奖得主。",
    year: "1947",
    cover: "https://img.aqifei.top/img/2026/01/066_%E9%BC%A0%E7%96%AB",
    description: "《鼠疫》讲述了阿尔及利亚的奥兰发生瘟疫，突如其来的灾难让人措手不及。在封城的状态下，人们经历了恐惧、绝望、反抗与团结。小说通过对鼠疫的描写，象征了战争、灾难以及人类生存的荒谬境况。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1e36deee6ab0"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1tNiEcMC83BeG-K6_psZ-Pg?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1947"
  },
  {
    id: 65,
    title: "嫌疑人X的献身",
    author: "[日] 东野圭吾",
    authorDetail: "东野圭吾，日本推理小说天王。",
    year: "2005",
    cover: "https://img.aqifei.top/img/2026/01/suspect_x_cover_1769415425738",
    description: "《嫌疑人X的献身》是东野圭吾的巅峰之作。数学天才石神为了守护心爱的女人，设计了一个天衣无缝的诡计，与物理学教授汤川学展开了一场高智商的对决。小说探讨了爱情的极致与牺牲。",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b24ca83bc44c"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1-1NpoCA2f81kyKPwBZYT2w?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2005"
  },
  {
    id: 66,
    title: "一间只属于自己的房间",
    author: "[英] 弗吉尼亚·伍尔夫",
    authorDetail: "伍尔夫，英国现代主义作家，女性主义先驱。",
    year: "1929",
    cover: "https://img.aqifei.top/img/2026/01/068_%E4%B8%80%E9%97%B4%E5%8F%AA%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84%E6%88%BF%E9%97%B4",
    description: "《一间只属于自己的房间》是女性主义文学的里程碑之作。伍尔夫在书中提出“女性如果要写作，由于性别的限制，她必须要有钱和一间属于自己的房间”，深刻剖析了女性在文学创作和历史中的地位。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1e7163949e13"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1DBbwviXlzVlSOYM59lLShQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1929"
  },
  {
    id: 67,
    title: "孽子",
    author: "白先勇",
    authorDetail: "白先勇，当代著名作家。",
    year: "1983",
    cover: "https://img.aqifei.top/img/2026/01/069_%E5%AD%BD%E5%AD%90",
    description: "《孽子》是白先勇唯一的长篇小说。以20世纪70年代台北新公园为背景，描写了一群被家庭和社会遗弃的同性恋少年的生存状态和情感纠葛，展现了他们对爱与归属的渴望以及父子关系的复杂。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1accd2d48387"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1P_BLJuf1zC0p8ay2iNbpsQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1983"
  },
  {
    id: 68,
    title: "傲慢与偏见",
    author: "[英] 简·奥斯汀",
    authorDetail: "简·奥斯汀，英国著名女性小说家。",
    year: "1813",
    cover: "https://img.aqifei.top/img/2026/01/070_%E5%82%B2%E6%85%A2%E4%B8%8E%E5%81%8F%E8%A7%81",
    description: "《傲慢与偏见》是简·奥斯汀的代表作。小说以达西和伊丽莎白的爱情故事为主线，描写了19世纪初英国乡绅阶层的婚姻和生活。通过对“傲慢”与“偏见”的消解，探讨了婚姻、金钱与爱情的关系。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/211affd3cd27"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/16_CJbzTxC1S0UGYiTckPgA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1813"
  },
  {
    id: 69,
    title: "黄金时代",
    author: "王小波",
    authorDetail: "王小波，当代著名学者、作家。",
    year: "1994",
    cover: "https://img.aqifei.top/img/2026/01/071_%E9%BB%84%E9%87%91%E6%97%B6%E4%BB%A3",
    description: "《黄金时代》是王小波的代表作之一。小说以“文革”时期为背景，讲述了知青王二和医生陈清扬的爱情故事。作者以幽默、荒诞的笔触，表现了对人性的压抑与反抗，以及对自由的追求。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/643568c72547"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1KUXUEcyHAWAjKSNlZyqlPw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1994"
  },
  {
    id: 70,
    title: "台北人",
    author: "白先勇",
    authorDetail: "白先勇，当代著名作家。",
    year: "1971",
    cover: "https://img.aqifei.top/img/2026/01/taipei_people_cover_1769415409304",
    description: "《台北人》是白先勇的短篇小说集。收录了《永远的尹雪艳》、《金大班的最后一夜》等14篇作品。描写了随着国民党撤退到台湾的各阶层人物的生活和心态，展现了今昔之比的沧桑感和历史的无常。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bd1802b17854"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1sjalW8pHGGJVnZYJn9Tgug?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1971"
  },
  {
    id: 71,
    title: "四世同堂",
    author: "老舍",
    authorDetail: "老舍，杰出的语言大师，人民艺术家。",
    year: "1944",
    cover: "https://img.aqifei.top/img/2026/01/074_%E5%9B%9B%E4%B8%96%E5%90%8C%E5%A0%82",
    description: "《四世同堂》是老舍先生的长篇小说代表作。以抗战时期的北平为背景，描写了小羊圈胡同祁家四世同堂的生活，以及周围邻居在日寇统治下的荣辱浮沉，展现了中国人民在国难当头时的痛苦与抗争。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/38ea7c1e0fb2"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1osEgUxdQTYgdKELNI9Elmw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1944"
  },
  {
    id: 72,
    title: "诗经",
    author: "佚名",
    authorDetail: "中国最早的诗歌总集。",
    year: "西周-春秋",
    cover: "https://img.aqifei.top/img/2026/01/075_%E8%AF%97%E7%BB%8F",
    description: "《诗经》是中国最早的一部诗歌总集，收录了西周初年至春秋中叶的诗歌305篇。分为风、雅、颂三部分，内容丰富，反映了当时的社会生活、风俗民情和政治状况，是中国现实主义文学的源头。",
    category: "古典文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1da1c7b1e571"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1fkFws7pD7WG2FqQzydWp8Q?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "Unknown"
  },
  {
    id: 73,
    title: "悲惨世界（上中下）",
    author: "[法] 维克多·雨果",
    authorDetail: "雨果，法国浪漫主义文学代表作家。",
    year: "1862",
    cover: "https://img.aqifei.top/img/2026/01/les_miserables_cover_1769415393122",
    description: "《悲惨世界》是维克多·雨果最著名的长篇小说。以冉·阿让的传奇经历为主线，描绘了19世纪初法国社会的广阔画面。小说融进了法国的历史、革命、战争、道德哲学、法律、正义、宗教信仰等，是一部社会史诗。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b4b7a33c6acc"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1m_cIU9acopnSButNoGDyQA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1862"
  },
  {
    id: 74,
    title: "南京大屠杀",
    author: "[美] 张纯如",
    authorDetail: "张纯如，华裔美国作家、历史学家。",
    year: "1997",
    cover: "https://img.aqifei.top/img/2026/01/nanjing_massacre_cover_1769415377513",
    description: "《南京大屠杀：被遗忘的二战浩劫》是美籍华裔作家张纯如的历史著作。书中详实地记录了1937年日军在南京犯下的暴行，以及国际安全区内西方人士的人道主义救援。这是第一部用英语写成的关于南京大屠杀的历史著作。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7b5f3eb1d171"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1aeL4tvis0PpC_sqHkMhGnw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1997"
  },
  {
    id: 75,
    title: "永恒的终结",
    author: "[美] 阿西莫夫",
    authorDetail: "艾萨克·阿西莫夫，美国科幻小说黄金时代的代表人物。",
    year: "1955",
    cover: "https://img.aqifei.top/img/2026/01/079_%E6%B0%B8%E6%81%92%E7%9A%84%E7%BB%88%E7%BB%93",
    description: "《永恒的终结》被公认为阿西莫夫的最高杰作。24世纪，人类发明了时间力场，建立了“永恒时空”，通过修正历史来消除人类的灾难。然而，永恒时空的执行者安德鲁·哈伦却爱上了一个不该爱的人……",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/46a04161aae1"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1cXi4-viW92zkWqp3aJdzEQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1955"
  },
  {
    id: 76,
    title: "美丽新世界",
    author: "[英] 赫胥黎",
    authorDetail: "阿尔多斯·赫胥黎，英国著名作家，属于著名的赫胥黎家族。",
    year: "1932",
    cover: "https://img.aqifei.top/img/2026/01/brave_new_world",
    description: "《美丽新世界》是反乌托邦文学的经典之作。在未来的世界里，基因决定了人的命运，睡眠教学灌输了社会规则，索麻药物带来了廉价的快乐。人类失去了自由、痛苦和思考的权利，却拥有了所谓的“幸福”。",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/07bd790e2fa3"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ThEp1lbdQydZam6O2aMhpQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1932"
  },
  {
    id: 77,
    title: "一个叫欧维的男人决定去死",
    author: "[瑞典] 弗雷德里克·巴克曼",
    authorDetail: "弗雷德里克·巴克曼，瑞典著名的80后作家。",
    year: "2012",
    cover: "https://img.aqifei.top/img/2026/01/081_%E4%B8%80%E4%B8%AA%E5%8F%AB%E6%AC%A7%E7%BB%B4%E7%9A%84%E7%94%B7%E4%BA%BA%E5%86%B3%E5%AE%9A%E5%8E%BB%E6%AD%BB",
    description: "59岁的欧维脾气古怪，带着坚不可摧的原则、每天恪守的常规以及随时发飙的脾性在社区晃来晃去，被公认为“地狱来的恶邻”。但在他决定去死的那天，一对新搬来的年轻夫妇意外撞坏了他的邮筒，从此改变了他的人生……",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8877d8aaf846"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ebFe_cBgfF3NypMpzy0xrQ?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2012"
  },
  {
    id: 78,
    title: "始于极限",
    author: "[日] 上野千鹤子 / 铃木凉美",
    authorDetail: "上野千鹤子，著名女性主义学者；铃木凉美，新锐作家。",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/01/20260127192907457",
    description: "《始于极限》是上野千鹤子与铃木凉美的通信集。两人围绕恋爱、婚姻、工作、独立、男人等女性关心的12个主题，进行了长达一年的真诚对话，深入探讨了当代女性面临的困境与出路。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/de6113ebc31f"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1HA-Ewl58mg21lJGYuX5D9g?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2022"
  },
  {
    id: 79,
    title: "神雕侠侣",
    author: "金庸",
    authorDetail: "金庸，武侠小说泰斗。",
    year: "1959",
    cover: "https://img.aqifei.top/img/2026/01/20260127192556648",
    description: "《神雕侠侣》是金庸“射雕三部曲”的第二部。讲述了杨过和小龙女凄美动人的爱情故事，以及杨过从一个顽劣少年成长为一代大侠“神雕大侠”的历程。小说歌颂了坚贞不渝的爱情和侠义精神。",
    category: "武侠仙侠",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0067051be9da"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1cIFoLJmDbJT9DWHqcmIK3A?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1959"
  },
  {
    id: 80,
    title: "绝叫",
    author: "[日] 叶真中显",
    authorDetail: "叶真中显，日本推理小说家。",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/01/084_%E7%BB%9D%E5%8F%AB",
    description: "《绝叫》是社会派推理小说的杰作。一名独居女性孤独死在公寓，随着警方的调查，不仅揭开了她被嫌弃的一生，也展现了现代社会的黑暗面：原生家庭的阴影、黑心企业的压榨、孤独死的凄凉……",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d03ccdd35065"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/14pzRYFdrss_387iS37fghw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2014"
  },
  {
    id: 81,
    title: "美的历程",
    author: "李泽厚",
    authorDetail: "李泽厚，中国当代著名哲学家、美学家。",
    year: "1981",
    cover: "https://img.aqifei.top/img/2026/01/085_%E7%BE%8E%E7%9A%84%E5%8E%86%E7%A8%8B",
    description: "《美的历程》是中国美学经典之作。从龙飞凤舞的远古图腾，到青铜饕餮的狞厉之美，再到气韵生动的明清绘画，作者以宏大的视野和优美的文笔，勾画了中国美学发展的历史长河。",
    category: "艺术设计",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/46b928ec37df"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1RQk_qZ5b89WdPGyicx_8uw?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1981"
  },
  {
    id: 82,
    title: "唐诗三百首",
    author: "[清] 蘅塘退士",
    authorDetail: "蘅塘退士，本名孙洙，清代学者。",
    year: "1764",
    cover: "https://img.aqifei.top/img/2026/01/086_%E5%94%90%E8%AF%97%E4%B8%89%E7%99%BE%E9%A6%96",
    description: "《唐诗三百首》是家喻户晓的唐诗选本。收录了唐代77位诗人的310余首诗作，涵盖了五言、七言、乐府等各种体裁，是学习中国古典诗歌的最佳入门读物。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/c3671bf39607"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1wQIR-FRoTFjlclMkwV733g?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1764"
  },
  {
    id: 83,
    title: "历史深处的忧虑",
    author: "林达",
    authorDetail: "林达，美籍华人作家夫妇的笔名。",
    year: "1997",
    cover: "https://img.aqifei.top/img/2026/01/history_deep_worries",
    description: "《历史深处的忧虑》是“近距离看美国”系列的第一本。作者通过一个个具体的法律案件，深入浅出地介绍了美国宪法、权利法案以及美国的司法制度，探讨了自由与法治的关系。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/52a4b223b6c4"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1MVqnHH8MsqV4rTWwO644rA?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1997"
  },
  {
    id: 84,
    title: "灿烂千阳",
    author: "[美] 卡勒德·胡赛尼",
    authorDetail: "卡勒德·胡赛尼，《追风筝的人》作者。",
    year: "2007",
    cover: "https://img.aqifei.top/img/2026/01/20260127193019763",
    description: "《灿烂千阳》是胡赛尼的第二部长篇小说。讲述了两个阿富汗女性玛丽雅姆和莱拉，在战乱与暴政下相互扶持、共同命运的故事。展现了女性在苦难中的坚韧与爱。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/c8c64ed428e1"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1oe9cyTFJ2FZYZVkUiPFvkg?pwd=0000",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2007"
  },
  {
    id: 85,
    title: "流俗地",
    author: "黎紫书",
    authorDetail: "黎紫书，马来西亚华语文学代表作家。",
    year: "2020",
    cover: "https://img.aqifei.top/img/2026/01/089_流俗地",
    description: "《流俗地》以马来西亚锡都的一栋组屋为背景，讲述了盲女银霞及其邻居、朋友们的命运沉浮。小说通过细腻的笔触，描绘了市井小民在时代变迁中的喜怒哀乐，展现了一幅充满烟火气的南洋生活画卷。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/89a87ab76821",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Y4_eZGhH0GAOAd6oP8lR7g",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 86,
    title: "上帝掷骰子吗",
    author: "曹天元",
    authorDetail: "曹天元，科普作家。",
    year: "2006",
    cover: "https://img.aqifei.top/img/2026/01/20260128114307636",
    description: "《上帝掷骰子吗：量子物理史话》是一部风靡华人世界的科普神作。作者以通俗幽默的语言，回顾了量子论从诞生到发展的百年历史，将那些枯燥的物理理论变成了扣人心弦的故事，带领读者走进神秘的微观世界。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/52ce3c3f909c",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1bRQInmIEXzAPYr-WVTNe7w",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 87,
    title: "窗边的小豆豆",
    author: "[日] 黑柳彻子",
    authorDetail: "黑柳彻子，日本著名作家、主持人。",
    year: "1981",
    cover: "https://img.aqifei.top/img/2026/01/091_窗边的小豆豆",
    description: "《窗边的小豆豆》讲述了作者上小学时的一段真实故事。小豆豆因淘气被原学校退学后，来到巴学园。在小林校长的爱护和引导下，一般人眼里“怪怪”的小豆豆逐渐变成了一个大家都能接受的孩子，并奠定了她一生的基础。",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/78f0a66a05be",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1kKtMIAJpXV2w4GFkSeBIow",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 88,
    title: "最好的告别",
    author: "[美] 阿图·葛文德",
    authorDetail: "阿图·葛文德，白宫最年轻的健康政策顾问，外科医生。",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/01/092_最好的告别",
    description: "《最好的告别：关于衰老与死亡，你必须知道的常识》探讨了衰老与死亡这一每个人都无法回避的话题。作者通过讲述一个个感人至深的故事，提出了在现代医学条件下，如何让人们优雅地跨越生命的终点，如何自主地掌控生命的最后阶段。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fd302d9fe01e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/13BUM0abI-nANzDarhdcXxg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 89,
    title: "筚路维艰",
    author: "萧冬连",
    authorDetail: "萧冬连，中国当代史研究学者。",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/01/093_筚路维艰",
    description: "《筚路维艰：中国社会主义路径的五次选择》清晰地梳理了当代中国的发展逻辑。作者回顾了从建国初期到改革开放的历史进程，分析了中国在不同时期所面临的挑战和做出的关键抉择，有助于读者深刻理解当代中国的历史命运。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/739c96524109",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1IzmSP7asNifK4USo1kODIA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 90,
    title: "哭泣的骆驼",
    author: "三毛",
    authorDetail: "三毛，台湾著名女作家。",
    year: "1977",
    cover: "https://img.aqifei.top/img/2026/01/哭泣的骆驼_1060377",
    description: "《哭泣的骆驼》是三毛在撒哈拉沙漠生活经历的延续。书中记录了她在沙漠中见证的动荡局势和悲剧故事，特别是《哭泣的骆驼》一篇，描写了沙伊达和巴西里悲壮的爱情与牺牲，充满了对生命和人性的悲悯。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/34ee4fda4634",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1pjx_GjeX2JZjzmJcqO7kTA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 91,
    title: "冬牧场",
    author: "李娟",
    authorDetail: "李娟，当代散文家，以新疆阿勒泰题材写作闻名。",
    year: "2012",
    cover: "https://img.aqifei.top/img/2026/01/095_冬牧场",
    description: "《冬牧场》记录了李娟跟随一家哈萨克牧民深入阿勒泰南部的沙漠冬牧场度过一个冬天的经历。她以灵动幽默的笔触，描绘了在荒凉贫瘠的环境中，人们如何以坚韧和智慧，把日子过得生机勃勃、充满尊严。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e4a3f1bbc470",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/19PcR_xKBzsZgjpkvt6M65A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 92,
    title: "呼兰河传",
    author: "萧红",
    authorDetail: "萧红，中国近现代女作家，“民国四大才女”之一。",
    year: "1940",
    cover: "https://img.aqifei.top/img/2026/01/096_呼兰河传",
    description: "《呼兰河传》是萧红的代表作，是一部回忆性长篇小说。作者以童年的视角，回忆了家乡呼兰河城的风土人情和那些平凡而又悲苦的小人物，如团圆媳妇、有二伯、冯歪嘴子等，展现了旧中国北方小城的荒凉与寂寞。",
    category: "人物传记",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/95fb625e2357",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1J8GRrC3xS7_Km_FJsj70JA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 93,
    title: "棋王·树王·孩子王",
    author: "阿城",
    authorDetail: "阿城，当代著名作家、编剧。",
    year: "1984",
    cover: "https://img.aqifei.top/img/2026/01/097_棋王·树王·孩子王",
    description: "本书收录了阿城的三个中篇小说代表作。《棋王》通过“棋呆子”王一生的故事，表现了传统文化对精神的滋养；《树王》探讨了人与自然的关系；《孩子王》则反思了教育与文化的传承。语言精炼，意蕴深远。",
    category: "亲子教育",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/940416845051",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1l2TRSvLdFhM4T3itBMd22Q",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 94,
    title: "罪与罚",
    author: "[俄] 陀思妥耶夫斯基",
    authorDetail: "陀思妥耶夫斯基，俄国文学巨匠。",
    year: "1866",
    cover: "https://img.aqifei.top/img/2026/01/20260128120631589",
    description: "《罪与罚》是世界文学史上的经典之作。穷大学生拉斯柯尔尼科夫为了证明自己是“超人”，杀死了放高利贷的老太婆。然而，犯罪后的恐惧和良心的折磨使他痛苦不堪。在索尼娅的感召下，他最终投案自首，踏上了赎罪与新生的道路。",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/148e7229cc0a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1yXheeUoKzKP9z8d8tFUOKw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 95,
    title: "离开的，留下的",
    author: "[意] 埃莱娜·费兰特",
    authorDetail: "埃莱娜·费兰特，意大利著名作家。",
    year: "2013",
    cover: "https://img.aqifei.top/img/2026/01/099_离开的，留下的",
    description: "《离开的，留下的》是“那不勒斯四部曲”的第三部。莉拉和埃莱娜已经长大成人，并在各自的生活中面临新的挑战。埃莱娜出版了小说，进入了上层文化圈；莉拉则在工厂做苦工，参与工人运动。两人在动荡的社会环境中，继续着她们复杂的友谊。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ef2ae0fc8584",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1riAWT-m0eMycfK3Q9sm_BQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 96,
    title: "明亮的夜晚",
    author: "[韩] 崔恩荣",
    authorDetail: "崔恩荣，韩国新生代代表作家。",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/100_明亮的夜晚",
    description: "《明亮的夜晚》讲述了“我”在离婚后回到祖母故乡，意外重逢多年未见的祖母，并聆听了曾祖母、祖母、母亲及“我”四代女性的故事。小说以温柔的笔触，串联起百年的时间长河，抚慰了女性代际间的心灵创伤。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4c40202aae9c",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1shoPJmUSeXkP8t5SlzIPFQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 97,
    title: "人间词话",
    author: "王国维",
    authorDetail: "王国维，国学大师。",
    year: "1908",
    cover: "https://img.aqifei.top/img/2026/01/20260128115737557",
    description: "《人间词话》是中国近代最负盛名的词话著作。王国维在书中提出了著名的“境界”说，以西方美学思想观照中国古典文学，对历代词人和词作进行了精彩的点评，是学习中国诗词美学的必读之作。",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/44562c7d47db",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/11Q4PzKxjjwXYnbfopQqbFQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 98,
    title: "叫魂",
    author: "[美] 孔飞力",
    authorDetail: "孔飞力，美国著名汉学家。",
    year: "1990",
    cover: "https://img.aqifei.top/img/2026/01/20260128115202344",
    description: "《叫魂：1768年中国妖术大恐慌》讲述了清朝乾隆年间发生的一场关于“叫魂”妖术的社会大恐慌。作者通过对这一事件的层层剖析，揭示了传统中国政治权力的运作逻辑、官僚体制的弊端以及底层社会的生存状态。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ce78ead61251",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1PP6RMl-XwRM2s62lgSngsQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 99,
    title: "西线无战事",
    author: "[德] 埃里希·玛利亚·雷马克",
    authorDetail: "雷马克，德裔美籍作家。",
    year: "1929",
    cover: "https://img.aqifei.top/img/2026/01/103_西线无战事",
    description: "《西线无战事》是反战文学的经典之作。小说以第一次世界大战为背景，通过一名年轻士兵的视角，描写了战争的残酷、恐怖和对人性的摧残，控诉了战争的罪恶，发出了对和平的呼唤。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/544c67f91a3b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1D0bPNO_1DpN8l_X616i4HQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 100,
    title: "道德经",
    author: "[周] 老子",
    authorDetail: "老子，道家学派创始人。",
    year: "春秋",
    cover: "https://img.aqifei.top/img/2026/01/104_道德经",
    description: "《道德经》是道家哲学的奠基之作，也是中国历史上最伟大的著作之一。全书仅五千言，却蕴含了关于宇宙、自然、社会、人生等方面的深刻智慧，提出了“道法自然”、“无为而治”等核心思想。",
    category: "哲学思想",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3fed7abb658d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/15DuEIsXRswc7R5abipZWow",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 101,
    title: "也许你该找个人聊聊",
    author: "[美] 洛里·戈特利布",
    authorDetail: "洛里·戈特利布，心理治疗师，畅销书作家。",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/01/105_也许你该找个人聊聊",
    description: "本书的作者是一位心理治疗师，她在书中双线讲述了自己作为治疗师帮助病人的故事，以及自己作为病人向另一位治疗师寻求帮助的经历。通过一个个真实鲜活的案例，展示了心理治疗的治愈力量，以及我们在面对痛苦、爱与失去时的人性。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/c4b5934dbd4f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1AU-Gevi6zBhlPmVUCiig7A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 102,
    title: "平面国",
    author: "[英] 埃德温·A·艾勃特",
    authorDetail: "埃德温·A·艾勃特，英国神学家、小说家。",
    year: "1884",
    cover: "https://img.aqifei.top/img/2026/01/106_平面国",
    description: "《平面国》是一部奇妙的科幻与数学寓言。故事发生在一个二维的平面世界里，居民们都是各种几何图形。通过平面国人对一维国和三维国的探索，作者以幽默讽刺的笔调，探讨了维度的概念，并影射了维多利亚时代的社会阶级与偏见。",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4b0ee76d0f0d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1TOf_zqBaTniWDv_erCW95Q",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 103,
    title: "文学回忆录",
    author: "木心",
    authorDetail: "木心，中国当代画家、作家。",
    year: "2013",
    cover: "https://img.aqifei.top/img/2026/01/107_文学回忆录",
    description: "《文学回忆录》是木心在纽约为陈丹青等艺术家讲授世界文学史的笔录。木心以其独特的艺术视角和才情，评点古今中外的文学巨匠和经典名著，妙语连珠，见解独到，是一部充满个人风格的文学史。",
    category: "人物传记",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3ac95d2ca6c8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1gYTAAYi4MHLyIkCZdAP5Ag",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 104,
    title: "遥远的向日葵地",
    author: "李娟",
    authorDetail: "李娟，当代散文家。",
    year: "2017",
    cover: "https://img.aqifei.top/img/2026/01/108_遥远的向日葵地",
    description: "《遥远的向日葵地》是李娟的非虚构代表作。书中记录了她和母亲、外婆在阿勒泰乌伦古河南岸种植向日葵的艰辛历程。作者以细腻深情的文字，刻画了母亲坚韧乐观的形象，赞美了大地上顽强的生命力。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3fed7abb658d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1dbjLIPgVYZNB-1YpC_iY4Q",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 105,
    title: "桶川跟踪狂杀人事件",
    author: "[日] 清水洁",
    authorDetail: "清水洁，日本资深调查记者。",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/20260129161752861",
    description: "《桶川跟踪狂杀人事件》是一部震撼的非虚构作品。记者清水洁通过对一起女大学生被前男友骚扰并杀害案件的深入调查，揭露了警方在办案过程中的推诿、失职甚至篡改笔录的丑闻，直接推动了日本《反跟踪骚扰法》的出台。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f1938c2398e3",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1qbZ_eaTB58KJnn774LSavw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 106,
    title: "少年凯歌",
    author: "陈凯歌",
    authorDetail: "陈凯歌，中国著名导演。",
    year: "2001",
    cover: "https://img.aqifei.top/img/2026/02/20260212134843154",
    description: "《少年凯歌》是陈凯歌导演的回忆录。他以平实而富有画面感的文字，回忆了自己在文革时期的少年经历。书中充满了对那个时代的深刻反思，以及对人性、尊严和忏悔的追问，被誉为“文革回忆录中的杰作”。",
    category: "人物传记",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/af1f33f89ea2",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1BKPLciaTvvwzcOJY8TwApQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 107,
    title: "浪潮之巅",
    author: "吴军",
    authorDetail: "吴军，计算机科学家，硅谷投资人。",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/20260129161536997",
    description: "《浪潮之巅》梳理了IT产业发展历程中那些伟大的公司（如AT&T、IBM、苹果、微软、谷歌等）的兴衰史。作者从技术、市场、商业模式等多个角度，分析了它们成功的原因和衰落的教训，揭示了科技产业发展的规律。",
    category: "商业经管",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f6bd0864e0a0",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1mUBVbBOUqySLYarzM4EfQg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 108,
    title: "昨日的世界",
    author: "[奥] 斯蒂芬·茨威格",
    authorDetail: "茨威格，奥地利著名作家。",
    year: "1942",
    cover: "https://img.aqifei.top/img/2026/01/20260129161508098",
    description: "《昨日的世界》是茨威格的绝笔自传。他以个人的经历为线索，展现了从一战前欧洲的“太平盛世”到二战期间文明崩塌的悲剧历史。书中充满了对旧欧洲文化的怀念和对人道主义失落的悲痛。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4a1e4096f186",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1PD-kx4SNbwmJrY18g8eg9Q",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 109,
    title: "爱你就像爱生命",
    author: "王小波 / 李银河",
    authorDetail: "王小波，当代著名作家；李银河，社会学家。",
    year: "2004",
    cover: "https://img.aqifei.top/img/2026/01/115_爱你就像爱生命",
    description: "《爱你就像爱生命》收录了王小波与李银河的书信。这些信件记录了两人纯真、热烈且充满智慧的爱情。王小波在信中展现了他孩子气、深情且富有诗意的一面，那句“你好哇，李银河”感动了无数读者。",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7efb2c256998",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1cSbZLg21Olv3y4al4-POMQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 110,
    title: "失明症漫记",
    author: "[葡] 萨拉马戈",
    authorDetail: "萨拉马戈，诺贝尔文学奖得主。",
    year: "1995",
    cover: "https://img.aqifei.top/img/2026/01/116_失明症漫记",
    description: "《失明症漫记》讲述了一场突如其来的“失明症”瘟疫席卷城市，人们纷纷失明，整个社会陷入了混乱和野蛮的状态。作者通过这个极端的寓言，深刻剖析了人性的脆弱、自私以及在绝境中仅存的善意。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/68db64862b11",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1_gu0qw7jwfpUyCgJauugUA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 111,
    title: "我们仨",
    author: "杨绛",
    authorDetail: "杨绛，著名作家、翻译家、学者。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/117_我们仨",
    description: "《我们仨》是杨绛先生晚年回忆丈夫钱锺书和女儿钱瑗的散文集。全书分为两部分，第一部分以梦境的形式讲述了亲人离散的痛苦，第二部分回忆了三人一家六十年来相守相助的点滴时光，文字质朴深情，感人至深。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/86bd77c83eb1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1wppL1QUuKIUbFZppRm8Wiw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 112,
    title: "人生的枷锁",
    author: "[英] 威廉·萨默塞特·毛姆",
    authorDetail: "毛姆，英国小说家、剧作家。",
    year: "1915",
    cover: "https://img.aqifei.top/img/2026/01/118_人生的枷锁",
    description: "《人生的枷锁》是毛姆的半自传体长篇小说。主人公菲利普天生跛足，敏感孤僻。在成长的过程中，他经历了宗教信仰的幻灭、爱情的折磨和职业选择的迷茫，最终摆脱了种种精神枷锁，找到了适合自己的人生道路。",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/cb48af3844ab",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1-0qcOMbqZDx6cN9U9p3pWQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 113,
    title: "看不见的城市",
    author: "[意] 伊塔洛·卡尔维诺",
    authorDetail: "卡尔维诺，意大利当代最著名的小说家之一。",
    year: "1972",
    cover: "https://img.aqifei.top/img/2026/01/119_看不见的城市",
    description: "《看不见的城市》是一部充满想象力的奇书。书中借马可·波罗之口，向忽必烈讲述了他所游历过的五十五座虚构的城市。这些城市由记忆、欲望、符号等构成，是对现代城市文明的隐喻和反思。",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4ef4d68421f8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1_qBgek91TMhxnMdthmnLPQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 114,
    title: "海子的诗",
    author: "海子",
    authorDetail: "海子，中国当代著名诗人。",
    year: "1995",
    cover: "https://img.aqifei.top/img/2026/01/120_海子的诗",
    description: "海子是中国当代诗坛的传奇，他的诗歌充满了神秘感、神性色彩和对土地、麦地、太阳等意象的执着。本书收录了他最著名的诗篇，如《面朝大海，春暖花开》、《祖国（以梦为马）》等，展现了他燃烧的生命力。",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ad3329c3de32",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1oNLKt8ionWNtT0FxziDhGw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 115,
    title: "巨人的陨落",
    author: "[英] 肯·福莱特",
    authorDetail: "肯·福莱特，通俗小说大师。",
    year: "2010",
    cover: "https://img.aqifei.top/img/2026/01/20260129161405765",
    description: "《巨人的陨落》是“世纪三部曲”的第一部。以一战为背景，通过五个家族的命运纠葛，展现了那段波澜壮阔的历史。书中融合了战争、爱情、政治阴谋等元素，情节跌宕起伏，是一部令人欲罢不能的历史通俗小说。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/6af7c1dbd449",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1fQX2EsRK8kVynN8ow84nZw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 116,
    title: "飞鸟集",
    author: "[印] 泰戈尔",
    authorDetail: "泰戈尔，印度诗人、哲学家，诺贝尔文学奖得主。",
    year: "1916",
    cover: "https://img.aqifei.top/img/2026/01/122_飞鸟集",
    description: "《飞鸟集》是泰戈尔的代表作之一，收录了三百余首格言式的短诗。这些诗歌短小精悍，清新隽永，充满了对自然、爱与生命的哲思，如飞鸟般轻灵，却能给人以深刻的启迪。",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0a9ad4e5a583",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1zuCvCOgUwMAlMgElq2L7Kg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 117,
    title: "人生的智慧",
    author: "[德] 叔本华",
    authorDetail: "叔本华，德国著名哲学家。",
    year: "1851",
    cover: "https://img.aqifei.top/img/2026/01/20260129161216101",
    description: "《人生的智慧》是叔本华流传最广的著作之一。他从哲学的高度，探讨了如何度过幸福的一生。书中关于健康、财富、名誉以及独处等话题的论述，冷静透彻，对现代人依然具有极大的指导意义。",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a0ed5161172e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1EokpKo4iy9Qv2VN8tIa1WQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 118,
    title: "教父",
    author: "[美] 马里奥·普佐",
    authorDetail: "马里奥·普佐，美国作家、编剧。",
    year: "1969",
    cover: "https://img.aqifei.top/img/2026/01/124_教父",
    description: "《教父》是黑帮小说的巅峰之作。讲述了美国黑手党柯里昂家族在老教父维托和新教父迈克尔两代人的领导下，在腥风血雨中生存和发展的故事。小说深入刻画了权力的本质、家族的羁绊以及男人的责任。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/c56004cffad5",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1HopNruOAXZltP-McW4RUow",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 119,
    title: "檀香刑",
    author: "莫言",
    authorDetail: "莫言，中国首位诺贝尔文学奖得主。",
    year: "2001",
    cover: "https://img.aqifei.top/img/2026/01/125_檀香刑",
    description: "《檀香刑》是莫言的代表作之一。小说以清末民初为背景，通过讲述一种残酷刑罚“檀香刑”的实施过程，展现了民间艺人、刽子手、官员等各色人物的命运，充满了瑰丽的想象和对本土文化的深刻挖掘。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a5ff50f8735f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1hjqz5wSr5D2CyX2fkUwVog",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 120,
    title: "面纱",
    author: "[英] 威廉·萨默塞特·毛姆",
    authorDetail: "毛姆，英国小说家。",
    year: "1925",
    cover: "https://img.aqifei.top/img/2026/01/20260129161125269",
    description: "《面纱》讲述了爱慕虚荣的凯蒂为了报复出轨的丈夫，随其前往霍乱流行的中国内地行医的故事。在面对生死和苦难的过程中，凯蒂逐渐摆脱了精神的枷锁，获得了个人的觉醒和心灵的救赎。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/11b0a1b47be9",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1kYcwtF1dD6WyVRPN4uON6A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 121,
    title: "人间草木",
    author: "汪曾祺",
    authorDetail: "汪曾祺，中国当代作家、散文家。",
    year: "1991",
    cover: "https://img.aqifei.top/img/2026/01/127_人间草木",
    description: "《人间草木》是汪曾祺的散文集。他以淡雅质朴的文字，描写了花草树木、虫鱼鸟兽以及各地的风土人情。字里行间流露出对生活的热爱和独特的文人雅趣，读来令人心旷神怡。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5b74a5e15a22",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ly55addge2r6UayIH_Tajw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 122,
    title: "我的天才女友",
    author: "[意] 埃莱娜·费兰特",
    authorDetail: "埃莱娜·费兰特，意大利神秘作家。",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/128_我的天才女友",
    description: "《我的天才女友》是“那不勒斯四部曲”的第一部。讲述了两个女孩莉拉和埃莱娜在战后那不勒斯贫困社区的成长故事。小说细腻地刻画了女性之间复杂而微妙的友谊，以及环境对个人命运的塑造。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a35028194195",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1gV883LAGKS6yQohxamHgsQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 123,
    title: "13 67",
    author: "陳浩基",
    authorDetail: "香港中文大學計算機科學系畢業。台灣推理作家協會海外成員。二〇〇八年，以童話推理作品〈傑克魔豆殺人事件〉入圍第六屆台灣推理作家協會徵文獎決選；翌年，續作〈藍鬍子的密室〉及犯罪推理作品〈窺伺藍色的藍〉同時入圍第七屆台灣推理作家協會徵文獎決選，並以〈藍鬍子的密室〉贏得首獎。之後再以推理小說《合理推論》獲得可米瑞智百萬電影小說獎第三名，以科幻短篇〈時間就是金錢〉獲得第十屆倪匡科幻獎三獎。二〇一一年，以《遺忘．刑警》榮獲第二屆「島田莊司推理小說獎」首獎，日本推理小說之神島田莊司稱讚他具備了無可限量的才華！另著有科幻作品《闇黑密使》（與高普合著）、異色小說《倖存者》、《氣球人》、《魔蟲人間》、奇幻輕小說《大魔法搜查線》等。",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/01/129_13 67",
    description: "我們以為自己走在正確的道路上，為什麼走著走著，人生卻變了樣？第一本讓我們感到驕傲的華文警察小說最高傑作！一組數字，六個片斷，構成一位警探的故事，一座城市的故事，一個時代的故事……四個月之前，沒有人想到這個城市會有這樣的改變！因為一樁糾紛，蔓延成暴動，整個城市陷入蠢蠢不安，危機一觸即發。有人怒吼著抗爭，想要改變現狀，也有人只是默默希望一個穩定的未來，而他徘徊在兩個極端之間，站在界線上。曾經，他嚮往成為一名警察，只是身處在這個動盪的時代裡，讓他不得不打消念頭。沒想到，偶然間聽到的一句話，竟把他捲進危險的漩渦，彷彿命中注定要跟警察同進退。但他更沒想到的是，他和身邊的人都想反抗自己的命運，卻從此走上天差地遠的道路……這是一部讓你想向作者脫帽致敬的小說！新生代作家陳浩基為我們展現了他無比的潛力和企圖心，六個短篇串連出一位警探傳奇的一生...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/6cfdbf227740",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Tn0w0e-gmqmowKIrsn0azQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 124,
    title: "陆犯焉识",
    author: "严歌苓",
    authorDetail: "严歌苓，著名旅美女作家、好莱坞专业编剧。代表作有：长篇小说《第九个寡妇》《小姨多鹤》《一个女人的史诗》《扶桑》《人寰》《雌性的草地》等。短篇小说《天浴》《少女小渔》《女房东》等。中篇小说《金陵十三钗》《白蛇》《谁家有女初长成》等。作品被翻译成英、法、荷、西、日等多国文字。 多部作品被拍成电影或电视剧，最近几年的有《一个女人的史诗》《小姨多鹤》等。",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/130_陆犯焉识",
    description: "《陆犯焉识》内容简介：陆焉识本是上海大户人家才子+公子型的少爷，聪慧而倜傥，会多国语言，也会讨女人喜欢。父亲去世后，年轻无嗣的继母冯仪芳为了巩固其在家族中的地位，软硬兼施地使他娶了自己的娘家侄女冯婉喻。没有爱情的陆焉识很快出国留学，在美国华盛顿毫无愧意地过了几年花花公子的自由生活。毕业回国后的陆焉识博士开始了风流得意的大学教授生活，也开始了在风情而精明的继母和温婉而坚韧的妻子夹缝间尴尬的家庭生活。五十年代，陆焉识因其出身、更因其不谙世事的张扬激越而成为\"”反革命“”， 在历次运动中，其迂腐可笑的书生气使他的刑期一次次延长，直至被判为无期。这位智商超群的留美博士由此揣着极高的学识在西北大荒草漠上改造了二十年。精神的匮乏、政治的严苛、犯人间的相互围猎与倾轧，终使他身上满布的旧时代文人华贵的自尊凋谢成一地碎片。枯寂中对繁华半生的反刍，使他确认了内心对婉喻...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1517fd5e374e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1V8Jw7fdtKviPeO9GmJ986A",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 125,
    title: "鹿鼎记",
    author: "金庸",
    authorDetail: "金庸（1924- ），当代最为著名的武侠小说作家。他本名查良镛，浙江海宁人，上海东吴法学院毕业。1959年在香港亲手创办明报机构，出版报纸、杂志和图书，1993年退休。先后创作了十五部长篇及短篇的武侠小说，广受欢迎，印量无数。曾获颂多项荣衔，包括2000年获香港特别行政区颁授最高荣誉大紫荆勋章，香港和各国多所大学的荣誉学位、名誉教授、院士。还担任过浙江大学人文学院院长，英国牛津大学汉学研究院高级研究员。",
    year: "1994",
    cover: "https://img.aqifei.top/img/2026/01/131_鹿鼎记",
    description: "这是金庸先生最後一部小说，也是登峰造极之作，是金大侠自言最喜欢之大作。          这部小说讲的是一个从小在扬州妓院长大的小孩韦小宝，他不会任何武功，却因机缘巧合闯入了江湖，并凭其绝伦机智周旋于江湖各大帮会、皇帝、朝臣之间并奉旨远征云南、俄罗斯之故事，书中充满精彩绝倒的对白及逆思考的事件，令人于捧腹之余更进一步深思其口才与机敏。",
    category: "武侠仙侠",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8318a8903948",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1CO7OXr-QFdbqiveZko7PvQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 126,
    title: "大明王朝1566",
    author: "刘和平",
    authorDetail: "刘和平，著名剧作家、小说家、历史学者。祖籍湖南邵东，生于湖南衡阳，长期从事历史学研究，舞台剧、电视剧和小说创作，曾任南开大学中国思想政治史研究中心兼职教授、北京大学产业与文化研究所研究员、副理事长。现任中国电视剧编剧工作委员会常务副会长兼专家学术委员会主任。其编剧创作的电视剧《雍正王朝》《北平无战事》，囊括了包括“飞天奖”“金鹰奖”及“白玉兰奖”在内的各种编剧奖，后者更为业界视为史诗级的巨作。其编剧创作的电视剧《大明王朝1566》，被历史学界公认为是“对历史学的研究和阐述已达到史学研究的前沿”，更被众多业内外人士称为“中国电视剧历史剧高峰之作”。",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/02/20260207225938224",
    description: "本书展现的是中国封建史上社会矛盾空前尖锐的时代，土地兼并使得大量的农民失去了赖以生存的基础，贪墨横行使得大明王朝的统治濒临崩溃。全书以“扳倒严嵩”为主要线索，全面展现了这一时期的一幅幅历史画面：从朝廷到各级官府惊心动魄的政治斗争，从官场到商场波谲云诡的尔虞我诈，忠勇的官兵和忠义的百姓风起云涌的抗倭之战；国与家命运的休戚与共，敌和友关系的错综变化，大情大我和小情小我的矛盾交织在这里，折射出历史深处的伟大理想和人生命运的严酷现实。一批赫赫有名的历史人物——海瑞、嘉靖、严嵩、严世藩、徐阶、高拱、张居正、胡宗宪、戚继光、李时珍等，从历史如烟的迷雾中有血有肉地向大家清晰地走来。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7b844decfe8c",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YBB__NMueKNTSj7BuWnwZw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 127,
    title: "地下室手记",
    author: "[俄] 陀思妥耶夫斯基",
    authorDetail: "沈从文（1902-1988），小说家、散文家。原名沈岳焕，湖南凤凰人。1918年小学毕业后，随本乡土著部队在沅水流域各县生活，后正式参加军队。 1922年受五四运动影响离开军队到北京，学习写作。1924年起开始在北京《晨报》副刊、《现代评论》、《小说月报》发表作品。1934年至1935 年，在北京、天津编辑《大公报》文艺副刊。抗战爆发后在昆明西南联大任教。新中国成立后，在中国历史博物馆和故宫博物院工作。著有长篇小说《边城》、《长河》等，散文集《湘行散记》、《湘西》等。",
    year: "2020",
    cover: "https://img.aqifei.top/img/2026/01/133_地下室手记",
    description: "《地下室手记》是俄国作家陀思妥耶夫斯基创作的长篇小说。该书由主角地下室人以第一人称的方式叙述，地下室人是名年约四十岁左右的退休公务员，他的内心充满了病态的自卑，但又常剖析自己。全书主要由两部分组成：第一部分是地下室人的长篇独白，内容探讨了自由意志、人的非理性、历史的非理性等哲学议题。第二部分是地下室人追溯自己的一段往事，以及他与一名妓女丽莎相识的经过。《地下室手记》不仅是陀思妥耶夫斯基的代表作，也预视了他后来5本重要的长篇小说：《罪与罚》、《白痴》、《群魔》、《少年》、《卡拉马佐夫兄弟》。该书也被认为是陀思妥耶夫斯基创作过程中的一个转折点。诺贝尔文学奖得主纪德认为：\"这部小说是他写作生涯的顶峰，是他的扛鼎之作，或者，如果你们愿意，可以说是打开他思想的钥匙。\"",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7d45d82f125b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1GEKKMaFzzZZkusrjqALz8Q",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 128,
    title: "边城",
    author: "沈从文 / 黄永玉 卓雅 插图.",
    authorDetail: "沈从文（1902-1988），小说家、散文家。原名沈岳焕，湖南凤凰人。1918年小学毕业后，随本乡土著部队在沅水流域各县生活，后正式参加军队。 1922年受五四运动影响离开军队到北京，学习写作。1924年起开始在北京《晨报》副刊、《现代评论》、《小说月报》发表作品。1934年至1935 年，在北京、天津编辑《大公报》文艺副刊。抗战爆发后在昆明西南联大任教。新中国成立后，在中国历史博物馆和故宫博物院工作。著有长篇小说《边城》、《长河》等，散文集《湘行散记》、《湘西》等。",
    year: "2002",
    cover: "https://img.aqifei.top/img/2026/01/135_边城",
    description: "《边城》是沈从文的代表作，写于一九三三年至一九三四年初。这篇作品如沈从文的其他湘西作品，着眼于普通人、善良人的命运变迁，描摹了湘女翠翠阴差阳错的生活悲剧，诚如作者所言：“一切充满了善，然而到处是不凑巧。既然是不凑巧，因之素朴的善终难免产生悲剧。”《边城》写出了一种如梦似幻之美，像摆渡、教子、救人、助人、送葬这些日常小事，在作者来都显得相当理想化，颇有几分“君子田”的气象。当然，矛盾也并非不存在，明眼人一看便知，作者所用的背景材料中便隐伏着社会矛盾的影子。作者亦不曾讳言他的写作意图是支持“民族复兴大业的人”，“给他们一种勇气和信心”。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f9634f5674d9",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1j4hE5uus7bKRKK5UUrKS-g",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 129,
    title: "额尔古纳河右岸",
    author: "迟子建",
    authorDetail: "约翰·威廉斯（John Edward Williams,  1922—1994），美国作家，诗人，学者。辍过学，当过电台播音，从过军。退役后入大学就读并获博士学位。于1945年-1985年间在母校丹佛大学任教，教授大学英语及创意写作。曾编辑出版学术文集《文艺复兴时期的英语诗歌》，也创作过两本诗集。一生只写了四部小说：《惟有黑夜》（1948）、《屠夫十字镇》（1960）、《斯通纳》（1965）、《奥古斯都》（1973，本书当年获得美国国家图书奖）。对约翰·威廉斯的写作，英国作家朱利安·巴恩斯评论：“当我称之为‘绝佳’，我的意思是它们（《屠夫十字镇》《斯通纳》）已经超越了各自类型范围内的评价标准。”",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/01/136_额尔古纳河右岸",
    description: "《额尔古纳河右岸》是一部描写鄂温克人生存现状及百年沧桑的长篇小说，展示了弱小民族在严酷的自然环境和现代文明的挤压下的顽强生命力和不屈不挠的民族精神，以及丰富多彩的民族性格和风情。本书获得第七届茅盾文学奖。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1ecbf8a37da8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1rYXdArtwf9rb8XkDICCZHg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 130,
    title: "斯通纳",
    author: "[美] 约翰·威廉斯",
    authorDetail: "郭敬明（1983- ），网名：第四维；别名：小四。2001年以作品《剧本》获得第三届全国新概念作文大赛一等奖，2002年以作品《我们最后的校园民谣》获得第四届全国新概念作文大赛一等奖。著有小说《爱与痛的边缘》《幻城》《左手倒影右手年华》《梦里花落知多少》《猜火车》《1995－2005夏至未至》， 音乐小说《迷藏》，主编《岛》系列、《无极》、《悲伤逆流成河》、《最小说》、《N世界》等。",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/01/137_斯通纳",
    description: "《斯通纳》讲述了生命中最重要的部分：爱，认同，怜悯，志业，傲骨，信任与死亡。一个勇者有过的失败不失意的人生：即使不能拥有完美的生活，所幸追求过完整的自我。美国，密苏里州。来自偏远农场的农家子弟、19岁的威廉·斯通纳进入州立密苏里大学学习农学。自一堂选修文学课为起点， 他的一生就此悄然改变。未来的斯通纳成为了一名大学老师，结婚、生子、教学、退休、衰老、死亡。在他生命的尽头，或许他可以坦然面对这个问题：你的一生，还要期望别的什么吗？一部蕴含着真诚、激情与紧凑力量的小说，探究了历史洪流所忽视的人性之间的冲突、溃败与幸存，重新唤起思考每个个体独特存在的意义。作者约翰·威廉斯向世人展示了凡人中的勇者在如何生活。----------------------------------------◆威廉斯的写作就像被打磨光滑的橡木上反射出本色、持久的光泽。这...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/6e12f53453c1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1xNlRVHAQuwHopLBAUzw2iA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 131,
    title: "梦里花落知多少",
    author: "郭敬明 出版社: 春风文艺出版社 出版年: 2003-11 页数: 252 定价: 20.00元 装帧: 平装 ISBN: 9787531325093",
    authorDetail: "冈岛二人日本推理文坛罕见的传奇组合，为井上泉、德山谆一共同的笔名，取自日语“两个怪人”的谐音。1982年，冈岛二人以《宝马血痕》摘得江户川乱步奖出道，之后又于1985年凭《巧克力游戏》荣获第39届日本推理作家协会奖、1989年凭《99%的诱拐》荣获第10届吉川英治文学新人奖。短短8年内他们创作了27部风格独特的高水准推理杰作，至今仍影响深远。1989年，这对搭档突然宣布解散，《克莱因壶》成为其最后的绝唱，从此冈岛二人不复存在。..张舟由推理而结缘的一对爱侣。小张以翻译和研究鉴赏为主，小舟以小说创作为主，齐心协力，携手追逐两人的推理之梦。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/138_梦里花落知多少",
    description: "《梦里花落知多少》是郭敬明出版第二部小说，此作一改《幻城》的奇幻风格，从天上回到人间。小说以北京、上海等大都市为背景，讲述了几个年青人的爱情故事，情节曲折，语言幽默生动。主人公是一些即将走出校门的大学生，在成长的过程中，友情、爱情都在经历着蜕变，那种成长的快乐和忧伤很能引起年轻读者的共鸣。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/eb6dfc2e39d5",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1LzN6fgLJLPZQ3JMs6GQ2nQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 132,
    title: "时间简史",
    author: "[英] 史蒂芬·霍金 出版社: 湖南科学技术出版社 副标题: 插图本 原作名: A Brief History of Time 译者: 吴忠超 / 许明贤 出版年: 2010-4 页数: 245 定价: 45.00元 装帧: 平装 ISBN: 9787535732309",
    authorDetail: "阿瑟·克拉克，英国国籍，现当代最出色的科普、科幻双栖作家，与阿西莫夫、海因莱因并称“二十世纪三大最伟大科幻小说家”。 克拉克的作品具有极强的预见性，联合国、NASA和互联网都从他的书中受益。他是撰文提出通信卫星概念并证实其技术可行性的第一人，被誉为“世界通信卫星之父”。 克拉克的代表作品有《童年的终结》、《城市与星》、“拉玛系列”、“奥德赛系列”等。这些作品被译成多种文字，畅销不衰。",
    year: "2010",
    cover: "https://img.aqifei.top/img/2026/01/139_时间简史",
    description: "《时间简史》讲述是探索时间和空间核心秘密的故事，是关于宇宙本性的最前沿知识，包括我们的宇宙图像、空间和时间、膨胀的宇宙不确定性原理、基本粒子和自然的力、黑洞、黑洞不是这么黑、时间箭头等内容。第一版中的许多理论预言，后来在对微观或宏观宇宙世界观测中得到证实。自1988年首版以来，《时间简史》已成为全球科学著作的里程碑。它被翻译成40种文字，销售了近1000万册。此版更新了内容，把许多观测揭示的新知识，以及霍金最新的研究纳入，并配以250幅照片和电脑制作的三维和四维空间图。",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/2c5fbfea10f8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1BdSsRk6IJC061BV_eP7hEQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 133,
    title: "克莱因壶",
    author: "[日] 冈岛二人",
    authorDetail: "列夫·托尔斯泰(1828～1910)，俄罗斯文学大师。他以自己一生的辛勤创作，登上了当时欧洲批判现实主义文学的高峰，在世界文学中占有重要的地位。他描绘了俄罗斯民众广阔的生活场景，被称为“俄国革命的一面镜子”。代表作为《战争与和平》《安娜·卡列尼娜》和《复活》。草婴，原名盛峻峰，著名学者、翻译家。草婴先生系统地翻译了列夫·托尔斯泰全部小说作品，包括三个长篇（《战争与和平》《安娜·卡列尼娜》和《复活》）、六十多个中短篇和自传体小说。",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/01/140_克莱因壶",
    description: "什么时候你开始怀疑这个世界是假的？.日本虚拟现实VR题材开山杰作，超前《盗梦空间》20年！传奇推理作家组合冈岛二人预言之书，以超强的技术预见力，30年前就已完美构想出虚拟现实游戏体验装置！.这是一部拥有“噩梦特质”的小说，是一次鲜有的、堪比3D观影、脑洞大开的、深陷其中难以自拔的独特体验。——资深推理人天蝎小猪..上杉彰彦从未如此兴奋——他写的故事被伊普西隆研发公司买下，即将制作成颠覆时代的全新游戏《克莱因2》（Klein 2），并受邀与少女梨纱一同担任游戏测试员。上杉彻底陷入了由K2造就的完美虚拟世界，为它的逼真、超前赞叹不已。然而随着测试过程的深入，伊普西隆公司行事神秘得令他生疑，游戏中更不断听到有人警告他：“快逃！”与此同时，一个自称是梨纱好友的女孩找到上杉，她说梨纱已失踪多日，音信全无。然而在寻人的过程中，两人都开始怀疑...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fec722e6149d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Gwgf1O5JHIrxpwOeYOfNBA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 134,
    title: "2001：太空漫游",
    author: "[英] 阿瑟·克拉克",
    authorDetail: "阿瑟·克拉克，英国国籍，现当代最出色的科普、科幻双栖作家，与阿西莫夫、海因莱因并称“二十世纪三大最伟大科幻小说家”。 克拉克的作品具有极强的预见性，联合国、NASA和互联网都从他的书中受益。他是撰文提出通信卫星概念并证实其技术可行性的第一人，被誉为“世界通信卫星之父”。 克拉克的代表作品有《童年的终结》、《城市与星》、“拉玛系列”、“奥德赛系列”等。这些作品被译成多种文字，畅销不衰。",
    year: "2007",
    cover: "https://img.aqifei.top/img/2026/01/141_2001：太空漫游",
    description: "神秘的黑色石板在史前时代启蒙了地球人类的文明。三百万年后，人类在月球上发现了同样的石板，而石板在出土瞬间立即朝土星方向发射出电磁信号。美国派太空船“发现号”远征土星，追查真相。太空船的超级电脑“哈尔”发疯，害死三名冬眠中的太空人，并犯弗兰克·普尔变成太空漂流物，只有戴维 ·鲍曼逃过一劫。幸存的鲍曼独自抵达土星，又发现另一块更大的黑石板……在阿瑟·克拉克众多作品中，以“太空漫游”四部曲最为脍炙人口，他用丰富的第一手太空科学资料，创造出比现实太空科技更为创新的场景；而他扎实的科学背景，更使作品中提到的科技情节具有强大的说服力。本书是“太空漫游四部曲”之一的《2001太空漫游》。",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a265c36d65c7",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1gwh1xBIMEvwGamfuoxNguQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 135,
    title: "安娜·卡列尼娜",
    author: "[俄罗斯] 列夫·托尔斯泰 出版社: 上海文艺出版社 原作名: Anna karenina 译者: 草婴 出版年: 2007-8 页数: 788 定价: 37.00元 装帧: 平装 丛书: 世界十大文学名著 ISBN: 9787532132256",
    authorDetail: "伊坂幸太郎日本文坛独树一帜的新锐作家，以异想天开而独创的世界观、多重的构想力著称。知识广博，文风豪迈诙谐，极具思想性和娱乐性。曾获推理作家协会奖、山本周五郎奖、新潮推理俱乐部奖等多项文学奖，更曾五度入围直木奖。 与东野圭吾、村上春树连续包揽权威书评杂志《达文西》最 受欢迎男作家 前3名。代表作有《金色梦乡》《死神的精确度》等。",
    year: "2007",
    cover: "https://img.aqifei.top/img/2026/01/142_安娜·卡列尼娜",
    description: "《安娜·卡列尼娜》是托尔斯泰第二部里程碑式的长篇小说，创作于 1873—1877年。作品由两条既平行又相互联系的线索构成：一条是安娜与卡列宁、伏伦斯基之间的家庭、婚姻和爱情纠葛；一条是列文和吉娣的爱情生活及列文进行的庄园改革。安娜是一个上流社会的贵妇人，年轻漂亮，追求个性解放和爱情自由，而她的丈夫却是一个性情冷漠的“官僚机器 ”。一次在车站上，安娜和年轻军官伏伦斯基邂逅，后者为她的美貌所吸引，拼命追求。最终安娜堕入情网，毅然抛夫别子和伏伦斯基同居。但对儿子的思念和周围环境的压力使她陷入痛苦和不安中，而且她逐渐发现伏伦斯基并非一个专情的理想人物。在相继失去儿子和精神上最后一根支柱 ——伏伦斯基后，经过一次和伏伦斯基的口角，安娜发现自己再也无法在这个虚伪的社会中生活下去，绝望之余，她选择了卧轨自杀。小说揭露了 19世纪六七十年代俄罗斯上流社会的丑恶与虚伪...(展开全部)",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/90c5d6080478",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/12eOmZ-G7s2i9Iyv2y2qTYw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 136,
    title: "王尔德童话",
    author: "[英] 王尔德",
    authorDetail: "王小波（1952—1997）1952年生于北京。1968年到云南插队。后在山东转插，做过民办教师。1973年在北京当工人。1978年考入中国人民大学本科，1986年获得美国匹兹堡大学硕士学位。1988年回国，曾在北京大学、中国人民大学任教。1992年辞职，成为自由撰稿人。1997年4月11日病逝于北京。在当代中国作家中，从没有人像他那样获得数不清的赞誉和追捧，从没有人像他那样有无数青年自愿充当其“门下走狗”。他的小说为读者贡献了现代汉语小说的阅读快感，他让人们看到了一个不同的别样的世界；他的杂文，幽默中充满智性，为读者打开一条通向智慧、理性的道路，被一代代年轻人奉为精神偶像。他被誉为中国的乔伊斯兼卡夫卡，亦是两次获得世界华语文学界的重要奖项“台湾《联合报》文学奖中篇小说大奖”的中国大陆作家。代表作有杂文集《沉默的大多数》，小说《黄金时代》...(展开全部)",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/02/20260207225848325",
    description: "王尔德是19世纪英国最伟大的艺术家之一，以其剧作、诗歌、童话和小说名世。在风流才子那颓废唯美、狷狂放浪的表面姿态下，是一颗纯美纯善，永难泯灭的童心。而这可贵童心一经与卓绝才智结合，便诞生了《王尔德童话》。它不仅为作者奠定了文学声名的基石，更成为世界文学宝库中的传世佳作。其语言纯正优美堪称典范，其意境高洁悠远益人心智，值得向每一个童稚未凿的孩子、每一位葆有赤子之心的成人郑重推荐。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/27876d92cdf3",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1DVOmtQpiaHTBHmQAwhmJ-w",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 137,
    title: "金色梦乡",
    author: "[日] 伊坂幸太郎",
    authorDetail: "刘震云，汉族，河南延津人，北京大学中文系毕业，中国人民大学文学院教授。曾创作长篇小说《故乡天下黄花》《故乡相处流传》《故乡面和花朵》（四卷）、《一腔废话》《我叫刘跃进》《一句顶一万句》《我不是潘金莲》《吃瓜时代的儿女们》等；中短篇小说《塔铺》《新兵连》《单位》《一地鸡毛》《温故一九四二》等。其作品被翻译成英语、法语、德语、意大利语、西班牙语、瑞典语、捷克语、荷兰语、俄语、匈牙利语、塞尔维亚语、土耳其语、罗马尼亚语、波兰语、希伯来语、波斯语、阿拉伯语、日语、韩语、越南语、泰语、哈萨克语、维吾尔语等多种文字。2011年，《一句顶一万句》获得茅盾文学奖。2018年，获得法国文学与艺术骑士勋章。根据其作品改编的电影，也在国际上多次获奖。",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/02/20260207225818323",
    description: "《金色梦乡》是日本知名作家伊坂幸太郎的代表作，获第5届日本书店大奖、第21届山本周五郎奖，日文版销量突破114万册，堺雅人、竹内结子主演同名电影。对于《金色梦乡》的创作初衷，伊坂幸太郎在访谈中说道：“人类有多不成熟、这个世界有多艰辛，不用说也知道。如果读者读了《金色梦乡 》会感到‘虽然艰难，但明天也要努力’，我就满足了。”==============================================================日本新任首相在仙台街头被暗杀，凶器是搭载炸弹的遥控飞机。警方立刻认定一个叫青柳雅春的人是凶手。青柳被迫逃亡，渐渐发现有人早已处心积虑地布下陷阱：两年前，他做快递员时因救了女明星而红极一时，这成了被栽赃陷害的原因；半年前，恐吓电话持续骚扰快递公司，他被迫辞职；两个月前 ， 他在乘车时被诬陷成色狼；案发当天...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/190e65f85382",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1A6ib8nra385UJ8BxdCL6Hw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 138,
    title: "小径分岔的花园",
    author: "[阿根廷] 豪·路·博尔赫斯",
    authorDetail: "朱朝敏，上世纪七十年代出生，出版《水未央》《百里洲纪事》《黑狗曾来过》《遁走曲》等多部作品。部分作品被介绍到国外，译成英语、韩语、西班牙语和柯尔克孜语。作品获得第三届华语青年作家奖、《芳草》文学全国女评委最佳抒情奖、三毛散文奖、《作家》“金短篇”小说奖和湖北文学奖。现为湖北省作协副主席，湖北省作协小说创作委员会主任。",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/145_小径分岔的花园",
    description: "本书为1941年的短篇小说集，收小说七篇。其中，《小径分岔的花园》是侦探小说，讲述一桩罪行的准备工作和实施过程。小径分岔的花园是一个谜语，或者说寓言，而谜底正是时间。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0c2bf60d6b31",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/16_Ju7xA-Ycx6sUqwwJ4xrg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 139,
    title: "绿毛水怪",
    author: "王小波",
    authorDetail: "吴念真，全方位的创意人、电影人、广告人、剧场人。本名吴文钦。1952年出生于台北县。1973年开始从事小说创作，曾连续三年获得联合报小说奖。1981年起，陆续写了《恋恋风尘》《老莫的第二个春天》《悲情城市》等75部电影剧本，曾获五次金马奖最佳剧本奖、两次亚太影展最佳编剧奖。主持TVBS“台湾念真情”节目三年，舞台剧代表作有《人间条件》系列等。",
    year: "2018",
    cover: "https://img.aqifei.top/img/2026/02/20260207225633110",
    description: "王小波短篇小说集，其中同名小说《绿毛水怪》是王小波首部小说作品，可以一窥作者创作的源头及其后的发展走向。小说中肆意的想象力、幽默的调侃以及人对自我意志的彰显，是作者最突出的写作风格，也是一以贯之的精神内核。小说《绿毛水怪》也是王小波和李银河的定情之作，其间洋溢的强烈诗 意，令人看到小说和杂文之外的另一个王小波。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/c78143edf584",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1q39yI85bPQAB-aK3aLnmVg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 140,
    title: "一句顶一万句",
    author: "刘震云",
    authorDetail: "三浦紫苑1976年生于东京。2000年以长篇小说《女大生求职奋战记》踏入文坛。三浦擅长塑造个性鲜明的人物角色，故事洋溢着年轻人的青春面貌，深获年轻读者喜爱。作品多获影视、广播剧、漫画改编，广受好评。2006年以《多田便利屋》荣获第135届“直木赏”大奖肯定。2 007年以《强风吹拂》拿下“本屋大赏”第三名。2010年以《哪啊哪啊~神去村》入选“本屋大赏”前十大。2012年以《编舟记》夺得“本屋大赏”第一名。",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/01/147_一句顶一万句",
    description: "《一句顶一万句》是著名作家刘震云的扛鼎之作，也是刘震云迄今为止最成熟最大气的作品，并在2011年获第八届茅盾文学奖。小说分上下两个部分，前半部“出延津记”写的是过去：卖豆腐老杨的二儿子杨百顺百事不顺，他一生改了三次名：为了寻个营生，被天主教神父老詹纳为教徒，改名杨摩西；给县长种地时因为一个尿壶得罪了县长，提心吊胆中有人说媒，便倒插门嫁给馒头铺的吴香香，改名吴摩西；吴香香给吴摩西扣了顶绿帽子，吴摩西带着吴香香和前夫的女儿巧玲假意去寻与人私奔的妻子，路上又把巧玲丢了，失望之中，要离开故乡，从此用喊丧的罗长礼的名字度过余生；后半部“回延津记”写的是现在：巧玲被卖到陕西，成了曹青娥，嫁给牛家，儿子牛爱国也是假意寻找与人私奔的妻子，又想到自己从前的相好，想起母亲的老家，于是走回延津……一出一走，延宕百年。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8ee0a61a93fd",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1rc6XVUymkgLIChKVu6QERQ",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 141,
    title: "红星照耀中国",
    author: "[美] 埃德加·斯诺埃",
    authorDetail: "石黑一雄，日裔英国小说家，1954年生于日本长崎，与奈保尔、拉什迪并称为“英国文坛移民三雄”。石黑一雄的作品并不多，但几乎每部作品都获得重要的文学奖项：《远山淡影》获温尼弗雷德•霍尔比纪念奖，《浮世画家》获惠特布莱德年度最佳小说奖，《长日将尽》获布克奖，《无可慰藉》获切尔特纳姆文学艺术奖，《浮世画家》《我辈孤雏》和《莫失莫忘》均入围布克奖决选名单；1995年英女王授予石黑一雄文学领域的大英帝国勋章，1998年获法国文学艺术骑士勋章，2017年因“以其巨大的情感力量，发掘了隐藏在我们与世界的虚幻联系之下的深渊”而获诺贝尔文学奖。",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/01/237_红星照耀中国",
    description: "《红星照耀中国》（曾译《西行漫记》）自1937年初版以来，畅销至今，而董乐山译本已经是今天了解中国工农红军的经典读本。本书真实记录了斯诺自1936年6月至10月在中国西北革命根据地进行实地采访的所见所闻，向全世界报道了中国和中国工农红军以及许多红军领袖、红军将领的情况。2016年是长征胜利80周年，也是本书出版80周年，此次新版得到董乐山家属独家授权，并配有五十余幅珍贵历史照片，是由人民文学出版社推出的最经典译本。",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3cf2d8073cbd",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Ebmps6a4lgi8Uo8CPCOrCA",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 142,
    title: "渡鸦栖息时",
    author: "朱朝敏",
    authorDetail: "张爱玲，1920年9月30日出生於上海，原名张煐。1922年迁居天津。1928年由天津搬回上海，读《红楼梦》和《三国演义》。1930年改名张爱玲，1939年考进香港大学，1941年太平洋战争爆发，投入文学创作。两年後，发表《倾城之恋》和《金锁记》等作品，并结识周瘦鹃、柯灵、苏青和胡兰成。1944与胡兰成结婚，1945年自编《倾城之恋》在上海公演；同年，抗战胜利。1947年与胡兰成离婚，1952年移居香港，1955年离港赴美，并拜访胡适。1956年结识剧作家赖雅，同年八月，在纽约与赖雅结婚。1967年赖雅去世，1973年定居洛杉矶；两年后，完成英译清代长篇小说《海上花列传》。1995年九月逝於洛杉矶公寓，享年七十四岁。",
    year: "2025",
    cover: "https://img.aqifei.top/img/2026/01/fix_渡鸦栖息时",
    description: "当至亲成为最熟悉的陌生人，沉默是最后的庇护所。每一场精心策划的失踪，都是对血缘最绝望的告白。🌟编辑推荐：★小说集的6个故事，是心理悬疑与社会痛点的深度碰撞，以家庭疗养院为舞台，揭开失踪、疾病、婚姻背叛背后的心理博弈，还探讨了帕金森病、植物人护理、代际创伤等社会议题，引发共鸣。📖内容简介：这是一本心理治愈的中短篇小说集，精选了湖北作家朱朝敏的6篇中短篇小说。以女性题材、疗养院故事为主，以作者的个人经历为基础，阐述爱情、婚姻、家庭、生活等主题，叙述上讲究结构的繁复之美，并带有悬疑的步步深入的特点，营造出一股幽深而秘密的叙述氛围。同时，赋予人性的深情和敦厚，给予人心希望和温暖。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/07f9c24eda1e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/13DdjIoq7vppwSw6b-BOxvw",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 143,
    title: "这些人，那些事",
    author: "吴念真",
    authorDetail: "塔拉·韦斯特弗（Tara Westover），美国历史学家、作家。1986年生于爱达荷州的山区。十七岁前从未上过学。通过自学考取杨百翰大学，2008年获文学学士学位。随后获得盖茨剑桥奖学金，2009年获剑桥大学哲学硕士学位。2010年获得奖学金赴哈佛大学访学。2014年获剑桥大学历史学博士学位。2018年出版《你当像鸟飞往你的山》，2019年因此书被《时代周刊》评为“年度影响力人物”。",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/148_这些人，那些事",
    description: "《这些人，那些事》是吴念真导演经历过人生的风风雨雨和最大低潮后，所完成的生命记事。他用文字写下心底最挂念的家人、日夜惦记的家乡、一辈子搏真情的朋友，以及台湾各个角落里最真实的感动。这些人和事，透过他真情挚意的笔，如此跃然的活在你我眼前，笑泪交织的同时，也无可取代的成为烙印在你我心底、这一个时代的美好缩影……",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0b454f1bb3ad",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1E3VfUnzonUsL-ZLdqumUvg",
        code: "0000"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 144,
    title: "强风吹拂",
    author: "三浦紫苑",
    authorDetail: "安徒生是丹麦19世纪著名童话作家，世界文学童话创始人。他生于欧登塞城一个贫苦鞋匠家庭，早年在慈善学校读过书，当过学徒工。受父亲和民间口头文学影响，他自幼酷爱文学。11岁时父亲病逝，母亲改嫁。为追求艺术，他14岁时只身来到首都哥本哈根。经过8年奋斗，终于在诗剧《阿尔芙索尔》的剧作中崭露才华。因此，被皇家艺术剧院送进斯拉格尔塞文法学校和赫尔辛欧学校免费就读。历时5年。1828年，升入哥尔哈根大学。毕业后始终无工作，主要靠稿费维持生活。1838年获得作家奖金——国家每年拨给他200元非公职津贴。安徒生终生未成家室，1875年8月4日病逝于朋友——商人麦尔乔家中。安徒生文学生涯始于1822年。早期主要撰写诗歌和剧本。进入大学后，创作日趋成熟。曾发表游记和歌舞喜剧，出版诗集和诗剧。1833年出版长篇小说《即兴诗人》，为他赢得国际声誉，是他成人文学的代表作。...(展开全部)",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/149_强风吹拂",
    description: "豆瓣2015年度读书榜单，最佳暖心治愈作品No.1.跑步界的《灌篮高手》,“纵有疾风起，人生不言弃。”B站正版引进热血新番《强风吹拂》同名原著小说。.长跑的目标不是更快，而是更强。“明明这么痛苦，这么难过，为什么就是不能放弃跑步？因为全身细胞都在蠢蠢欲动，想要感受强风迎面吹拂的滋味。”.宽政大学宿舍“竹青庄”的十名舍友凑成杂牌长跑队，在队长清濑灰二的魔鬼训练下，从零开始向日本历史最悠久的长跑接力赛“箱根驿传”挺进 。这十名大学生包括两名田径队逃兵、一对神经大条又聒噪的双胞胎、俊帅漫画宅男、尼古丁中毒的万年留级生、逻辑超强的毒舌精英、不爱跑步的黑人留学生、老实好青年、百发百中猜谜王。这些“选手”刚开始时连自己是田径队都不知道，且一半成员没有长跑经验。他们能否创造“箱根驿传”史上最大奇迹？不到最后一棒，没人知道答案。.“箱根驿传”二三...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e5e0491e40f2",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1SsVGt3ebWdRGiLZ2ykc6rQ",
        code: "rsui"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 145,
    title: "长日将尽",
    author: "[英] 石黑一雄",
    authorDetail: "李娟1979年生于新疆。曾一度跟随家庭进入阿尔泰深山牧场，经营一家杂货店和裁缝铺，与逐水草而居的哈萨克牧民共同生活。1999年开始写作。代表作有《阿勒泰的角落》《我的阿勒泰》《九篇雪》《冬牧场》及《羊道》三部曲。曾获人民文学奖、鲁迅文学奖、朱自清散文奖、中国好书奖、中华优秀出版物奖等。作品被译为英文、日文、俄文、韩文、阿拉伯文、土耳其文等，在读者中产生巨大反响。",
    year: "2018",
    cover: "https://img.aqifei.top/img/2026/01/150_长日将尽",
    description: "★2017诺贝尔文学奖得主石黑一雄代表作、布克奖获奖小说★长日将尽，一曲帝国衰落的挽歌，一场擦肩而过的爱情★同名电影（又译《告别有情天》）获多项奥斯卡奖、英国电影学院奖提名，英国影帝安东尼•霍普金斯、实力女星爱玛•汤普森主演《长日将尽》是诺奖得主石黑一雄1989年获布克奖的作品，也是石黑一雄最重要的代表作。小说以管家史蒂文斯的回忆展开，讲述了自己为达林顿勋爵服务的三十余年时光里的种种经历；虽然达到了职业巅峰，但史蒂文斯过于冷酷地压抑自我情感，追求完美履行职责，而在父亲临终前错过最后一面，之后又与爱情擦肩而过。小说通过主人公的回忆，将一个人的生命旅程在读者眼前抽丝剥茧，同时也折射出一战与二战之间那段非常时期的国际政治格局。1993年根据小说翻拍的同名电影（又名《告别有情天》）由英国著名演员安东尼•霍普金斯和艾玛•汤普森主演，获得八项奥斯卡奖提...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ca9496b525d8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1tNxyc6CXHsupjwLFzjFsxw",
        code: "i412"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 146,
    title: "半生缘",
    author: "张爱玲",
    authorDetail: "李沧东，作家、导演、编剧。早年创作小说，曾获得《韩国日报》的创作文学奖。1997年开始拍电影，代表作是《薄荷糖》《绿洲》《密阳》《诗》《燃烧》等。2002年凭借《绿洲》获得第59届威尼斯国际电影节特别导演奖，2007年凭借《密阳》获得第2届亚洲电影大奖最佳导演，2010年凭借《诗》斩获第63届戛纳国际电影节最佳编剧、第5届亚洲电影大奖最佳导演和第4届亚太电影大奖最佳导演等多项大奖，2018年凭新片《燃烧》获戛纳电影节费比西国际影评人大奖。",
    year: "2006",
    cover: "https://img.aqifei.top/img/2026/01/152_半生缘",
    description: "他和曼桢认识，已经是多年前的事了。算起来倒已经有十四年了——真吓人一跳！马上使他连带地觉得自己已老了许多。日子过得真快，尤其对于中年以后的人，十年八年都好像是指顾间的事。可是对于年轻人，三年五载就可以是一生一世。他和曼桢从认识到分手，不过几年的工夫，这几年里面却经过这么许多事情，仿佛把生老病死一切的哀乐都经历到了。曼桢曾经问过他，他是什么时候起开始喜欢她的。他当然回答说：“第一次看见的时候。”说那句话的时候是在那样的一种心醉的情形下，简直什么都可以相信，自己当然绝对相信那不是谎话。其实他到底是什么时候第一次看见她的，根本就记不清楚了。",
    category: "情感小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5720b190837e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1-GOrss6b0zwzfl2r6WinUQ",
        code: "fuzk"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 147,
    title: "小岛经济学",
    author: "[美] 彼得·希夫 / [美] 安德鲁·希夫",
    authorDetail: "茅海建，华东师范大学历史系教授、北京大学历史学系兼职教授。先后毕业于中山大学历史系、华东师范大学历史系（硕士），师从陈旭麓教授。曾任军事科学院助理研究员，中国社会科学院近代史研究所助理研究员、副研究员、研究员，北京大学历史学系教授。",
    year: "2017",
    cover: "https://img.aqifei.top/img/2026/02/20260209173409641",
    description: "你一定非常想知道：通货膨胀到底是怎么来的？为什么中国要购买那么多的美国国债？扭转恶化的经济状况是该花钱，还是存钱？为什么有些国家很富有，而另外一些国家却很穷？席卷全球的经济危机又是怎么发生的？如何对经济领域的各种现象进行专业而又生动的分析，是一项艰巨的任务。如何让从9岁到90岁的读者都能通过一本书洞悉日常生活现象背后的经济规律，更是一项几乎不可能完成的任务。《小岛经济学》就是这样一本书，它通过插图、幽默的措辞以及讲故事的平实手法，将经济学从高不可攀的架子上取下来，放回到厨房的餐桌上。它本就该属于那个地方。这个关于鱼、渔网、存钱、借钱的故事揭示了经济是如何运行的，映射出当今经济体制与政策暗藏的漏洞。希夫兄弟以机智幽默的手法阐释了经济增长的根源，贸易、储蓄及风险三者的重要性，滞胀的根源，利率的影响，政府的刺激机制、消费信贷的破坏性本质等问题。这些问题...(展开全部)",
    category: "商业经管",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/a828aaf41a56",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1CIOixs51MN48v9764NlgHg",
        code: "kszq"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 148,
    title: "你当像鸟飞往你的山",
    author: "塔拉·韦斯特弗",
    authorDetail: "田余庆，1924年，湖南湘阴人，北京大学历史系教授。主要著作有《中国史纲要》（合著，翦伯赞主编），国家教委第一届大学教材特等奖）；《东晋门阀政治》（第一届国家图书奖）、《秦汉魏晋史探微》、《拓跋史探》等。",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/02/20260209173351244",
    description: "人们只看到我的与众不同：一个十七岁前从未踏入教室的大山女孩，却戴上一顶学历的高帽，熠熠生辉。只有我知道自己的真面目：我来自一个极少有人能想象的家庭。我的童年由垃圾场的废铜烂铁铸成，那里没有读书声，只有起重机的轰鸣。不上学，不就医，是父亲要我们坚持的忠诚与真理。父亲不允许我们拥有自己的声音，我们的意志是他眼中的恶魔。哈佛大学，剑桥大学，哲学硕士，历史博士……我知道，像我这样从垃圾堆里爬出来的无知女孩，能取得如今的成就，应当感激涕零才对。但我丝毫提不起热情。我曾怯懦、崩溃、自我怀疑，内心里有什么东西腐烂了，恶臭熏天。直到我逃离大山，打开另一个世界。那是教育给我的新世界，那是我生命的无限可能。",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bae7fb0979de",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/10N40bzq9O0NJ39sSTEIu9A",
        code: "n4vd"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 149,
    title: "海的女儿",
    author: "安徒生",
    authorDetail: "曹文轩，1954年1月生于江苏盐城农村。中国作家协会全国委员会委员、北京大学中文系教授、中国现当代文学博士生导师。 有文学作品集、长篇小说《忧郁的田园》、《红葫芦》、《蔷薇谷》、《白栅栏》、《甜橙树》、《追随永恒》、《山羊不吃天堂草》、《草房子》、《红瓦》、《根鸟》等15种。 主要学术著作有《第二世界――对文学艺术的哲学解释》、《小说门》、《中国八十年代文学现象研究》、《二十世纪末中国文学现象研究》、《面对微妙》、《曹文轩文学论集》等。 主编《二十世纪末中国文学作品选》、《五十年中国小说选》、《现代名篇导读》、《外国文学名作导读本》、《外国儿童文学名作导读本》等。 有作品翻译为英、法、日、韩等文字。曾获国家图书奖、宋庆龄文学奖金奖、冰心文学奖、金鸡奖最佳编剧奖、中国电影华表奖、德黑兰国际电影节评审团特别大奖“金蝴蝶”奖、意大利第十三届Giffoni电...(展开全部)",
    year: "1978",
    cover: "https://img.aqifei.top/img/2026/02/20260209173315632",
    description: "安徒生是丹麦19世纪著名童话作家，世界文学童话创始人。他生于欧登塞城一个贫苦鞋匠家庭，早年在慈善学校读过书，当过学徒工。受父亲和民间口头文学影响，他自幼酷爱文学。11岁时父亲病逝，母亲改嫁。为追求艺术，他14岁时只身来到首都哥本哈根。经过8年奋斗，终于在诗剧《阿尔芙索尔》的剧作中崭露才华。因此，被皇家艺术剧院送进斯拉格尔塞文法学校和赫尔辛欧学校免费就读。历时5年。1828年，升入哥尔哈根大学。毕业后始终无工作，主要靠稿费维持生活。1838年获得作家奖金——国家每年拨给他200元非公职津贴。安徒生终生未成家室，1875年8月4日病逝于朋友——商人麦尔乔家中。安徒生文学生涯始于1822年。早期主要撰写诗歌和剧本。进入大学后，创作日趋成熟。曾发表游记和歌舞喜剧，出版诗集和诗剧。1833年出版长篇小说《即兴诗人》，为他赢得国际声誉，是他成人文学的代表作。...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8afae568ca2b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1FPhSQ1OgT2ikKmTE3X9X3g",
        code: "ur7a"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 150,
    title: "阿勒泰的角落",
    author: "李娟",
    authorDetail: "錢穆(1895—1990)，中國現代歷史學家、。江蘇省無錫人。字賓四。筆名公沙、梁隱、與忘、孤雲。錢穆九歲入私塾，熟習中國的傳統文獻典籍。十三歲入常州府中學堂學習，1912年因家貧輟學，後自學。1913-1919年任小學教員。1923年後，曾在廈門、無錫、蘇州等地任中學教員。1930年以後，歷任燕京、北京、清華、四川、齊魯、西南聯大等大學教授，也曾任無錫江南大學文學院院長。1949年遷居香港，創辦了新亞書院，任院長，從事教學和研究工作至1964年退休為止，期間曾獲得香港大學、美國耶魯大學名譽博士稱號。1966年，錢穆移居臺灣臺北市，在“中國文化書院（今中國文化大學）”任職，為中央研究院院士，臺灣故宮博物院特聘研究員。1990年8月在臺北逝世。錢穆著述頗豐，專著多達80種以上。其代表作有《先秦諸子系年》、《中國近三百年學術史》、《國史大綱》、《中國文化...(展开全部)",
    year: "2024",
    cover: "https://img.aqifei.top/img/2026/01/156_阿勒泰的角落",
    description: "◎【内容简介】十九岁，她随家人初入阿尔泰深山牧场，在荒野中经营起半流动的裁缝店和杂货铺。牧民自古逐水草而居，为了生活，她与家人也不断随之迁徙——从草场到沙漠、戈壁，甚至是凋敝的废墟。踏入新的土地，空空荡荡，而自然丰泽。人有手有脚、感官明晰，就是自由。什么都可以从无到有，一点点被创造出来。这样的土地容不下虚伪和矫情，一切都那么直接、真实——世界是未驯服的，感观是纯·天然的。哪怕生活永远在一边抛弃，一边继续，只要感受力还在，永远可以发现新的、值得记忆的美好。◎【编辑推荐】-- 旷野中乘风高唱，闪闪发光的游牧岁时记🌄 --★ 人民文学奖、鲁迅文学奖、朱自清散文奖得主李娟成名作★ 豆瓣9.0分，阿勒泰系列开篇★ 毛不易、CCTV《读书》栏目等一致推荐，于适、蒋奇明主演系列改编剧集★ 热销10年，焕新上市！作者悉心修订，新增自序——“无...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/28c272387e75",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/15DiH2G_CJlpU1eWhzZ978Q",
        code: "tjjj"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 151,
    title: "鹿川有许多粪",
    author: "李沧东",
    authorDetail: "都梁，50年代出生，做过教师、公务员、公司经理、石油勘探技术研究所所长，现为自由撰稿人。2000年1月出版长篇小说《亮剑》。同名电视连续剧由海润影视传播忪司拍摄。",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/157_鹿川有许多粪",
    description: "豆瓣2021年度读书榜单“年度外国文学（小说类）”“年度高分图书”“豆瓣书店最受欢迎图书”李沧东封笔之作直面错综复杂的生活本身，探索真正价值的可能性从《烧纸》到《燃烧》，永恒的审视与追问本书是韩国导演李沧东于1992年出版的中短篇小说集，借此他获得了《韩国日报》创作文学奖，并在第二年受导演朴光洙之邀进入电影界，随后他便转型并逐渐成为具有国际影响力的电影 大师。这部小说集展现了一批裹挟在复杂多变的历史浪潮中的底层人物形象，他们艰辛地在生活中追求真正的价值，与现实中的痛苦进行抗争，同时寻找个人生活的意义。作者通过这些人物的遭遇审视韩国现实，但并非止步于讲述历史事件或故事本身，而是着重刻画了人物在此过程中发生的转变，他们逐渐开始对生活中的真正价值和自己的身份认同提出疑问并进行探索。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bc486a7676f0",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1FsGr0YnEpt8qrW2iK5n_jQ",
        code: "rshg"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 152,
    title: "天朝的崩溃",
    author: "茅海建",
    authorDetail: "斯韦特兰娜·亚历山德罗夫娜·阿列克谢耶维奇   Svetlana Alexandravna Alexievich白俄罗斯作家，1948年生于乌克兰，毕业于明斯克大学新闻学系。她用与当事人访谈的方式写作纪实文学，记录了二次世界大战、阿富汗战争、苏联解体、切尔诺贝利事故等人类历史上重大的事件。她曾多次获奖，包括瑞典笔会奖（1996）、德国莱比锡图书奖（1998）、法国“世界见证人”奖（1999）、美国国家书评人奖（2005）、德国书业和平奖（2013）等。因为独立报导和批判风格，她的独立新闻活动曾受到政府限制，代表作《锌皮娃娃兵》曾被列为禁书。1992年，她在政治法庭接受审判，后因国际人权观察组织的抗议而中止。她还曾被指控为中情局工作，电话遭到窃听，不能公开露面。2000年，她受到国际避难城市联盟的协助迁居巴黎，2011年回明斯克居住。2013年，...(展开全部)",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/02/20260209173300240",
    description: "本书大量使用中国第一历史档案馆所藏清朝奏折，和英国所藏中英交涉文件、日本学者汇编资料集等等，详尽考订并重建了与战争相关的大量基本史实。作者抓住几个主要人物为线索展开叙述。从武器装备、防御工事、兵员训练到作战战术的运用；从后勤、兵力动员、兵员调动到军费的来源、筹集与分配，更涉及交战国可用于战争的经济实力、负责运筹帷幄人员的心态、他们的战争观(从文化层面言)、战术观(从军事角度言)等等。这些面相在过去的鸦片战争研究中或被忽视，或语焉不详，但在本书中却得到充分的展现。鸦片战争在中国近代史上的影响重大，也是中国百年国耻的开端，给中华民族带来巨大的精神创伤，本书对当时的人和事的评价，均从事实认定来加以判断，尤其严肃检讨清朝奏折中呈现的天朝心态，直指中国战败的深层原因。该书展现的严谨论证破除过去误谬之学术性，以及避免再蹈历史错误覆辙之强烈爱国情怀，令人读之震撼...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/2b467f22e666",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1umoqXgGubfu3M2SbmcYWWg",
        code: "2bgg"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 153,
    title: "冰与火之歌",
    author: "[美]乔治·R.R.马丁",
    authorDetail: "L.S.斯塔夫里阿诺斯（L.S.Stavrianos，1913—2004），美国加州大学历史学教授，享誉世界的历史学家，曾获古根海姆奖、福特杰出教师奖和洛克菲勒基金奖等一系列学术荣誉奖。他一生学术成果斐然，出版了《全球史纲》《全球分裂》等18部颇具影响的著作，其中本书可谓斯塔夫里阿诺斯的集大成之作，也是一部实践上世纪60年代兴起的“全球史思潮”的真正的奠基之作。王皖强，中国人民大学历史学院教授，博士生导师， 世界近现代史教研室主任。主要研究方向为西方思想文化史。著有《现代英国大众文化》等。代表译著有汤因比的《历史研究》（与郭小凌、刘北成合译）和彼得·盖伊的《启蒙时代》（与刘北成合译）。刘北成，清华大学历史系荣休教授，长期从事世界近代史和西方思想史的教学与研究，在评介当代西方后现代主义思想、译介国外史学及世界近代史研究方面成就斐然。著有《福柯思想肖...(展开全部)",
    year: "2013",
    cover: "https://img.aqifei.top/img/2026/02/20260209173222593",
    description: "《冰与火之歌》（A Song of Ice and Fire）是由美国著名科幻奇幻小说家乔治·R·R·马丁（George R.R. Martin）所著的史诗奇幻小说，是当代奇幻文学一部影响深远的里程碑式的作品。于1996年初问世时，便以别具一格的结构、浩瀚辽阔的视野、错落有致的情节和生动活泼的语言，迅速征服了欧美文坛。迄今，本作已被译为三十多种文字，并在各个国家迭获大奖。作品主要描述了在一片虚构的中世纪大陆上所发生的一系列相互联系的宫廷斗争、疆场厮杀、游历冒险和魔法抗衡的故事，全书七卷（已出版到第五卷）浑然一体，共同组成了一幅壮丽而完整的画卷。从1995年至今，《权力的游戏》、《列王的纷争》、《冰雨的风暴》、《群鸦的盛宴》和《魔龙的狂舞》陆续出版，引发了全球性的追捧热潮。2008年底，该系列图书销量接近一千万册，在全球以三十多种语言翻译出版。由于...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fd4c6119d851",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1txKdi9tlOqULOv2yOgPycA",
        code: "c86t"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 154,
    title: "东晋门阀政治",
    author: "田余庆",
    authorDetail: "斯台芬·茨威格（1881—1942），奥地利小说家、诗人、剧作家和传记作家。出身富裕犹太家庭，青年时代在维也纳和柏林攻读哲学和文学，日后周游世界，结识罗曼·罗兰和弗洛伊德等人并深受影响。创作诗、小说、戏剧、文论、传记，以传记和小说成就最为著称。第一次世界大战期间从事反战工作，是著名的和平主义者。一九三四年遭纳粹驱逐，流亡英国和巴西。一九四二年在孤寂与幻灭中自杀。代表作有短篇小说《象棋的故事》、《一个陌生女人的来信》，长篇小说《心灵的焦灼》，回忆录《昨日的世界》，传记《三大师》和《一个政治性人物的肖像》。",
    year: "2012",
    cover: "https://img.aqifei.top/img/2026/02/20260209173204820",
    description: "本书以丰富的史料和周密的考证分析，对中国中古历史中的门阀政治问题作了再探索，认为中外学者习称的魏晋南北朝门阀政治，实际上只存在于东晋一朝；门阀政治是皇权政治在特定历史条件下出现的变态，具有暂时性和过渡性，其存在形式是门阀士族与皇权的共治。本书不落以婚宦论门阀士族的窠臼，对中国中古政治史中的这一重要问题提供了精辟的见解，具有很高的学术价值。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fc91bcb0333f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1RSNNPRQ0Hi11z7jlIG6pcg",
        code: "u938"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 155,
    title: "草房子",
    author: "曹文轩",
    authorDetail: "李光耀，曾任新加坡总理（开国元首）、新加坡最高领导人。李光耀为新加坡的独立及崛起做出卓越贡献，被誉为“新加坡国父”。他不仅是现今新加坡政坛极具影响力的人物，也是亚洲乃至世界著名的政治家之一。2015年3月23日因病医治无效去世，享年91岁。",
    year: "2009",
    cover: "https://img.aqifei.top/img/2026/01/161_草房子",
    description: "这是一部讲究品位的少年长篇小说。作品写了男孩桑桑刻骨铭心、终身难忘的六年小学生活。六年中，他亲眼目睹或直接参与了一连串看似寻常但又催人泪下、撼动人心的故事：少男少女之间毫无暇疵的纯情，不幸少年与厄运相拼时的悲怆与优雅，残疾男孩对尊严的执著坚守，垂暮老人在最后一瞬所闪耀的人格光彩，在死亡体验中对生命的深切而优美的领悟，大人们之间扑朔迷离且又充满诗情画意的情感纠葛 …… 这一切，既清楚又朦胧地展现在少年桑桑的世界里。这六年，是他接受人生启蒙教育的六年。作品格调高雅，由始至终充满美感。叙述风格谐趣而又庄重，整体结构独特而又新颖，情节设计曲折而又智慧。荡漾于全部作品的悲悯情怀，在人与人之间的关系日趋疏远、情感日越淡漠的当今世界中，也显得弥足珍贵、格外感人。通篇叙述既明白晓畅，又有一定的深度，是那种既是孩子喜爱也可供成人阅读的儿童文学作品。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5cbf823af3e9",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1doBiPgGetQKRJbHvQ1PxKQ",
        code: "fb9w"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 156,
    title: "國史大綱（上下）",
    author: "錢穆",
    authorDetail: "作者：沃尔特·艾萨克森历任美国有线电视新闻网（CNN）董事长和《时代周刊》总编，他的作品包括畅销书《爱因斯坦传》，《本杰明·富兰克林传》以及《基辛格传》",
    year: "2013",
    cover: "https://img.aqifei.top/img/2026/02/20260212134525772",
    description: "這是一部中國通史，因用大學教科書體例寫成，不得不力求簡要，僅舉大納，刪其瑣節。內容於學術思想，政治制度，社會風氣，國際形勢，兼有顧及，惟但求其通為一體，明其治亂盛衰之所由，聞其一貫相承之為統，以指陳吾國家民族生命精神之所寄。至其人物之詳，事業之備，則待教者讀者之自加參考，自為引伸。本書主旨則在發明其相互影響，及先後之演變發展，以作國人如何應付現時代之種種事變作根據之借鑒。",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/72655900243c",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1AsowNwiWfuK8wQHTwMj3hg",
        code: "sxp3"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 157,
    title: "万水千山走遍",
    author: "三毛",
    authorDetail: "赫尔曼·黑塞（Hermann Hesse, 1877-1962），德国作家，20世纪最伟大的文学家之一。以《德米安：埃米尔·辛克莱的彷徨少年时》、《荒原狼》、《悉达多》、《玻璃球游戏》等作品享誉世界文坛。1923年46岁入瑞士籍。1946年获诺贝尔文学奖。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/163_万水千山走遍",
    description: "大地啊，我来到你岸上时原是一个陌生人，住在你房子里时原是一个旅客，而今我离开你的门时却是一个朋友了。 当飞机降落在墨西哥首都的机场时，我的体力已经透支得几乎无法举步。长长的旅程，别人睡觉，我一直在看书。眼看全机的人都慢慢地走了，还让自己绑在安全带上。窗外的机场灯光通明，是夜间了。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f2c05afe8c96",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1n1nkA_Lpr5O7U0bG3IJkOg",
        code: "1gpc"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 158,
    title: "亮剑",
    author: "都梁",
    authorDetail: "艾里希·弗洛姆，著名德裔美籍心理学家、精神分析学家、哲学家。1900年生于德国法兰克福犹太人家庭，1922年获德国海德堡大学哲学博士学位，是二十年代“法兰克福学派”重要成员。纳粹上台后，他于1934年赴美，在从事心理咨询工作的同时，在哥伦比亚大学等学术机构讲学，并先后执教于墨西哥国立大学、密歇根州立大学等高校。1980年弗洛姆病逝于瑞士洛伽诺。弗洛姆的研究植根于弗洛伊德的精神分析学说和马克思主义哲学理论。他认为人是各自所在的产物，在现代工业化社会，人变得越来越自我疏离，这种孤立感导致人们潜意识下渴望与他人结合、联系。弗洛姆以深入浅出、平易近人的文笔，创造了大量学术著作和普及性作品，其中影响最大的有《爱的艺术》、《逃避自由》、《健全的社会》、《精神分析的危机》等。",
    year: "2005",
    cover: "https://img.aqifei.top/img/2026/01/164_亮剑",
    description: "李云龙是一个叱咤风云、百战沙场的职业军人，是一个一生都在血与火中搏斗的名将。他的人生信条是：面对强大的对手，明知不敌，也要毅然亮剑，即使倒下，也要成为一座山、一道岭。在战争与和平的时空转换中，他的命运注定要充满悲欢离合—无论是政治生涯还是婚姻、爱情。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/94e742952a39",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Aci5PecBNc610gbwzmIPtA",
        code: "ax63"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 159,
    title: "我不知道该说什么，关于死亡还是爱情",
    author: "[白俄] S·A·阿列克谢耶维奇",
    authorDetail: "特雷弗·诺亚（Trevor Noah）1984年2月20日出生于南非约翰内斯堡，曾担任电视台、广播电台主持人和脱口秀演员，声名鹊起之后于2014年底赴美国发展，担任美国“喜剧中心”电视台著名脱口秀节目《每日秀》（The Daily Show）的通讯员，后在2015年成为该节目的主持人。诺亚目前生活在纽约。",
    year: "2014",
    cover: "https://img.aqifei.top/img/2026/01/165_我不知道该说什么，关于死亡还是爱情",
    description: "★获得2015年诺贝尔文学奖，真实记录切尔诺贝利核灾难事件★“她的复调书写，是对我们时代的苦难和勇气的纪念。”★“每一页，都是感人肺腑的故事。”------------------------------------------------------------ -------------切尔诺贝利核灾难幸存者口述实录，每一页都是感人肺腑的故事作者冒着核辐射危险，深入切尔诺贝利，采访当地幸存者人类史上最惨烈的科技悲剧，今天的我们该如何避免灾难重演？-------------------------------------------------------------------------1986年4月26日，史上最惨烈的反应炉事故发生在切尔诺贝利。这是史上最浩大的悲剧之一。作者访问了上百位受到切尔诺贝利核灾影响的人民，有无辜的居...(展开全部)",
    category: "情感小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0a7f323b8dad",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Bfi4ij5mFk7J5hD59rGcuw",
        code: "3mxd"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 160,
    title: "生死疲劳",
    author: "莫言",
    authorDetail: "罗兰·米勒（Rowland S. Miller），美国萨姆休斯顿州立大学心理学教授，1973年获康奈尔大学心理学学士学位，分别于1976年和1978年获佛罗里达大学社会心理学硕士和博士学位。自1978年至今一直在萨姆休斯顿州立大学讲授亲密关系课程，因教学与研究优秀曾获人际关系研究国际协会的教学奖、美国心理协会（APA）和国际心理学荣誉学会（Psi Chi）的 Edwin B. Newman 奖。研究兴趣包括社会心理学、社会情绪（如尴尬、耻辱）、亲密关系等，现在侧重亲密关系的维持过程。著有《亲密关系》《尴尬：日常生活中的镇定与险境》。",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/166_生死疲劳",
    description: "五十年间西门闹经历六次转世，一世为驴，二世为牛，三世为猪，四世为狗，五世为猴，最终降生为人。在这六世里，他目睹蓝脸一家三代经历人生的生死疲劳，他们爱就爱到底，恨就恨到底，犟就犟到底，干就干到底，有极致的痛苦，也有彻底的放纵。而他们的故事，要从1950年1月1日讲起……",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f4b72ef93d58",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/12ebzX7Yq1eLHTF3bZL-f-Q",
        code: "t9p8"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 161,
    title: "全球通史",
    author: "[美] L.S.斯塔夫里阿诺",
    authorDetail: "张爱玲，中国现代作家。祖籍河北丰润，1920年9月生于上海，1995年9月逝于美国洛杉矶。 张爱玲深受中国古典文学影响，又接受了良好的西式教育，从而形成中西兼备的文学视野。她的作品多着眼于普通人的命运，洞察人性的幽微，又有强烈的历史意识，写出了大变动时代下的众生相，意象 丰富，独创了一种苍凉的文学笔法，在承续中国文学传统的基础上，构建了自己丰富而独特的文学世界。",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/167_全球通史",
    description: "☆一部影响世界四代人的全球史☆史学大家斯塔夫里阿诺斯经典著作☆人大、清华知名教授新注新译，原貌重现☆全球突破2000万读者，20年销量遥遥领先☆豆瓣9.0+，全网百万读者高分评论☆20世纪影响世界的10本书之一☆北大历史系主要参考书☆清华学生借阅榜常客☆ 阿诺德·汤因比、钱乘旦、葛剑雄、阎步克、戴锦华 倾情推荐☆新版附赠历史思维导读手册与北大限定书签，让阅读更深入，理解更透彻☆全球局势越复杂，越要读《全球通史》！·本书采用全新的史学观点和方法，将整个世界看作一个不可分割的有机的统一体，从全球视角考察世界各地区人类文明的产生和发展，重点关注对人类历史进程有重大影响的各种历史运动、历史事件及其相互关联和相互影响，努力反映局部与整体的对抗以及它们之间的相互作用。本书问世后受到著名历史学 家汤因比和巴勒克拉夫的高度评价，被译成多种文字流...(展开全部)",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f6ed6f0b6612",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1cJlAiRraOkHOCvY7PiegPQ",
        code: "max5"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 162,
    title: "苏菲的世界",
    author: "[挪威] 乔斯坦·贾德",
    authorDetail: "刘慈欣，首位获得世界科幻奖“雨果奖”的亚洲作家，中国科幻文学的主要代表作家，中国科普作家协会会员。自上世纪90年代开始发表科幻作品，曾连续九次获得中国科幻“银河奖”。2015年，凭借长篇小说《三体》成为亚洲首位“雨果奖”获得者。因为对中国科幻文学的巨大贡献，于同年获得银河奖“科幻功勋奖”。刘慈欣的作品兼具科学探索与人文关怀，在世界科幻文学中树立了一种具有中国特色的科幻文学样式，其“三体三部曲”被认为是中国科幻文学的里程碑之作。",
    year: "2017",
    cover: "https://img.aqifei.top/img/2026/01/168_苏菲的世界",
    description: "《苏菲的世界》这是一本风靡世界的哲学启蒙书。14岁的少女苏菲不断接到一些极不寻常的来信，世界像谜团一般在她眼底展开，她在一位神秘导师的指引下，苏菲开始思索，从苏格拉底、柏拉图到达尔文、弗洛伊德等哲学大师所思考的根本问题。苏菲运用少女天生的悟性与后天知识，企图解开这些谜团，然而，事实真相远比她所想的更怪异、更离奇。《苏菲的世界》，是智慧的世界，梦的世界。它将会唤醒每个人内心深处对生命的赞叹与对人生终极意义的关怀与好奇。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d18623e362b4",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1jBSb_CcXTwM5CPlv6VJD6A?pwd=fgqx",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 163,
    title: "一个陌生女人的来信",
    author: "[奥] 斯蒂芬·茨威格",
    authorDetail: "李娟，籍贯四川乐至县，1979年出生于新疆奎屯，1999年开始写作。长期居住在新疆阿泰勒地区，与母亲、外婆等亲人一起，以开小卖部、做裁缝等为生，跟随放牧的哈萨克人而流转在广袤的北疆阿尔泰山区。同时，种葵花、养鸡、放鸭子、到森林里检木耳，过着没有网络，没有电视的生活，自由而宁静。其文字明净纯粹，多围绕个人体验展现新疆阿勒泰游牧地区的生存景观，以绝对清新之风引起了文坛震惊。曾在《南方周末》、《文汇报》等开设专栏，出版有个人散文集《九篇雪》、《阿勒泰的角落》、《走夜路请放声歌唱》，非虚构长篇《冬牧场》及“羊道”三部曲。曾获“人民文学奖”、“上海文学奖”、“朱自清散文奖”、“天山文艺奖”等。现生活于北疆地区，供职于新疆文联。康剑，护林人，摄影人，偶尔写写散文。长期生活在喀纳斯湖周围的深山老林里，对这方山水有着深厚的感情，强烈的眷恋。著有散文摄影集《喀纳斯自然...(展开全部)",
    year: "2007",
    cover: "https://img.aqifei.top/img/2026/01/169_一个陌生女人的来信",
    description: "这是一部短篇小说集，除《一个陌生女人的来信》，亦按时间顺序收录了《火烧火燎的秘密》、《马来狂人》等名篇，作者的创作历程一目了然。《一个陌生女人的来信》讲述一个刻骨铭心的爱情故事，一个女子暗恋男主人公18年，直至临死才决定向他告白。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d0389fbd440c",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1J1GUHdUtd6S8DJhsE-u0Mw?pwd=l98e",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 164,
    title: "李光耀观天下",
    author: "李光耀",
    authorDetail: "东野圭吾日本作家。1985年，《放学后》获第31届江户川乱步奖，开始专职写作；1999年，《白夜行》获周刊文春推理小说榜年度第1名，《秘密》获第52届日本推理作家协会奖；2005年出版的《嫌疑人X的献身》同时获得第134届直木奖、第6届本格推理小说大奖，以及日本三大推理小说排行榜年度第1名；2008年，《 流星之绊》获第43届新风奖；2009年出版的《新参者》获两大推理小说排行榜年度第1名；2012年，《解忧杂货店》获第7届中央公论文艺奖；2013年，《梦幻花》获第26届柴田炼三郎奖；2014年，《祈祷落幕时》获第48届吉川英治文学奖。",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/170_李光耀观天下",
    description: "★  李光耀是亚洲的传奇人物，因为他极强的领导能力和治国才能而倍受尊敬。——潘基文★  李光耀对亚洲动态及经济管理的意见及见解，深受世上人尊重。——奥巴马★  《李光耀观天下》对世界广泛的课题做了独特和坦率的分析，将半个世纪以来其他领袖向李光耀请教的精辟见解展现于前。——基辛格李光耀绝笔，每个想认识他的人都应该买一本。这本书绝不是枯燥的地缘政治论述，也不是全球事务迂回曲折发展的专题报告。李光耀一生密切地参与国际事务。在本书中，他凭借其丰富经验和深刻洞察力，对今天世界的形势和20年后世界可能展现的面貌提出看法。相反，在横跨美国、中国、亚洲和欧洲的广博叙述中，他剖析了它们的社会、探究其人民的心理，并提出了有关这些国家未来的结论。李光耀在书中表达的坦率且往往令人惊讶的观点，使本书成为一本新鲜生动又引人入胜的读物；也探讨了他长久以来最关切的新加坡...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/7c739cbc36f1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/15a9nXWRUZTDwzYTt0GkG4Q?pwd=0se6",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 165,
    title: "史蒂夫·乔布斯传",
    author: "[美] 沃尔特·艾萨克森",
    authorDetail: "无可争议的侦探小说女王，侦探文学史上最伟大的作家之一。阿加莎•克里斯蒂原名为阿加莎•玛丽•克拉丽莎•米勒，一八九○年九月十五日生于英国德文郡托基的阿什菲尔德宅邸。她几乎没有接受过正规的教育，但酷爱阅读，尤其痴迷于歇洛克•福尔摩斯的故事。第一次世界大战期间，阿加莎•克里斯蒂成了一名志愿者。战争结束后，她创作了自己的第一部侦探小说《斯泰尔斯庄园奇案》。几经周折，作品于一九二○正式出 版，由此开启了克里斯蒂辉煌的创作生涯。一九二六年，《罗杰疑案》由哈珀柯林斯出版公司出版。这部作品一举奠定了阿加莎•克里斯蒂在侦探文学领域不可撼动的地位。之后，她又陆续出版了《东方快车谋杀案》、《ABC 谋杀案》、《尼罗河上的惨案》、《无人生还》、《阳光下的罪恶》等脍炙人口的作品。时至今日，这些作品依然是世界侦探文学宝库里最宝贵的财富。根据她的小 说改编而成的舞台剧《捕鼠器...(展开全部)",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/171_史蒂夫·乔布斯传",
    description: "这本乔布斯唯一授权的官方传记，在2011年上半年由美国出版商西蒙舒斯特对外发布出版消息以来，备受全球媒体和业界瞩目，这本书的全球出版日期最终确定为2011年11月21日，简体中文版也将同步上市。两年多的时间，与乔布斯40多次的面对面倾谈，以及与乔布斯一百多个家庭成员、 朋友、竞争对手、同事的不受限的采访，造就了这本独家传记。尽管乔布斯给予本书的采访和创作全面的配合，但他对内容从不干涉，也不要求出版前阅读全文的权利。对于任何资源和关联的人，他都不设限，甚至鼓励他所熟知的人袒露出自己的心声。“我已经做了很多并不值得自豪的事情，比如23岁时就让我的女友怀了孕，以及我对这件事的处理方式”，他说， “对我而言，没有什么不可以对外袒露的。”谈及和他共过事的人以及竞争对手，他直言不讳，甚至尖酸刻薄。他的激情、精力、欲望、完美主义、艺术修养、残暴还有对掌控权...(展开全部)",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/76b26760d613",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/178nKEiaYisq2kzef6CtVBA?pwd=eou9",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 166,
    title: "德米安",
    author: "[德] 赫尔曼·黑塞 出版社: 上海人民出版社 出品方: 世纪文景 副标题: 埃米尔·辛克莱的彷徨少年时 原作名: Demian: die geschichte von emil sinclairs jugend 译者: 丁君君 / 谢莹莹 出版年: 2009-3 页数: 193 定价: 25.00元 装帧: 平装 丛书: 赫尔曼·黑塞作品系列 ISBN: 9787208081550",
    authorDetail: "福楼拜（1821-1880）法国十九世纪现实主义文学代表作家之一。代表作有《包法利夫人》《情感教育》《圣·安东尼的诱惑》《纯朴的心》等。李健吾（1906-1982） 作家、戏剧家、文艺评论家、翻译家、法国文学研究专家。山西运城人。1925年考入清华大学，先在中文系，后转 入西洋文学系。1931年赴法国留学，1933年回国。曾在暨南大学、北京大学、中国社科院工作。创作剧作近五十部，小说、评论集多部；著有《福楼拜评传》《汤达研究》《莫里哀的喜剧》等专著与专论；翻译莫里哀、高尔基、契诃夫、托尔斯泰、屠格涅夫等人的戏剧多部，以及巴尔扎克、汤达、缪塞等人的作品。",
    year: "2009",
    cover: "https://img.aqifei.top/img/2026/01/172_德米安",
    description: "《德米安：埃米尔·辛克莱的彷徨少年时》是黑塞的代表作之一，讲述少年辛克莱寻找通向自身之路的艰辛历程。出生并成长于“光明世界”的辛克莱，偶然发现截然不同的“另一个世界”，那里的纷乱和黑暗，使他焦虑困惑，并陷入谎言带来的灾难之中。这时，一个名叫德米安的少年出现，将他带出沼泽地，从此他开始走向孤独寻找自我的前路。之后的若干年，“德米安”以不同的身份面目出现，在他每一次孤独寻找、艰难抉择的时候，成为他的引路人……",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/34984fac3d15",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1qJv-HRR8aTUQcZ_VcDluvQ?pwd=6i2e",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 167,
    title: "爱的艺术",
    author: "[美] 艾·弗洛姆",
    authorDetail: "卡罗琳·克里亚多·佩雷斯（Caroline Criado Perez）英国作家、记者。曾就读于牛津大学（英语语言和文学专业学士）、伦敦政治经济学院（性别研究专业硕士），作品常见于《卫报》《泰晤士报》《金融时报》《新政治家》等知名媒体。2015年出版女性群像传记《像女人一般》（Do It Like a Woman），入选多家媒体年度好书榜单；2019年出版《看不见的女性》，此书被翻译成30种语言，获得英国书店奖最受读者欢迎好书、英国皇家学会科学图书奖、《金融时报》及麦肯锡商业图书奖等重要奖项。写作之外，卡罗琳·克里亚多·佩雷斯积极推动男女平等和社会正义，她成功阻止了英国银行移除英镑纸钞上除英国女王之外的唯一女性肖像；在雕像全为男性的英国议会广场上为妇女参政论者竖立雕像，以纪念英国女性在1918年获得选举权；促使推特更改关于网络暴力和威胁的处理程序...(展开全部)",
    year: "2008",
    cover: "https://img.aqifei.top/img/2026/02/20260210110429442",
    description: "《爱的艺术》是德裔美籍心理学家和哲学家、法兰克福学派重要成员艾里希-弗洛姆最著名的作品，自1956年出版至今已被翻译成32种文字，在全世界畅销不衰，被誉为当代爱的艺术理论专著最著名的作品。在这本书中，弗洛姆认为，爱情不是一种与人的成熟程度无关，只需要投入身心的感情。如果不努力发展自己的全部人格并以此达到一种创造倾向性，那么每种爱的试图都会失败，如果没有爱他人的能力，如果不能真正谦恭地、勇敢地、真诚地和有纪律地爱他人，那么人们在自己的爱情生活中也永远得不到满足。弗洛姆进而提出，爱是一门艺术，要求想要掌握这门艺术的人有这方面的知识并付出努力。在这里，爱不仅仅是狭隘的男女爱情，也并非通过磨练增进技巧即可获得。爱是人格整体的展现，要发展爱的能力，就需要努力发展自己的人格，并朝着有益的目标迈进。此版特别收录弗洛姆学术助手纪念文章《弗洛姆生命中的爱》。",
    category: "艺术设计",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/14761e7f18e6",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1fFNUZpxn9Sv0t9k9R4dWvw?pwd=1bd4",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 168,
    title: "天生有罪",
    author: "[南非] 特雷弗·诺亚",
    authorDetail: "特雷弗·诺亚（Trevor Noah）1984年2月20日出生于南非约翰内斯堡，曾担任电视台、广播电台主持人和脱口秀演员，声名鹊起之后于2014年底赴美国发展，担任美国“喜剧中心”电视台著名脱口秀节目《每日秀》（The Daily Show）的通讯员，后在2015年成为该节目的主持人。诺亚目前生活在纽约。",
    year: "2018",
    cover: "https://img.aqifei.top/img/2026/01/174_天生有罪",
    description: "火遍微博、微信的《小崔每日秀》主持人特雷弗·诺亚首部回忆录比尔·盖茨2017年夏季书单推荐图书美国《纽约时报》《新闻日报》《时尚先生》及“国家公共电台”年度好书2017年瑟伯美国幽默文学奖得主美国亚马逊周阅读榜连续在榜，评分高达4.8编辑推荐：★	囧司徒接班人崔那娃爆笑回忆录 作为美国最具影响力的脱口秀节目之一，《囧司徒每日秀》曾在中国收获了一大批忠实粉丝，他宣布辞职后，钦点了南非脱口秀明星特雷弗·诺亚担任继任者。名不见经传的诺亚以自己独特的喜剧风格，在美国内外收获了大批粉丝，并被中国观众亲切称为“崔那娃”。在本书中，小崔将他的幽默天赋发挥到了极致，完美展示了为什么他会被选为《每日秀》的主持人。★	“生而有罪”的崔那娃讲述贫民窟的成长经历 小崔出生在种族隔离制度下的南非，其父母属于跨种族结合，因此他生下来就犯了罪，再加上他从小生活在贫民...(展开全部)",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/dfaa8055ab1b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1DNeGS7uMWSkHSablvGxLAg?pwd=55ll",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 169,
    title: "温柔的夜",
    author: "三毛",
    authorDetail: "罗兰·米勒（Rowland S. Miller），美国萨姆休斯顿州立大学心理学教授，1973年获康奈尔大学心理学学士学位，分别于1976年和1978年获佛罗里达大学社会心理学硕士和博士学位。自1978年至今一直在萨姆休斯顿州立大学讲授亲密关系课程，因教学与研究优秀曾获人际关系研究国际协会的教学奖、美国心理协会（APA）和国际心理学荣誉学会（Psi Chi）的 Edwin B. Newman 奖。研究兴趣包括社会心理学、社会情绪（如尴尬、耻辱）、亲密关系等，现在侧重亲密关系的维持过程。著有《亲密关系》《尴尬：日常生活中的镇定与险境》。",
    year: "2007",
    cover: "https://img.aqifei.top/img/2026/01/175_温柔的夜",
    description: "《温柔的夜》记录了三毛在加纳利群岛的生活，共十四篇。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5b31947f651e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1nVjFH5dyQUBWy858XxbSIQ?pwd=yqkh",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 170,
    title: "亲密关系（第6版）",
    author: "[美] 罗兰·米勒",
    authorDetail: "罗兰·S·米勒（Rowland S. Miller），美国萨姆休斯顿州立大学心理学杰出教授。他从事“亲密关系”课程教学超过40年，并于2008年获得国际人际关系研究协会颁发的教学奖。他的代表作《亲密关系》被公认为该研究领域的百科全书，整合了社会心理学、沟通研究和家庭研究等多个领域的实证成果。",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/176_亲密关系（第6版）",
    description: "亲密关系与泛泛之交有什么区别？大丈夫与小女子真的般配吗？吸引力的秘密是什么？男人与女人真的是不同的动物吗？同性恋真的是由基因决定的吗？单亲家庭的孩子长大后更容易离婚吗……什么是爱情？由什么构成？能持续多久？两性在发生一夜情及选择终身伴侣上有什么差异？爱情和性欲是由不同的脑区控制吗？亲密关系美满的秘诀是什么？有什么方法能让婚姻持续一生？米勒教授在本书中回答了这些问题，尤其澄清了通俗心理学所宣扬的经验之谈，甚至某些错误观点。本书汲取了社会心理学、沟通研究、家庭研究、认知心理学、发展心理学、演化心理学、社会学、传播学及家政学等学科的最新成果，研究实践和理论建构并重，学术标准与大众兴趣兼备。全书结构清晰、逻辑严密、语言生动、启发思考，既通俗易懂，读来轻松愉快，又科学权威，崇尚实证精神。本书遵循由浅入深、由一般到特殊的认知规律，论述了亲密关系的基础、活动形...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/2c423ff5e6ee",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1H-vdV_ibpd3rQ0P9BtxNcA?pwd=7ndj",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 171,
    title: "倾城之恋",
    author: "张爱玲",
    authorDetail: "刘慈欣，首位获得世界科幻奖“雨果奖”的亚洲作家，中国科幻文学的主要代表作家，中国科普作家协会会员。自上世纪90年代开始发表科幻作品，曾连续九次获得中国科幻“银河奖”。2015年，凭借长篇小说《三体》成为亚洲首位“雨果奖”获得者。因为对中国科幻文学的巨大贡献，于同年获得银河奖“科幻功勋奖”。刘慈欣的作品兼具科学探索与人文关怀，在世界科幻文学中树立了一种具有中国特色的科幻文学样式，其“三体三部曲”被认为是中国科幻文学的里程碑之作。",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/01/177_倾城之恋",
    description: "◑张爱玲中短篇小说集。收录创作于1943年至1944年创作的中短篇小说《第一炉香》《第二炉香》《茉莉香片》《心经》《封锁》《倾城之恋》《琉璃瓦》《金锁记》《连环套》。◑三十年前的上海，一个有月亮的晚上……我们也许没赶上看见三十年前的月亮。——《金锁记》◑葛薇龙，一个 极普通的上海女孩子，站在半山里一座大住宅的走廊上，向花园里远远望过去。——《第一炉香》◑在这动荡的世界里，钱财，地产，天长地久的一切，全不可靠了。靠得住的只有她腔子里的这口气，还有睡在她身边的这个人。——《倾城之恋》◑全新精装，臻美典藏，月亮构筑起的永恒传奇。",
    category: "情感小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/473e73d4342b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1I3Gin6psTpfIaMKqM_JiXw?pwd=jq2b",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 172,
    title: "球状闪电",
    author: "刘慈欣",
    authorDetail: "李娟，籍贯四川乐至县，1979年出生于新疆奎屯，1999年开始写作。长期居住在新疆阿泰勒地区，与母亲、外婆等亲人一起，以开小卖部、做裁缝等为生，跟随放牧的哈萨克人而流转在广袤的北疆阿尔泰山区。同时，种葵花、养鸡、放鸭子、到森林里检木耳，过着没有网络，没有电视的生活，自由而宁静。其文字明净纯粹，多围绕个人体验展现新疆阿勒泰游牧地区的生存景观，以绝对清新之风引起了文坛震惊。曾在《南方周末》、《文汇报》等开设专栏，出版有个人散文集《九篇雪》、《阿勒泰的角落》、《走夜路请放声歌唱》，非虚构长篇《冬牧场》及“羊道”三部曲。曾获“人民文学奖”、“上海文学奖”、“朱自清散文奖”、“天山文艺奖”等。现生活于北疆地区，供职于新疆文联。康剑，护林人，摄影人，偶尔写写散文。长期生活在喀纳斯湖周围的深山老林里，对这方山水有着深厚的感情，强烈的眷恋。著有散文摄影集《喀纳斯自然...(展开全部)",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/02/20260210110408993",
    description: "某个离奇的雨夜，一个球状闪电闯进了少年的视野，并在一瞬间将少年的父母化为灰烬。少年毕其一生去解开那个将他变成孤儿的自然之谜。但未曾想，多年后，他的研究被纳入“新概念武器”开发计划，他所追寻的球状闪电变成了下一场战争中决定祖国生存或是灭亡的终武器。及锋而试，大西北戈壁滩上升起冰冷的“蓝太阳”，世界变得陌生而怪异。一个完全未知的未来，在宇宙观测者的注视下，降临在人类面前……",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b6c0a429b507",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1IC5ykbT2OJLRY0EvgOI_bg?pwd=i09i",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 173,
    title: "我的阿勒泰",
    author: "李娟",
    authorDetail: "东野圭吾日本作家。1985年，《放学后》获第31届江户川乱步奖，开始专职写作；1999年，《白夜行》获周刊文春推理小说榜年度第1名，《秘密》获第52届日本推理作家协会奖；2005年出版的《嫌疑人X的献身》同时获得第134届直木奖、第6届本格推理小说大奖，以及日本三大推理小说排行榜年度第1名；2008年，《 流星之绊》获第43届新风奖；2009年出版的《新参者》获两大推理小说排行榜年度第1名；2012年，《解忧杂货店》获第7届中央公论文艺奖；2013年，《梦幻花》获第26届柴田炼三郎奖；2014年，《祈祷落幕时》获第48届吉川英治文学奖。",
    year: "2018",
    cover: "https://img.aqifei.top/img/2026/01/179_我的阿勒泰",
    description: "李娟的散文成名作和代表作之一。原生态记录了作者在疆北阿勒泰地区生活的点点滴滴，包括人与事的记忆和感悟。全书文字明净，质地纯粹，原生态地再现了疆北风物人情，充满了朴野清新的气息。十年前，作者在到处收集来的纸片上用密密麻麻的文字写下她的生活和感悟，投稿到新疆的文艺期刊。一些资深的编辑认为一个二十岁左右的女孩不可能写出如此清新而有才华的作品。但新疆著名作家刘亮程将她挖掘出来，她的*部作品以《九篇雪》为名结集出版，人们才开始知道有个新疆女孩叫李娟。此后，她的散文在《南方周末》、《文汇报》陆续刊登，完全是天才的笔触，引起了文坛的震惊。人们很难想象：一个没有受过完整高等教育、阅读范围主要限于金庸、琼瑶、一直生活在疆北荒野之地的女孩，能够写出如此清新、活泼、充满灵性和生命力的文字。她的作品和图书相继荣获年度华文*散文奖，入评年度十大好书，很有可能将成为这个时代的散...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/6e16c3a076f9",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1RkAH0AwmiysissRarrJpiQ?pwd=jyo0",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 174,
    title: "恶意",
    author: "[日] 东野圭吾",
    authorDetail: "米兰·昆德拉（Milan Kundera, 1929- ），捷克小说家，生于捷克布尔诺市。父亲为钢琴家、音乐艺术学院的教授。生长于一个小国在他看来实在是一种优势，因为身处小国，“要么做一个可怜的、眼光狭窄的人”，要么成为一个广闻博识的“世界性的人”。童年时代，他便学过作曲，受过良好的音乐熏陶和教育。少年时代，开始广泛阅读世界文艺名著。青年时代，写过诗和剧本，画过画，搞过音乐并从事过电影教学。总之，用他自己的话说， “我曾在艺术领域里四处摸索，试图找到我的方向。”50年代初，他作为诗人登上文坛，出版过《人，一座广阔的花园》（1953）、《独白》（1957）以及《最后一个五月》等诗集。但诗歌创作显然不是他的长远追求。最后，当他在30岁左右写出第一个短篇小说后，他确信找到了自己的方向，从此走上了小说创作之路。1967年，他的第一部长篇小说《玩笑》在捷克出...(展开全部)",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/02/20260210110344356",
    description: "《恶意》是东野圭吾挑战写作极限的长篇杰作，与《白夜行》《嫌疑人X的献身》《解忧杂货店》并称东野圭吾四大杰作。《恶意》深刻揭示人性，故事中无边的恶意深不见底，有如万丈深渊，让人不寒而栗。从未遇到这样的案子：杀人不是目的，而是手段；死亡不是结束，而是开始。 读完《恶意》，才算真正认识东野圭吾。============================ ================================畅销作家在出国前一晚被杀，警方很快锁定了凶手。此人供认自己是一时冲动犯下了罪行。案子到此已经可以了结。可办案的加贺警官并不这么认为，因为他找不到凶手作案的动机，凶手也一直对动机避而不谈。加贺不愿草草结案，大量走访。渐渐显露的真相让他感到冰冷的寒意——“你心里藏着对他的恶意，这仇恨深不见底，深得连你自己都无法解释。正是它导致了这起案件。这股恶...(展开全部)",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f90d2cf08a21",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1W-RoJFdKzMB2BTcyrapN8A?pwd=iouo",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 175,
    title: "不能承受的生命之轻",
    author: "[捷克] 米兰·昆德拉 出版社: 上海译文出版社 原作名: Nesnesitelná lehkost bytí 译者: 许钧 出版年: 2003-7 页数: 394 定价: 23.00元 装帧: 平装 丛书: 米兰·昆德拉作品系列（2003版） ISBN: 9787532731077",
    authorDetail: "米兰·昆德拉（Milan Kundera，1929—2023），捷克裔法国作家，20世纪最具影响力的文学巨匠之一。他早年用捷克语写作，后改用法语，代表作有《不能承受的生命之轻》、《玩笑》、《生活在别处》等。他的作品常将哲学思辨与叙事艺术完美结合，探讨“轻与重”、“记忆与遗忘”、“媚俗”等深刻主题。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/181_不能承受的生命之轻",
    description: "《不能承受的生命之轻》是米兰·昆德拉最负盛名的作品。小说描写了托马斯与特丽莎、萨丽娜之间的感情生活。但它不是一个男人和两个女人的三角性爱故事，它是一部哲理小说，小说从“永恒轮回”的讨论开始，把读者带入了对一系列问题的思考中，比如轻与重、灵与肉。《不能承受的生命之轻》是一部意象繁复的书，其中装载了多种涵义：被政治化了的社会内涵的揭示、人性考察、个人命运在特定历史与政治语境下的呈现，以及对两性关系本质上的探索等。昆德拉将这些元素糅合在一起，写成一部非同凡响的小说——其中既有隐喻式的哲学思考，也有人的悲欢离合的生命历程的展现。",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f3b4add960ad",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1K4k1OOkCwom7FFGrG-vcbQ",
        code: "wn6w"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 176,
    title: "帷幕",
    author: "[英]阿加莎·克里斯蒂",
    authorDetail: "卡罗琳·克里亚多·佩雷斯（Caroline Criado Perez）英国作家、记者。曾就读于牛津大学（英语语言和文学专业学士）、伦敦政治经济学院（性别研究专业硕士），作品常见于《卫报》《泰晤士报》《金融时报》《新政治家》等知名媒体。2015年出版女性群像传记《像女人一般》（Do It Like a Woman），入选多家媒体年度好书榜单；2019年出版《看不见的女性》，此书被翻译成30种语言，获得英国书店奖最受读者欢迎好书、英国皇家学会科学图书奖、《金融时报》及麦肯锡商业图书奖等重要奖项。写作之外，卡罗琳·克里亚多·佩雷斯积极推动男女平等和社会正义，她成功阻止了英国银行移除英镑纸钞上除英国女王之外的唯一女性肖像；在雕像全为男性的英国议会广场上为妇女参政论者竖立雕像，以纪念英国女性在1918年获得选举权；促使推特更改关于网络暴力和威胁的处理程序...(展开全部)",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/182_帷幕",
    description: "波洛与挚友黑斯廷斯的探案生涯回到了原点，他们再次相聚于斯泰尔斯庄园——正是在这里，初到英国的波洛解决了第一起谋杀案。如今的波洛已到风烛残年，但还有一件急迫的任务摆在面前：一名已经犯下五起谋杀案的凶手也来到了这里。在帷幕降下之前，他必须阻止凶手再次出击……",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/36abf6fc5ac7",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1WnJXVZSdQ4UDnOY2DdIEYA?pwd=xwoo",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 177,
    title: "古文观止",
    author: "吴楚材 / 吴调侯",
    authorDetail: "吴楚材、吴调侯，清代初年浙江山阴（今绍兴）人，叔侄关系。两人长期在乡间设馆授徒，深知学生习文之难，故联手编选了这部《古文观止》。该书成书于康熙三十三年（1694年），收录了自东周至明末的散文佳作222篇，选目精当，简明易读，是三百年来流传最广、影响最大的古文入门读本。",
    year: "1987",
    cover: "https://img.aqifei.top/img/2026/01/183_古文观止",
    description: "《古文观止》是清康熙年间吴乘权、吴大职编选的一部古文读本，凡十二卷，收录自先秦至明末的散文二百二十二篇，每篇都有注释和评论。据《左传》襄公二十九年记载，吴公子季札在鲁国观看乐舞《韶�》时，以为尽善尽美，无以复加，赞叹道：“观止矣：若有他乐吾不敢请已！”本书书名中“观止”二字即由此而来，是表示所选的古文极好，堪称最佳读本。",
    category: "古典文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3f931f74440f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1T0lOHLh5pxg4Bvr486iEkw?pwd=xfyz",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 178,
    title: "包法利夫人",
    author: "福楼拜",
    authorDetail: "居斯塔夫·福楼拜（Gustave Flaubert，1821—1880），19世纪法国伟大的批判现实主义作家。他视文学创作为生命，对文字有极高的要求，被称为“文体家”。代表作《包法利夫人》不仅是现实主义文学的里程碑，也因其对“包法利主义”（即某种脱离现实、充满虚荣与幻想的心理状态）的深刻刻画而闻名于世。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/184_包法利夫人",
    description: "《包法利夫人》于1856-1857年间在《巴黎杂志》上连载，轰动文坛，在社会上引起轩然大波。法当局对作者提起公诉，指控小说“伤风败俗、亵渎宗教”，并传唤作者到庭受审，最终以“宣判无罪”收场，而隐居乡野、籍籍无名的作者从此奠定了自己的文学声誉和在文学的地位。曾有人问福楼拜，谁是法利夫人的原型，他答道：“包法利夫人就是我自己。”",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1ec44c1cdfa6",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1vzCeez6Np_6UmWDHMaNRLg?pwd=2lpx",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 179,
    title: "看不见的女性",
    author: "卡罗琳·克里亚多·佩雷斯",
    authorDetail: "卡罗琳·克里亚多·佩雷斯（Caroline Criado Perez），英国作家、记者及女性主义活动家，大英帝国勋章（OBE）获得者。她致力于揭露社会中隐形的性别歧视，代表作《看不见的女性》通过大量数据揭示了世界以男性为样本设计的“性别数据缺口”，该书荣获英国皇家学会科学图书奖及《金融时报》年度最佳商业图书奖。",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/02/20260210110021813",
    description: "这本书没有咆哮，只有事实和数字。在告诉我父权制是我想象出来的之前，请你先读读这本书。《看不见的女性》充满启示，令人恐惧，又充满希望。堪称一部现世的《圣经》。——珍妮特·温特森，英国知名作家卡罗琳·克里亚多·佩雷斯简直是掌握数据的西蒙娜·德·波伏瓦。——莱昂内尔·巴伯，《金融时报》前主编·🚺 关于全世界一半人口被无视、被消声的故事，全方位揭露无处不在的隐形歧视🚺 一本书彻底更新你的性别思维：我们的世界以男性为样本、由男性设计，为男性设计🚺 从校园到职场，从孕育到患病，“掌握数据的波伏瓦”展现她被忽视、压榨和威胁的一生🚺 一本改变游戏规则的书，获《金融时报》&麦肯锡商业图书奖🚺 当代女性生存指南：在专为男性设计的世界该如何生存和改变？🚺 横扫欧美市场，已译成30多种语言，简中版首次引进！🚺 英国书店最受读者欢迎好书，皇家学会科学图书...(展开全部)",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/60e98b8e5121",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1qA-TnOzD4Yn6YYcewt8kVQ?pwd=mz1n",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 180,
    title: "麦琪的礼物",
    author: "[美] 欧·亨利",
    authorDetail: "欧·亨利（O. Henry，1862—1910），原名威廉·西德尼·波特，美国著名短篇小说家，被誉为“美国现代短篇小说之父”。他一生创作了近300篇短篇小说，作品多以纽约普通市民的生活为题材，以幽默的语言、巧妙的构思和出人意料的结局（即“欧·亨利式结尾”）而著称。代表作有《麦琪的礼物》、《最后一片叶子》、《警察与赞美诗》等。",
    year: "2003",
    cover: "https://img.aqifei.top/img/2026/01/186_麦琪的礼物",
    description: "选收欧·亨利的小说34篇，国外当代文学类重要工具书介绍的有代表性的作品均已收入。欧·亨利是位有独特风格的杰出短篇小说家，以巧妙的构思、夸张和幽默的文笔反映了他那个时代的人和事。",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/59b0ac36308e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1OndKwv6lnr-mAr42XnCXQA?pwd=capz",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 181,
    title: "父权制与资本主义",
    author: "[日] 上野千鹤子",
    authorDetail: "上野千鹤子，日本著名社会学家，女性主义理论家，东京大学名誉教授",
    year: "2020",
    cover: "https://img.aqifei.top/img/2026/01/188_父权制与资本主义",
    description: "本书是作者历经十年完成的重要作品，对女权主义各个派别，特别是马克思主义女权主义的再次思考。近代社会在'资本主义'支配的'市场'和'父权制'支配的'家庭形态'双重控制下，以无偿的女性劳务为中心，形成了女性地位低下的历史根源。作者对此进行了深刻批判，并就如何改善女性的社会地位提出了中肯的建议。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1e7ab493c665",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/11KKA2eQq6Qu-mVOuw92kAQ?pwd=q0n9",
        code: "q0n9"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2020"
  },
  {
    id: 182,
    title: "一个女人的故事",
    author: "[法] 安妮·埃尔诺",
    authorDetail: "安妮·埃尔诺，2022年诺贝尔文学奖得主，法国当代著名女性作家，以自传体写作著称",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/01/189_一个女人的故事",
    description: "《一个女人的故事》是安妮·埃尔诺对母亲和女儿、青春和衰老、梦想和现实的感人叙述。在母亲死于阿尔茨海默症后，作者开始了令人生畏的时光倒流之旅，她试图捕捉真正的女人，那个独立于女儿而存在的女人。她探讨了母亲和女儿之间既脆弱又不可动摇的纽带，以及我们必须失去我们所爱之人这一无法逃避的事实。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/5f3952212d98",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1y3Klh2401_oaGtfGDH32vA?pwd=uvog",
        code: "uvog"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2022"
  },
  {
    id: 183,
    title: "足利女童连续失踪事件",
    author: "[日] 清水洁",
    authorDetail: "清水洁，日本著名调查记者，以深度报道冤案和社会事件著称",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/01/190_足利女童连续失踪事件",
    description: "本书是一部讲述日本'足利事件'全过程的纪实文学作品，直击儿童诱拐、女性安全、冤案误判、受害者有罪论、侦查黑幕、媒体报道争议等社会痛点议题。作者亲临案发现场，不断进行取证调查，还原案情细节，面对警方引以为傲多年的办案功勋，他大声而坚定地提出质疑，最终叫停17年冤狱。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ed1a5b961bf5",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/18R4awFt1zNIitc8vEbQ1Cg?pwd=brhd",
        code: "brhd"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2022"
  },
  {
    id: 184,
    title: "雕刻时光",
    author: "[苏] 安德烈·塔可夫斯基",
    authorDetail: "安德烈·塔可夫斯基，苏联著名电影导演，被誉为现代艺术电影圣三位一体之一",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/01/191_雕刻时光",
    description: "《雕刻时光》是塔可夫斯基的电影理论著作，被视为电影艺术的圣经。书中以'雕刻时光'为核心隐喻，将电影创作类比雕塑过程——从庞杂的时间素材中剔除冗余，提炼出承载意义的影像序列。塔可夫斯基主张电影本质在于捕捉时间的真实流动，书中结合其重要作品的创作实践，探讨艺术家使命、电影形象构建等议题。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/52e0b88808d2",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1rfAC2LQb4ngK8m-qsq6wmw?pwd=djz8",
        code: "djz8"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2016"
  },
  {
    id: 185,
    title: "一桩事先张扬的凶杀案",
    author: "[哥伦比亚] 加西亚·马尔克斯",
    authorDetail: "加西亚·马尔克斯，哥伦比亚作家，诺贝尔文学奖得主，魔幻现实主义文学代表",
    year: "1981",
    cover: "https://img.aqifei.top/img/2026/01/192_一桩事先张扬的凶杀案",
    description: "《一桩事先张扬的凶杀案》描写的是发生在1951年的真人真事。出身显赫的巴亚多·圣·罗曼来到加勒比海沿岸的一个小镇，爱上了出身平庸的安赫拉·维卡略。新婚之夜他发现新娘不是处女，万分沮丧之下把她休回娘家。姑娘的母亲逼问是谁破坏了她的贞节，姑娘无奈之下将其归罪于圣地亚哥·纳赛尔，两个哥哥拿上杀猪刀凶残地杀害了这个无辜者。小说通过一个小题材，辛辣地嘲讽了权贵，无情地揭露和批判了愚昧无知的封建礼教。...",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/20e27255bc05",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1LqcGv8YIwJS8mzMSFNhSnA?pwd=ikeh",
        code: "ikeh"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1981"
  },
  {
    id: 186,
    title: "挽救计划",
    author: "[美] 安迪·威尔",
    authorDetail: "安迪·威尔，美国科幻作家，凭借处女作《火星救援》一炮而红，擅长硬核科幻",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/02/20260211203134625",
    description: "一趟孤注一掷的太空远征，一座没有尽头的科学迷宫，一次争分夺秒的冒险营救，一段跨越星际的真挚友谊。浩瀚宇宙中，瑞恩·格雷斯是整个人类文明仅存的希望。但在醒来的那一刻，他连自己的名字都不记得。他在未知的恐惧中寻找身份，从记忆的碎片中获取线索。这个肩负拯救地球重任的关键人物，现已命悬一线！人类文明究竟能否存续？...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f45616ed9aa7",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ty3sn4d-RW6UKaS94QpLnw?pwd=x8d4",
        code: "x8d4"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2021"
  },
  {
    id: 187,
    title: "翦商",
    author: "李硕",
    authorDetail: "李硕，青年历史学家，著有《南北战争三百年》《孔子大历史》等有影响力的历史著作",
    year: "2022",
    cover: "https://img.aqifei.top/img/2026/01/194_翦商",
    description: "本书主要讲述华夏文明的萌生与转型。从距今四千年前夏朝的出现，到三千年前商朝的灭亡、西周建立，时间跨度一千余年。本书借助考古材料和传世文献，梳理了上古人祭风俗产生、繁荣和消亡的全过程，以及人祭与华夏早期文明从伴生到分离的伟大转折，再现了古人为终结商朝和人祭风俗付出的巨大努力，使我们对华夏文明的起源有了全新的认知。...",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4dd7bc1dec1d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1EzHSfXwXHYDD4ZYziwR0dg?pwd=o0yv",
        code: "o0yv"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2022"
  },
  {
    id: 188,
    title: "我也有一个梦想",
    author: "林达",
    authorDetail: "林达，美籍华人作家，以介绍美国历史和政治制度著称",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/02/20260211203017631",
    description: "本书通过精彩动人的故事，展示了与美国种族问题相关联的社会意识和法律演进史，介绍了在契约社会里，立法的民众基础、法律对人性的思考、法律的变化与社会进步的关系等问题。通过作者的叙述，能够看到在法治国家里，民众尤其是弱势人群怎样运用法律，经过长期抗争，取得自身权益，并由此推动全社会认识的深化。...",
    category: "成长励志",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4c83cd90bcfb",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1LJ2P5SzlgmlHSDR68xi6PQ?pwd=1d7k",
        code: "1d7k"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2019"
  },
  {
    id: 189,
    title: "激荡三十年",
    author: "吴晓波",
    authorDetail: "吴晓波，著名财经作家，单向街图书馆创办人之一，'蓝狮子'财经图书出版人",
    year: "2007",
    cover: "https://img.aqifei.top/img/2026/01/196_激荡三十年（上）",
    description: "本书站在民间的角度，以真切而激扬的写作手法描绘了中国企业在改革开放年代走向市场、走向世界的成长、发展之路。改革开放初期汹涌的商品大潮；国营企业、民营企业、外资企业，这三种力量此消彼长、互相博弈的曲折发展；整个社会的躁动和不安……整部书稿中都体现得极为真切和实在。它承载了太多人的光荣与梦想，是几乎一代人共同成长的全部记忆。...",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ed028cabfd3a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1046W0h9vezp1WdFS_InK0g?pwd=ghb8",
        code: "ghb8"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2007"
  },
  {
    id: 190,
    title: "在细雨中呼喊",
    author: "余华",
    authorDetail: "余华，中国当代著名作家，代表作《活着》《许三观卖血记》等",
    year: "1991",
    cover: "https://img.aqifei.top/img/2026/01/197_在细雨中呼喊",
    description: "《在细雨中呼喊》是余华的第一部长篇小说，讲述了一个少年的成长经历和心灵历程。小说通过主人公孙光林的视角，展现了上世纪六七十年代中国乡村的生活图景，以及人性的复杂与温暖。作品以细腻的笔触描绘了家庭关系、友情、青春困惑等主题，是余华创作生涯中的重要作品。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0dde065ba38a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1gRu8DBLUAXe9BJa96_Ifiw?pwd=mu9b",
        code: "mu9b"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1991"
  },
  {
    id: 191,
    title: "跨越边界的社区",
    author: "项飙",
    authorDetail: "项飙，人类学家，牛津大学社会人类学教授",
    year: "2018",
    cover: "https://img.aqifei.top/img/2026/01/198_跨越边界的社区（修订版）",
    description: "本书是作者对北京'浙江村'进行长期田野调查的成果。作者深入社区，详细记录了'浙江村'的形成、发展、内部运作机制，以及与国家权力的互动关系。这一研究不仅深化了对中国城市化进程的理解，也为人类学和社会学的研究方法提供了重要的实践范例。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/dccf6a5dd854",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2018"
  },
  {
    id: 192,
    title: "银河帝国：基地七部曲",
    author: "[美] 艾萨克·阿西莫夫",
    authorDetail: "艾萨克·阿西莫夫，美国著名科幻作家，与阿瑟·克拉克、罗伯特·海因莱因并称为科幻三巨头",
    year: "1951",
    cover: "https://img.aqifei.top/img/2026/02/20260211202950848",
    description: "《银河帝国：基地七部曲》是科幻文学史上的经典巨著。故事讲述人类已遍布银河系，建立了庞大的银河帝国。心理史学家哈里·谢顿预言帝国即将崩溃，并建立了'基地'以保存人类文明。在长达数百年的历史长河中，基地经历了种种危机与挑战。这部作品以其宏大的叙事、深刻的思想，成为科幻文学的丰碑。...",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/4b1dd16317af",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1SkO9rkpI-2_UoCFh35QDhw?pwd=oatb",
        code: "oatb"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1951"
  },
  {
    id: 193,
    title: "尼罗河上的惨案",
    author: "[英] 阿加莎·克里斯蒂",
    authorDetail: "阿加莎·克里斯蒂，英国侦探小说女王，被誉为'推理小说界的莎士比亚'",
    year: "1937",
    cover: "https://img.aqifei.top/img/2026/01/200_尼罗河上的惨案",
    description: "琳内特·里奇卫是一位年轻貌美、财富惊人的女子，她抢走了女仆杰奎琳的未婚夫西蒙，并与之闪电结婚。新婚夫妇前往埃及度蜜月，乘坐尼罗河游轮。然而在一个月光皎洁的夜晚，琳内特被枪杀在自己的舱房中。大侦探波洛正好也在船上，他通过细致入微的观察和缜密的推理，揭开了这桩看似不可能犯罪的真相。...",
    category: "推理悬疑",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/6335f70bc1e1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/151Gm2Z1UClSKCIFHmnZA4A?pwd=tdmz",
        code: "tdmz"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1937"
  },
  {
    id: 194,
    title: "海风中失落的血色馈赠",
    author: "[加] 阿利斯泰尔·麦克劳德",
    authorDetail: "阿利斯泰尔·麦克劳德，加拿大著名作家，以描写布雷顿角的小说闻名",
    year: "1976",
    cover: "https://img.aqifei.top/img/2026/01/201_海风中失落的血色馈赠",
    description: "这是一部关于布雷顿角的短篇小说集，收录了七个充满深情的故事。小说以加拿大东海岸的布雷顿角为背景，描绘了矿工、渔民等普通人的生活，展现了人与土地、传统与现代之间的张力。麦克劳德的文字质朴而富有诗意，情感深沉，是一部充满人性光辉的文学杰作。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d3ecab514ca1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1hJUgmHnQn-aXIgSOFiKhmQ?pwd=z71m",
        code: "z71m"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1976"
  },
  {
    id: 195,
    title: "骆驼祥子",
    author: "老舍",
    authorDetail: "老舍，中国现代著名小说家、剧作家，代表作《茶馆》《四世同堂》等",
    year: "1937",
    cover: "https://img.aqifei.top/img/2026/01/202_骆驼祥子",
    description: "《骆驼祥子》是老舍的代表作之一，讲述了人力车夫祥子的悲惨命运。祥子来自农村，怀揣梦想来到北平城，希望通过自己的努力买一辆属于自己的车。然而在那个黑暗的社会里，他的梦想一次次破灭，最终被生活压垮。小说深刻揭示了旧社会底层人民的苦难生活，是中国现代文学的经典之作。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/12999931a55a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1qWg_Y6nwsFJJYVDDWhSRiw?pwd=depb",
        code: "depb"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1937"
  },
  {
    id: 196,
    title: "当呼吸化为空气",
    author: "[美] 保罗·卡拉尼什",
    authorDetail: "保罗·卡拉尼什，美国神经外科医生、作家",
    year: "2016",
    cover: "https://img.aqifei.top/img/2026/01/203_当呼吸化为空气",
    description: "保罗·卡拉尼什是一位才华横溢的神经外科医生，在事业即将达到巅峰时，却被诊断出患有晚期肺癌。面对死亡，他开始重新审视生命的意义。这本书是他在生命最后阶段写下的回忆录，记录了从医生到患者的身份转变，以及对生死、人性、医学伦理的深刻思考。这是一部感人至深的生命之书。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3173bb7686d9",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1xPu117es774YCTpw_HMucQ?pwd=7fkg",
        code: "7fkg"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2016"
  },
  {
    id: 197,
    title: "从零开始的女性主义",
    author: "[日] 上野千鹤子",
    authorDetail: "上野千鹤子，日本著名社会学家，女性主义理论家",
    year: "2021",
    cover: "https://img.aqifei.top/img/2026/01/204_从零开始的女性主义",
    description: "本书是日本女性主义理论家上野千鹤子的经典之作。书中以通俗易懂的语言，系统介绍了女性主义的基本概念和历史发展，探讨了性别歧视、家庭制度、职场平等、身体自主权等重要议题。上野千鹤子以其犀利的观点和深刻的洞察力，为读者打开了一扇了解女性主义的窗口，是一部入门级的女性主义启蒙读物。...",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/9f9cc872d90d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1wDvv6AN0e-4yEq52BHz06g?pwd=qq2j",
        code: "qq2j"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2021"
  },
  {
    id: 198,
    title: "雷雨",
    author: "曹禺",
    authorDetail: "曹禺，中国现代话剧奠基人之一，代表作《雷雨》《日出》《原野》等",
    year: "1934",
    cover: "https://img.aqifei.top/img/2026/01/205_雷雨",
    description: "《雷雨》是中国现代话剧的经典之作，讲述了周、鲁两个家庭之间复杂的恩怨情仇。在一个雷雨交加的夜晚，三十年前的秘密被揭开，所有的矛盾集中爆发。作品深刻揭露了封建家庭的罪恶，展现了人性的复杂与悲剧。其精巧的戏剧结构、深刻的思想内涵，使其成为中国话剧史上不朽的丰碑。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/30bac8a56564",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1uS4OS2QP52EGptNf1chf-g?pwd=olxc",
        code: "olxc"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1934"
  },
  {
    id: 199,
    title: "荒原狼",
    author: "[德] 赫尔曼·黑塞",
    authorDetail: "赫尔曼·黑塞，德国作家，诺贝尔文学奖得主，以其深刻的心理分析和灵性探索著称",
    year: "1927",
    cover: "https://img.aqifei.top/img/2026/01/206_荒原狼",
    description: "《荒原狼》是黑塞的代表作之一，讲述了一个名叫哈里·哈勒尔的男人的精神危机。哈里自称'荒原狼'，认为自己身上同时存在着人性和狼性两种本性。小说通过哈里的内心独白和奇幻经历，探讨了现代人的精神分裂、孤独、自我认同等深刻主题。这是一部充满哲学思考和诗意想象的心理小说。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/2f469fb89719",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Px0Z-3n5W7FhOeF38VBWDw?pwd=ha8m",
        code: "ha8m"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1927"
  },
  {
    id: 200,
    title: "情书",
    author: "[日] 岩井俊二",
    authorDetail: "[日] 岩井俊二，著名作家",
    year: "1995",
    cover: "https://img.aqifei.top/img/2026/02/20260212134041480",
    description: "《情书》是日本作家岩井俊二创作的长篇小说及成名作。小说以两位同名主人公的书信往来为契机，通过平行叙事展现两段跨越时空的情感纠葛。故事核心围绕大雪与感冒的隐喻意象展开回忆叙事，借书卡背面的素描作为关键信物串联起青春暗恋的伏线。...",
    category: "情感小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d992656bc27f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/114lAoNMuyBN_j_viWunvGg?pwd=s08q",
        code: "s08q"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1995"
  },
  {
    id: 201,
    title: "水浒传",
    author: "[明] 施耐庵",
    authorDetail: "[明] 施耐庵，著名作家",
    year: "元末明初",
    cover: "https://img.aqifei.top/img/2026/01/209_水浒传（全二册）",
    description: "《水浒传》是中国古典四大名著之一，描写以宋江为首的一百零八位梁山好汉从聚义梁山到接受招安的故事。全书通过一系列梁山英雄反抗压迫、英勇斗争的生动故事，暴露了北宋末年统治阶级的腐朽和残暴，揭露了当时尖锐对立的社会矛盾和官逼民反的残酷现实。...",
    category: "人物传记",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d5568d0af6d4",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1SFmTZKbckBpUgTiPqWBKRw?pwd=me9s",
        code: "me9s"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "元末明初"
  },
  {
    id: 202,
    title: "倚天屠龙记",
    author: "金庸",
    authorDetail: "金庸，著名作家",
    year: "1961",
    cover: "https://img.aqifei.top/img/2026/02/20260212134000195",
    description: "《倚天屠龙记》是金庸射雕三部曲的最后一部，以元末群雄纷起、江湖动荡为广阔背景，叙述武当弟子张无忌的江湖生涯。故事围绕屠龙刀和倚天剑展开，展现众武林豪杰质朴自然、形态各异的精神风貌。...",
    category: "武侠仙侠",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1e92ac697b35",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1kHkLtrllJLuYQZ3AiiEa_w?pwd=s7ad",
        code: "s7ad"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1961"
  },
  {
    id: 203,
    title: "一千零一夜",
    author: "佚名",
    authorDetail: "佚名，著名作家",
    year: "古代",
    cover: "https://img.aqifei.top/img/2026/01/211_一千零一夜",
    description: "《一千零一夜》是著名的古代阿拉伯民间故事集，又名《天方夜谭》。全书包括神话传说、寓言童话、航海冒险、宫廷趣闻等数百个故事，展现了中世纪阿拉伯帝国的社会生活风貌。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/02ca3c776952",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1FlOzUpOVxwKkklGoQIF19g?pwd=uep6",
        code: "uep6"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "古代"
  },
  {
    id: 204,
    title: "孙子兵法",
    author: "[春秋] 孙武",
    authorDetail: "[春秋] 孙武，著名作家",
    year: "春秋",
    cover: "https://img.aqifei.top/img/2026/01/212_孙子兵法",
    description: "《孙子兵法》是中国现存最早的兵书，也是世界上最早的军事著作。全书共十三篇，系统总结了春秋时期的战争经验，揭示了战争的普遍规律，被誉为兵学圣典。...",
    category: "古典文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bd008bfe1434",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1xDv_2TQODwQu9Vh6eRHKCw?pwd=snoe",
        code: "snoe"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "春秋"
  },
  {
    id: 205,
    title: "万物有灵且美",
    author: "[英] 吉米·哈利",
    authorDetail: "[英] 吉米·哈利，著名作家",
    year: "1970",
    cover: "https://img.aqifei.top/img/2026/02/20260212133911412",
    description: "《万物有灵且美》是英国兽医吉米·哈利的自传体小说，讲述了他在约克郡乡间从事兽医工作的温馨故事。作者以幽默风趣的笔触描绘了乡村生活的美好，展现了人与动物之间的深厚情感。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/9494b51c66b1",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/12Ptb2h2wnYe_v8X1iTz_ZA?pwd=z8yv",
        code: "z8yv"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1970"
  },
  {
    id: 206,
    title: "雨季不再来",
    author: "三毛",
    authorDetail: "三毛，著名作家",
    year: "1976",
    cover: "https://img.aqifei.top/img/2026/01/214_雨季不再来",
    description: "《雨季不再来》是三毛的早期作品，记录了她在少女时期的成长经历和心路历程。书中充满了对青春、爱情、理想的追求，展现了一个敏感少女逐渐成长的过程。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e7239854aae0",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Tmu4aWIA9lwituZoe4bgvA?pwd=g6ha",
        code: "g6ha"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1976"
  },
  {
    id: 207,
    title: "最好的我们",
    author: "八月长安",
    authorDetail: "八月长安，著名作家",
    year: "2013",
    cover: "https://img.aqifei.top/img/2026/02/20260212133840789",
    description: "《最好的我们》是八月长安振华系列小说之一，讲述了普通学生耿耿和学霸余淮从高中到大学的成长故事。小说以细腻的笔触描绘了青春校园生活的酸甜苦辣，以及青春期的懵懂情愫。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3645b03f75d8",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1_WEkv9wzHWWUN3mQMeC6Qg?pwd=atze",
        code: "atze"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2013"
  },
  {
    id: 208,
    title: "奥斯维辛",
    author: "[英] 劳伦斯·里斯",
    authorDetail: "[英] 劳伦斯·里斯，著名作家",
    year: "2015",
    cover: "https://img.aqifei.top/img/2026/01/216_奥斯维辛",
    description: "《奥斯维辛：一部历史》是英国历史学家劳伦斯·里斯基于多年研究和采访写成的历史著作。书中通过幸存者的证词和历史档案，详细记录了奥斯维辛集中营从建立到解放的全过程。...",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/d5524350b85f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1dqEoePXy8pvHNkb6V9exow?pwd=o10p",
        code: "o10p"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2015"
  },
  {
    id: 209,
    title: "现代艺术150年",
    author: "[英] 威尔·贡培兹",
    authorDetail: "[英] 威尔·贡培兹，著名作家",
    year: "2012",
    cover: "https://img.aqifei.top/img/2026/02/20260212133813587",
    description: "《现代艺术150年》是英国艺术评论家威尔·贡培兹写给普通读者的现代艺术入门书。作者以生动幽默的语言梳理了从印象派到当代艺术的发展历程，解读了各流派的艺术特点和代表作品。...",
    category: "艺术设计",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/bc0ee85d47d2",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1gkR_P2xeY5uTtKPSvXHyqA?pwd=nh6y",
        code: "nh6y"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2012"
  },
  {
    id: 210,
    title: "康熙的红票",
    author: "孙立天",
    authorDetail: "孙立天，著名作家",
    year: "2024",
    cover: "https://img.aqifei.top/img/2026/01/218_康熙的红票",
    description: "《康熙的红票：全球化中的清朝》是一部讲述清朝康熙时期中西文化交流的历史著作。书中以康熙皇帝的红票为切入点，展现了17-18世纪中国与西方在宗教、科学、文化等领域的交流与碰撞。...",
    category: "历史人文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/e4aa4775eaa2",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ehE6Vu3inxc31jnCIG_5lQ?pwd=vsdb",
        code: "vsdb"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2024"
  },
  {
    id: 211,
    title: "不存在的骑士",
    author: "[意] 伊塔洛·卡尔维诺",
    authorDetail: "[意] 伊塔洛·卡尔维诺，著名作家",
    year: "1959",
    cover: "https://img.aqifei.top/img/2026/01/219_不存在的骑士",
    description: "《不存在的骑士》是卡尔维诺我们的祖先三部曲之一。故事讲述了一个只有意识没有肉体的骑士阿季卢尔福，他凭借坚强的意志和严格的骑士精神，在一个充满混乱和荒诞的世界中寻找自我存在的意义。...",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/f7dad862b1b5",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YuijZtGnWV3dILoPBOUTmw?pwd=xysb",
        code: "xysb"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1959"
  },
  {
    id: 212,
    title: "庄子",
    author: "[战国] 庄周",
    authorDetail: "[战国] 庄周，著名作家",
    year: "战国",
    cover: "https://img.aqifei.top/img/2026/02/20260212133738478",
    description: "《庄子》是道家经典著作，由庄子及其后学所著。全书以寓言故事的形式阐述了道家的哲学思想，主张顺应自然、逍遥无为，对中国古代哲学和文学产生了深远影响。...",
    category: "哲学思想",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fd1c2f869381",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1rW_Mjq1vccD5REB1LJw3-A?pwd=9n3j",
        code: "9n3j"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "战国"
  },
  {
    id: 213,
    title: "送你一颗子弹",
    author: "刘瑜",
    authorDetail: "刘瑜，著名作家",
    year: "2010",
    cover: "https://img.aqifei.top/img/2026/01/221_送你一颗子弹",
    description: "《送你一颗子弹》是刘瑜的随笔集，收录了她在留学期间写下的生活感悟和社会观察。作者以犀利的笔触和独特的视角，探讨了民主、自由、爱情等话题，展现了新一代知识分子的思考。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3a2d52fa687b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1EIUcinYXKlEttkm_AIuecQ?pwd=oyho",
        code: "oyho"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2010"
  },
  {
    id: 214,
    title: "论语",
    author: "[春秋] 孔子弟子",
    authorDetail: "[春秋] 孔子弟子，著名作家",
    year: "春秋",
    cover: "https://img.aqifei.top/img/2026/02/20260212133706008",
    description: "《论语》是儒家经典著作，记录了孔子及其弟子的言行。全书以语录体形式阐述了儒家的政治主张、伦理思想、道德观念和教育原则，对中国文化产生了深远影响。...",
    category: "哲学思想",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/81b8181a0e35",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/14EmXUXuzEce4WMZLvvE5nQ?pwd=01pg",
        code: "01pg"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "春秋"
  },
  {
    id: 215,
    title: "坟",
    author: "鲁迅",
    authorDetail: "鲁迅，著名作家",
    year: "1927",
    cover: "https://img.aqifei.top/img/2026/01/223_坟",
    description: "《坟》是鲁迅的杂文集，收录了他1907年至1925年间创作的23篇杂文。这些文章涉及文化、历史、社会等多个领域，体现了鲁迅深刻的思想性和战斗性，是中国现代杂文的开山之作。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/8fc11f4ce910",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ThOvjOx29qBXxWRD5KsWfw?pwd=8glq",
        code: "8glq"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1927"
  },
  {
    id: 216,
    title: "孩子你慢慢来",
    author: "龙应台",
    authorDetail: "龙应台，著名作家",
    year: "1994",
    cover: "https://img.aqifei.top/img/2026/02/20260212133619493",
    description: "《孩子你慢慢来》是龙应台的散文集，记录了她作为母亲的育儿经历和感悟。作者以温柔的笔触描绘了与孩子相处的点滴，探讨了教育、成长和亲子关系等话题，充满了母爱和智慧。...",
    category: "亲子教育",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/df0ab3dad48b",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1Cc9iKWsmh82xTzu8oEOnUg?pwd=1ynf",
        code: "1ynf"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1994"
  },
  {
    id: 217,
    title: "罗生门",
    author: "[日] 芥川龙之介",
    authorDetail: "[日] 芥川龙之介，著名作家",
    year: "1915",
    cover: "https://img.aqifei.top/img/2026/01/225_罗生门",
    description: "《罗生门》是芥川龙之介的短篇小说集，收录了他的代表作《罗生门》《竹林中》《鼻子》等。作品以简洁冷峻的笔触描绘了人性的复杂和矛盾，展现了作者深刻的心理洞察力。...",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1ad5d43e3de0",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1vXxafp4XsRkhICJLf1pmLg?pwd=xj5g",
        code: "xj5g"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1915"
  },
  {
    id: 218,
    title: "会饮篇",
    author: "[古希腊] 柏拉图",
    authorDetail: "[古希腊] 柏拉图，著名作家",
    year: "公元前",
    cover: "https://img.aqifei.top/img/2026/01/226_会饮篇",
    description: "《会饮篇》是柏拉图的经典对话录，记录了苏格拉底等人在一次宴会上关于爱的讨论。全书通过层层递进的对话，探讨了爱的本质和意义，是西方哲学史上关于爱的最重要的文本之一。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/050e00e0c7af",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1vojGfHEdNMGUxczlovBxpg?pwd=380k",
        code: "380k"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "公元前"
  },
  {
    id: 219,
    title: "黑箱：日本之耻",
    author: "[日] 伊藤诗织",
    authorDetail: "[日] 伊藤诗织，著名作家",
    year: "2017",
    cover: "https://img.aqifei.top/img/2026/02/20260212133153130",
    description: "《黑箱：日本之耻》是日本记者伊藤诗织的自传体纪实作品，记录了她遭受性侵后寻求正义的艰难历程。书中揭露了日本司法系统和社会对性侵受害者的偏见，引发了广泛的社会讨论。...",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1cf1b9efb618",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1U8BxxTdNkttkUwvowSQDlg?pwd=3qce",
        code: "3qce"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2017"
  },
  {
    id: 220,
    title: "九州缥缈录",
    author: "江南",
    authorDetail: "江南，著名作家",
    year: "2005",
    cover: "https://img.aqifei.top/img/2026/01/228_九州·缥缈录",
    description: "《九州缥缈录》是江南创作的奇幻小说，以虚构的九州世界为背景，讲述了少年吕归尘、姬野等人的成长故事。小说融合了东方奇幻和史诗叙事，构建了一个宏大的世界观。...",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/201bdbb8ef71",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1QoR4ZRG__iw5S-0kWnE7IA?pwd=tkk7",
        code: "tkk7"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2005"
  },
  {
    id: 221,
    title: "浮生六记",
    author: "[清] 沈复",
    authorDetail: "[清] 沈复，著名作家",
    year: "清代",
    cover: "https://img.aqifei.top/img/2026/02/20260212133532197",
    description: "《浮生六记》是清代文人沈复的自传体散文，记录了作者与妻子芸娘的生活点滴。全书以朴实细腻的笔触描绘了夫妻间的深厚感情和日常生活的美好，被誉为中国古典文学中最动人的爱情篇章。...",
    category: "古典文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/980d877f7647",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/16b4OIN28AoZCiq7lbCufIQ?pwd=eo44",
        code: "eo44"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "清代"
  },
  {
    id: 222,
    title: "显微镜下的大明",
    author: "马伯庸",
    authorDetail: "马伯庸，著名作家",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/01/230_显微镜下的大明",
    description: "《显微镜下的大明》是马伯庸的历史纪实作品，通过六个明代基层政治事件，展现了明朝的政治制度、经济生活和社会百态。作者以显微镜般的细致观察，揭示了历史表象背后的深层逻辑。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/9e438e46c9a3",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1vSr7VARBBfQMwGSuT2K_wg?pwd=ar2c",
        code: "ar2c"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2019"
  },
  {
    id: 223,
    title: "金锁记",
    author: "张爱玲",
    authorDetail: "张爱玲，著名作家",
    year: "1943",
    cover: "https://img.aqifei.top/img/2026/02/20260212133442404",
    description: "《金锁记》是张爱玲的短篇小说代表作，讲述了曹七巧在金钱和欲望的枷锁下走向毁灭的故事。小说以精湛的笔触描绘了人性的扭曲和悲剧，被誉为中国现代文学史上最优秀的中篇小说之一。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/51bc7c0e209c",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1TLpiZibeW9fy5WjmskHZCg?pwd=rq6n",
        code: "rq6n"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1943"
  },
  {
    id: 224,
    title: "象棋的故事",
    author: "[奥] 斯蒂芬·茨威格",
    authorDetail: "[奥] 斯蒂芬·茨威格，著名作家",
    year: "1941",
    cover: "https://img.aqifei.top/img/2026/01/232_象棋的故事",
    description: "《象棋的故事》是茨威格的短篇小说代表作，讲述了一位业余棋手在轮船上击败世界冠军的故事。小说通过象棋这一载体，探讨了孤独、天才和人性等深刻主题。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/805562eb991a",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YCVk35ZkLXic8Bgqbd-0hg?pwd=9wbz",
        code: "9wbz"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1941"
  },
  {
    id: 225,
    title: "渴望生活",
    author: "[美] 欧文·斯通",
    authorDetail: "[美] 欧文·斯通，著名作家",
    year: "1934",
    cover: "https://img.aqifei.top/img/2026/01/233_渴望生活",
    description: "《渴望生活：梵高传》是美国作家欧文·斯通为梵高撰写的传记。作者以优美的文笔和翔实的资料，描绘了梵高充满激情和痛苦的艺术人生，展现了这位伟大画家对艺术的执着追求。...",
    category: "生活美学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1943963b877f",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1pdJpBPxyVOd17MopM70rCA?pwd=3io8",
        code: "3io8"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1934"
  },
  {
    id: 226,
    title: "变形记",
    author: "[奥] 卡夫卡",
    authorDetail: "[奥] 卡夫卡，著名作家",
    year: "1915",
    cover: "https://img.aqifei.top/img/2026/01/234_变形记",
    description: "《变形记》是卡夫卡的短篇小说代表作，讲述了推销员格里高尔一觉醒来变成甲虫的荒诞故事。小说以象征主义手法揭示了现代社会中人的异化和孤独，是现代主义文学的经典之作。...",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/727473eb942e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1_MXtmRr07vzgmHFbNPUipw?pwd=n2tp",
        code: "n2tp"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1915"
  },
  {
    id: 227,
    title: "二手时间",
    author: "[白俄] S.A.阿列克谢耶维奇",
    authorDetail: "[白俄] S.A.阿列克谢耶维奇，著名作家",
    year: "2013",
    cover: "https://img.aqifei.top/img/2026/02/20260212133417744",
    description: "《二手时间》是白俄罗斯作家阿列克谢耶维奇的纪实文学作品，通过采访苏联解体后普通人的故事，记录了那个时代的社会变迁和人们的精神困境。该书获得2015年诺贝尔文学奖。...",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/1899443b2359",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1EvW6NYngzi_vDTE8HjX9Yg?pwd=r6jn",
        code: "r6jn"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2013"
  },
  {
    id: 228,
    title: "白痴",
    author: "[俄] 陀思妥耶夫斯基",
    authorDetail: "[俄] 陀思妥耶夫斯基，著名作家",
    year: "1869",
    cover: "https://img.aqifei.top/img/2026/01/236_白痴",
    description: "《白痴》是陀思妥耶夫斯基的长篇小说，讲述了善良纯洁的梅什金公爵在复杂社会中遭遇的种种困境。小说通过主人公的悲剧命运，探讨了善良、信仰和人性的深刻主题。...",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/3142826cfefe",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1C_tH75NVTV8FPxnrJKJ0fg?pwd=z5t9",
        code: "z5t9"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1869"
  },
  {
    id: 229,
    title: "分成两半的子爵",
    author: "[意] 伊塔洛·卡尔维诺",
    authorDetail: "[意] 伊塔洛·卡尔维诺，著名作家",
    year: "1952",
    cover: "https://img.aqifei.top/img/2026/01/238_分成两半的子爵",
    description: "《分成两半的子爵》是卡尔维诺我们的祖先三部曲之一。故事讲述了子爵梅达尔多在战争中被劈成两半后，善良的一半和邪恶的一半分别回到故乡所引发的一系列荒诞事件。...",
    category: "外国文学",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b0819799562d",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1ma7IxZJo4hSLgEF3pKRVwg?pwd=sl3a",
        code: "sl3a"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1952"
  },
  {
    id: 230,
    title: "你一生的故事",
    author: "[美] 特德·姜",
    authorDetail: "[美] 特德·姜，著名作家",
    year: "1998",
    cover: "https://img.aqifei.top/img/2026/02/20260212133335716",
    description: "《你一生的故事》是特德·姜的科幻短篇小说集，收录了他的代表作《你一生的故事》等。作品以独特的视角探讨了语言、时间、自由意志等哲学命题，展现了作者非凡的想象力和思辨能力。...",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ac19b8e56e35",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1T1fJeFBW5dp1T__Y3zprQQ?pwd=8qii",
        code: "8qii"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1998"
  },
  {
    id: 231,
    title: "野火集",
    author: "龙应台",
    authorDetail: "龙应台，著名作家",
    year: "1984",
    cover: "https://img.aqifei.top/img/2026/01/240_野火集",
    description: "《野火集》是龙应台的杂文集，收录了她在台湾《中国时报》发表的专栏文章。作者以犀利的笔触批判了台湾社会的种种弊病，引发了广泛的社会反响，被誉为台湾民主化进程中的重要文本。...",
    category: "诗歌散文",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/999a5e4c5156",
        code: "无"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1984"
  },
  {
    id: 232,
    title: "规训与惩罚",
    author: "[法] 米歇尔·福柯",
    authorDetail: "[法] 米歇尔·福柯，著名作家",
    year: "1975",
    cover: "https://img.aqifei.top/img/2026/01/241_规训与惩罚",
    description: "《规训与惩罚》是福柯的代表作之一，探讨了现代监狱制度的诞生和权力机制的运作。作者以独特的视角分析了从公开处决到现代刑罚制度的转变，揭示了权力与知识的复杂关系。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0916b612c088",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1DoO1nAjW0l40X0f8vSxawA?pwd=lnb8",
        code: "lnb8"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1975"
  },
  {
    id: 233,
    title: "哈姆莱特",
    author: "[英] 莎士比亚",
    authorDetail: "[英] 莎士比亚，著名作家",
    year: "1603",
    cover: "https://img.aqifei.top/img/2026/01/242_哈姆莱特",
    description: "《哈姆莱特》是莎士比亚的四大悲剧之一，讲述了丹麦王子哈姆莱特为父报仇的故事。剧作以深刻的心理描写和精妙的戏剧结构，探讨了复仇、道德、存在等永恒主题，是世界戏剧史上的巅峰之作。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/b7c901afc90e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1YgJgFPH_mfzwmjkYgrISWg?pwd=n2xs",
        code: "n2xs"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1603"
  },
  {
    id: 234,
    title: "成为波伏瓦",
    author: "[英] 凯特·柯克帕特里克",
    authorDetail: "[英] 凯特·柯克帕特里克，著名作家",
    year: "2019",
    cover: "https://img.aqifei.top/img/2026/01/243_成为波伏瓦",
    description: "《成为波伏瓦》是英国作家凯特·柯克帕特里克为波伏瓦撰写的传记。作者以翔实的资料和细腻的笔触，还原了这位法国存在主义女作家复杂而精彩的一生。...",
    category: "社会文化",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/083b6a5c6c2e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1zwGvUaMvx5C7zk4RvFILSA?pwd=75dg",
        code: "75dg"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2019"
  },
  {
    id: 235,
    title: "你好旧时光",
    author: "八月长安",
    authorDetail: "八月长安，著名作家",
    year: "2012",
    cover: "https://img.aqifei.top/img/2026/01/244_你好，旧时光（上 下）",
    description: "《你好，旧时光》是八月长安振华系列小说之一，讲述了女孩余周周从幼儿园到高中的成长故事。小说以温暖的笔触描绘了青春校园生活的美好与忧伤，以及成长过程中的困惑与坚强。...",
    category: "当代小说",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/0b6f1e46ad44",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1KvqBsjCjKKsJo-7zrtV2ig?pwd=hap5",
        code: "hap5"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2012"
  },
  {
    id: 236,
    title: "银河系漫游指南",
    author: "[英] 道格拉斯·亚当斯",
    authorDetail: "[英] 道格拉斯·亚当斯，著名作家",
    year: "1979",
    cover: "https://img.aqifei.top/img/2026/01/245_银河系漫游指南",
    description: "《银河系漫游指南》是英国作家道格拉斯·亚当斯的科幻喜剧小说，讲述了地球人阿瑟·登特在地球被毁灭后，跟随外星人朋友福特在银河系中漫游的荒诞冒险故事。...",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/ddd119025cc6",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1BQzzPuyCPtnvO3_6-_fknw?pwd=zaz7",
        code: "zaz7"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "1979"
  },
  {
    id: 237,
    title: "时间的秩序",
    author: "[意] 卡洛·罗韦利",
    authorDetail: "[意] 卡洛·罗韦利，著名作家",
    year: "2018",
    cover: "https://img.aqifei.top/img/2026/01/246_时间的秩序",
    description: "《时间的秩序》是意大利物理学家卡洛·罗韦利的科普著作，以诗意的语言探讨了时间的本质。作者从物理学和哲学的角度，揭示了时间并非我们想象的那样简单，而是一个非常复杂和微妙的概念。...",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/fada16eb8b77",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/1X0wJawXtY6JsvR_jCEuXzw?pwd=8lja",
        code: "8lja"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2018"
  },
  {
    id: 238,
    title: "火星救援",
    author: "[美] 安迪·威尔",
    authorDetail: "[美] 安迪·威尔，著名作家",
    year: "2011",
    cover: "https://img.aqifei.top/img/2026/01/247_火星救援",
    description: "《火星救援》是美国作家安迪·威尔的科幻小说，讲述了宇航员马克·沃特尼在火星上被队友误认为死亡而留下，独自在火星上求生并最终获救的故事。小说以严谨的科学细节和幽默的叙述风格著称。...",
    category: "科幻奇幻",
    downloadLinks: [
      {
        name: "夸克网盘",
        url: "https://pan.quark.cn/s/cef924994c6e",
        code: "无"
      },
      {
        name: "百度网盘",
        url: "https://pan.baidu.com/s/15O2JbWt3gKIvfO2EmPb4IA?pwd=ql5c",
        code: "ql5c"
      }
    ],
    size: "未知",
    format: "EPUB",
    publishYear: "2011"
  },
  {
    "id": 239,
    "title": "贾想",
    "author": "贾樟柯",
    "authorDetail": "贾樟柯,中国第六代导演代表人物,曾获威尼斯电影节金狮奖",
    "year": "2009",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101848542",
    "description": "《贾想》是著名电影导演贾樟柯的电影手记，全景记录了他多年的思考和活动踪迹，展现了他在电影艺术上的探索、对社会现状的深刻思考以及他以电影抒写乡愁的情怀。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/afae7e5f347d"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1vNrGCemE4wOWl9toeZoaGA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2009"
  },
  {
    "id": 240,
    "title": "打开一颗心",
    "author": "[英] 斯蒂芬·韦斯塔比",
    "authorDetail": "斯蒂芬·韦斯塔比,享誉国际的心脏手术专家,牛津约翰·拉德克利夫医院心外科主任",
    "year": "2017",
    "cover": "https://img.aqifei.top/img/2026/01/249_打开一颗心",
    "description": "心脏外科医生斯蒂芬·韦斯塔比亲述40年职业生涯中的惊险案例。书中不仅记录了20多个惊心动魄的手术，也剖析了作者对医疗伦理、医学教育的反思，以及对生命、悲伤与爱的观察。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/c9589de0700b"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1dIzsoKR2WXuVxAa7Kt_bCA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2017"
  },
  {
    "id": 241,
    "title": "解忧杂货店",
    "author": "[日] 东野圭吾",
    "authorDetail": "东野圭吾,日本著名推理小说家",
    "year": "2012",
    "cover": "https://img.aqifei.top/img/2026/01/250_解忧杂货店",
    "description": "现代人的奇迹治愈故事。僻静街道上的杂货店，只要投进烦恼咨询信，第二天就会在店后的牛奶箱里得到回信。五个跨越时空的故事，温暖地联系在了一起。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/1a9f4b2a50fb"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1V3IRP_Qvv9xUT0tYHLfoOA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2012"
  },
  {
    "id": 242,
    "title": "1984",
    "author": "[英] 乔治·奥威尔",
    "authorDetail": "乔治·奥威尔,英国著名作家、社会评论员",
    "year": "1949",
    "cover": "https://img.aqifei.top/img/2026/01/004_1984",
    "description": "反乌托邦文学代名词。描绘了一个名为奥逊的大洋国，统治者大洋国党利用监视机器人、思想警察、新语等手段彻底控制民众思想与生活的极权社会景象。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/95e196a17deb"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1fgxDVoV0q-sk9wpxhs37yw",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "1949"
  },
  {
    "id": 243,
    "title": "停止内耗的人生：四象限学习精进计划",
    "author": "[日] 龙樱团队",
    "authorDetail": "龙樱团队,日本著名教育辅导团队",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101819206",
    "description": "借助“喜欢/不喜欢”和“擅长/不擅长”组成的自我分析四象限工具，帮助读者明确自身强项和弱项，找到适合自己的学习策略，通过科学的大脑训练术实现高效成长。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/42f104b22f88"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1Vq2QMVPvpHAuLlsaf4BdsQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 244,
    "title": "三分钟趣读中国史从战国到西汉",
    "author": "三分钟实验室",
    "authorDetail": "三分钟实验室,趣味历史自媒体",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101801366",
    "description": "用轻快幽默的笔调和现代感的语言，三分钟带你穿梭战国至西汉。通过爆笑梗点解析历史大事件，让枯燥的史记变得生动有趣。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/79da0e3c5608"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1cwl2JItMKM5-EkNIAdAddA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 245,
    "title": "燕东园左邻右舍",
    "author": "徐泓",
    "authorDetail": "徐泓,北京大学新闻与传播学院教授,职业记者",
    "year": "2023",
    "cover": "https://img.aqifei.top/img/2026/01/fix_燕东园左邻右舍",
    "description": "以燕京大学燕东园22栋小楼为载体，通过访谈与史料搜集，记录了1926年至1966年间中国近现代知识分子的集体命运，缅怀并致敬那一代爱国学人的精神世界。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/3bff78531856"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1bEPwXVDVtVNbj23Cn-VDcg",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2023"
  },
  {
    "id": 246,
    "title": "重构契丹早期史",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101725175",
    "description": "重构契丹早期史",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/78042c921a6b"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1ZDPyci5ItkWbELTA1DAJvQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 247,
    "title": "深山欲雪",
    "author": "傅菲",
    "authorDetail": "傅菲,当代散文家,“新山地美学”代表作家",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_深山欲雪",
    "description": "傅菲在大茅山驻扎三年后的创作成果。他以文字描绘山涧、鱼鸟和山民的命运，融合博物学观察与东方哲学思考，展现了人与自然和谐共处的美学，唤醒被城市麻痹的感官。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/88c2b29887b5"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1ZKDrUeaeD0CdG2YeEqt9BQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 248,
    "title": "两魏周齐战争中的河东",
    "author": "宋杰",
    "authorDetail": "宋杰,历史军事地理专家",
    "year": "2023",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101636250",
    "description": "全景展示了北朝后期东西魏与周齐在河东地区的军事对抗，探讨了地理枢纽对统一战争进程的关键影响。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/e8ea2af3e733"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1rezXltYCfx4uSMCoyKJmyQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2023"
  },
  {
    "id": 249,
    "title": "江户时代江户城",
    "author": "[日] 矶田道史",
    "authorDetail": "矶田道史,日本历史学家,史学博士",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101603639",
    "description": "涵盖江户时代有趣的人物、生活和文化故事。为读者呈现教科书中心鲜见的历史细节，展现了江户城下町的繁荣与社会百态。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/fc6763b32d02"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1fDunhjzR5BPug7QMAbOoBA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 250,
    "title": "蛋镇诗社",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101513221",
    "description": "蛋镇诗社",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/326adf2da1e9"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1ZW4oGA3Go8-aPgu0vt01qQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 251,
    "title": "黛莱丝的一生",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_黛莱丝的一生",
    "description": "黛莱丝的一生",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/54bcbe2924d4"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1-t29v7KmxGIctpOfUyZduw",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 252,
    "title": "大地三部曲",
    "author": "[美] 赛珍珠",
    "authorDetail": "赛珍珠,诺贝尔文学奖及普利策奖得主",
    "year": "1931",
    "cover": "https://img.aqifei.top/img/2026/01/fix_大地三部曲",
    "description": "诺贝尔文学奖获奖作品，包含《大地》、《儿子们》和《分家》。以广阔的视角展现了中国农民王龙及其后代在清末民初社会动荡中的生存现状与家族兴衰。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/6a412810092e"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1-W0oyeDj3fxSLkaM18sPzg",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "1931"
  },
  {
    "id": 253,
    "title": "中国甲胄史",
    "author": "付勇",
    "authorDetail": "付勇,中国传统工艺研究者,甲胄复原专家",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_中国甲胄史（全二册）",
    "description": "系统梳理中国历代甲胄的演变历程。从先秦石甲到明清铁甲，结合实物考证与文献资料，展现了中国古代军事装备的独特工艺与历史价值。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/d17254535423"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1L6jx2fUgHTERf_A08pR_Kw",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 254,
    "title": "交子：世界金融史的中国贡献",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101417526",
    "description": "交子：世界金融史的中国贡献",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/15ae9aa97b87"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1V-lpZfe-bOVBzLhvIhv50Q",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 255,
    "title": "名士自风流：中国古代隐士传",
    "author": "李靖岩",
    "authorDetail": "李靖岩,文史作家,自媒体作者",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_名士自风流：中国古代隐士传",
    "description": "讲述从先秦到晚明时期的隐士故事。涵盖伯夷、叔齐到顾炎武等人物，描绘了魏晋风度与盛唐气象中的隐士形象，关注时代洪流下个体命运的沉浮。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/0f354461fd6f"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1JHKnlle7NUna5twKgWnq6Q",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 256,
    "title": "露西娅逃离的29个春天",
    "author": "[意] 玛丽亚·格拉齐亚·卡兰德罗内",
    "authorDetail": "玛丽亚·格拉齐亚·卡兰德罗内,意大利诗人、作家、社会活动家",
    "year": "2023",
    "cover": "https://img.aqifei.top/img/2026/01/fix_露西娅逃离的29个春天",
    "description": "轰动意大利的纪实作品。作者以侦探视角重构母亲在父权与法律偏见下度过的29年人生，探讨20世纪中叶意大利女性的结构性困境，向追求自由的女性致敬。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/677b4d81a9f0"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1RrAzG_pEVv4R-cN3XrOC4w",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2023"
  },
  {
    "id": 257,
    "title": "三国史 – 马植杰",
    "author": "马植杰",
    "authorDetail": "马植杰,著名秦汉魏晋史专家",
    "year": "1983",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101328728",
    "description": "由秦汉魏晋史专家马植杰撰写，系统叙述三国时期的政治、经济、文化及军事斗争，是研究三国历史的重要参考著作。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/c3be3141bfca"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1iHh58BwimgBkiddESxrQVw",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "1983"
  },
  {
    "id": 258,
    "title": "信仰",
    "author": "[日] 村田沙耶香",
    "authorDetail": "村田沙耶香,日本当代著名作家",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_信仰 – [日] 村田沙耶香",
    "description": "通过荒诞而尖锐的叙述，挑战现代社会的消费主义与文化传统。书中探讨了“信”的本质，展现了那些在边缘地带寻求真理的偏执狂们的生活景观。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/4c302fa15e25"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1ego7vVnyQXlJotIHbfpCdQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 259,
    "title": "胎记",
    "author": "苏南",
    "authorDetail": "苏南,当代女性作家",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_胎记 – 苏南",
    "description": "关于成长的隐秘疼痛与家庭的回响。苏南通过细腻的笔触，讲述了那些印刻在生命中的“胎记”，如何通过爱与时间最终达成自我和解。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/94ac8f1c28b7"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1HNOUFt6v0SO3YOWZSwx2aA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 260,
    "title": "告白",
    "author": "[日] 凑佳苗",
    "authorDetail": "凑佳苗,日本推理作家,获书店大奖首奖",
    "year": "2008",
    "cover": "https://img.aqifei.top/img/2026/01/fix_告白 – [日] 凑佳苗",
    "description": "独具匠心的“告白体”推理。一名女教师在校园内通过告白的方式，一步步揭开女儿被杀的真相并实施报复，深刻反思了青少年心理及家庭教育。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/494835b0d0a5"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1C5RvINrZ1w481uWLvktNJg",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2008"
  },
  {
    "id": 261,
    "title": "敌友难辨：冷战谍海逸史",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101303877",
    "description": "敌友难辨：冷战谍海逸史",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/99490f39bf72"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/18wXvqsC87oQh9NMSP5HzGw",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 262,
    "title": "别让微压力消耗你",
    "author": "（美）罗伯·克罗斯",
    "authorDetail": "罗伯·克罗斯,领导力及组织行为专家",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_别让微压力消耗你",
    "description": "揭示了那些不经意的“微压力”如何侵蚀我们的工作和生活。书中提供了通过建立社交韧性、优化关系网络来应对微压力并夺回生活主动权的科学方案。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/05ac2cdc71f8"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1W_8ddasZRkxRmB3MyjdIbg",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 263,
    "title": "聪明人说话前在想什么？",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_聪明人说话前在想什么？",
    "description": "聪明人说话前在想什么？",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/b57e2f2ac009"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1v_qcCMNCLwg7TS149QCzAQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 264,
    "title": "愚蠢的核弹：古巴导弹危机新史",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_愚蠢的核弹：古巴导弹危机新史",
    "description": "愚蠢的核弹：古巴导弹危机新史",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/b9564c344cd1"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/19CT0Y3du_idW6LZNG0-Anw",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 265,
    "title": "音乐与人类",
    "author": "[美] 迈克尔·斯皮策",
    "authorDetail": "迈克尔·斯皮策,利物浦大学音乐系教授",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_音乐与人类",
    "description": "横跨400万年的音乐史诗。探讨音乐如何塑造了人类的大脑、文明与社会。从猿猴的鸣叫到数字时代的流媒体，带你理解人类为何离不开旋律。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/126c66697f8c"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1kX_3qK47MH__uw5LpzOZEA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 266,
    "title": "三国战争与地要天时",
    "author": "宋杰",
    "authorDetail": "宋杰,军事地理专家",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101147642",
    "description": "从地理视角重构三国战局。深入解析为什么汉中、荆州、合肥是必争之地，以及“天时”是如何在关键战役中左右胜负的。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/65b7ea739321"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1EvIqE5Yg-EVa2OBQncP7EQ",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 267,
    "title": "造物须臾",
    "author": "牛健哲",
    "authorDetail": "牛健哲,当代作家,获郁达夫小说奖",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/01/fix_造物须臾",
    "description": "收录10篇短篇故事，主题围绕探索可能性、生活的荒诞性及人类精神世界展开。作者以反讽特质和技术流叙事，构建出充满隐喻与象征的文学世界。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/8d7406a20258"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1uavtizX5itBYtX9VtnSpDg",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  },
  {
    "id": 268,
    "title": "午后进入我房间",
    "author": "温凯尔",
    "authorDetail": "温凯尔,90后作家",
    "year": "2025",
    "cover": "https://img.aqifei.top/img/2026/01/fix_午后进入我房间",
    "description": "以当代人情感困境为主题的短篇小说集。通过八篇作品探讨奇情与欲望，展现90后的情感模式与孤独的内核，在斑驳的细节中笼罩着特有的官能性。",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/4b19b4b40e20"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/19c9tgGi7IwaILVgUmFPQJg",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2025"
  },
  {
    "id": 269,
    "title": "明熹宗传：木匠皇帝朱由校",
    "author": "未知",
    "authorDetail": "暂无详情",
    "year": "2024",
    "cover": "https://img.aqifei.top/img/2026/02/20260213101112115",
    "description": "明熹宗传：木匠皇帝朱由校",
    "category": "小说文学",
    "downloadLinks": [
      {
        "name": "夸克网盘",
        "url": "https://pan.quark.cn/s/b3292f861d59"
      },
      {
        "name": "百度网盘",
        "url": "https://pan.baidu.com/s/1dioVfHOpAqbtqjzPlnE8UA",
        "code": "0000"
      }
    ],
    "size": "未知",
    "format": "EPUB",
    "publishYear": "2024"
  }
];

export const categories = [
  "小说文学",
  "历史传记",
  "人文社科",
  "励志成功",
  "经济管理",
  "学习教育",
  "生活时尚",
  "英文原版"
];
