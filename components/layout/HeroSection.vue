<script setup lang="ts">
/**
 * LayoutHeroSection - Hero 區塊
 * 用於 layout 系統的可配置元件
 */
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
</script>

<template>
  <header :class="themeT('hero')">
    <h1 :class="themeT('hero-title')">{{ config.public.heroTitle }}</h1>
    <p :class="themeT('hero-desc')">
      {{ config.public.heroDescription }}
    </p>
    <nav :class="themeT('hero-actions')">
      <NuxtLink to="/" :class="themeT('btn-primary')">
        {{ config.public.heroCtaPrimary }}
      </NuxtLink>
      <button :class="themeT('btn-secondary')">{{ config.public.heroCtaSecondary }}</button>
    </nav>
  </header>
</template>
