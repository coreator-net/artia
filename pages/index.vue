<script setup lang="ts">
/**
 * 首頁
 * 使用 home layout，內容由 .env 中的 LAYOUT_HOME_* 設定決定
 */
definePageMeta({
  layout: 'home'
})

const { t } = useTheme()
const { isSlotEnabled } = useLayout()

// 檢查中央區域是否有配置元件
// 如果沒有，則使用預設的 hero + featured + recent
const hasCenterConfig = computed(() => isSlotEnabled('home', 'center'))
</script>

<template>
  <article :class="t('page')">
    <!-- 如果中央區域沒有配置，使用預設內容 -->
    <template v-if="!hasCenterConfig">
      <LayoutHomeHero />
      <LayoutHomeFeatured />
      <LayoutHomeRecent />
    </template>
    <!-- 如果有配置，LayoutSlot 會在 layout 中渲染 -->
  </article>
</template>
