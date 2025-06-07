function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
  if (tabId === 'ausgeliefert') renderAusgeliefertList();
  if (tabId === 'liste') ;
}

let hellmannContainer = [];
let sortAscending = true;

function addContainer() {
  const input = document.getElementById("containerInput");
  const number = input.value.trim();
  if (!number) return alert("❗ Bitte Containernummer eingeben");

  hellmannContainer.push({ number: number, seal: "", status: "Leercontainer", delivered: false, timestamp: null, spedition: "", kennzeichen: "" });
  input.value = "";
  saveToStorage();
  renderHellmannList();
}

function renderHellmannList() {
  const list = document.getElementById("hellmannList");
  list.innerHTML = "";

  const sortType = document.getElementById("sortSelect").value;

  const filtered = hellmannContainer.filter(c => !c.delivered);
  const compare = (a, b, prop) => {
    return sortAscending ? a[prop].localeCompare(b[prop]) : b[prop].localeCompare(a[prop]);
  };

  if (sortType === "status") {
    const statusOrder = {
      "Leercontainer": 0,
      "Angefordert": 1,
      "Wird gepackt": 2,
      "Bereit zur Abholung": 3
    };
    filtered.sort((a, b) => sortAscending ? statusOrder[a.status] - statusOrder[b.status] : statusOrder[b.status] - statusOrder[a.status]);
  } else if (sortType === "number") {
    filtered.sort((a, b) => compare(a, b, "number"));
  } else if (sortType === "seal") {
    filtered.sort((a, b) => compare(a, b, "seal"));
  }

  filtered.forEach((item, index) => {
    let bgColor = "";
    switch(item.status) {
      case "Leercontainer":
        bgColor = "background-color: #e6f7ff;"; break;
      case "Angefordert":
        bgColor = "background-color: #fff3cd;"; break;
      case "Wird gepackt":
        bgColor = "background-color: #ffe6e6;"; break;
      case "Bereit zur Abholung":
        bgColor = "background-color: #d4edda;"; break;
      default:
        bgColor = "background-color: #f4f4f4;";
    }

    list.innerHTML += `
      <div style="margin-bottom:10px; padding:10px; border:1px solid #ccc; border-radius:5px; ${bgColor}">
        🚢 <strong>${item.number}</strong><br>
        📦 Status:
        <select onchange="updateStatus(${index}, this.value)">
          <option ${item.status === "Leercontainer" ? "selected" : ""}>Leercontainer</option>
          <option ${item.status === "Angefordert" ? "selected" : ""}>Angefordert</option>
          <option ${item.status === "Wird gepackt" ? "selected" : ""}>Wird gepackt</option>
          <option ${item.status === "Bereit zur Abholung" ? "selected" : ""}>Bereit zur Abholung</option>
        </select><br>
        🔐 Siegelnummer: <input type="text" value="${item.seal}" onchange="updateSeal(${index}, this.value)" /><br>
        ✅ <button onclick="openDeliveryDialog(${index})">Als ausgeliefert markieren</button>
      </div>
    `;
  });

  document.getElementById("sortDirIcon").textContent = sortAscending ? "⬆️" : "⬇️";
}

function toggleSortDirection() {
  sortAscending = !sortAscending;
  renderHellmannList();
}

function renderAusgeliefertList() {
  const list = document.getElementById("ausgeliefertList");
  list.innerHTML = "";
  hellmannContainer.forEach(item => {
    if (!item.delivered) return;
    list.innerHTML += `
      <div style="margin-bottom:10px; padding:10px; border:1px solid #ccc; border-radius:5px; background-color: #e0ffe0;">
        🚚 <strong>${item.number}</strong><br>
        📦 Status: ${item.status}<br>
        🔐 Siegelnummer: ${item.seal}<br>
        🚛 Spedition: ${item.spedition}<br>
        🔤 Kennzeichen: ${item.kennzeichen}<br>
        ⏰ Ausgeliefert am: ${item.timestamp}
      </div>
    `;
  });
}

function updateSeal(index, value) {
  hellmannContainer[index].seal = value;
  saveToStorage();
}

function updateStatus(index, value) {
  hellmannContainer[index].status = value;
  saveToStorage();
  renderHellmannList();
}

function openDeliveryDialog(index) {
  const spedition = prompt("Spedition eingeben:");
  if (spedition === null) return;
  const kennzeichen = prompt("Kennzeichen eingeben:");
  if (kennzeichen === null) return;

  hellmannContainer[index].spedition = spedition;
  hellmannContainer[index].kennzeichen = kennzeichen;
  markDelivered(index);
}

function markDelivered(index) {
  hellmannContainer[index].delivered = true;
  hellmannContainer[index].timestamp = new Date().toLocaleString();
  saveToStorage();
  renderHellmannList();
}

function saveToStorage() {
  localStorage.setItem("hellmannContainer", JSON.stringify(hellmannContainer));
}

function loadFromStorage() {
  const data = localStorage.getItem("hellmannContainer");
  if (data) {
    hellmannContainer = JSON.parse(data);
  }
}

window.onload = () => {
  loadFromStorage();
  showTab('hauptseite');
};
