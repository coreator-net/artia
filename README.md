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
- 📊 **Google 整合** - 內建 GA4、Search Console、AdSense 支援
- 💬 **評論系統** - 支援 Giscus、Disqus 等評論功能
- 🔗 **社群整合** - 輕鬆連結各大社群平台

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm 或 pnpm
- Docker（可選，用於容器化部署）

### 本地開發

```bash
# 安裝依賴
npm install

# 複製環境變數範本
cp .env.example .env

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

開發伺服器會在 `http://localhost:3000` 啟動。

## ⚙️ 環境變數設定

所有設定都透過 `.env` 檔案管理。複製 `.env.example` 為 `.env` 並依需求修改。

### 基本設定

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `NUXT_PUBLIC_THEME` | 主題名稱 | `classic` |
| `NUXT_PUBLIC_SITE_NAME` | 網站名稱 | `Artia` |
| `NUXT_PUBLIC_SITE_TITLE` | 網站標題 | `歡迎來到 Artia` |
| `NUXT_PUBLIC_SITE_DESCRIPTION` | 網站描述 | - |
| `NUXT_PUBLIC_SITE_URL` | 網站網址（用於 SEO） | - |
| `NUXT_PUBLIC_SITE_LOCALE` | 網站語言 | `zh-TW` |

### 作者設定

| 變數 | 說明 |
|------|------|
| `NUXT_PUBLIC_AUTHOR_NAME` | 作者名稱 |
| `NUXT_PUBLIC_AUTHOR_BIO` | 作者簡介 |
| `NUXT_PUBLIC_AUTHOR_AVATAR` | 作者頭像 URL |

### Google 服務

| 變數 | 說明 | 格式範例 |
|------|------|----------|
| `NUXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |
| `NUXT_PUBLIC_GSC_VERIFICATION` | Google Search Console 驗證碼 | 驗證 meta 標籤內容 |
| `NUXT_PUBLIC_ADSENSE_ID` | Google AdSense 發布商 ID | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NUXT_PUBLIC_ADSENSE_AUTO_ADS` | 是否啟用自動廣告 | `true` / `false` |
| `NUXT_PUBLIC_GTM_ID` | Google Tag Manager 容器 ID | `GTM-XXXXXXX` |

### SEO 設定

| 變數 | 說明 |
|------|------|
| `NUXT_PUBLIC_OG_IMAGE` | Open Graph 預設圖片（社群分享時顯示） |
| `NUXT_PUBLIC_TWITTER_CARD` | Twitter Card 類型（`summary` 或 `summary_large_image`） |

### 社群媒體

| 變數 | 平台 |
|------|------|
| `NUXT_PUBLIC_SOCIAL_TWITTER` | Twitter/X 網址 |
| `NUXT_PUBLIC_SOCIAL_FACEBOOK` | Facebook 網址 |
| `NUXT_PUBLIC_SOCIAL_INSTAGRAM` | Instagram 網址 |
| `NUXT_PUBLIC_SOCIAL_GITHUB` | GitHub 網址 |
| `NUXT_PUBLIC_SOCIAL_DISCORD` | Discord 邀請連結 |
| `NUXT_PUBLIC_SOCIAL_YOUTUBE` | YouTube 頻道網址 |

### 評論系統

| 變數 | 說明 |
|------|------|
| `NUXT_PUBLIC_COMMENTS_ENABLED` | 是否啟用評論（`true` / `false`） |
| `NUXT_PUBLIC_COMMENTS_PROVIDER` | 評論提供者（`giscus` / `disqus`） |

#### Giscus 設定（GitHub Discussions）

前往 [giscus.app](https://giscus.app) 取得以下設定：

| 變數 | 說明 |
|------|------|
| `NUXT_PUBLIC_GISCUS_REPO` | GitHub 儲存庫（格式：`owner/repo`） |
| `NUXT_PUBLIC_GISCUS_REPO_ID` | 儲存庫 ID |
| `NUXT_PUBLIC_GISCUS_CATEGORY` | Discussion 分類名稱 |
| `NUXT_PUBLIC_GISCUS_CATEGORY_ID` | 分類 ID |

#### Disqus 設定

| 變數 | 說明 |
|------|------|
| `NUXT_PUBLIC_DISQUS_SHORTNAME` | Disqus 網站短名稱 |

完整的環境變數範例請參考 [.env.example](.env.example)。

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
│       ├── main.css              # Classic 主題樣式
│       ├── theme-dark.css        # Dark 主題樣式
│       └── theme-safelist.txt    # 主題類別清單（Tailwind 用）
├── components/
│   ├── layout/                   # 佈局組件
│   │   ├── TheHeader.vue
│   │   ├── TheFooter.vue
│   │   ├── SidebarAuthor.vue
│   │   └── SidebarContent.vue
│   ├── content/                  # 內容組件
│   │   ├── Alert.vue
│   │   └── Counter.vue
│   └── PasswordPrompt.vue
├── composables/
│   ├── useTheme.ts               # 主題系統 composable
│   └── useProtectedContent.ts    # 密碼保護 composable
├── content/                      # Markdown 內容
├── layouts/
│   └── default.vue               # 預設佈局（聖杯架構）
├── pages/
│   ├── index.vue                 # 首頁
│   └── [...slug].vue             # 動態內容頁
├── docs/
│   └── THEMING.md                # 主題自訂指南
├── .env.example                  # 環境變數範本
├── Dockerfile                    # Docker 建置檔
├── docker-compose.yml            # Docker Compose 設定
└── nuxt.config.ts                # Nuxt 設定
```

## 📝 內容管理

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

### 密碼保護內容

在 front matter 中加入 `password` 欄位：

```markdown
---
title: 私密內容
password: mysecretpassword
---

這是受保護的內容...
```

### 目錄結構

```
content/
├── index.md              # 首頁內容
├── about.md              # 關於頁面
└── 作品集/               # 作品資料夾
    ├── _folder.作品集.md # 資料夾設定
    ├── 作品一/
    │   ├── _intro.作品一.md
    │   └── 1. 第一章_0.md
    └── 作品二/
        └── ...
```

## 📖 文件

- [主題自訂指南](docs/THEMING.md) - 主題系統與自訂樣式說明
- [佈局系統](docs/LAYOUT.md) - 頁面區域配置與元件擺放
- [設定參考](docs/CONFIGURATION.md) - 完整的環境變數與設定說明
- [部署指南](docs/DEPLOYMENT.md) - Docker、Vercel、Netlify 等部署方式
- [環境變數範本](.env.example) - 快速開始的設定範本
