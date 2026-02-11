/**
 * SidebarAuthor.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarAuthor from '../SidebarAuthor.vue'

// Mock composables
const mockRuntimeConfig = {
  public: {
    authorName: 'Test Author',
    authorBio: 'This is a test bio',
    authorAvatar: '/test-avatar.png',
    theme: 'classic',
  },
}

vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig)
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

describe('SidebarAuthor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sidebar author with correct structure', () => {
    const wrapper = mount(SidebarAuthor)

    expect(wrapper.find('aside').exists()).toBe(true)
    expect(wrapper.find('figure').exists()).toBe(true)
  })

  it('displays author name from runtime config', () => {
    const wrapper = mount(SidebarAuthor)

    expect(wrapper.find('h3').text()).toBe('Test Author')
  })

  it('displays author bio from runtime config', () => {
    const wrapper = mount(SidebarAuthor)

    expect(wrapper.find('p').text()).toBe('This is a test bio')
  })

  it('displays author avatar when provided', () => {
    const wrapper = mount(SidebarAuthor)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/test-avatar.png')
    expect(img.attributes('alt')).toBe('Test Author')
  })

  it('displays placeholder when no avatar provided', () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        authorName: 'Test Author',
        authorBio: 'This is a test bio',
        authorAvatar: '',
        theme: 'classic',
      },
    }))

    const wrapper = mount(SidebarAuthor)

    const figcaption = wrapper.find('figcaption')
    expect(figcaption.exists()).toBe(true)
    expect(figcaption.text()).toBe('T')
  })

  it('applies theme classes correctly', () => {
    vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig)
    const wrapper = mount(SidebarAuthor)

    expect(wrapper.find('aside').classes()).toContain('artia-sidebar-author-theme-classic')
  })

  it('uses first letter of author name for placeholder', () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        authorName: 'John Doe',
        authorBio: 'Bio',
        authorAvatar: '',
        theme: 'classic',
      },
    }))

    const wrapper = mount(SidebarAuthor)

    const figcaption = wrapper.find('figcaption')
    expect(figcaption.text()).toBe('J')
  })

  it('uses default A when author name is empty', () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        authorName: '',
        authorBio: 'Bio',
        authorAvatar: '',
        theme: 'classic',
      },
    }))

    const wrapper = mount(SidebarAuthor)

    const figcaption = wrapper.find('figcaption')
    expect(figcaption.text()).toBe('A')
  })
})
