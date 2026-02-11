<template>
  <div :class="themeT('counter')">
    <button @click="decrement" :class="themeT('counter-btn')">−</button>
    <span :class="themeT('counter-value')">{{ count }}</span>
    <button @click="increment" :class="themeT('counter-btn')">+</button>
  </div>
</template>

<script setup lang="ts">
const { t: themeT } = useTheme();
const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>
