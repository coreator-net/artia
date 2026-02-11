<template>
  <aside v-if="bookNode" :class="themeT(classPrefix)">
    <h3 :class="themeT(`${classPrefix}-title`)">{{ displayTitle }}</h3>
    <nav>
      <ul :class="themeT(`${classPrefix}-list`)">
        <!-- 書籍介紹連結（如果有的話） -->
        <li v-if="bookIntroPath">
          <NuxtLink 
            :to="bookIntroPath"
            :class="[themeT('sidebar-content-link'), { 'font-bold': isCurrentPath(bookIntroPath) }]"
          >
            📖 {{ bookNode.title }}
          </NuxtLink>
        </li>
        <!-- 章節列表 -->
        <LayoutSidebarBookMenuItem 
          v-for="item in chaptersWithDisplayInfo" 
          :key="item._path"
          :item="item"
          :display-title="item.displayTitle"
          :is-sub-page="item.isSubPage"
          :depth="0"
          :current-path="currentPath"
          :expanded-folders="expandedFolders"
          @toggle="toggleFolder"
        />
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import { sortContentItems } from '~/utils/contentSort'

interface ExtendedNavItem extends NavItem {
  type?: 'folder' | 'book' | 'page' | string
  sortAnchor?: number[]
  children?: ExtendedNavItem[]
}

interface Props {
  title?: string
  classPrefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  classPrefix: 'sidebar-content'
})

const { t: themeT } = useTheme()
const { t } = useI18n()
const route = useRoute()

const currentPath = computed(() => route.path)

const displayTitle = computed(() => props.title || t('sidebar.bookMenu'))

// 載入導航資料
const navigation = ref<ExtendedNavItem[]>([])

const navTree = await fetchContentNavigation()

const content = await queryContent()
  .where({ _draft: { $ne: true }, _partial: { $ne: true } })
  .only(['_path', 'type', 'sortAnchor'])
  .find()

const metadataMap = new Map<string, { type?: string; sortAnchor?: number[] }>(
  content
    .filter(item => item._path)
    .map(item => [item._path!, { type: item.type, sortAnchor: item.sortAnchor }])
)

const mergeMetadata = (items: any[]): ExtendedNavItem[] => {
  return items.map(item => {
    const metadata = metadataMap.get(item._path)
    const merged: ExtendedNavItem = {
      ...item,
      type: metadata?.type || item.type,
      sortAnchor: metadata?.sortAnchor || item.sortAnchor,
      children: item.children ? mergeMetadata(item.children) : undefined
    }
    return merged
  })
}

navigation.value = mergeMetadata(navTree)

/**
 * 遞迴查找包含指定路徑的 book 節點
 */
const findBookNode = (items: ExtendedNavItem[], targetPath: string): ExtendedNavItem | null => {
  for (const item of items) {
    // 檢查是否是 book 類型且包含目標路徑
    if (item.children) {
      // 檢查子節點中是否有 type: book
      const bookChild = item.children.find(child => child.type === 'book')
      if (bookChild) {
        // 檢查目標路徑是否在這個資料夾下
        if (targetPath.startsWith(item._path + '/') || targetPath === item._path) {
          return { ...item, type: 'book' }
        }
      }
      
      // 遞迴搜尋子節點
      const found = findBookNode(item.children, targetPath)
      if (found) return found
    }
  }
  return null
}

// 當前頁面所屬的 book 節點
const bookNode = computed(() => {
  return findBookNode(navigation.value, currentPath.value)
})

// book 的介紹頁面路徑
const bookIntroPath = computed(() => {
  if (!bookNode.value?.children) return null
  const intro = bookNode.value.children.find(child => child.type === 'book')
  return intro?._path || null
})

// 過濾並排序章節（排除 book/folder 類型的介紹檔案）
const sortedChapters = computed(() => {
  if (!bookNode.value?.children) return []
  
  const chapters = bookNode.value.children.filter(child => {
    return child.type !== 'book' && child.type !== 'folder'
  })
  
  return sortContentItems(chapters as ExtendedNavItem[], {
    prioritizeFolders: true,
    recursive: true
  })
})

// 為章節計算顯示資訊（處理沒有 title 的項目）
const chaptersWithDisplayInfo = computed(() => {
  const result: Array<ExtendedNavItem & { displayTitle: string; isSubPage: boolean }> = []
  let lastTitle = ''
  let subPageCount = 0
  
  for (const chapter of sortedChapters.value) {
    if (chapter.title) {
      // 有 title，重置計數
      lastTitle = chapter.title
      subPageCount = 0
      result.push({ ...chapter, displayTitle: chapter.title, isSubPage: false })
    } else {
      // 沒有 title，使用上一個 title + 計數
      subPageCount++
      const displayTitle = lastTitle ? `${lastTitle} (${subPageCount + 1})` : `(${subPageCount})`
      result.push({ ...chapter, displayTitle, isSubPage: true })
    }
  }
  
  return result
})

// 檢查是否為當前路徑
const isCurrentPath = (path: string) => {
  return currentPath.value === path
}

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
