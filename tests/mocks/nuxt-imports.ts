/**
 * Nuxt Auto-imports Mock
 * 模擬 Nuxt 的自動導入功能
 */
import { ref, computed, reactive, watch, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'

// Re-export Vue functions
export { ref, computed, reactive, watch, watchEffect, onMounted, onUnmounted, nextTick }

// Mock useRuntimeConfig
export const useRuntimeConfig = () => ({
  public: {
    siteName: 'Artia',
    siteSlogan: 'A platform for creators',
    theme: 'classic',
    heroTitle: 'Welcome',
    heroDescription: 'Description',
    heroCtaPrimary: 'Start',
    heroCtaSecondary: 'Learn More',
    authorName: 'Author',
    authorBio: 'Bio',
    authorAvatar: '/avatar.png',
    copyright: '© 2024',
    recentLimit: '6',
    featuredBookCodes: '',
  },
})

// Mock useTheme
export const useTheme = () => ({
  t: (component: string | string[], element?: string): string => {
    if (Array.isArray(component)) {
      return component.map(c => `artia-${c}-theme-classic`).join(' ')
    }
    if (element) {
      return `artia-${component}-${element}-theme-classic`
    }
    return `artia-${component}-theme-classic`
  },
  tc: (component: string, extraClasses?: string): string => {
    const themeClass = `artia-${component}-theme-classic`
    return extraClasses ? `${themeClass} ${extraClasses}` : themeClass
  },
  currentTheme: computed(() => 'classic'),
  themeName: computed(() => 'classic'),
})

// Mock useI18n
export const useI18n = () => ({
  t: (key: string, params?: Record<string, any>): string => {
    const translations: Record<string, string> = {
      'nav.home': '首頁',
      'nav.about': '關於',
      'sidebar.title': '內容清單',
      'sidebar.loading': '載入中或無資料',
      'sidebar.viewIntro': '查看介紹',
      'sidebar.bookMenu': '章節目錄',
      'page.loading': '載入中...',
      'page.notFound': '找不到頁面',
      'page.prev': '上一頁',
      'page.next': '下一頁',
      'content.clickForMore': '點擊查看更多內容...',
      'content.loadMore': '載入更多',
      'section.featured': '精選作品',
      'section.recent': '最新內容',
      'sort.newest': '最新優先',
      'sort.oldest': '最舊優先',
      'search.placeholder': '搜尋內容...',
      'search.noResults': '沒有找到相關內容',
      'search.results': '搜尋結果',
      'history.title': '歷史記錄',
      'history.empty': '沒有歷史記錄',
      'history.today': '今天',
      'history.yesterday': '昨天',
      'history.daysAgo': `${params?.count || 0} 天前`,
      'date.locale': 'zh-TW',
    }
    return translations[key] || key
  },
  locale: ref('zh-TW'),
})

// Mock useLayout
export const useLayout = () => ({
  isSlotEnabled: (page: string, position: string): boolean => false,
  hasLeftSidebar: (page: string): boolean => false,
  hasRightSidebar: (page: string): boolean => false,
  getParsedSlotConfigs: (page: string, position: string): any[] => [],
})

// Mock useRoute
export const useRoute = () => ({
  path: '/test-path',
  params: {},
  query: {},
})

// Mock useRouter
export const useRouter = () => ({
  push: (path: string) => Promise.resolve(),
  replace: (path: string) => Promise.resolve(),
})

// Mock useAsyncData
export const useAsyncData = async <T>(
  key: string,
  handler: () => Promise<T>
): Promise<{ data: { value: T | null }; error: { value: null } }> => {
  try {
    const result = await handler()
    return {
      data: { value: result },
      error: { value: null },
    }
  } catch (e) {
    return {
      data: { value: null },
      error: { value: null },
    }
  }
}

// Mock queryContent
export const queryContent = (path?: string) => ({
  where: (conditions: any) => queryContent(path),
  only: (fields: string[]) => queryContent(path),
  limit: (n: number) => queryContent(path),
  sort: (options: any) => queryContent(path),
  find: () => Promise.resolve([]),
  findOne: () => Promise.resolve(null),
})

// Mock fetchContentNavigation
export const fetchContentNavigation = () => Promise.resolve([])

// Mock NuxtLink component
export const NuxtLink = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

// Mock definePageMeta
export const definePageMeta = (meta: any) => meta

// Mock ContentRenderer
export const ContentRenderer = {
  name: 'ContentRenderer',
  props: ['value'],
  template: '<div class="content-renderer"><slot name="empty" /></div>',
}

// Mock $fetch
export const $fetch = async <T>(url: string): Promise<T> => {
  return {} as T
}
