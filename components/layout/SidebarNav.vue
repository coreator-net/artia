<template>
  <aside :class="t(classPrefix)">
    <h3 :class="t(`${classPrefix}-title`)">{{ title }}</h3>
    <nav>
      <ul :class="t(`${classPrefix}-list`)">
        <!-- 使用遞迴元件渲染多層結構 -->
        <LayoutSidebarNavItem 
          v-for="item in navigation" 
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
