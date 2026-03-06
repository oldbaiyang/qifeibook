#!/usr/bin/env python3
"""
爬取苦瓜书盘网络小说分类，写入飞书表格"苦瓜书盘"sheet页
"""

import os
import re
import time
import json
import logging
import asyncio
from typing import List, Dict, Any, Optional

from playwright.async_api import async_playwright
import requests

# ==========================================
# 飞书配置
# ==========================================
APP_ID = 'cli_a5ac1fa61a78900c'
APP_SECRET = 'P4dSxCogfw69EG0224aHIfpF1d8W5oce'
WIKI_TOKEN = 'RIXjwrSs3ibf7FkOB2JcguCin8I'

# ==========================================
# 爬虫配置
# ==========================================
START_URL = "https://kgbook.com/wangluoxiaoshuo/"
BROWSER_ARGS = [
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-setuid-sandbox'
]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 图床 API 请求函数，带超时和自动重试
def upload_to_piclist(image_url: str, retries: int = 3) -> str:
    """上传图片至 Piclist，返回新的图床 URL。出错返回原 URL"""
    if not image_url:
        return ""

    for i in range(retries):
        try:
            res = requests.post(
                'http://127.0.0.1:36677/upload',
                json={"list": [image_url]},
                timeout=20
            ).json()
            if res.get('success') and res.get('result'):
                new_url = res['result'][0]
                logger.info(f"✅ 图片上传成功: {new_url}")
                return new_url
            else:
                logger.warning(f"⚠️  图床返回失败: {res}")
        except Exception as e:
            logger.warning(f"⚠️  图床上传失败 (尝试 {i+1}/{retries}): {e}")
            if i < retries - 1:
                time.sleep(2)

    logger.error(f"❌ 图床上传最终失败，使用原 URL: {image_url}")
    return image_url


