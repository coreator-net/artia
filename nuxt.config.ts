// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-30',

  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
  ],

  // 引入自訂 CSS（主題系統）
  css: [
    '~/assets/css/main.css',      // Classic 主題（預設）
    '~/assets/css/theme-dark.css', // Dark 主題
  ],

  devtools: { enabled: true },
  
  // Content v2 設定
  content: {
    documentDriven: false,
  },

  // 應用程式設定
  app: {
    head: {
      htmlAttrs: {
        lang: process.env.NUXT_PUBLIC_SITE_LOCALE || 'zh-TW',
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
  runtimeConfig: {
    public: {
      // 主題設定
      theme: 'classic',
      
      // 網站基本資訊
      siteName: 'Artia',
      siteTitle: '歡迎來到 Artia',
      siteDescription: '這裡是創作者的天地，每一個故事都值得被閱讀，每一個創意都值得被發現。',
      siteSlogan: '一個為創作者打造的平台。',
      siteUrl: '',
      siteLocale: 'zh-TW',
      
      // CTA 按鈕
      ctaPrimary: '探索作品',
      ctaSecondary: '了解更多',
      sectionFeatured: '精選作品',
      sectionRecent: '最新內容',
      copyright: '© 2026 Artia. All rights reserved.',
      
      // 作者介紹
      authorName: '梦',
      authorBio: '專注於奇幻與都市傳說的創作者，用文字織出無限想像。',
      authorAvatar: '',
      
      // Google 服務
      gaId: '',
      gscVerification: '',
      adsenseId: '',
      adsenseAutoAds: 'false',
      gtmId: '',
      
      // SEO
      ogImage: '',
      twitterCard: 'summary_large_image',
      
      // 社群媒體
      socialTwitter: '',
      socialFacebook: '',
      socialInstagram: '',
      socialGithub: '',
      socialDiscord: '',
      socialYoutube: '',
      
      // 評論系統
      commentsEnabled: 'false',
      commentsProvider: '',
      giscusRepo: '',
      giscusRepoId: '',
      giscusCategory: '',
      giscusCategoryId: '',
      disqusShortname: '',
    },
  },
})
