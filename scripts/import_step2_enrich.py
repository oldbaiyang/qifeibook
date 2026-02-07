#!/usr/bin/env python3
"""
自动补充书籍信息
读取 filtered_books.json，补充作者、简介等信息，输出 enriched_books.json
"""

import json
import requests
import re
import time
from pathlib import Path
from urllib.parse import quote
from bs4 import BeautifulSoup

# 本地知识库 (作为缓存或覆盖)
KNOWLEDGE_BASE = {
    # ... (existing data can remain) ...
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://book.douban.com/'
}

def fetch_douban_metadata(title):
    """
    Search Douban for metadata
    Returns dict with keys: author, authorDetail, description, year, category
    """
    print(f"  Searching Douban for: {title}")
    clean_title = title.split('：')[0].split(':')[0].strip()
    search_url = f"https://www.douban.com/search?cat=1001&q={quote(clean_title)}"
    
    try:
        resp = requests.get(search_url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            print(f"  Search failed: {resp.status_code}")
            return None
            
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Find first result
        first_result = soup.select_one('.result .content')
        if not first_result:
            print("  No results found")
            return None
            
        # Extract link to detail page
        link = first_result.select_one('.title h3 a')
        if not link:
            return None
            
        detail_url = link['href']
        
        # Fetch detail page
        print(f"  Fetching detail: {detail_url}")
        # Need to handle douban redirect link? Usually it's direct or redirect.
        # Douban search results links are like https://www.douban.com/link2/?url=...
        if "www.douban.com/link2" in detail_url:
            # Extract real url
            match = re.search(r'url=(.*?)&', detail_url)
            if match:
                from urllib.parse import unquote
                detail_url = unquote(match.group(1))
        
        time.sleep(1) # Be nice
        detail_resp = requests.get(detail_url, headers=HEADERS, timeout=10)
        if detail_resp.status_code != 200:
            return None
            
        detail_soup = BeautifulSoup(detail_resp.text, 'html.parser')
        
        metadata = {}
        
        # 1. Author
        # <span class="pl"> 作者</span>:
        # <a class="" href="...">[美] ...</a>
        author_elem = detail_soup.find('span', string=re.compile(r'^\s*作者'))
        if author_elem:
            # The next sibling or next a tag
            # Usually: <span>作者:</span> <a ...>Name</a>
            # But sometimes text node.
            # Let's try to get the text after the colon
            parent = author_elem.parent
            # Get all text from parent, strip "作者:"
            full_text = parent.get_text()
            # Crude extraction
            if ":" in full_text:
                author_text = full_text.split(":", 1)[1].strip()
                # Clean up multiple spaces
                author_text = re.sub(r'\s+', ' ', author_text)
                metadata['author'] = author_text
        
        # 2. Year
        # <span class="pl">出版年:</span> 2021-1
        year_elem = detail_soup.find('span', string=re.compile(r'^\s*出版年'))
        if year_elem:
            year_text = year_elem.next_sibling.string.strip()
            # Extract just the year
            match = re.search(r'\d{4}', year_text)
            if match:
                metadata['year'] = match.group(0)
                
        # 3. Description
        # <div class="intro"> ... </div>
        # There might be "all hidden" intro.
        intro_div = detail_soup.select_one('#link-report-intra .intro')
        if not intro_div:
             intro_div = detail_soup.select_one('.related_info .intro')
             
        if intro_div:
            desc = intro_div.get_text(strip=True)
            # Truncate if too long? No, keep it.
            metadata['description'] = desc
            
        # 4. Author Detail (Intro)
        # Usually in another .intro block under "作者简介"
        # H2 contains "作者简介"
        author_header = detail_soup.find('h2', string=re.compile(r'.*作者简介.*'))
        if author_header:
            author_intro_div = author_header.find_next('div', class_='intro')
            if author_intro_div:
                metadata['authorDetail'] = author_intro_div.get_text(strip=True)[:100] + "..." # Truncate for summary
        
        # 5. Category (use Tags)
        # <div id="db-tags-section"> ... <a class="tag">小说</a>
        tags = detail_soup.select('#db-tags-section .tag')
        if tags:
            # Simple heuristic
            tag_names = [t.get_text() for t in tags]
            if "历史" in tag_names or "传记" in tag_names: metadata['category'] = "历史传记"
            elif "小说" in tag_names or "文学" in tag_names: metadata['category'] = "小说文学"
            elif "经济" in tag_names or "管理" in tag_names: metadata['category'] = "经济管理"
            elif "心理" in tag_names or "哲学" in tag_names: metadata['category'] = "人文社科"
            else: metadata['category'] = "小说文学" # Default
            
        return metadata
        
    except Exception as e:
        print(f"  Metadata error: {e}")
        return None

def main():
    print("开始补充书籍信息...")
    input_path = Path("filtered_books.json")
    output_path = Path("enriched_books.json")
    
    if not input_path.exists():
        print(f"Error: {input_path} 不存在")
        return

    with open(input_path, "r", encoding="utf-8") as f:
        books = json.load(f)

    enriched_count = 0
    for book in books:
        title = book['title']
        clean_title = title.strip()
        
        # 1. Try Knowledge Base
        if clean_title in KNOWLEDGE_BASE:
            info = KNOWLEDGE_BASE[clean_title]
            book.update(info)
            enriched_count += 1
            print(f"✓ 已补充 (本地): {clean_title}")
        else:
            # 2. Try Douban
            print(f"⚠ 未找到本地信息: {clean_title}，尝试联网获取...")
            douban_meta = fetch_douban_metadata(clean_title)
            
            if douban_meta:
                book.update(douban_meta)
                enriched_count += 1
                print(f"✓ 已补充 (豆瓣): {clean_title}")
            else:
                print(f"✗ 获取失败，使用默认值")
                if 'author' not in book: book['author'] = "待补充"
                if 'description' not in book: book['description'] = title
            
            time.sleep(2) # Rate limit

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)

    print(f"\n完成！已补充 {enriched_count}/{len(books)} 本书。保存至 {output_path}")

if __name__ == "__main__":
    main()
