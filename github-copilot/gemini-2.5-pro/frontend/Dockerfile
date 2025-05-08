# ベースイメージとしてNode.jsのLTS版（Alpine Linux）を使用
FROM node:22

# 追記
RUN apt update && apt install -y xdg-utils

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.json（またはyarn.lock）をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Viteの開発サーバーが使用するポート3000を公開
EXPOSE 3000

# コンテナ起動時にVite開発サーバーを起動（ホスト0.0.0.0でリッスン）
CMD ["npm", "run", "dev", "--", "--host"]