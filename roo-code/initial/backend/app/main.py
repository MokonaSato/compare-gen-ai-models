from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, SessionLocal, database, Base # Baseを追加
from . import models # modelsをインポート
from .routers import tags, wordbooks, word_cards, auth
# from .dependencies import get_current_active_user # 必要に応じて

# データベーステーブルを作成 (アプリケーション起動時に一度だけ実行されるべき)
# Alembicなどのマイグレーションツールを使うのがより堅牢
Base.metadata.create_all(bind=engine)


app = FastAPI(title="単語帳管理アプリ API")

# CORS (Cross-Origin Resource Sharing) の設定
origins = [
    "http://localhost:3000",  # フロントエンドのオリジン (Viteのデフォルト)
    "http://localhost:5173",  # フロントエンドのオリジン (Viteの別のデフォルトポート)
    # 必要に応じて他のオリジンも追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベース接続/切断のイベントハンドラ (非同期DB用)
@app.on_event("startup")
async def startup_db_client():
    await database.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await database.disconnect()


# ルーターの登録
app.include_router(auth.router)
app.include_router(tags.router)
app.include_router(wordbooks.router)
app.include_router(word_cards.router)


@app.get("/")
async def root():
    return {"message": "単語帳管理アプリ APIへようこそ！"}

# 認証が必要なエンドポイントの例 (デモ用)
# @app.get("/users/me/", response_model=schemas.User) # schemas.Userをインポートする必要あり
# async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
#     return current_user