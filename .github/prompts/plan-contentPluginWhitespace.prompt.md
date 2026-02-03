## Plan: 修復並啟用 Content Plugin（含多空行保留）

改用兩階段處理：預處理階段處理換行與多空行，AST 層處理段落內文空白。

### Steps

1. **修改預處理**：改寫 `server/plugins/content-preprocess.ts`
   - 判斷 Markdown 語法行（標題、列表、引用等）：保持原樣
   - 非語法行（內文）：行尾加 `  `（兩個空格 = hard break）保留單一換行
   - 連續空行（2 個以上）：直接產生對應數量的 `<br>` 標籤
   - 保留程式碼區塊排除邏輯

2. **配置 plugins**：修改 `nuxt.config.ts`
   ```typescript
   content: {
     documentDriven: false,
     plugins: ['~/content/plugins/whitespace.ts'],
   },
   ```

3. **簡化 whitespace.ts**：修改 `content/plugins/whitespace.ts`
   - 處理 `paragraph`、`blockquote`、`listItem` 中的文字節點
   - 行首空白轉 `\u00a0`（NBSP）
   - 連續空白轉 `\u00a0`（NBSP）
   - （多空行已在預處理階段直接轉成 `<br>` 標籤，無需 AST 層處理）

4. **測試驗證**：確認 Markdown 語法正常解析，內文空白與多空行保留

### Implementation Details

#### 預處理邏輯（content-preprocess.ts）

```typescript
// 判斷是否為 Markdown 語法行
function isMdSyntaxLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  if (/^#{1,6}\s/.test(trimmed)) return true      // 標題
  if (/^[\*\-\+]\s/.test(trimmed)) return true   // 無序列表
  if (/^\d+\.\s/.test(trimmed)) return true      // 有序列表
  if (/^>\s?/.test(trimmed)) return true          // 引用
  if (/^\|/.test(trimmed)) return true            // 表格
  if (/^(---|\*\*\*|___)/.test(trimmed)) return true // 水平線
  if (/^```/.test(trimmed)) return true           // 程式碼區塊
  return false
}

// 處理每行
// - 空行：累計數量
// - 非空行前有多個空行：產生 N 個 <br>
// - 語法行：保持原樣
// - 內文行：行尾加兩個空格
```

#### AST 層處理（whitespace.ts）

```typescript
// 處理文字節點：保留空白
visit(ctx.body, (node, _idx, parent) => {
  if (!targets.has(parent.type)) return
  if (node.type !== 'text') return
  
  // 行首空白轉 NBSP
  value = value.replace(/^([ \u3000]+)/, (m) => m.replace(/ /g, nbsp))
  // 連續空白轉 NBSP
  value = value.replace(/ {2,}/g, (m) => m.replace(/ /g, nbsp))
})
```

### Further Considerations

1. **程式碼區塊**：在預處理階段先保護、後還原，確保程式碼區塊內容不被修改。

2. **Frontmatter**：在預處理階段排除 frontmatter，只處理正文內容。

3. **效能**：預處理在 `content:file:beforeParse` hook 執行，AST 處理在 `content:parsed` hook 執行，兩者分工明確。
