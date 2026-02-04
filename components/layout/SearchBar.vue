<script setup lang="ts">
/**
 * SearchBar - 簡易搜尋欄元件
 * 
 * 提供內容搜尋功能，可放置於佈局系統的任何區塊
 */
const { t: themeT } = useTheme()
const { t } = useI18n()

const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref<any[]>([])
const showResults = ref(false)

// 搜尋內容
const search = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    showResults.value = false
    return
  }
  
  isSearching.value = true
  
  try {
    // 使用 Nuxt Content 的搜尋功能
    const results = await queryContent()
      .where({
        $or: [
          { title: { $icontains: searchQuery.value } },
          { description: { $icontains: searchQuery.value } },
        ],
        _partial: { $ne: true },
      })
      .only(['_path', 'title', 'description'])
      .limit(10)
      .find()
    
    searchResults.value = results
    showResults.value = true
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

// 關閉搜尋結果
const closeResults = () => {
  showResults.value = false
}

// 選擇搜尋結果
const selectResult = (path: string) => {
  navigateTo(path)
  searchQuery.value = ''
  showResults.value = false
}

// 點擊外部關閉
const searchContainer = ref<HTMLElement>()
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
      closeResults()
    }
  })
})
</script>

<template>
  <div ref="searchContainer" :class="themeT('search-bar')">
    <div :class="themeT('search-bar-input-wrapper')">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('search.placeholder')"
        :class="themeT('search-bar-input')"
        @input="debouncedSearch"
        @focus="searchQuery && (showResults = true)"
      />
      <span v-if="isSearching" :class="themeT('search-bar-loading')">⏳</span>
      <span v-else :class="themeT('search-bar-icon')">🔍</span>
    </div>
    
    <!-- 搜尋結果下拉 -->
    <div v-if="showResults" :class="themeT('search-bar-results')">
      <div v-if="searchResults.length === 0" :class="themeT('search-bar-no-results')">
        {{ t('search.noResults') }}
      </div>
      <ul v-else :class="themeT('search-bar-results-list')">
        <li
          v-for="result in searchResults"
          :key="result._path"
          :class="themeT('search-bar-result-item')"
          @click="selectResult(result._path)"
        >
          <span :class="themeT('search-bar-result-title')">{{ result.title || t('content.noDescription') }}</span>
          <span v-if="result.description" :class="themeT('search-bar-result-desc')">
            {{ result.description.slice(0, 60) }}{{ result.description.length > 60 ? '...' : '' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
