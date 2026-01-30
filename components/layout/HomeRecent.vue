<script setup lang="ts">
/**
 * LayoutHomeRecent - 最新內容區塊
 * 用於 layout 系統的可配置元件
 */
const config = useRuntimeConfig()
const { t } = useTheme()

// 取得最新的內容
const { data: recentBooks } = await useAsyncData('recent-books', () => {
  return queryContent()
    .where({ _type: { $in: ['Book', 'Folder'] } })
    .limit(6)
    .find()
    .catch(() => [])
})
</script>

<template>
  <section v-if="recentBooks && recentBooks.length > 0">
    <h2 :class="t('section-title')">{{ config.public.sectionRecent }}</h2>
    
    <ul :class="t('card-grid')">
      <li v-for="book in recentBooks" :key="book._path">
        <NuxtLink 
          :to="book._path"
          :class="t('card')"
        >
          <span :class="t('card-type')">{{ book._type || 'Content' }}</span>
          <h3 :class="t('card-title-lg')">{{ book.title || book._dir }}</h3>
          <p :class="t('card-desc')">{{ book.description || '點擊查看更多內容...' }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
