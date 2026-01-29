<script setup lang="ts">
// 首頁

// 取得環境變數配置
const config = useRuntimeConfig()

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
  <article class="space-y-8">
    <!-- Hero Section -->
    <header class="border p-6 md:p-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ config.public.siteTitle }}</h1>
      <p class="mb-6 max-w-2xl">
        {{ config.public.siteDescription }}
      </p>
      <nav class="flex flex-wrap gap-4">
        <NuxtLink to="/content" class="px-4 py-2 border font-medium">
          {{ config.public.ctaPrimary }}
        </NuxtLink>
        <button class="px-4 py-2 border">{{ config.public.ctaSecondary }}</button>
      </nav>
    </header>

    <!-- Featured Works -->
    <section v-if="featuredWorks && featuredWorks.length > 0">
      <h2 class="text-xl font-bold mb-4">{{ config.public.sectionFeatured }}</h2>
      
      <ul class="space-y-4">
        <li v-for="work in featuredWorks" :key="work._path">
          <NuxtLink 
            :to="work._path"
            class="block border p-4"
          >
            <figure class="flex items-center gap-2 mb-2">
              <figcaption class="w-8 h-8 border flex items-center justify-center text-sm font-bold">
                {{ work.title?.charAt(0) || 'A' }}
              </figcaption>
              <hgroup>
                <h3 class="font-semibold text-sm">{{ work.title }}</h3>
                <time class="text-xs text-gray-500">{{ work.modifyTime ? new Date(work.modifyTime).toLocaleDateString('zh-TW') : '' }}</time>
              </hgroup>
            </figure>
            <p class="text-sm">{{ work.description || '點擊查看更多...' }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Recent Content -->
    <section v-if="recentBooks && recentBooks.length > 0">
      <h2 class="text-xl font-bold mb-4">{{ config.public.sectionRecent }}</h2>
      
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <li v-for="book in recentBooks" :key="book._path">
          <NuxtLink 
            :to="book._path"
            class="block border p-4"
          >
            <span class="text-xs block mb-2">{{ book._type || 'Content' }}</span>
            <h3 class="font-semibold mb-1">{{ book.title || book._dir }}</h3>
            <p class="text-sm">{{ book.description || '點擊查看更多內容...' }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </article>
</template>
