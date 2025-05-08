# from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
# from sqlalchemy.orm import relationship
# from database import Base

# class WordBook(Base):
#     __tablename__ = 'wordbooks'

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String(100), nullable=False)
#     description = Column(Text, nullable=True)
#     word_cards = relationship("WordCard", back_populates="wordbook")

# class WordCard(Base):
#     __tablename__ = 'wordcards'

#     id = Column(Integer, primary_key=True, index=True)
#     word = Column(String(100), nullable=False)
#     definition = Column(Text, nullable=False)
#     is_favorite = Column(Boolean, default=False)
#     wordbook_id = Column(Integer, ForeignKey('wordbooks.id'))

#     wordbook = relationship("WordBook", back_populates="word_cards")
#     tags = relationship("Tag", secondary="wordcard_tags", back_populates="wordcards")

# class Tag(Base):
#     __tablename__ = 'tags'

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(50), unique=True, nullable=False)
#     wordcards = relationship("WordCard", secondary="wordcard_tags", back_populates="tags")

# class WordCardTag(Base):
#     __tablename__ = 'wordcard_tags'

#     wordcard_id = Column(Integer, ForeignKey('wordcards.id'), primary_key=True)
#     tag_id = Column(Integer, ForeignKey('tags.id'), primary_key=True)

from database import db

class WordBook(db.Model):
    __tablename__ = 'wordbooks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)

class WordCard(db.Model):
    __tablename__ = 'wordcards'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    favorite = db.Column(db.Boolean, default=False)
    wordbook_id = db.Column(db.Integer, db.ForeignKey('wordbooks.id'), nullable=False)