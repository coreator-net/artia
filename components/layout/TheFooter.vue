<script setup lang="ts">
const config = useRuntimeConfig()
const { t } = useTheme()
</script>

<template>
  <footer :class="t('footer')">
    <section :class="[t('container'), t('footer-content')]">
      <nav :class="t('footer-grid')">
        <!-- Brand -->
        <address :class="t('footer-brand')">
          <strong :class="t('footer-brand-name')">{{ config.public.siteName }}</strong>
          <p :class="t('text-body')">{{ config.public.siteSlogan }}</p>
        </address>

        <!-- Links -->
        <section>
          <h4 :class="t('footer-section-title')">關於</h4>
          <ul :class="t('footer-links')">
            <li><a href="#" :class="t('header-link')">關於我們</a></li>
            <li><a href="#" :class="t('header-link')">聯絡方式</a></li>
            <li><a href="#" :class="t('header-link')">使用條款</a></li>
          </ul>
        </section>
      </nav>

      <p :class="t('footer-copyright')">
        {{ config.public.copyright }}
      </p>
    </section>
  </footer>
</template>
