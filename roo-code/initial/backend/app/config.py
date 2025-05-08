import os
from dotenv import load_dotenv

load_dotenv() # .envファイルから環境変数を読み込む (開発用)

# データベース設定
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME", "wordbook_db")
DATABASE_URL = f"mysql+mysqlclient://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# JWT設定
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key") # 本番環境では必ず変更してください
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30