
import json

MOCK_DATA_PATH = "src/data/mockData.js"
DOUBAN_PATH = "douban_top250.json"

BOOKS_TO_FIX = [
    "树上的男爵",
    "西游记（全二册）",
    "射雕英雄传",
    "万历十五年",
    "基督山伯爵",
    "肖申克的救赎"
]

def replace_covers():
    # 1. Load Douban data
    with open(DOUBAN_PATH, "r", encoding="utf-8") as f:
        douban_books = json.load(f)
    
    # Map title -> cover
    douban_map = {b['title']: b['cover'] for b in douban_books}
    
    # Verify we have covers for all
    replacements = {}
    for title in BOOKS_TO_FIX:
        if title in douban_map:
            replacements[title] = douban_map[title]
            print(f"Found match for {title}: {douban_map[title]}")
        else:
            print(f"WARNING: No match found for {title} in Douban data.")

    # 2. Update mockData.js
    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    new_lines = []
    current_title = None
    
    for line in lines:
        # Check title
        if 'title:' in line:
            import re
            m = re.search(r'title:\s*"(.*?)",', line)
            if m:
                current_title = m.group(1)
        
        # Check cover
        if 'cover:' in line and current_title in replacements:
            # We found the cover line for a book to fix
            new_cover = replacements[current_title]
            indent = line[:line.find('cover')]
            new_lines.append(f'{indent}cover: "{new_cover}",\n')
            print(f"Replaced cover for {current_title}")
            # Reset current_title so we don't replace again if duplicate blocks exist (shouldn't)
            # But actually we want to fix ALL occurrences if any.
            # current_title = None 
        else:
            new_lines.append(line)
            
    with open(MOCK_DATA_PATH, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
    print("Update complete.")

if __name__ == "__main__":
    replace_covers()
