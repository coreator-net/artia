<script setup lang="ts">
const config = useRuntimeConfig()
const { t: themeT } = useTheme()
</script>

<template>
  <footer :class="themeT('footer')">
    <section :class="[themeT('container'), themeT('footer-content')]">
      <nav :class="themeT('footer-grid')">
        <!-- Brand -->
        <address :class="themeT('footer-brand')">
          <strong :class="themeT('footer-brand-name')">{{ config.public.siteName }}</strong>
          <p :class="themeT('text-body')">{{ config.public.siteSlogan }}</p>
        </address>

        <!-- Links -->
        <section>
          <h4 :class="themeT('footer-section-title')">關於</h4>
          <ul :class="themeT('footer-links')">
            <li><a href="#" :class="themeT('header-link')">關於我們</a></li>
            <li><a href="#" :class="themeT('header-link')">聯絡方式</a></li>
            <li><a href="#" :class="themeT('header-link')">使用條款</a></li>
          </ul>
        </section>
      </nav>

      <p :class="themeT('footer-copyright')">
        {{ config.public.copyright }}
      </p>
    </section>
  </footer>
</template>
