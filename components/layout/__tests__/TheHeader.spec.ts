/**
 * TheHeader.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TheHeader from '../TheHeader.vue'

// Mock composables
const mockRuntimeConfig = {
  public: {
    siteName: 'Test Site',
    theme: 'classic',
  },
}

vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig)
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'nav.home': '首頁',
      'nav.about': '關於',
    }
    return translations[key] || key
  },
}))

describe('TheHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders header with correct structure', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('ul').exists()).toBe(true)
  })

  it('displays site name from runtime config', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Test Site')
  })

  it('renders navigation links', () => {
    const wrapper = mount(TheHeader, {
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
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('applies theme classes correctly', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('header').classes()).toContain('artia-header-theme-classic')
  })

  it('contains home and about navigation items', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('首頁')
    expect(wrapper.text()).toContain('關於')
  })

  it('has mobile menu button', () => {
    const wrapper = mount(TheHeader, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const mobileButton = wrapper.find('button')
    expect(mobileButton.exists()).toBe(true)
    expect(mobileButton.find('svg').exists()).toBe(true)
  })
})
