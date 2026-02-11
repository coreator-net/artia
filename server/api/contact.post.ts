/**
 * 聯絡表單 API 端點
 * 使用 nuxt-mail 發送電子郵件
 */
import { defineEventHandler, readBody, createError} from 'h3'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// 驗證表單資料
function validateFormData(data: ContactFormData): string | null {
  if (!data.name?.trim()) {
    return 'Name is required'
  }
  if (!data.email?.trim()) {
    return 'Email is required'
  }
  // 簡單的 email 驗證
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return 'Invalid email format'
  }
  if (!data.subject?.trim()) {
    return 'Subject is required'
  }
  if (!data.message?.trim()) {
    return 'Message is required'
  }
  return null
}

export default defineEventHandler(async (event) => {
  // 只接受 POST 請求
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }

  const config = useRuntimeConfig()
  
  // 檢查是否啟用聯絡表單
  if (config.contactEnabled !== 'true') {
    return {
      success: false,
      error: 'Contact form is not enabled',
    }
  }

  // 讀取並驗證表單資料
  const body = await readBody<ContactFormData>(event)
  const validationError = validateFormData(body)
  if (validationError) {
    return {
      success: false,
      error: validationError,
    }
  }

  try {
    // 組合郵件主旨
    const subjectPrefix = config.mailSubjectPrefix || '[Contact]'
    const mailSubject = `${subjectPrefix} ${body.subject}`
    
    // 組合寄件者資訊
    const fromName = config.mailFromName || 'Contact Form'
    const fromEmail = config.mailFromEmail || ''
    const from = fromEmail ? `"${fromName}" <${fromEmail}>` : undefined

    // 組合郵件內容
    const mailBody = `
新的聯絡表單訊息

寄件者資訊：
- 姓名：${body.name}
- 電子郵件：${body.email}

主旨：${body.subject}

訊息內容：
${body.message}

---
此郵件由 Artia 聯絡表單自動發送
    `.trim()

    // 使用 nuxt-mail 提供的 /mail/send 端點發送郵件
    await $fetch('/mail/send', {
      method: 'POST',
      body: {
        from,
        replyTo: body.email,
        subject: mailSubject,
        text: mailBody,
      },
    })

    return {
      success: true,
      message: 'Message sent successfully',
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      error: 'Failed to send message',
    }
  }
})
