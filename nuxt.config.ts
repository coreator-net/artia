// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-30',

  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    ['nuxt-mail', {
      message: {
        to: process.env.NUXT_MAIL_TO || '',
      },
      smtp: {
        host: process.env.NUXT_MAIL_SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.NUXT_MAIL_SMTP_PORT || '587', 10),
        auth: {
          user: process.env.NUXT_MAIL_SMTP_USER || '',
          pass: process.env.NUXT_MAIL_SMTP_PASS || '',
        },
      },
    }],
  ],

  // 引入自訂 CSS（主題系統）
  css: [
    '~/assets/css/main.css',         // Tailwind + 全域樣式
    '~/assets/css/theme-classic.css', // Classic 主題
    '~/assets/css/theme-dark.css',    // Dark 主題
  ],

  devtools: { enabled: true },
  
  // Content v2 設定
  content: {
    documentDriven: false,
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      }
    }
  },

  // i18n 多語系設定
  i18n: {
    locales: [
      { code: 'zh-TW', language: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: (process.env.NUXT_PUBLIC_DEFAULT_LOCALE || 'zh-TW') as 'zh-TW' | 'en',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: false,
  },

  // 應用程式設定
  app: {
    head: {
      htmlAttrs: {
        lang: process.env.NUXT_PUBLIC_DEFAULT_LOCALE || 'zh-TW',
      },
      title: process.env.NUXT_PUBLIC_SITE_NAME || 'Artia',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || '' },
        // Google Search Console 驗證
        ...(process.env.NUXT_PUBLIC_GSC_VERIFICATION 
          ? [{ name: 'google-site-verification', content: process.env.NUXT_PUBLIC_GSC_VERIFICATION }] 
          : []),
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: process.env.NUXT_PUBLIC_SITE_NAME || 'Artia' },
        { property: 'og:title', content: process.env.NUXT_PUBLIC_SITE_TITLE || '' },
        { property: 'og:description', content: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || '' },
        ...(process.env.NUXT_PUBLIC_OG_IMAGE 
          ? [{ property: 'og:image', content: process.env.NUXT_PUBLIC_OG_IMAGE }] 
          : []),
        ...(process.env.NUXT_PUBLIC_SITE_URL 
          ? [{ property: 'og:url', content: process.env.NUXT_PUBLIC_SITE_URL }] 
          : []),
        // Twitter Card
        { name: 'twitter:card', content: process.env.NUXT_PUBLIC_TWITTER_CARD || 'summary_large_image' },
        { name: 'twitter:title', content: process.env.NUXT_PUBLIC_SITE_TITLE || '' },
        { name: 'twitter:description', content: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || '' },
        ...(process.env.NUXT_PUBLIC_OG_IMAGE 
          ? [{ name: 'twitter:image', content: process.env.NUXT_PUBLIC_OG_IMAGE }] 
          : []),
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ...(process.env.NUXT_PUBLIC_SITE_URL 
          ? [{ rel: 'canonical', href: process.env.NUXT_PUBLIC_SITE_URL }] 
          : []),
      ],
      script: [
        // Google Analytics 4
        ...(process.env.NUXT_PUBLIC_GA_ID ? [
          { src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA_ID}`, async: true },
          { innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NUXT_PUBLIC_GA_ID}');` },
        ] : []),
        // Google Tag Manager
        ...(process.env.NUXT_PUBLIC_GTM_ID ? [
          { innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','${process.env.NUXT_PUBLIC_GTM_ID}');` },
        ] : []),
        // Google AdSense
        ...(process.env.NUXT_PUBLIC_ADSENSE_ID ? [
          { src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NUXT_PUBLIC_ADSENSE_ID}`, async: true, crossorigin: 'anonymous' },
        ] : []),
      ],
    },
  },

  // 環境變數配置
  // 預設值定義 - .env 中的 NUXT_PUBLIC_* 會自動覆蓋這些值
  runtimeConfig: {
    // 私有設定（僅伺服器端可用）
    contactEnabled: process.env.NUXT_CONTACT_ENABLED || 'false',
    mailFromName: process.env.NUXT_MAIL_FROM_NAME || 'Contact Form',
    mailFromEmail: process.env.NUXT_MAIL_FROM_EMAIL || '',
    mailSubjectPrefix: process.env.NUXT_MAIL_SUBJECT_PREFIX || '[Contact]',
    
    public: {
      // 全域設定
      theme: '',
      siteName: '',
      siteSlogan: '',
      siteUrl: '',
      defaultLocale: 'zh-TW',
      copyright: '',
      
      // 佈局系統
      layoutHomeTop: '',
      layoutHomeLeft: '',
      layoutHomeCenter: '',
      layoutHomeRight: '',
      layoutHomeBottom: '',
      layoutReadTop: '',
      layoutReadLeft: '',
      layoutReadCenter: '',
      layoutReadRight: '',
      layoutReadBottom: '',
      
      // 元件：Hero
      heroTitle: '',
      heroDescription: '',
      heroCtaPrimary: '',
      heroCtaSecondary: '',
      
      // 元件：Author
      authorName: '',
      authorBio: '',
      authorAvatar: '',
      
      // 元件：Featured
      sectionFeatured: '',
      featuredBookCodes: '',
      
      // 元件：Recent
      recentLimit: '',
      
      // 評論系統
      commentsEnabled: '',
      commentsProvider: '',
      disqusShortname: '',
      
      // SEO
      ogImage: '',
      twitterCard: '',
      
      // 社群媒體
      socialTwitter: '',
      socialFacebook: '',
      socialInstagram: '',
      socialGithub: '',
      socialDiscord: '',
      socialYoutube: '',
      
      // Google 服務
      gaId: '',
      gscVerification: '',
      adsenseId: '',
      adsenseAutoAds: '',
      gtmId: '',
    },
  },
})
