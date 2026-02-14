// Opslaglaag: voorlopig alleen localStorage

const STORAGE_KEY = "kart-setup-log-v1";

/**
 * @returns {{ banen: any[]; karts: any[]; sessies: any[] }}
 */
function laadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return gestructureerdeData(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    return gestructureerdeData({ ...DEFAULT_DATA, ...parsed });
  } catch (e) {
    console.error("Kon data niet laden, gebruik default", e);
    return gestructureerdeData(DEFAULT_DATA);
  }
}

function gestructureerdeData(data) {
  return {
    banen: Array.isArray(data.banen) && data.banen.length ? data.banen : DEFAULT_DATA.banen,
    karts: Array.isArray(data.karts) && data.karts.length ? data.karts : DEFAULT_DATA.karts,
    sessies: Array.isArray(data.sessies) ? data.sessies : []
  };
}

/**
 * @param {{ banen: any[]; karts: any[]; sessies: any[] }} data
 */
function slaDataOp(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Kon data niet opslaan", e);
    alert("Kon data niet opslaan (mogelijk te veel data of geen opslagrechten).");
  }
}

function voegBaanToe(data, naam) {
  const nieuweBaan = { id: maakId("baan"), naam: naam.trim() };
  data.banen.push(nieuweBaan);
  slaDataOp(data);
  return nieuweBaan;
}

function voegKartToe(data, naam, klasse = "") {
  const nieuweKart = { id: maakId("kart"), naam: naam.trim(), klasse: klasse.trim() };
  data.karts.push(nieuweKart);
  slaDataOp(data);
  return nieuweKart;
}

function voegSessieToe(data, sessie) {
  data.sessies.push(sessie);
  data.sessies.sort((a, b) => b.aangemaaktOp - a.aangemaaktOp);
  slaDataOp(data);
}

function gefilterdeSessies(data, filters) {
  return data.sessies.filter((s) => {
    if (filters.baanId && s.baanId !== filters.baanId) return false;
    if (filters.kartId && s.kartId !== filters.kartId) return false;
    if (filters.type && s.type !== filters.type) return false;
    if (filters.datum && s.datum !== filters.datum) return false;
    return true;
  });
}
