from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from api.models.flashcard import FlashCard
from api.utils.db import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@db/vocabulary_manager'
db.init_app(app)

@app.route('/flashcards', methods=['GET'])
def get_flashcards():
    flashcards = FlashCard.query.all()
    return jsonify([flashcard.to_dict() for flashcard in flashcards])

@app.route('/flashcards', methods=['POST'])
def create_flashcard():
    data = request.json
    new_flashcard = FlashCard(content=data['content'], tags=data['tags'])
    db.session.add(new_flashcard)
    db.session.commit()
    return jsonify(new_flashcard.to_dict()), 201

@app.route('/flashcards/<int:id>', methods=['DELETE'])
def delete_flashcard(id):
    flashcard = FlashCard.query.get_or_404(id)
    db.session.delete(flashcard)
    db.session.commit()
    return jsonify({'message': 'Flashcard deleted'}), 204

if __name__ == '__main__':
    app.run(debug=True)