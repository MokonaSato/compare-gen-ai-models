# Vocabulary App

このプロジェクトは、単語帳管理アプリケーションを作成するためのものです。フロントエンドにはReact、TypeScript、Viteを使用し、バックエンドにはPythonとFastAPIを使用しています。データベースにはMySQLを利用し、全体をDocker Composeで管理します。

## プロジェクト構成

```
vocabulary-app
├── backend                # バックエンド関連
│   ├── app                # FastAPIアプリケーション
│   ├── Dockerfile         # バックエンドのDockerイメージ設定
│   └── requirements.txt   # Pythonパッケージの依存関係
├── frontend               # フロントエンド関連
│   ├── public             # 静的ファイル
│   ├── src                # ソースコード
│   ├── index.html         # HTMLテンプレート
│   ├── package.json       # フロントエンドの依存関係
│   ├── tsconfig.json      # TypeScript設定
│   └── vite.config.ts     # Vite設定
├── docker-compose.yml     # Docker Compose設定
└── README.md              # プロジェクトの概要
```

## セットアップ手順

1. **DockerとDocker Composeのインストール**
   - DockerとDocker Composeがインストールされていることを確認してください。

2. **プロジェクトのクローン**
   ```bash
   git clone <repository-url>
   cd vocabulary-app
   ```

3. **Docker Composeでの起動**
   ```bash
   docker-compose up --build
   ```

4. **アプリケーションにアクセス**
   - フロントエンドは `http://localhost:3000` でアクセスできます。
   - バックエンドAPIは `http://localhost:8000` でアクセスできます。

## 使用技術

- **フロントエンド**: React, TypeScript, Vite
- **バックエンド**: Python, FastAPI
- **データベース**: MySQL
- **コンテナ管理**: Docker, Docker Compose

## 貢献

このプロジェクトへの貢献は大歓迎です。バグ報告や機能追加の提案は、Issueを通じて行ってください。プルリクエストもお待ちしています。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細はLICENSEファイルを参照してください。