
function startExcelUpload() {
  const fileInput = document.getElementById("excelFile");
  if (!fileInput.files.length) {
    alert("❗ Bitte eine Datei auswählen.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const bookingRaw = rows[2]?.[0] || "";
    const bookingMatch = bookingRaw.match(/HT\d+/);
    const bookingNr = bookingMatch ? bookingMatch[0] : "(unbekannt)";

    localStorage.setItem("stahl_booking", bookingNr);
    localStorage.setItem("stahl_data", JSON.stringify(rows));

    alert("✅ Liste hochgeladen – wechsle zu ‚Stahlausgang‘.");
  };
  reader.readAsArrayBuffer(file);
}
