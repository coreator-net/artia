/**
 * TableOfContents.vue 單元測試
 * 由於組件使用 async setup，需要用 Suspense 包裝
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, Suspense, ref } from 'vue'
import TableOfContents from '../TableOfContents.vue'

// Mock useTheme
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

// Mock useRoute (重要：需要在 useAsyncData 之前定義)
vi.stubGlobal('useRoute', () => ({
  path: '/test-page',
}))

// Mock ref 用於響應式數據
vi.stubGlobal('ref', ref)

// 建立 Suspense 包裝器
function mountWithSuspense(mockToc: any[] = []) {
  // 在每次 mount 前設置 mock
  vi.stubGlobal('useAsyncData', () => ({
    data: ref(mockToc),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn(),
  }))
  
  vi.stubGlobal('queryContent', () => ({
    findOne: () => Promise.resolve({
      body: { toc: { links: mockToc } }
    })
  }))

  const wrapper = mount(
    defineComponent({
      setup() {
        return () => h(Suspense, null, {
          default: () => h(TableOfContents),
          fallback: () => h('div', 'Loading...')
        })
      }
    })
  )
  
  return wrapper
}

describe('TableOfContents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sidebar toc with correct structure', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    const aside = wrapper.find('aside')
    expect(aside.exists()).toBe(true)
  })

  it('displays title 目錄', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.text()).toBe('目錄')
  })

  it('shows empty message when no TOC items', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    expect(wrapper.text()).toContain('此頁面沒有目錄')
  })

  it('renders TOC items when available', async () => {
    const mockToc = [
      { id: 'heading-1', text: 'Heading 1' },
      { id: 'heading-2', text: 'Heading 2' },
    ]

    const wrapper = mountWithSuspense(mockToc)
    await flushPromises()

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBe(2)
  })

  it('renders nested TOC items', async () => {
    const mockToc = [
      {
        id: 'heading-1',
        text: 'Heading 1',
        children: [
          { id: 'heading-1-1', text: 'Heading 1.1' },
        ],
      },
    ]

    const wrapper = mountWithSuspense(mockToc)
    await flushPromises()

    // 應該有根 ul 和巢狀 ul
    expect(wrapper.findAll('ul').length).toBeGreaterThan(1)
  })

  it('applies theme classes correctly', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    const aside = wrapper.find('aside')
    expect(aside.classes()).toContain('artia-sidebar-toc-theme-classic')
  })

  it('creates anchor links with correct href', async () => {
    const mockToc = [
      { id: 'test-heading', text: 'Test Heading' },
    ]

    const wrapper = mountWithSuspense(mockToc)
    await flushPromises()

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('#test-heading')
  })
})
