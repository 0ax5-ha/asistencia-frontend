const API_URL = "https://asistencia-backend-blkd.onrender.com"; // tu backend en Render
const FORM = document.getElementById("asistenciaForm");
const STATUS = document.getElementById("status");

function desactivarFormulario(msg) {
  FORM.querySelector("button").disabled = true;
  STATUS.textContent = msg;
  STATUS.className = "status-message status-error";
}

// Verificar si ya marcó hoy en este dispositivo
const hoy = new Date().toDateString();
const ultimaAsistencia = localStorage.getItem("asistenciaHoy");
if (ultimaAsistencia === hoy) {
  desactivarFormulario("⚠️ Ya marcaste asistencia hoy desde este dispositivo.");
}

FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const curso = document.getElementById("curso").value.trim();

  if (!nombre || !curso) {
    STATUS.textContent = "Por favor, completa todos los campos.";
    STATUS.className = "status-message status-error";
    return;
  }

  // Obtener ubicación
  if (!navigator.geolocation) {
    STATUS.textContent = "Tu navegador no soporta geolocalización.";
    STATUS.className = "status-message status-error";
    return;
  }

  STATUS.textContent = "📍 Verificando ubicación...";
  STATUS.className = "status-message";

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const ubicacion = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };

    const data = { nombre, curso, ubicacion };

    try {
      const res = await fetch(`${API_URL}/api/asistencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        localStorage.setItem("asistenciaHoy", hoy);
        STATUS.textContent = "Asistencia registrada correctamente.";
        STATUS.className = "status-message status-success";
        FORM.querySelector("button").disabled = true;
      } else {
        STATUS.textContent = "⚠️ " + result.msg;
        STATUS.className = "status-message status-error";
      }
    } catch (err) {
      STATUS.textContent = "Error al enviar los datos.";
      STATUS.className = "status-message status-error";
    }
  });
});
