/**
 * Server plugin 預處理 Markdown 內容
 * 1. 非 Markdown 語法行：行尾加兩個空格（hard break）
 * 2. 連續空行：直接產生多個 <br> 標籤
 */

interface ContentFile {
  _id?: string
  body?: string
}

// 判斷是否為 Markdown 語法行
function isMdSyntaxLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false // 空行不是語法行
  
  // 標題
  if (/^#{1,6}\s/.test(trimmed)) return true
  // 無序列表
  if (/^[\*\-\+]\s/.test(trimmed)) return true
  // 有序列表
  if (/^\d+\.\s/.test(trimmed)) return true
  // 引用
  if (/^>\s?/.test(trimmed)) return true
  // 表格分隔
  if (/^\|/.test(trimmed)) return true
  // 水平線
  if (/^(---|\*\*\*|___)/.test(trimmed)) return true
  // 程式碼區塊開始/結束
  if (/^```/.test(trimmed)) return true
  
  return false
}

export default defineNitroPlugin((nitroApp) => {
  // @ts-ignore - Nuxt Content v2 hook
  nitroApp.hooks.hook('content:file:beforeParse', (file: ContentFile) => {
    if (!file._id?.endsWith('.md')) return
    
    let content = file.body || ''
    
    // 排除 frontmatter
    const frontmatterMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : ''
    let body = frontmatterMatch ? content.slice(frontmatter.length) : content
    
    // 保護程式碼區塊
    const codeBlocks: string[] = []
    body = body.replace(/```[\s\S]*?```/g, (match: string) => {
      codeBlocks.push(match)
      return `<<<CODEBLOCK_${codeBlocks.length - 1}>>>`
    })
    
    // 處理每一行
    const lines = body.split('\n')
    const result: string[] = []
    let emptyLineCount = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // 空行：累計數量
      if (line.trim() === '') {
        emptyLineCount++
        continue
      }
      
      // 非空行：先處理累積的空行
      if (emptyLineCount > 0) {
        const isCurrentContentLine = !isMdSyntaxLine(line) && !line.includes('<<<CODEBLOCK_')
        
        if (isCurrentContentLine) {
          // 空行後面是內文行：用 <br> 保留所有空行
          const brs = Array(emptyLineCount).fill('<br>').join('')
          result.push(brs)
        }
        // 空行後面是 Markdown 語法行：只需要段落分隔
        result.push('')
        emptyLineCount = 0
      }
      
      // 處理當前行
      if (isMdSyntaxLine(line) || line.includes('<<<CODEBLOCK_')) {
        // Markdown 語法行：保持原樣
        result.push(line)
      } else {
        // 內文行：行尾加兩個空格（hard break）
        result.push(line + '  ')
      }
    }
    
    // 處理結尾的空行
    if (emptyLineCount > 1) {
      const brs = Array(emptyLineCount).fill('<br>').join('')
      result.push(brs)
    }
    
    body = result.join('\n')
    
    // 還原程式碼區塊
    body = body.replace(/<<<CODEBLOCK_(\d+)>>>/g, (_: string, index: string) => {
      return codeBlocks[parseInt(index)]
    })
    
    file.body = frontmatter + body
  })
})
