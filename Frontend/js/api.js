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
          <button class="btn btn-sm btn-danger me-2 dislike-btn" data-comida="${rec.nombre}">
            <i class="fa-solid fa-thumbs-down"></i> Dislike
          </button>
          <button class="btn btn-sm btn-info ver-ingredientes-btn" data-ingredientes='${JSON.stringify(rec.ingredientes)}'>
            <i class="fa-solid fa-carrot"></i> Ver Ingredientes
          </button>
        </div>
      `;

      ul.appendChild(li);
    });

    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comida = btn.dataset.comida;
        await sendPreference(comida, 'like');
        await getRecomendaciones();
      });
    });

    document.querySelectorAll('.dislike-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comida = btn.dataset.comida;
        await sendPreference(comida, 'dislike');
        await getRecomendaciones();
      });
    });

    document.querySelectorAll('.ver-ingredientes-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ingredientes = JSON.parse(btn.getAttribute('data-ingredientes'));
        const lista = document.getElementById('ingredientesList');
        lista.innerHTML = '';
        ingredientes.forEach(ing => {
          const li = document.createElement('li');
          li.textContent = ing;
          lista.appendChild(li);
        });
        document.getElementById('ingredientesModal').classList.remove('hidden');
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

if (localStorage.getItem("token")) {
  getRecomendaciones();
} else {
  window.location.href = "index.html";
}
