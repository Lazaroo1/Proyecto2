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

const ingredientesPredefinidos = [
  "harina", "queso mozzarella", "tomate", "albahaca", "aceite de oliva", "sal", "levadura",
  "agua", "orégano", "ajo", "pimienta", "azúcar", "arroz", "pescado crudo", "alga nori",
  "soja", "wasabi", "jengibre", "vinagre de arroz", "sésamo", "cebollino", "limón",
  "carne de cerdo", "tortilla de maíz", "cebolla", "cilantro", "piña", "chile", "comino",
  "pan de hamburguesa", "carne de res", "queso cheddar", "lechuga", "ketchup", "mostaza",
  "mayonesa", "pepinillos", "espagueti", "queso pecorino", "huevo", "panceta", "pimienta negra",
  "perejil", "leche", "lechuga romana", "pollo", "queso parmesano", "crutones", "anchoas",
  "fideos", "caldo de pollo", "cerdo", "caldo de pescado", "judías verdes", "garrofó", "romero",
  "camarones", "cacahuete", "salsa de pescado", "brotes de soja", "leche de coco", "curry",
  "cúrcuma", "cardamomo", "tahini", "aceitunas", "pasas", "zanahoria", "apio", "caldo de verduras",
  "laurel", "yogur", "cordero", "pan pita", "bambú", "calamares", "mejillones", "berenjena",
  "canela", "clavo", "anis estrellado", "salsa hoisin", "tortita de arroz", "nueces", "miel",
  "pistacho", "vainilla", "frijoles negros", "naranja", "papas", "hierba limón", "galanga",
  "hojas de lima", "sémola", "calabacín", "queso mascarpone", "café", "bizcocho", "cacao",
  "licor de café", "salsa verde", "papel de arroz", "pepino", "salsa yakitori", "zapallo",
  "manteca", "col china", "rábano", "pescado fermentado", "remolacha", "eneldo", "crema agria",
  "chocolate", "almendra", "ajonjolí", "plátano", "pan", "especias", "guisante", "hierbas provenzales",
  "patata", "salsa okonomiyaki", "bonito seco", "gochujang", "mazorca", "okra"
];

window.addEventListener("DOMContentLoaded", () => {
  const comidasContainer = document.getElementById("comidasContainer");
  if (comidasContainer) {
    comidasContainer.innerHTML = "";
    comidasPredefinidas.forEach(comida => {
      const label = document.createElement("label");
      label.className = "form-check form-check-inline";
      label.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${comida}" aria-label="Seleccionar ${comida}">
        <span>${comida}</span>
      `;
      comidasContainer.appendChild(label);
    });
  }

  const ingredientesContainer = document.getElementById("ingredientesContainer");
  if (ingredientesContainer) {
    ingredientesContainer.innerHTML = "";
    ingredientesPredefinidos.forEach(ingrediente => {
      const label = document.createElement("label");
      label.className = "form-check form-check-inline";
      label.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${ingrediente}" aria-label="Evitar ${ingrediente}">
        <span>${ingrediente}</span>
      `;
      ingredientesContainer.appendChild(label);
    });
  }
});