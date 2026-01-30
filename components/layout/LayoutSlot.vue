<script setup lang="ts">
/**
 * LayoutSlot - 動態佈局插槽元件
 * 
 * 根據 useLayout 的設定動態渲染指定位置的元件
 */

const props = defineProps<{
  /** 頁面類型 */
  page: 'home' | 'read'
  /** 位置 */
  position: 'top' | 'left' | 'center' | 'right' | 'bottom'
}>()

const { getRawSlotConfig } = useLayout()

// 取得此位置的元件類型
const slotType = computed(() => getRawSlotConfig(props.page, props.position))
</script>

<template>
  <!-- 根據設定渲染對應元件 -->
  <LayoutSidebarAuthor v-if="slotType === 'author'" />
  <LayoutSidebarContent v-else-if="slotType === 'navigation'" />
  <LayoutTableOfContents v-else-if="slotType === 'toc'" />
  <LayoutHomeHero v-else-if="slotType === 'hero'" />
  <LayoutHomeFeatured v-else-if="slotType === 'featured'" />
  <LayoutHomeRecent v-else-if="slotType === 'recent'" />
  <!-- none 或無效值則不渲染任何東西 -->
</template>
