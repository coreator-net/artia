# Nuxt Content Frontmatter 預設欄位

## 路徑/索引相關

| 欄位         | 類型      | 說明                                                         |
| ------------ | --------- | ------------------------------------------------------------ |
| `_path`      | `string`  | 強制指定內容的 URL 路徑，例如 `/blog/my-article`             |
| `_dir`       | `string`  | 指定所屬目錄                                                 |
| `_draft`     | `boolean` | 設為 `true` 則該文件為草稿，不會在 production 顯示           |
| `_partial`   | `boolean` | 設為 `true` 則該文件為片段，不會被索引（可用於被引用的內容） |
| `_locale`    | `string`  | 指定語言/區域，例如 `en`、`zh-tw`                            |
| `_id`        | `string`  | 內容的唯一識別碼（自動生成）                                 |
| `_source`    | `string`  | 內容來源（自動生成）                                         |
| `_file`      | `string`  | 檔案相對路徑（自動生成）                                     |
| `_stem`      | `string`  | 檔案名稱（不含副檔名），常用於排序                           |
| `_extension` | `string`  | 檔案副檔名（自動生成）                                       |
| `_type`      | `string`  | 內容類型，如 `markdown`（自動生成）                          |

## 內容相關

| 欄位          | 類型     | 說明                         |
| ------------- | -------- | ---------------------------- |
| `title`       | `string` | 頁面標題                     |
| `description` | `string` | 頁面描述（用於 SEO 和摘要）  |
| `body`        | `object` | 解析後的內容 AST（自動生成） |

## SEO / Head 相關

| 欄位   | 類型     | 說明                                             |
| ------ | -------- | ------------------------------------------------ |
| `head` | `object` | 自訂 `<head>` 內容，可設定 meta、script、link 等 |

### head 範例

```yaml
head:
    meta:
        - name: keywords
          content: nuxt, content, 中文
        - name: author
          content: Your Name
    script:
        - src: https://example.com/script.js
    link:
        - rel: canonical
          href: https://example.com/page
```

## 導航相關

| 欄位         | 類型                | 說明                                          |
| ------------ | ------------------- | --------------------------------------------- |
| `navigation` | `boolean \| object` | 控制導航顯示，設為 `false` 隱藏，或用物件自訂 |

### navigation 範例

```yaml
# 隱藏此頁面在導航中
navigation: false

# 或自訂導航顯示
navigation:
  title: 自訂導航標題
  icon: home
```

## 完整範例

```yaml
---
title: 我的文章標題
description: 這是一篇關於 Nuxt Content 的文章
_path: /blog/my-article
_draft: false
_locale: zh-tw

author: 作者名
date: 2026-01-22
tags: [nuxt, vue, content]

navigation:
    title: 自訂導航標題

head:
    meta:
        - name: keywords
          content: nuxt, content, vue
        - property: og:title
          content: 我的文章標題
        - property: og:description
          content: 這是一篇關於 Nuxt Content 的文章
---
```

## 注意事項

1. **中文路徑**：Nuxt Content 預設會移除路徑中的中文，需使用 `_path` 強制指定
2. **底線開頭**：以 `_` 開頭的欄位是系統保留欄位
3. **自訂欄位**：你可以自由新增任何自訂欄位，例如 `author`、`tags`、`date` 等
4. **排序**：可使用 `_stem` 或檔案名稱前綴數字來控制排序

## 參考資料

- [Nuxt Content 官方文件](https://content.nuxt.com/)
- [Frontmatter 文件](https://content.nuxt.com/usage/markdown#frontmatter)
