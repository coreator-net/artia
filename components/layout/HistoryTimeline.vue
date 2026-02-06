<script setup lang="ts">
/**
 * LayoutHistoryTimeline - 歷史記錄時間線
 * 顯示頁面的歷史修改記錄
 */
const { t } = useTheme()
const { t: i18n } = useI18n()
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
    const locale = i18n('date.locale') || 'zh-TW'
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
    
    if (diffDays === 0) return i18n('history.today')
    if (diffDays === 1) return i18n('history.yesterday')
    if (diffDays < 7) return i18n('history.daysAgo', { count: diffDays })
    if (diffDays < 30) return i18n('history.weeksAgo', { count: Math.floor(diffDays / 7) })
    if (diffDays < 365) return i18n('history.monthsAgo', { count: Math.floor(diffDays / 30) })
    return i18n('history.yearsAgo', { count: Math.floor(diffDays / 365) })
  } catch {
    return ''
  }
}
</script>

<template>
  <aside :class="t('sidebar-history')">
    <h3 :class="t('sidebar-history-title')">{{ i18n('history.title') }}</h3>
    <div v-if="historyRecords && historyRecords.length > 0" :class="t('sidebar-history-timeline')">
      <div 
        v-for="(record, index) in historyRecords" 
        :key="index"
        :class="t('sidebar-history-item')"
      >
        <!-- 時間線節點 -->
        <div :class="t('sidebar-history-node')">
          <div :class="t('sidebar-history-dot')"></div>
          <div v-if="index < historyRecords.length - 1" :class="t('sidebar-history-line')"></div>
        </div>
        
        <!-- 記錄內容 -->
        <div :class="t('sidebar-history-content')">
          <div :class="t('sidebar-history-header')">
            <span :class="t('sidebar-history-author')">{{ record.name }}</span>
            <span :class="t('sidebar-history-time')" :title="formatTime(record.recordTime)">
              {{ formatRelativeTime(record.recordTime) }}
            </span>
          </div>
          <p :class="t('sidebar-history-commit')">{{ record.commit }}</p>
          <time :class="t('sidebar-history-datetime')">{{ formatTime(record.recordTime) }}</time>
        </div>
      </div>
    </div>
    <p v-else :class="t('sidebar-history-empty')">
      {{ i18n('history.empty') }}
    </p>
  </aside>
</template>
