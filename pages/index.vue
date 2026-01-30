<script setup lang="ts">
// 首頁

// 取得環境變數配置
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

// 精選作品：最近更新的前三篇文章
const { data: featuredWorks } = await useAsyncData('featured-works', () => {
  return queryContent()
    .only(['_path', 'title', 'description', 'modifyTime'])
    .sort({ modifyTime: -1 })
    .limit(3)
    .find()
    .catch(() => [])
})
</script>

<template>
  <article :class="t('page')">
    <!-- Hero Section -->
    <header :class="t('hero')">
      <h1 :class="t('hero-title')">{{ config.public.siteTitle }}</h1>
      <p :class="t('hero-desc')">
        {{ config.public.siteDescription }}
      </p>
      <nav :class="t('hero-actions')">
        <NuxtLink to="/content" :class="t('btn-primary')">
          {{ config.public.ctaPrimary }}
        </NuxtLink>
        <button :class="t('btn-secondary')">{{ config.public.ctaSecondary }}</button>
      </nav>
    </header>

    <!-- Featured Works -->
    <section v-if="featuredWorks && featuredWorks.length > 0">
      <h2 :class="t('section-title')">{{ config.public.sectionFeatured }}</h2>
      
      <ul :class="t('card-list')">
        <li v-for="work in featuredWorks" :key="work._path">
          <NuxtLink 
            :to="work._path"
            :class="t('card-featured')"
          >
            <figure :class="t('card-header')">
              <figcaption :class="t('card-avatar')">
                {{ work.title?.charAt(0) || 'A' }}
              </figcaption>
              <hgroup>
                <h3 :class="t('card-title')">{{ work.title }}</h3>
                <time :class="t('card-meta')">{{ work.modifyTime ? new Date(work.modifyTime).toLocaleDateString('zh-TW') : '' }}</time>
              </hgroup>
            </figure>
            <p :class="t('card-desc')">{{ work.description || '點擊查看更多...' }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Recent Content -->
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
  </article>
</template>
