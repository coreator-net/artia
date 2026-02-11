<script setup lang="ts">
/**
 * LayoutHomeRecent - 最新內容區塊
 * 用於 layout 系統的可配置元件，清單式顯示，支援無限載入
 */
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
const { t, locale } = useI18n()

// 從 .env 取得每頁顯示筆數
const pageSize = computed(() => {
  const limit = parseInt(config.public.recentLimit as string, 10)
  return isNaN(limit) ? 6 : limit
})

// 當前頁數
const currentPage = ref(1)

// 列表容器 ref
const listRef = ref<HTMLUListElement | null>(null)

// 取得所有內容（一次性載入，由前端分頁）
const { data: allPages } = await useAsyncData('recent-pages', () => {
  return queryContent()
    .where({ type: { $in: ['page'] } })
    .only(['_path', 'title', 'description', 'modifyTime', 'type'])
    .sort({ modifyTime: -1 })
    .find()
    .catch(() => [])
})

// 根據當前頁數顯示內容
const displayPages = computed(() => {
  if (!allPages.value) return []
  return allPages.value.slice(0, currentPage.value * pageSize.value)
})

// 是否還有更多內容
const hasMore = computed(() => {
  if (!allPages.value) return false
  return displayPages.value.length < allPages.value.length
})

// 載入更多並滾動到新內容
const loadMore = () => {
  const previousCount = displayPages.value.length
  currentPage.value++
  
  // 等待 DOM 更新後滾動到新載入的第一項
  nextTick(() => {
    if (listRef.value) {
      const items = listRef.value.querySelectorAll(':scope > li')
      const newFirstItem = items[previousCount] as HTMLElement
      if (newFirstItem) {
        // 計算相對於列表容器的位置
        const containerTop = listRef.value.getBoundingClientRect().top
        const itemTop = newFirstItem.getBoundingClientRect().top
        const scrollOffset = listRef.value.scrollTop + (itemTop - containerTop)
        
        listRef.value.scrollTo({
          top: scrollOffset,
          behavior: 'smooth'
        })
      }
    }
  })
}

/**
 * 簡單解析 Markdown 為 HTML（僅處理基本格式）
 */
const parseSimpleMarkdown = (text: string): string => {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <section v-if="displayPages && displayPages.length > 0" :class="themeT('recent-section')">
    <h2 :class="themeT('section-title')">{{ config.public.sectionRecent }}</h2>
    
    <ul ref="listRef" :class="themeT('recent-list')">
      <li v-for="(page, index) in displayPages" :key="page._path" :data-index="index">
        <NuxtLink :to="page._path" :class="themeT('recent-item')">
          <div :class="themeT('recent-item-header')">
            <h3 :class="themeT('recent-item-title')">{{ page.title }}</h3>
            <time :class="themeT('recent-item-time')">{{ 
              page.modifyTime 
                ? new Date(page.modifyTime).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'en-US')
                : ''
            }}</time>
          </div>
          <p 
            :class="themeT('recent-item-desc')" 
            v-html="parseSimpleMarkdown(page.description) || t('content.clickForMore')"
          ></p>
        </NuxtLink>
      </li>
    </ul>
    
    <button 
      v-if="hasMore" 
      @click="loadMore" 
      :class="themeT('recent-load-more')"
    >
      {{ t('content.loadMore') }}
    </button>
  </section>
</template>
