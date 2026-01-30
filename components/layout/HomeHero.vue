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
</template>