def get_tenant_access_token() -> str:
    """获取飞书 tenant_access_token"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    payload = {
        "app_id": APP_ID,
        "app_secret": APP_SECRET
    }
    response = requests.post(url, json=payload)
    data = response.json()
    if data.get("code") == 0:
        return data["tenant_access_token"]
    else:
        raise Exception(f"获取 token 失败: {data}")


def get_sheet_id(token: str, sheet_name: str = "苦瓜书盘") -> str:
    """获取指定 sheet 的 sheet_id"""
    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/metainfo"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    data = response.json()

    if data.get("code") == 0:
        sheets = data["data"]["sheets"]
        for sheet in sheets:
            if sheet["title"] == sheet_name:
                return sheet["sheetId"]
        raise Exception(f"未找到名为 '{sheet_name}' 的 sheet")
    else:
        raise Exception(f"获取 sheet 信息失败: {data}")


def append_to_feishu(token: str, sheet_id: str, books: List[Dict[str, Any]]) -> bool:
    """批量追加数据到飞书表格"""
    if not books:
        logger.warning("没有数据需要写入")
        return False

    url = f"https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/{WIKI_TOKEN}/values_append"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 构建数据行
    values = []
    for book in books:
        row = [
            book.get('title', ''),           # A列：书名
            book.get('cover', ''),           # B列：封面图
            book.get('author', ''),          # C列：作者
            book.get('description', ''),     # D列：简介
            book.get('download_link', ''),   # E列：下载链接
            '',  # F列：百度网盘（空）
            '',  # G列：夸克网盘（空）
            '0'  # H列：处理状态默认为0
        ]
        values.append(row)

    payload = {
        "valueRange": {
            "range": f"{sheet_id}!A:H",
            "values": values
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        if data.get("code") == 0:
            logger.info(f"✅ 成功写入 {len(books)} 条数据到飞书")
            return True
        else:
            logger.error(f"❌ 写入飞书失败: {data}")
            return False
    except Exception as e:
        logger.error(f"❌ 写入飞书异常: {e}")
        return False


async def scrape_book_detail(page, detail_url: str) -> Dict[str, str]:
    """进入详情页获取封面和完整简介"""
    try:
        await page.goto(detail_url, wait_until='networkidle', timeout=30000)
        await page.wait_for_timeout(1000)

        # 获取封面
        cover_url = ''
        cover_elem = await page.query_selector('img[src*="/d/file/"], img[src*="cover"], .entry-content img')
        if cover_elem:
            cover_url = await cover_elem.get_attribute('src') or ''
            if cover_url and not cover_url.startswith('http'):
                cover_url = 'https://kgbook.com' + cover_url
            # 上传到图床
            if cover_url and 'star.gif' not in cover_url:
                cover_url = upload_to_piclist(cover_url)

        # 获取完整简介
        description = ''
        desc_elem = await page.query_selector('.entry-content, .book-intro, .post-content, #content')
        if desc_elem:
            full_text = await desc_elem.inner_text()

            # 提取简介部分
            lines = full_text.split('\n')
            intro_started = False
            intro_lines = []

            for line in lines:
                line = line.strip()

                # 跳过空行
                if not line:
                    continue

                # 找到"简介："标记
                if '简介：' in line or '简介:' in line:
                    intro_started = True
                    continue

                # 如果已经开始收集简介
                if intro_started:
                    # 遇到这些标记就停止
                    if any(keyword in line for keyword in ['购买正版', '传送', '条评论', 'Powered By', 'azw格式', 'epub格式', 'mobi格式', 'pdf格式']):
                        break
                    intro_lines.append(line)

            description = ' '.join(intro_lines).strip()

            # 如果没有找到简介标记，尝试其他方式
            if not description:
                # 查找包含实际内容的段落
                for line in lines:
                    line = line.strip()
                    # 跳过元数据行
                    if any(keyword in line for keyword in ['作者：', '格式：', '语言：', '大小：', '星级：', '发布人：', '整理时间：', '相关链接：', '热度：']):
                        continue
                    # 跳过短行和特殊标记
                    if len(line) > 20 and not any(keyword in line for keyword in ['购买正版', '传送', '条评论', 'Powered By']):
                        intro_lines.append(line)

                description = ' '.join(intro_lines[:3]).strip()  # 取前3段

        # 获取下载链接
        download_link = ''
        link_elem = await page.query_selector('a[href*="pan.baidu"], a[href*="pan.quark"]')
        if link_elem:
            download_link = await link_elem.get_attribute('href') or ''

        return {
            'cover': cover_url,
            'description': description,
            'download_link': download_link
        }

    except Exception as e:
        logger.error(f"❌ 获取详情页失败 {detail_url}: {e}")
        return {'cover': '', 'description': '', 'download_link': ''}


async def scrape_books() -> List[Dict[str, Any]]:
    """爬取网络小说分类的书籍信息"""
    books = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=BROWSER_ARGS
        )

        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )

        page = await context.new_page()

        try:
            logger.info(f"🌐 访问页面: {START_URL}")
            await page.goto(START_URL, wait_until='networkidle', timeout=30000)
            await page.wait_for_timeout(2000)

            # 先提取所有书籍的基本信息
            book_cards = await page.query_selector_all('.channel-item')
            logger.info(f"📚 找到 {len(book_cards)} 个书籍卡片")

            # 提取基本信息
            book_list = []
            for idx, card in enumerate(book_cards, 1):
                try:
                    title_elem = await card.query_selector('.list-title a')
                    title = await title_elem.inner_text() if title_elem else ''
                    title = title.strip()

                    author_elem = await card.query_selector('.list-author em')
                    author = await author_elem.inner_text() if author_elem else ''
                    author = author.strip()

                    detail_link_elem = await card.query_selector('.list-title a')
                    detail_url = ''
                    if detail_link_elem:
                        detail_url = await detail_link_elem.get_attribute('href') or ''

                    if title and detail_url:
                        book_list.append({
                            'title': title,
                            'author': author,
                            'detail_url': detail_url
                        })
                except Exception as e:
                    logger.error(f"❌ 提取第 {idx} 个卡片基本信息失败: {e}")

            logger.info(f"📋 提取到 {len(book_list)} 本书的基本信息")

            # 逐个访问详情页
            for idx, book_info in enumerate(book_list, 1):
                try:
                    logger.info(f"📖 [{idx}/{len(book_list)}] 正在获取《{book_info['title']}》详情...")

                    detail_info = await scrape_book_detail(page, book_info['detail_url'])

                    book = {
                        'title': book_info['title'],
                        'author': book_info['author'],
                        'description': detail_info['description'],
                        'cover': detail_info['cover'],
                        'download_link': detail_info['download_link'] or book_info['detail_url']
                    }
                    books.append(book)
                    logger.info(f"✅ [{idx}/{len(book_list)}] {book_info['title']} - {book_info['author']}")

                    # 避免请求过快
                    await page.wait_for_timeout(1000)

                except Exception as e:
                    logger.error(f"❌ 处理《{book_info['title']}》失败: {e}")
                    continue

        except Exception as e:
            logger.error(f"❌ 爬取失败: {e}")
        finally:
            await browser.close()

    return books


async def main():
    """主函数"""
    logger.info("=" * 60)
    logger.info("开始爬取苦瓜书盘 - 网络小说分类")
    logger.info("=" * 60)

    # 1. 爬取书籍
    books = await scrape_books()
    logger.info(f"\n📊 共爬取到 {len(books)} 本书")

    if not books:
        logger.warning("⚠️  没有爬取到任何书籍")
        return

    # 2. 获取飞书 token
    logger.info("\n🔑 获取飞书访问令牌...")
    token = get_tenant_access_token()

    # 3. 获取 sheet_id
    logger.info("📋 获取飞书 sheet ID...")
    sheet_id = get_sheet_id(token, "苦瓜书盘")
    logger.info(f"✅ Sheet ID: {sheet_id}")

    # 4. 写入飞书
    logger.info(f"\n📝 写入 {len(books)} 本书到飞书表格...")
    success = append_to_feishu(token, sheet_id, books)

    if success:
        logger.info("\n" + "=" * 60)
        logger.info("✅ 任务完成！")
        logger.info("=" * 60)
    else:
        logger.error("\n❌ 任务失败")


if __name__ == "__main__":
    asyncio.run(main())
