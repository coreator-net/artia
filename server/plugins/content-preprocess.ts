/**
 * Server plugin 預處理 Markdown 內容
 * 完全複製 markdown-it 的 article_plugin 邏輯
 * 所見即所得：換行、空白完整保留
 * 但排除程式碼區塊
 */

interface ContentFile {
  _id?: string
  body?: string
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
    
    // 保護程式碼區塊：匹配 ```xxx...```
    const codeBlocks: string[] = []
    
    // 匹配完整的程式碼區塊
    body = body.replace(/```[\s\S]*?```/g, (match: string) => {
      codeBlocks.push(match)
      return `\n<<<CODEBLOCK_${codeBlocks.length - 1}>>>\n`
    })
    
    // 1. 行首空白保留：半形/全形空白轉為 HTML 實體
    body = body.replace(/^([ \u3000]+)/gm, (match: string) =>
      match.replace(/ /g, '&nbsp;').replace(/\u3000/g, '&#12288;')
    )
    
    // 2. 換行保留：所有換行替換為 <br />
    body = body.replace(/\n/g, '<br />')
    
    // 3. 行內連續空白保留：兩個以上半形空白改成 &nbsp;
    body = body.replace(/ {2,}/g, (match: string) =>
      match.replace(/ /g, '&nbsp;')
    )
    
    // 4. Tab 保留：\t 轉成四個 &nbsp;
    body = body.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    
    // 還原程式碼區塊（移除周圍的 <br />，保持原始換行）
    body = body.replace(/<br \/><<<CODEBLOCK_(\d+)>>><br \/>/g, (_: string, index: string) => {
      return '\n' + codeBlocks[parseInt(index)] + '\n'
    })
    
    // 如果上面沒匹配到（邊界情況），再試一次
    body = body.replace(/<<<CODEBLOCK_(\d+)>>>/g, (_: string, index: string) => {
      return '\n' + codeBlocks[parseInt(index)] + '\n'
    })
    
    file.body = frontmatter + body
  })
})
