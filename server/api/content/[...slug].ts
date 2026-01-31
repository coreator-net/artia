/**
 * Server API Route - 驗證密碼並返回內容
 * 支援 SSR，保持 SEO 效果
 */
import { createHash } from 'crypto'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  // 處理路徑：如果沒有 slug 或是空陣列，使用 /index
  let path = '/'
  if (slug && Array.isArray(slug) && slug.length > 0) {
    // 解碼 URL 編碼的路徑（處理中文和特殊字元）
    path = '/' + slug.map(s => decodeURIComponent(s)).join('/')
  } else if (slug && !Array.isArray(slug)) {
    path = '/' + decodeURIComponent(slug)
  } else {
    path = '/index'
  }
  
  // 獲取內容 - 先嘗試用 _path 欄位精確查詢
  let content = await serverQueryContent(event)
    .where({ _path: path })
    .findOne()
    .catch(() => null)
  
  // 如果找不到，嘗試用原本的檔案路徑查詢方式
  if (!content) {
    content = await serverQueryContent(event, path)
      .findOne()
      .catch(() => null)
  }
  
  // 如果還是找不到，嘗試搜尋 _id 欄位（UUID 可能是 _id）
  if (!content) {
    const pathParts = path.split('/')
    const possibleId = pathParts[pathParts.length - 1]
    content = await serverQueryContent(event)
      .where({ _id: possibleId })
      .findOne()
      .catch(() => null)
  }
  
  if (!content) {
    throw createError({
      statusCode: 404,
      message: 'Content not found'
    })
  }
  
  // 如果沒有設定密碼保護，直接返回
  if (!content.passwordHash) {
    return content
  }
  
  // 檢查是否有提供密碼
  const query = getQuery(event)
  const providedPassword = query.password as string | undefined
  
  // 如果沒有提供密碼，返回受限內容（只有標題和提示）
  if (!providedPassword) {
    return {
      ...content,
      body: null, // 不返回內容
      _protected: true,
      _passwordRequired: true
    }
  }
  
  // 驗證密碼
  const passwordHash = createHash('sha256')
    .update(providedPassword)
    .digest('hex')
  
  if (passwordHash !== content.passwordHash) {
    throw createError({
      statusCode: 401,
      message: 'Invalid password'
    })
  }
  
  // 密碼正確，返回完整內容
  return {
    ...content,
    _protected: true,
    _authenticated: true
  }
})