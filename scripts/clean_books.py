
import json
import ast

def clean_feishu_data():
    with open("filtered_books.json", "r", encoding="utf-8") as f:
        books = json.load(f)
    
    cleaned_books = []
    
    for book in books:
        # Title
        title = book.get('title', '').strip()
        
        # Parse Cover
        cover_raw = book.get('cover', '')
        cover = ""
        try:
            # It's likely a python-style string representation of a list
            if cover_raw.startswith("["):
                cover_list = ast.literal_eval(cover_raw)
                for item in cover_list:
                    if item.get('type') == 'url':
                        cover = item.get('link') or item.get('text')
                        break
            else:
                cover = cover_raw
        except:
            pass
            
        # Parse Quark
        quark_raw = book.get('quark', '')
        quark_url = ""
        try:
            if quark_raw.startswith("["):
                quark_list = ast.literal_eval(quark_raw)
                for item in quark_list:
                    if item.get('type') == 'url':
                        quark_url = item.get('link') or item.get('text')
                        break
            else:
                quark_url = quark_raw
        except:
            pass

        # Parse Baidu
        baidu_raw = book.get('baidu', '')
        baidu_url = ""
        baidu_code = ""
        try:
            if baidu_raw.startswith("["):
                baidu_list = ast.literal_eval(baidu_raw)
                for item in baidu_list:
                    if item.get('type') == 'url':
                        baidu_url = item.get('link') or item.get('text')
                        break
            else:
                baidu_url = baidu_raw
        except:
            pass
            
        # Extract Baidu pwd if in URL
        if '?pwd=' in baidu_url:
            baidu_code = baidu_url.split('?pwd=')[-1]
            
        cleaned_books.append({
            "id_placeholder": 0, # To be filled
            "title": title,
            "cover": cover,
            "downloadLinks": [
                {"name": "夸克网盘", "url": quark_url},
                {"name": "百度网盘", "url": baidu_url, "code": baidu_code or "0000"}
            ],
            # To be filled
            "author": "", 
            "authorDetail": "",
            "description": "",
            "category": "小说文学",
            "year": "2024",
            "publishYear": "2024",
            "size": "未知",
            "format": "EPUB"
        })

    print(json.dumps(cleaned_books, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    clean_feishu_data()
