<script setup lang="ts">
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
const { t } = useI18n()
</script>

<template>
  <header :class="themeT('header')">
    <nav :class="themeT('container')">
      <ul :class="themeT('header-nav')">
        <!-- Logo -->
        <li>
          <NuxtLink to="/" :class="themeT('header-logo')">
            {{ config.public.siteName }}
          </NuxtLink>
        </li>

        <!-- Navigation -->
        <li :class="themeT('header-menu')">
          <NuxtLink to="/" :class="themeT('header-link')">{{ t('nav.home') }}</NuxtLink>
          <NuxtLink to="/about" :class="themeT('header-link')">{{ t('nav.about') }}</NuxtLink>
        </li>

        <!-- Mobile Menu Button -->
        <li :class="themeT('header-mobile-btn')">
          <button>
            <svg :class="themeT('icon')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
