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
 *  statt eines stillschweigend falschen Budgets).
 *  Sonderfall seit 2026-07-22: die Spezialisierung "Unbewaffnet" (frueher "Ruestung", Nutzer-
 *  Umbenennung) ist textgleich mit ihrer eigenen Hauptfertigkeit "Unbewaffnet" - der Hauptfertigkeit-
 *  Match (`nk_pool_unbewaffnet`) wird deshalb explizit aus der Spezialisierung-Suche ausgeschlossen,
 *  sonst wuerde die dedizierte Zeile `nk_pool_unbewaffnet_unbewaffnet` (mit ihrem eigenen TaW-Term)
 *  nie gefunden und die 17 Ruestungs-Faustwaffen/Naturwaffen wuerden stillschweigend auf den
 *  generischen Fallback zurueckfallen. */
export function resolveWaffenPoolReferenz(hauptfertigkeit: string, spezialisierung: string): string {
  const pools = RULES.filter((r) => r.art === 'Pool' && r.kategorie === 'Nahkampf');
  const hauptMatch = pools.find((r) => r.beschreibung === `Pool ${hauptfertigkeit}`);
  const spezMatch = pools.find(
    (r) => r.beschreibung === `Pool ${spezialisierung}` && r.referenz !== hauptMatch?.referenz,
  );
  if (spezMatch) return spezMatch.referenz;
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
  kampfstilModifier: { at: number; pa: number } = { at: 0, pa: 0 },
): WeaponAtPaOverflow {
  const uncAtWeapon = uncappedBasis('at', hauptfertigkeit, values) + weaponAtBonus + kampfstilModifier.at;
  const uncPaWeapon = uncappedBasis('pa', hauptfertigkeit, values) + weaponPaBonus + kampfstilModifier.pa;
  return {
    uncAtWeapon,
    uncPaWeapon,
    natMax: Math.max(0, 20 - uncAtWeapon),
    npaMax: Math.max(0, 20 - uncPaWeapon),
    atOverflow: Math.max(0, uncAtWeapon - 20),
    paOverflow: Math.max(0, uncPaWeapon - 20),
  };
}

export const ZWEI_WAFFEN_WK_CAP: Record<number, number> = { 1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5 };

/** Hoechster besessener talente_kampf_mit_zwei_waffen_stufe_1-4 -> WK-Kappungswert
 *  (unmodifizierter Listenwert), sonst undefined (Talent nicht besessen). Verschoben aus
 *  views/kampf.ts (2026-07-22), damit engine/waffenLoadout.ts sie mitnutzen kann. */
export function getZweiWaffenCap(character: CharacterState): number | undefined {
  for (let stufe = 4; stufe >= 1; stufe--) {
    if ((character.selections[`talente_kampf_mit_zwei_waffen_stufe_${stufe}`] ?? 0) > 0) return ZWEI_WAFFEN_WK_CAP[stufe];
  }
  return undefined;
}

/** Permanenter Modifikator aus talente_offensiver_kampfstil_stufe_1-3 / talente_verteidiger_
 *  stufe_1-3 (Nutzer 2026-07-21: "permanent flat modifier", nicht Stufen-kumulativ - je Talent-
 *  Familie zaehlt nur die hoechste besessene Stufe, analog zu anderen Stufen-Talenten wie Kampf
 *  mit zwei Waffen, deren Stufe-3-Wirkung den Gesamtwert und nicht ein Delta beschreibt). Wirkt
 *  auf ALLE nAT/nPA-Formeln zugleich, siehe computeWeaponAtPaOverflow. */
export function getKampfstilModifier(character: CharacterState): { at: number; pa: number } {
  const stufe = (prefix: string): number => {
    if ((character.selections[`${prefix}_stufe_3`] ?? 0) > 0) return 3;
    if ((character.selections[`${prefix}_stufe_2`] ?? 0) > 0) return 2;
    if ((character.selections[`${prefix}_stufe_1`] ?? 0) > 0) return 1;
    return 0;
  };
  const offensiv = stufe('talente_offensiver_kampfstil');
  const verteidiger = stufe('talente_verteidiger');
  return { at: offensiv - verteidiger, pa: -offensiv + verteidiger };
}

function numOrZero(raw: string | undefined): number {
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** Schluessel sind character.spezies-Werte (VOELKER_NAMEN, siehe engine/voelker.ts), Werte die
 *  singularen Namen aus NK-Waffen-Basis's "Volk"-Spalte (Gnom/Ork/Troll/Zentaur/Katzenmensch).
 *  Ohne diese Uebersetzung matcht character.spezies ("Orks" etc.) nie einen Map-Key und jede
 *  Spezies faellt staendig auf den "andere Voelker"-Fallback zurueck (Bug, gefunden 2026-07-22).
 *  Bis 2026-07-22 trug die Basiszeile den Volk-Namen redundant im "Waffe"-Namen ("Unbewaffnet
 *  (Ork)" etc.) - der Nutzer liess das entfernen, seitdem heissen alle diese Zeilen schlicht
 *  "Unbewaffnet" und werden ueber die eigentliche "Volk"-Spalte disambiguiert. */
const UNBEWAFFNET_SPEZIES_VOLK: Record<string, string> = {
  Gnome: 'Gnom', Orks: 'Ork', Trolle: 'Troll', Zentauren: 'Zentaur', Katzen: 'Katzenmensch',
};
const UNBEWAFFNET_FALLBACK_VOLK = 'andere Voelker';

/** Basiszeile fuer die immer sichtbare "Unbewaffnet"-Reihe (blosse Faeuste, kein Item, keine
 *  Spezialisierung): art-spezifische Ruestungsmodifikator-Zeile je nach `spezies` (Nutzer-
 *  Datenkonvention in NK-Waffen-Basis), sonst der "andere Voelker"-Fallback. Name allein reicht
 *  nicht (mehrere Volk-Zeilen heissen "Unbewaffnet"), Volk allein auch nicht (die "Biss"/
 *  "Huftritt"-Zeilen teilen sich ein Volk mit ihrer "Unbewaffnet"-Zeile) - beides zusammen ist
 *  eindeutig. */
function findUnbewaffnetBasisRow(spezies: string) {
  const volk = UNBEWAFFNET_SPEZIES_VOLK[spezies] ?? UNBEWAFFNET_FALLBACK_VOLK;
  return NK_WAFFEN_BASIS.find(
    (r) => r['Hauptfertigkeit'] === 'Unbewaffnet' && r.name === 'Unbewaffnet' && r['Volk'] === volk,
  );
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
