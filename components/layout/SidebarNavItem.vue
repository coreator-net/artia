<template>
  <li v-if="!hideEmptyTitle || item.title">
    <!-- 有子項目的資料夾 -->
    <template v-if="hasChildren || introPath">
      <div :class="t('sidebar-content-folder-row')">
        <button 
          @click="toggle"
          :class="t('sidebar-content-folder-btn')"
          :style="{ paddingLeft: `${depth * 0.75}rem` }"
          :title="item.title"
        >
          <span>{{ typeIcon }} {{ item.title }}</span>
          <span>{{ expanded ? '−' : '+' }}</span>
        </button>
        <button 
          v-if="introPath"
          @click="navigateToIntro"
          :class="t('sidebar-content-intro-btn')"
          title="查看介紹"
        >
          ℹ️
        </button>
      </div>
      <ul v-if="expanded && hasChildren" :class="t('sidebar-content-children')">
        <!-- 遞迴渲染子項目（過濾掉 _intro 和 _folder） -->
        <SidebarNavItem 
          v-for="child in filteredChildren" 
          :key="child._path"
          :item="child"
          :depth="depth + 1"
          :expanded-folders="expandedFolders"
          :hide-empty-title="hideEmptyTitle"
          @toggle="(path) => $emit('toggle', path)"
        />
      </ul>
    </template>
    <!-- 沒有子項目的單一文件 -->
    <template v-else>
      <NuxtLink 
        :to="item._path"
        :class="t('sidebar-content-link')"
        :style="{ paddingLeft: `${depth * 0.75}rem` }"
        :title="item.title"
      >
        {{ typeIcon }} {{ item.title }}
      </NuxtLink>
    </template>
  </li>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

interface ExtendedNavItem extends NavItem {
  type?: 'folder' | 'book' | 'page' | string
}

const props = defineProps<{
  item: ExtendedNavItem
  depth?: number
  expandedFolders: Set<string>
  hideEmptyTitle?: boolean
}>()

const emit = defineEmits<{
  toggle: [path: string]
}>()

const { t } = useTheme()

const depth = computed(() => props.depth ?? 0)

const expanded = computed(() => props.expandedFolders.has(props.item._path))

const toggle = () => {
  emit('toggle', props.item._path)
}

// 過濾子項目：過濾掉 type:book 和 type:folder 的項目
const filteredChildren = computed(() => {
  if (!props.item.children) return []
  return props.item.children.filter(child => {
    const childType = child.type
    // 只保留非 book 和非 folder 的項目（主要是 page）
    return childType !== 'book' && childType !== 'folder'
  })
})

// 判斷是否有可顯示的子項目
const hasChildren = computed(() => filteredChildren.value.length > 0)

// 查找資料夾下的 book 或 folder 類型的介紹檔案
const introItem = computed(() => {
  if (!props.item.children?.length) return null
  
  // 尋找 type 為 book 或 folder 的子項目
  return props.item.children.find(child => {
    const childType = child.type
    return childType === 'book' || childType === 'folder'
  })
})

const introPath = computed(() => introItem.value?._path || null)

// 判斷介紹檔案的類型
const introType = computed(() => introItem.value?.type || null)

// 導航到介紹頁面
const navigateToIntro = () => {
  if (introPath.value) {
    navigateTo(introPath.value)
  }
}

// 根據 type 顯示對應的 emoji
const typeIcon = computed(() => {
  // 如果有 children，優先根據 introType 判斷
  if (props.item.children?.length && introType.value) {
    return introType.value === 'book' ? '📖' : '📁'
  }
  
  // 否則根據 item.type 判斷
  const itemType = props.item.type
  switch (itemType) {
    case 'folder':
      return '📁'
    case 'book':
      return '📖'
    case 'page':
      return '📄'
    default:
      // 如果沒有 type，根據是否有 children 判斷
      return props.item.children?.length ? '📁' : '📄'
  }
})
</script>
