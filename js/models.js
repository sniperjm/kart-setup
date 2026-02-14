// Basis datamodellen voor kart setup log

/**
 * @typedef {Object} Baan
 * @property {string} id
 * @property {string} naam
 */

/**
 * @typedef {Object} Kart
 * @property {string} id
 * @property {string} naam
 * @property {string} [klasse]
 */

/**
 * @typedef {Object} Sessie
 * @property {string} id
 * @property {string} datum ISO datum (YYYY-MM-DD)
 * @property {string} tijd HH:MM
 * @property {string} baanId
 * @property {string} baanNaam
 * @property {string} type training | quali | race | overig
 * @property {string} kartId
 * @property {string} kartNaam
 * @property {Object} tandwiel
 * @property {Object} banden
 * @property {Object} setup
 * @property {Object} weer
 * @property {string} [notities]
 * @property {number} aangemaaktOp timestamp (ms)
 */

const DEFAULT_DATA = {
  banen: /** @type {Baan[]} */ ([
    { id: "baan-kartbaan-1", naam: "Onbekende baan" }
  ]),
  karts: /** @type {Kart[]} */ ([
    { id: "kart-default", naam: "Mijn kart", klasse: "" }
  ]),
  sessies: /** @type {Sessie[]} */ ([])
};

function maakId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function maakLegeSessie() {
  const nu = new Date();
  const datum = nu.toISOString().slice(0, 10);
  const tijd = nu.toTimeString().slice(0, 5);

  return {
    id: maakId("sessie"),
    datum,
    tijd,
    baanId: DEFAULT_DATA.banen[0].id,
    baanNaam: DEFAULT_DATA.banen[0].naam,
    type: "training",
    kartId: DEFAULT_DATA.karts[0].id,
    kartNaam: DEFAULT_DATA.karts[0].naam,
    tandwiel: {
      voor: null,
      achter: null,
      opmerking: ""
    },
    banden: {
      type: "",
      lv: null,
      rv: null,
      la: null,
      ra: null,
      breedteVoor: null,
      breedteAchter: null
    },
    setup: {
      as: "",
      hubs: "",
      spoorVoor: "",
      spoorAchter: "",
      camber: "",
      caster: "",
      gewichtBestuurder: null,
      ballastVoor: null,
      ballastLinks: null,
      ballastRechts: null,
      ballastAchter: null,
      carbType: "",
      mainJet: null,
      naaldpositie: "",
      zitLinksVoor: null,
      zitRechtsVoor: null,
      zitAchter: null,
      voorhoogte: "",
      achterhoogte: ""
    },
    weer: {
      temp: null,
      omschrijving: "",
      grip: "",
      plaats: "",
      baanConditie: "",
      luchtvochtigheid: null,
      luchtdruk: null
    },
    notities: "",
    aangemaaktOp: Date.now()
  };
}
