# ベースイメージを指定
FROM node:18-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json (または yarn.lock) をコピー
COPY package*.json ./

# 依存関係をインストール (npm ci を推奨)
RUN npm ci

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 本番環境用の軽量イメージ
FROM nginx:stable-alpine
# ビルド成果物をNginxのドキュメントルートにコピー
COPY --from=builder /app/dist /usr/share/nginx/html
# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf
# ポートを公開
EXPOSE 80
# Nginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]