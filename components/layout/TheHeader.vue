<script setup lang="ts">
const config = useRuntimeConfig()
const { t } = useTheme()
</script>

<template>
  <header :class="t('header')">
    <nav :class="t('container')">
      <ul :class="t('header-nav')">
        <!-- Logo -->
        <li>
          <NuxtLink to="/" :class="t('header-logo')">
            {{ config.public.siteName }}
          </NuxtLink>
        </li>

        <!-- Navigation -->
        <li :class="t('header-menu')">
          <NuxtLink to="/" :class="t('header-link')">首頁</NuxtLink>
          <NuxtLink to="/content" :class="t('header-link')">作品集</NuxtLink>
          <NuxtLink to="/about" :class="t('header-link')">關於</NuxtLink>
        </li>

        <!-- Mobile Menu Button -->
        <li :class="t('header-mobile-btn')">
          <button>
            <svg :class="t('icon')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
