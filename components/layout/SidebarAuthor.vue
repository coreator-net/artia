<script setup lang="ts">
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
</script>

<template>
  <aside :class="themeT('sidebar-author')">
    <figure class="text-center mb-4">
      <img 
        v-if="config.public.authorAvatar" 
        :src="config.public.authorAvatar" 
        :alt="config.public.authorName"
        :class="themeT('sidebar-author-avatar')"
      />
      <figcaption :class="themeT('sidebar-author-placeholder')" v-else>
        {{ config.public.authorName?.charAt(0) || 'A' }}
      </figcaption>
    </figure>
    <h3 :class="themeT('sidebar-author-name')">{{ config.public.authorName }}</h3>
    <p :class="themeT('sidebar-author-bio')">{{ config.public.authorBio }}</p>
  </aside>
</template>
