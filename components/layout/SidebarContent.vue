<template>
  <aside :class="t('sidebar-content')">
    <h3 :class="t('sidebar-content-title')">內容清單</h3>
    <nav>
      <ul :class="t('sidebar-content-list')">
        <!-- 使用遞迴元件渲染多層結構 -->
        <LayoutSidebarNavItem 
          v-for="item in navigation" 
          :key="item._path"
          :item="item"
          :depth="0"
          :expanded-folders="expandedFolders"
          @toggle="toggleFolder"
        />
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
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
