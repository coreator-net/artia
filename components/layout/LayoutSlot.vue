<script setup lang="ts">
/**
 * LayoutSlot - 動態佈局插槽元件
 * 
 * 根據 useLayout 的設定動態渲染指定位置的元件
 * 支援單一或多個元件（用逗號分隔設定）
 * 支援元件參數（使用 : 分隔）
 * 
 * 格式範例：
 * - navigation - 無參數
 * - navigation:root=/content - 帶參數
 * - navigation:root=/content;title=我的導航 - 多參數
 */

const props = defineProps<{
  /** 頁面類型 */
  page: 'home' | 'read'
  /** 位置 */
  position: 'top' | 'left' | 'center' | 'right' | 'bottom'
}>()

const { getParsedSlotConfigs } = useLayout()

// 取得此位置的所有元件設定（包含 props）
const slotConfigs = computed(() => getParsedSlotConfigs(props.page, props.position))

const wrapperClass = computed(() => {
  const base = 'flex flex-col gap-6'

  // 在 Holy Grail（lg:flex-row）中，left/right slot 是「欄位」。
  // 需要固定寬度，避免內容撐開整個 sidebar
  if (props.position === 'left' || props.position === 'right') {
    return `${base} w-56 shrink-0`
  }

  // top/center/bottom 需要撐滿容器寬度
  return `${base} w-full`
})
</script>

<template>
  <!--
    注意：LayoutSlot 必須只有一個根節點。
    否則當 slotConfigs 有多個元件時，會變成多個同層節點插入 Holy Grail 的 flex-row，
    視覺上就會「左右排」而不是同一欄位的「上下排」。
  -->
  <div :class="wrapperClass">
    <!-- 根據設定渲染對應元件（支援多個，並傳遞 props） -->
    <template v-for="(config, index) in slotConfigs" :key="index">
      <LayoutSidebarAuthor v-if="config.type === 'author'" />
      <LayoutSidebarNav 
        v-else-if="config.type === 'navigation'" 
        :root-path="config.props.root"
        :title="config.props.title"
      />
      <LayoutSidebarBookMenu 
        v-else-if="config.type === 'bookmenu'" 
        :title="config.props.title"
      />
      <LayoutTableOfContents v-else-if="config.type === 'toc'" />
      <LayoutHistoryTimeline v-else-if="config.type === 'history'" />
      <LayoutHomeHero v-else-if="config.type === 'hero'" />
      <LayoutFeaturedBooks v-else-if="config.type === 'featured'" />
      <LayoutHomeRecent v-else-if="config.type === 'recent'" />
      <LayoutSearchBar v-else-if="config.type === 'search'" />
      <!-- none 或無效值則不渲染任何東西 -->
    </template>
  </div>
</template>
