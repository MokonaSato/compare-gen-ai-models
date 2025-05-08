from flask import Blueprint, request, jsonify
from ..services.auth import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    user = register_user(username, password)
    if user:
        return jsonify({'message': 'User created successfully'}), 201
    return jsonify({'error': 'User creation failed'}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    token = login_user(username, password)
    if token:
        return jsonify({'token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401