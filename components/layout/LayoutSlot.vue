<script setup lang="ts">
/**
 * LayoutSlot - 動態佈局插槽元件
 * 
 * 根據 useLayout 的設定動態渲染指定位置的元件
 * 支援單一或多個元件（用逗號分隔設定）
 */

const props = defineProps<{
  /** 頁面類型 */
  page: 'home' | 'read'
  /** 位置 */
  position: 'top' | 'left' | 'center' | 'right' | 'bottom'
}>()

const { getRawSlotConfigs } = useLayout()

// 取得此位置的所有元件類型
const slotTypes = computed(() => getRawSlotConfigs(props.page, props.position))
</script>

<template>
  <!-- 根據設定渲染對應元件（支援多個） -->
  <template v-for="(slotType, index) in slotTypes" :key="index">
    <LayoutSidebarAuthor v-if="slotType === 'author'" />
    <LayoutSidebarContent v-else-if="slotType === 'navigation'" />
    <LayoutTableOfContents v-else-if="slotType === 'toc'" />
    <LayoutHomeHero v-else-if="slotType === 'hero'" />
    <LayoutHomeFeatured v-else-if="slotType === 'featured'" />
    <LayoutHomeRecent v-else-if="slotType === 'recent'" />
    <LayoutSearchBar v-else-if="slotType === 'search'" />
    <!-- none 或無效值則不渲染任何東西 -->
  </template>
</template>
