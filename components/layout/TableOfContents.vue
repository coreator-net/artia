<script setup lang="ts">
/**
 * LayoutTableOfContents - 目錄側邊欄
 * 顯示當前頁面的目錄結構
 */
const { t } = useTheme()
const route = useRoute()

// 取得當前頁面的 TOC
const { data: toc } = await useAsyncData(`toc-${route.path}`, async () => {
  const content = await queryContent(route.path).findOne()
  return content?.body?.toc?.links || []
})

// 目前滾動位置追蹤（可選功能）
const activeId = ref('')

// 滾動到指定標題
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeId.value = id
  }
}
</script>

<template>
  <aside :class="t('sidebar-toc')">
    <h3 :class="t('sidebar-toc-title')">目錄</h3>
    <nav v-if="toc && toc.length > 0">
      <ul :class="t('sidebar-toc-list')">
        <li 
          v-for="item in toc" 
          :key="item.id"
          :class="[t('sidebar-toc-item'), { 'active': activeId === item.id }]"
        >
          <a 
            :href="`#${item.id}`"
            :class="t('sidebar-toc-link')"
            @click.prevent="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </a>
          <!-- 巢狀標題 -->
          <ul v-if="item.children?.length" :class="t('sidebar-toc-nested')">
            <li 
              v-for="child in item.children" 
              :key="child.id"
              :class="t('sidebar-toc-item')"
            >
              <a 
                :href="`#${child.id}`"
                :class="t('sidebar-toc-link')"
                @click.prevent="scrollToHeading(child.id)"
              >
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <p v-else :class="t('sidebar-toc-empty')">
      此頁面沒有目錄
    </p>
  </aside>
</template>
