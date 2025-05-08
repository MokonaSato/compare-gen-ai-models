# backend/app/__init__.py

from fastapi import FastAPI

app = FastAPI()

from .routers import *

# ここに必要な初期化処理を追加できます。