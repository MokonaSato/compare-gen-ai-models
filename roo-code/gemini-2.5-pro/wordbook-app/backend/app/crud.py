from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

# --- Tag CRUD ---
def get_tag(db: Session, tag_id: int) -> Optional[models.Tag]:
    return db.query(models.Tag).filter(models.Tag.id == tag_id).first()

def get_tag_by_name(db: Session, name: str) -> Optional[models.Tag]:
    return db.query(models.Tag).filter(models.Tag.name == name).first()

def get_tags(db: Session, skip: int = 0, limit: int = 100) -> List[models.Tag]:
    return db.query(models.Tag).offset(skip).limit(limit).all()

def create_tag(db: Session, tag: schemas.TagCreate) -> models.Tag:
    db_tag = models.Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: int) -> Optional[models.Tag]:
    db_tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if db_tag:
        db.delete(db_tag)
        db.commit()
    return db_tag

# --- Wordbook CRUD ---
def get_wordbook(db: Session, wordbook_id: int) -> Optional[models.Wordbook]:
    return db.query(models.Wordbook).filter(models.Wordbook.id == wordbook_id).first()

def get_wordbooks(db: Session, skip: int = 0, limit: int = 100) -> List[models.Wordbook]:
    return db.query(models.Wordbook).offset(skip).limit(limit).all()

def create_wordbook(db: Session, wordbook: schemas.WordbookCreate) -> models.Wordbook:
    db_wordbook = models.Wordbook(name=wordbook.name)
    db.add(db_wordbook)
    db.commit()
    db.refresh(db_wordbook)
    return db_wordbook

def update_wordbook(db: Session, wordbook_id: int, wordbook_update: schemas.WordbookUpdate) -> Optional[models.Wordbook]:
    db_wordbook = get_wordbook(db, wordbook_id)
    if db_wordbook:
        update_data = wordbook_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_wordbook, key, value)
        db.commit()
        db.refresh(db_wordbook)
    return db_wordbook

def delete_wordbook(db: Session, wordbook_id: int) -> Optional[models.Wordbook]:
    db_wordbook = get_wordbook(db, wordbook_id)
    if db_wordbook:
        db.delete(db_wordbook)
        db.commit()
    return db_wordbook

# --- WordCard CRUD ---
def get_word_card(db: Session, word_card_id: int) -> Optional[models.WordCard]:
    return db.query(models.WordCard).filter(models.WordCard.id == word_card_id).first()

def get_word_cards_by_wordbook(
    db: Session,
    wordbook_id: int,
    skip: int = 0,
    limit: int = 100,
    is_favorite: Optional[bool] = None,
    sort_by: Optional[str] = None, # 例: "created_at_asc", "term_desc"
    tags: Optional[List[int]] = None # タグIDのリストでフィルタリング
) -> List[models.WordCard]:
    query = db.query(models.WordCard).filter(models.WordCard.wordbook_id == wordbook_id)

    if is_favorite is not None:
        query = query.filter(models.WordCard.is_favorite == is_favorite)

    if tags:
        for tag_id in tags:
            query = query.join(models.word_card_tags).join(models.Tag).filter(models.Tag.id == tag_id)
        # To avoid duplicate results when joining multiple tags, use distinct
        query = query.distinct(models.WordCard.id)


    if sort_by:
        if sort_by == "created_at_asc":
            query = query.order_by(models.WordCard.created_at.asc())
        elif sort_by == "created_at_desc":
            query = query.order_by(models.WordCard.created_at.desc())
        elif sort_by == "term_asc":
            query = query.order_by(models.WordCard.term.asc())
        elif sort_by == "term_desc":
            query = query.order_by(models.WordCard.term.desc())
        # 他のソート基準も追加可能

    return query.offset(skip).limit(limit).all()

def create_word_card(db: Session, word_card: schemas.WordCardCreate) -> models.WordCard:
    db_word_card = models.WordCard(
        term=word_card.term,
        definition=word_card.definition,
        is_favorite=word_card.is_favorite,
        wordbook_id=word_card.wordbook_id
    )
    if word_card.tags:
        tags_in_db = db.query(models.Tag).filter(models.Tag.id.in_(word_card.tags)).all()
        db_word_card.tags.extend(tags_in_db)

    db.add(db_word_card)
    db.commit()
    db.refresh(db_word_card)
    return db_word_card

def update_word_card(db: Session, word_card_id: int, word_card_update: schemas.WordCardUpdate) -> Optional[models.WordCard]:
    db_word_card = get_word_card(db, word_card_id)
    if db_word_card:
        update_data = word_card_update.dict(exclude_unset=True)

        if "tags" in update_data:
            tag_ids = update_data.pop("tags")
            if tag_ids is not None: # Noneの場合はタグを更新しない
                tags_in_db = db.query(models.Tag).filter(models.Tag.id.in_(tag_ids)).all()
                db_word_card.tags = tags_in_db # 既存のタグを置き換える

        for key, value in update_data.items():
            setattr(db_word_card, key, value)

        db.commit()
        db.refresh(db_word_card)
    return db_word_card

def delete_word_card(db: Session, word_card_id: int) -> Optional[models.WordCard]:
    db_word_card = get_word_card(db, word_card_id)
    if db_word_card:
        db.delete(db_word_card)
        db.commit()
    return db_word_card

# 認証関連のCRUD (今回は省略。必要に応じて追加)
# def get_user(db: Session, username: str):
#     return db.query(models.User).filter(models.User.username == username).first()

# def create_user(db: Session, user: schemas.UserCreate):
#     hashed_password = pwd_context.hash(user.password) # pwd_contextは別途定義
#     db_user = models.User(username=user.username, hashed_password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user