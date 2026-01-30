<template>
  <div class="artia-counter-theme-classic">
    <button @click="decrement" class="artia-counter-btn-theme-classic">−</button>
    <span class="artia-counter-value-theme-classic">{{ count }}</span>
    <button @click="increment" class="artia-counter-btn-theme-classic">+</button>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>
