/**
 * HeroSection.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'

// Mock composables
const mockRuntimeConfig = {
  public: {
    heroTitle: 'Test Hero Title',
    heroDescription: 'Test Hero Description',
    heroCtaPrimary: 'Get Started',
    heroCtaSecondary: 'Learn More',
    theme: 'classic',
  },
}

vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig)
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section with correct structure', () => {
    const wrapper = mount(HeroSection, {
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
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('displays hero title from runtime config', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('Test Hero Title')
  })

  it('displays hero description from runtime config', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('p').text()).toBe('Test Hero Description')
  })

  it('displays CTA buttons with correct text', () => {
    const wrapper = mount(HeroSection, {
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
    const buttons = wrapper.findAll('button')
    
    expect(links.length).toBeGreaterThan(0)
    expect(links[0].text()).toBe('Get Started')
    expect(buttons[0].text()).toBe('Learn More')
  })

  it('applies theme classes correctly', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.find('header').classes()).toContain('artia-hero-theme-classic')
    expect(wrapper.find('h1').classes()).toContain('artia-hero-title-theme-classic')
  })

  it('primary CTA links to home page', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const primaryLink = wrapper.find('a')
    expect(primaryLink.attributes('href')).toBe('/')
  })
})
