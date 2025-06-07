from flask import Blueprint, request, jsonify
import jwt
from database import get_session

rec_bp = Blueprint("recs", __name__)
SECRET_KEY = "your-secret-key"

@rec_bp.route("/recommendations", methods=["GET"])
def recomendaciones():
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return jsonify({"error": "No autorizado"}), 401

    token = token.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401

    with get_session() as session:
        user_types = session.run("""
            MATCH (u:Usuario {id: $user_id})-[:LE_GUSTA]->(c:Comida)
            RETURN DISTINCT c.tipo AS tipo
        """, user_id=user_id)
        liked_types = [row["tipo"] for row in user_types]

        result = session.run("""
            MATCH (u:Usuario {id: $user_id})-[:LE_GUSTA]->(c1:Comida)-[:TIENE]->(i:Ingrediente)<-[:TIENE]-(c2:Comida)
            WHERE NOT (u)-[:LE_GUSTA]->(c2) AND NOT (u)-[:NO_LE_GUSTA]->(c2)
            WITH c2, COUNT(i) AS shared_ingredients
            OPTIONAL MATCH (u:Usuario {id: $user_id})-[:EVITA]->(i:Ingrediente)<-[:TIENE]-(c2)
            WITH c2, shared_ingredients, COUNT(i) AS avoided_ingredients
            RETURN c2.nombre AS nombre, c2.tipo AS tipo, c2.imagen AS imagen, shared_ingredients, avoided_ingredients
            ORDER BY shared_ingredients DESC, avoided_ingredients ASC
            LIMIT 5
        """, user_id=user_id)

        recomendaciones = []
        for row in result:
            ingredient_score = row["shared_ingredients"] * (80 / 15)
            type_bonus = 20 if row["tipo"] in liked_types else 0
            avoided_penalty = row["avoided_ingredients"] * 10
            compatibility = min(100, max(0, ingredient_score + type_bonus - avoided_penalty))
            ingredientes_result = session.run("""
                MATCH (c:Comida {nombre: $nombre})-[:TIENE]->(i:Ingrediente)
                RETURN i.nombre AS nombre
            """, nombre=row["nombre"])
            ingredientes = [ing["nombre"] for ing in ingredientes_result]

            recomendaciones.append({
                "nombre": row["nombre"],
                "tipo": row["tipo"],
                "ingredientes": ingredientes,
                "compatibilidad": compatibility,
                "imagen": row["imagen"]
            })
        return jsonify(recomendaciones)

@rec_bp.route("/like", methods=["POST"])
def like_dislike():
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return jsonify({"error": "No autorizado"}), 401

    token = token.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401

    data = request.json
    comida = data.get("comida")
    preference = data.get("preference")

    if not comida or preference not in ["like", "dislike"]:
        return jsonify({"error": "Datos inválidos"}), 400

    with get_session() as session:
        opposite_rel = "NO_LE_GUSTA" if preference == "like" else "LE_GUSTA"
        session.run("""
            MATCH (u:Usuario {id: $user_id})-[r:%s]->(c:Comida {nombre: $comida})
            DELETE r
        """ % opposite_rel, user_id=user_id, comida=comida)

        rel_type = "LE_GUSTA" if preference == "like" else "NO_LE_GUSTA"
        session.run("""
            MATCH (u:Usuario {id: $id}), (c:Comida {nombre: $comida})
            MERGE (u)-[:%s]->(c)
        """ % rel_type, user_id=user_id, comida=comida)

    return jsonify({"message": f"{preference.capitalize()} registrado con éxito"}), 200