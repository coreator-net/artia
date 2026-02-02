/**
 * useLayout - 動態頁面佈局系統
 * 
 * 透過環境變數設定頁面各區域要顯示的元件
 * 支援首頁(home)和閱讀頁(read)兩種佈局
 * 支援單一元件或多個元件（用逗號分隔）
 * 
 * @example
 * ```vue
 * <script setup>
 * const { getSlotComponents, isSlotEnabled } = useLayout()
 * </script>
 * 
 * <template>
 *   <template v-for="comp in getSlotComponents('home', 'left')">
 *     <component :is="comp" />
 *   </template>
 * </template>
 * ```
 */

/**
 * 可用的元件類型
 * - author: 作者介紹側邊欄
 * - navigation: 內容導航/作品清單
 * - toc: 目錄 (Table of Contents)
 * - hero: 首頁 Hero 區塊
 * - featured: 精選作品
 * - recent: 最新內容
 * - none: 不顯示任何內容
 */
export type LayoutComponent = 
  | 'author' 
  | 'navigation' 
  | 'toc' 
  | 'hero' 
  | 'featured' 
  | 'recent'
  | 'none'

/**
 * 頁面類型
 */
export type PageType = 'home' | 'read'

/**
 * 位置類型
 */
export type SlotPosition = 'top' | 'left' | 'center' | 'right' | 'bottom'

/**
 * 佈局模式
 * - content: TOP/BOTTOM 為全寬，擠掉 LEFT/RIGHT（適合內容網站、部落格）
 * - app: LEFT/RIGHT 延伸到頂部（適合後台、工具型應用）
 */
export type LayoutMode = 'content' | 'app'

/**
 * 佈局設定介面 - 支援多個元件
 */
export interface LayoutConfig {
  home: Record<SlotPosition, LayoutComponent[]>
  read: Record<SlotPosition, LayoutComponent[]>
}

/**
 * 元件對應表 - 將元件名稱對應到實際的 Vue 元件
 */
const componentMap: Record<LayoutComponent, string> = {
  author: 'LayoutSidebarAuthor',
  navigation: 'LayoutSidebarContent',
  toc: 'LayoutTableOfContents',
  hero: 'LayoutHomeHero',
  featured: 'LayoutHomeFeatured',
  recent: 'LayoutHomeRecent',
  none: '',
}

/**
 * 解析環境變數中的元件（支援多個元件，用逗號分隔）
 * @param value - 環境變數值，例如 "navigation,author" 或 "hero"
 * @returns 元件類型陣列
 */
function parseComponents(value: string | undefined): LayoutComponent[] {
  if (!value || value.trim() === '') return []
  
  const components = value.split(',')
    .map(v => v.trim().toLowerCase() as LayoutComponent)
    .filter(v => v in componentMap && v !== 'none')
  
  return components
}

/**
 * useLayout composable
 */
export function useLayout() {
  const config = useRuntimeConfig()
  
  /**
   * 取得佈局設定
   */
  const layoutConfig = computed<LayoutConfig>(() => {
    const pub = config.public as Record<string, any>
    
    return {
      home: {
        top: parseComponents(pub.layoutHomeTop),
        left: parseComponents(pub.layoutHomeLeft),
        center: parseComponents(pub.layoutHomeCenter),
        right: parseComponents(pub.layoutHomeRight),
        bottom: parseComponents(pub.layoutHomeBottom),
      },
      read: {
        top: parseComponents(pub.layoutReadTop),
        left: parseComponents(pub.layoutReadLeft),
        center: parseComponents(pub.layoutReadCenter),
        right: parseComponents(pub.layoutReadRight),
        bottom: parseComponents(pub.layoutReadBottom),
      },
    }
  })

  /**
   * 取得佈局模式
   * - content: TOP/BOTTOM 為全寬，擠掉 LEFT/RIGHT
   * - app: LEFT/RIGHT 延伸到頂部
   */
  const layoutMode = computed<LayoutMode>(() => {
    const pub = config.public as Record<string, any>
    const mode = pub.layoutMode?.toLowerCase()
    return mode === 'app' ? 'app' : 'content'
  })

  /**
   * 是否為 content 模式（TOP/BOTTOM 全寬）
   */
  const isContentMode = computed(() => layoutMode.value === 'content')

  /**
   * 是否為 app 模式（LEFT/RIGHT 延伸）
   */
  const isAppMode = computed(() => layoutMode.value === 'app')

  /**
   * 取得特定位置的所有元件名稱
   * @param page - 頁面類型 ('home' | 'read')
   * @param slot - 位置 ('top' | 'left' | 'center' | 'right' | 'bottom')
   * @returns Vue 元件名稱陣列
   */
  function getSlotComponents(page: PageType, slot: SlotPosition): string[] {
    const components = layoutConfig.value[page][slot]
    return components
      .map(comp => componentMap[comp])
      .filter(name => name !== '')
  }

  /**
   * 取得特定位置的第一個元件名稱（向後相容）
   * @param page - 頁面類型 ('home' | 'read')
   * @param slot - 位置 ('top' | 'left' | 'center' | 'right' | 'bottom')
   * @returns Vue 元件名稱或 null
   */
  function getSlotComponent(page: PageType, slot: SlotPosition): string | null {
    const components = getSlotComponents(page, slot)
    return components[0] || null
  }

  /**
   * 檢查特定位置是否有啟用元件
   * @param page - 頁面類型
   * @param slot - 位置
   * @returns 是否有啟用的元件
   */
  function isSlotEnabled(page: PageType, slot: SlotPosition): boolean {
    return layoutConfig.value[page][slot].length > 0
  }

  /**
   * 檢查左側邊欄是否啟用（用於佈局調整）
   */
  function hasLeftSidebar(page: PageType): boolean {
    return isSlotEnabled(page, 'left')
  }

  /**
   * 檢查右側邊欄是否啟用（用於佈局調整）
   */
  function hasRightSidebar(page: PageType): boolean {
    return isSlotEnabled(page, 'right')
  }

  /**
   * 取得元件的原始配置值（向後相容，返回第一個）
   * @param page - 頁面類型
   * @param slot - 位置
   * @returns 原始的元件類型
   */
  function getRawSlotConfig(page: PageType, slot: SlotPosition): LayoutComponent {
    const components = layoutConfig.value[page][slot]
    return components[0] || 'none'
  }

  /**
   * 取得元件的原始配置值陣列
   * @param page - 頁面類型
   * @param slot - 位置
   * @returns 原始的元件類型陣列
   */
  function getRawSlotConfigs(page: PageType, slot: SlotPosition): LayoutComponent[] {
    return layoutConfig.value[page][slot]
  }

  return {
    layoutConfig,
    layoutMode,
    isContentMode,
    isAppMode,
    getSlotComponent,
    getSlotComponents,
    isSlotEnabled,
    hasLeftSidebar,
    hasRightSidebar,
    getRawSlotConfig,
    getRawSlotConfigs,
    componentMap,
  }
}
