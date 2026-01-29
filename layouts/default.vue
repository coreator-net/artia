<script setup lang="ts">
// 預設 Layout - 聖杯架構
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <LayoutTheHeader />

    <!-- Main Content Area - Holy Grail -->
    <section class="flex-1">
      <article class="max-w-7xl mx-auto px-4 py-8">
        <section class="flex flex-col lg:flex-row gap-8">
          <LayoutSidebarAuthor />

          <!-- Main Content -->
          <main class="flex-1 min-w-0 w-full">
            <slot />
          </main>

          <LayoutSidebarContent />
        </section>
      </article>
    </section>

    <LayoutTheFooter />
  </div>
</template>
