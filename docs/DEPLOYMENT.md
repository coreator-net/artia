# 部署指南

本文件說明如何將 Artia 部署到各種環境。

## Docker 部署（推薦）

### 前置需求

- Docker 20.10+
- Docker Compose v2.0+（選用）

### 快速部署

1. **複製環境變數檔案**

   ```bash
   cp .env.example .env
   ```

2. **編輯設定**

   編輯 `.env` 檔案，設定網站資訊和 Google 服務金鑰。

3. **使用 Docker Compose 啟動**

   ```bash
   docker-compose up -d
   ```

   網站將在 `http://localhost:3000` 啟動。

### 手動 Docker 建置

如果不使用 Docker Compose，可以手動建置和執行：

```bash
# 建置映像
docker build -t artia:latest .

# 執行容器
docker run -d \
  --name artia \
  -p 3000:3000 \
  --env-file .env \
  artia:latest
```

### 環境變數注入

在 Docker 環境中，可以透過多種方式注入環境變數：

#### 方法 1：使用 .env 檔案

```bash
docker run --env-file .env artia:latest
```

#### 方法 2：直接指定環境變數

```bash
docker run -d \
  -e NUXT_PUBLIC_SITE_NAME="My Site" \
  -e NUXT_PUBLIC_GA4_ID="G-XXXXXXXXXX" \
  artia:latest
```

#### 方法 3：在 docker-compose.yml 中設定

```yaml
services:
  artia:
    environment:
      - NUXT_PUBLIC_SITE_NAME=My Site
      - NUXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

## 靜態託管 (SSG)

如果不需要 SSR，可以將 Artia 建置為靜態網站：

1. **修改 nuxt.config.ts**

   ```typescript
   export default defineNuxtConfig({
     ssr: false,
     // 或使用 SSG
     nitro: {
       preset: 'static'
     }
   })
   ```

2. **建置靜態檔案**

   ```bash
   npm run generate
   ```

3. **部署 .output/public 資料夾**

   將 `.output/public` 資料夾部署到任何靜態檔案託管服務：
   - GitHub Pages
   - Netlify
   - Vercel
   - Cloudflare Pages

## Vercel 部署

1. 在 [Vercel](https://vercel.com) 建立新專案
2. 連結 Git 儲存庫
3. 設定環境變數（在 Settings > Environment Variables）
4. 部署

**vercel.json 範例（選用）：**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public"
}
```

## Netlify 部署

1. 在 [Netlify](https://netlify.com) 建立新網站
2. 連結 Git 儲存庫
3. 設定建置命令：`npm run build`
4. 設定發布目錄：`.output/public`
5. 在 Site settings > Environment 設定環境變數

## 雲端平台部署

### AWS / GCP / Azure

使用 Docker 映像部署到：

- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Apps

範例（Google Cloud Run）：

```bash
# 建置並推送映像
gcloud builds submit --tag gcr.io/PROJECT_ID/artia

# 部署
gcloud run deploy artia \
  --image gcr.io/PROJECT_ID/artia \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NUXT_PUBLIC_SITE_NAME="My Site"
```

## 效能最佳化

### 1. 啟用壓縮

在 Nginx 或其他反向代理中啟用 gzip 壓縮：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
```

### 2. 設定快取標頭

```nginx
location /_nuxt/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### 3. 使用 CDN

將靜態資源放在 CDN 上以提高載入速度：

- Cloudflare
- AWS CloudFront
- Fastly

## 健康檢查

Docker 容器包含健康檢查端點：

```bash
curl http://localhost:3000/
```

Docker Compose 會自動進行健康檢查，確保容器正常運行。

## 故障排除

### 容器無法啟動

1. 檢查日誌：
   ```bash
   docker logs artia
   ```

2. 確認環境變數是否正確設定

3. 確認 port 3000 沒有被其他程式佔用

### 樣式沒有正確套用

1. 確認 `NUXT_PUBLIC_THEME` 設定正確
2. 確認主題 CSS 檔案存在
3. 檢查 `theme-safelist.txt` 是否包含所有主題類別

### Google Analytics 沒有追蹤

1. 確認 `NUXT_PUBLIC_GA4_ID` 格式正確（G-XXXXXXXXXX）
2. 在瀏覽器開發者工具中檢查是否有載入 gtag.js
3. 確認沒有被廣告阻擋器攔截
