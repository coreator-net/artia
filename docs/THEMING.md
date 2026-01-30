# Artia 主題系統

Artia 使用模組化的主題系統，讓用戶可以輕鬆自訂網站外觀。

## 命名規則

所有主題 class 都遵循以下命名規則：

```
artia-{component}-{element?}-theme-{themeName}
```

- `component`: 元件名稱（如 `header`, `card`, `btn`）
- `element`: 可選的子元素（如 `title`, `desc`, `avatar`）
- `themeName`: 主題名稱（預設為 `classic`）

### 範例

```css
.artia-header-theme-classic        /* Header 元件 */
.artia-header-logo-theme-classic   /* Header 中的 Logo */
.artia-card-theme-classic          /* Card 元件 */
.artia-card-title-theme-classic    /* Card 中的標題 */
.artia-btn-primary-theme-classic   /* Primary 按鈕 */
```

## 自訂主題

### 方法一：修改 CSS 變數

最簡單的方式是修改 `assets/css/main.css` 中的 CSS 變數：

```css
:root {
  /* Primary Colors - 修改主色調 */
  --artia-color-primary: #3b82f6;
  --artia-color-primary-hover: #2563eb;
  --artia-color-primary-light: #eff6ff;
  
  /* Text Colors - 修改文字顏色 */
  --artia-color-text: #111827;
  --artia-color-text-secondary: #6b7280;
  
  /* 其他變數... */
}
```

### 方法二：建立新主題

1. 複製 `assets/css/main.css` 為 `assets/css/theme-{yourThemeName}.css`
2. 將所有 `theme-classic` 替換為 `theme-{yourThemeName}`
3. 修改樣式內容
4. 在 `nuxt.config.ts` 中引入新的主題檔案

### 方法三：覆寫特定樣式

在 `assets/css/main.css` 最後加入覆寫樣式：

```css
/* 自訂覆寫 */
.artia-header-theme-classic {
  background-color: #1a1a2e;
  border-color: #16213e;
}

.artia-header-logo-theme-classic {
  color: #e94560;
}
```

## 元件清單

### Layout 佈局

| Class | 說明 |
|-------|------|
| `artia-app-theme-classic` | 應用程式最外層容器 |
| `artia-container-theme-classic` | 內容容器 |
| `artia-layout-holygrail-theme-classic` | 三欄式聖杯佈局 |
| `artia-layout-main-theme-classic` | 主內容區域 |

### Header 頂部導覽

| Class | 說明 |
|-------|------|
| `artia-header-theme-classic` | Header 容器 |
| `artia-header-nav-theme-classic` | 導覽列 |
| `artia-header-logo-theme-classic` | Logo |
| `artia-header-menu-theme-classic` | 選單區域 |
| `artia-header-link-theme-classic` | 導覽連結 |

### Footer 底部區域

| Class | 說明 |
|-------|------|
| `artia-footer-theme-classic` | Footer 容器 |
| `artia-footer-grid-theme-classic` | Footer 網格 |
| `artia-footer-brand-theme-classic` | 品牌區域 |
| `artia-footer-copyright-theme-classic` | 版權資訊 |

### Sidebar 側邊欄

| Class | 說明 |
|-------|------|
| `artia-sidebar-author-theme-classic` | 作者側邊欄 |
| `artia-sidebar-content-theme-classic` | 內容側邊欄 |
| `artia-sidebar-author-avatar-theme-classic` | 作者頭像 |
| `artia-sidebar-content-link-theme-classic` | 內容連結 |

### Card 卡片

| Class | 說明 |
|-------|------|
| `artia-card-theme-classic` | 卡片容器 |
| `artia-card-header-theme-classic` | 卡片標頭 |
| `artia-card-title-theme-classic` | 卡片標題 |
| `artia-card-desc-theme-classic` | 卡片描述 |
| `artia-card-grid-theme-classic` | 卡片網格 |

### Button 按鈕

| Class | 說明 |
|-------|------|
| `artia-btn-theme-classic` | 基礎按鈕 |
| `artia-btn-primary-theme-classic` | 主要按鈕 |
| `artia-btn-secondary-theme-classic` | 次要按鈕 |

### Form 表單

| Class | 說明 |
|-------|------|
| `artia-input-theme-classic` | 輸入框 |
| `artia-label-theme-classic` | 標籤 |

### Typography 文字排版

| Class | 說明 |
|-------|------|
| `artia-heading-1-theme-classic` | 標題 1 |
| `artia-heading-2-theme-classic` | 標題 2 |
| `artia-heading-3-theme-classic` | 標題 3 |
| `artia-text-body-theme-classic` | 內文 |
| `artia-text-caption-theme-classic` | 說明文字 |

## CSS 變數參考

```css
:root {
  /* ===== Colors ===== */
  --artia-color-primary: #3b82f6;
  --artia-color-primary-hover: #2563eb;
  --artia-color-primary-light: #eff6ff;
  
  --artia-color-bg: #f9fafb;
  --artia-color-surface: #ffffff;
  --artia-color-border: #e5e7eb;
  --artia-color-border-light: #f3f4f6;
  
  --artia-color-text: #111827;
  --artia-color-text-secondary: #6b7280;
  --artia-color-text-muted: #9ca3af;
  
  --artia-color-success: #10b981;
  --artia-color-warning: #f59e0b;
  --artia-color-error: #ef4444;

  /* ===== Spacing ===== */
  --artia-spacing-xs: 0.25rem;
  --artia-spacing-sm: 0.5rem;
  --artia-spacing-md: 1rem;
  --artia-spacing-lg: 1.5rem;
  --artia-spacing-xl: 2rem;

  /* ===== Border Radius ===== */
  --artia-radius-sm: 0.25rem;
  --artia-radius-md: 0.5rem;
  --artia-radius-lg: 0.75rem;
  --artia-radius-xl: 1rem;

  /* ===== Shadows ===== */
  --artia-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --artia-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --artia-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* ===== Typography ===== */
  --artia-font-sans: 'Noto Sans TC', system-ui, sans-serif;
  --artia-font-serif: 'Noto Serif TC', Georgia, serif;
}
```

## 範例：深色主題

```css
/* Dark Theme Override */
:root {
  --artia-color-primary: #60a5fa;
  --artia-color-primary-hover: #3b82f6;
  --artia-color-primary-light: #1e3a5f;
  
  --artia-color-bg: #0f172a;
  --artia-color-surface: #1e293b;
  --artia-color-border: #334155;
  --artia-color-border-light: #475569;
  
  --artia-color-text: #f1f5f9;
  --artia-color-text-secondary: #cbd5e1;
  --artia-color-text-muted: #94a3b8;
}
```
