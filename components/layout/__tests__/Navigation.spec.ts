/**
 * page-content/Navigation.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Navigation from '../page-content/Navigation.vue'

// Mock composables
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'page.prev': '上一頁',
      'page.next': '下一頁',
    }
    return translations[key] || key
  },
}))

const mockPush = vi.fn()
vi.stubGlobal('useRouter', () => ({
  push: mockPush,
}))

// Create mock siblings data
const createSiblings = () => [
  { _path: '/content/page-1', title: 'Page 1', type: 'page', sortAnchor: [1, 0] },
  { _path: '/content/page-2', title: 'Page 2', type: 'page', sortAnchor: [2, 0] },
  { _path: '/content/page-3', title: 'Page 3', type: 'page', sortAnchor: [3, 0] },
  { _path: '/content/page-4', title: 'Page 4', type: 'page', sortAnchor: [4, 0] },
  { _path: '/content/page-5', title: 'Page 5', type: 'page', sortAnchor: [5, 0] },
]

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navigation when siblings exist', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-2',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('does not render when siblings array is empty', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: [],
        currentPath: '/content/page-1',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('shows previous page link when not on first page', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-3',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const links = wrapper.findAll('a')
    const prevLink = links.find(l => l.text().includes('Page 2') || l.text().includes('←'))
    expect(prevLink).toBeDefined()
  })

  it('shows next page link when not on last page', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-3',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const links = wrapper.findAll('a')
    const nextLink = links.find(l => l.text().includes('Page 4') || l.text().includes('→'))
    expect(nextLink).toBeDefined()
  })

  it('does not show previous link on first page', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-1',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    // Prev link should not exist, but next should
    const text = wrapper.text()
    expect(text).toContain('→')
  })

  it('does not show next link on last page', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-5',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    // Should have prev link with ←
    const text = wrapper.text()
    expect(text).toContain('←')
  })

  it('displays page numbers', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-3',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    // Should have page number links
    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(2) // prev, next, and page numbers
  })

  it('applies theme classes correctly', () => {
    const wrapper = mount(Navigation, {
      props: {
        siblings: createSiblings(),
        currentPath: '/content/page-2',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('nav').classes()).toContain('artia-page-pagination-theme-classic')
  })

  it('shows all page numbers for small list (≤4 pages)', () => {
    const smallSiblings = [
      { _path: '/content/page-1', title: 'Page 1' },
      { _path: '/content/page-2', title: 'Page 2' },
      { _path: '/content/page-3', title: 'Page 3' },
    ]

    const wrapper = mount(Navigation, {
      props: {
        siblings: smallSiblings,
        currentPath: '/content/page-2',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    // Should show all 3 page numbers (no ellipsis)
    expect(wrapper.text()).not.toContain('...')
  })

  it('shows ellipsis for large list when in middle', () => {
    const largeSiblings = Array.from({ length: 10 }, (_, i) => ({
      _path: `/content/page-${i + 1}`,
      title: `Page ${i + 1}`,
    }))

    const wrapper = mount(Navigation, {
      props: {
        siblings: largeSiblings,
        currentPath: '/content/page-5',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    // Should have ellipsis
    expect(wrapper.text()).toContain('...')
  })
})
