// Entry point

(function () {
  const data = laadData();

  const sessieDialog = document.getElementById("sessie-dialog");
  const sessieForm = document.getElementById("sessie-form");
  const btnNieuweSessie = document.getElementById("btn-nieuwe-sessie");
  const btnAnnuleren = document.getElementById("btn-annuleren");
  const sessiesContainer = document.getElementById("sessies-container");
  const geenSessiesEl = document.getElementById("geen-sessies");
  const btnExportCsv = document.getElementById("btn-export-csv");
  const btnPrint = document.getElementById("btn-print");

  const filterBaan = document.getElementById("filter-baan");
  const filterKart = document.getElementById("filter-kart");
  const filterDatum = document.getElementById("filter-datum");
  const filterType = document.getElementById("filter-type");
  const btnFiltersReset = document.getElementById("btn-filters-reset");

  const baanSelect = document.getElementById("baan");
  const kartSelect = document.getElementById("kart");
  const btnBaanToevoegen = document.getElementById("btn-baan-toevoegen");
  const btnKartToevoegen = document.getElementById("btn-kart-toevoegen");

  function maakMaps() {
    return {
      banenMap: new Map(data.banen.map((b) => [b.id, b.naam])),
      kartsMap: new Map(data.karts.map((k) => [k.id, k.naam]))
    };
  }

  function syncFiltersUI() {
    vulSelect(filterBaan, data.banen, { includeLeeg: true, leegLabel: "Alle banen" });
    vulSelect(filterKart, data.karts, { includeLeeg: true, leegLabel: "Alle karts" });
  }

  function syncFormDropdowns(sessie) {
    vulSelect(baanSelect, data.banen, { includeLeeg: false });
    vulSelect(kartSelect, data.karts, { includeLeeg: false });
    baanSelect.value = sessie.baanId;
    kartSelect.value = sessie.kartId;
  }

  function leesFilters() {
    return {
      baanId: filterBaan.value || null,
      kartId: filterKart.value || null,
      datum: filterDatum.value || null,
      type: filterType.value || null
    };
  }

  function render() {
    const { banenMap, kartsMap } = maakMaps();
    const filters = leesFilters();
    const sessies = gefilterdeSessies(data, filters);

    renderSessies(sessiesContainer, sessies, banenMap, kartsMap);
    geenSessiesEl.style.display = sessies.length === 0 ? "block" : "none";
  }

  function openNieuweSessieDialog() {
    const sessie = maakLegeSessie();
    syncFormDropdowns(sessie);

    document.getElementById("datum").value = sessie.datum;
    document.getElementById("tijd").value = sessie.tijd;
    document.getElementById("type").value = sessie.type;

    document.getElementById("tand-voor").value = "";
    document.getElementById("tand-achter").value = "";
    document.getElementById("band-type").value = "";
    document.getElementById("band-lv").value = "";
    document.getElementById("band-rv").value = "";
    document.getElementById("band-la").value = "";
    document.getElementById("band-ra").value = "";
    document.getElementById("as").value = "";
    document.getElementById("hubs").value = "";
    document.getElementById("spoor-voor").value = "";
    document.getElementById("spoor-achter").value = "";
    document.getElementById("camber").value = "";
    document.getElementById("caster").value = "";
    document.getElementById("temp").value = "";
    document.getElementById("weer").value = "";
    document.getElementById("grip").value = "";
    document.getElementById("notities").value = "";

    sessieDialog.dataset.id = sessie.id;
    sessieDialog.showModal();
  }

  function leesSessieUitForm() {
    const id = sessieDialog.dataset.id || maakId("sessie");
    const datum = document.getElementById("datum").value;
    const tijd = document.getElementById("tijd").value;
    const baanId = baanSelect.value;
    const kartId = kartSelect.value;
    const baan = data.banen.find((b) => b.id === baanId);
    const kart = data.karts.find((k) => k.id === kartId);

    return {
      id,
      datum,
      tijd,
      baanId,
      baanNaam: baan ? baan.naam : "",
      type: document.getElementById("type").value,
      kartId,
      kartNaam: kart ? kart.naam : "",
      tandwiel: {
        voor: parseInt(document.getElementById("tand-voor").value, 10) || null,
        achter: parseInt(document.getElementById("tand-achter").value, 10) || null
      },
      banden: {
        type: document.getElementById("band-type").value.trim(),
        lv: parseFloat(document.getElementById("band-lv").value) || null,
        rv: parseFloat(document.getElementById("band-rv").value) || null,
        la: parseFloat(document.getElementById("band-la").value) || null,
        ra: parseFloat(document.getElementById("band-ra").value) || null
      },
      setup: {
        as: document.getElementById("as").value.trim(),
        hubs: document.getElementById("hubs").value.trim(),
        spoorVoor: document.getElementById("spoor-voor").value.trim(),
        spoorAchter: document.getElementById("spoor-achter").value.trim(),
        camber: document.getElementById("camber").value.trim(),
        caster: document.getElementById("caster").value.trim()
      },
      weer: {
        temp: document.getElementById("temp").value ? parseFloat(document.getElementById("temp").value) : null,
        omschrijving: document.getElementById("weer").value.trim(),
        grip: document.getElementById("grip").value.trim()
      },
      notities: document.getElementById("notities").value.trim(),
      aangemaaktOp: Date.now()
    };
  }

  // Event listeners
  btnNieuweSessie.addEventListener("click", () => {
    openNieuweSessieDialog();
  });

  btnAnnuleren.addEventListener("click", () => {
    sessieDialog.close();
  });

  sessieForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const sessie = leesSessieUitForm();
    voegSessieToe(data, sessie);
    sessieDialog.close();
    render();
  });

  btnBaanToevoegen.addEventListener("click", () => {
    const naam = prompt("Naam van de baan:");
    if (!naam || !naam.trim()) return;
    const nieuwe = voegBaanToe(data, naam);
    syncFiltersUI();
    syncFormDropdowns({ baanId: nieuwe.id, kartId: kartSelect.value });
  });

  btnKartToevoegen.addEventListener("click", () => {
    const naam = prompt("Naam van de kart:");
    if (!naam || !naam.trim()) return;
    const klasse = prompt("Optioneel: klasse/motor (bijv. Rotax, X30)") || "";
    const nieuwe = voegKartToe(data, naam, klasse);
    syncFiltersUI();
    syncFormDropdowns({ baanId: baanSelect.value, kartId: nieuwe.id });
  });

  [filterBaan, filterKart, filterDatum, filterType].forEach((el) => {
    el.addEventListener("change", render);
  });

  btnFiltersReset.addEventListener("click", () => {
    filterBaan.value = "";
    filterKart.value = "";
    filterDatum.value = "";
    filterType.value = "";
    render();
  });

  btnExportCsv.addEventListener("click", () => {
    const filters = leesFilters();
    const sessies = gefilterdeSessies(data, filters);
    if (!sessies.length) {
      alert("Geen sessies om te exporteren.");
      return;
    }
    const csv = maakCsv(sessies);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const datum = new Date().toISOString().slice(0, 10);
    a.download = `kart-setup-${datum}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  btnPrint.addEventListener("click", () => {
    window.print();
  });

  // Init
  syncFiltersUI();
  render();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch((err) => {
        console.warn("Service worker registratie faalde", err);
      });
    });
  }

  function maakCsv(sessies) {
    const headers = [
      "datum",
      "tijd",
      "baan",
      "type",
      "kart",
      "tand_voor",
      "tand_achter",
      "band_type",
      "band_lv",
      "band_rv",
      "band_la",
      "band_ra",
      "as",
      "hubs",
      "spoor_voor",
      "spoor_achter",
      "camber",
      "caster",
      "temp",
      "weer",
      "grip",
      "notities"
    ];

    const rows = sessies.map((s) => [
      s.datum,
      s.tijd,
      s.baanNaam,
      s.type,
      s.kartNaam,
      s.tandwiel.voor ?? "",
      s.tandwiel.achter ?? "",
      s.banden.type ?? "",
      s.banden.lv ?? "",
      s.banden.rv ?? "",
      s.banden.la ?? "",
      s.banden.ra ?? "",
      s.setup.as ?? "",
      s.setup.hubs ?? "",
      s.setup.spoorVoor ?? "",
      s.setup.spoorAchter ?? "",
      s.setup.camber ?? "",
      s.setup.caster ?? "",
      s.weer.temp ?? "",
      s.weer.omschrijving ?? "",
      s.weer.grip ?? "",
      (s.notities || "").replace(/\s+/g, " ")
    ]);

    const escape = (value) => {
      const str = String(value ?? "");
      if (str.includes(";") || str.includes("\n") || str.includes("""")) {
        return '"' + str.replace(/""/g, '""') + '"';
      }
      return str;
    };

    const lines = [headers.join(";"), ...rows.map((r) => r.map(escape).join(";"))];
    return lines.join("\n");
  }
})();
