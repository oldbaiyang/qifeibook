const MAX_KEYWORDS_PER_BOOK = 8;

const CATEGORY_KEYWORDS = new Map([
  ["中医养生", ["中医养生", "健康养生"]],
  ["个人成长", ["个人成长", "成长励志"]],
  ["人生哲学", ["人生哲学", "哲学"]],
  ["人物传记", ["人物传记", "传记"]],
  ["健康养生", ["健康养生"]],
  ["历史", ["历史", "历史人文"]],
  ["历史人文", ["历史人文", "历史"]],
  ["历史科普", ["历史科普", "历史", "科普"]],
  ["商业经济", ["商业经济", "经济管理"]],
  ["哲学", ["哲学", "人文社科"]],
  ["外国文学", ["外国文学", "经典文学"]],
  ["家庭教育", ["家庭教育", "亲子教育"]],
  ["少儿读物", ["少儿读物", "儿童文学"]],
  ["心理力志", ["心理励志", "个人成长"]],
  ["心理励志", ["心理励志", "个人成长"]],
  ["心理学", ["心理学", "心理自助"]],
  ["心理百科", ["心理百科", "心理学"]],
  ["心理自助", ["心理自助", "心理学"]],
  ["成长励志", ["成长励志", "个人成长"]],
  ["悬疑推理", ["悬疑推理", "推理小说"]],
  ["投资理财", ["投资理财", "商业经济"]],
  ["推理小说", ["推理小说", "悬疑推理"]],
  ["文学小说", ["文学小说", "现代文学"]],
  ["武侠小说", ["武侠小说", "网络小说"]],
  ["法律", ["法律", "人文社科"]],
  ["漫画绘本", ["漫画绘本", "治愈漫画"]],
  ["玄幻小说", ["玄幻小说", "网络小说"]],
  ["现代文学", ["现代文学", "文学小说"]],
  ["社会文化", ["社会文化", "人文社科"]],
  ["科幻奇幻", ["科幻奇幻", "科幻小说"]],
  ["科幻悬疑", ["科幻悬疑", "科幻小说", "悬疑推理"]],
  ["科普", ["科普", "科普读物"]],
  ["科普百科", ["科普百科", "科普"]],
  ["科普读物", ["科普读物", "科普"]],
  ["穿越小说", ["穿越小说", "网络小说"]],
  ["童书绘本", ["童书绘本", "儿童文学"]],
  ["经济学", ["经济学", "商业经济"]],
  ["网络小说", ["网络小说"]],
  ["网络文学", ["网络文学", "网络小说"]],
  ["职场成长", ["职场成长", "个人成长"]],
  ["艺术设计", ["艺术设计"]],
  ["言情小说", ["言情小说", "网络小说"]],
  ["计算机", ["计算机", "科技互联网"]],
  ["诗歌散文", ["诗歌散文", "文学小说"]],
  ["都市言情", ["都市言情", "言情小说"]],
  ["青春校园", ["青春校园", "成长小说"]],
]);

