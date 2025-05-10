from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import BaseModel

from . import crud, models, schemas # modelsとschemasをインポート
from .database import SessionLocal, get_db # get_dbをインポート
from .config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # "token"は認証エンドポイントのパス

class User(BaseModel): # 認証用のシンプルなUserモデル (デモ用)
    username: str
    disabled: bool = False

# ダミーユーザーデータベース (デモ用)
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedpassword", # 本番ではbcryptなどでハッシュ化
        "disabled": False,
    }
}

def get_user_from_db(username: str): # ダミー関数
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return User(**user_dict)
    return None

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    # user = crud.get_user(db, username=token_data.username) # 実際のユーザー取得処理
    user = get_user_from_db(token_data.username) # ダミーユーザー取得
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# データベースセッションを取得するための依存性
# database.py に get_db があるので、ここでは不要。
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()