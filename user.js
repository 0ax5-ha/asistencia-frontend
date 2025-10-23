const API_URL = "http://localhost:3000"; // cambia a tu backend cuando lo subas

document.getElementById("asistenciaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const curso = document.getElementById("curso").value.trim();
  const status = document.getElementById("status");
  status.textContent = "Obteniendo ubicación...";

  try {
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const payload = {
      name: nombre,
      courseId: curso,
      type: "entry", // más adelante se puede cambiar a salida automáticamente
      lat,
      lon,
      accuracy_m: accuracy,
      deviceId: localStorage.getItem("deviceId") || crypto.randomUUID(),
    };

    localStorage.setItem("deviceId", payload.deviceId);

    const res = await fetch(`${API_URL}/api/asistencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.ok) {
      status.textContent = "✅ Asistencia registrada correctamente.";
    } else {
      status.textContent = `⚠️ Error: ${data.error}`;
    }
  } catch (err) {
    status.textContent = "Error al obtener ubicación o enviar datos.";
    console.error(err);
  }
});
