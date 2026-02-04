<script setup lang="ts">
/**
 * LayoutHomeRecent - 最新內容區塊
 * 用於 layout 系統的可配置元件
 */
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
const { t } = useI18n()

// 取得最新的內容
const { data: recentBooks } = await useAsyncData('recent-books', () => {
  return queryContent()
    .where({ type: { $in: ['page'] } })
    .limit(6)
    .find()
    .catch(() => [])
})
</script>

<template>
  <section v-if="recentBooks && recentBooks.length > 0">
    <h2 :class="themeT('section-title')">{{ config.public.sectionRecent }}</h2>
    
    <ul :class="themeT('card-grid')">
      <li v-for="book in recentBooks" :key="book._path">
        <NuxtLink 
          :to="book._path"
          :class="themeT('card')"
        >
          <span :class="themeT('card-type')">{{ book.type || 'Content' }}</span>
          <h3 :class="themeT('card-title-lg')">{{ book.title || book._dir }}</h3>
          <p :class="themeT('card-desc')">{{ book.description || t('content.clickForMore') }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
