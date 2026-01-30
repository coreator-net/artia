<script setup lang="ts">
const { t } = useTheme()

const { color } = defineProps({
  color: {
    type: String,
    default: 'orange'
  }
})
</script>

<template>
  <div :class="t('alert')" :style="{ 'border-color': color }">
    <slot></slot>
  </div>
</template>