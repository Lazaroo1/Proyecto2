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
            WHERE NOT (u)-[:LE_GUSTA]->(c2)
            WITH c2, COUNT(i) AS shared_ingredients
            RETURN c2.nombre AS nombre, c2.tipo AS tipo, c2.imagen AS imagen, shared_ingredients
            ORDER BY shared_ingredients DESC
            LIMIT 5
        """, user_id=user_id)

        recomendaciones = []
        for row in result:
            ingredient_score = row["shared_ingredients"] * (80 / 15)  
            type_bonus = 20 if row["tipo"] in liked_types else 0
            compatibility = min(100, ingredient_score + type_bonus)
            recomendaciones.append({
                "nombre": row["nombre"],
                "tipo": row["tipo"],
                "ingredientes": row.get("ingredientes", []),
                "compatibilidad": compatibility,
                "imagen": row["imagen"]
            })
        return jsonify(recomendaciones)