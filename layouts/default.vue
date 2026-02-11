<script setup lang="ts">
// 預設 Layout - 聖杯架構
const { t: themeT } = useTheme()
</script>

<template>
  <div :class="themeT('app')">
    <LayoutTheHeader />

    <!-- Main Content Area - Holy Grail -->
    <section :class="themeT('app-main')">
      <article :class="themeT('container-content')">
        <section :class="themeT('layout-holygrail')">
          <LayoutSidebarAuthor />

          <!-- Main Content -->
          <main :class="themeT('layout-main')">
            <slot />
          </main>

          <LayoutSidebarContent />
        </section>
      </article>
    </section>

    <LayoutTheFooter />
  </div>
</template>
