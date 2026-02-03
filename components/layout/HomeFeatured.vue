<script setup lang="ts">
/**
 * LayoutHomeFeatured - 精選作品區塊
 * 用於 layout 系統的可配置元件
 */
const config = useRuntimeConfig();
const { t } = useTheme();

// 精選作品：最近更新的前三篇文章
const { data: featuredWorks } = await useAsyncData("featured-works", () => {
  return queryContent()
    .where({ type: "page" })
    .only(["_path", "title", "description", "modifyTime"])
    .sort({ modifyTime: -1 })
    .limit(3)
    .find()
    .catch(() => []);
});
</script>

<template>
  <section v-if="featuredWorks && featuredWorks.length > 0">
    <h2 :class="t('section-title')">{{ config.public.sectionFeatured }}</h2>

    <ul :class="t('card-list')">
      <li v-for="work in featuredWorks" :key="work._path">
        <NuxtLink :to="work._path" :class="t('card-featured')">
          <figure :class="t('card-header')">
            <figcaption :class="t('card-avatar')">
              {{ work.title?.charAt(0) || "A" }}
            </figcaption>
            <hgroup>
              <h3 :class="t('card-title')">{{ work.title }}</h3>
              <time :class="t('card-meta')">{{
                work.modifyTime
                  ? new Date(work.modifyTime).toLocaleDateString("zh-TW")
                  : ""
              }}</time>
            </hgroup>
          </figure>
          <p :class="t('card-desc')">{{ work.description || "點擊查看更多..." }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
