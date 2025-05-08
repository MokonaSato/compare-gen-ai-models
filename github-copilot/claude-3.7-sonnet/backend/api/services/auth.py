from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..models.user import User
from ..utils.db import db_session

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)

    db_session.add(new_user)
    db_session.commit()

    return jsonify({'message': 'User created successfully.'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = db_session.query(User).filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        return jsonify({'message': 'Login successful.'}), 200

    return jsonify({'message': 'Invalid username or password.'}), 401

# 追記
from api.utils.db import db_session
from api.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(username: str, password: str):
    hashed_password = generate_password_hash(password)
    user = User(username=username, password=hashed_password)
    db_session.add(user)
    db_session.commit()
    return user

def login_user(username: str, password: str):
    user = db_session.query(User).filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        # トークン生成ロジックを追加する（例: JWT）
        return "dummy_token"  # 仮のトークン
    return None