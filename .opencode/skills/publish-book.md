<skill>
  <name>publish-book</name>
  <description>发布新书到 qifeibook 书库</description>
  <instructions>
    当用户要求发布或添加新书时，请按照以下步骤操作：

    1. **收集信息**：
       向用户询问以下书籍信息。如果用户在请求中已经提供，则直接使用；否则请用户补充。
       - **标题 (title)**：*必填*
       - **作者 (author)**：非必填，默认为 "未知"
       - **封面图片链接 (cover)**：非必填，默认为空
       - **描述 (description)**：非必填，默认为标题
       - **出版年份 (year)**：非必填，默认为 "2024"
       - **分类 (category)**：非必填，默认为 "小说文学"（可选值：小说文学, 历史传记, 人文社科, 励志成功, 经济管理, 学习教育, 生活时尚, 英文原版）
       - **夸克网盘链接 (quark_url)**：非必填
       - **百度网盘链接 (baidu_url)**：非必填
       - **百度提取码 (baidu_code)**：非必填

    2. **创建数据文件**：
       确保 `temp/` 目录存在。
       将收集到的信息整理为一个 JSON 对象，并写入临时文件 `temp/book_to_publish.json`。
       
       JSON 内容示例：
       ```json
       {
         "title": "书名",
         "author": "作者名",
         "authorDetail": "作者详情",
         "year": "2024",
         "cover": "https://example.com/cover.jpg",
         "description": "书籍简介...",
         "category": "小说文学",
         "quark_url": "https://pan.quark.cn/s/...",
         "baidu_url": "https://pan.baidu.com/s/...",
         "baidu_code": "0000"
       }
       ```

    3. **执行发布脚本**：
       使用 `bash` 工具运行以下命令：
       ```bash
       python3 scripts/publish_single_book.py temp/book_to_publish.json
       ```

    4. **验证与反馈**：
       - 观察脚本输出。如果包含 "✅ 成功发布书籍"，则说明成功。
       - 提取脚本输出中的新书 ID。
       - 删除临时文件：`rm temp/book_to_publish.json`
       - 回复用户，告知书籍已发布成功，并提供书籍 ID。

    **错误处理**：
    - 如果脚本报错，请将错误信息反馈给用户，并保留临时文件以便调试（除非用户要求删除）。
  </instructions>
</skill>
