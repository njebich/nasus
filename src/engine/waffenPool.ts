// Kampf-Tab (2026-07-19/20): Hilfsfunktionen fuer die Pool-Aufloesung pro besessener
// Nahkampfwaffe. Zwei Zustaendigkeiten:
// 1. resolveWaffenPoolReferenz: welcher nk_pool_*-Eintrag "gehoert" zu einer Waffenzeile
//    (Hauptfertigkeit x Spezialisierung), per Text-Match auf die Pool-Beschreibung.
// 2. computeWeaponAtPaOverflow: die nAT/nPA-Mechanik - nAT/nPA sind mit Pool-Punkten aufwertbar,
//    aber hart bei 20 gedeckelt; der Ueberschuss einer Waffe, deren AT/PA-Basis sie OHNE
//    Pool-Punkte schon ueber 20 tragen wuerde, fliesst stattdessen als zusaetzliches Budget in
//    den Pool (siehe characterSheet.ts's Pool-Zweig).

import { RULES } from '../data/rules';
import { getRule, evalExpression, type CharacterValueSource } from './rules';
import { aufrunden } from './functions';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import type { CharacterState } from '../state/characterStore';

/** Text-Match gegen die Pool-Beschreibung: erst die Spezialisierung ("Pool Aexte"), sonst die
 *  Hauptfertigkeit ("Pool Hiebwaffen") - bestaetigt gegen die reale nahkampf.jsonl-Datenlage
 *  (z.B. "Pool Aexte", "Pool Armklingen"). Wirft, wenn keins von beidem existiert (klarer Fehler
 *  statt eines stillschweigend falschen Budgets). */
export function resolveWaffenPoolReferenz(hauptfertigkeit: string, spezialisierung: string): string {
  const pools = RULES.filter((r) => r.art === 'Pool' && r.kategorie === 'Nahkampf');
  const spezMatch = pools.find((r) => r.beschreibung === `Pool ${spezialisierung}`);
  if (spezMatch) return spezMatch.referenz;
  const hauptMatch = pools.find((r) => r.beschreibung === `Pool ${hauptfertigkeit}`);
  if (hauptMatch) return hauptMatch.referenz;
  throw new Error(
    `Kein Pool fuer Hauptfertigkeit '${hauptfertigkeit}' / Spezialisierung '${spezialisierung}' gefunden`,
  );
}

/** Streift die aeussere "MIN(20;...)"-Huelle von at_X/pa_X-Formeln ab, um an die ungedeckelte
 *  Basis heranzukommen (alle 10 Basis-Waffenart-Formeln in nahkampf.jsonl folgen exakt diesem
 *  Muster - siehe engine/rules.ts's evalExpression-Kommentar). Wirft bei Abweichung, statt eine
 *  falsche Zahl stillschweigend zu berechnen. */
function stripMin20(formelRaw: string, referenz: string): string {
  const match = /^MIN\(20;(.+)\)$/i.exec(formelRaw.trim());
  if (!match) throw new Error(`Erwartete "MIN(20;...)"-Formel fuer '${referenz}', erhalten: "${formelRaw}"`);
  return match[1];
}

function uncappedBasis(prefix: 'at' | 'pa', hauptfertigkeit: string, values: CharacterValueSource): number {
  const referenz = `${prefix}_${hauptfertigkeit.toLowerCase()}`;
  const rule = getRule(referenz);
  if (!rule?.formelRaw) throw new Error(`Referenz '${referenz}' existiert nicht oder hat keine Formel`);
  const raw = Number(evalExpression(stripMin20(rule.formelRaw, referenz), values));
  // Gleiche AUFRUNDEN-Konvention wie die normale (gedeckelte) Formel-Auswertung (siehe
  // rules.ts: "alle berechneten Werte werden IMMER auf ganze Zahlen aufgerundet") - fuer Werte
  // <=20 aendert das Kappen bei 20 nichts an dieser Rundung, daher bleibt die Anzeige konsistent.
  return aufrunden(raw, 0);
}

export interface WeaponAtPaOverflow {
  /** Ungedeckelter AT-Basiswert des Skills PLUS der Waffen-eigene AT-Bonus (meist negativ). */
  uncAtWeapon: number;
  uncPaWeapon: number;
  /** Maximal sinnvoll auf diese Zeile spendierbare nAT/nPA-Pool-Punkte (genug, um exakt 20 zu
   *  erreichen - siehe poolCaps.ts's computeGutMax/computeMeisterlichMax fuer das g/m-Pendant). */
  natMax: number;
  npaMax: number;
  /** Ueberschuss ueber 20, den die Waffe OHNE jede Pool-Zuteilung bereits mitbringt - fliesst als
   *  zusaetzliches Budget in den Pool dieser Waffe (siehe characterSheet.ts), statt verloren zu
   *  gehen (die Zeile selbst ist ja schon bei 20 gedeckelt und kann nichts mehr davon nutzen). */
  atOverflow: number;
  paOverflow: number;
}

