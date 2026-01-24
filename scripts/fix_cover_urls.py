
import json
import ast
import re

MOCK_DATA_PATH = "src/data/mockData.js"
FILTERED_BOOKS_PATH = "filtered_books.json"

def fix_covers():
    # 1. Read filtered books to get correct URLs
    with open(FILTERED_BOOKS_PATH, "r", encoding="utf-8") as f:
        feishu_books = json.load(f)
    
    title_to_cover = {}
    
    for book in feishu_books:
        title = book.get('title', '').strip()
        cover_raw = book.get('cover', '')
        
        full_cover_url = ""
        try:
            if cover_raw.startswith("["):
                # Parse the string rep of list
                segments = ast.literal_eval(cover_raw)
                # Concatenate the 'text' of all segments
                for seg in segments:
                    full_cover_url += seg.get('text', '')
            else:
                full_cover_url = cover_raw
        except:
            full_cover_url = cover_raw
            
        if full_cover_url:
            title_to_cover[title] = full_cover_url
            print(f"Parsed cover for {title}: {full_cover_url}")

    # 2. Update mockData.js
    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We replace lines like: cover: "https://..._"
    # with cover: "https://..._Title"
    
    # It's safer to use the title to locate the entry, then update the cover line.
    # But regex replacement is easier if unique.
    
    # The current incorrect URLs in mockData end with underscore.
    # Let's verify what's currently in mockData.
    # We can iterate over the titles we have corrections for.
    
    new_content = content
    count = 0
    
    for title, correct_url in title_to_cover.items():
        # Find the block for this title
        # pattern: title: "Title", ... cover: "BadUrl",
        
        # We look for the specific bad url that we likely generated.
        # The bad URL was just the first part.
        
        # Re-construct the bad url logic to find it? 
        # In process_import.py:
        # if item.get('type') == 'url': cover = item.get('link') or item.get('text')
        
        # So the bad url currently in file is what was in the 'url' segment.
        # Which is e.g. 'https://img.aqifei.top/img/2026/01/042_'
        
        # Let's find what text was put in step 104's logic.
        # It took the FIRST item with type='url'.
        bad_url = ""
        try:
             if book.get('cover', '').startswith("["):
                segments = ast.literal_eval(book.get('cover', ''))
                for item in segments:
                    if item.get('type') == 'url':
                        bad_url = item.get('link') or item.get('text')
                        break
        except:
            pass
        
        if bad_url and bad_url != correct_url:
            # Replace
            if bad_url in new_content:
                # Be careful not to replace if it appears multiple times (unlikely for these specific timestamps)
                new_content = new_content.replace(f'cover: "{bad_url}"', f'cover: "{correct_url}"')
                count += 1
                print(f"Updated {title}")
            else:
                print(f"Could not find bad URL for {title}: {bad_url}")
        else:
            print(f"Skipping {title} (URL might be same or empty)")

    with open(MOCK_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Updated {count} covers in {MOCK_DATA_PATH}")

if __name__ == "__main__":
    fix_covers()
