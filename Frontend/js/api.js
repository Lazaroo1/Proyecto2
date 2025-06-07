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
      li.className = "recommendation-card";
      li.innerHTML = `
        <img src="${rec.imagen || 'placeholder.jpg'}" alt="${rec.nombre}">
        <div>
          <h3>${rec.nombre}</h3>
          <p>Compatibilidad: ${rec.compatibilidad.toFixed(2)}%</p>
          <button class="like-btn" data-comida="${rec.nombre}">
            <i class="fa-solid fa-thumbs-up"></i> Like
          </button>
          <button class="dislike-btn" data-comida="${rec.nombre}">
            <i class="fa-solid fa-thumbs-down"></i> Dislike
          </button>
          <button class="ver-ingredientes-btn" data-comida="${rec.nombre}" data-ingredientes='${JSON.stringify(rec.ingredientes)}'>
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
        btn.disabled = true;
        btn.parentElement.querySelector('.dislike-btn').disabled = true;
        await getRecomendaciones();
      });
    });

    document.querySelectorAll('.dislike-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const comida = btn.dataset.comida;
        await sendPreference(comida, 'dislike');
        btn.disabled = true;
        btn.parentElement.querySelector('.like-btn').disabled = true;
        await getRecomendaciones();
      });
    });

    document.querySelectorAll('.ver-ingredientes-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ingredientes = JSON.parse(btn.dataset.ingredientes);
        const nombreComida = btn.dataset.comida;
        const modal = document.getElementById('ingredientesModal');
        const lista = document.getElementById('ingredientesList');
        const titulo = document.getElementById('modalTitle');

        lista.innerHTML = '';
        ingredientes.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          lista.appendChild(li);
        });

        titulo.textContent = `Ingredientes de ${nombreComida}`;
        modal.classList.remove('hidden');
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
