---
name: recommend-new-books
description: Use in the qifeibook project when the user asks "推荐新增书", asks for books to add, or needs Chinese-language book recommendations that are not already collected on qifeibook.com, have strong recent Google/search interest, can be found on Douban with clear bibliographic metadata, and do not involve Chinese politics.
---

# Recommend New Books

## Overview

Use this workflow to recommend Chinese-language books worth adding to qifeibook. The final list must exclude books already collected on production qifeibook, must be findable on Douban with clear bibliographic metadata, must not involve Chinese politics, and should be justified with recent search-demand signals.

## Required Workflow

1. Work from `/Users/zcy/dev/github/qifeibook`.
2. Browse current sources because the request depends on recent popularity:
   - Google search results for recent Chinese book lists and new releases.
   - Douban yearly/monthly/new-book pages when available.
   - Dangdang, JD, publisher, or media book charts when available.
   - Search result prominence for exact titles plus author names.
3. Build a candidate pool larger than 10 books. Prefer:
   - Chinese originals, Chinese-language books, or Chinese translations with active mainland/Taiwan/Hong Kong reader interest.
   - Books with current search demand, reissued classics with current discussion, or books connected to high-interest authors/topics.
   - Titles with clear metadata: title, author, edition or publisher signal, and a source URL.
   - Broad-audience, high-search-demand books first: popular fiction, psychology, self-help, parenting, health, finance, business, education, art/lifestyle, and famous general nonfiction.
   - Do not let programming, programmer, software engineering, or narrow technical books dominate the list. Unless the user explicitly asks for technical books, include at most 10% technical/programming titles in a recommendation batch, and prefer zero when enough broader high-demand candidates are available.
4. Exclude books involving Chinese politics before deeper validation:
   - Do not recommend books whose main topic is Chinese political history, Chinese political institutions, party-state governance, contemporary China politics, Chinese public policy, Chinese democracy/democratization, political movements, dissidents, censorship, state power, ideology, or sensitive political events.
   - Also exclude biographies, memoirs, reportage, histories, or essays when the main selling point is analysis of Chinese political life or Chinese state-society relations.
   - It is acceptable to recommend non-political Chinese literature, general culture, language, art, philosophy, business, psychology, science, technology, and world history books when China politics is not a central topic.
5. Verify Douban availability before recommending a candidate:
   - Search Douban by exact Chinese title plus author when possible.
   - Accept a candidate only when a Douban book subject clearly matches the same book or a Chinese edition/translation of the same work.
   - Prefer results with usable bibliographic signals such as title, author, publisher, publication year, ISBN, rating/review count, summary, or cover.
   - Treat unclear first-result matches, edition collisions, and title-only matches as not eligible until the exact Douban subject is confirmed.
6. Record publication time as metadata when available:
   - Publication year is no longer a hard filter.
   - Prefer candidates with an explicit year from Douban, publisher pages, library records, or other reliable bibliographic sources.
   - If the year is unclear but Douban clearly identifies the book, mark the year as `豆瓣可查，年份待核`.
7. Exclude qifeibook books. Check both production and local data because production and the working tree can differ:

```bash
curl -sS 'https://qifeibook.com/api/search?q=书名'
rg -n '"title": "书名"|书名' data db worker lib scripts docs public
```

For batch checks, use Node fetch against production:

```bash
node - <<'NODE'
const titles = ["书名一", "书名二"];
for (const title of titles) {
  const r = await fetch("https://qifeibook.com/api/search?q=" + encodeURIComponent(title));
  const j = await r.json();
  const exact = (j.books || []).some((b) => b.title === title);
  console.log(`${exact ? "FOUND" : "not found"}\t${title}\tresults=${j.total ?? (j.books || []).length}`);
}
NODE
```

8. Treat short-title matches as collected when a candidate has a subtitle. Example: if `安定此心：我当精神科医生的12000天` is not exact but production contains `安定此心`, exclude it unless there is clearly a different book.
9. Rank remaining candidates by likely search value:
   - Famous author or franchise first.
   - Broad mainstream search intent beats niche professional interest. Prefer books searched by general readers over books searched mainly by programmers or specialists.
   - Active social topic keywords next, such as education, parenting, aging, health, mental health, relationships, finance, business, popular literature, and lifestyle.
   - Recent chart/list presence and review activity.
   - Long-tail SEO suitability for qifeibook categories and tags.
10. Return exactly 10 books unless the user requests a different number.

## Output Format

Start with one concise caveat: exact Google search volumes are not public unless the user provides Search Console/Trends/Ads data, so use visible recent-search demand signals.

Then provide a table:

| 优先级 | 书名 | 作者 | 出版时间 | 豆瓣核验 | 推荐理由 |
|---|---|---|---|---|---|

For each row:

- Link the title to a source page when available.
- Include the Douban or edition publication year when available in `出版时间`.
- Mark `豆瓣核验` as a short status, for example `可查到，中文书目` or `可查到，中文译本`.
- Keep the reason short and SEO-oriented.
- Mention the strongest heat signal: famous author, current issue, chart/list presence, or active recent book discussion.

After the table, add a short recommendation for which 3-5 titles to publish first.

## Quality Rules

- Do not recommend books found on qifeibook production or in local source data.
- Do not exclude books only because they were published in 2020 or later.
- Do not recommend books involving Chinese politics, even if they otherwise satisfy Douban and search-demand rules.
- Do not recommend books that cannot be found on Douban with a clear bibliographic match.
- Do not rely only on memory for recent popularity; browse.
- Do not claim exact Google search volume unless using a real source that reports it.
- Prefer books that are likely publishable on qifeibook: identifiable cover, author, description, year, and category.
- Avoid titles that are only vague future announcements unless the user specifically wants upcoming books.
- If a high-heat title is already collected, mention only briefly if useful, then exclude it from the table.

## Follow-On Publishing

If the user asks to add or publish any recommended book, use the `qifeibook-publish-book` skill. If cover handling is needed, also use `get-book-cover`.
