/**
 * LayoutSlot.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import LayoutSlot from '../LayoutSlot.vue'

// Mock child components
const stubComponents = {
  LayoutSidebarAuthor: { template: '<div class="mock-author">Author</div>' },
  LayoutSidebarNav: { template: '<div class="mock-nav">Nav</div>', props: ['rootPath', 'title'] },
  LayoutSidebarBookMenu: { template: '<div class="mock-book-menu">BookMenu</div>', props: ['title'] },
  LayoutTableOfContents: { template: '<div class="mock-toc">TOC</div>' },
  LayoutHistoryTimeline: { template: '<div class="mock-history">History</div>' },
  LayoutHeroSection: { template: '<div class="mock-hero">Hero</div>' },
  LayoutFeaturedBooks: { template: '<div class="mock-featured">Featured</div>' },
  LayoutRecentContent: { template: '<div class="mock-recent">Recent</div>' },
}

describe('LayoutSlot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty wrapper when no configs', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [],
    }))

    const wrapper = mount(LayoutSlot, {
      props: {
        page: 'home',
        position: 'left',
      },
      global: {
        stubs: stubComponents,
      },
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('.mock-author').exists()).toBe(false)
  })

  it('renders author component when configured', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{ type: 'author', props: {} }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: {
        page: 'home',
        position: 'left',
      },
      global: {
        stubs: stubComponents,
      },
    })

    expect(wrapper.find('.mock-author').exists()).toBe(true)
  })

  it('renders navigation component with props', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{
        type: 'navigation',
        props: { root: '/content', title: 'My Nav' },
      }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: {
        page: 'read',
        position: 'left',
      },
      global: {
        stubs: stubComponents,
      },
    })

    expect(wrapper.find('.mock-nav').exists()).toBe(true)
  })

  it('renders multiple components from config', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [
        { type: 'author', props: {} },
        { type: 'toc', props: {} },
      ],
    }))

    const wrapper = mount(LayoutSlot, {
      props: {
        page: 'read',
        position: 'right',
      },
      global: {
        stubs: stubComponents,
      },
    })

    expect(wrapper.find('.mock-author').exists()).toBe(true)
    expect(wrapper.find('.mock-toc').exists()).toBe(true)
  })

  it('applies w-56 class for left/right positions', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [],
    }))

    const leftWrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'left' },
      global: { stubs: stubComponents },
    })

    const rightWrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'right' },
      global: { stubs: stubComponents },
    })

    expect(leftWrapper.find('div').classes()).toContain('w-56')
    expect(rightWrapper.find('div').classes()).toContain('w-56')
  })

  it('applies w-full class for center/top/bottom positions', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [],
    }))

    const centerWrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'center' },
      global: { stubs: stubComponents },
    })

    const topWrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'top' },
      global: { stubs: stubComponents },
    })

    expect(centerWrapper.find('div').classes()).toContain('w-full')
    expect(topWrapper.find('div').classes()).toContain('w-full')
  })

  it('renders hero section for center slot', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{ type: 'hero', props: {} }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'center' },
      global: { stubs: stubComponents },
    })

    expect(wrapper.find('.mock-hero').exists()).toBe(true)
  })

  it('renders featured books component', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{ type: 'featured', props: {} }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'center' },
      global: { stubs: stubComponents },
    })

    expect(wrapper.find('.mock-featured').exists()).toBe(true)
  })

  it('renders recent content component', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{ type: 'recent', props: {} }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'center' },
      global: { stubs: stubComponents },
    })

    expect(wrapper.find('.mock-recent').exists()).toBe(true)
  })

  it('renders history timeline component', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{ type: 'history', props: {} }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: { page: 'read', position: 'right' },
      global: { stubs: stubComponents },
    })

    expect(wrapper.find('.mock-history').exists()).toBe(true)
  })

  it('ignores none type config', () => {
    vi.stubGlobal('useLayout', () => ({
      getParsedSlotConfigs: () => [{ type: 'none', props: {} }],
    }))

    const wrapper = mount(LayoutSlot, {
      props: { page: 'home', position: 'left' },
      global: { stubs: stubComponents },
    })

    // Should only have the wrapper div, no child components
    expect(wrapper.findAll('.mock-author').length).toBe(0)
    expect(wrapper.findAll('.mock-nav').length).toBe(0)
  })
})
