<script setup lang="ts">
/**
 * LayoutRecentContent - 最新內容區塊
 * 用於 layout 系統的可配置元件，清單式顯示，支援無限載入與搜尋
 */
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
const { t, locale } = useI18n()

// ========== 搜尋相關 ==========
const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref<any[]>([])

// ========== 排序相關 ==========
type SortOrder = 'desc' | 'asc'
const sortOrder = ref<SortOrder>('desc')

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  // 重置到第一頁
  currentPage.value = 1
  if (listRef.value) {
    listRef.value.scrollTop = 0
  }
}

// 搜尋內容
const search = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  
  try {
    const results = await queryContent()
      .where({
        $or: [
          { title: { $icontains: searchQuery.value } },
          { description: { $icontains: searchQuery.value } },
        ],
        _partial: { $ne: true },
      })
      .only(['_path', 'title', 'description', 'modifyTime', 'type'])
      .limit(50)
      .find()
    
    searchResults.value = results
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// 防抖搜尋
let debounceTimer: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(search, 300)
}

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

// 是否處於搜尋模式
const isSearchMode = computed(() => searchQuery.value.trim().length > 0)

// ========== 最新內容相關 ==========
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
    .find()
    .catch(() => [])
})

// 排序後的所有內容
const sortedAllPages = computed(() => {
  if (!allPages.value) return []
  const sorted = [...allPages.value].sort((a, b) => {
    const timeA = new Date(a.modifyTime || 0).getTime()
    const timeB = new Date(b.modifyTime || 0).getTime()
    return sortOrder.value === 'desc' ? timeB - timeA : timeA - timeB
  })
  return sorted
})

// 根據當前頁數顯示內容
const recentPages = computed(() => {
  return sortedAllPages.value.slice(0, currentPage.value * pageSize.value)
})

// 排序後的搜尋結果
const sortedSearchResults = computed(() => {
  if (!searchResults.value.length) return []
  return [...searchResults.value].sort((a, b) => {
    const timeA = new Date(a.modifyTime || 0).getTime()
    const timeB = new Date(b.modifyTime || 0).getTime()
    return sortOrder.value === 'desc' ? timeB - timeA : timeA - timeB
  })
})

// 最終顯示的內容（搜尋結果或最新內容）
const displayPages = computed(() => {
  if (isSearchMode.value) {
    return sortedSearchResults.value
  }
  return recentPages.value
})

// 是否還有更多內容（僅在非搜尋模式下有效）
const hasMore = computed(() => {
  if (isSearchMode.value) return false
  return recentPages.value.length < sortedAllPages.value.length
})

// 載入更多並滾動到新內容
const loadMore = () => {
  const previousCount = recentPages.value.length
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

// 當搜尋條件變化時，重置列表滾動位置
watch(searchQuery, () => {
  if (listRef.value) {
    listRef.value.scrollTop = 0
  }
})
</script>

<template>
  <section :class="themeT('recent-section')">
    <!-- 標題列：標題 + 排序按鈕 + 搜尋框 -->
    <div :class="themeT('recent-header')">
      <div :class="themeT('recent-header-left')">
        <h2 :class="themeT('recent-header-title')">
          {{ isSearchMode ? t('search.results') : t('section.recent') }}
          <span v-if="isSearchMode" :class="themeT('recent-search-count')">
            ({{ searchResults.length }})
          </span>
        </h2>
        <button 
          @click="toggleSortOrder" 
          :class="themeT('recent-sort-btn')"
          :title="sortOrder === 'desc' ? t('sort.newest') : t('sort.oldest')"
        >
          {{ sortOrder === 'desc' ? '↓' : '↑' }}
        </button>
      </div>
      <div :class="themeT('recent-search')">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('search.placeholder')"
          :class="themeT('recent-search-input')"
          @input="debouncedSearch"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          :class="themeT('recent-search-clear')"
        >✕</button>
        <span v-if="isSearching" :class="themeT('recent-search-icon')">⏳</span>
        <span v-else :class="themeT('recent-search-icon')">🔍</span>
      </div>
    </div>
    
    <!-- 無結果提示 -->
    <div v-if="isSearchMode && searchResults.length === 0 && !isSearching" :class="themeT('recent-no-results')">
      {{ t('search.noResults') }}
    </div>

    <!-- 內容列表 -->
    <ul v-if="displayPages.length > 0" ref="listRef" :class="themeT('recent-list')">
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
    
    <!-- 載入更多按鈕（僅在非搜尋模式下顯示） -->
    <button 
      v-if="hasMore" 
      @click="loadMore" 
      :class="themeT('recent-load-more')"
    >
      {{ t('content.loadMore') }}
    </button>
  </section>
</template>
