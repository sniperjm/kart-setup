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

    if (s.banden && s.banden.type) {
      const bandTag = document.createElement("span");
      bandTag.className = "tag";
      bandTag.textContent = s.banden.type;
      tags.appendChild(bandTag);
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

    if (s.notities) {
      const note = document.createElement("div");
      note.className = "hint";
      note.textContent = s.notities;
      div.append(kop, tags, note);
    } else {
      div.append(kop, tags);
    }

    container.appendChild(div);
  }
}
