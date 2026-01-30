<script setup lang="ts">
// 預設 Layout - 聖杯架構
const { t } = useTheme()
</script>

<template>
  <div :class="t('app')">
    <LayoutTheHeader />

    <!-- Main Content Area - Holy Grail -->
    <section :class="t('app-main')">
      <article :class="t('container-content')">
        <section :class="t('layout-holygrail')">
          <LayoutSidebarAuthor />

          <!-- Main Content -->
          <main :class="t('layout-main')">
            <slot />
          </main>

          <LayoutSidebarContent />
        </section>
      </article>
    </section>

    <LayoutTheFooter />
  </div>
</template>
