// Ladezeit-Formel fuer Fernkampfwaffen (Nutzer-Diktat 2026-07-23, deckungsgleich mit dem
// Wirkungstext der sf_ladeschuetze_*-Sonderfertigkeiten in rules-jsonl/sonderfertigkeit.jsonl):
// "Ladezeit - (Ges.-Bon. + Ladeschuetze) / Ladezeit-Teiler", aufgerundet, Ergebnis nie unter 1.
// Einheit: gemaess SAVEPOINT-Talente-Wirkung-2026-07-18.md Regel #10 ist "Sekunde" in allen
// Talent-/SF-Wirkungstexten eine veraltete Bezeichnung, 1:1 ersetzt durch "KR (Kampfrunde)" - die
// rohen Ladezeit-Werte aus der xlsx (teils noch mit "sec"-Suffix beschriftet) werden NICHT
// umgerechnet, nur umbenannt.

import { aufrunden } from './functions';
import { evalReferenz, type CharacterValueSource } from './rules';

/** Ges.-Bon. (Geschicklichkeits-Bonus, referenz eig_bonus_k_geschicklichkeit). */
export function gesBonWert(values: CharacterValueSource): number {
  return Number(evalReferenz('eig_bonus_k_geschicklichkeit', values));
}

/** Kernformel, wiederverwendet fuer jede Waffenart/Ladetechnik: aufrunden((Ges.Bon+Ladeschuetze)/
 *  Teiler), von der Ladezeit abgezogen, Ergebnis nie unter 1 KR (Regeltext: "kann nicht unter eine
 *  Sekunde/KR fallen"). Teiler=0 (sollte in der Datenlage nicht vorkommen) -> keine Reduktion. */
export function ladezeitKr(ladezeit: number, teiler: number, gesBon: number, ladeschuetze: number): number {
  const reduktion = teiler !== 0 ? aufrunden((gesBon + ladeschuetze) / teiler, 0) : 0;
  return Math.max(1, ladezeit - reduktion);
}

/** Welche sf_ladeschuetze_*-Sonderfertigkeit fuer eine Feuerwaffe zaehlt, je Lademechanik:
 *  Vorderlader hat eine eigene SF; alle Hinterlader-Bauformen (Hinterlader, Klapplauf, Block-
 *  oder Scharnierverschluss - allesamt patronenbasiert) teilen sich "Ladeschuetze Patrone". */
export function feuerwaffenLadeschuetzeReferenz(lademechanik: string): string {
  return lademechanik === 'Vorderlader' ? 'sf_ladeschuetze_vorderlader' : 'sf_ladeschuetze_patrone';
}

function numOrUndefined(raw: string | undefined): number | undefined {
  if (raw === undefined) return undefined;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

/** Armbrust-Sonderfall (Nutzer 2026-07-23): eine "normale" Armbrust hat bis zu drei unabhaengige
 *  Ladetechniken (Hand/Geissfuss/Winde), jede mit eigener Mindeststaerke/Ladezeit/Teiler - gezeigt
 *  wird NUR die schnellste (kleinste KR-Zahl) Technik, die die erreichte Staerke tatsaechlich
 *  erfuellt; alle anderen bleiben verborgen. Eine "Repetier"-Armbrust (Magazin-Nachlader) hat
 *  stattdessen zwei IMMER gemeinsam gezeigte Werte - Repetieren (Einzelschuss aus dem Magazin) und
 *  Repetierer Nachladen (5-Bolzen-Magazin wechseln) - Format "R x KR / M x KR" (Nutzer-Vorgabe
 *  woertlich). Die beiden Faelle schliessen sich in der Datenlage gegenseitig aus (siehe
 *  project-fk-waffen-erfassung memory: Repetier-Zeilen lassen Hand/Geissfuss/Winde leer). */
export function computeArmbrustLadezeitLabel(
  basis: Record<string, string>, eigKStaerke: number, gesBon: number, ladeschuetze: number,
): string {
  const repLadezeit = numOrUndefined(basis['Ladetechnik Repetieren: Ladezeit']);
  if (repLadezeit !== undefined) {
    const repTeiler = numOrUndefined(basis['Ladetechnik Repetieren: Ladezeit-Teiler']) ?? 0;
    const repNachLadezeit = numOrUndefined(basis['Ladetechnik Repetierer Nachladen: Ladezeit']) ?? 0;
    const repNachTeiler = numOrUndefined(basis['Ladetechnik Nachladen: Ladezeit-Teiler']) ?? 0;
    const r = ladezeitKr(repLadezeit, repTeiler, gesBon, ladeschuetze);
    const m = ladezeitKr(repNachLadezeit, repNachTeiler, gesBon, ladeschuetze);
    return `R ${r} KR / M ${m} KR`;
  }

  const techniken = [
    { minStaerke: numOrUndefined(basis['Ladetechnik Hand: min.Stä']), ladezeit: numOrUndefined(basis['Ladetechnik Hand: Ladezeit']), teiler: numOrUndefined(basis['Ladetechnik Hand: Ladezeit-Teiler']) },
    { minStaerke: numOrUndefined(basis['Ladetechnik Geißfuß: min.Stä']), ladezeit: numOrUndefined(basis['Ladetechnik Geißfuß: Ladezeit']), teiler: numOrUndefined(basis['Ladetechnik Geißfuß: Ladezeit-Teiler']) },
    { minStaerke: numOrUndefined(basis['Ladetechnik Winde: min.Stä']), ladezeit: numOrUndefined(basis['Ladetechnik Winde: Ladezeit']), teiler: numOrUndefined(basis['Ladetechnik Winde: Ladezeit-Teiler']) },
  ];
  const eligible = techniken.filter(
    (t): t is { minStaerke: number; ladezeit: number; teiler: number | undefined } =>
      t.minStaerke !== undefined && t.ladezeit !== undefined && eigKStaerke >= t.minStaerke,
  );
  if (eligible.length === 0) return 'x';
  const best = Math.min(...eligible.map((t) => ladezeitKr(t.ladezeit, t.teiler ?? 0, gesBon, ladeschuetze)));
  return `${best} KR`;
}
