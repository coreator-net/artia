<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <header class="artia-header-theme-classic">
    <nav class="artia-container-theme-classic">
      <ul class="artia-header-nav-theme-classic">
        <!-- Logo -->
        <li>
          <NuxtLink to="/" class="artia-header-logo-theme-classic">
            {{ config.public.siteName }}
          </NuxtLink>
        </li>

        <!-- Navigation -->
        <li class="artia-header-menu-theme-classic">
          <NuxtLink to="/" class="artia-header-link-theme-classic">首頁</NuxtLink>
          <NuxtLink to="/content" class="artia-header-link-theme-classic">作品集</NuxtLink>
          <NuxtLink to="/about" class="artia-header-link-theme-classic">關於</NuxtLink>
        </li>

        <!-- Mobile Menu Button -->
        <li class="artia-header-mobile-btn-theme-classic">
          <button>
            <svg class="artia-icon-theme-classic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
