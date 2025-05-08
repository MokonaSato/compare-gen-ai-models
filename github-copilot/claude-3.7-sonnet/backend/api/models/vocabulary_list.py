from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
# from .db import Base
from ..utils.db import Base

class VocabularyList(Base):
    __tablename__ = 'vocabulary_lists'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="vocabulary_lists")
    flashcards = relationship("FlashCard", back_populates="vocabulary_list")