
import re

path = 'src/data/mockData.js'

def fix_mockdata():
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split the file into two parts: books definition and categories definition
    separator = 'export const categories = ['
    if separator not in content:
        print("Could not find separator")
        return

    parts = content.split(separator)
    books_defs = parts[0].strip()
    categories_part = parts[1].strip()

    # Remove the closing '];' from books_defs
    if books_defs.endswith('];'):
        books_defs = books_defs[:-2].strip()
    
    # In categories_part, we have the original categories (strings) and the appended books (objects)
    # ending with '];'
    if categories_part.endswith('];'):
        categories_part = categories_part[:-2]
    
    # Split categories_part by comma to separate items roughly
    # But objects contain commas.
    # We can detect where the objects start. The objects start with '{'
    
    # Let's find the first '{' in categories_part
    first_brace_idx = categories_part.find('{')
    
    if first_brace_idx != -1:
        real_categories = categories_part[:first_brace_idx].strip()
        # Remove trailing comma if any
        if real_categories.endswith(','):
            real_categories = real_categories[:-1].strip()
            
        new_books = categories_part[first_brace_idx:].strip()
        
        # Now construct the new file content
        # books_defs + comma + new_books + ]; + categories definition + real_categories + ];
        
        # Ensure books_defs ends with comma if needed, or if it's empty (not empty here)
        if not books_defs.endswith(','):
            books_defs += ','
            
        new_content = f"{books_defs}\n{new_books}\n];\n\n{separator}\n{real_categories}\n];\n"
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("Fixed mockData.js")
    else:
        print("No new books found in categories array?")

if __name__ == "__main__":
    fix_mockdata()
