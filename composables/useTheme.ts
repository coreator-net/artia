/**
 * Artia Theme Composable
 * 
 * 提供動態主題 class 生成功能
 * 
 * 使用方式（建議使用 themeT 避免與 i18n 的 t 衝突）：
 * const { t: themeT } = useTheme()
 * 
 * // 單一元件
 * themeT('header')              // => 'artia-header-theme-classic'
 * 
 * // 元件 + 子元素
 * themeT('header', 'logo')      // => 'artia-header-logo-theme-classic'
 * 
 * // 多個 class
 * themeT(['card', 'card-title']) // => 'artia-card-theme-classic artia-card-title-theme-classic'
 */

export const useTheme = () => {
  const config = useRuntimeConfig()
  const themeName = computed(() => config.public.theme || 'classic')

  /**
   * 生成主題 class name
   * @param component - 元件名稱或元件陣列
   * @param element - 可選的子元素名稱
   * @returns 完整的 class name 字串
   */
  const t = (component: string | string[], element?: string): string => {
    // 處理陣列輸入
    if (Array.isArray(component)) {
      return component.map(c => `artia-${c}-theme-${themeName.value}`).join(' ')
    }
    
    // 處理單一元件
    if (element) {
      return `artia-${component}-${element}-theme-${themeName.value}`
    }
    
    return `artia-${component}-theme-${themeName.value}`
  }

  /**
   * 生成帶有額外 class 的主題 class
   * @param component - 元件名稱
   * @param extraClasses - 額外的 class（可選）
   * @returns 完整的 class name 字串
   */
  const tc = (component: string, extraClasses?: string): string => {
    const themeClass = `artia-${component}-theme-${themeName.value}`
    return extraClasses ? `${themeClass} ${extraClasses}` : themeClass
  }

  /**
   * 取得當前主題名稱
   */
  const currentTheme = computed(() => themeName.value)

  return {
    t,
    tc,
    currentTheme,
    themeName
  }
}
