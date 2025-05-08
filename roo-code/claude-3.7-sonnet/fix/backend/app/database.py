from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# 環境変数からデータベースURLを取得、なければデフォルト値を使用
DATABASE_URL = os.getenv("DATABASE_URL", "mysql://root:password@db:3306/flashcard_db?charset=utf8mb4")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 依存性注入のためのヘルパー関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()