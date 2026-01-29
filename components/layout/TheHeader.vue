<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <header class="border-b">
    <nav class="max-w-7xl mx-auto px-4">
      <ul class="flex items-center justify-between h-14">
        <!-- Logo -->
        <li>
          <NuxtLink to="/" class="font-bold text-xl">
            {{ config.public.siteName }}
          </NuxtLink>
        </li>

        <!-- Navigation -->
        <li class="hidden md:flex items-center gap-4">
          <NuxtLink to="/">首頁</NuxtLink>
          <NuxtLink to="/content">作品集</NuxtLink>
          <NuxtLink to="/about">關於</NuxtLink>
        </li>

        <!-- Mobile Menu Button -->
        <li class="md:hidden">
          <button class="p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>
