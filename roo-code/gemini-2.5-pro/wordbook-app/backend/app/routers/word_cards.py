from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas, models # modelsを追加
from ..dependencies import get_db, get_current_active_user # 認証用

router = APIRouter(
    prefix="/wordbooks/{wordbook_id}/cards", # wordbook_id をパスパラメータとして受け取る
    tags=["word_cards"],
    # dependencies=[Depends(get_current_active_user)], # 必要に応じて認証を有効化
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.WordCard, status_code=status.HTTP_201_CREATED)
def create_word_card_for_wordbook(
    wordbook_id: int, word_card: schemas.WordCardCreate, db: Session = Depends(get_db)
):
    # word_card.wordbook_id がパスパラメータの wordbook_id と一致するか確認 (任意)
    if word_card.wordbook_id != wordbook_id:
        raise HTTPException(status_code=400, detail="Wordbook ID in path and body do not match")
    db_wordbook = crud.get_wordbook(db, wordbook_id=wordbook_id)
    if not db_wordbook:
        raise HTTPException(status_code=404, detail="Wordbook not found")
    return crud.create_word_card(db=db, word_card=word_card)

@router.get("/", response_model=List[schemas.WordCard])
def read_word_cards_for_wordbook(
    wordbook_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: Optional[bool] = Query(None),
    sort_by: Optional[str] = Query(None, description="Sort by field: 'created_at_asc', 'created_at_desc', 'term_asc', 'term_desc'"),
    tags: Optional[List[int]] = Query(None, description="Filter by tag IDs")
):
    db_wordbook = crud.get_wordbook(db, wordbook_id=wordbook_id)
    if not db_wordbook:
        raise HTTPException(status_code=404, detail="Wordbook not found")
    word_cards = crud.get_word_cards_by_wordbook(
        db, wordbook_id=wordbook_id, skip=skip, limit=limit, is_favorite=is_favorite, sort_by=sort_by, tags=tags
    )
    return word_cards

@router.get("/{word_card_id}", response_model=schemas.WordCard)
def read_word_card(wordbook_id: int, word_card_id: int, db: Session = Depends(get_db)):
    # wordbook_idの存在確認は任意 (word_card_idだけで十分な場合もある)
    db_word_card = crud.get_word_card(db, word_card_id=word_card_id)
    if db_word_card is None or db_word_card.wordbook_id != wordbook_id:
        raise HTTPException(status_code=404, detail="Word card not found in this wordbook")
    return db_word_card

@router.put("/{word_card_id}", response_model=schemas.WordCard)
def update_word_card(
    wordbook_id: int, word_card_id: int, word_card: schemas.WordCardUpdate, db: Session = Depends(get_db)
):
    db_word_card_check = crud.get_word_card(db, word_card_id=word_card_id)
    if db_word_card_check is None or db_word_card_check.wordbook_id != wordbook_id:
        raise HTTPException(status_code=404, detail="Word card not found in this wordbook")

    updated_card = crud.update_word_card(db, word_card_id=word_card_id, word_card_update=word_card)
    if updated_card is None: # update_word_card内で再度チェックされるが念のため
        raise HTTPException(status_code=404, detail="Word card not found")
    return updated_card

@router.delete("/{word_card_id}", response_model=schemas.WordCard)
def delete_word_card(wordbook_id: int, word_card_id: int, db: Session = Depends(get_db)):
    db_word_card_check = crud.get_word_card(db, word_card_id=word_card_id)
    if db_word_card_check is None or db_word_card_check.wordbook_id != wordbook_id:
        raise HTTPException(status_code=404, detail="Word card not found in this wordbook")

    deleted_card = crud.delete_word_card(db, word_card_id=word_card_id)
    if deleted_card is None: # delete_word_card内で再度チェックされるが念のため
        raise HTTPException(status_code=404, detail="Word card not found")
    return deleted_card