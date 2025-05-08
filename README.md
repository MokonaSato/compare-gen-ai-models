# コード生成性能比較プロジェクト

このリポジトリは、GitHub CopilotおよびRoo Codeを使用して、OpenAI、Anthropic、Googleの主要なコード生成モデルの性能を比較するためのプロジェクトです。

## プロジェクト概要

本プロジェクトでは、以下の主要なコード生成モデルを対象に、同一の要件に基づいて生成されたコードを比較・評価します。

- **OpenAI**: o3-mini/GPT-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro

比較対象として、各モデルが生成したコードの正確性、保守性、可読性、効率性を評価します。

## リポジトリ構成
```
. 
├── github-copilot/       # GitHub Copilotによるコード生成 
│ ├── claude-3.7-sonnet/  # Claude 3.7 Sonnetの生成コード 
│ ├── gemini-2.5-pro/     # Gemini 2.5 Proの生成コード 
│ └── o3-mini/            # o3-miniの生成コード 
├── roo-code/             # Roo Codeによるコード生成 
│ ├── claude-3.7-sonnet/  # Claude 3.7 Sonnetの生成コード 
│ ├── gemini-2.5-pro/     # Gemini 2.5 Proの生成コード 
│ └── gpt-4.1/            # GPT-4.1の生成コード 
└── prompt.txt            # 各モデルに与えたプロンプト
```


## 指定した使用技術

- **フロントエンド**: React, TypeScript, Vite
- **バックエンド**: Python
- **データベース**: MySQL
- **コンテナ管理**: Docker
