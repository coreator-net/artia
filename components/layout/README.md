# Layout 元件開發指南

本文件說明如何建立和註冊新的佈局元件。

## 佈局模式

系統支援兩種佈局模式，透過 `.env` 的 `NUXT_PUBLIC_LAYOUT_MODE` 設定：

### Content Mode（內容模式）- 預設

```
┌─────────────────────────────────┐
│             HEADER              │
├─────────────────────────────────┤
│              TOP                │ ← 全寬橫幅
├────────┬────────────┬───────────┤
│  LEFT  │   CENTER   │   RIGHT   │
├────────┴────────────┴───────────┤
│             BOTTOM              │ ← 全寬橫幅
├─────────────────────────────────┤
│             FOOTER              │
└─────────────────────────────────┘
```

- TOP/BOTTOM 為全寬，會「擠掉」LEFT/RIGHT
- 適合：內容網站、部落格、新聞網站
- 使用者：Medium、WordPress

```bash
NUXT_PUBLIC_LAYOUT_MODE="content"
```

### App Mode（應用模式）

```
┌─────────────────────────────────┐
│             HEADER              │
├────────┬────────────┬───────────┤
│        │    TOP     │           │
│  LEFT  ├────────────┤   RIGHT   │
│        │   CENTER   │           │
│        ├────────────┤           │
│        │   BOTTOM   │           │
├────────┴────────────┴───────────┤
│             FOOTER              │
└─────────────────────────────────┘
```

- LEFT/RIGHT 延伸到頂部
- TOP/BOTTOM 在中間區域內
- 適合：後台管理、Dashboard、工具型網站
- 使用者：VS Code、Discord、Notion

```bash
NUXT_PUBLIC_LAYOUT_MODE="app"
```

## 元件架構

```
components/layout/
├── README.md                 # 本文件
├── LayoutSlot.vue            # 動態插槽元件（系統核心，勿修改）
├── TheHeader.vue             # 頁首
├── TheFooter.vue             # 頁尾
├── SidebarAuthor.vue         # 作者介紹元件
├── SidebarContent.vue        # 內容導航元件
├── TableOfContents.vue       # 目錄元件
├── HomeHero.vue              # 首頁 Hero 元件
├── HomeFeatured.vue          # 精選作品元件
├── HomeRecent.vue            # 最新內容元件
└── PageContent.vue           # 頁面內容元件
```

## 註冊新元件流程

### 步驟 1：建立 Vue 元件

在 `components/layout/` 資料夾中建立新元件：

```vue
<!-- components/layout/MyWidget.vue -->
<script setup lang="ts">
/**
 * MyWidget - 我的自訂元件
 * 用於 layout 系統的可配置元件
 */
const { t } = useTheme()
const config = useRuntimeConfig()
</script>

<template>
  <aside :class="t('sidebar-mywidget')">
    <h3 :class="t('sidebar-mywidget-title')">標題</h3>
    <!-- 元件內容 -->
  </aside>
</template>
```

### 步驟 2：在 useLayout 註冊元件

編輯 `composables/useLayout.ts`：

```typescript
// 1. 在 LayoutComponent 類型中加入新元件名稱
export type LayoutComponent = 
  | 'author' 
  | 'navigation' 
  | 'toc' 
  | 'hero' 
  | 'featured' 
  | 'recent'
  | 'mywidget'  // 新增
  | 'none'

// 2. 在 componentMap 中註冊對應的 Vue 元件名稱
const componentMap: Record<LayoutComponent, string> = {
  author: 'LayoutSidebarAuthor',
  navigation: 'LayoutSidebarContent',
  toc: 'LayoutTableOfContents',
  hero: 'LayoutHomeHero',
  featured: 'LayoutHomeFeatured',
  recent: 'LayoutHomeRecent',
  mywidget: 'LayoutMyWidget',  // 新增：檔名 MyWidget.vue → LayoutMyWidget
  none: '',
}
```

**命名規則：**
- 檔案名稱：`MyWidget.vue`
- componentMap 中的值：`LayoutMyWidget`（Nuxt 自動加上 Layout 前綴）

### 步驟 3：加入主題樣式

在 `assets/css/main.css` 中加入 Classic 主題樣式：

```css
/* --------------------------------------------------------------------------
   Sidebar MyWidget - 我的自訂元件
   -------------------------------------------------------------------------- */
.artia-sidebar-mywidget-theme-classic {
  @apply hidden xl:block w-60 shrink-0;
}

.artia-sidebar-mywidget-title-theme-classic {
  @apply text-sm font-semibold mb-4;
  color: var(--artia-color-text);
}
```

如果有 Dark 主題，也要在 `assets/css/theme-dark.css` 中加入對應樣式。

### 步驟 4：加入 Tailwind Safelist

在 `assets/css/theme-safelist.txt` 中加入新的類別名稱：

```
<!-- MyWidget - Classic -->
artia-sidebar-mywidget-theme-classic
artia-sidebar-mywidget-title-theme-classic

<!-- MyWidget - Dark -->
artia-sidebar-mywidget-theme-dark
artia-sidebar-mywidget-title-theme-dark
```

