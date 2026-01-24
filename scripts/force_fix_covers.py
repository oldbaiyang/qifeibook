
import json
import ast
import re

MOCK_DATA_PATH = "src/data/mockData.js"
FILTERED_BOOKS_PATH = "filtered_books.json"

def force_fix_covers():
    with open(FILTERED_BOOKS_PATH, "r", encoding="utf-8") as f:
        feishu_books = json.load(f)
    
    title_to_correct_cover = {}
    for book in feishu_books:
        title = book.get('title', '').strip()
        cover_raw = book.get('cover', '')
        full_cover_url = ""
        try:
            if cover_raw.startswith("["):
                segments = ast.literal_eval(cover_raw)
                for seg in segments:
                    full_cover_url += seg.get('text', '')
            else:
                full_cover_url = cover_raw
        except:
             full_cover_url = cover_raw
        
        if full_cover_url:
            title_to_correct_cover[title] = full_cover_url

    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    new_lines = []
    current_title = None
    
    for line in lines:
        # Check if line has title
        # title: "Title",
        m = re.search(r'title:\s*"(.*?)",', line)
        if m:
            current_title = m.group(1)
            new_lines.append(line)
            continue
        
        # Check if line has cover
        # cover: "...",
        if 'cover:' in line and current_title in title_to_correct_cover:
            correct_cover = title_to_correct_cover[current_title]
            # preserve indentation
            indent = line[:line.find('cover')]
            new_lines.append(f'{indent}cover: "{correct_cover}",\n')
            print(f"Fixed cover for {current_title} -> {correct_cover}")
            # Reset current title to avoid accidental updates? 
            # Actually strictly speaking the cover follows the title in the object.
        else:
            new_lines.append(line)

    with open(MOCK_DATA_PATH, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    
    print("Done")

if __name__ == "__main__":
    force_fix_covers()
