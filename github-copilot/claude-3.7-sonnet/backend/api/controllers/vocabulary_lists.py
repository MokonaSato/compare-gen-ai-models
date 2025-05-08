from flask import Blueprint, request, jsonify
from ..models.vocabulary_list import VocabularyList
from ..services.vocabulary import VocabularyService

vocabulary_lists_bp = Blueprint('vocabulary_lists', __name__)

@vocabulary_lists_bp.route('/vocabulary_lists', methods=['GET'])
def get_vocabulary_lists():
    lists = VocabularyService.get_all_vocabulary_lists()
    return jsonify(lists), 200

@vocabulary_lists_bp.route('/vocabulary_lists', methods=['POST'])
def create_vocabulary_list():
    data = request.json
    new_list = VocabularyService.create_vocabulary_list(data)
    return jsonify(new_list), 201

@vocabulary_lists_bp.route('/vocabulary_lists/<int:list_id>', methods=['PUT'])
def update_vocabulary_list(list_id):
    data = request.json
    updated_list = VocabularyService.update_vocabulary_list(list_id, data)
    return jsonify(updated_list), 200

@vocabulary_lists_bp.route('/vocabulary_lists/<int:list_id>', methods=['DELETE'])
def delete_vocabulary_list(list_id):
    VocabularyService.delete_vocabulary_list(list_id)
    return jsonify({'message': 'Vocabulary list deleted'}), 204