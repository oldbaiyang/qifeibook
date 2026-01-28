<skill>
  <name>batch-import-books</name>
  <description>标准化批量导入书籍流程：从飞书抓取、处理数据、写入网站并同步状态</description>
  <instructions>
    当用户要求"批量导入书籍"、"同步飞书"或"更新书库"时，请严格按照以下步骤顺序执行。如果任何一步失败，请立即停止并报告错误。

    ### 阶段一：数据获取与处理
    1. **抓取数据**
       运行：`python3 scripts/import_step1_fetch.py`
       *   作用：从飞书读取未处理书籍（状态!=1）。
       *   检查：如果输出 "共筛选出 0 本书"，则流程结束，无需后续操作。

    2. **数据增补**
       运行：`python3 scripts/import_step2_enrich.py`
       *   作用：补充作者、简介等元数据。

    ### 阶段二：写入与修复
    3. **写入数据库**
       运行：`python3 scripts/import_step3_merge.py`
       *   作用：将新书追加到 `src/data/mockData.js`。

    4. **修复封面链接**
       运行：`python3 scripts/import_step4_fix_covers.py`
       *   作用：重新获取飞书中完整的封面 URL（解决截断问题）。

    ### 阶段三：验证与收尾
    5. **语法检查 (关键)**
       运行：`python3 scripts/import_step6_verify.py`
       *   作用：检查 mockData.js 的括号匹配情况。
       *   **注意**：如果此步报错（如 "Mismatched braces"），**绝对不要**继续执行，必须提示用户手动检查或回滚。

    6. **更新 Sitemap**
       运行：`python3 scripts/import_step5_sitemap.py`
       *   作用：更新 SEO 索引。

    7. **同步飞书状态**
       运行：`python3 scripts/import_step7_sync_status.py`
       *   作用：将飞书文档中对应书籍的状态标记为 "1"。

    ### 阶段四：提交
    8. **Git 提交**
       询问用户是否提交更改。建议的 Commit Message：
       `feat: batch import [数量] books from Feishu`

    ### 清理
    执行完成后，可以清理中间文件：
    `rm filtered_books.json enriched_books.json`
  </instructions>
</skill>
