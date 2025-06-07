const comidasPredefinidas = [
  "Pizza Margherita", "Sushi Nigiri", "Tacos al Pastor", "Hamburguesa Clásica", "Pasta Carbonara",
  "Ensalada César", "Ramen Shoyu", "Ceviche Peruano", "Pollo Frito", "Paella Valenciana",
  "Pad Thai", "Pollo al Curry", "Falafel", "Empanadas Argentinas", "Sopa de Lentejas",
  "Gyros de Cordero", "Dim Sum", "Chiles Rellenos", "Moussaka", "Biryani de Pollo",
  "Poke de Atún", "Lasaña Boloñesa", "Pho de Res", "Arepa Rellena", "Sashimi de Salmón",
  "Couscous con Verduras", "Tiramisú", "Enchiladas Verdes", "Spring Rolls", "Shawarma de Pollo",
  "Sopa Pho Vegetariana", "Tacos de Pescado", "Risotto de Champiñones", "Butter Chicken",
  "Hummus con Pita", "Tamales", "Sopa de Miso", "Pato Pekín", "Baklava", "Feijoada",
  "Goulash", "Sopa Tom Yum", "Paella de Mariscos", "Chow Mein", "Rendang de Ternera",
  "Banh Mi", "Quinoa con Verduras", "Tikka Masala", "Carpaccio de Res", "Causa Limeña",
  "Poutine"
];

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("comidasContainer");
  if (container) {
    container.innerHTML = "";
    comidasPredefinidas.forEach(comida => {
      const label = document.createElement("label");
      label.className = "form-check form-check-inline";
      label.innerHTML = `<input class="form-check-input" type="checkbox" value="${comida}"> ${comida}`;
      container.appendChild(label);
    });
  }
});