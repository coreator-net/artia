<script setup lang="ts">
/**
 * LayoutHistoryTimeline - 歷史記錄時間線
 * 顯示頁面的歷史修改記錄
 */
const { t: themeT } = useTheme()
const { t } = useI18n()
const route = useRoute()

interface HistoryRecord {
  name: string
  recordTime: string
  commit: string
}

// 取得當前頁面的歷史記錄
const { data: historyRecords } = await useAsyncData(`history-${route.path}`, async () => {
  const content = await queryContent(route.path).findOne()
  return (content?.historyRecords as HistoryRecord[]) || []
})

// 格式化時間
const formatTime = (isoTime: string): string => {
  try {
    const date = new Date(isoTime)
    const locale = t('date.locale') || 'zh-TW'
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoTime
  }
}

// 格式化相對時間
const formatRelativeTime = (isoTime: string): string => {
  try {
    const date = new Date(isoTime)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return t('history.today')
    if (diffDays === 1) return t('history.yesterday')
    if (diffDays < 7) return t('history.daysAgo', { count: diffDays })
    if (diffDays < 30) return t('history.weeksAgo', { count: Math.floor(diffDays / 7) })
    if (diffDays < 365) return t('history.monthsAgo', { count: Math.floor(diffDays / 30) })
    return t('history.yearsAgo', { count: Math.floor(diffDays / 365) })
  } catch {
    return ''
  }
}
</script>

<template>
  <aside :class="themeT('sidebar-history')">
    <h3 :class="themeT('sidebar-history-title')">{{ t('history.title') }}</h3>
    <div v-if="historyRecords && historyRecords.length > 0" :class="themeT('sidebar-history-timeline')">
      <div 
        v-for="(record, index) in historyRecords" 
        :key="index"
        :class="themeT('sidebar-history-item')"
      >
        <!-- 時間線節點 -->
        <div :class="themeT('sidebar-history-node')">
          <div :class="themeT('sidebar-history-dot')"></div>
          <div v-if="index < historyRecords.length - 1" :class="themeT('sidebar-history-line')"></div>
        </div>
        
        <!-- 記錄內容 -->
        <div :class="themeT('sidebar-history-content')">
          <div :class="themeT('sidebar-history-header')">
            <span :class="themeT('sidebar-history-author')">{{ record.name }}</span>
            <span :class="themeT('sidebar-history-time')" :title="formatTime(record.recordTime)">
              {{ formatRelativeTime(record.recordTime) }}
            </span>
          </div>
          <p :class="themeT('sidebar-history-commit')">{{ record.commit }}</p>
          <time :class="themeT('sidebar-history-datetime')">{{ formatTime(record.recordTime) }}</time>
        </div>
      </div>
    </div>
    <p v-else :class="themeT('sidebar-history-empty')">
      {{ t('history.empty') }}
    </p>
  </aside>
</template>
