/**
 * Server plugin 預處理 Markdown 內容
 * 完全複製 markdown-it 的 article_plugin 邏輯
 * 所見即所得：換行、空白完整保留
 */
export default defineNitroPlugin((nitroApp) => {
  // @ts-ignore
  nitroApp.hooks.hook('content:file:beforeParse', (file: any) => {
    if (!file._id?.endsWith('.md')) return
    
    let content = file.body || ''
    
    // 排除 frontmatter
    const frontmatterMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : ''
    let body = frontmatterMatch ? content.slice(frontmatter.length) : content
    
    // 1. 行首空白保留：半形/全形空白轉為 HTML 實體
    body = body.replace(/^([ \u3000]+)/gm, (match) =>
      match.replace(/ /g, '&nbsp;').replace(/\u3000/g, '&#12288;')
    )
    
    // 2. 換行保留：所有換行替換為 <br />
    body = body.replace(/\n/g, '<br />')
    
    // 3. 行內連續空白保留：兩個以上半形空白改成 &nbsp;
    body = body.replace(/ {2,}/g, (match) =>
      match.replace(/ /g, '&nbsp;')
    )
    
    // 4. Tab 保留：\t 轉成四個 &nbsp;
    body = body.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    
    file.body = frontmatter + body
  })
})
