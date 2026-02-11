/**
 * SidebarBookMenuItem.vue ?��?測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import SidebarBookMenuItem from '../SidebarBookMenuItem.vue'

// Mock composables
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

describe('SidebarBookMenuItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders item with display title', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/chapter-1',
          title: 'Chapter 1',
          type: 'page',
        },
        displayTitle: 'Chapter 1: Introduction',
        isSubPage: false,
        depth: 0,
        currentPath: '/content/book/chapter-2',
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

    expect(wrapper.text()).toContain('Chapter 1: Introduction')
  })

  it('renders as link for items without children', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/chapter',
          title: 'Chapter',
          type: 'page',
        },
        depth: 0,
        currentPath: '/content/book/other',
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
    expect(wrapper.find('a').attributes('href')).toBe('/content/book/chapter')
  })

  it('renders folder button for items with children', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/section',
          title: 'Section',
          type: 'folder',
          children: [
            { _path: '/content/book/section/page', title: 'Page' },
          ],
        },
        depth: 0,
        currentPath: '/content/book/other',
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

  it('highlights current page', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/current',
          title: 'Current Page',
          type: 'page',
        },
        depth: 0,
        currentPath: '/content/book/current',
        expandedFolders: new Set<string>(),
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to" :class="$attrs.class"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.classes()).toContain('font-bold')
  })

  it('shows expand indicator for folders', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/section',
          title: 'Section',
          type: 'folder',
          children: [{ _path: '/content/book/section/page', title: 'Page' }],
        },
        depth: 0,
        currentPath: '/content/book/other',
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

    expect(wrapper.text()).toContain('+')
  })

  it('shows collapse indicator when expanded', () => {
    const expandedFolders = new Set(['/content/book/section'])

    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/section',
          title: 'Section',
          type: 'folder',
          children: [{ _path: '/content/book/section/page', title: 'Page' }],
        },
        depth: 0,
        currentPath: '/content/book/other',
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

    expect(wrapper.text()).toContain('−')
  })

  it('emits toggle event when folder clicked', async () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/section',
          title: 'Section',
          type: 'folder',
          children: [{ _path: '/content/book/section/page', title: 'Page' }],
        },
        depth: 0,
        currentPath: '/content/book/other',
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
  })

  it('applies correct padding based on depth', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/deep/page',
          title: 'Deep Page',
          type: 'page',
        },
        depth: 3,
        currentPath: '/content/book/other',
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

  it('shows folder icon for folder items', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/folder',
          title: 'Folder',
          type: 'folder',
          children: [{ _path: '/content/book/folder/p', title: 'P' }],
        },
        depth: 0,
        currentPath: '/content/book/other',
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

    expect(wrapper.text()).toContain('📁')
  })

  it('adjusts depth for sub-pages', () => {
    const wrapper = mount(SidebarBookMenuItem, {
      props: {
        item: {
          _path: '/content/book/chapter_1',
          title: 'Sub Page',
          type: 'page',
        },
        isSubPage: true,
        depth: 0,
        currentPath: '/content/book/other',
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

    // isSubPage should increase effective depth
    const link = wrapper.find('a')
    expect(link.attributes('style')).toContain('padding-left')
  })
})
