// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
  ],

  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  // Content v2 設定
  content: {
    documentDriven: false,
  },
})
