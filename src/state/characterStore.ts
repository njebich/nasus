// Charakter-Persistenz: ein JSON-Objekt pro Charakter in localStorage (kein Server, keine DB -
// siehe AGENTS.md). Mehrere Charaktere = mehrere Keys + eine Index-Liste.

import { getEigenschaftGrenzen } from '../engine/eigenschaftenGrenzen';
import type { RsGruppe } from '../data/trefferzonen';
import type { Welt } from '../data/orte';

export interface PoolAllocation {
  gat: number;
  gpa: number;
  mat: number;
  mpa: number;
  /** nAT/nPA-Pool-Zuschuss (Kampf-Tab, 2026-07-20): fuellt die Basis-AT/PA einer Waffenzeile bis
   *  hoechstens 20 auf - siehe engine/waffenPool.ts's computeWeaponAtPaOverflow/natMax/npaMax.
   *  Fuer Nicht-Waffen-Pools (z.B. le_leberschutz) bleibt dies immer 0. */
  nat: number;
  npa: number;
}

export interface EquipmentEntry {
  id: string;
  family: 'weapon' | 'shield' | 'preisliste' | 'artefakt' | 'ammo' | 'fernkampfwaffe' | 'feuerwaffe' | 'alchemika';
  baseTable: string;
  baseId: string;
  selections: Record<string, string>;
  quantity: number;
  computedPriceSnapshot?: number;
  computedStatsSnapshot?: Record<string, number>;
}

/**
 * Ein ausgeruestetes Ruestungsteil in genau einem festen Slot (Regel Nutzer 2026-07-17:
 * "im character state muss die ruestung erfasst werden" + "feste Slots: TZ-Gruppe x Lage").
 * Slot-Key = `${gruppe}:${lage}` (siehe ruestungSlotKey) - jede der 4 TZ-Gruppen (Kopf/Torso/
 * Arme/Beine) hat 5 Lage-Slots (1-5, Lage 0 "Kleidung" bewusst NICHT modelliert, da RS/RH dort
 * immer 0 sind und daher keine Kaufoption braucht). Ausruesten ueberschreibt einen belegten
 * Slot, nie zwei Teile gleichzeitig in derselben Lage+Zone.
 */
export interface RuestungSlotEntry {
  basisSourceRow: number;
  verarbeitungSourceRow: number;
  anpassungSourceRow: number;
  computedPriceSnapshot: number;
  computedStatsSnapshot: { rs: number; rh: number; verfuegbarkeitNw: number; verfuegbarkeitAw: number };
}

export function ruestungSlotKey(gruppe: RsGruppe, lage: number): string {
  return `${gruppe}:${lage}`;
}

/** Werte, die den Charakter AUSMACHEN (reine Identitaet/Flavor, kein Punktekauf-Bezug) -
 *  mit Nutzer 2026-07-17 geklaert. Nur name+spezies sind Pflicht, der Rest darf leer sein. */
export interface HerkunftSnapshot {
  name: string;
  region: string;
  /** Bei neu angelegten Charakteren immer gesetzt; nur verlustarm migrierte Altdaten koennen
   * ohne fruehere Welt-Auswahl voruebergehend keinen Wert besitzen. */
  welt?: Welt;
}

export interface CharacterHeader {
  name: string;
  spezies: string;
  /** Stabile Druckdaten: spaetere Umbenennung oder Loeschung des Orts veraendert die Herkunft
   * bereits angelegter Charaktere nicht. */
  herkunftOrtId?: string;
  herkunftSnapshot?: HerkunftSnapshot;
  beruf?: string;
  alter?: string;
  geburtstag?: string;
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
  /** Key ist entweder ein blosser Pool-Referenzname (z.B. `le_leberschutz`, kein Waffenbezug)
   *  oder `${poolReferenz}::${equipmentId}` fuer `nk_pool_*`-Referenzen (Kampf-Tab, 2026-07-20):
   *  Pool-Verteilung passiert seither PRO besessener Nahkampfwaffe, nicht mehr einmal pro Skill -
   *  mehrere Waffen mit derselben Spezialisierung teilen sich weiterhin ein gemeinsames Budget
   *  (siehe engine/characterSheet.ts's Aggregation ueber alle `${key}::*`-Geschwister-Keys).
   *  Unbewaffnet nutzt eine synthetische equipmentId (`'unbewaffnet'` bzw.
   *  `'unbewaffnet:<spezReferenz>'` fuer die bedingten Spezialisierungszeilen). */
  poolAllocations: Record<string, PoolAllocation>;
  equipment: EquipmentEntry[];
  /** Ausgeruestete Ruestung, ein Eintrag je belegtem Slot (`${gruppe}:${lage}` - siehe
   *  ruestungSlotKey). Getrennt von `equipment`, da Ruestung an feste Slots gebunden ist,
   *  waehrend `equipment` eine freie Liste ohne Zonen-/Lagen-Beschraenkung bleibt. */
  ruestungSlots: Record<string, RuestungSlotEntry>;
  /** Pro Talent mit Grundfertigkeit-Auswahl (aktuell nur `ki_meister_der_grundfertigkeiten`) die
   *  fest gewaehlten Grundfertigkeit-Referenzen, ein Array-Index je freigeschaltetem Slot (Slot-
   *  Anzahl skaliert mit dem TaW des Talents selbst, siehe ki.ts's grundfertigkeitSlotCount). */
  grundfertigkeitAuswahl: Record<string, string[]>;
}

