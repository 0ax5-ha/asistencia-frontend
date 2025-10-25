const API_URL = "https://asistencia-backend-blkd.onrender.com";

document.getElementById("asistenciaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const curso = document.getElementById("curso").value.trim();
  const status = document.getElementById("status");
  status.style.display = "block";
  status.textContent = "Obteniendo ubicación...";

  if (!navigator.geolocation) {
    status.textContent = "Geolocalización no soportada por tu navegador.";
    status.className = "status-message error";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const ubicacion = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;

    try {
      const res = await fetch(`${API_URL}/api/marcar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, curso, ubicacion }),
      });
      const data = await res.json();

      if (data.ok) {
        status.textContent = data.msg;
        status.className = "status-message success";
      } else {
        status.textContent = data.msg;
        status.className = "status-message error";
      }
    } catch {
      status.textContent = "Error al conectar con el servidor.";
      status.className = "status-message error";
    }
  }, () => {
    status.textContent = "No se pudo obtener tu ubicación.";
    status.className = "status-message error";
  });
});