const TEXT_KEYWORD_RULES = [
  ["AI", ["AI", "人工智能", "大模型", "智能体", "Agent", "ChatGPT"]],
  ["互联网", ["互联网", "平台经济", "产品经理", "运营"]],
  ["创业", ["创业", "企业家", "商业模式"]],
  ["投资理财", ["投资", "理财", "股票", "基金", "财务自由"]],
  ["经济学", ["经济学", "经济周期", "宏观经济"]],
  ["职场成长", ["职场", "管理", "领导力", "沟通"]],
  ["个人成长", ["自我成长", "个人成长", "认知升级", "习惯养成"]],
  ["心理学", ["心理学", "心理咨询", "情绪", "人格"]],
  ["家庭教育", ["家庭教育", "亲子", "育儿", "孩子"]],
  ["历史", ["历史", "王朝", "帝国", "战争史"]],
  ["哲学", ["哲学", "存在主义", "伦理学", "思想史"]],
  ["社会文化", ["社会学", "社会文化", "人类学", "文化研究"]],
  ["科普", ["科普", "宇宙", "物理", "生物学", "数学"]],
  ["法律", ["法律", "法治", "刑法", "民法"]],
  ["中医养生", ["中医", "经络", "养生", "黄帝内经"]],
  ["文学小说", ["长篇小说", "中篇小说", "短篇小说", "小说集"]],
  ["外国文学", ["外国文学", "英国作家", "美国作家", "日本作家", "韩国作家", "德国作家", "法国作家"]],
  ["经典文学", ["经典", "名著", "诺贝尔文学奖"]],
  ["现代文学", ["现代文学", "当代文学", "现实主义"]],
  ["诗歌散文", ["诗歌", "散文", "随笔"]],
  ["武侠小说", ["武侠", "江湖", "金庸", "古龙"]],
  ["玄幻小说", ["玄幻", "修真", "仙侠", "修炼", "仙帝"]],
  ["穿越小说", ["穿越", "重生", "平行时空"]],
  ["言情小说", ["言情", "甜宠", "婚恋"]],
  ["都市言情", ["都市言情", "都市爱情", "现代都市"]],
  ["青春校园", ["青春", "校园", "学生时代", "成长小说"]],
  ["悬疑推理", ["悬疑", "推理", "侦探", "犯罪", "谜案"]],
  ["科幻小说", ["科幻", "三体", "赛博朋克", "未来世界"]],
  ["奇幻小说", ["奇幻", "魔法", "异世界"]],
  ["漫画绘本", ["漫画", "绘本", "插画"]],
  ["儿童文学", ["儿童文学", "少儿", "童书"]],
  ["艺术设计", ["艺术设计", "设计", "美学", "绘画"]],
  ["治愈", ["治愈", "温暖", "暖心"]],
];

const GENERIC_KEYWORDS = new Set(["小说", "电子书", "下载", "epub", "txt", "pdf", "mobi"]);

function normalizeKeyword(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .replace(/^[,，、;；:：]+|[,，、;；:：]+$/g, "")
    .trim();
}

function isUsefulKeyword(value) {
  if (!value || value.length < 2 || value.length > 16) {
    return false;
  }

  if (GENERIC_KEYWORDS.has(value.toLowerCase())) {
    return false;
  }

  return /[\p{Script=Han}A-Za-z0-9]/u.test(value);
}

function addKeyword(keywords, value) {
  const normalizedValue = normalizeKeyword(value);

  if (!isUsefulKeyword(normalizedValue)) {
    return;
  }

  keywords.set(normalizedValue.toLowerCase(), normalizedValue);
}

function getSearchText(book) {
  return [book.title, book.category, book.description].filter(Boolean).join(" ");
}

export function deriveBookKeywords(book, { maxKeywords = MAX_KEYWORDS_PER_BOOK } = {}) {
  const keywords = new Map();

  for (const keyword of book.keywords ?? []) {
    addKeyword(keywords, keyword);
  }

  const categoryName = normalizeKeyword(book.category);
  for (const keyword of CATEGORY_KEYWORDS.get(categoryName) ?? [categoryName]) {
    addKeyword(keywords, keyword);
  }

  const searchText = getSearchText(book);
  for (const [keyword, patterns] of TEXT_KEYWORD_RULES) {
    if (patterns.some((pattern) => searchText.includes(pattern))) {
      addKeyword(keywords, keyword);
    }
  }

  return [...keywords.values()].slice(0, maxKeywords);
}

export function summarizeKeywordCoverage(bookList, { indexableMinBookCount = 3 } = {}) {
  const keywordCounts = new Map();
  let booksWithKeywords = 0;

  for (const book of bookList) {
    const keywords = deriveBookKeywords(book);

    if (keywords.length > 0) {
      booksWithKeywords += 1;
    }

    for (const keyword of keywords) {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1);
    }
  }

  const topKeywords = [...keywordCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .map(([name, count]) => ({ name, count }));

  return {
    totalBooks: bookList.length,
    booksWithKeywords,
    coverageRate: bookList.length === 0 ? 0 : Number((booksWithKeywords / bookList.length).toFixed(4)),
    uniqueKeywords: keywordCounts.size,
    indexableKeywords: topKeywords.filter((keyword) => keyword.count >= indexableMinBookCount).length,
    topKeywords: topKeywords.slice(0, 30),
  };
}
