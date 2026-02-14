const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const APP_ID = process.env.FEISHU_APP_ID || '';
const APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const WIKI_TOKEN = process.env.FEISHU_WIKI_TOKEN || '';

// Validate required environment variables
if (!APP_ID || !APP_SECRET || !WIKI_TOKEN) {
    console.error('错误: 缺少必要的环境变量');
    console.error('请设置以下环境变量:');
    console.error('  - FEISHU_APP_ID');
    console.error('  - FEISHU_APP_SECRET');
    console.error('  - FEISHU_WIKI_TOKEN');
    console.error('\n可以在 .env 文件中配置这些变量');
    process.exit(1);
}

const MOCK_DATA_PATH = path.join(__dirname, '../data/mockData.ts');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

// Metadata dictionary for enrichment
const ENRICHED_DATA = {
    "贾想": {
        author: "贾樟柯",
        authorDetail: "贾樟柯,中国第六代导演代表人物,曾获威尼斯电影节金狮奖",
        year: "2009",
        description: "《贾想》是著名电影导演贾樟柯的电影手记，全景记录了他多年的思考和活动踪迹，展现了他在电影艺术上的探索、对社会现状的深刻思考以及他以电影抒写乡愁的情怀。"
    },
    "打开一颗心": {
        author: "[英] 斯蒂芬·韦斯塔比",
        authorDetail: "斯蒂芬·韦斯塔比,享誉国际的心脏手术专家,牛津约翰·拉德克利夫医院心外科主任",
        year: "2017",
        description: "心脏外科医生斯蒂芬·韦斯塔比亲述40年职业生涯中的惊险案例。书中不仅记录了20多个惊心动魄的手术，也剖析了作者对医疗伦理、医学教育的反思，以及对生命、悲伤与爱的观察。"
    },
    "停止内耗的人生：四象限学习精进计划": {
        author: "[日] 龙樱团队",
        authorDetail: "龙樱团队,日本著名教育辅导团队",
        year: "2024",
        description: "借助“喜欢/不喜欢”和“擅长/不擅长”组成的自我分析四象限工具，帮助读者明确自身强项和弱项，找到适合自己的学习策略，通过科学的大脑训练术实现高效成长。"
    },
    "燕东园左邻右舍": {
        author: "徐泓",
        authorDetail: "徐泓,北京大学新闻与传播学院教授,职业记者",
        year: "2023",
        description: "以燕京大学燕东园22栋小楼为载体，通过访谈与史料搜集，记录了1926年至1966年间中国近现代知识分子的集体命运，缅怀并致敬那一代爱国学人的精神世界。"
    },
    "深山欲雪": {
        author: "傅菲",
        authorDetail: "傅菲,当代散文家,“新山地美学”代表作家",
        year: "2024",
        description: "傅菲在大茅山驻扎三年后的创作成果。他以文字描绘山涧、鱼鸟和山民的命运，融合博物学观察与东方哲学思考，展现了人与自然和谐共处的美学，唤醒被城市麻痹的感官。"
    },
    "两魏周齐战争中的河东": {
        author: "宋杰",
        authorDetail: "宋杰,历史军事地理学者,首都师范大学教授",
        year: "2023",
        description: "深入呈现两魏周齐争霸中的“河东地理枢纽”。从经济、地形、交通等多方面考证河东政区沿革与战争历程，分析北周平齐之役的战略特点及胜利原因。"
    },
    "江户时代江户城": {
        author: "[日] 矶田道史",
        authorDetail: "矶田道史,日本历史学家,史学博士",
        year: "2024",
        description: "涵盖江户时代有趣的人物、生活和文化故事。为读者呈现教科书中心鲜见的历史细节，展现了江户城下町的繁荣与社会百态。"
    },
    "中国甲胄史": {
        author: "付勇",
        authorDetail: "付勇,中国传统工艺研究者,甲胄复原专家",
        year: "2024",
        description: "系统梳理中国历代甲胄的演变历程。从先秦石甲到明清铁甲，结合实物考证与文献资料，展现了中国古代军事装备的独特工艺与历史价值。"
    },
    "名士自风流：中国古代隐士传": {
        author: "李靖岩",
        authorDetail: "李靖岩,文史作家,自媒体作者",
        year: "2024",
        description: "讲述从先秦到晚明时期的隐士故事。涵盖伯夷、叔齐到顾炎武等人物，描绘了魏晋风度与盛唐气象中的隐士形象，关注时代洪流下个体命运的沉浮。"
    },
    "露西娅逃离的29个春天": {
        author: "[意] 玛丽亚·格拉齐亚·卡兰德罗内",
        authorDetail: "玛丽亚·格拉齐亚·卡兰德罗内,意大利诗人、作家、社会活动家",
        year: "2023",
        description: "轰动意大利的纪实作品。作者以侦探视角重构母亲在父权与法律偏见下度过的29年人生，探讨20世纪中叶意大利女性的结构性困境，向追求自由的女性致敬。"
    },
    "造物须臾": {
        author: "牛健哲",
        authorDetail: "牛健哲,当代作家,获郁达夫小说奖",
        year: "2024",
        description: "收录10篇短篇故事，主题围绕探索可能性、生活的荒诞性及人类精神世界展开。作者以反讽特质和技术流叙事，构建出充满隐喻与象征的文学世界。"
    },
    "午后进入我房间": {
        author: "温凯尔",
        authorDetail: "温凯尔,90后作家",
        year: "2025",
        description: "以当代人情感困境为主题的短篇小说集。通过八篇作品探讨奇情与欲望，展现90后的情感模式与孤独的内核，在斑驳的细节中笼罩着特有的官能性。"
    },
    "三国战争与地要天时": {
        author: "宋杰",
        authorDetail: "宋杰,著名历史军事地理学者,首都师范大学教授",
        year: "2024",
        description: "三国战争系列的第三部。深入探讨董卓与关东诸侯战事、曹操经营关中、刘备夺取益州以及“天时”因素对战争的影响，揭示了地理环境对三国鼎立局面的深远作用。"
    },
    "名士自风流": {
        refer: "名士自风流：中国古代隐士传"
    },
    "三国史 – 马植杰": {
        author: "马植杰",
        authorDetail: "马植杰,著名秦汉魏晋史专家",
        year: "1983",
        description: "由秦汉魏晋史专家马植杰撰写，系统叙述三国时期的政治、经济、文化及军事斗争，是研究三国历史的重要参考著作。"
    },
    "1984": {
        author: "[英] 乔治·奥威尔",
        authorDetail: "乔治·奥威尔,英国著名作家、社会评论员",
        year: "1949",
        description: "反乌托邦文学代名词。描绘了一个名为奥逊的大洋国，统治者大洋国党利用监视机器人、思想警察、新语等手段彻底控制民众思想与生活的极权社会景象。"
    },
    "解忧杂货店": {
        author: "[日] 东野圭吾",
        authorDetail: "东野圭吾,日本著名推理小说家",
        year: "2012",
        description: "现代人的奇迹治愈故事。僻静街道上的杂货店，只要投进烦恼咨询信，第二天就会在店后的牛奶箱里得到回信。五个跨越时空的故事，温暖地联系在了一起。"
    },
    "三分钟趣读中国史从战国到西汉": {
        author: "三分钟实验室",
        authorDetail: "三分钟实验室,趣味历史自媒体",
        year: "2024",
        description: "用轻快幽默的笔调和现代感的语言，三分钟带你穿梭战国至西汉。通过爆笑梗点解析历史大事件，让枯燥的史记变得生动有趣。"
    },
    "两魏周齐战争中的河东": {
        author: "宋杰",
        authorDetail: "宋杰,历史军事地理专家",
        year: "2023",
        description: "全景展示了北朝后期东西魏与周齐在河东地区的军事对抗，探讨了地理枢纽对统一战争进程的关键影响。"
    },
    "大地三部曲": {
        author: "[美] 赛珍珠",
        authorDetail: "赛珍珠,诺贝尔文学奖及普利策奖得主",
        year: "1931",
        description: "诺贝尔文学奖获奖作品，包含《大地》、《儿子们》和《分家》。以广阔的视角展现了中国农民王龙及其后代在清末民初社会动荡中的生存现状与家族兴衰。"
    },
    "大地": {
        refer: "大地三部曲"
    },
    "别让微压力消耗你": {
        author: "（美）罗伯·克罗斯",
        authorDetail: "罗伯·克罗斯,领导力及组织行为专家",
        year: "2024",
        description: "揭示了那些不经意的“微压力”如何侵蚀我们的工作和生活。书中提供了通过建立社交韧性、优化关系网络来应对微压力并夺回生活主动权的科学方案。"
    },
    "信仰": {
        author: "[日] 村田沙耶香",
        authorDetail: "村田沙耶香,芥川奖得主,代表作《人间便利店》",
        year: "2024",
        description: "村田沙耶香的中短篇集。探讨了所谓的“常识”在个体信仰面前的荒诞与无力，展现了作者对社会秩序与个体异态的深刻审视。"
    },
    "信仰 – [日] 村田沙耶香": {
        refer: "信仰"
    },
    "告白": {
        author: "[日] 凑佳苗",
        authorDetail: "凑佳苗,日本推理作家,获书店大奖首奖",
        year: "2008",
        description: "独具匠心的“告白体”推理。一名女教师在校园内通过告白的方式，一步步揭开女儿被杀的真相并实施报复，深刻反思了青少年心理及家庭教育。"
    },
    "告白 – [日] 凑佳苗": {
        refer: "告白"
    },
    "胎记": {
        author: "苏南",
        authorDetail: "苏南,当代女性作家",
        year: "2024",
        description: "关于成长的隐秘疼痛与家庭的回响。苏南通过细腻的笔触，讲述了那些印刻在生命中的“胎记”，如何通过爱与时间最终达成自我和解。"
    },
    "胎记 – 苏南": {
        refer: "胎记"
    },
    "三国战争与地要天时": {
        author: "宋杰",
        authorDetail: "宋杰,军事地理专家",
        year: "2024",
        description: "从地理视角重构三国战局。深入解析为什么汉中、荆州、合肥是必争之地，以及“天时”是如何在关键战役中左右胜负的。"
    },
    "安史之乱": {
        author: "张诗坪、胡可奇",
        authorDetail: "张诗坪，青年历史学者；胡可奇，资深历史编辑",
        year: "2025",
        description: "该书深度剖析安史之乱这一唐朝转折点，通过40幅战略示意图复盘决战全貌。作者不仅关注战役细节，更通过财政、粮食、后勤视角解构军政博弈，勘破历史大棋局中的对弈迷阵。"
    },
    "历史中的大与小": {
        author: "马伯庸",
        authorDetail: "马伯庸，作家，曾获人民文学奖、朱自清散文奖。代表作《长安十二时辰》《大医》等",
        year: "2025",
        description: "马伯庸过去十年的历史随笔集。书中既有陪孩子读古文的亲身经历，也有对古代牙疼史等趣味细节的总结。他以特有的幽默与洞察力，从微观切入宏大历史，展现历史的温度与趣味。"
    },
    "希腊别传": {
        author: "席佳琳",
        authorDetail: "席佳琳（Kathrin Hille），知名国际记者，长期关注东亚及全球政治局势",
        year: "2024",
        description: "通过非传统的视角重新审视希腊历史与文化，探讨了古典文明与现代身份之间的冲突与融合，是一部充满人文关怀的历史观察作品。"
    },
    "今日向长安": {
        author: "喻盈",
        authorDetail: "喻盈，文化学者，资深媒体人",
        year: "2024",
        description: "从“长安”这一文明符号出发，探讨了盛唐气象的形成与崩塌。书中通过对物质文化、日常生活和政治话语的细致解读，勾勒出一幅既瑰丽又真实的长安百态图。"
    },
    "弃长安": {
        author: "张明扬",
        authorDetail: "张明扬，著名历史作家，代表作《入关》《自毁》等",
        year: "2022",
        description: "聚焦于安史之乱中决定唐帝国命运的关键决策——弃守长安。作者深度挖掘人性冲突与政治博弈，展现了盛世转瞬即逝的悲剧色彩与历史的冷酷逻辑。"
    },
    "真事隐": {
        author: "董梅",
        authorDetail: "董梅，中央美术学院教授，资深古典文学学者",
        year: "2024",
        description: "借用《红楼梦》“真事隐”的概念，探讨中国古典文学与真实历史之间的隐秘关联。通过对经典文本的深入拆解，揭示了文学面纱下被掩盖的生存真相与文化密码。"
    },
    "乱世离歌": {
        author: "陈忠海",
        authorDetail: "陈忠海，历史作家，擅长金融史与社会史视角",
        year: "2024",
        description: "描写了动荡时代背景下的个人命运。作者将微观人物的离合与宏观历史的兴衰紧密结合，谱写了一曲关于生存、信仰与尊严的乱世长歌。"
    },
    "另一个悟空的西游记": {
        author: "刘勃",
        authorDetail: "刘勃，历史作家，文笔犀利幽默，代表作《失败者的春秋》等",
        year: "2025",
        description: "刘勃以其一贯的解构风格，重新审视《西游记》背后的社会结构与政治隐喻。他带我们看到一个在规则与反抗中挣扎的、更接近人性的“悟空”，是对经典的现代阐释。"
    },
    "历史是什么2.0": {
        author: "[英] 爱德华·卡尔 / 维达·梅塔",
        authorDetail: "E.H.卡尔（Edward Hallett Carr），20世纪最伟大的历史学家之一",
        year: "2024",
        description: "基于E.H.卡尔的经典史学理论，结合现代数字化与碎片化时代的背景，重申了“历史是现在与过去之间永无止境的对话”。本书探讨了在信息泛滥的今天，我们应如何建立正确的历史观。"
    },
    "南明史": {
        author: "顾诚",
        authorDetail: "顾诚，北京师范大学历史系教授，明清史专家",
        year: "1997",
        description: "中国近代史领域的“天花板”级别著作。顾诚先生以极其严谨的史料考证，推翻了许多传统成见。深入分析了南明政权内部的权力斗争，揭示了明末清初这段复杂历史的悲剧根源。"
    },
    "她们的西南联大岁月": {
        author: "王冬妮",
        authorDetail: "王冬妮，青年学者，致力于女性史与口述史研究",
        year: "2024",
        description: "聚焦西南联大中鲜被提起的女性群体。通过口述和日记资料，还原了在那段苦难却辉煌的岁月里，女学生与女教员们的求索、爱情与人生抉择，填补了校史中的女性视角。"
    },
    "说三分": {
        author: "马执杰",
        authorDetail: "马执杰，著名秦汉魏晋史专家，代表作《三国史》",
        year: "2024",
        description: "马执杰先生对三国历史的深入浅出之作。他摒弃演义虚构，以硬核史料为基础，剖析了魏蜀吴三方的外交、民生与名士风度，是三国迷不可错过的专业向导。"
    },
    "暗斗": {
        author: "唐博",
        authorDetail: "唐博，清华大学历史学博士，知名历史节目主讲人",
        year: "2024",
        description: "聚焦古代职场与官场的生存法则。作者选取了中国历史上最具代表性的政治博弈案例，分析权力的运作、人性的幽暗与生存的平衡术，读史即读心。"
    },
    "昂贵的和平": {
        author: "[美] 杰夫·科尔根",
        authorDetail: "杰夫·科尔根，布朗大学国际关系副教授",
        year: "2024",
        description: "从国际政治与能源安全视角，分析了现代大国博弈背后的“和平代价”。书中探讨了资源依赖如何左右战争决策，以及在全球秩序重构中，维系长期和平需要付出的惨重成本。"
    },
};

