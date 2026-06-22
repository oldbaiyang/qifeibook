import type { CategorySummary } from "@/lib/data-access";

const CATEGORY_ALIASES: Record<string, string> = {
  "中医养生": "健康养生",
  "历史": "历史人文",
  "小说文学": "文学小说",
  "心理力志": "心理励志",
  "心理百科": "心理学",
  "心理自助": "心理学",
  "推理小说": "悬疑推理",
  "科幻悬疑": "科幻奇幻",
  "科普百科": "科普",
  "科普读物": "科普",
  "童书绘本": "少儿读物",
  "网络文学": "网络小说",
  "都市言情": "言情小说",
};

export function getCanonicalCategoryName(name: string): string {
  return CATEGORY_ALIASES[name] ?? name;
}

export function isCategoryAlias(name: string): boolean {
  return getCanonicalCategoryName(name) !== name;
}

export function getCanonicalCategoryPath(name: string): string {
  return `/category/${encodeURIComponent(getCanonicalCategoryName(name))}`;
}

export function getCategoryAliases(name: string): string[] {
  const canonicalName = getCanonicalCategoryName(name);
  const aliases = Object.entries(CATEGORY_ALIASES)
    .filter(([, target]) => target === canonicalName)
    .map(([alias]) => alias);

  return [canonicalName, ...aliases];
}

export function mergeCategorySummaries(rows: CategorySummary[]): CategorySummary[] {
  const merged = new Map<string, CategorySummary>();

  for (const row of rows) {
    const canonicalName = getCanonicalCategoryName(row.name);
    const current = merged.get(canonicalName);
    merged.set(canonicalName, {
      name: canonicalName,
      slug: canonicalName,
      bookCount: (current?.bookCount ?? 0) + row.bookCount,
    });
  }

  return [...merged.values()].sort((left, right) => right.bookCount - left.bookCount || left.name.localeCompare(right.name, "zh-CN"));
}
