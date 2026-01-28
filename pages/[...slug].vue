<script setup lang="ts">
const route = useRoute()

// 處理路徑（移除結尾斜線）
const path = route.path === '/' ? '/' : route.path.replace(/\/$/, '')

// Nuxt Content v2 API - 使用 server API 來支援密碼保護
const { data: page, error } = await useAsyncData('page-' + path, () => {
  return $fetch<any>(`/api/content${path}`)
})

// 追蹤是否已驗證密碼
const authenticatedContent = ref<any>(null)
const showPasswordPrompt = computed(() => {
  return (page.value as any)?._passwordRequired && !authenticatedContent.value
})

// 處理密碼驗證成功
const handleAuthenticated = (content: any) => {
  authenticatedContent.value = content
}

// 決定要顯示的內容
const displayContent = computed(() => {
  return authenticatedContent.value || page.value
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
    <div v-else>
      <!-- 顯示密碼提示 -->
      <PasswordPrompt 
        v-if="showPasswordPrompt"
        @authenticated="handleAuthenticated"
      />
      
      <!-- 顯示內容 -->
      <ContentRenderer
        v-else
        :value="displayContent"
      >
        <template #empty>
          <p>No content available</p>
        </template>
      </ContentRenderer>
    </div>
  </div>
</template>
