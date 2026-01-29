// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
  ],

  devtools: { enabled: true },
  
  // Content v2 設定
  content: {
    documentDriven: false,
  },

  // 環境變數配置
  runtimeConfig: {
    public: {
      siteName: 'Artia',
      siteTitle: '歡迎來到 Artia',
      siteDescription: '這裡是創作者的天地，每一個故事都值得被閱讀，每一個創意都值得被發現。',
      siteSlogan: '一個為創作者打造的平台。',
      ctaPrimary: '探索作品',
      ctaSecondary: '了解更多',
      sectionFeatured: '精選作品',
      sectionRecent: '最新內容',
      copyright: '© 2026 Artia. All rights reserved.',
      // 作者介紹
      authorName: '梦',
      authorBio: '專注於奇幻與都市傳說的創作者，用文字織出無限想像。',
      authorAvatar: '',
    },
  },
})
