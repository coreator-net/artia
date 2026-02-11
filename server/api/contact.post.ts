/**
 * 聯絡表單 API 端點
 * 處理聯絡表單提交並發送電子郵件
 */
import { defineEventHandler, readBody, createError } from 'h3'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  fromName: string
  fromEmail: string
  toEmail: string
  subjectPrefix: string
}

// 取得 SMTP 設定
function getSmtpConfig(): SmtpConfig | null {
  const config = useRuntimeConfig()
  
  // 檢查是否啟用聯絡表單
  if (config.contactEnabled !== 'true') {
    return null
  }
  
  return {
    host: config.smtpHost || 'smtp.gmail.com',
    port: parseInt(config.smtpPort || '587', 10),
    secure: config.smtpSecure === 'true',
    user: config.smtpUser || '',
    pass: config.smtpPass || '',
    fromName: config.smtpFromName || 'Contact Form',
    fromEmail: config.smtpFromEmail || config.smtpUser || '',
    toEmail: config.smtpToEmail || config.smtpUser || '',
    subjectPrefix: config.smtpSubjectPrefix || '[Contact]',
  }
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

  // 取得 SMTP 設定
  const smtpConfig = getSmtpConfig()
  if (!smtpConfig) {
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
    // 動態載入 nodemailer（如果已安裝）
    let nodemailer: any
    try {
      // @ts-expect-error nodemailer 是可選依賴
      nodemailer = await import('nodemailer')
    } catch {
      // 如果 nodemailer 未安裝，返回模擬成功（開發模式）
      console.log('📧 Contact form submission (nodemailer not installed):')
      console.log('  From:', body.name, `<${body.email}>`)
      console.log('  Subject:', body.subject)
      console.log('  Message:', body.message)
      
      return {
        success: true,
        message: 'Message received (development mode)',
      }
    }

    // 建立 SMTP 傳輸
    const transporter = nodemailer.default.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    })

    // 組合郵件內容
    const mailSubject = smtpConfig.subjectPrefix
      ? `${smtpConfig.subjectPrefix} ${body.subject}`
      : body.subject

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

    // 發送郵件
    await transporter.sendMail({
      from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
      to: smtpConfig.toEmail,
      replyTo: body.email,
      subject: mailSubject,
      text: mailBody,
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
