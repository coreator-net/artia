<script setup lang="ts">
// 預設 Layout - 聖杯架構
</script>

<template>
  <div class="artia-app-theme-classic">
    <LayoutTheHeader />

    <!-- Main Content Area - Holy Grail -->
    <section class="artia-app-main-theme-classic">
      <article class="artia-container-content-theme-classic">
        <section class="artia-layout-holygrail-theme-classic">
          <LayoutSidebarAuthor />

          <!-- Main Content -->
          <main class="artia-layout-main-theme-classic">
            <slot />
          </main>

          <LayoutSidebarContent />
        </section>
      </article>
    </section>

    <LayoutTheFooter />
  </div>
</template>
