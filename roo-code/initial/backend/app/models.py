from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Table, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# 中間テーブル: word_card_tags
word_card_tags = Table(
    'word_card_tags', Base.metadata,
    Column('word_card_id', Integer, ForeignKey('word_cards.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class Wordbook(Base):
    __tablename__ = "wordbooks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    word_cards = relationship("WordCard", back_populates="wordbook", cascade="all, delete-orphan")

class WordCard(Base):
    __tablename__ = "word_cards"

    id = Column(Integer, primary_key=True, index=True)
    wordbook_id = Column(Integer, ForeignKey("wordbooks.id"), nullable=False)
    term = Column(Text, nullable=False)
    definition = Column(Text, nullable=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wordbook = relationship("Wordbook", back_populates="word_cards")
    tags = relationship("Tag", secondary=word_card_tags, back_populates="word_cards")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    word_cards = relationship("WordCard", secondary=word_card_tags, back_populates="tags")

# Userモデル (認証用、今回は省略。必要に応じて追加)
# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String(50), unique=True, index=True, nullable=False)
#     hashed_password = Column(String(255), nullable=False)
#     is_active = Column(Boolean, default=True)