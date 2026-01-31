<template>
  <li>
    <!-- 有子項目的資料夾 -->
    <template v-if="item.children?.length">
      <button 
        @click="toggle"
        :class="t('sidebar-content-folder-btn')"
        :style="{ paddingLeft: `${depth * 0.75}rem` }"
      >
        <span>{{ item.title }}</span>
        <span>{{ expanded ? '−' : '+' }}</span>
      </button>
      <ul v-if="expanded" :class="t('sidebar-content-children')">
        <!-- 遞迴渲染子項目 -->
        <SidebarNavItem 
          v-for="child in item.children" 
          :key="child._path"
          :item="child"
          :depth="depth + 1"
          :expanded-folders="expandedFolders"
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
      >
        {{ item.title }}
      </NuxtLink>
    </template>
  </li>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const props = defineProps<{
  item: NavItem
  depth?: number
  expandedFolders: Set<string>
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
</script>
