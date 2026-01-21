<script setup lang="ts">
const route = useRoute()

// 處理路徑（移除結尾斜線）
const path = route.path === '/' ? '/' : route.path.replace(/\/$/, '')

// Nuxt Content v2 API
const { data: page, error } = await useAsyncData('page-' + path, () => {
  return queryContent(path).findOne()
})
</script>

<template>
  <div>
    <div v-if="error">
      <p>Error: {{ error.message }}</p>
    </div>
    <div v-else-if="!page">
      <p>Loading or not found: {{ route.path }} (normalized: {{ path }})</p>
    </div>
    <ContentRenderer
      v-else
      :value="page"
    />
  </div>
</template>
