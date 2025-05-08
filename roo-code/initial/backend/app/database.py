from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from .config import DATABASE_URL

# SQLAlchemyの設定
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Databasesライブラリの設定 (非同期用)
database = Database(DATABASE_URL)

# 依存性注入用の関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_database():
    await database.connect()
    try:
        yield database
    finally:
        await database.disconnect()