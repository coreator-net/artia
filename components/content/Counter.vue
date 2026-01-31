<template>
  <div :class="t('counter')">
    <button @click="decrement" :class="t('counter-btn')">−</button>
    <span :class="t('counter-value')">{{ count }}</span>
    <button @click="increment" :class="t('counter-btn')">+</button>
  </div>
</template>

<script setup lang="ts">
const { t } = useTheme();
const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>
