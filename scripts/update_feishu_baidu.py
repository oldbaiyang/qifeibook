import requests
import re
import time

APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

def get_tokens():
    url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'
    res = requests.post(url, json={'app_id': APP_ID, 'app_secret': APP_SECRET}).json()
    token = res.get('tenant_access_token')

    wiki_url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token={WIKI_TOKEN}"
    wiki_res = requests.get(wiki_url, headers={"Authorization": f"Bearer {token}"}).json()
    obj_token = wiki_res["data"]["node"]["obj_token"]
    return token, obj_token

def get_real_sheet_id(token, obj_token, sheet_name='苦瓜书盘_武侠小说'):
    meta_url = f"https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/{obj_token}/sheets/query"
    meta_res = requests.get(meta_url, headers={"Authorization": f"Bearer {token}"}).json()
    for s in meta_res.get('data', {}).get('sheets', []):
        if s.get('title') == sheet_name:
            return s.get('sheet_id')
    return None

def main():
    token, obj_token = get_tokens()
    sheet_id = get_real_sheet_id(token, obj_token)
    if not sheet_id:
        print("未找到工作表 苦瓜书盘_武侠小说")
        return

    # 从飞书中读取当前所有行的数据提取名称
    read_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{obj_token}/values/{sheet_id}!A2:F"
    data_res = requests.get(read_url, headers={"Authorization": f"Bearer {token}"}).json()
    rows = data_res.get('data', {}).get('valueRange', {}).get('values', [])
    
    # 要更新的百度网盘数据（使用多行字符串）
    raw_data = """
【超级会员V9】通过百度网盘分享的文件：少年追命.mobi
链接：https://pan.baidu.com/s/1jTT_ZbhhXU69Bgkl_tvebw?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：少年铁手.mobi
链接：https://pan.baidu.com/s/1eXQmxUCUdrWR77tQ3W2NKw?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：大漠谣
链接：https://pan.baidu.com/s/1s6n0JJnx_hrwFZVQv3F36A?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：边荒传说.mobi
链接：https://pan.baidu.com/s/1NoAooK7fETBiHHkHQO0RtQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：射雕英雄传前传.pdf
链接：https://pan.baidu.com/s/1kdVqXeSLyRuEQFyz83uWQw?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：碧血剑_20260304_152348.pdf
链接：https://pan.baidu.com/s/1AiIvbektxDKbUElLQvgiGA?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：鹿鼎记.pdf
链接：https://pan.baidu.com/s/1_-078EInIKw8ggqV_tR92g?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：射雕英雄传前传_20260304_152347.pdf
链接：https://pan.baidu.com/s/17zf2ZN1Hhvs4FNuToe5NdQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：碧血剑.pdf
链接：https://pan.baidu.com/s/1bqTEy0O6vpeOzuTWO_a80A?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：剑桥倚天屠龙史.mobi
链接：https://pan.baidu.com/s/1VjCdlDIjiFyfjSi2iUoljg?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：射雕英雄传【新修版】.mobi
链接：https://pan.baidu.com/s/1eg55vmLjGqkfNhNFRBYVxQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：连城诀_20260304_152347.pdf
链接：https://pan.baidu.com/s/1DQBqjIG4YgZVcZBgG1HvOw?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：碧血剑【新修版】.mobi
链接：https://pan.baidu.com/s/151shJUWtixgA3gPgPfQ4Cw?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：剑桥倚天屠龙史_20260304_152359.mobi
链接：https://pan.baidu.com/s/1xZ_9aSExevM18KhH0hW-AA?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：连城诀.pdf
链接：https://pan.baidu.com/s/1E-v-2tCYJL2J3-rRGUtPEQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：欢乐英雄.azw3
链接：https://pan.baidu.com/s/1_Rpxthp9wKHKbpnmaPBCeg?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：七剑下天山.mobi
链接：https://pan.baidu.com/s/16580Nbq6zBTGq59xJCaPQQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：长安乱.pdf
链接：https://pan.baidu.com/s/1VA8gIQ_weFv8qmmKkr3tRg?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：神雕侠侣【新修版】.mobi
链接：https://pan.baidu.com/s/1iSc7y9RXMwxxNpnHJ33G4A?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：雪山飞狐.pdf
链接：https://pan.baidu.com/s/1c-SMRdRzqXFvs8_V8tt-TQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：飞狐外传.pdf
链接：https://pan.baidu.com/s/1lYwKOAF0SaAmBM8QqDfQnw?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：射雕英雄传前传_20260304_152359.pdf
链接：https://pan.baidu.com/s/1IMoRCz8oPbM_aDqd4QM4xQ?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：连城诀_20260304_152358.pdf
链接：https://pan.baidu.com/s/1d8hBHzn0FiITWNO7qpIGBg?pwd=0000 
提取码：0000

【超级会员V9】通过百度网盘分享的文件：布衣神相.mobi
链接：https://pan.baidu.com/s/1MLxG76sb7Bi63DdAqj6Ydg?pwd=0000 
提取码：0000
    """

    # 解析链接文本块
    book_links_map = {}
    blocks = raw_data.strip().split('\n\n')
    for block in blocks:
        lines = block.split('\n')
        name = ""
        link = ""
        code = "0000" # 统一为0000
        for line in lines:
            if "分享的文件：" in line:
                # 剔除后缀和时间戳等清理成纯书名
                full_name = line.split("分享的文件：")[1].strip()
                # 兼容类似“碧血剑_20260304_152348.pdf” / “连城诀.pdf”
                name_clean = full_name.split('.')[0].split('_')[0]
                name = name_clean
            elif line.startswith("链接："):
                link = line.replace("链接：", "").strip()
        if name and link:
            # 遇到多格式或者重复项，合并为多个下划线
            if name in book_links_map:
                book_links_map[name].append(link)
            else:
                book_links_map[name] = [link]
                
    updates = []
    
    for idx, row in enumerate(rows):
        if not row or len(row) < 1: continue
        title = row[0].strip()
        matched_links = []
        
        # 尝试精确匹配飞书的书名
        for parsed_name, links in book_links_map.items():
            if parsed_name == title or parsed_name in title or title in parsed_name:
                matched_links = links
                break
                
        if matched_links:
            row_num = idx + 2
            
            # 使用飞书富文本格式构建下载链接
            cell_items = []
            for i, l in enumerate(matched_links):
                cell_items.append({
                    "type": "text", "text": f"百度网盘{i+1}: "
                })
                cell_items.append({
                    "type": "url", "text": l, "link": l
                })
                cell_items.append({
                    "type": "text", "text": " (密码: 0000)\n"
                })
                
            updates.append({
                "range": f"{sheet_id}!E{row_num}:E{row_num}",
                "values": [[cell_items]]
            })
            print(f"匹配成功: {title} -> {len(matched_links)} 个链接")
        else:
            print(f"未找到网盘链接匹配: {title}")

    if updates:
        print(f"\n准备批量更新 {len(updates)} 本书的飞书下载链接...")
        update_url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{obj_token}/values_batch_update"
        resp = requests.post(update_url, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, json={"valueRanges": updates}).json()
        if resp.get('code') == 0:
            print("✅ 飞书网盘链接写入完成！")
        else:
            print(f"❌ 写入失败: {resp}")

if __name__ == "__main__":
    main()
