// Charakter-Persistenz: ein JSON-Objekt pro Charakter in localStorage (kein Server, keine DB -
// siehe AGENTS.md). Mehrere Charaktere = mehrere Keys + eine Index-Liste.

export interface PoolAllocation {
  gat: number;
  gpa: number;
  mat: number;
  mpa: number;
}

export interface EquipmentEntry {
  id: string;
  family: 'weapon' | 'armor' | 'shield' | 'preisliste' | 'artefakt' | 'ammo';
  baseTable: string;
  baseId: string;
  selections: Record<string, string>;
  quantity: number;
  computedPriceSnapshot?: number;
  computedStatsSnapshot?: Record<string, number>;
}

/** Werte, die den Charakter AUSMACHEN (reine Identitaet/Flavor, kein Punktekauf-Bezug) -
 *  mit Nutzer 2026-07-17 geklaert. Nur name+spezies sind Pflicht, der Rest darf leer sein. */
export interface CharacterHeader {
  name: string;
  spezies: string;
  beruf?: string;
  alter?: string;
  geburtstag?: string;
  heimat?: string;
  familie?: string;
  religion?: string;
  groesse?: string;
  gewicht?: string;
  haarfarbe?: string;
  haarschnitt?: string;
  bartwuchs?: string;
  hautfarbe?: string;
  augenfarbe?: string;
}

export interface CharacterState extends CharacterHeader {
  id: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // "Gesamt-EP" (ep_gesamt) und Geld (dublonen_bank/dublonen_bar) sind selbst normale
  // Art='Wert'-Regelwerkseintraege und leben deshalb HIER, nicht als separate Felder -
  // computeSheet() liest sie wie jeden anderen Wert aus dieser Map.
  values: Record<string, number>;
  selections: Record<string, number>;
  poolAllocations: Record<string, PoolAllocation>;
  equipment: EquipmentEntry[];
  /** Kostenlose Muttersprache/Kultur bei Erschaffung (Nutzer 2026-07-17, nach "NN Sprachen
   *  0.11.docx"): freie Wahl, nicht an Spezies gekoppelt - siehe characterMutations.ts
   *  setFreieSpracheUndKultur() und voelker.ts. */
  freieSpracheReferenz?: string;
  freieKulturReferenz?: string;
}

/**
 * Start-Budget-Pakete bei Charaktererstellung (mit Nutzer 2026-07-17 geklaert, nach
 * anfaenglicher Verwechslung von EP und SP korrigiert):
 * SP wird IMMER als 6400+EP-ausgegebeneSP berechnet (siehe characterSheet.ts) - die 6400
 * sind KEIN separater Startwert hier, sondern stecken schon in der SP-Formel selbst.
 * - normal: EP=0 (Stufe 0, SP daher automatisch 6400), 5000 Dublonen.
 * - gehoben: EP=1600 (Stufe 15, SP daher automatisch 8000), 6000 Dublonen.
 */
export const STARTBUDGET_PRESETS = {
  normal: { epGesamt: 0, dublonen: 5000 },
  gehoben: { epGesamt: 1600, dublonen: 6000 },
} as const;
export type StartbudgetPreset = keyof typeof STARTBUDGET_PRESETS;

/**
 * "Durchschnittscharakter" (Nutzer 2026-07-17): jeder neue Charakter startet mit allen
 * Eigenschaften=10 und Glueck=1 vorausgefuellt - das kostet ganz normal SP nach der
 * bestehenden Kosten-Tabelle (300 SP/Eigenschaft, 80 SP fuer Glueck=1 -> 3080 SP der
 * 6400/8000 SP-Basis sind damit von vornherein "verplant").
 */
const DURCHSCHNITT_EIGENSCHAFTEN: readonly string[] = [
  'eig_g_intelligenz', 'eig_g_mut', 'eig_g_sinneschaerfe', 'eig_g_willenskraft',
  'eig_k_athletik', 'eig_k_ausstrahlung', 'eig_k_geschicklichkeit', 'eig_k_konstitution',
  'eig_k_schnelligkeit', 'eig_k_staerke',
];
const DURCHSCHNITT_GLUECK = 1;

const INDEX_KEY = 'nasus:characters';
const LAST_ACTIVE_KEY = 'nasus:lastActiveCharacterId';
const characterKey = (id: string) => `nasus:character:${id}`;

/** Zuletzt aktiver Charakter (rein UI-Zustand, nicht Teil des Charakter-JSONs) - ohne das
 *  vergisst die App bei jedem Seiten-Reload die Auswahl und faellt auf die leere
 *  "-- Charakter waehlen --"-Ansicht zurueck, obwohl der Charakter selbst gespeichert bleibt. */
export function getLastActiveCharacterId(): string | null {
  return localStorage.getItem(LAST_ACTIVE_KEY);
}

export function setLastActiveCharacterId(id: string | null): void {
  if (id) localStorage.setItem(LAST_ACTIVE_KEY, id);
  else localStorage.removeItem(LAST_ACTIVE_KEY);
}

function readIndex(): string[] {
  const raw = localStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function writeIndex(ids: string[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

function newId(): string {
  return crypto.randomUUID();
}

export function listCharacters(): Array<{ id: string; name: string }> {
  return readIndex()
    .map((id) => loadCharacter(id))
    .filter((c): c is CharacterState => c !== null)
    .map((c) => ({ id: c.id, name: c.name }));
}

export function loadCharacter(id: string): CharacterState | null {
  const raw = localStorage.getItem(characterKey(id));
  if (!raw) return null;
  return JSON.parse(raw) as CharacterState;
}

export function saveCharacter(state: CharacterState): void {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(characterKey(state.id), JSON.stringify(state));
  const index = readIndex();
  if (!index.includes(state.id)) {
    writeIndex([...index, state.id]);
  }
}

export function createCharacter(
  name: string,
  header?: Partial<Omit<CharacterHeader, 'name'>>,
  startbudget?: StartbudgetPreset,
): CharacterState {
  const now = new Date().toISOString();
  const state: CharacterState = {
    id: newId(),
    name,
    spezies: header?.spezies ?? '',
    beruf: header?.beruf,
    alter: header?.alter,
    geburtstag: header?.geburtstag,
    heimat: header?.heimat,
    familie: header?.familie,
    religion: header?.religion,
    groesse: header?.groesse,
    gewicht: header?.gewicht,
    haarfarbe: header?.haarfarbe,
    haarschnitt: header?.haarschnitt,
    bartwuchs: header?.bartwuchs,
    hautfarbe: header?.hautfarbe,
    augenfarbe: header?.augenfarbe,
    createdAt: now,
    updatedAt: now,
    values: {},
    selections: {},
    poolAllocations: {},
    equipment: [],
  };
  if (startbudget) {
    const preset = STARTBUDGET_PRESETS[startbudget];
    state.values['ep_gesamt'] = preset.epGesamt;
    state.values['dublonen_bank'] = preset.dublonen;
    for (const referenz of DURCHSCHNITT_EIGENSCHAFTEN) {
      state.values[referenz] = 10;
    }
    state.values['att_glueck'] = DURCHSCHNITT_GLUECK;
  }
  saveCharacter(state);
  return state;
}

export function deleteCharacter(id: string): void {
  localStorage.removeItem(characterKey(id));
  writeIndex(readIndex().filter((existingId) => existingId !== id));
}
