<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <aside class="hidden lg:block w-56 shrink-0">
    <figure class="text-center mb-4">
      <img 
        v-if="config.public.authorAvatar" 
        :src="config.public.authorAvatar" 
        :alt="config.public.authorName"
        class="w-20 h-20 mx-auto border"
      />
      <figcaption class="w-20 h-20 mx-auto border flex items-center justify-center text-2xl font-bold" v-else>
        {{ config.public.authorName?.charAt(0) || 'A' }}
      </figcaption>
    </figure>
    <h3 class="font-semibold text-center mb-2">{{ config.public.authorName }}</h3>
    <p class="text-sm text-center">{{ config.public.authorBio }}</p>
  </aside>
</template>
