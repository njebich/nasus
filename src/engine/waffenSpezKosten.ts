// SP-Kosten pro TaW-Punkt fuer Nahkampf-/Fernkampf-Spezialisierungen (Nutzer 2026-07-22: Rate
// 15/8/4 SP je Investitions-Rang fuer Nahkampf, 10/5/3 fuer Fernkampf - siehe views/categoryView.ts
// renderWaffenControlCells fuer die Anzeige). Bis 2026-07-24 war das reine UI-Deko (costOverride):
// weder die Hauptfertigkeit noch ihre Spezialisierungen hatten ein Kosten-Feld in der xlsx, die
// Rate floss also nie tatsaechlich in spSpent ein (User-Bugreport 2026-07-24: "TaW und
// Spezialisierungen ziehen kein SP ab"). Dieses Modul ist jetzt die einzige Quelle der Rate,
// von characterSheet.ts (echte Kosten) UND categoryView.ts (Anzeige) gleichermassen genutzt.

import { getRule, findParentRule, findChildRules } from './rules';
import type { CharacterState } from '../state/characterStore';

export const NK_SPEZ_KOSTEN_RATES = [15, 8, 4] as const;
export const FK_SPEZ_KOSTEN_RATES = [10, 5, 3] as const;

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
  const rule = getRule(referenz);
  if (!rule) return undefined;
  const key = rule.referenz.toLowerCase();
  const isNk = key.startsWith('nk_spez_');
  const isFk = key.startsWith('fk_spez_');
  if (!isNk && !isFk) return undefined;
  const parent = findParentRule(rule);
  if (!parent) return undefined;
  const siblings = findChildRules(parent).map((r) => r.referenz);
  const rates = isNk ? NK_SPEZ_KOSTEN_RATES : FK_SPEZ_KOSTEN_RATES;
  return computeRatesByReferenz(siblings, character, rates).get(key);
}
