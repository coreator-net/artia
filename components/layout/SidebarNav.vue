<template>
  <aside :class="themeT(classPrefix)">
    <h3 :class="themeT(`${classPrefix}-title`)">{{ displayTitle }}</h3>
    <nav>
      <ul :class="themeT(`${classPrefix}-list`)">
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
      <!-- 調試信息 -->
      <div v-if="sortedNavigation.length === 0" style="padding: 1rem; color: #999;">
        {{ t('sidebar.loading') }} (navigation: {{ navigation ? 'exists' : 'null' }}, length: {{ navigation?.length || 0 }})
      </div>
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
  hideEmptyTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  classPrefix: 'sidebar-content',
  hideEmptyTitle: true
})

const { t: themeT } = useTheme()
const { t } = useI18n()

const displayTitle = computed(() => props.title || t('sidebar.title'))

// 直接在 setup 中載入資料
const navigation = ref<ExtendedNavItem[]>([])

// 1. 取得樹狀結構（包含資料夾）
const navTree = await fetchContentNavigation()

// 2. 取得所有文件的自訂欄位
const content = await queryContent()
  .where({ _draft: { $ne: true }, _partial: { $ne: true } })
  .only(['_path', 'type', 'sortAnchor'])
  .find()

// 3. 建立 path -> metadata 的對應
const metadataMap = new Map<string, { type?: string; sortAnchor?: number[] }>(
  content
    .filter(item => item._path)
    .map(item => [item._path!, { type: item.type, sortAnchor: item.sortAnchor }])
)

// 4. 將 metadata 合併到導航樹
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

const sortedNavigation = computed(() => {
  if (!navigation.value || navigation.value.length === 0) return []
  
  return sortContentItems(navigation.value as ExtendedNavItem[], {
    prioritizeFolders: true,
    recursive: true
  })
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
