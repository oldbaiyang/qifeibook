import re

file_path = 'src/data/mockData.js'

updates = {
    "乡土中国": "人文社科",
    "人类简史": "历史传记",
    "沉默的大多数": "人文社科"
}

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for title, new_category in updates.items():
    # Construct regex to match the specific book entry and its category
    # matching strategy: Find title, then find the next category field
    pattern = re.compile(r'(title:\s*"' + re.escape(title) + r'",.*?category:\s*")([^"]+)(")', re.DOTALL)
    
    match = pattern.search(content)
    if match:
        old_category = match.group(2)
        if old_category != new_category:
            print(f"Updating '{title}': {old_category} -> {new_category}")
            # we simply replace the first occurrence after the title
            # To be safe, we can use the match object to replace
            start, end = match.span(2)
            content = content[:start] + new_category + content[end:]
        else:
            print(f"Skipping '{title}': Already {new_category}")
    else:
        print(f"Warning: Could not find entry for '{title}'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates complete.")
