from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Tag Schemas
class TagBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# WordCard Schemas
class WordCardBase(BaseModel):
    term: str = Field(..., min_length=1)
    definition: str = Field(..., min_length=1)
    is_favorite: Optional[bool] = False

class WordCardCreate(WordCardBase):
    wordbook_id: int
    tags: Optional[List[int]] = [] # Tag IDのリスト

class WordCardUpdate(WordCardBase):
    term: Optional[str] = None
    definition: Optional[str] = None
    is_favorite: Optional[bool] = None
    tags: Optional[List[int]] = None # Tag IDのリスト (更新用)

class WordCard(WordCardBase):
    id: int
    wordbook_id: int
    created_at: datetime
    updated_at: datetime
    tags: List[Tag] = []

    class Config:
        orm_mode = True

# Wordbook Schemas
class WordbookBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class WordbookCreate(WordbookBase):
    pass

class WordbookUpdate(WordbookBase):
    name: Optional[str] = None

class Wordbook(WordbookBase):
    id: int
    created_at: datetime
    updated_at: datetime
    word_cards: List[WordCard] = [] # 詳細表示用

    class Config:
        orm_mode = True

class WordbookDetail(Wordbook): # 単語帳詳細画面で単語カードを含める
    pass


# Token Schemas (認証用)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User Schemas (認証用、今回は省略。必要に応じて追加)
# class UserBase(BaseModel):
#     username: str

# class UserCreate(UserBase):
#     password: str

# class User(UserBase):
#     id: int
#     is_active: bool

#     class Config:
#         orm_mode = True