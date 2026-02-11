/**
 * TheFooter.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TheFooter from '../TheFooter.vue'

// Mock composables
const mockRuntimeConfig = {
  public: {
    siteName: 'Test Site',
    siteSlogan: 'Test Slogan',
    copyright: '© 2024 Test Copyright',
    theme: 'classic',
  },
}

vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig)
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

describe('TheFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders footer with correct structure', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('displays site name from runtime config', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.text()).toContain('Test Site')
  })

  it('displays site slogan from runtime config', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.text()).toContain('Test Slogan')
  })

  it('displays copyright from runtime config', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.text()).toContain('© 2024 Test Copyright')
  })

  it('applies theme classes correctly', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.find('footer').classes()).toContain('artia-footer-theme-classic')
  })

  it('renders footer links section', () => {
    const wrapper = mount(TheFooter)

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })

  it('contains section with title 關於', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.text()).toContain('關於')
  })

  it('has proper accessibility with address element', () => {
    const wrapper = mount(TheFooter)

    expect(wrapper.find('address').exists()).toBe(true)
  })
})
