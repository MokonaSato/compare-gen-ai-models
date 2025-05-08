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

## 詳細なディレクトリ構成

```
wordbook-app/
├── docker-compose.yml      # Docker Compose設定ファイル
├── README.md               # プロジェクト説明書
├── backend/                # バックエンドアプリケーション
│   ├── Dockerfile          # Pythonアプリケーションのコンテナ設定
│   ├── main.py             # FastAPIアプリケーションのメインファイル
│   └── requirements.txt    # Python依存パッケージリスト
├── db/                     # データベース関連ファイル
│   ├── init.sql            # 初期データ投入用SQLファイル
│   └── my.cnf              # MySQLの設定ファイル
└── frontend/               # フロントエンドアプリケーション
    ├── Dockerfile          # Reactアプリケーションのコンテナ設定
    ├── index.html          # HTMLエントリーポイント
    ├── package.json        # npm設定とパッケージ管理
    ├── tsconfig.json       # TypeScript設定
    ├── tsconfig.node.json  # Node用TypeScript設定
    ├── vite.config.ts      # Vite設定ファイル
    └── src/                # ソースコード
        ├── App.tsx         # メインアプリケーションコンポーネント
        ├── main.tsx        # Reactエントリーポイント
        └── pages/          # ページコンポーネント
            ├── Home.tsx            # ホーム画面
            └── NotebookDetail.tsx  # 単語帳詳細画面
```