<script setup lang="ts">
/**
 * LayoutPageContent - 頁面主要內容
 * 用於 layout 系統，渲染 Nuxt Content 內容
 */
import { sortContentItems } from '~/utils/contentSort'

interface ContentPage {
  _path?: string
  _dir?: string
  title?: string
  type?: string
  sortAnchor?: number[]
  bookCode?: string
  [key: string]: any
}

const route = useRoute()
const { t: themeT } = useTheme()

// 處理路徑（移除結尾斜線）
const path = computed(() => 
  route.path === '/' ? '/' : route.path.replace(/\/$/, '')
)

// 使用 server API 來支援密碼保護
const { data: page, error } = await useAsyncData('page-' + path.value, () => {
  return $fetch<any>(`/api/content${path.value}`)
})

// 取得同資料夾的 page 列表以便排序與前後頁導覽
const siblings = ref<ContentPage[]>([])

watchEffect(async () => {
  if (!page.value) return
  
  // 優先使用 bookCode，否則用 _dir
  const bookCode = page.value.bookCode
  if (bookCode) {
    const list = await queryContent().where({ bookCode }).find()
    siblings.value = sortContentItems(list, { filterPages: true })
  } else if (page.value._dir) {
    const dirRaw = page.value._dir as string
    const dirWithSlash = dirRaw.startsWith('/') ? dirRaw : `/${dirRaw}`
    const list = await queryContent().where({ _dir: dirWithSlash }).find()
    siblings.value = sortContentItems(list, { filterPages: true })
  }
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

const isPageContent = computed(() => {
  const content = displayContent.value as any
  return content?.type === 'page' || content?.type === 'markdown' || Array.isArray(content?.sortAnchor)
})
</script>

<template>
  <article :class="themeT('page-article')">
    <section v-if="error">
      <p>Error: {{ error.message }}</p>
    </section>
    <section v-else-if="!page">
      <p>Loading or not found: {{ route.path }} (normalized: {{ path }})</p>
    </section>
    <section v-else>
      <!-- 顯示密碼提示 -->
      <LayoutPageContentPasswordPrompt 
        v-if="showPasswordPrompt"
        @authenticated="handleAuthenticated"
      />
      
      <!-- 顯示內容 -->
      <ContentRenderer
        v-else
        :value="displayContent"
        :class="[themeT('content-renderer'), 'prose prose-lg max-w-none']"
      >
        <template #empty>
          <p>No content available</p>
        </template>
      </ContentRenderer>
      
      <!-- 前後頁導覽（僅 page 類型顯示） -->
      <LayoutPageContentNavigation
        v-if="isPageContent"
        :siblings="siblings"
        :current-path="page._path"
      />
    </section>
  </article>
</template>


