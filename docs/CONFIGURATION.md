# 設定參考

本文件詳細說明 Artia 的所有環境變數設定。

## 基本設定

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_SITE_NAME` | 網站名稱 | `'Artia'` | `'我的部落格'` |
| `NUXT_PUBLIC_SITE_DESCRIPTION` | 網站描述 | `''` | `'分享技術與生活'` |
| `NUXT_PUBLIC_SITE_URL` | 網站網址 | `''` | `'https://example.com'` |
| `NUXT_PUBLIC_SITE_LOCALE` | 網站語言 | `'zh-TW'` | `'en-US'` |
| `NUXT_PUBLIC_THEME` | 主題名稱 | `'classic'` | `'dark'` |

## Google 服務

### Google Analytics 4

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_GA4_ID` | GA4 評估 ID | `''` | `'G-XXXXXXXXXX'` |

**取得方式：**
1. 前往 [Google Analytics](https://analytics.google.com/)
2. 管理員 > 資料串流 > 選擇串流
3. 複製「評估 ID」(G-XXXXXXXXXX)

### Google Tag Manager

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_GTM_ID` | GTM 容器 ID | `''` | `'GTM-XXXXXXX'` |

**取得方式：**
1. 前往 [Google Tag Manager](https://tagmanager.google.com/)
2. 選擇容器
3. 複製容器 ID (GTM-XXXXXXX)

### Google Search Console

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_GSC_VERIFICATION` | 網站驗證碼 | `''` | `'abc123...'` |

**取得方式：**
1. 前往 [Google Search Console](https://search.google.com/search-console/)
2. 新增資源 > HTML 標記驗證
3. 複製 `content` 屬性值

### Google AdSense

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_ADSENSE_CLIENT` | AdSense 用戶端 ID | `''` | `'ca-pub-XXXXXXX'` |
| `NUXT_PUBLIC_ADSENSE_SLOT` | 廣告版位 ID | `''` | `'1234567890'` |

**取得方式：**
1. 前往 [Google AdSense](https://www.google.com/adsense/)
2. 帳戶 > 帳戶資訊 > 發布商 ID
3. 廣告 > 依廣告單元 > 取得程式碼

## 社群媒體

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_TWITTER_HANDLE` | Twitter/X 帳號 | `''` | `'@username'` |
| `NUXT_PUBLIC_GITHUB_URL` | GitHub 個人頁面 | `''` | `'https://github.com/user'` |
| `NUXT_PUBLIC_DISCORD_URL` | Discord 邀請連結 | `''` | `'https://discord.gg/xxx'` |

## SEO 設定

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_OG_IMAGE` | Open Graph 預設圖片 | `''` | `'/og-image.jpg'` |
| `NUXT_PUBLIC_TWITTER_CARD` | Twitter 卡片類型 | `'summary_large_image'` | `'summary'` |

### Twitter Card 類型

| 類型 | 說明 |
|------|------|
| `summary` | 小型摘要卡片 |
| `summary_large_image` | 大圖摘要卡片（推薦） |
| `app` | 應用程式卡片 |
| `player` | 影片/音訊卡片 |

### Open Graph 圖片建議

- 尺寸：1200 x 630 像素
- 格式：JPG 或 PNG
- 檔案大小：< 1MB
- 放置位置：`/public/og-image.jpg`

## 評論系統

Artia 支援 Giscus 和 Disqus 兩種評論系統，擇一設定即可。

### Giscus（推薦）

Giscus 使用 GitHub Discussions 作為評論後端，適合技術部落格。

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_GISCUS_REPO` | GitHub 儲存庫 | `''` | `'user/repo'` |
| `NUXT_PUBLIC_GISCUS_REPO_ID` | 儲存庫 ID | `''` | `'R_xxx'` |
| `NUXT_PUBLIC_GISCUS_CATEGORY` | Discussions 分類 | `''` | `'Announcements'` |
| `NUXT_PUBLIC_GISCUS_CATEGORY_ID` | 分類 ID | `''` | `'DIC_xxx'` |

**設定步驟：**
1. 前往 [giscus.app](https://giscus.app/)
2. 輸入儲存庫名稱
3. 選擇 Discussions 分類
4. 複製生成的設定值

### Disqus

Disqus 是傳統的評論系統，適合一般部落格。

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `NUXT_PUBLIC_DISQUS_SHORTNAME` | Disqus shortname | `''` | `'my-blog'` |

**設定步驟：**
1. 前往 [Disqus](https://disqus.com/)
2. 建立新網站
3. 複製 shortname

## 主題設定

### 內建主題

| 主題名稱 | 說明 |
|----------|------|
| `classic` | 預設淺色主題 |
| `dark` | 深色主題 |

### 自訂主題

參考 [THEMING.md](./THEMING.md) 了解如何建立自訂主題。

## 內容設定

| 變數名稱 | 說明 | 預設值 | 範例 |
|----------|------|--------|------|
| `CONTENT_PASSWORD` | 加密內容的預設密碼 | `''` | `'secret123'` |

## 完整 .env 範例

```bash
# 基本設定
NUXT_PUBLIC_SITE_NAME="我的技術部落格"
NUXT_PUBLIC_SITE_DESCRIPTION="分享程式開發的心得與技術"
NUXT_PUBLIC_SITE_URL="https://blog.example.com"
NUXT_PUBLIC_SITE_LOCALE="zh-TW"
NUXT_PUBLIC_THEME="classic"

# Google Analytics 4
NUXT_PUBLIC_GA4_ID="G-XXXXXXXXXX"

# Google Tag Manager
NUXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# Google Search Console
NUXT_PUBLIC_GSC_VERIFICATION="your-verification-code"

# Google AdSense
NUXT_PUBLIC_ADSENSE_CLIENT="ca-pub-XXXXXXXXXX"
NUXT_PUBLIC_ADSENSE_SLOT="1234567890"

# 社群媒體
NUXT_PUBLIC_TWITTER_HANDLE="@myhandle"
NUXT_PUBLIC_GITHUB_URL="https://github.com/myuser"
NUXT_PUBLIC_DISCORD_URL="https://discord.gg/myserver"

# SEO
NUXT_PUBLIC_OG_IMAGE="/og-image.jpg"
NUXT_PUBLIC_TWITTER_CARD="summary_large_image"

# 評論系統 (Giscus)
NUXT_PUBLIC_GISCUS_REPO="myuser/myrepo"
NUXT_PUBLIC_GISCUS_REPO_ID="R_kgDOxxxxxx"
NUXT_PUBLIC_GISCUS_CATEGORY="Announcements"
NUXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_kwDOxxxxxx"

# 或使用 Disqus
# NUXT_PUBLIC_DISQUS_SHORTNAME="my-blog"

# 內容密碼
CONTENT_PASSWORD="your-secret-password"
```

## 環境變數優先順序

1. 系統環境變數
2. Docker 環境變數（`docker run -e`）
3. `.env` 檔案
4. `nuxt.config.ts` 中的預設值

## 注意事項

### NUXT_PUBLIC_ 前綴

所有需要在客戶端使用的環境變數都必須使用 `NUXT_PUBLIC_` 前綴。沒有此前綴的變數只能在伺服器端使用。

### 敏感資訊

- 不要將 `.env` 檔案提交到 Git
- 在生產環境中使用安全的密鑰管理服務
- 定期輪換敏感金鑰

### 快取

修改環境變數後，需要重新建置專案才會生效：

```bash
# 開發環境
npm run dev

# 生產環境
npm run build
docker-compose up -d --build
```
