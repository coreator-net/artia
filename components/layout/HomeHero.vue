<script setup lang="ts">
/**
 * LayoutHomeHero - 首頁 Hero 區塊
 * 用於 layout 系統的可配置元件
 */
const config = useRuntimeConfig()
const { t } = useTheme()
</script>

<template>
  <header :class="t('hero')">
    <h1 :class="t('hero-title')">{{ config.public.heroTitle }}</h1>
    <p :class="t('hero-desc')">
      {{ config.public.heroDescription }}
    </p>
    <nav :class="t('hero-actions')">
      <NuxtLink to="/" :class="t('btn-primary')">
        {{ config.public.heroCtaPrimary }}
      </NuxtLink>
      <button :class="t('btn-secondary')">{{ config.public.heroCtaSecondary }}</button>
    </nav>
  </header>
</template>
