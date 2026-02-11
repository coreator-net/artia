/**
 * page-content/PasswordPrompt.vue 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordPrompt from '../page-content/PasswordPrompt.vue'

// Mock composables
vi.stubGlobal('useTheme', () => ({
  t: (component: string) => `artia-${component}-theme-classic`,
}))

vi.stubGlobal('useRoute', () => ({
  path: '/protected-page',
}))

const mockVerifyPassword = vi.fn()

vi.stubGlobal('useProtectedContent', () => ({
  verifyPassword: mockVerifyPassword,
}))

describe('PasswordPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockVerifyPassword.mockResolvedValue({ success: false, error: '密碼錯誤' })
  })

  it('renders password prompt with correct structure', () => {
    const wrapper = mount(PasswordPrompt)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('displays title about password protection', () => {
    const wrapper = mount(PasswordPrompt)

    expect(wrapper.text()).toContain('此內容受密碼保護')
  })

  it('displays hint text', () => {
    const wrapper = mount(PasswordPrompt)

    expect(wrapper.text()).toContain('請輸入密碼以查看完整內容')
  })

  it('has password input with placeholder', () => {
    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    expect(input.attributes('placeholder')).toBe('請輸入密碼')
  })

  it('has submit button with correct text', () => {
    const wrapper = mount(PasswordPrompt)

    const button = wrapper.find('button[type="submit"]')
    expect(button.text()).toBe('解鎖')
  })

  it('applies theme classes correctly', () => {
    const wrapper = mount(PasswordPrompt)

    expect(wrapper.find('[class*="password-prompt"]').exists()).toBe(true)
  })

  it('updates password value on input', async () => {
    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    await input.setValue('test123')

    expect((input.element as HTMLInputElement).value).toBe('test123')
  })

  it('shows error when submitting empty password', async () => {
    const wrapper = mount(PasswordPrompt)

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('請輸入密碼')
  })

  it('calls verifyPassword on form submit', async () => {
    mockVerifyPassword.mockResolvedValue({ success: true, content: { title: 'Test' } })

    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    await input.setValue('correct-password')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(mockVerifyPassword).toHaveBeenCalledWith('/protected-page', 'correct-password')
  })

  it('emits authenticated event on successful verification', async () => {
    const mockContent = { title: 'Protected Content', body: 'Content body' }
    mockVerifyPassword.mockResolvedValue({ success: true, content: mockContent })

    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    await input.setValue('correct-password')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('authenticated')).toBeTruthy()
    expect(wrapper.emitted('authenticated')![0]).toEqual([mockContent])
  })

  it('shows error message on failed verification', async () => {
    mockVerifyPassword.mockResolvedValue({ success: false, error: '密碼錯誤' })

    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    await input.setValue('wrong-password')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('密碼錯誤')
  })

  it('shows loading state during verification', async () => {
    let resolvePromise: (value: any) => void
    mockVerifyPassword.mockImplementation(() => new Promise(resolve => {
      resolvePromise = resolve
    }))

    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    await input.setValue('password')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button[type="submit"]')
    expect(button.text()).toBe('驗證中...')
    expect(button.attributes('disabled')).toBeDefined()

    // Resolve the promise
    resolvePromise!({ success: true, content: {} })
    await wrapper.vm.$nextTick()
  })

  it('disables input during loading', async () => {
    let resolvePromise: (value: any) => void
    mockVerifyPassword.mockImplementation(() => new Promise(resolve => {
      resolvePromise = resolve
    }))

    const wrapper = mount(PasswordPrompt)

    const input = wrapper.find('input[type="password"]')
    await input.setValue('password')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(input.attributes('disabled')).toBeDefined()

    resolvePromise!({ success: true, content: {} })
    await wrapper.vm.$nextTick()
  })
})
