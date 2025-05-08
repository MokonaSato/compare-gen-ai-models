from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from api.models.vocabulary_list import VocabularyList

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@db/vocabulary_manager'
db = SQLAlchemy(app)

@app.route('/vocabulary_lists', methods=['GET'])
def get_vocabulary_lists():
    lists = VocabularyList.query.all()
    return jsonify([vocabulary_list.to_dict() for vocabulary_list in lists])

@app.route('/vocabulary_lists', methods=['POST'])
def create_vocabulary_list():
    data = request.json
    new_list = VocabularyList(title=data['title'])
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.to_dict()), 201

@app.route('/vocabulary_lists/<int:list_id>', methods=['DELETE'])
def delete_vocabulary_list(list_id):
    vocabulary_list = VocabularyList.query.get_or_404(list_id)
    db.session.delete(vocabulary_list)
    db.session.commit()
    return jsonify({'message': 'Vocabulary list deleted'}), 204

if __name__ == '__main__':
    app.run(debug=True)