export function computeWeaponAtPaOverflow(
  hauptfertigkeit: string, weaponAtBonus: number, weaponPaBonus: number, values: CharacterValueSource,
): WeaponAtPaOverflow {
  const uncAtWeapon = uncappedBasis('at', hauptfertigkeit, values) + weaponAtBonus;
  const uncPaWeapon = uncappedBasis('pa', hauptfertigkeit, values) + weaponPaBonus;
  return {
    uncAtWeapon,
    uncPaWeapon,
    natMax: Math.max(0, 20 - uncAtWeapon),
    npaMax: Math.max(0, 20 - uncPaWeapon),
    atOverflow: Math.max(0, uncAtWeapon - 20),
    paOverflow: Math.max(0, uncPaWeapon - 20),
  };
}

interface OwnedWeaponPoolEntry {
  equipmentId: string;
  poolReferenz: string;
  hauptfertigkeit: string;
  atBonus: number;
  paBonus: number;
}

/** Loest fuer jede besessene Nahkampfwaffe/jedes Schild (family='weapon'|'shield') Hauptfertigkeit
 *  + Pool-Referenz auf -
 *  einmal pro Waffe, unabhaengig von 1H/2H-Grip (siehe Grip-Handling-Kommentar im Plan: der
 *  AT-/PA-Bonus einer Waffe variiert nicht mit dem Griff, nur WK/Min-Staerke tun das). Waffen,
 *  deren Basiszeile nicht mehr existiert oder deren Pool sich nicht auflösen laesst (sollte bei
 *  intakten Speicherdaten nie vorkommen), werden defensiv uebersprungen statt die gesamte
 *  Charakterberechnung zu brechen. */
function ownedWeaponPoolEntries(character: CharacterState): OwnedWeaponPoolEntry[] {
  const out: OwnedWeaponPoolEntry[] = [];
  for (const e of character.equipment) {
    if (e.family !== 'weapon' && e.family !== 'shield') continue;
    const basis = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === e.baseId);
    const hauptfertigkeit = basis?.['Hauptfertigkeit'];
    if (!basis || !hauptfertigkeit) continue;
    let poolReferenz: string;
    try {
      poolReferenz = resolveWaffenPoolReferenz(hauptfertigkeit, basis['Spezialisierung'] ?? '');
    } catch {
      continue;
    }
    out.push({
      equipmentId: e.id, poolReferenz, hauptfertigkeit,
      atBonus: e.computedStatsSnapshot?.at ?? 0, paBonus: e.computedStatsSnapshot?.pa ?? 0,
    });
  }
  return out;
}

