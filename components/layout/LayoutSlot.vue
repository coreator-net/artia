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

const wrapperClass = computed(() => {
  const base = 'flex flex-col gap-6'

  // 在 Holy Grail（lg:flex-row）中，left/right slot 是「欄位」。
  // 這裡若用 w-full 會把欄位撐到全寬，導致 CENTER 看起來「壞掉」。
  if (props.position === 'left' || props.position === 'right') {
    return `${base} shrink-0`
  }

  // top/center/bottom 需要撐滿容器寬度
  return `${base} w-full`
})
</script>

<template>
  <!--
    注意：LayoutSlot 必須只有一個根節點。
    否則當 slotTypes 有多個元件時，會變成多個同層節點插入 Holy Grail 的 flex-row，
    視覺上就會「左右排」而不是同一欄位的「上下排」。
  -->
  <div :class="wrapperClass">
    <!-- 根據設定渲染對應元件（支援多個） -->
    <template v-for="(slotType, index) in slotTypes" :key="index">
      <LayoutSidebarAuthor v-if="slotType === 'author'" />
      <LayoutSidebarContent v-else-if="slotType === 'navigation'" />
      <LayoutSidebarContentNoTitle v-else-if="slotType === 'navigation-notitle'" />
      <LayoutTableOfContents v-else-if="slotType === 'toc'" />
      <LayoutHistoryTimeline v-else-if="slotType === 'history'" />
      <LayoutHomeHero v-else-if="slotType === 'hero'" />
      <LayoutHomeFeatured v-else-if="slotType === 'featured'" />
      <LayoutHomeRecent v-else-if="slotType === 'recent'" />
      <LayoutSearchBar v-else-if="slotType === 'search'" />
      <!-- none 或無效值則不渲染任何東西 -->
    </template>
  </div>
</template>
