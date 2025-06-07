from flask import Blueprint, request, jsonify
import uuid
import jwt
from database import get_session

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = "your-secret-key"

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user_id = str(uuid.uuid4())
    nombre = data['nombre']
    email = data['email']
    password = data['password']
    comidas = data.get('comidas', [])
    ingredientesEvitados = data.get('ingredientesEvitados', [])

    with get_session() as session:
        session.run("""
            CREATE (u:Usuario {id: $id, nombre: $nombre, email: $email, password: $password})
        """, id=user_id, nombre=nombre, email=email, password=password)

        for comida in comidas:
            session.run("""
                MATCH (u:Usuario {id: $id}), (c:Comida {nombre: $comida})
                MERGE (u)-[:LE_GUSTA]->(c)
            """, id=user_id, comida=comida)

        for ingrediente in ingredientesEvitados:
            session.run("""
                MATCH (u:Usuario {id: $id}), (i:Ingrediente {nombre: $ingrediente})
                MERGE (u)-[:EVITA]->(i)
            """, id=user_id, ingrediente=ingrediente)

    return jsonify({"message": "Usuario registrado con éxito"}), 200

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    with get_session() as session:
        result = session.run("""
            MATCH (u:Usuario {email: $email, password: $password})
            RETURN u.id as id, u.nombre as nombre
        """, email=email, password=password)
        user = result.single()
        if user:
            token = jwt.encode({"user_id": user["id"]}, SECRET_KEY, algorithm="HS256")
            return jsonify({"token": token, "user": {"id": user["id"], "nombre": user["nombre"]}})
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401