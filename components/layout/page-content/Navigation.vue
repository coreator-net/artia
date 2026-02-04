<script setup lang="ts">
/**
 * PageNavigation - 頁面導覽元件
 * 顯示上一頁、下一頁以及頁碼選擇器
 */

interface ContentPage {
  _path?: string
  _dir?: string
  title?: string
  type?: string
  sortAnchor?: number[]
  bookCode?: string
  [key: string]: any
}

interface Props {
  siblings: ContentPage[]
  currentPath: string
}

const props = defineProps<Props>()
const { t: themeT } = useTheme()
const { t } = useI18n()
const router = useRouter()

// 滑動手勢處理
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const diff = touchStartX.value - touchEndX.value
  const threshold = 50 // 最小滑動距離
  
  if (Math.abs(diff) < threshold) return
  
  if (diff > 0) {
    // 左滑 -> 下一頁
    if (nextPage.value?._path) {
      router.push(nextPage.value._path)
    }
  } else {
    // 右滑 -> 上一頁
    if (prevPage.value?._path) {
      router.push(prevPage.value._path)
    }
  }
}

onMounted(() => {
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})

// 計算當前頁索引
const currentIndex = computed(() => {
  return props.siblings.findIndex((item) => item._path === props.currentPath)
})

// 計算上一頁
const prevPage = computed(() => {
  const idx = currentIndex.value
  if (idx > 0) return props.siblings[idx - 1]
  return null
})

// 計算下一頁
const nextPage = computed(() => {
  const idx = currentIndex.value
  if (idx >= 0 && idx < props.siblings.length - 1) return props.siblings[idx + 1]
  return null
})

// 計算要顯示的頁碼（智能省略）
const displayPageNumbers = computed(() => {
  const total = props.siblings.length
  const current = currentIndex.value
  
  if (total <= 4) {
    // 4 頁或以下，顯示所有
    return props.siblings.map((_, i) => ({ index: i, isEllipsis: false }))
  }
  
  const result: Array<{ index: number; isEllipsis: boolean }> = []
  
  if (current <= 1) {
    // 當前頁在最前面：1 2 3 ... N
    for (let i = 0; i < 3; i++) {
      result.push({ index: i, isEllipsis: false })
    }
    result.push({ index: -1, isEllipsis: true })
    result.push({ index: total - 1, isEllipsis: false })
  } else if (current >= total - 2) {
    // 當前頁在最後面：1 ... N-2 N-1 N
    result.push({ index: 0, isEllipsis: false })
    result.push({ index: -1, isEllipsis: true })
    for (let i = total - 3; i < total; i++) {
      result.push({ index: i, isEllipsis: false })
    }
  } else {
    // 當前頁在中間：1 ... current current+1 ... N
    result.push({ index: 0, isEllipsis: false })
    result.push({ index: -1, isEllipsis: true })
    result.push({ index: current, isEllipsis: false })
    result.push({ index: current + 1, isEllipsis: false })
    result.push({ index: -2, isEllipsis: true })
    result.push({ index: total - 1, isEllipsis: false })
  }
  
  return result
})
</script>

<template>
  <nav v-if="siblings.length > 0" :class="themeT('page-pagination')">
    <NuxtLink
      v-if="prevPage"
      :to="prevPage._path"
      :class="themeT('page-pagination-prev')"
    >
      ← {{ prevPage.title || t('page.prev') }}
    </NuxtLink>
    <span v-else></span>
    
    <!-- 頁碼選擇器 -->
    <div :class="themeT('page-numbers')">
      <template v-for="(pageItem, idx) in displayPageNumbers" :key="idx">
        <span v-if="pageItem.isEllipsis" :class="themeT('page-ellipsis')">
          ...
        </span>
        <NuxtLink
          v-else
          :to="siblings[pageItem.index]._path"
          :class="[
            themeT('page-number'),
            currentIndex === pageItem.index ? themeT('page-number-active') : ''
          ]"
        >
          {{ pageItem.index + 1 }}
        </NuxtLink>
      </template>
    </div>
    
    <NuxtLink
      v-if="nextPage"
      :to="nextPage._path"
      :class="themeT('page-pagination-next')"
    >
      {{ nextPage.title || t('page.next') }} →
    </NuxtLink>
    <span v-else></span>
  </nav>
</template>

<style scoped>
.page-pagination {
  @apply flex justify-between items-center gap-4;
}

.page-numbers {
  @apply flex gap-2 items-center flex-wrap;
}

.page-number {
  @apply px-3 py-1 rounded border transition-colors;
}

.page-number-active {
  @apply bg-blue-500 text-white border-blue-500;
}

.page-ellipsis {
  @apply px-2 text-gray-400;
}
</style>
