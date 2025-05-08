from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
import os
from datetime import datetime
import json

# DB接続設定
DB_USER = os.getenv("DB_USER", "wordbook_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "wordbook_pass")
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "wordbook")
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# カスタムJSONエンコーダー（datetime型を文字列に変換）
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# モデル定義
class Notebook(Base):
    __tablename__ = "notebooks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    subject = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())

class NotebookCreate(BaseModel):
    name: str
    subject: Optional[str] = None

class NotebookRead(BaseModel):
    id: int
    name: str
    subject: Optional[str]
    created_at: Optional[str]

    model_config = ConfigDict(from_attributes=True)

app = FastAPI()

# CORS設定（フロントエンドからのアクセス許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    notebook_id = Column(Integer, ForeignKey("notebooks.id"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    notebook = relationship("Notebook", backref="cards")

class CardCreate(BaseModel):
    notebook_id: int
    front: str
    back: str
    is_favorite: Optional[bool] = False

class CardUpdate(BaseModel):
    front: Optional[str] = None
    back: Optional[str] = None
    is_favorite: Optional[bool] = None

class CardRead(BaseModel):
    id: int
    notebook_id: int
    front: str
    back: str
    is_favorite: bool
    created_at: Optional[str]
    updated_at: Optional[str]

    model_config = ConfigDict(from_attributes=True)

# API: 単語カード一覧（フィルタ・ソート対応）
@app.get("/notebooks/{notebook_id}/cards", response_model=List[CardRead])
def list_cards(
    notebook_id: int,
    favorite: Optional[bool] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc"
):
    db: Session = SessionLocal()
    query = db.query(Card).filter(Card.notebook_id == notebook_id)
    if favorite is not None:
        query = query.filter(Card.is_favorite == favorite)
    if sort_by in ["created_at", "updated_at", "front", "back"]:
        col = getattr(Card, sort_by)
        if order == "asc":
            query = query.order_by(col.asc())
        else:
            query = query.order_by(col.desc())
    cards = query.all()
    db.close()
    
    # datetimeオブジェクトを明示的に変換
    converted_cards = []
    for card in cards:
        card_dict = {
            "id": card.id,
            "notebook_id": card.notebook_id,
            "front": card.front,
            "back": card.back,
            "is_favorite": card.is_favorite,
            "created_at": card.created_at.isoformat() if card.created_at else None,
            "updated_at": card.updated_at.isoformat() if card.updated_at else None
        }
        converted_cards.append(card_dict)
    
    return converted_cards

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

