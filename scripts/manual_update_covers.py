#!/usr/bin/env python3
"""
Manually update cover URLs based on user input
"""

import re
from pathlib import Path

# Mapping provided by user
UPDATES = {
    "面纱": "https://img.aqifei.top/img/2026/01/20260129161125269",
    "人生的智慧": "https://img.aqifei.top/img/2026/01/桶川跟踪狂杀人事件_35326778",
    "巨人的陨落": "https://img.aqifei.top/img/2026/01/20260129161405765",
    "昨日的世界": "https://img.aqifei.top/img/2026/01/20260129161508098",
    "浪潮之巅": "https://img.aqifei.top/img/2026/01/20260129161536997",
    "少年凯歌": "https://img.aqifei.top/img/2026/01/20260129161752861",
    "桶川跟踪狂杀人事件": "https://img.aqifei.top/img/2026/01/20260129161752861"
}

def main():
    mockdata_path = Path("src/data/mockData.js")
    with open(mockdata_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    count = 0
    for title, url in UPDATES.items():
        # Match title and find its cover field
        # title: "Title" ... cover: "OldUrl"
        
        # We use a pattern that finds the specific book block's cover
        # Assumption: 'cover:' comes after 'title:' and before the next 'title:'
        
        pattern = re.compile(
            rf'(title:\s*"{re.escape(title)}".*?cover:\s*")([^"]*)(")', 
            re.DOTALL
        )
        
        match = pattern.search(content)
        if match:
            old_url = match.group(2)
            if old_url != url:
                # Replace the URL
                # We reconstruct the string with the new URL
                new_block = match.group(1) + url + match.group(3)
                content = content.replace(match.group(0), new_block)
                print(f"Updated {title}: {old_url} -> {url}")
                count += 1
            else:
                print(f"Skipping {title}: URL already matches")
        else:
            print(f"Warning: Could not find book '{title}' in mockData.js")

    if count > 0:
        with open(mockdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"\nSuccessfully updated {count} covers.")
    else:
        print("\nNo changes made.")

if __name__ == "__main__":
    main()
