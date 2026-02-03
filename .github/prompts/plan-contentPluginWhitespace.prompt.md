## Plan: 修復並啟用 Content Plugin（含多空行保留）

使用預處理階段處理換行與多空行。Nuxt Content v2 不支援 `defineContentPlugin`，所以只使用 `server/plugins/content-preprocess.ts`。

### Steps

1. **修改預處理**：改寫 `server/plugins/content-preprocess.ts`
   - 判斷 Markdown 語法行（標題、列表、引用等）：保持原樣
   - 非語法行（內文）：行尾加 `  `（兩個空格 = hard break）保留單一換行
   - 空行處理：延遲處理，根據「下一個非空行」類型決定
   - 保留程式碼區塊排除邏輯

2. **刪除 whitespace.ts**：`content/plugins/whitespace.ts` 使用的是 v3 API，在 v2 中不會被載入，可以刪除

3. **測試驗證**：確認 Markdown 語法正常解析，內文空白與多空行保留

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
```

#### 空行處理邏輯（延遲處理）

```typescript
// 處理每行
// - 空行：累計 emptyLineCount，不立即輸出
// - 非空行：先處理累積的空行，再處理當前行

// 當遇到非空行時，根據「當前行」類型決定如何處理累積的空行：
// - 當前行是內文行 → 用 <br> 保留所有空行（包含單一空行）
// - 當前行是語法行 → 只需段落分隔（不加 <br>）

// 這不是 peek，而是「延遲處理」：
// 累積空行 → 等到遇到非空行 → 看非空行類型決定輸出
```

### Further Considerations

1. **程式碼區塊**：在預處理階段先保護、後還原，確保程式碼區塊內容不被修改。

2. **Frontmatter**：在預處理階段排除 frontmatter，只處理正文內容。

3. **Nuxt Content 版本**：目前使用 v2（`^2.13.0`），`defineContentPlugin` 是 v3 API。若升級到 v3，可恢復使用 `content/plugins/` 目錄機制。
