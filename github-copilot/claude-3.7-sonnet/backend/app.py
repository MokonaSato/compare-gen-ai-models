from flask import Flask
from flask_cors import CORS
from api import api as api_blueprint

app = Flask(__name__)
CORS(app)

app.config.from_object('config.Config')

app.register_blueprint(api_blueprint, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)