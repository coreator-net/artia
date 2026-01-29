<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <footer class="border-t">
    <section class="max-w-7xl mx-auto px-4 py-8">
      <nav class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <address class="col-span-1 md:col-span-2 not-italic">
          <strong class="font-bold text-xl mb-2 block">{{ config.public.siteName }}</strong>
          <p>{{ config.public.siteSlogan }}</p>
        </address>

        <!-- Links -->
        <section>
          <h4 class="font-semibold mb-4">關於</h4>
          <ul class="flex gap-4">
            <li><a href="#">關於我們</a></li>
            <li><a href="#">聯絡方式</a></li>
            <li><a href="#">使用條款</a></li>
          </ul>
        </section>
      </nav>

      <p class="mt-8 pt-8 border-t text-center text-sm">
        {{ config.public.copyright }}
      </p>
    </section>
  </footer>
</template>
