<script setup lang="ts">
// 首頁

// 取得環境變數配置
const config = useRuntimeConfig()

// DEBUG: 取得所有內容的完整結構
const { data: allContent } = await useAsyncData('all-content-debug', () => {
  return queryContent()
    .find()
    .catch(() => [])
})

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
  <article class="artia-page-theme-classic">
    <!-- DEBUG: 顯示所有 content front matter -->
    <section class="artia-debug-theme-classic">
      <h2 class="artia-debug-title-theme-classic">DEBUG: Content Front Matter</h2>
      <pre class="artia-debug-content-theme-classic">{{ JSON.stringify(allContent, null, 2) }}</pre>
    </section>

    <!-- Hero Section -->
    <header class="artia-hero-theme-classic">
      <h1 class="artia-hero-title-theme-classic">{{ config.public.siteTitle }}</h1>
      <p class="artia-hero-desc-theme-classic">
        {{ config.public.siteDescription }}
      </p>
      <nav class="artia-hero-actions-theme-classic">
        <NuxtLink to="/content" class="artia-btn-primary-theme-classic">
          {{ config.public.ctaPrimary }}
        </NuxtLink>
        <button class="artia-btn-secondary-theme-classic">{{ config.public.ctaSecondary }}</button>
      </nav>
    </header>

    <!-- Featured Works -->
    <section v-if="featuredWorks && featuredWorks.length > 0">
      <h2 class="artia-section-title-theme-classic">{{ config.public.sectionFeatured }}</h2>
      
      <ul class="artia-card-list-theme-classic">
        <li v-for="work in featuredWorks" :key="work._path">
          <NuxtLink 
            :to="work._path"
            class="artia-card-featured-theme-classic"
          >
            <figure class="artia-card-header-theme-classic">
              <figcaption class="artia-card-avatar-theme-classic">
                {{ work.title?.charAt(0) || 'A' }}
              </figcaption>
              <hgroup>
                <h3 class="artia-card-title-theme-classic">{{ work.title }}</h3>
                <time class="artia-card-meta-theme-classic">{{ work.modifyTime ? new Date(work.modifyTime).toLocaleDateString('zh-TW') : '' }}</time>
              </hgroup>
            </figure>
            <p class="artia-card-desc-theme-classic">{{ work.description || '點擊查看更多...' }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Recent Content -->
    <section v-if="recentBooks && recentBooks.length > 0">
      <h2 class="artia-section-title-theme-classic">{{ config.public.sectionRecent }}</h2>
      
      <ul class="artia-card-grid-theme-classic">
        <li v-for="book in recentBooks" :key="book._path">
          <NuxtLink 
            :to="book._path"
            class="artia-card-theme-classic"
          >
            <span class="artia-card-type-theme-classic">{{ book._type || 'Content' }}</span>
            <h3 class="artia-card-title-lg-theme-classic">{{ book.title || book._dir }}</h3>
            <p class="artia-card-desc-theme-classic">{{ book.description || '點擊查看更多內容...' }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </article>
</template>
