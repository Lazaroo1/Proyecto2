async function getRecomendaciones() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("username").textContent = user.nombre;

  const res = await fetch(`http://localhost:5000/recommendations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (res.ok) {
    const recomendaciones = await res.json();
    const ul = document.getElementById("recomendaciones");
    ul.innerHTML = "";
    recomendaciones.forEach(rec => {
      const li = document.createElement("li");
      li.className = "recommendation-card d-flex align-items-center mb-3 p-3";
      li.innerHTML = `
        <img src="${rec.imagen}" alt="${rec.nombre}" class="img-fluid me-3" style="width: 100px; height: 100px; object-fit: cover;">
        <div>${rec.nombre} - Compatibilidad: ${rec.compatibilidad.toFixed(2)}%</div>
      `;
      ul.appendChild(li);
    });
  } else {
    console.error("Error fetching recommendations:", await res.text());
    alert("Error al cargar recomendaciones");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    getRecomendaciones();
  } else {
    window.location.href = "index.html";
  }
});