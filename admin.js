const API_URL = "http://localhost:3000";
let token = null;

document.getElementById("loginBtn").addEventListener("click", async () => {
  const pw = document.getElementById("adminPassword").value;
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pw })
  });
  const data = await res.json();

  if (data.ok) {
    token = data.token;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("panel").style.display = "block";
    loadRecords();
  } else {
    document.getElementById("loginStatus").textContent = "Contraseña incorrecta.";
  }
});

async function loadRecords() {
  const res = await fetch(`${API_URL}/api/records`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  if (data.ok) {
    data.rows.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.name}</td>
        <td>${r.courseId || ""}</td>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.type}</td>
        <td>${r.ip || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

document.getElementById("exportCsv").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/api/export`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "asistencia.csv";
  a.click();
});
