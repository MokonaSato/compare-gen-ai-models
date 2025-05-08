from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# タグのスキーマ
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# カードのスキーマ
class CardBase(BaseModel):
    front: str
    back: str
    is_favorite: bool = False

class CardCreate(CardBase):
    tag_ids: Optional[List[int]] = []

class CardUpdate(BaseModel):
    front: Optional[str] = None
    back: Optional[str] = None
    is_favorite: Optional[bool] = None
    tag_ids: Optional[List[int]] = None

class Card(CardBase):
    id: int
    flashcard_id: int
    created_at: datetime
    updated_at: datetime
    tags: List[Tag] = []

    class Config:
        orm_mode = True

# 単語帳のスキーマ
class FlashcardBase(BaseModel):
    title: str
    description: Optional[str] = None

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class Flashcard(FlashcardBase):
    id: int
    created_at: datetime
    updated_at: datetime
    cards: List[Card] = []

    class Config:
        orm_mode = True

# 単語帳の一覧表示用スキーマ（カード情報なし）
class FlashcardList(FlashcardBase):
    id: int
    created_at: datetime
    updated_at: datetime
    card_count: int = 0

    class Config:
        orm_mode = True