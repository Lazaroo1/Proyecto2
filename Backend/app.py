from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.recommendations import rec_bp
from models.comida import cargar_comidas

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(rec_bp)

if __name__ == "__main__":
    cargar_comidas()
    app.run(debug=True)