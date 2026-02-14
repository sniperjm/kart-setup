// UI helpers

function vulSelect(selectEl, items, { includeLeeg = true, leegLabel = "Maak een keuze" } = {}) {
  while (selectEl.firstChild) selectEl.removeChild(selectEl.firstChild);
  if (includeLeeg) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = leegLabel;
    selectEl.appendChild(opt);
  }
  for (const item of items) {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.naam;
    selectEl.appendChild(opt);
  }
}

function renderSessies(container, sessies, banenMap, kartsMap) {
  container.innerHTML = "";
  for (const s of sessies) {
    const div = document.createElement("div");
    div.className = "sessie-item";

    const kop = document.createElement("div");
    kop.className = "sessie-kop";
    const left = document.createElement("div");
    left.textContent = `${s.datum} ${s.tijd}`;
    const right = document.createElement("div");
    right.textContent = banenMap.get(s.baanId) || s.baanNaam || "Onbekende baan";
    kop.append(left, right);

    const tags = document.createElement("div");
    tags.className = "sessie-tags";

    const typeTag = document.createElement("span");
    typeTag.className = `tag type-${s.type}`;
    typeTag.textContent = s.type;
    tags.appendChild(typeTag);

    const kartTag = document.createElement("span");
    kartTag.className = "tag";
    kartTag.textContent = kartsMap.get(s.kartId) || s.kartNaam || "Kart";
    tags.appendChild(kartTag);

    if (s.tandwiel.voor || s.tandwiel.achter) {
      const gearTag = document.createElement("span");
      gearTag.className = "tag";
      gearTag.textContent = `tandwiel ${s.tandwiel.voor || "?"}/${s.tandwiel.achter || "?"}`;
      tags.appendChild(gearTag);
    }

    if (s.tandwiel.opmerking) {
      const gearNoteTag = document.createElement("span");
      gearNoteTag.className = "tag";
      gearNoteTag.textContent = s.tandwiel.opmerking;
      tags.appendChild(gearNoteTag);
    }

    if (s.banden && s.banden.type) {
      const bandTag = document.createElement("span");
      bandTag.className = "tag";
      bandTag.textContent = s.banden.type;
      tags.appendChild(bandTag);
    }

    if (s.banden && (s.banden.breedteVoor || s.banden.breedteAchter)) {
      const breedteTag = document.createElement("span");
      breedteTag.className = "tag";
      breedteTag.textContent = `breedte v/a: ${s.banden.breedteVoor || "?"}/${s.banden.breedteAchter || "?"}`;
      tags.appendChild(breedteTag);
    }

    if (s.weer && (s.weer.temp || s.weer.omschrijving)) {
      const weerTag = document.createElement("span");
      weerTag.className = "tag";
      const parts = [];
      if (s.weer.temp != null) parts.push(`${s.weer.temp}°C`);
      if (s.weer.omschrijving) parts.push(s.weer.omschrijving);
      weerTag.textContent = parts.join(" · ");
      tags.appendChild(weerTag);
    }

    if (s.weer && s.weer.grip) {
      const gripTag = document.createElement("span");
      gripTag.className = "tag";
      gripTag.textContent = `grip: ${s.weer.grip}`;
      tags.appendChild(gripTag);
    }

    const details = document.createElement("div");
    details.className = "sessie-details";

    const rows = [];

    rows.push(`Tandwiel: ${s.tandwiel.voor || "?"}/${s.tandwiel.achter || "?"}${s.tandwiel.opmerking ? " (" + s.tandwiel.opmerking + ")" : ""}`);

    const bandParts = [];
    if (s.banden.type) bandParts.push(`type: ${s.banden.type}`);
    if (s.banden.lv || s.banden.rv || s.banden.la || s.banden.ra) {
      bandParts.push(
        `druk LV/RV/LA/RA: ${s.banden.lv ?? "?"}/${s.banden.rv ?? "?"}/${s.banden.la ?? "?"}/${s.banden.ra ?? "?"} bar`
      );
    }
    if (s.banden.breedteVoor || s.banden.breedteAchter) {
      bandParts.push(`breedte v/a: ${s.banden.breedteVoor ?? "?"}/${s.banden.breedteAchter ?? "?"} mm`);
    }
    if (bandParts.length) rows.push("Banden: " + bandParts.join(" · "));

    const setupParts = [];
    if (s.setup.as) setupParts.push(`as: ${s.setup.as}`);
    if (s.setup.hubs) setupParts.push(`hubs: ${s.setup.hubs}`);
    if (s.setup.spoorVoor) setupParts.push(`spoor voor: ${s.setup.spoorVoor}`);
    if (s.setup.spoorAchter) setupParts.push(`spoor achter: ${s.setup.spoorAchter}`);
    if (s.setup.camber) setupParts.push(`camber: ${s.setup.camber}`);
    if (s.setup.caster) setupParts.push(`caster: ${s.setup.caster}`);
    if (s.setup.gewichtBestuurder != null) setupParts.push(`gewicht bestuurder: ${s.setup.gewichtBestuurder} kg`);
    if (s.setup.ballastVoor != null) setupParts.push(`ballast voor: ${s.setup.ballastVoor} kg`);
    if (s.setup.ballastLinks != null) setupParts.push(`ballast links: ${s.setup.ballastLinks} kg`);
    if (s.setup.ballastRechts != null) setupParts.push(`ballast rechts: ${s.setup.ballastRechts} kg`);
    if (s.setup.ballastAchter != null) setupParts.push(`ballast achter: ${s.setup.ballastAchter} kg`);
    if (s.setup.carbType) setupParts.push(`carb: ${s.setup.carbType}`);
    if (s.setup.mainJet != null) setupParts.push(`main jet: ${s.setup.mainJet}`);
    if (s.setup.naaldpositie) setupParts.push(`naald: ${s.setup.naaldpositie}`);
    if (s.setup.zitLinksVoor != null || s.setup.zitRechtsVoor != null || s.setup.zitAchter != null) {
      setupParts.push(
        `zitpos links/rechts/achter: ${s.setup.zitLinksVoor ?? "?"}/${s.setup.zitRechtsVoor ?? "?"}/${s.setup.zitAchter ?? "?"} mm`
      );
    }
    if (s.setup.voorhoogte) setupParts.push(`voorhoogte: ${s.setup.voorhoogte}`);
    if (s.setup.achterhoogte) setupParts.push(`achterhoogte: ${s.setup.achterhoogte}`);
    if (setupParts.length) rows.push("Setup: " + setupParts.join(" · "));

    const weerParts = [];
    if (s.weer.plaats) weerParts.push(s.weer.plaats);
    if (s.weer.baanConditie) weerParts.push(`baan: ${s.weer.baanConditie}`);
    if (s.weer.temp != null) weerParts.push(`${s.weer.temp}°C`);
    if (s.weer.luchtvochtigheid != null) weerParts.push(`RV: ${s.weer.luchtvochtigheid}%`);
    if (s.weer.luchtdruk != null) weerParts.push(`druk: ${s.weer.luchtdruk} mbar`);
    if (s.weer.grip) weerParts.push(`grip: ${s.weer.grip}`);
    if (weerParts.length) rows.push("Weer: " + weerParts.join(" · "));

    if (s.notities) rows.push("Notities: " + s.notities);

    details.innerHTML = rows.map((r) => `<div>${r}</div>`).join("");

    div.append(kop, tags, details);

    container.appendChild(div);
  }
}
