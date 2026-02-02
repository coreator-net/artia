<script setup lang="ts">
/**
 * LayoutPageContent - 頁面主要內容
 * 用於 layout 系統，渲染 Nuxt Content 內容
 */
const route = useRoute()
const { t } = useTheme()

// 處理路徑（移除結尾斜線）
const path = computed(() => 
  route.path === '/' ? '/' : route.path.replace(/\/$/, '')
)

// 使用 server API 來支援密碼保護
const { data: page, error } = await useAsyncData('page-' + path.value, () => {
  return $fetch<any>(`/api/content${path.value}`)
})

// 取得同資料夾的 page 列表以便排序與前後頁導覽
const siblings = ref<any[]>([])

const compareAnchors = (aItem: any, bItem: any) => {
  const aArr = Array.isArray(aItem?.sortAnchor)
    ? aItem.sortAnchor
    : aItem?.type === 'page'
    ? [Number.POSITIVE_INFINITY]
    : []
  const bArr = Array.isArray(bItem?.sortAnchor)
    ? bItem.sortAnchor
    : bItem?.type === 'page'
    ? [Number.POSITIVE_INFINITY]
    : []
  const maxLen = Math.max(aArr.length, bArr.length)
  for (let i = 0; i < maxLen; i++) {
    const aVal = aArr[i] ?? 0
    const bVal = bArr[i] ?? 0
    if (aVal !== bVal) return aVal - bVal
  }
  return 0
}

const sortPages = (items: any[] = []) => {
  return [...items]
    .filter((item) => Array.isArray(item?.sortAnchor) || item?.type === 'page')
    .sort((a, b) => {
      const anchorDiff = compareAnchors(a, b)
      if (anchorDiff !== 0) return anchorDiff

      if (a.title && b.title) return a.title.localeCompare(b.title)
      if (a.title) return -1
      if (b.title) return 1

      return (a._path || '').localeCompare(b._path || '')
    })
}

const currentIndex = computed(() => {
  return siblings.value.findIndex((item) => item._path === page.value?._path)
})

const prevPage = computed(() => {
  const idx = currentIndex.value
  if (idx > 0) return siblings.value[idx - 1]
  return null
})

const nextPage = computed(() => {
  const idx = currentIndex.value
  if (idx >= 0 && idx < siblings.value.length - 1) return siblings.value[idx + 1]
  return null
})

watchEffect(async () => {
  if (!page.value || !page.value._dir) return
  const dirRaw = page.value._dir as string
  const dirWithSlash = dirRaw.startsWith('/') ? dirRaw : `/${dirRaw}`
  const list = await queryContent().where({ _dir: dirWithSlash }).find()

  siblings.value = sortPages(list)
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
  <article :class="t('page-article')">
    <section v-if="error">
      <p>Error: {{ error.message }}</p>
    </section>
    <section v-else-if="!page">
      <p>Loading or not found: {{ route.path }} (normalized: {{ path }})</p>
    </section>
    <section v-else>
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
      <!-- 前後頁導覽（僅 page 類型顯示） -->
      <nav v-if="isPageContent" :class="t('page-pagination')">
        <NuxtLink
          v-if="prevPage"
          :to="prevPage._path"
          :class="t('page-pagination-prev')"
        >
          ← {{ prevPage.title || '上一頁' }}
        </NuxtLink>
        <NuxtLink
          v-if="nextPage"
          :to="nextPage._path"
          :class="t('page-pagination-next')"
        >
          {{ nextPage.title || '下一頁' }} →
        </NuxtLink>
      </nav>
    </section>
  </article>
</template>
