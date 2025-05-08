from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import pytest

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@db/vocabulary_manager'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

def test_signup(client):
    response = client.post('/signup', json={'username': 'testuser', 'password': 'testpass'})
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully'

def test_login(client):
    client.post('/signup', json={'username': 'testuser', 'password': 'testpass'})
    response = client.post('/login', json={'username': 'testuser', 'password': 'testpass'})
    assert response.status_code == 200
    assert response.json['message'] == 'Login successful'

def test_login_invalid(client):
    response = client.post('/login', json={'username': 'invaliduser', 'password': 'wrongpass'})
    assert response.status_code == 401
    assert response.json['message'] == 'Invalid credentials'

if __name__ == '__main__':
    app.run(debug=True)