from flask import Flask
from flask_cors import CORS
from routes import main as routes
from config import Config
from database import db

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# 追記：データベースの初期化
db.init_app(app)

app.register_blueprint(routes)

if __name__ == '__main__':
    # 追記：データベースの初期化
    with app.app_context():
        db.create_all()  # テーブルを作成
    app.run(host='0.0.0.0', port=5000)