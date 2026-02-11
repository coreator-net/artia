/**
 * 測試輔助函數
 */
import { mount, VueWrapper } from '@vue/test-utils'
import type { MountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'

// 全域 stubs 設定
const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to" class="nuxt-link"><slot /></a>',
  },
  ContentRenderer: {
    name: 'ContentRenderer',
    props: ['value'],
    template: '<div class="content-renderer"><slot name="empty" /></div>',
  },
}

// Mock composables
const mockComposables = {
  useRuntimeConfig: () => ({
    public: {
      siteName: 'Test Site',
      siteSlogan: 'Test Slogan',
      theme: 'classic',
      heroTitle: 'Hero Title',
      heroDescription: 'Hero Description',
      heroCtaPrimary: 'Primary CTA',
      heroCtaSecondary: 'Secondary CTA',
      authorName: 'Test Author',
      authorBio: 'Test Bio',
      authorAvatar: '/test-avatar.png',
      copyright: '© 2024 Test',
      recentLimit: '6',
    },
  }),
  useTheme: () => ({
    t: (component: string | string[], element?: string): string => {
      if (Array.isArray(component)) {
        return component.map(c => `artia-${c}-theme-classic`).join(' ')
      }
      if (element) {
        return `artia-${component}-${element}-theme-classic`
      }
      return `artia-${component}-theme-classic`
    },
  }),
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'zh-TW' },
  }),
  useLayout: () => ({
    isSlotEnabled: () => false,
    hasLeftSidebar: () => false,
    hasRightSidebar: () => false,
    getParsedSlotConfigs: () => [],
  }),
  useRoute: () => ({
    path: '/test',
    params: {},
    query: {},
  }),
  useRouter: () => ({
    push: () => Promise.resolve(),
  }),
  useAsyncData: async (key: string, fn: () => Promise<any>) => ({
    data: { value: await fn().catch(() => null) },
    error: { value: null },
  }),
  useProtectedContent: () => ({
    verifyPassword: () => Promise.resolve({ success: false, error: '密碼錯誤' }),
  }),
  queryContent: () => ({
    where: () => ({ only: () => ({ find: () => Promise.resolve([]) }) }),
    only: () => ({ find: () => Promise.resolve([]) }),
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
  }),
  fetchContentNavigation: () => Promise.resolve([]),
}

/**
 * 建立元件掛載器
 */
export function createMountHelper(
  component: Component,
  defaultOptions?: MountingOptions<any>
) {
  return (options?: MountingOptions<any>): VueWrapper<any> => {
    return mount(component as any, {
      global: {
        stubs: {
          ...globalStubs,
          ...defaultOptions?.global?.stubs,
          ...options?.global?.stubs,
        },
        mocks: {
          ...mockComposables,
          ...defaultOptions?.global?.mocks,
          ...options?.global?.mocks,
        },
        provide: {
          ...defaultOptions?.global?.provide,
          ...options?.global?.provide,
        },
      },
      ...defaultOptions,
      ...options,
    } as any)
  }
}

/**
 * 等待元件更新
 */
export async function flushPromises(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * 建立 mock props
 */
export function createMockProps<T extends Record<string, any>>(
  defaults: T
): (overrides?: Partial<T>) => T {
  return (overrides = {}) => ({
    ...defaults,
    ...overrides,
  })
}

/**
 * 建立 mock navigation item
 */
export function createMockNavItem(overrides: Partial<{
  _path: string
  title: string
  type: string
  sortAnchor: number[]
  children: any[]
}> = {}) {
  return {
    _path: '/test-path',
    title: 'Test Item',
    type: 'page',
    sortAnchor: [1, 0],
    children: [],
    ...overrides,
  }
}

/**
 * 建立 mock content page
 */
export function createMockContentPage(overrides: Partial<{
  _path: string
  _dir: string
  title: string
  description: string
  type: string
  modifyTime: string
  sortAnchor: number[]
  bookCode: string
}> = {}) {
  return {
    _path: '/content/test',
    _dir: '/content',
    title: 'Test Page',
    description: 'Test description',
    type: 'page',
    modifyTime: new Date().toISOString(),
    sortAnchor: [1, 0],
    ...overrides,
  }
}
