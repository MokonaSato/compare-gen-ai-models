from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas, models # modelsを追加
from ..dependencies import get_db, get_current_active_user # 認証用

router = APIRouter(
    prefix="/wordbooks",
    tags=["wordbooks"],
    # dependencies=[Depends(get_current_active_user)], # 必要に応じて認証を有効化
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Wordbook, status_code=status.HTTP_201_CREATED)
def create_wordbook(wordbook: schemas.WordbookCreate, db: Session = Depends(get_db)):
    return crud.create_wordbook(db=db, wordbook=wordbook)

@router.get("/", response_model=List[schemas.Wordbook])
def read_wordbooks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    wordbooks = crud.get_wordbooks(db, skip=skip, limit=limit)
    return wordbooks

@router.get("/{wordbook_id}", response_model=schemas.WordbookDetail) # WordbookDetailを使用
def read_wordbook(wordbook_id: int, db: Session = Depends(get_db)):
    db_wordbook = crud.get_wordbook(db, wordbook_id=wordbook_id)
    if db_wordbook is None:
        raise HTTPException(status_code=404, detail="Wordbook not found")
    return db_wordbook

@router.put("/{wordbook_id}", response_model=schemas.Wordbook)
def update_wordbook(wordbook_id: int, wordbook: schemas.WordbookUpdate, db: Session = Depends(get_db)):
    db_wordbook = crud.update_wordbook(db, wordbook_id=wordbook_id, wordbook_update=wordbook)
    if db_wordbook is None:
        raise HTTPException(status_code=404, detail="Wordbook not found")
    return db_wordbook

@router.delete("/{wordbook_id}", response_model=schemas.Wordbook)
def delete_wordbook(wordbook_id: int, db: Session = Depends(get_db)):
    db_wordbook = crud.delete_wordbook(db, wordbook_id=wordbook_id)
    if db_wordbook is None:
        raise HTTPException(status_code=404, detail="Wordbook not found")
    return db_wordbook