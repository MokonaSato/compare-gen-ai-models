from flask import Blueprint, request, jsonify
from models import WordBook, WordCard, db

routes = Blueprint('routes', __name__)

@routes.route('/wordbooks', methods=['GET'])
def get_wordbooks():
    wordbooks = WordBook.query.all()
    return jsonify([wordbook.to_dict() for wordbook in wordbooks])

@routes.route('/wordbooks', methods=['POST'])
def create_wordbook():
    data = request.json
    new_wordbook = WordBook(name=data['name'])
    db.session.add(new_wordbook)
    db.session.commit()
    return jsonify(new_wordbook.to_dict()), 201

@routes.route('/wordbooks/<int:wordbook_id>', methods=['PUT'])
def update_wordbook(wordbook_id):
    data = request.json
    wordbook = WordBook.query.get_or_404(wordbook_id)
    wordbook.name = data['name']
    db.session.commit()
    return jsonify(wordbook.to_dict())

@routes.route('/wordbooks/<int:wordbook_id>', methods=['DELETE'])
def delete_wordbook(wordbook_id):
    wordbook = WordBook.query.get_or_404(wordbook_id)
    db.session.delete(wordbook)
    db.session.commit()
    return '', 204

@routes.route('/wordcards', methods=['GET'])
def get_wordcards():
    wordcards = WordCard.query.all()
    return jsonify([wordcard.to_dict() for wordcard in wordcards])

@routes.route('/wordcards', methods=['POST'])
def create_wordcard():
    data = request.json
    new_wordcard = WordCard(
        word=data['word'],
        definition=data['definition'],
        favorite=data.get('favorite', False),
        tags=data.get('tags', [])
    )
    db.session.add(new_wordcard)
    db.session.commit()
    return jsonify(new_wordcard.to_dict()), 201

@routes.route('/wordcards/<int:wordcard_id>', methods=['PUT'])
def update_wordcard(wordcard_id):
    data = request.json
    wordcard = WordCard.query.get_or_404(wordcard_id)
    wordcard.word = data['word']
    wordcard.definition = data['definition']
    wordcard.favorite = data.get('favorite', wordcard.favorite)
    wordcard.tags = data.get('tags', wordcard.tags)
    db.session.commit()
    return jsonify(wordcard.to_dict())

@routes.route('/wordcards/<int:wordcard_id>', methods=['DELETE'])
def delete_wordcard(wordcard_id):
    wordcard = WordCard.query.get_or_404(wordcard_id)
    db.session.delete(wordcard)
    db.session.commit()
    return '', 204