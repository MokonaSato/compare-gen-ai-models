# backend/api/__init__.py

from flask import Blueprint

api = Blueprint('api', __name__)

from .controllers import auth, flashcards, vocabulary_lists