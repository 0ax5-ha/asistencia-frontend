const API_URL = "https://asistencia-backend-blkd.onrender.com";

document.getElementById("verRegistros").addEventListener("click", async () => {
  const clave = document.getElementById("clave").value.trim();
  if (!clave) return alert("Ingresa la contraseña.");

  const res = await fetch(`${API_URL}/api/registros?key=${clave}`);
  const data = await res.json();

  if (!data || data.ok === false) return alert("Clave incorrecta o error.");

  const cont = document.getElementById("tablaContainer");
  cont.innerHTML = `
    <table>
      <tr><th>Nombre</th><th>Curso</th><th>Fecha</th><th>Hora</th><th>IP</th><th>Ubicación</th></tr>
      ${data
        .map(
          (r) =>
            `<tr><td>${r.nombre}</td><td>${r.curso}</td><td>${r.fecha}</td><td>${r.hora}</td><td>${r.ip}</td><td>${r.ubicacion}</td></tr>`
        )
        .join("")}
    </table>
  `;
});

document.getElementById("descargarCSV").addEventListener("click", () => {
  const clave = document.getElementById("clave").value.trim();
  if (!clave) return alert("Ingresa la contraseña.");
  window.open(`${API_URL}/api/exportar?key=${clave}`, "_blank");
});
