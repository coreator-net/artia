<script setup lang="ts">
/**
 * 閱讀頁 - 動態內容頁面
 * 使用 read layout，內容由 .env 中的 LAYOUT_READ_* 設定決定
 * 將邏輯集中到 LayoutPageContent
 */
definePageMeta({
  layout: 'read'
})
</script>

<template>
  <LayoutPageContent />
</template>
