from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import schemas, crud, models # crud, models をインポート
from ..dependencies import get_db, User, get_user_from_db # User, get_user_from_db をインポート
from ..config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from jose import jwt
from passlib.context import CryptContext # パスワードハッシュ化用

router = APIRouter(tags=["authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ダミーのパスワード検証関数 (本番では実際のハッシュ化されたパスワードと比較)
def verify_password(plain_password, hashed_password):
    # return pwd_context.verify(plain_password, hashed_password)
    return plain_password == "testpassword" # デモ用

# アクセストークンを作成するヘルパー関数
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15) # デフォルト15分
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # user = crud.get_user(db, username=form_data.username) # 実際のユーザー取得
    user = get_user_from_db(form_data.username) # ダミーユーザー取得
    if not user or not verify_password(form_data.password, "fakehashedpassword"): # "fakehashedpassword" はダミー
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# 必要に応じてユーザー登録エンドポイントなどもここに追加
# @router.post("/users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, username=user.username)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
#     return crud.create_user(db=db, user=user)