### 步驟 5：更新環境變數說明

在 `.env` 和 `.env.example` 的可用元件清單中加入：

```bash
# 可用元件（每個位置只能填一個）：
#   author     - 作者介紹
#   navigation - 內容導航/作品清單
#   toc        - 目錄 (Table of Contents)
#   hero       - 首頁 Hero 區塊
#   featured   - 精選作品
#   recent     - 最新內容
#   mywidget   - 我的自訂元件    # 新增
#   none       - 不顯示
```

### 步驟 6：使用新元件

在 `.env` 中設定佈局：

```bash
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="mywidget"
```

## 元件開發規範

### 命名規則

| 項目 | 規則 | 範例 |
|------|------|------|
| 檔案名稱 | PascalCase | `MyWidget.vue` |
| 元件 ID（.env 用） | lowercase | `mywidget` |
| componentMap 值 | Layout + 檔名 | `LayoutMyWidget` |
| CSS 類別 | artia-{name}-theme-{theme} | `artia-sidebar-mywidget-theme-classic` |

### 使用 useTheme

所有樣式都應透過 `useTheme` 的 `t()` 函數生成：

```vue
<script setup>
const { t } = useTheme()
</script>

<template>
  <!-- ✅ 正確 -->
  <div :class="t('sidebar-mywidget')">

  <!-- ❌ 錯誤：不要硬編碼類別名稱 -->
  <div class="artia-sidebar-mywidget-theme-classic">
</template>
```

### 存取設定

使用 `useRuntimeConfig()` 存取 `.env` 設定：

```vue
<script setup>
const config = useRuntimeConfig()

// 存取 NUXT_PUBLIC_SITE_NAME
const siteName = config.public.siteName
</script>
```

### 資料取得

使用 `useAsyncData` 取得內容：

```vue
<script setup>
const { data: posts } = await useAsyncData('posts', () => {
  return queryContent()
    .limit(5)
    .find()
})
</script>
```

## 完整範例

以下是一個完整的「社群連結」元件範例：

### 1. 建立元件

```vue
<!-- components/layout/SocialLinks.vue -->
<script setup lang="ts">
const { t } = useTheme()
const config = useRuntimeConfig()

const links = computed(() => [
  { name: 'Twitter', url: config.public.socialTwitter, icon: '𝕏' },
  { name: 'GitHub', url: config.public.socialGithub, icon: '⌨' },
  { name: 'Discord', url: config.public.socialDiscord, icon: '💬' },
].filter(link => link.url))
</script>

<template>
  <aside v-if="links.length > 0" :class="t('sidebar-social')">
    <h3 :class="t('sidebar-social-title')">社群連結</h3>
    <nav :class="t('sidebar-social-list')">
      <a 
        v-for="link in links" 
        :key="link.name"
        :href="link.url"
        target="_blank"
        :class="t('sidebar-social-link')"
      >
        <span>{{ link.icon }}</span>
        <span>{{ link.name }}</span>
      </a>
    </nav>
  </aside>
</template>
```

### 2. 註冊元件

```typescript
// composables/useLayout.ts
export type LayoutComponent = 
  | 'author' 
  | 'navigation' 
  | 'toc' 
  | 'hero' 
  | 'featured' 
  | 'recent'
  | 'social'  // 新增
  | 'none'

const componentMap: Record<LayoutComponent, string> = {
  // ... 現有元件
  social: 'LayoutSocialLinks',
  none: '',
}
```

### 3. 加入樣式

```css
/* assets/css/main.css */
.artia-sidebar-social-theme-classic {
  @apply hidden xl:block w-60 shrink-0;
}

.artia-sidebar-social-title-theme-classic {
  @apply text-sm font-semibold mb-4;
}

.artia-sidebar-social-list-theme-classic {
  @apply flex flex-col gap-2;
}

.artia-sidebar-social-link-theme-classic {
  @apply flex items-center gap-2 text-sm py-1 transition-colors;
  color: var(--artia-color-text-secondary);
}

.artia-sidebar-social-link-theme-classic:hover {
  color: var(--artia-color-primary);
}
```

### 4. 更新 Safelist

```
artia-sidebar-social-theme-classic
artia-sidebar-social-title-theme-classic
artia-sidebar-social-list-theme-classic
artia-sidebar-social-link-theme-classic
```

### 5. 使用元件

```bash
# .env
NUXT_PUBLIC_LAYOUT_HOME_RIGHT="social"
```

## 疑難排解

### 元件沒有顯示

1. 確認 `componentMap` 中的值正確（Layout + 檔名）
2. 確認 `.env` 中的值與 `LayoutComponent` 類型一致
3. 確認元件檔案存在於 `components/layout/`

### 樣式沒有套用

1. 確認使用 `t()` 函數生成類別名稱
2. 確認 CSS 類別已加入 `theme-safelist.txt`
3. 重新啟動開發伺服器（`npm run dev`）

### TypeScript 錯誤

確認在 `LayoutComponent` 類型中加入新元件名稱。
