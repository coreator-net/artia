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
 * - bookmenu: 當前書籍的章節目錄（動態根據當前頁面所屬 book）
 * - toc: 目錄 (Table of Contents)
 * - hero: 首頁 Hero 區塊
 * - featured: 精選作品
 * - recent: 最新內容
 * - search: 搜尋欄
 * - none: 不顯示任何內容
 */
export type LayoutComponent = 
  | 'author' 
  | 'navigation'
  | 'bookmenu'
  | 'toc' 
  | 'history'
  | 'hero' 
  | 'featured' 
  | 'recent'
  | 'search'
  | 'none'

/**
 * 元件參數介面
 */
export interface ComponentProps {
  root?: string
  hideEmptyTitle?: boolean
  title?: string
  [key: string]: any
}

/**
 * 解析後的元件設定
 */
export interface ParsedComponent {
  type: LayoutComponent
  props: ComponentProps
}

/**
 * 頁面類型
 */
export type PageType = 'home' | 'read'

/**
 * 位置類型
 */
export type SlotPosition = 'top' | 'left' | 'center' | 'right' | 'bottom'

/**
 * 佈局設定介面 - 支援多個元件
 */
export interface LayoutConfig {
  home: Record<SlotPosition, ParsedComponent[]>
  read: Record<SlotPosition, ParsedComponent[]>
}

/**
 * 元件對應表 - 將元件名稱對應到實際的 Vue 元件
 */
const componentMap: Record<LayoutComponent, string> = {
  author: 'LayoutSidebarAuthor',
  navigation: 'LayoutSidebarNav',
  bookmenu: 'LayoutSidebarBookMenu',
  toc: 'LayoutTableOfContents',
  history: 'LayoutHistoryTimeline',
  hero: 'LayoutHomeHero',
  featured: 'LayoutFeaturedBooks',
  recent: 'LayoutHomeRecent',
  search: 'LayoutSearchBar',
  none: '',
}

/**
 * 解析單一元件設定（包含參數）
 * 支援格式：
 * - "navigation" - 無參數
 * - "navigation:root=/content" - 單一參數
 * - "navigation:root=/content;title=我的導航" - 多參數用 ; 分隔
 * 
 * @param value - 單一元件設定字串
 * @returns 解析後的元件設定
 */
function parseSingleComponent(value: string): ParsedComponent | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  
  // 分離元件名稱和參數
  const colonIndex = trimmed.indexOf(':')
  let componentName: string
  let paramsStr: string | null = null
  
  if (colonIndex === -1) {
    componentName = trimmed
  } else {
    componentName = trimmed.substring(0, colonIndex)
    paramsStr = trimmed.substring(colonIndex + 1)
  }
  
  const type = componentName.toLowerCase() as LayoutComponent
  
  // 檢查元件是否有效
  if (!(type in componentMap) || type === 'none') {
    return null
  }
  
  // 解析參數
  const props: ComponentProps = {}
  
  if (paramsStr) {
    // 格式：key1=value1;key2=value2
    const pairs = paramsStr.split(';')
    for (const pair of pairs) {
      const eqIndex = pair.indexOf('=')
      if (eqIndex !== -1) {
        const key = pair.substring(0, eqIndex).trim()
        const val = pair.substring(eqIndex + 1).trim()
        
        // 處理布林值
        if (val === 'true') {
          props[key] = true
        } else if (val === 'false') {
          props[key] = false
        } else {
          props[key] = val
        }
      }
    }
  }
  
  return { type, props }
}

/**
 * 解析環境變數中的元件（支援多個元件，用逗號分隔）
 * @param value - 環境變數值，例如 "navigation:root=/content,author" 或 "hero"
 * @returns 解析後的元件設定陣列
 */
function parseComponents(value: string | undefined): ParsedComponent[] {
  if (!value || value.trim() === '') return []
  
  const components = value.split(',')
    .map(v => parseSingleComponent(v))
    .filter((v): v is ParsedComponent => v !== null)
  
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
   * 取得特定位置的所有元件名稱
   * @param page - 頁面類型 ('home' | 'read')
   * @param slot - 位置 ('top' | 'left' | 'center' | 'right' | 'bottom')
   * @returns Vue 元件名稱陣列
   */
  function getSlotComponents(page: PageType, slot: SlotPosition): string[] {
    const components = layoutConfig.value[page][slot]
    return components
      .map(comp => componentMap[comp.type])
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
    return components[0]?.type || 'none'
  }

  /**
   * 取得元件的原始配置值陣列（向後相容，只返回類型）
   * @param page - 頁面類型
   * @param slot - 位置
   * @returns 原始的元件類型陣列
   */
  function getRawSlotConfigs(page: PageType, slot: SlotPosition): LayoutComponent[] {
    return layoutConfig.value[page][slot].map(c => c.type)
  }

  /**
   * 取得解析後的完整元件設定（包含 props）
   * @param page - 頁面類型
   * @param slot - 位置
   * @returns 解析後的元件設定陣列
   */
  function getParsedSlotConfigs(page: PageType, slot: SlotPosition): ParsedComponent[] {
    return layoutConfig.value[page][slot]
  }

  return {
    layoutConfig,
    getSlotComponent,
    getSlotComponents,
    isSlotEnabled,
    hasLeftSidebar,
    hasRightSidebar,
    getRawSlotConfig,
    getRawSlotConfigs,
    getParsedSlotConfigs,
    componentMap,
  }
}
