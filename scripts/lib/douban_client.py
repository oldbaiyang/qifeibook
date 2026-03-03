#!/usr/bin/env python3
"""
豆瓣请求客户端 — 统一的反爬虫策略

功能：
- 随机 User-Agent 轮换
- 随机延迟（带抖动）
- 指数退避重试（遇到 403/418/429 自动等待）
- 可选代理支持
- 统一的请求头管理

用法：
    from lib.douban_client import DoubanClient

    client = DoubanClient()
    resp = client.get("https://book.douban.com/subject/1234567/")
    if resp:
        html = resp.text
"""

import time
import random
import requests
from typing import Optional, Dict, Any


# 多个 User-Agent 轮换，降低指纹识别风险
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]

# 需要重试的 HTTP 状态码
RETRY_STATUS_CODES = {403, 418, 429, 500, 502, 503}


class DoubanClient:
    """豆瓣请求客户端，内置反爬虫策略"""

    def __init__(
        self,
        delay: tuple = (2.0, 5.0),
        max_retries: int = 3,
        timeout: int = 15,
        proxy: str = None,
    ):
        """
        Args:
            delay: 请求间隔范围 (最小秒数, 最大秒数)
            max_retries: 最大重试次数
            timeout: 请求超时秒数
            proxy: 代理地址，如 "http://127.0.0.1:7890"
        """
        self.delay = delay
        self.max_retries = max_retries
        self.timeout = timeout
        self.session = requests.Session()

        if proxy:
            self.session.proxies = {"http": proxy, "https": proxy}

        self._request_count = 0
        self._fail_count = 0

    def _get_headers(self, referer: str = None) -> Dict[str, str]:
        """生成随机请求头"""
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Connection": "keep-alive",
        }
        if referer:
            headers["Referer"] = referer
        return headers

    def _smart_delay(self):
        """带随机抖动的延迟"""
        base = random.uniform(self.delay[0], self.delay[1])
        # 连续失败越多，延迟越久
        backoff = min(self._fail_count * 2, 30)
        total = base + backoff
        if total > 0:
            time.sleep(total)

    def get(
        self,
        url: str,
        referer: str = "https://book.douban.com/",
        skip_delay: bool = False,
        **kwargs,
    ) -> Optional[requests.Response]:
        """
        发送 GET 请求，自动处理反爬虫

        Args:
            url: 请求 URL
            referer: Referer 头，默认豆瓣图书
            skip_delay: 跳过请求前延迟（首次请求时可用）
            **kwargs: 传递给 requests.get 的额外参数

        Returns:
            Response 对象，失败返回 None
        """
        if not skip_delay and self._request_count > 0:
            self._smart_delay()

        self._request_count += 1

        for attempt in range(1, self.max_retries + 1):
            try:
                headers = self._get_headers(referer)
                resp = self.session.get(
                    url, headers=headers, timeout=self.timeout, **kwargs
                )

                if resp.status_code == 200:
                    self._fail_count = 0
                    return resp

                if resp.status_code in RETRY_STATUS_CODES:
                    self._fail_count += 1
                    wait = (2 ** attempt) + random.uniform(1, 3)
                    print(f"  [反爬] HTTP {resp.status_code}，等待 {wait:.1f}s 后重试 ({attempt}/{self.max_retries})")
                    time.sleep(wait)
                    continue

                # 其他状态码不重试
                print(f"  [请求] HTTP {resp.status_code}: {url}")
                return resp

            except requests.exceptions.Timeout:
                print(f"  [超时] {url} (第 {attempt} 次)")
                if attempt < self.max_retries:
                    time.sleep(2 ** attempt)
                    continue
            except requests.exceptions.ConnectionError as e:
                print(f"  [连接错误] {e}")
                if attempt < self.max_retries:
                    time.sleep(2 ** attempt)
                    continue
            except Exception as e:
                print(f"  [异常] {e}")
                return None

        print(f"  [失败] 已达最大重试次数: {url}")
        return None

    def download_image(
        self,
        url: str,
        save_path: str,
        referer: str = "https://book.douban.com/",
    ) -> bool:
        """
        下载图片文件

        Args:
            url: 图片 URL
            save_path: 保存路径
            referer: Referer 头

        Returns:
            是否成功
        """
        resp = self.get(url, referer=referer)
        if resp and resp.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(resp.content)
            return True
        return False

    @property
    def stats(self) -> str:
        """返回请求统计信息"""
        return f"请求 {self._request_count} 次, 当前连续失败 {self._fail_count} 次"
