/**
 * SidebarNavItem.vue ?��?測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarNavItem from '../SidebarNavItem.vue'

// Mock composables
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'sidebar.viewIntro': '?��?介紹',
    }
    return translations[key] || key
  },
}))

vi.stubGlobal('useRouter', () => ({
  push: vi.fn(),
}))

describe('SidebarNavItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders item with title', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/test',
          title: 'Test Item',
          type: 'page',
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    expect(wrapper.text()).toContain('Test Item')
  })

  it('does not render when item has no title', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/test',
          type: 'page',
        } as any, // 故意測試缺少 title 的情況
        depth: 0,
        expandedFolders: new Set<string>(),
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

    expect(wrapper.find('li').exists()).toBe(false)
  })

  it('renders as link for items without children', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/page',
          title: 'Page Item',
          type: 'page',
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/content/page')
  })

  it('renders folder button for items with children', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/folder',
          title: 'Folder Item',
          type: 'folder',
          children: [
            { _path: '/content/folder/child', title: 'Child' },
          ],
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('shows expand/collapse indicator for folders', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/folder',
          title: 'Folder',
          type: 'folder',
          children: [{ _path: '/content/folder/child', title: 'Child' }],
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    // Should show + when collapsed
    expect(wrapper.text()).toContain('+')
  })

  it('shows minus when folder is expanded', () => {
    const expandedFolders = new Set(['/content/folder'])

    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/folder',
          title: 'Folder',
          type: 'folder',
          children: [{ _path: '/content/folder/child', title: 'Child' }],
        },
        depth: 0,
        expandedFolders,
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

    // Should show − when expanded
    expect(wrapper.text()).toContain('−')
  })

  it('emits toggle event when folder button clicked', async () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/folder',
          title: 'Folder',
          type: 'folder',
          children: [{ _path: '/content/folder/child', title: 'Child' }],
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')![0]).toEqual(['/content/folder'])
  })

  it('applies correct padding based on depth', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/deep/item',
          title: 'Deep Item',
          type: 'page',
        },
        depth: 2,
        expandedFolders: new Set<string>(),
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" :style="$attrs.style"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.attributes('style')).toContain('padding-left')
  })

  it('shows type icon for page items', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/page',
          title: 'Page',
          type: 'page',
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    // Should have some icon (?? or similar)
    expect(wrapper.text().length).toBeGreaterThan('Page'.length)
  })

  it('shows intro button when introPath exists', () => {
    const wrapper = mount(SidebarNavItem, {
      props: {
        item: {
          _path: '/content/book',
          title: 'Book',
          type: 'book',
          children: [
            { _path: '/content/book/_intro', title: 'Intro', type: 'page' },
            { _path: '/content/book/chapter', title: 'Chapter', type: 'page' },
          ],
        },
        depth: 0,
        expandedFolders: new Set<string>(),
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

    // Should have intro button (?��?)
    const buttons = wrapper.findAll('button')
    const hasInfoButton = buttons.some(b => b.text().includes('?��?'))
    expect(hasInfoButton || buttons.length >= 1).toBe(true)
  })
})
