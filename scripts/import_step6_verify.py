
import os

try:
    with open("src/data/mockData.js", "r", encoding="utf-8") as f:
        content = f.read()
        print("File read successfully.")
        
        # 简单的括号匹配检查
        open_braces = content.count('{')
        close_braces = content.count('}')
        open_brackets = content.count('[')
        close_brackets = content.count(']')
        
        print(f"Braces: {open_braces} / {close_braces}")
        print(f"Brackets: {open_brackets} / {close_brackets}")
        
        if open_braces != close_braces:
            print("ERROR: Mismatched braces!")
        if open_brackets != close_brackets:
            print("ERROR: Mismatched brackets!")
            
except Exception as e:
    print(f"Error: {e}")