function numOrZero(raw: string | undefined): number {
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const UNBEWAFFNET_SPEZIES_BASIS_ROW: Record<string, string> = {
  Gnom: 'Unbewaffnet (Gnom)', Ork: 'Unbewaffnet (Ork)', Troll: 'Unbewaffnet (Troll)',
  Zentaur: 'Unbewaffnet (Zentaur)', Katzenmensch: 'Unbewaffnet (Katzenmensch)',
};
const UNBEWAFFNET_FALLBACK_BASIS_ROW = 'Unbewaffnet (andere Voelker)';

/** Basiszeile fuer die immer sichtbare "Unbewaffnet"-Reihe (blosse Faeuste, kein Item, keine
 *  Spezialisierung): art-spezifische Ruestungsmodifikator-Zeile je nach `spezies` (Nutzer-
 *  Datenkonvention in NK-Waffen-Basis), sonst der "andere Voelker"-Fallback. */
function findUnbewaffnetBasisRow(spezies: string) {
  const name = UNBEWAFFNET_SPEZIES_BASIS_ROW[spezies] ?? UNBEWAFFNET_FALLBACK_BASIS_ROW;
  return NK_WAFFEN_BASIS.find((r) => r['Hauptfertigkeit'] === 'Unbewaffnet' && r.name === name);
}

/** Eindeutig (1:1) einer `nk_spez_unbewaffnet_*`-Spezialisierung zuordenbare Kampfstil-Basiszeile
 *  (Boxen, Ringen etc. - kein eigenes gekauftes Item noetig, `Materialpreis-Faktor` fehlt in der
 *  Quelle). Bewusst NICHT vollstaendig: Armklingen/Messer/Peitschen/Schild haben mehrere echte
 *  Waffenvarianten (bereits ueber "jede besessene Waffe" abgedeckt) und Ruestung hat gar keine
 *  eindeutige Basiszeile - fuer diese vier bleibt resolveUnbewaffnetSpezRow bewusst `undefined`
 *  (keine synthetische Zeile), bis der Nutzer eine eindeutige Zuordnung vorgibt. */
const UNBEWAFFNET_SPEZ_BASIS_NAMEN: Record<string, string> = {
  nk_spez_unbewaffnet_boxen: 'Boxen',
  nk_spez_unbewaffnet_elfische_kunst_der_selbstverteidigung: 'Elfische Kunst der Selbstverteidigung',
  nk_spez_unbewaffnet_goblinische_kampfkunst: 'Goblinische Kampfkunst',
  nk_spez_unbewaffnet_katzenmenschen_kampfkunst: 'Katzenmenschen Kampfkunst',
  nk_spez_unbewaffnet_orkisch_raufen: "Orkisch' Raufen",
  nk_spez_unbewaffnet_ringen: 'Ringen',
  nk_spez_unbewaffnet_schattenkampf: 'Schattenkampf',
};

function resolveUnbewaffnetSpezRow(spezReferenz: string) {
  const name = UNBEWAFFNET_SPEZ_BASIS_NAMEN[spezReferenz.toLowerCase()];
  if (!name) return undefined;
  return NK_WAFFEN_BASIS.find((r) => r['Hauptfertigkeit'] === 'Unbewaffnet' && r['Spezialisierung'] === name);
}

export interface WaffenRowBasis {
  hauptfertigkeit: string;
  spezialisierung: string;
  atBonus: number;
  paBonus: number;
}

/**
 * Loest die Basiszeile fuer EINE Kampf-Tab-Zeile auf, identifiziert per `equipmentId` (bei
 * echten Waffen die normale `EquipmentEntry.id`, bei den synthetischen Unbewaffnet-Zeilen
 * `'unbewaffnet'` bzw. `'unbewaffnet:<spezReferenz>'` - siehe characterStore.ts's
 * poolAllocations-Kommentar). `undefined`, wenn sich nichts auflösen laesst (z.B. eine der vier
 * bewusst ausgesparten Unbewaffnet-Spezialisierungen ohne eindeutige Basiszeile, oder ein
 * equipmentId, der zu keiner besessenen Waffe mehr gehoert).
 */
export function resolveWaffenRowBasis(character: CharacterState, equipmentId: string): WaffenRowBasis | undefined {
  if (equipmentId === 'unbewaffnet') {
    const row = findUnbewaffnetBasisRow(character.spezies);
    if (!row) return undefined;
    return {
      hauptfertigkeit: 'Unbewaffnet', spezialisierung: row['Spezialisierung'] ?? '',
      atBonus: numOrZero(row['AT-Basis']), paBonus: numOrZero(row['PA-Basis']),
    };
  }
  if (equipmentId.startsWith('unbewaffnet:')) {
    const row = resolveUnbewaffnetSpezRow(equipmentId.slice('unbewaffnet:'.length));
    if (!row) return undefined;
    return {
      hauptfertigkeit: 'Unbewaffnet', spezialisierung: row['Spezialisierung'] ?? '',
      atBonus: numOrZero(row['AT-Basis']), paBonus: numOrZero(row['PA-Basis']),
    };
  }
  const entry = character.equipment.find((e) => e.id === equipmentId && (e.family === 'weapon' || e.family === 'shield'));
  if (!entry) return undefined;
  const basis = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === entry.baseId);
  if (!basis) return undefined;
  return {
    hauptfertigkeit: basis['Hauptfertigkeit'], spezialisierung: basis['Spezialisierung'] ?? '',
    atBonus: entry.computedStatsSnapshot?.at ?? 0, paBonus: entry.computedStatsSnapshot?.pa ?? 0,
  };
}

/** Zusaetzliches Pool-Budget durch Waffen, deren AT/PA-Basis sie OHNE jede Pool-Zuteilung schon
 *  ueber 20 traegt (characterSheet.ts's Pool-Zweig addiert dies auf evalReferenz(poolRaw) drauf -
 *  siehe nAT/nPA-Mechanik im Plan). Nur echte besessene Waffen zaehlen hier mit, NICHT die
 *  synthetischen Unbewaffnet-Spezialisierungszeilen (deren eigene natMax/npaMax werden separat
 *  pro Zeile in kampf.ts berechnet, tragen aber nichts zum gemeinsamen Budget bei - sie sind kein
 *  "besessenes Item" im Sinne des Plans). */
export function computeNkPoolOverflowBudget(
  poolReferenz: string, character: CharacterState, values: CharacterValueSource,
): number {
  let total = 0;
  for (const entry of ownedWeaponPoolEntries(character)) {
    if (entry.poolReferenz !== poolReferenz) continue;
    const overflow = computeWeaponAtPaOverflow(entry.hauptfertigkeit, entry.atBonus, entry.paBonus, values);
    total += overflow.atOverflow + overflow.paOverflow;
  }
  return total;
}
