
import json
import ast

MOCK_DATA_PATH = "src/data/mockData.js"
FILTERED_BOOKS_PATH = "filtered_books.json"

def fix_covers():
    with open(FILTERED_BOOKS_PATH, "r", encoding="utf-8") as f:
        feishu_books = json.load(f)
    
    updates = []
    
    for book in feishu_books:
        title = book.get('title', '').strip()
        cover_raw = book.get('cover', '')
        
        full_cover_url = ""
        bad_cover_url = ""
        
        try:
            if cover_raw.startswith("["):
                segments = ast.literal_eval(cover_raw)
                # Construct full URL
                for seg in segments:
                    full_cover_url += seg.get('text', '')
                
                # Identify what was likely put as bad URL (the first url segment)
                for item in segments:
                    if item.get('type') == 'url':
                        bad_cover_url = item.get('link') or item.get('text')
                        break
            else:
                full_cover_url = cover_raw
                bad_cover_url = cover_raw
        except:
            continue
            
        if full_cover_url and bad_cover_url and full_cover_url != bad_cover_url:
            updates.append((title, bad_cover_url, full_cover_url))

    # Update file
    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    count = 0
    new_content = content
    
    for title, bad, good in updates:
        # Looking for: cover: "BAD"
        target = f'cover: "{bad}"'
        replacement = f'cover: "{good}"'
        
        if target in new_content:
            new_content = new_content.replace(target, replacement)
            print(f"Updated {title}: {bad} -> {good}")
            count += 1
        else:
            print(f"Target not found for {title}: {target}")
            
    with open(MOCK_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Total updated: {count}")

if __name__ == "__main__":
    fix_covers()
