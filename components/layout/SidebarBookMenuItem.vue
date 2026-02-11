<template>
  <li>
    <!-- 有子項目的資料夾（章節群組） -->
    <template v-if="hasChildren">
      <div :class="themeT('sidebar-content-folder-row')">
        <button 
          @click="toggle"
          :class="themeT('sidebar-content-folder-btn')"
          :style="{ paddingLeft: `${depth * 0.75}rem` }"
          :title="displayTitle"
        >
          <span>📁 {{ displayTitle }}</span>
          <span>{{ expanded ? '−' : '+' }}</span>
        </button>
      </div>
      <ul v-if="expanded && hasChildren" :class="themeT('sidebar-content-children')">
        <SidebarBookMenuItem 
          v-for="child in filteredChildren" 
          :key="child._path"
          :item="child"
          :depth="depth + 1"
          :current-path="currentPath"
          :expanded-folders="expandedFolders"
          @toggle="(path) => $emit('toggle', path)"
        />
      </ul>
    </template>
    <!-- 沒有子項目的單一頁面（章節） -->
    <template v-else>
      <NuxtLink 
        :to="item._path"
        :class="[themeT('sidebar-content-link'), { 'font-bold': isCurrent }]"
        :style="{ paddingLeft: `${effectiveDepth * 0.75}rem` }"
        :title="displayTitle || item._path"
      >
        {{ icon }} {{ displayTitle }}
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
  displayTitle?: string
  isSubPage?: boolean
  depth?: number
  currentPath: string
  expandedFolders: Set<string>
}>()

const emit = defineEmits<{
  toggle: [path: string]
}>()

const { t: themeT } = useTheme()

const depth = computed(() => props.depth ?? 0)

const expanded = computed(() => props.expandedFolders.has(props.item._path))

const isCurrent = computed(() => props.currentPath === props.item._path)

// 顯示標題：優先使用傳入的 displayTitle，否則使用 item.title
const displayTitle = computed(() => props.displayTitle ?? props.item.title ?? '')

// 是否為子頁面
const isSubPage = computed(() => props.isSubPage ?? !props.item.title)

// icon：子頁面用圓點，其他用文件圖示
const icon = computed(() => isSubPage.value ? '•' : '📄')

// 有效縮排深度：子頁面多一層縮排
const effectiveDepth = computed(() => isSubPage.value ? depth.value + 1 : depth.value)

const toggle = () => {
  emit('toggle', props.item._path)
}

// 過濾子項目：過濾掉 type:book 和 type:folder 的項目
const filteredChildren = computed(() => {
  if (!props.item.children) return []
  return props.item.children.filter(child => {
    const childType = child.type
    return childType !== 'book' && childType !== 'folder'
  })
})

const hasChildren = computed(() => filteredChildren.value.length > 0)
</script>
