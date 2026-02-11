<script setup lang="ts">
/**
 * LayoutFeaturedBooks - 精選書籍區塊
 * 顯示 type: book 的作品，點擊跳轉到書籍第一頁
 */
import type { NavItem } from '@nuxt/content'
import { sortContentItems } from '~/utils/contentSort'

interface ExtendedNavItem extends NavItem {
  type?: string
  sortAnchor?: number[]
  children?: ExtendedNavItem[]
}

const config = useRuntimeConfig()
const { t: themeT } = useTheme()
const { t, locale } = useI18n()

// 從 .env 取得精選書籍代碼
const featuredBookCodes = computed(() => {
  const codes = config.public.featuredBookCodes as string
  if (!codes) return []
  return codes.split(',').map(c => c.trim()).filter(Boolean)
})

// 查詢所有 type: book 的文章
const { data: allBooks } = await useAsyncData('featured-books', () => {
  return queryContent()
    .where({ type: 'book' })
    .only(['_path', 'title', 'description', 'modifyTime', 'bookCode'])
    .sort({ modifyTime: -1 })
    .find()
    .catch(() => [])
})

// 根據 bookCode 過濾（有設定則按順序顯示，無設定則顯示最近 3 本）
const featuredBooks = computed(() => {
  if (!allBooks.value) return []
  
  if (featuredBookCodes.value.length > 0) {
    // 按照 .env 設定的順序排列
    return featuredBookCodes.value
      .map(code => allBooks.value!.find(book => book.bookCode === code))
      .filter((book): book is NonNullable<typeof book> => book != null)
  }
  
  // 無設定則顯示最近更新的 3 本
  return allBooks.value.slice(0, 3)
})

// 載入導航資料以找出每本書的第一頁
const navTree = await fetchContentNavigation()

const content = await queryContent()
  .where({ _draft: { $ne: true }, _partial: { $ne: true } })
  .only(['_path', 'type', 'sortAnchor'])
  .find()

const metadataMap = new Map<string, { type?: string; sortAnchor?: number[] }>(
  content
    .filter(item => item._path)
    .map(item => [item._path!, { type: item.type, sortAnchor: item.sortAnchor }])
)

const mergeMetadata = (items: any[]): ExtendedNavItem[] => {
  return items.map(item => {
    const metadata = metadataMap.get(item._path)
    return {
      ...item,
      type: metadata?.type || item.type,
      sortAnchor: metadata?.sortAnchor || item.sortAnchor,
      children: item.children ? mergeMetadata(item.children) : undefined
    }
  })
}

const navigation = mergeMetadata(navTree)

/**
 * 根據 book 路徑找出該書第一頁的路徑
 */
const findFirstPagePath = (bookPath: string): string => {
  // book 文件通常在其父資料夾下，找到該資料夾
  const parentPath = bookPath.substring(0, bookPath.lastIndexOf('/'))
  if (!parentPath) return bookPath
  
  // 遞迴找到父資料夾節點
  const findNode = (items: ExtendedNavItem[], targetPath: string): ExtendedNavItem | null => {
    for (const item of items) {
      if (item._path === targetPath) return item
      if (item.children) {
        const found = findNode(item.children, targetPath)
        if (found) return found
      }
    }
    return null
  }
  
  const parentNode = findNode(navigation, parentPath)
  if (!parentNode?.children) return bookPath
  
  // 過濾並排序子項目（排除 book/folder 類型）
  const pages = parentNode.children.filter(child => 
    child.type !== 'book' && child.type !== 'folder'
  )
  
  const sortedPages = sortContentItems(pages, {
    prioritizeFolders: false,
    recursive: false
  })
  
  // 返回第一頁路徑，如果沒有則返回 book 自身路徑
  return sortedPages[0]?._path || bookPath
}

// 為每本書計算第一頁路徑
const booksWithFirstPage = computed(() => {
  if (!featuredBooks.value) return []
  return featuredBooks.value.map(book => ({
    ...book,
    firstPagePath: findFirstPagePath(book._path!)
  }))
})

/**
 * 簡單解析 Markdown 為 HTML（僅處理基本格式）
 */
const parseSimpleMarkdown = (text: string): string => {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <section v-if="booksWithFirstPage && booksWithFirstPage.length > 0" :class="themeT('featured-section')">
    <h2 :class="themeT('section-title')">{{ config.public.sectionFeatured }}</h2>

    <ul :class="themeT('featured-list')">
      <li v-for="book in booksWithFirstPage" :key="book._path">
        <NuxtLink :to="book.firstPagePath" :class="themeT('featured-card')">
          <figure :class="themeT('card-header')">
            <figcaption :class="themeT('card-avatar')">
              {{ book.title?.charAt(0) || '📖' }}
            </figcaption>
            <hgroup>
              <h3 :class="themeT('card-title')">{{ book.title }}</h3>
              <time :class="themeT('card-meta')">{{
                book.modifyTime
                  ? new Date(book.modifyTime).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'en-US')
                  : ''
              }}</time>
            </hgroup>
          </figure>
          <p 
            :class="themeT('card-desc')" 
            v-html="parseSimpleMarkdown(book.description) || t('content.clickForDetails')"
          ></p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
