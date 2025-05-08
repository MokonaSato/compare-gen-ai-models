from flask import Blueprint, request, jsonify
from ..models.flashcard import FlashCard
from ..utils.db import db_session

flashcards_bp = Blueprint('flashcards', __name__)

@flashcards_bp.route('/flashcards', methods=['GET'])
def get_flashcards():
    with db_session() as session:
        flashcards = session.query(FlashCard).all()
        return jsonify([flashcard.to_dict() for flashcard in flashcards])

@flashcards_bp.route('/flashcards', methods=['POST'])
def create_flashcard():
    data = request.json
    new_flashcard = FlashCard(content=data['content'], tags=data.get('tags', []))
    with db_session() as session:
        session.add(new_flashcard)
        session.commit()
        return jsonify(new_flashcard.to_dict()), 201

@flashcards_bp.route('/flashcards/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    with db_session() as session:
        flashcard = session.query(FlashCard).get(flashcard_id)
        if flashcard:
            session.delete(flashcard)
            session.commit()
            return jsonify({'message': 'Flashcard deleted successfully'}), 200
        return jsonify({'message': 'Flashcard not found'}), 404

@flashcards_bp.route('/flashcards/<int:flashcard_id>', methods=['PUT'])
def update_flashcard(flashcard_id):
    data = request.json
    with db_session() as session:
        flashcard = session.query(FlashCard).get(flashcard_id)
        if flashcard:
            flashcard.content = data.get('content', flashcard.content)
            flashcard.tags = data.get('tags', flashcard.tags)
            session.commit()
            return jsonify(flashcard.to_dict()), 200
        return jsonify({'message': 'Flashcard not found'}), 404