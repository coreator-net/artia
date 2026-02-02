<script setup lang="ts">
/**
 * SearchBar - 簡易搜尋欄元件
 * 
 * 提供內容搜尋功能，可放置於佈局系統的任何區塊
 */
const { t } = useTheme()

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
  <div ref="searchContainer" :class="t('search-bar')">
    <div :class="t('search-bar-input-wrapper')">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="'搜尋內容...'"
        :class="t('search-bar-input')"
        @input="debouncedSearch"
        @focus="searchQuery && (showResults = true)"
      />
      <span v-if="isSearching" :class="t('search-bar-loading')">⏳</span>
      <span v-else :class="t('search-bar-icon')">🔍</span>
    </div>
    
    <!-- 搜尋結果下拉 -->
    <div v-if="showResults" :class="t('search-bar-results')">
      <div v-if="searchResults.length === 0" :class="t('search-bar-no-results')">
        找不到相關內容
      </div>
      <ul v-else :class="t('search-bar-results-list')">
        <li
          v-for="result in searchResults"
          :key="result._path"
          :class="t('search-bar-result-item')"
          @click="selectResult(result._path)"
        >
          <span :class="t('search-bar-result-title')">{{ result.title || '無標題' }}</span>
          <span v-if="result.description" :class="t('search-bar-result-desc')">
            {{ result.description.slice(0, 60) }}{{ result.description.length > 60 ? '...' : '' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
