// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
  ],

  devtools: { enabled: true },
  
  // Content v2 設定
  content: {
    documentDriven: false,
    markdown: {
      remarkPlugins: {
        'remark-gfm': {},
      },
    },
  },
})
