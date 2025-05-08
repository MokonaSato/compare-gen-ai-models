# 単語帳管理アプリ

## 概要
- 科目ごとに単語帳を作成し、単語カードを管理できるアプリケーションです。
- フロントエンド: React + TypeScript + Vite
- バックエンド: Python (FastAPI)
- データベース: MySQL
- Docker Composeで一括起動

## ディレクトリ構成
```
wordbook-app/
  frontend/         # フロントエンド (React + Vite)
  backend/          # バックエンド (FastAPI)
  db/               # MySQL初期データ
  docker-compose.yml
  README.md
```

## セットアップ手順

1. DockerとDocker Composeをインストール
2. プロジェクトルートで以下を実行
   ```
   docker-compose up --build
   ```
3. フロントエンド: http://localhost:3000  
   バックエンド: http://localhost:8000  
   MySQL: ポート3306

## 初期テストデータ
- 起動時にDBへ自動投入されます（`db/init.sql`参照）