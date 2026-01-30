<script setup lang="ts">
/**
 * Home Layout - 首頁專用佈局
 * 支援動態配置各區域顯示的元件
 * 
 * 佈局模式：
 * - content: TOP/BOTTOM 全寬，擠掉 LEFT/RIGHT（適合內容網站）
 * - app: LEFT/RIGHT 延伸到頂部（適合後台應用）
 */
const { t } = useTheme()
const { isSlotEnabled, hasLeftSidebar, hasRightSidebar, isContentMode, isAppMode } = useLayout()

// 計算佈局 class
const layoutClass = computed(() => {
  const classes = [t('layout-holygrail')]
  
  if (!hasLeftSidebar('home')) {
    classes.push('no-left-sidebar')
  }
  if (!hasRightSidebar('home')) {
    classes.push('no-right-sidebar')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <div :class="t('app')">
    <LayoutTheHeader />

    <!-- Main Content Area - Holy Grail -->
    <section :class="t('app-main')">
      <article :class="t('container-content')">

        <!-- ===== Content Mode: TOP/BOTTOM 全寬，擠掉 LEFT/RIGHT ===== -->
        <template v-if="isContentMode">
          
          <!-- Top Slot (全寬，在三欄之上) -->
          <LayoutSlot 
            v-if="isSlotEnabled('home', 'top')" 
            page="home" 
            position="top" 
          />

          <!-- 三欄佈局 -->
          <section :class="layoutClass">
            
            <!-- Left Sidebar -->
            <LayoutSlot 
              v-if="isSlotEnabled('home', 'left')" 
              page="home" 
              position="left" 
            />

            <!-- Main Content -->
            <main :class="t('layout-main')">
              <LayoutSlot page="home" position="center" />
              <slot />
            </main>

            <!-- Right Sidebar -->
            <LayoutSlot 
              v-if="isSlotEnabled('home', 'right')" 
              page="home" 
              position="right" 
            />
            
          </section>

          <!-- Bottom Slot (全寬，在三欄之下) -->
          <LayoutSlot 
            v-if="isSlotEnabled('home', 'bottom')" 
            page="home" 
            position="bottom" 
          />

        </template>

        <!-- ===== App Mode: LEFT/RIGHT 延伸到頂部 ===== -->
        <template v-else>
          
          <section :class="layoutClass">
            
            <!-- Left Sidebar (延伸到頂部) -->
            <LayoutSlot 
              v-if="isSlotEnabled('home', 'left')" 
              page="home" 
              position="left" 
            />

            <!-- 中間區域包含 TOP/CENTER/BOTTOM -->
            <main :class="t('layout-main')">
              <!-- Top Slot (在 CENTER 之上) -->
              <LayoutSlot 
                v-if="isSlotEnabled('home', 'top')" 
                page="home" 
                position="top" 
              />
              
              <LayoutSlot page="home" position="center" />
              <slot />
              
              <!-- Bottom Slot (在 CENTER 之下) -->
              <LayoutSlot 
                v-if="isSlotEnabled('home', 'bottom')" 
                page="home" 
                position="bottom" 
              />
            </main>

            <!-- Right Sidebar (延伸到頂部) -->
            <LayoutSlot 
              v-if="isSlotEnabled('home', 'right')" 
              page="home" 
              position="right" 
            />
            
          </section>

        </template>

      </article>
    </section>

    <LayoutTheFooter />
  </div>
</template>
