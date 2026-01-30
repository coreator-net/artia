<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <footer class="artia-footer-theme-classic">
    <section class="artia-container-theme-classic artia-footer-content-theme-classic">
      <nav class="artia-footer-grid-theme-classic">
        <!-- Brand -->
        <address class="artia-footer-brand-theme-classic">
          <strong class="artia-footer-brand-name-theme-classic">{{ config.public.siteName }}</strong>
          <p class="artia-text-body-theme-classic">{{ config.public.siteSlogan }}</p>
        </address>

        <!-- Links -->
        <section>
          <h4 class="artia-footer-section-title-theme-classic">關於</h4>
          <ul class="artia-footer-links-theme-classic">
            <li><a href="#" class="artia-header-link-theme-classic">關於我們</a></li>
            <li><a href="#" class="artia-header-link-theme-classic">聯絡方式</a></li>
            <li><a href="#" class="artia-header-link-theme-classic">使用條款</a></li>
          </ul>
        </section>
      </nav>

      <p class="artia-footer-copyright-theme-classic">
        {{ config.public.copyright }}
      </p>
    </section>
  </footer>
</template>
