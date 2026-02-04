<script setup lang="ts">
/**
 * LayoutHomeFeatured - 精選作品區塊
 * 用於 layout 系統的可配置元件
 */
const config = useRuntimeConfig();
const { t: themeT } = useTheme();
const { t, locale } = useI18n();

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
    <h2 :class="themeT('section-title')">{{ config.public.sectionFeatured }}</h2>

    <ul :class="themeT('card-list')">
      <li v-for="work in featuredWorks" :key="work._path">
        <NuxtLink :to="work._path" :class="themeT('card-featured')">
          <figure :class="themeT('card-header')">
            <figcaption :class="themeT('card-avatar')">
              {{ work.title?.charAt(0) || "A" }}
            </figcaption>
            <hgroup>
              <h3 :class="themeT('card-title')">{{ work.title }}</h3>
              <time :class="themeT('card-meta')">{{
                work.modifyTime
                  ? new Date(work.modifyTime).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'en-US')
                  : ""
              }}</time>
            </hgroup>
          </figure>
          <p :class="themeT('card-desc')">{{ work.description || t('content.clickForDetails') }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
