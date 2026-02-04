/**
 * 內容排序工具
 * 用於 Nuxt Content 的排序邏輯
 */

interface SortableItem {
  _path?: string
  title?: string
  type?: string
  sortAnchor?: number[]
  children?: SortableItem[]
  [key: string]: any
}

interface SortOptions {
  /** 是否優先排序 folder/book 類型 */
  prioritizeFolders?: boolean
  /** 是否遞迴排序子項目 */
  recursive?: boolean
  /** 是否過濾只保留有 sortAnchor 或 type === 'page' 的項目 */
  filterPages?: boolean
}

/**
 * 比較兩個項目的 sortAnchor
 * 沒有 sortAnchor 的項目視為空陣列（所有元素為 0）
 */
export const compareAnchors = (aItem: SortableItem, bItem: SortableItem): number => {
  const aArr = Array.isArray(aItem?.sortAnchor) ? aItem.sortAnchor : []
  const bArr = Array.isArray(bItem?.sortAnchor) ? bItem.sortAnchor : []
  
  const maxLen = Math.max(aArr.length, bArr.length)
  for (let i = 0; i < maxLen; i++) {
    const aVal = aArr[i] ?? 0
    const bVal = bArr[i] ?? 0
    if (aVal !== bVal) return aVal - bVal
  }
  return 0
}

/**
 * 取得項目的類型權重（用於 folder/book 優先排序）
 */
const getTypeWeight = (item: SortableItem): number => {
  return item.type === 'folder' || item.type === 'book' ? 0 : 1
}

/**
 * 排序內容項目
 * @param items 要排序的項目陣列
 * @param options 排序選項
 * @returns 排序後的項目陣列
 */
export const sortContentItems = <T extends SortableItem>(
  items: T[] = [],
  options: SortOptions = {}
): T[] => {
  const {
    prioritizeFolders = false,
    recursive = false,
    filterPages = false
  } = options

  // 過濾項目（如果需要）
  let itemsToSort = items
  if (filterPages) {
    itemsToSort = items.filter(
      (item) => Array.isArray(item?.sortAnchor) || item?.type === 'page'
    )
  }

  // 排序
  const sorted = [...itemsToSort].sort((a, b) => {
    // 1. 類型權重（folder/book 優先）
    if (prioritizeFolders) {
      const typeDiff = getTypeWeight(a) - getTypeWeight(b)
      if (typeDiff !== 0) return typeDiff
    }

    // 2. sortAnchor 比較
    const anchorDiff = compareAnchors(a, b)
    if (anchorDiff !== 0) return anchorDiff

    // 3. 標題比較
    if (a.title && b.title) return a.title.localeCompare(b.title)
    if (a.title) return -1
    if (b.title) return 1

    // 4. 路徑比較
    return (a._path || '').localeCompare(b._path || '')
  })

  // 遞迴排序子項目（如果需要）
  if (recursive) {
    return sorted.map(item => {
      if (!item.children) {
        return item
      }
      
      // 遞迴時保留所有選項，包括 filterPages
      const sortedChildren = sortContentItems(item.children as T[], options)
      
      return {
        ...item,
        children: sortedChildren.length > 0 ? sortedChildren : undefined,
      }
    }) as T[]
  }

  return sorted
}
