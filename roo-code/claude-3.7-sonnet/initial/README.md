# 単語帳管理アプリ

科目ごとの単語帳を作成し、その中に単語カードを登録・管理できるアプリケーションです。

## 機能

- 単語帳の作成・編集・削除
- 単語カードの作成・編集・削除
- 単語カードのお気に入り登録
- フィルタリング機能（お気に入りのみ表示）
- ソート機能（作成日、更新日、表面、裏面）
- Markdown形式での単語カード内容の保存・表示
- タグ機能（複数のタグを付与可能）

## 技術スタック

- フロントエンド: React + TypeScript + Vite
- バックエンド: Python (FastAPI)
- データベース: MySQL
- コンテナ: Docker (Docker Compose)

## 実行方法

### 前提条件

- Docker と Docker Compose がインストールされていること

### 起動手順

1. リポジトリをクローンする
   ```bash
   git clone <リポジトリURL>
   cd flashcard-app
   ```

2. Docker Composeでアプリケーションを起動する
   ```bash
   docker-compose up -d
   ```

3. ブラウザでアクセスする
   - フロントエンド: http://localhost:3000
   - バックエンドAPI: http://localhost:8000
   - API ドキュメント: http://localhost:8000/docs

### 停止方法

```bash
docker-compose down
```

## 開発方法

### フロントエンド開発

```bash
cd frontend
npm install
npm run dev
```

### バックエンド開発

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## データベース

初期データとして、以下のテストデータが登録されています：

- 単語帳：「英語基本単語」「プログラミング用語」「日本史年表」
- 各単語帳には複数の単語カードが登録済み
- タグ：「基本」「重要」「難しい」「文法」「発音」「歴史」「政治」「文化」「IT」「科学」

## プロジェクト構成

```
flashcard-app/
├── frontend/             # フロントエンドアプリケーション
│   ├── src/              # ソースコード
│   │   ├── components/   # コンポーネント
│   │   ├── pages/        # ページコンポーネント
│   │   ├── hooks/        # カスタムフック
│   │   ├── services/     # APIサービス
│   │   ├── types/        # 型定義
│   │   └── utils/        # ユーティリティ関数
│   └── public/           # 静的ファイル
├── backend/              # バックエンドアプリケーション
│   ├── app/              # アプリケーションコード
│   │   ├── models.py     # データモデル
│   │   ├── schemas.py    # Pydanticスキーマ
│   │   ├── crud.py       # CRUDオペレーション
│   │   └── main.py       # メインアプリケーション
│   ├── tests/            # テスト
│   └── migrations/       # データベースマイグレーション
├── mysql/                # MySQLデータ
│   ├── data/             # データファイル
│   └── init/             # 初期化スクリプト
├── nginx/                # Nginxの設定
└── docker-compose.yml    # Docker Compose設定