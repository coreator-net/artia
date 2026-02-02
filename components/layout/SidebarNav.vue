<template>
  <aside :class="t(classPrefix)">
    <h3 :class="t(`${classPrefix}-title`)">{{ title }}</h3>
    <nav>
      <ul :class="t(`${classPrefix}-list`)">
        <!-- 使用遞迴元件渲染多層結構 -->
        <LayoutSidebarNavItem 
          v-for="item in sortedNavigation" 
          :key="item._path"
          :item="item"
          :depth="0"
          :expanded-folders="expandedFolders"
          :hide-empty-title="hideEmptyTitle"
          @toggle="toggleFolder"
        />
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

interface ExtendedNavItem extends NavItem {
  type?: 'folder' | 'book' | 'page' | string
  sortAnchor?: number[]
  children?: ExtendedNavItem[]
}

interface Props {
  title?: string
  classPrefix?: string
  hideEmptyTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '內容清單',
  classPrefix: 'sidebar-content',
  hideEmptyTitle: true
})

const { t } = useTheme()

// 使用 fetchContentNavigation 取得已結構化的導航樹
const { data: navigation } = await useAsyncData('navigation', () => 
  fetchContentNavigation()
)

// 依類型與 sortAnchor 進行排序：folder/book 優先，再按 sortAnchor 數列逐一比較（缺項視為 0），最後按標題與路徑
const sortNavItems = (items: ExtendedNavItem[] = []): ExtendedNavItem[] => {
  const typeWeight = (item: ExtendedNavItem) => (item.type === 'folder' || item.type === 'book' ? 0 : 1)

  const compareAnchors = (aItem: ExtendedNavItem, bItem: ExtendedNavItem) => {
    const aArr = Array.isArray(aItem.sortAnchor) ? aItem.sortAnchor : (aItem.type === 'page' ? [Number.POSITIVE_INFINITY] : [])
    const bArr = Array.isArray(bItem.sortAnchor) ? bItem.sortAnchor : (bItem.type === 'page' ? [Number.POSITIVE_INFINITY] : [])
    const maxLen = Math.max(aArr.length, bArr.length)
    for (let i = 0; i < maxLen; i++) {
      const aVal = aArr[i] ?? 0
      const bVal = bArr[i] ?? 0
      if (aVal !== bVal) return aVal - bVal
    }
    return 0
  }

  const sorted = [...items].sort((a, b) => {
    const typeDiff = typeWeight(a) - typeWeight(b)
    if (typeDiff !== 0) return typeDiff

    const anchorDiff = compareAnchors(a, b)
    if (anchorDiff !== 0) return anchorDiff

    if (a.title && b.title) return a.title.localeCompare(b.title)
    if (a.title) return -1
    if (b.title) return 1

    return (a._path || '').localeCompare(b._path || '')
  })

  return sorted.map(item => ({
    ...item,
    children: item.children ? sortNavItems(item.children as ExtendedNavItem[]) : undefined,
  }))
}

const sortedNavigation = computed(() => {
  return navigation.value ? sortNavItems(navigation.value as ExtendedNavItem[]) : []
})

// 追蹤展開狀態
const expandedFolders = ref<Set<string>>(new Set())

const toggleFolder = (path: string) => {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path)
  } else {
    expandedFolders.value.add(path)
  }
}
</script>
