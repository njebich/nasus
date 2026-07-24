// SP-Kosten pro TaW-Punkt fuer Nahkampf-/Fernkampf-Spezialisierungen (Nutzer 2026-07-22: Rate
// 15/8/4 SP je Investitions-Rang fuer Nahkampf, 10/5/3 fuer Fernkampf - siehe views/categoryView.ts
// renderWaffenControlCells fuer die Anzeige). Bis 2026-07-24 war das reine UI-Deko (costOverride):
// weder die Hauptfertigkeit noch ihre Spezialisierungen hatten ein Kosten-Feld in der xlsx, die
// Rate floss also nie tatsaechlich in spSpent ein (User-Bugreport 2026-07-24: "TaW und
// Spezialisierungen ziehen kein SP ab"). Dieses Modul ist jetzt die einzige Quelle der Rate,
// von characterSheet.ts (echte Kosten) UND categoryView.ts (Anzeige) gleichermassen genutzt.

import { RULES, type RuleEntry } from '../data/rules';
import { findParentRule } from './rules';
import type { CharacterState } from '../state/characterStore';

export const NK_SPEZ_KOSTEN_RATES = [15, 8, 4] as const;
export const FK_SPEZ_KOSTEN_RATES = [10, 5, 3] as const;

interface SpezGruppe {
  rules: RuleEntry[];
  rates: readonly [number, number, number];
}

/** Statischer Index statt findChildRules() waehrend jedes computeSheet()-Durchlaufs.
 *  findChildRules() durchsucht fuer jedes Kind erneut das komplette Regelwerk und loest dabei
 *  fuer jede Regel wiederum den Parent per Vollscan auf. Bei 1.356 Regeln und 30 Waffen-
 *  Spezialisierungen erzeugte das zig Millionen Vergleiche pro Render und blockierte die UI
 *  mehrere Sekunden. Der Regelsatz ist zur Laufzeit unveraenderlich, daher reicht ein einmaliger
 *  Aufbau beim Laden dieses Moduls. */
const SPEZ_GRUPPE_BY_REFERENZ = new Map<string, SpezGruppe>();
const gruppenByParent = new Map<RuleEntry, SpezGruppe>();
for (const rule of RULES) {
  const key = rule.referenz.toLowerCase();
  const isNk = key.startsWith('nk_spez_');
  const isFk = key.startsWith('fk_spez_');
  if (!isNk && !isFk) continue;
  const parent = findParentRule(rule);
  if (!parent) continue;
  let gruppe = gruppenByParent.get(parent);
  if (!gruppe) {
    gruppe = { rules: [], rates: isNk ? NK_SPEZ_KOSTEN_RATES : FK_SPEZ_KOSTEN_RATES };
    gruppenByParent.set(parent, gruppe);
  }
  gruppe.rules.push(rule);
}
for (const gruppe of gruppenByParent.values()) {
  for (const rule of gruppe.rules) SPEZ_GRUPPE_BY_REFERENZ.set(rule.referenz.toLowerCase(), gruppe);
}

/** Kostensatz pro Spezialisierungs-"Slot" (Nutzer-Korrektur 2026-07-22, siehe frueherer Kommentar
 *  in categoryView.ts): eine bereits investierte Spezialisierung (TaW>0) behaelt fuer immer den
 *  Satz, zu dem sie als n-te investierte Spezialisierung angefangen wurde (Rang unter den
 *  INVESTIERTEN Geschwistern nach aktuellem TaW absteigend, Gleichstand per Listenreihenfolge) -
 *  rates[0] fuer die erste investierte, rates[1] fuer die zweite, rates[2] fuer alle weiteren.
 *  Noch unangetastete Spezialisierungen (TaW=0) zeigen dagegen, was der NAECHSTE neue Slot kosten
 *  wuerde. Arbeitet direkt auf character.values statt ComputedRule[], damit characterSheet.ts sie
 *  ohne Zirkelbezug (ComputedSheet haengt selbst von dieser Funktion ab) aufrufen kann. */
function computeRatesByReferenz(
  siblingReferenzen: string[], character: CharacterState, rates: readonly [number, number, number],
): Map<string, number> {
  const invested = siblingReferenzen
    .map((referenz, i) => ({ referenz, value: character.values[referenz.toLowerCase()] ?? 0, i }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value || a.i - b.i);
  const nextSlotRate = rates[Math.min(invested.length, rates.length - 1)];
  const map = new Map<string, number>();
  for (const referenz of siblingReferenzen) map.set(referenz.toLowerCase(), nextSlotRate);
  invested.forEach((r, rank) => map.set(r.referenz, rates[Math.min(rank, rates.length - 1)]));
  return map;
}

/** SP-Rate fuer EINE Spezialisierungs-Referenz, oder undefined wenn referenz weder nk_spez_ noch
 *  fk_spez_ als Praefix hat, oder keine aufloesbare Hauptfertigkeit besitzt. */
export function getWaffenSpezKostenRate(character: CharacterState, referenz: string): number | undefined {
  const key = referenz.toLowerCase();
  if (!key.startsWith('nk_spez_') && !key.startsWith('fk_spez_')) return undefined;
  const gruppe = SPEZ_GRUPPE_BY_REFERENZ.get(key);
  if (!gruppe) return undefined;
  return computeRatesByReferenz(
    gruppe.rules.map((rule) => rule.referenz),
    character,
    gruppe.rates,
  ).get(key);
}
