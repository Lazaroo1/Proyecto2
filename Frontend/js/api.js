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
        <img src="${rec.imagen || 'placeholder.jpg'}" alt="${rec.nombre}" class="img-fluid me-3" style="width: 100px; height: 100px; object-fit: cover;">
        <div>
          <h3 class="rec-title" style="cursor: pointer;">${rec.nombre}</h3>
          <p>Compatibilidad: ${rec.compatibilidad.toFixed(2)}%</p>
          <button class="btn btn-sm btn-success me-2 like-btn" data-comida="${rec.nombre}">
            <i class="fa-solid fa-thumbs-up"></i> Like
          </button>
          <button class="btn btn-sm btn-danger dislike-btn" data-comida="${rec.nombre}">
            <i class="fa-solid fa-thumbs-down"></i> Dislike
          </button>
        </div>
      `;
      li.querySelector('.rec-title').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('ingredientesModal'));
        const ingredientesList = document.getElementById('ingredientesList');
        ingredientesList.innerHTML = rec.ingredientes.map(ing => `
          <li class="list-group-item">${ing}</li>
        `).join('');
        document.getElementById('ingredientesModalLabel').textContent = `Ingredientes de ${rec.nombre}`;
        modal.show();
      });
      ul.appendChild(li);
    });

    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comida = btn.dataset.comida;
        await sendPreference(comida, 'like');
        btn.disabled = true;
        btn.nextElementSibling.disabled = false;
      });
    });
    document.querySelectorAll('.dislike-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comida = btn.dataset.comida;
        await sendPreference(comida, 'dislike');
        btn.disabled = true;
        btn.previousElementSibling.disabled = false;
      });
    });
  } else {
    console.error("Error fetching recommendations:", await res.text());
    alert("Error al cargar recomendaciones");
  }
}

async function sendPreference(comida, preference) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comida, preference })
  });
  if (!res.ok) {
    console.error(`Error sending ${preference}:`, await res.text());
    alert(`Error al enviar ${preference}`);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    getRecomendaciones();
  } else {
    window.location.href = "index.html";
  }
});