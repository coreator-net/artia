/**
 * Vitest 全局 setup
 * 設置 Nuxt 自動導入的 mock
 */
import { vi } from 'vitest'
import { ref, computed, reactive, watch, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'

// 將 Vue 函數掛載到全局
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('reactive', reactive)
vi.stubGlobal('watch', watch)
vi.stubGlobal('watchEffect', watchEffect)
vi.stubGlobal('onMounted', onMounted)
vi.stubGlobal('onUnmounted', onUnmounted)
vi.stubGlobal('nextTick', nextTick)

// Mock useRuntimeConfig
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    appBaseUrl: 'http://localhost:3000',
    apiBaseUrl: 'http://localhost:3000/api',
  },
}))

// Mock useRoute
vi.stubGlobal('useRoute', () => ({
  path: '/test-page',
  params: {},
  query: {},
  hash: '',
  fullPath: '/test-page',
  matched: [],
  name: 'test',
  meta: {},
}))

// Mock useRouter
vi.stubGlobal('useRouter', () => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}))

// Mock useI18n
vi.stubGlobal('useI18n', () => ({
  t: (key: string, params?: Record<string, any>) => {
    const translations: Record<string, string> = {
      'common.loading': '載入中...',
      'common.submit': '提交',
      'common.cancel': '取消',
      'history.title': '歷史記錄',
      'history.empty': '沒有歷史記錄',
      'history.today': '今天',
      'history.yesterday': '昨天',
      'history.daysAgo': `${params?.count || 0} 天前`,
      'history.weeksAgo': `${params?.count || 0} 週前`,
      'history.monthsAgo': `${params?.count || 0} 個月前`,
      'history.yearsAgo': `${params?.count || 0} 年前`,
      'date.locale': 'zh-TW',
      'sidebar.viewIntro': '查看介紹',
      'password.title': '需要密碼',
      'password.hint': '此內容受密碼保護',
      'password.placeholder': '輸入密碼',
      'password.submit': '解鎖',
      'password.error': '密碼錯誤',
      'password.empty': '請輸入密碼',
    }
    return translations[key] || key
  },
  locale: ref('zh-TW'),
}))

// Mock useTheme
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
  tc: (component: string, extraClasses?: string) => 
    `artia-${component}-theme-classic ${extraClasses || ''}`.trim(),
}))

// Mock useLayout
vi.stubGlobal('useLayout', () => ({
  getParsedSlotConfigs: () => [],
}))

// Mock useAsyncData (同步版本)
vi.stubGlobal('useAsyncData', () => ({
  data: ref(null),
  pending: ref(false),
  error: ref(null),
  refresh: vi.fn(),
}))

// Mock queryContent
vi.stubGlobal('queryContent', () => ({
  findOne: () => Promise.resolve(null),
  find: () => Promise.resolve([]),
  where: () => ({
    findOne: () => Promise.resolve(null),
    find: () => Promise.resolve([]),
  }),
}))

// Mock fetchContentNavigation
vi.stubGlobal('fetchContentNavigation', () => Promise.resolve([]))

// Mock useProtectedContent
vi.stubGlobal('useProtectedContent', () => ({
  isProtected: ref(false),
  isAuthenticated: ref(false),
  verifyPassword: vi.fn().mockResolvedValue(true),
}))

// Mock NuxtLink
vi.stubGlobal('NuxtLink', {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
})

// Mock definePageMeta
vi.stubGlobal('definePageMeta', vi.fn())

// Mock useSeoMeta
vi.stubGlobal('useSeoMeta', vi.fn())
