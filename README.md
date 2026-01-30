# Artia

> Arthub forges Artia. Artlas connects Artia. Each creator owns an Artia.

**Artia** 是一個為創作者打造的個人作品展示平台，基於 Nuxt 3 和 Nuxt Content 構建。每位創作者都可以擁有自己的 Artia，用來展示和分享創作內容。

## ✨ 特色功能

- 📝 **Markdown 內容管理** - 使用 Nuxt Content 輕鬆管理作品內容
- 🎨 **主題系統** - 模組化的主題設計，輕鬆自訂外觀
- 🔒 **密碼保護** - 支援內容密碼保護功能
- 📱 **響應式設計** - 完美支援桌面與行動裝置
- 🐳 **Docker 部署** - 一鍵部署到任何支援 Docker 的環境
- 🖼️ **資產管理** - 內建圖片和媒體檔案管理

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm 或 pnpm
- Docker（可選，用於容器化部署）

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

開發伺服器會在 `http://localhost:3000` 啟動。

## 🐳 Docker 部署

### 方式一：使用 Docker Compose（推薦）

```bash
# 生產環境部署
npm run docker:up
# 或
docker-compose up -d production

# 停止服務
npm run docker:down
# 或
docker-compose down

# 開發環境（含熱重載）
npm run docker:dev
# 或
docker-compose up dev
```

### 方式二：使用 Dockerfile

```bash
# 建置映像
npm run docker:build
# 或
docker build -t artia .

# 執行容器
npm run docker:run
# 或
docker run -p 3000:3000 artia
```

### 方式三：自訂部署

```bash
# 建置並標記版本
docker build -t artia:v1.0.0 .

# 推送到 Registry
docker tag artia:v1.0.0 your-registry.com/artia:v1.0.0
docker push your-registry.com/artia:v1.0.0

# 在伺服器上執行
docker pull your-registry.com/artia:v1.0.0
docker run -d -p 80:3000 --name artia your-registry.com/artia:v1.0.0
```

## 🎨 主題自訂

Artia 使用模組化的主題系統，所有樣式都收攏在 CSS 檔案中，方便自訂。

### 切換主題

在 `.env` 檔案中設定主題：

```bash
# 可選值：classic, dark（或自訂主題名稱）
NUXT_PUBLIC_THEME="classic"
```

目前內建主題：
- `classic` - 經典淺色主題（預設）
- `dark` - 深色主題

### 主題結構

- **CSS 變數**：定義顏色、間距、圓角等基礎設定
- **組件類別**：使用 `artia-{component}-theme-{name}` 命名規則

### 快速自訂：修改 CSS 變數

編輯 `assets/css/main.css` 中的 `:root` 變數：

```css
:root {
  /* 主色調 */
  --artia-color-primary: #3b82f6;
  --artia-color-primary-hover: #2563eb;
  --artia-color-primary-light: #eff6ff;
  
  /* 背景色 */
  --artia-color-bg: #f9fafb;
  --artia-color-surface: #ffffff;
  
  /* 文字色 */
  --artia-color-text: #111827;
  --artia-color-text-secondary: #6b7280;
  
  /* 邊框 */
  --artia-color-border: #e5e7eb;
  
  /* 圓角 */
  --artia-radius-md: 0.5rem;
  --artia-radius-lg: 0.75rem;
}
```

### 深色主題範例

```css
:root {
  --artia-color-primary: #60a5fa;
  --artia-color-primary-hover: #3b82f6;
  --artia-color-primary-light: #1e3a5f;
  
  --artia-color-bg: #0f172a;
  --artia-color-surface: #1e293b;
  --artia-color-border: #334155;
  
  --artia-color-text: #f1f5f9;
  --artia-color-text-secondary: #cbd5e1;
}
```

### 進階自訂：覆寫組件樣式

所有組件都使用以下命名規則：

```
artia-{component}-{element?}-theme-classic
```

在 `assets/css/main.css` 最後加入覆寫：

```css
/* 自訂 Header 樣式 */
.artia-header-theme-classic {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.artia-header-logo-theme-classic {
  color: white;
}

/* 自訂卡片樣式 */
.artia-card-theme-classic {
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

### 組件類別對照表

| 組件 | 類別名稱 |
|------|----------|
| 應用容器 | `artia-app-theme-classic` |
| Header | `artia-header-theme-classic` |
| Footer | `artia-footer-theme-classic` |
| 側邊欄 | `artia-sidebar-*-theme-classic` |
| 卡片 | `artia-card-theme-classic` |
| 按鈕 | `artia-btn-*-theme-classic` |
| 輸入框 | `artia-input-theme-classic` |
| 標題 | `artia-heading-*-theme-classic` |

詳細的主題文件請參考 [docs/THEMING.md](docs/THEMING.md)。

## 📁 專案結構

```
artia/
├── assets/
│   └── css/
│       └── main.css          # 主題樣式（所有樣式集中於此）
├── components/
│   ├── layout/               # 佈局組件
│   │   ├── TheHeader.vue
│   │   ├── TheFooter.vue
│   │   ├── SidebarAuthor.vue
│   │   └── SidebarContent.vue
│   ├── content/              # 內容組件
│   │   ├── Alert.vue
│   │   └── Counter.vue
│   └── PasswordPrompt.vue
├── content/                  # Markdown 內容
├── layouts/
│   └── default.vue           # 預設佈局
├── pages/
│   ├── index.vue             # 首頁
│   └── [...slug].vue         # 動態內容頁
├── docs/
│   └── THEMING.md            # 主題文件
├── Dockerfile                # Docker 建置檔
├── docker-compose.yml        # Docker Compose 設定
└── nuxt.config.ts            # Nuxt 設定
```

## ⚙️ 設定

### 網站設定

編輯 `nuxt.config.ts` 中的 `runtimeConfig.public`：

```typescript
runtimeConfig: {
  public: {
    siteName: 'Artia',
    siteTitle: '歡迎來到 Artia',
    siteDescription: '這裡是創作者的天地...',
    authorName: '你的名字',
    authorBio: '你的簡介',
  },
}
```

### 新增內容

在 `content/` 目錄下建立 Markdown 檔案：

```markdown
---
title: 我的作品
description: 這是一篇作品介紹
---

# 我的作品

這裡是內容...
```

## 📜 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！
