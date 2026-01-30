<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <aside class="artia-sidebar-author-theme-classic">
    <figure class="text-center mb-4">
      <img 
        v-if="config.public.authorAvatar" 
        :src="config.public.authorAvatar" 
        :alt="config.public.authorName"
        class="artia-sidebar-author-avatar-theme-classic"
      />
      <figcaption class="artia-sidebar-author-placeholder-theme-classic" v-else>
        {{ config.public.authorName?.charAt(0) || 'A' }}
      </figcaption>
    </figure>
    <h3 class="artia-sidebar-author-name-theme-classic">{{ config.public.authorName }}</h3>
    <p class="artia-sidebar-author-bio-theme-classic">{{ config.public.authorBio }}</p>
  </aside>
</template>
