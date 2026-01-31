# 佈局系統

Artia 提供靈活的佈局系統，讓你可以透過 `.env` 設定頁面各區域要顯示的元件。

## 概念

頁面分為五個區域，每個區域只能放置一個元件：

```
┌─────────────────────────────────────┐
│              TOP                    │
├──────────┬────────────┬─────────────┤
│          │            │             │
│   LEFT   │   CENTER   │   RIGHT     │
│          │            │             │
├──────────┴────────────┴─────────────┤
│             BOTTOM                  │
└─────────────────────────────────────┘
```

## 可用元件

| 元件名稱 | 說明 | 建議位置 |
|----------|------|----------|
| `author` | 作者介紹 | LEFT, RIGHT |
| `navigation` | 內容導航/作品清單 | LEFT, RIGHT |
| `toc` | 目錄 (Table of Contents) | RIGHT |
| `hero` | 首頁 Hero 區塊 | CENTER, TOP |
| `featured` | 精選作品 | CENTER |
| `recent` | 最新內容 | CENTER |
| `none` | 不顯示任何內容 | 任何位置 |

## 環境變數

**注意：所有欄位都必須填寫，不可留空。若不需要顯示請填 `none`。**

### 首頁佈局

```bash
# 首頁上方區域
NUXT_PUBLIC_LAYOUT_HOME_TOP="none"

# 首頁左側邊欄
NUXT_PUBLIC_LAYOUT_HOME_LEFT="author"

# 首頁中央區域
NUXT_PUBLIC_LAYOUT_HOME_CENTER="none"

# 首頁右側邊欄
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="navigation"

# 首頁下方區域
NUXT_PUBLIC_LAYOUT_HOME_BOTTOM="none"
```

### 閱讀頁佈局

```bash
# 閱讀頁上方區域
NUXT_PUBLIC_LAYOUT_READ_TOP="none"

# 閱讀頁左側邊欄
NUXT_PUBLIC_LAYOUT_READ_LEFT="author"

# 閱讀頁中央區域固定為文章內容，不可配置

# 閱讀頁右側邊欄
NUXT_PUBLIC_LAYOUT_READ_RIGHT="toc"

# 閱讀頁下方區域
NUXT_PUBLIC_LAYOUT_READ_BOTTOM="none"
```

## 常見配置範例

### 經典部落格

左側作者介紹，右側目錄：

```bash
NUXT_PUBLIC_LAYOUT_HOME_LEFT="author"
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="navigation"
NUXT_PUBLIC_LAYOUT_READ_LEFT="author"
NUXT_PUBLIC_LAYOUT_READ_RIGHT="toc"
```

### 文件網站

左側導航，右側目錄：

```bash
NUXT_PUBLIC_LAYOUT_HOME_LEFT="navigation"
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="none"
NUXT_PUBLIC_LAYOUT_READ_LEFT="navigation"
NUXT_PUBLIC_LAYOUT_READ_RIGHT="toc"
```

### 極簡風格

無側邊欄，只有主要內容：

```bash
NUXT_PUBLIC_LAYOUT_HOME_LEFT="none"
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="none"
NUXT_PUBLIC_LAYOUT_READ_LEFT="none"
NUXT_PUBLIC_LAYOUT_READ_RIGHT="none"
```

### 作品集網站

右側作者介紹（與一般部落格相反）：

```bash
NUXT_PUBLIC_LAYOUT_HOME_LEFT="navigation"
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="author"
NUXT_PUBLIC_LAYOUT_READ_LEFT="toc"
NUXT_PUBLIC_LAYOUT_READ_RIGHT="author"
```

## 使用 useLayout Composable

在 Vue 元件中使用 `useLayout` composable：

```vue
<script setup>
const { 
  isSlotEnabled,      // 檢查位置是否有啟用元件
  getSlotComponent,   // 取得位置的元件名稱
  hasLeftSidebar,     // 檢查是否有左側邊欄
  hasRightSidebar,    // 檢查是否有右側邊欄
} = useLayout()

// 檢查首頁左側是否有元件
if (isSlotEnabled('home', 'left')) {
  // ...
}
</script>
```

## 建立自訂元件

1. 在 `components/layout/` 建立新元件
2. 在 `composables/useLayout.ts` 的 `componentMap` 中註冊
3. 在 `.env` 中使用新元件名稱

```typescript
// composables/useLayout.ts
const componentMap: Record<LayoutComponent, string> = {
  // ... 現有元件
  myWidget: 'LayoutMyWidget',  // 新增
}
```

```vue
<!-- components/layout/MyWidget.vue -->
<template>
  <aside :class="t('sidebar-mywidget')">
    <!-- 你的元件內容 -->
  </aside>
</template>
```

```bash
# .env
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="myWidget"
```

## 響應式設計

側邊欄在不同螢幕尺寸的預設行為：

| 螢幕寬度 | 左側邊欄 | 右側邊欄 |
|----------|---------|---------|
| < 1024px | 隱藏 | 隱藏 |
| ≥ 1024px | 顯示 | 隱藏 |
| ≥ 1280px | 顯示 | 顯示 |

你可以透過覆寫 CSS 來修改這個行為。