/**
 * Start-Budget-Pakete bei Charaktererstellung (mit Nutzer 2026-07-17 geklaert, nach
 * anfaenglicher Verwechslung von EP und SP korrigiert):
 * SP wird IMMER als 6490+EP-ausgegebeneSP berechnet (siehe characterSheet.ts) - die 6490
 * sind KEIN separater Startwert hier, sondern stecken schon in der SP-Formel selbst (davon
 * 90 SP fuer Muttersprache+Kultur, die nicht mehr als Sonderfall kostenlos sind, siehe dort).
 * - normal: EP=0 (Stufe 0, SP daher automatisch 6490), 5000 Dublonen.
 * - gehoben: EP=1600 (Stufe 15, SP daher automatisch 8090), 6000 Dublonen.
 */
export const STARTBUDGET_PRESETS = {
  normal: { epGesamt: 0, dublonen: 5000 },
  gehoben: { epGesamt: 1600, dublonen: 6000 },
} as const;
export type StartbudgetPreset = keyof typeof STARTBUDGET_PRESETS;

/**
 * "Durchschnittscharakter" (Nutzer 2026-07-17): jeder neue Charakter startet mit allen
 * Eigenschaften vorausgefuellt und Glueck=1 - das kostet ganz normal SP nach der bestehenden
 * Kosten-Tabelle. Seit werte 0.8 (Nutzer 2026-07-17, "Voelker-Maxima korrigiert, Minima und
 * Maxima anwenden"): der Fuellwert je Eigenschaft ist NICHT mehr pauschal 10, sondern das
 * Erstellungs-Min der gewaehlten Spezies (Sheet "Voelker-Maxima") - Fallback 10, falls die
 * Spezies dort nicht bekannt ist (z.B. reine Test-Fixtures).
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
  const parsed = JSON.parse(raw) as CharacterState & { heimat?: string; region?: string };
  // Herkunftsmigration: Das alte `region`-Feld enthielt technisch nur Alte/Neue Welt; der
  // alte Heimat-Freitext wird zum stabilen Ortsnamen. Eine geografische Region kann aus den
  // Altdaten nicht verlaesslich rekonstruiert werden und bleibt deshalb leer.
  if (!parsed.herkunftSnapshot && (parsed.heimat || parsed.region)) {
    const welt = parsed.region === 'Alte Welt' ? 'AW' : parsed.region === 'Neue Welt' ? 'NW' : undefined;
    parsed.herkunftOrtId = parsed.herkunftOrtId ?? `migration:${parsed.id}`;
    parsed.herkunftSnapshot = { name: parsed.heimat?.trim() || 'Unbekannter Ort', region: '', welt };
  }
  delete parsed.heimat;
  delete parsed.region;
  // Migrations-Fallback fuer bereits in localStorage gespeicherte Charaktere von vor dem
  // ruestungSlots-Feld (2026-07-17) - ohne das wirft computeSheet beim Laden alter Charaktere.
  if (!parsed.ruestungSlots) parsed.ruestungSlots = {};
  // Migrations-Fallback fuer Charaktere von vor dem grundfertigkeitAuswahl-Feld (2026-07-20).
  if (!parsed.grundfertigkeitAuswahl) parsed.grundfertigkeitAuswahl = {};
  // Angst-Referenzen wurden von vn_<stufenname>_<thema> auf das numerische, exklusiv
  // auswertbare Schema vn_angst_<thema>_<5|10|15|20|25|30> umgestellt. Bei alten, zuvor noch
  // gleichzeitig moeglichen Mehrfachauswahlen bleibt pro Thema deterministisch die hoechste
  // gewaehlte Stufe erhalten.
  const fearLevels: Record<string, number> = {
    unbehagen: 5,
    nervositaet: 10,
    furcht: 15,
    angst: 20,
    panik: 25,
    phobie: 30,
  };
  const migratedSelections: Record<string, number> = {};
  const fearSelections = new Map<string, { reference: string; value: number }>();
  for (const [reference, selected] of Object.entries(parsed.selections ?? {})) {
    const normalized = reference.toLowerCase();
    const currentMatch = /^vn_angst_(.+)_(5|10|15|20|25|30)$/.exec(normalized);
    const oldMatch = /^vn_(unbehagen|nervositaet|furcht|angst|panik|phobie)_(.+)$/.exec(normalized);
    if (!currentMatch && !oldMatch) {
      migratedSelections[normalized] = selected;
      continue;
    }
    const theme = currentMatch?.[1] ?? oldMatch![2];
    const value = currentMatch ? Number(currentMatch[2]) : fearLevels[oldMatch![1]];
    const migratedReference = `vn_angst_${theme}_${value}`;
    const existing = fearSelections.get(theme);
    if (!existing || value > existing.value) {
      fearSelections.set(theme, { reference: migratedReference, value });
    }
  }
  for (const { reference } of fearSelections.values()) migratedSelections[reference] = 1;
  parsed.selections = migratedSelections;
  return parsed;
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
    herkunftOrtId: header?.herkunftOrtId,
    herkunftSnapshot: header?.herkunftSnapshot,
    beruf: header?.beruf,
    alter: header?.alter,
    geburtstag: header?.geburtstag,
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
    ruestungSlots: {},
    grundfertigkeitAuswahl: {},
  };
  if (startbudget) {
    const preset = STARTBUDGET_PRESETS[startbudget];
    state.values['ep_gesamt'] = preset.epGesamt;
    state.values['dublonen_bank'] = preset.dublonen;
    for (const referenz of DURCHSCHNITT_EIGENSCHAFTEN) {
      const grenzen = getEigenschaftGrenzen(state.spezies, referenz, 0);
      state.values[referenz] = grenzen?.min ?? 10;
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
