/**
 * Layout 元件測試入口
 * 匯出所有測試輔助函數與共用 mock
 */
import { vi } from 'vitest'

// 共用的 Mock 設定
export const setupLayoutMocks = () => {
  // Mock useRuntimeConfig
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      siteName: 'Test Artia',
      siteSlogan: 'Test Slogan',
      theme: 'classic',
      heroTitle: 'Test Hero',
      heroDescription: 'Test Description',
      heroCtaPrimary: 'Get Started',
      heroCtaSecondary: 'Learn More',
      authorName: 'Test Author',
      authorBio: 'Test Bio',
      authorAvatar: '/avatar.png',
      copyright: '© 2024 Test',
      recentLimit: '6',
      featuredBookCodes: '',
    },
  }))

  // Mock useTheme
  vi.stubGlobal('useTheme', () => ({
    t: (component: string) => `artia-${component}-theme-classic`,
    tc: (component: string, extra?: string) => {
      const base = `artia-${component}-theme-classic`
      return extra ? `${base} ${extra}` : base
    },
  }))

  // Mock useI18n
  vi.stubGlobal('useI18n', () => ({
    t: (key: string) => key,
    locale: { value: 'zh-TW' },
  }))

  // Mock useLayout
  vi.stubGlobal('useLayout', () => ({
    isSlotEnabled: () => false,
    hasLeftSidebar: () => false,
    hasRightSidebar: () => false,
    getParsedSlotConfigs: () => [],
  }))

  // Mock useRoute
  vi.stubGlobal('useRoute', () => ({
    path: '/test',
    params: {},
    query: {},
  }))

  // Mock useRouter
  vi.stubGlobal('useRouter', () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }))

  // Mock useAsyncData
  vi.stubGlobal('useAsyncData', async (key: string, fn: () => Promise<any>) => ({
    data: { value: null },
    error: { value: null },
  }))

  // Mock queryContent
  vi.stubGlobal('queryContent', () => ({
    where: () => ({ only: () => ({ find: () => Promise.resolve([]), findOne: () => Promise.resolve(null) }) }),
    only: () => ({ find: () => Promise.resolve([]), findOne: () => Promise.resolve(null) }),
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    sort: () => ({ find: () => Promise.resolve([]) }),
    limit: () => ({ find: () => Promise.resolve([]) }),
  }))

  // Mock fetchContentNavigation
  vi.stubGlobal('fetchContentNavigation', () => Promise.resolve([]))

  // Mock useProtectedContent
  vi.stubGlobal('useProtectedContent', () => ({
    verifyPassword: vi.fn().mockResolvedValue({ success: false, error: '密碼錯誤' }),
  }))

  // Mock $fetch
  vi.stubGlobal('$fetch', async () => ({}))
}

// 共用的 stubs
export const commonStubs = {
  NuxtLink: {
    template: '<a :href="to" :class="$attrs.class" :style="$attrs.style"><slot /></a>',
    props: ['to'],
  },
  ContentRenderer: {
    template: '<div class="content-renderer"><slot name="empty" /></div>',
    props: ['value'],
  },
  // 用於 LayoutSlot 測試的子元件 stubs
  LayoutSidebarAuthor: { template: '<div class="stub-author">Author</div>' },
  LayoutSidebarNav: { template: '<div class="stub-nav">Nav</div>', props: ['rootPath', 'title'] },
  LayoutSidebarBookMenu: { template: '<div class="stub-book-menu">BookMenu</div>', props: ['title'] },
  LayoutTableOfContents: { template: '<div class="stub-toc">TOC</div>' },
  LayoutHistoryTimeline: { template: '<div class="stub-history">History</div>' },
  LayoutHeroSection: { template: '<div class="stub-hero">Hero</div>' },
  LayoutFeaturedBooks: { template: '<div class="stub-featured">Featured</div>' },
  LayoutRecentContent: { template: '<div class="stub-recent">Recent</div>' },
  LayoutPageContentPasswordPrompt: { template: '<div class="stub-password">Password</div>' },
  LayoutPageContentNavigation: { template: '<div class="stub-pagination">Pagination</div>' },
}

// 建立 Mock Navigation Item
export const createMockNavItem = (overrides = {}) => ({
  _path: '/content/test',
  title: 'Test Item',
  type: 'page',
  sortAnchor: [1, 0],
  children: undefined,
  ...overrides,
})

// 建立 Mock Content Page
export const createMockPage = (overrides = {}) => ({
  _path: '/content/test',
  _dir: '/content',
  title: 'Test Page',
  description: 'Test description',
  type: 'page',
  modifyTime: new Date().toISOString(),
  sortAnchor: [1, 0],
  ...overrides,
})

// 建立 Mock History Record
export const createMockHistoryRecord = (overrides = {}) => ({
  name: 'Test Author',
  recordTime: new Date().toISOString(),
  commit: 'Test commit message',
  ...overrides,
})
