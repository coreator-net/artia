# =============================================================================
# Artia - Multi-stage Dockerfile
# 
# 這個 Dockerfile 使用多階段建置來優化映像大小
# Stage 1: 建置應用程式
# Stage 2: 執行生產環境
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package files
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製原始碼
COPY . .

# 建置應用程式
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# 設定環境變數
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# 設定工作目錄
WORKDIR /app

# 從 builder 階段複製建置產物
COPY --from=builder /app/.output /app/.output

# 暴露埠號
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 啟動應用程式
CMD ["node", ".output/server/index.mjs"]