async function request(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    resolve({ error: 'Parse Error', raw: data });
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (postData) req.write(JSON.stringify(postData));
        req.end();
    });
}

async function getAccessToken() {
    const res = await request({
        hostname: 'open.feishu.cn',
        path: '/open-apis/auth/v3/tenant_access_token/internal',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }, { app_id: APP_ID, app_secret: APP_SECRET });
    return res.tenant_access_token;
}

async function resolveWikiToken(token, accessToken) {
    const wikiRes = await request({
        hostname: 'open.feishu.cn',
        path: `/open-apis/wiki/v2/spaces/get_node?token=${token}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return wikiRes.data.node.obj_token;
}

function extractText(cell) {
    if (!cell) return '';
    if (typeof cell === 'string') return cell;
    if (Array.isArray(cell)) return cell.map(extractText).join('');
    if (typeof cell === 'object') {
        if (cell.type === 'url' || cell.link) return cell.link || cell.text;
        if (cell.text) return cell.text;
    }
    return String(cell);
}

async function main() {
    try {
        const token = await getAccessToken();
        const spreadsheetToken = await resolveWikiToken(WIKI_TOKEN, token);

        const metaRes = await request({
            hostname: 'open.feishu.cn',
            path: `/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/query`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const sheetId = metaRes.data.sheets[0].sheet_id;

        const readRes = await request({
            hostname: 'open.feishu.cn',
            path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${sheetId}!A1:Z1000`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const values = readRes.data.valueRange.values;
        const header = values[0];
        const bookNameIdx = header.indexOf('书名');
        const quarkIdx = header.indexOf('夸克网盘');
        const baiduIdx = header.indexOf('百度网盘');
        const statusIdx = header.indexOf('状态');
        const coverIdx = header.indexOf('封面图');
        const categoryIdx = header.indexOf('分类');

        const unsynced = [];
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const name = extractText(row[bookNameIdx]);
            const quark = extractText(row[quarkIdx]);
            const baidu = extractText(row[baiduIdx]);
            const status = extractText(row[statusIdx]);

            if (name && (quark || baidu) && String(status) !== '1') {
                unsynced.push({
                    rowIndex: i + 1,
                    title: name.trim(),
                    quark: quark ? quark.trim() : null,
                    baidu: baidu ? baidu.trim() : null,
                    cover: row[coverIdx] ? extractText(row[coverIdx]).trim() : null,
                    sheetCategory: row[categoryIdx] ? extractText(row[categoryIdx]).trim() : '当代小说'
                });
            }
        }

        if (unsynced.length === 0) {
            console.log("No new books to sync.");
            return;
        }

        console.log(`Syncing ${unsynced.length} books...`);

        // Load current data
        let content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
        const lastIdMatch = content.match(/id:\s*(\d+)/g);
        let nextId = lastIdMatch ? Math.max(...lastIdMatch.map(m => parseInt(m.match(/\d+/)[0]))) + 1 : 239;

        const newEntries = [];
        const syncedIndices = [];

        for (const book of unsynced) {
            let metadata = ENRICHED_DATA[book.title];
            if (!metadata) {
                // Try fuzzy match or refer
                for (let key in ENRICHED_DATA) {
                    if (book.title.includes(key) || key.includes(book.title)) {
                        metadata = ENRICHED_DATA[key];
                        break;
                    }
                }
            }
            if (metadata && metadata.refer) metadata = ENRICHED_DATA[metadata.refer];

            const author = metadata ? metadata.author : "未知";
            const authorDetail = metadata ? metadata.authorDetail : "暂无详情";
            const year = metadata ? metadata.year : "2024";
            const description = metadata ? metadata.description : book.title;

            // Map category
            let category = "小说文学";
            if (book.sheetCategory.includes("历史")) category = "历史传记";
            else if (book.sheetCategory.includes("科幻") || book.sheetCategory.includes("奇幻")) category = "科幻奇幻";
            else if (book.sheetCategory.includes("心理") || book.sheetCategory.includes("教育")) category = "人文社科";
            else if (book.sheetCategory.includes("励志")) category = "励志成功";
            else if (book.sheetCategory.includes("经管") || book.sheetCategory.includes("商业")) category = "经济管理";

            const downloadLinks = [];
            if (book.quark) downloadLinks.push({ name: "夸克网盘", url: book.quark });
            if (book.baidu) {
                const parts = book.baidu.split('提取码:');
                downloadLinks.push({
                    name: "百度网盘",
                    url: parts[0].trim(),
                    code: parts[1] ? parts[1].trim() : "0000"
                });
            }

            const entry = {
                id: nextId++,
                title: book.title,
                author: author,
                authorDetail: authorDetail,
                year: year,
                cover: book.cover || "",
                description: description,
                category: category,
                downloadLinks: downloadLinks,
                size: "未知",
                format: "EPUB",
                publishYear: year
            };

            newEntries.push(entry);
            syncedIndices.push(book.rowIndex);
        }

        // 1. Update mockData.ts
        const lastBracketIndex = content.lastIndexOf('];');
        const formattedEntries = newEntries.map(e => "  " + JSON.stringify(e, null, 2).replace(/\n/g, "\n  ") + ",").join('\n');
        const newContent = content.slice(0, lastBracketIndex) + formattedEntries + "\n" + content.slice(lastBracketIndex);
        fs.writeFileSync(MOCK_DATA_PATH, newContent);
        console.log(`✅ mockData.ts updated with ${newEntries.length} entries.`);

        // 2. Update sitemap.xml
        let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
        const sitemapEntries = newEntries.map(e => `  <url>\n    <loc>https://www.qifeibook.com/book/${e.id}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n  </url>`).join('\n');
        const closingTag = '</urlset>';
        const newSitemap = sitemap.replace(closingTag, sitemapEntries + '\n' + closingTag);
        fs.writeFileSync(SITEMAP_PATH, newSitemap);
        console.log(`✅ sitemap.xml updated.`);

        // 3. Update Feishu status to 1
        console.log("Updating Feishu status...");
        for (const rowIndex of syncedIndices) {
            const range = `${sheetId}!${String.fromCharCode(65 + statusIdx)}${rowIndex}:${String.fromCharCode(65 + statusIdx)}${rowIndex}`;
            await request({
                hostname: 'open.feishu.cn',
                path: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values`,
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }, {
                valueRange: { range: range, values: [["1"]] }
            });
        }
        console.log("✅ Feishu status updated.");

    } catch (e) {
        console.error(e);
    }
}

main();
