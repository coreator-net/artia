/**
 * HistoryTimeline.vue 單元測試
 * 由於組件使用 async setup，需要用 Suspense 包裝
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, Suspense, ref } from 'vue'
import HistoryTimeline from '../HistoryTimeline.vue'

// Mock useTheme
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

// Mock useI18n
vi.stubGlobal('useI18n', () => ({
  t: (key: string, params?: Record<string, any>) => {
    const translations: Record<string, string> = {
      'history.title': '歷史記錄',
      'history.empty': '沒有歷史記錄',
      'history.today': '今天',
      'history.yesterday': '昨天',
      'history.daysAgo': `${params?.count || 0} 天前`,
      'history.weeksAgo': `${params?.count || 0} 週前`,
      'history.monthsAgo': `${params?.count || 0} 個月前`,
      'history.yearsAgo': `${params?.count || 0} 年前`,
      'date.locale': 'zh-TW',
    }
    return translations[key] || key
  },
}))

// Mock useRoute
vi.stubGlobal('useRoute', () => ({
  path: '/test-page',
}))

// Mock ref
vi.stubGlobal('ref', ref)

// 建立 Suspense 包裝器
function mountWithSuspense(mockRecords: any[] = []) {
  // 在每次 mount 前設置 mock
  vi.stubGlobal('useAsyncData', () => ({
    data: ref(mockRecords),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn(),
  }))
  
  vi.stubGlobal('queryContent', () => ({
    findOne: () => Promise.resolve({
      historyRecords: mockRecords
    })
  }))

  const wrapper = mount(
    defineComponent({
      setup() {
        return () => h(Suspense, null, {
          default: () => h(HistoryTimeline),
          fallback: () => h('div', 'Loading...')
        })
      }
    })
  )
  
  return wrapper
}

describe('HistoryTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sidebar history with correct structure', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    expect(wrapper.find('aside').exists()).toBe(true)
  })

  it('displays title 歷史記錄', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.text()).toBe('歷史記錄')
  })

  it('shows empty message when no history records', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    expect(wrapper.text()).toContain('沒有歷史記錄')
  })

  it('renders history records when available', async () => {
    const mockRecords = [
      { name: 'Author 1', recordTime: new Date().toISOString(), commit: 'Initial commit' },
      { name: 'Author 2', recordTime: new Date().toISOString(), commit: 'Update content' },
    ]

    const wrapper = mountWithSuspense(mockRecords)
    await flushPromises()

    expect(wrapper.text()).toContain('Author 1')
    expect(wrapper.text()).toContain('Initial commit')
  })

  it('applies theme classes correctly', async () => {
    const wrapper = mountWithSuspense([])
    await flushPromises()

    const aside = wrapper.find('aside')
    expect(aside.classes()).toContain('artia-sidebar-history-theme-classic')
  })

  it('displays timeline structure for multiple records', async () => {
    const mockRecords = [
      { name: 'Author 1', recordTime: new Date().toISOString(), commit: 'Commit 1' },
      { name: 'Author 2', recordTime: new Date().toISOString(), commit: 'Commit 2' },
    ]

    const wrapper = mountWithSuspense(mockRecords)
    await flushPromises()

    // Should display both authors
    expect(wrapper.text()).toContain('Author 1')
    expect(wrapper.text()).toContain('Author 2')
  })

  it('displays relative time for today records', async () => {
    const todayRecord = [
      { name: 'Author', recordTime: new Date().toISOString(), commit: 'Today commit' },
    ]

    const wrapper = mountWithSuspense(todayRecord)
    await flushPromises()

    expect(wrapper.text()).toContain('今天')
  })
})
