/**
 * Server plugin 預處理 Markdown 內容
 * 使用 @coreator/remark-wysiwyg-breaks 處理 WYSIWYG 換行
 */
import { preprocessMarkdown } from '@coreator/remark-wysiwyg-breaks'

interface ContentFile {
  _id?: string
  body?: string
}

export default defineNitroPlugin((nitroApp) => {
  // @ts-ignore - Nuxt Content v2 hook
  nitroApp.hooks.hook('content:file:beforeParse', (file: ContentFile) => {
    if (!file._id?.endsWith('.md')) return
    
    file.body = preprocessMarkdown(file.body || '', {
      preserveFrontmatter: true
    })
  })
})
