from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import markdown

from . import crud, models, schemas
from .database import engine, get_db

# データベースのテーブルを作成
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flashcard API", description="単語帳管理アプリのAPI")

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Markdownをレンダリングするヘルパー関数
def render_markdown(text: str) -> str:
    return markdown.markdown(text)

# ルートエンドポイント
@app.get("/")
def read_root():
    return {"message": "Welcome to Flashcard API"}

# 単語帳関連のエンドポイント
@app.get("/flashcards/", response_model=List[schemas.FlashcardList])
def read_flashcards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    flashcards = crud.get_flashcards_with_count(db, skip=skip, limit=limit)
    return flashcards

@app.get("/flashcards/{flashcard_id}", response_model=schemas.Flashcard)
def read_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    db_flashcard = crud.get_flashcard(db, flashcard_id=flashcard_id)
    if db_flashcard is None:
        raise HTTPException(status_code=404, detail="単語帳が見つかりません")
    return db_flashcard

@app.post("/flashcards/", response_model=schemas.Flashcard)
def create_flashcard(flashcard: schemas.FlashcardCreate, db: Session = Depends(get_db)):
    return crud.create_flashcard(db=db, flashcard=flashcard)

@app.put("/flashcards/{flashcard_id}", response_model=schemas.Flashcard)
def update_flashcard(flashcard_id: int, flashcard: schemas.FlashcardUpdate, db: Session = Depends(get_db)):
    db_flashcard = crud.update_flashcard(db, flashcard_id=flashcard_id, flashcard=flashcard)
    if db_flashcard is None:
        raise HTTPException(status_code=404, detail="単語帳が見つかりません")
    return db_flashcard

@app.delete("/flashcards/{flashcard_id}")
def delete_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    success = crud.delete_flashcard(db, flashcard_id=flashcard_id)
    if not success:
        raise HTTPException(status_code=404, detail="単語帳が見つかりません")
    return {"message": "単語帳を削除しました"}

# カード関連のエンドポイント
@app.get("/flashcards/{flashcard_id}/cards/", response_model=List[schemas.Card])
def read_cards(
    flashcard_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    favorites_only: Optional[bool] = Query(None, description="お気に入りのみ表示"),
    db: Session = Depends(get_db)
):
    # 単語帳の存在確認
    db_flashcard = crud.get_flashcard(db, flashcard_id=flashcard_id)
    if db_flashcard is None:
        raise HTTPException(status_code=404, detail="単語帳が見つかりません")
    
    cards = crud.get_cards(
        db, 
        flashcard_id=flashcard_id, 
        skip=skip, 
        limit=limit, 
        favorites_only=favorites_only
    )
    
    # Markdownをレンダリング
    for card in cards:
        card.back = render_markdown(card.back)
    
    return cards

@app.get("/cards/{card_id}", response_model=schemas.Card)
def read_card(card_id: int, db: Session = Depends(get_db)):
    db_card = crud.get_card(db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    
    # Markdownをレンダリング
    db_card.back = render_markdown(db_card.back)
    
    return db_card

@app.post("/flashcards/{flashcard_id}/cards/", response_model=schemas.Card)
def create_card(flashcard_id: int, card: schemas.CardCreate, db: Session = Depends(get_db)):
    # 単語帳の存在確認
    db_flashcard = crud.get_flashcard(db, flashcard_id=flashcard_id)
    if db_flashcard is None:
        raise HTTPException(status_code=404, detail="単語帳が見つかりません")
    
    return crud.create_card(db=db, card=card, flashcard_id=flashcard_id)

@app.put("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardUpdate, db: Session = Depends(get_db)):
    db_card = crud.update_card(db, card_id=card_id, card=card)
    if db_card is None:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    return db_card

@app.delete("/cards/{card_id}")
def delete_card(card_id: int, db: Session = Depends(get_db)):
    success = crud.delete_card(db, card_id=card_id)
    if not success:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    return {"message": "カードを削除しました"}

@app.put("/cards/{card_id}/toggle-favorite", response_model=schemas.Card)
def toggle_card_favorite(card_id: int, db: Session = Depends(get_db)):
    db_card = crud.toggle_favorite(db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    return db_card

# タグ関連のエンドポイント
@app.get("/tags/", response_model=List[schemas.Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tags = crud.get_tags(db, skip=skip, limit=limit)
    return tags

@app.post("/tags/", response_model=schemas.Tag)
def create_tag(tag: schemas.TagCreate, db: Session = Depends(get_db)):
    db_tag = crud.get_tag_by_name(db, name=tag.name)
    if db_tag:
        return db_tag
    return crud.create_tag(db=db, tag=tag)

@app.delete("/tags/{tag_id}")
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    success = crud.delete_tag(db, tag_id=tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="タグが見つかりません")
    return {"message": "タグを削除しました"}