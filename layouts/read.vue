<script setup lang="ts">
/**
 * Read Layout - 閱讀頁專用佈局
 * 支援動態配置各區域顯示的元件
 * TOP/BOTTOM 全寬，LEFT/RIGHT 三欄佈局
 */
const { t: themeT } = useTheme()
const { isSlotEnabled, hasLeftSidebar, hasRightSidebar } = useLayout()

// 計算佈局 class
const layoutClass = computed(() => {
  const classes = [themeT('layout-holygrail')]
  
  if (!hasLeftSidebar('read')) {
    classes.push('no-left-sidebar')
  }
  if (!hasRightSidebar('read')) {
    classes.push('no-right-sidebar')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <div :class="themeT('app')">
    <LayoutTheHeader />

    <!-- Main Content Area - Holy Grail -->
    <section :class="themeT('app-main')">
      <article :class="themeT('container-content')">

        <!-- Top Slot (全寬，在三欄之上) -->
        <LayoutSlot 
          v-if="isSlotEnabled('read', 'top')" 
          page="read" 
          position="top" 
        />

        <!-- 三欄佈局 -->
        <section :class="layoutClass">
          
          <!-- Left Sidebar -->
          <LayoutSlot 
            v-if="isSlotEnabled('read', 'left')" 
            page="read" 
            position="left" 
          />

          <!-- Main Content -->
          <main :class="themeT('layout-main')">
            <slot />
          </main>

          <!-- Right Sidebar -->
          <LayoutSlot 
            v-if="isSlotEnabled('read', 'right')" 
            page="read" 
            position="right" 
          />
          
        </section>

        <!-- Bottom Slot (全寬，在三欄之下) -->
        <LayoutSlot 
          v-if="isSlotEnabled('read', 'bottom')" 
          page="read" 
          position="bottom" 
        />

      </article>
    </section>

    <LayoutTheFooter />
  </div>
</template>
