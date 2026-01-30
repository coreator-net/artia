<script setup lang="ts">
const config = useRuntimeConfig()
const { t } = useTheme()
</script>

<template>
  <aside :class="t('sidebar-author')">
    <figure class="text-center mb-4">
      <img 
        v-if="config.public.authorAvatar" 
        :src="config.public.authorAvatar" 
        :alt="config.public.authorName"
        :class="t('sidebar-author-avatar')"
      />
      <figcaption :class="t('sidebar-author-placeholder')" v-else>
        {{ config.public.authorName?.charAt(0) || 'A' }}
      </figcaption>
    </figure>
    <h3 :class="t('sidebar-author-name')">{{ config.public.authorName }}</h3>
    <p :class="t('sidebar-author-bio')">{{ config.public.authorBio }}</p>
  </aside>
</template>
