from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from . import models, schemas
from typing import List, Optional

# 単語帳関連のCRUD操作
def get_flashcards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Flashcard).offset(skip).limit(limit).all()

def get_flashcards_with_count(db: Session, skip: int = 0, limit: int = 100):
    # 各単語帳に含まれるカードの数をカウントするクエリ
    query = db.query(
        models.Flashcard,
        func.count(models.Card.id).label("card_count")
    ).outerjoin(
        models.Card
    ).group_by(
        models.Flashcard.id
    ).offset(skip).limit(limit)
    
    result = []
    for flashcard, card_count in query:
        # 単語帳オブジェクトにカード数を追加
        flashcard_dict = {
            "id": flashcard.id,
            "title": flashcard.title,
            "description": flashcard.description,
            "created_at": flashcard.created_at,
            "updated_at": flashcard.updated_at,
            "card_count": card_count
        }
        result.append(flashcard_dict)
    
    return result

def get_flashcard(db: Session, flashcard_id: int):
    return db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()

def create_flashcard(db: Session, flashcard: schemas.FlashcardCreate):
    db_flashcard = models.Flashcard(title=flashcard.title, description=flashcard.description)
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

def update_flashcard(db: Session, flashcard_id: int, flashcard: schemas.FlashcardUpdate):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    if db_flashcard:
        update_data = flashcard.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_flashcard, key, value)
        db.commit()
        db.refresh(db_flashcard)
    return db_flashcard

def delete_flashcard(db: Session, flashcard_id: int):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    if db_flashcard:
        db.delete(db_flashcard)
        db.commit()
        return True
    return False

# カード関連のCRUD操作
def get_cards(db: Session, flashcard_id: int, skip: int = 0, limit: int = 100, favorites_only: Optional[bool] = None):
    query = db.query(models.Card).filter(models.Card.flashcard_id == flashcard_id)
    
    # お気に入りフィルタリング
    if favorites_only is not None:
        query = query.filter(models.Card.is_favorite == favorites_only)
    
    return query.offset(skip).limit(limit).all()

def get_card(db: Session, card_id: int):
    return db.query(models.Card).options(joinedload(models.Card.tags)).filter(models.Card.id == card_id).first()

def create_card(db: Session, card: schemas.CardCreate, flashcard_id: int):
    # カードの作成
    db_card = models.Card(
        flashcard_id=flashcard_id,
        front=card.front,
        back=card.back,
        is_favorite=card.is_favorite
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    
    # タグの関連付け
    if card.tag_ids:
        for tag_id in card.tag_ids:
            tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
            if tag:
                db_card.tags.append(tag)
        db.commit()
        db.refresh(db_card)
    
    return db_card

def update_card(db: Session, card_id: int, card: schemas.CardUpdate):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card:
        # カードの基本情報を更新
        update_data = card.dict(exclude={"tag_ids"}, exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_card, key, value)
        
        # タグの更新
        if card.tag_ids is not None:
            # 既存のタグをクリア
            db_card.tags = []
            # 新しいタグを追加
            for tag_id in card.tag_ids:
                tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
                if tag:
                    db_card.tags.append(tag)
        
        db.commit()
        db.refresh(db_card)
    return db_card

def delete_card(db: Session, card_id: int):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card:
        db.delete(db_card)
        db.commit()
        return True
    return False

def toggle_favorite(db: Session, card_id: int):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card:
        db_card.is_favorite = not db_card.is_favorite
        db.commit()
        db.refresh(db_card)
        return db_card
    return None

# タグ関連のCRUD操作
def get_tags(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tag).offset(skip).limit(limit).all()

def get_tag(db: Session, tag_id: int):
    return db.query(models.Tag).filter(models.Tag.id == tag_id).first()

def get_tag_by_name(db: Session, name: str):
    return db.query(models.Tag).filter(models.Tag.name == name).first()

def create_tag(db: Session, tag: schemas.TagCreate):
    db_tag = models.Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: int):
    db_tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if db_tag:
        db.delete(db_tag)
        db.commit()
        return True
    return False