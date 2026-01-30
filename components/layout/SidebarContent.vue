<script setup lang="ts">
// 取得所有內容清單
const { data: contentList } = await useAsyncData('content-list', () => {
  return queryContent()
    .where({ _partial: { $ne: true } })
    .only(['_path', 'title', '_type', '_dir'])
    .find()
    .catch(() => [])
})

// 將扁平清單轉換為樹狀結構
const contentTree = computed(() => {
  if (!contentList.value) return []
  
  const tree: Record<string, { name: string, path: string, children: any[] }> = {}
  
  contentList.value.forEach((item: any) => {
    const parts = item._path.split('/').filter(Boolean)
    const rootDir = parts[0] || 'root'
    
    if (!tree[rootDir]) {
      tree[rootDir] = {
        name: rootDir,
        path: '/' + rootDir,
        children: []
      }
    }
    
    if (parts.length > 1) {
      tree[rootDir].children.push({
        path: item._path,
        title: item.title || parts[parts.length - 1]
      })
    }
  })
  
  return Object.values(tree)
})

// 追蹤展開狀態
const expandedFolders = ref<Set<string>>(new Set())

const toggleFolder = (folder: string) => {
  if (expandedFolders.value.has(folder)) {
    expandedFolders.value.delete(folder)
  } else {
    expandedFolders.value.add(folder)
  }
}

const isExpanded = (folder: string) => expandedFolders.value.has(folder)
const { t } = useTheme()
</script>

<template>
  <aside :class="t('sidebar-content')">
    <h3 :class="t('sidebar-content-title')">內容清單</h3>
    <nav>
      <ul :class="t('sidebar-content-list')">
        <li v-for="folder in contentTree" :key="folder.path">
          <button 
            @click="toggleFolder(folder.name)"
            :class="t('sidebar-content-folder-btn')"
          >
            <span>{{ folder.name }}</span>
            <span>{{ isExpanded(folder.name) ? '−' : '+' }}</span>
          </button>
          <ul v-if="isExpanded(folder.name)" :class="t('sidebar-content-children')">
            <li v-for="child in folder.children" :key="child.path">
              <NuxtLink 
                :to="child.path"
                :class="t('sidebar-content-link')"
              >
                {{ child.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>
