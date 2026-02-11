<script setup lang="ts">
const { t: themeT } = useTheme();

const { color } = defineProps({
  color: {
    type: String,
    default: "orange",
  },
});
</script>

<template>
  <div :class="themeT('alert')" :style="{ 'border-color': color }">
    <slot></slot>
  </div>
</template>