class CardTag(Base):
    __tablename__ = "card_tags"
    card_id = Column(Integer, ForeignKey("cards.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)

class TagCreate(BaseModel):
    name: str

class TagRead(BaseModel):
    id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)

# タグ一覧
@app.get("/tags", response_model=List[TagRead])
def list_tags():
    db: Session = SessionLocal()
    tags = db.query(Tag).all()
    db.close()
    return tags

# タグ作成
@app.post("/tags", response_model=TagRead)
def create_tag(tag: TagCreate):
    db: Session = SessionLocal()
    db_tag = Tag(name=tag.name)
    db.add(db_tag)
    try:
        db.commit()
        db.refresh(db_tag)
    except Exception:
        db.rollback()
        db.close()
        raise HTTPException(status_code=400, detail="Tag already exists or invalid")
    db.close()
    return db_tag

# カードにタグ付与
@app.post("/cards/{card_id}/tags/{tag_id}")
def add_tag_to_card(card_id: int, tag_id: int):
    db: Session = SessionLocal()
    # 存在確認
    card = db.query(Card).filter(Card.id == card_id).first()
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not card or not tag:
        db.close()
        raise HTTPException(status_code=404, detail="Card or Tag not found")
    # 既存チェック
    exists = db.query(CardTag).filter(CardTag.card_id == card_id, CardTag.tag_id == tag_id).first()
    if exists:
        db.close()
        return {"result": "already exists"}
    db.add(CardTag(card_id=card_id, tag_id=tag_id))
    db.commit()
    db.close()
    return {"result": "ok"}

# カードからタグ除去
@app.delete("/cards/{card_id}/tags/{tag_id}")
def remove_tag_from_card(card_id: int, tag_id: int):
    db: Session = SessionLocal()
    card_tag = db.query(CardTag).filter(CardTag.card_id == card_id, CardTag.tag_id == tag_id).first()
    if not card_tag:
        db.close()
        raise HTTPException(status_code=404, detail="Tag relation not found")
    db.delete(card_tag)
    db.commit()
    db.close()
    return {"result": "ok"}

# カードのタグ一覧
@app.get("/cards/{card_id}/tags", response_model=List[TagRead])
def get_tags_of_card(card_id: int):
    db: Session = SessionLocal()
    tags = (
        db.query(Tag)
        .join(CardTag, Tag.id == CardTag.tag_id)
        .filter(CardTag.card_id == card_id)
        .all()
    )
    db.close()
    return tags

# API: 単語カード作成
@app.post("/cards", response_model=CardRead)
def create_card(card: CardCreate):
    db: Session = SessionLocal()
    now = datetime.now()
    db_card = Card(
        notebook_id=card.notebook_id,
        front=card.front,
        back=card.back,
        is_favorite=card.is_favorite or False,
        created_at=now,
        updated_at=now
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    db.close()
    
    # datetimeオブジェクトを明示的に変換
    card_dict = {
        "id": db_card.id,
        "notebook_id": db_card.notebook_id,
        "front": db_card.front,
        "back": db_card.back,
        "is_favorite": db_card.is_favorite,
        "created_at": db_card.created_at.isoformat() if db_card.created_at else None,
        "updated_at": db_card.updated_at.isoformat() if db_card.updated_at else None
    }
    
    return card_dict

# API: 単語カード編集
@app.put("/cards/{card_id}", response_model=CardRead)
def update_card(card_id: int, card: CardUpdate):
    db: Session = SessionLocal()
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if not db_card:
        db.close()
        raise HTTPException(status_code=404, detail="Card not found")
    if card.front is not None:
        db_card.front = card.front
    if card.back is not None:
        db_card.back = card.back
    if card.is_favorite is not None:
        db_card.is_favorite = card.is_favorite
    db_card.updated_at = datetime.now()
    db.commit()
    db.refresh(db_card)
    db.close()
    
    # datetimeオブジェクトを明示的に変換
    card_dict = {
        "id": db_card.id,
        "notebook_id": db_card.notebook_id,
        "front": db_card.front,
        "back": db_card.back,
        "is_favorite": db_card.is_favorite,
        "created_at": db_card.created_at.isoformat() if db_card.created_at else None,
        "updated_at": db_card.updated_at.isoformat() if db_card.updated_at else None
    }
    
    return card_dict

# API: 単語カード削除
@app.delete("/cards/{card_id}")
def delete_card(card_id: int):
    db: Session = SessionLocal()
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if not db_card:
        db.close()
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(db_card)
    db.commit()
    db.close()
    return {"result": "ok"}

# API: 単語帳一覧取得
@app.get("/notebooks", response_model=List[NotebookRead])
def list_notebooks():
    db: Session = SessionLocal()
    notebooks = db.query(Notebook).all()
    db.close()
    
    # datetimeオブジェクトを明示的に変換
    converted_notebooks = []
    for notebook in notebooks:
        notebook_dict = {
            "id": notebook.id,
            "name": notebook.name,
            "subject": notebook.subject,
            "created_at": notebook.created_at.isoformat() if notebook.created_at else None
        }
        converted_notebooks.append(notebook_dict)
    
    return converted_notebooks

# API: 単語帳作成
@app.post("/notebooks", response_model=NotebookRead)
def create_notebook(notebook: NotebookCreate):
    db: Session = SessionLocal()
    db_notebook = Notebook(
        name=notebook.name, 
        subject=notebook.subject,
        created_at=datetime.now()
    )
    db.add(db_notebook)
    db.commit()
    db.refresh(db_notebook)
    db.close()
    
    # datetimeオブジェクトを明示的に変換
    notebook_dict = {
        "id": db_notebook.id,
        "name": db_notebook.name,
        "subject": db_notebook.subject,
        "created_at": db_notebook.created_at.isoformat() if db_notebook.created_at else None
    }
    
    return notebook_dict

# API: 単語帳削除
@app.delete("/notebooks/{notebook_id}")
def delete_notebook(notebook_id: int):
    db: Session = SessionLocal()
    notebook = db.query(Notebook).filter(Notebook.id == notebook_id).first()
    if not notebook:
        db.close()
        raise HTTPException(status_code=404, detail="Notebook not found")
    db.delete(notebook)
    db.commit()
    db.close()
    return {"result": "ok"}

# API: 単語帳編集
@app.put("/notebooks/{notebook_id}", response_model=NotebookRead)
def update_notebook(notebook_id: int, notebook: NotebookCreate):
    db: Session = SessionLocal()
    db_notebook = db.query(Notebook).filter(Notebook.id == notebook_id).first()
    if not db_notebook:
        db.close()
        raise HTTPException(status_code=404, detail="Notebook not found")
    db_notebook.name = notebook.name
    db_notebook.subject = notebook.subject
    db.commit()
    db.refresh(db_notebook)
    db.close()
    
    # datetimeオブジェクトを明示的に変換
    notebook_dict = {
        "id": db_notebook.id,
        "name": db_notebook.name,
        "subject": db_notebook.subject,
        "created_at": db_notebook.created_at.isoformat() if db_notebook.created_at else None
    }
    
    return notebook_dict