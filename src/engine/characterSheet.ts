// Vollstaendiges berechnetes Charakterblatt: reine Funktion (CharacterState) -> ComputedSheet.
// Kein Seiteneffekt, kein Speichern - das macht der aufrufende UI-Code via characterStore.
//
// Drei getrennte Waehrungen (mit Nutzer 2026-07-17 geklaert):
// - EP (Erfahrungspunkte): Lebenszeit-Gesamtsumme, speist die Stufe/Kreis-Tabelle.
// - SP (Steigerungspunkte) = ep_gesamt - (SP-Ausgaben). Bezahlt Eigenschaft, Attribute,
//   Grundfertigkeit, Sonderfertigkeit, WHK, Vor-/Nachteile.
// - TaP (Talentpunkte) = 20 + Stufe*5 (Referenz "talentpunkte"). Bezahlt AUSSCHLIESSLICH
//   die Kategorie "Talente" - komplett getrennter Pool von SP, waechst nur mit der Stufe.

import { RULES, type RuleEntry } from '../data/rules';
import { LOOKUP_TABLES } from '../data/lookups';
import { evalReferenz, evalKostenFor, type CharacterValueSource } from './rules';
import { getPoolCapBasis, computeGutMax, computeMeisterlichMax } from './poolCaps';
import { MUTTERSPRACHE_STUFE, VATERLAND_STUFE } from './voelker';
import type { CharacterState, PoolAllocation } from '../state/characterStore';
import type { Value } from './evaluator';

const TAP_KATEGORIE = 'Talente';

export interface PoolCaps {
  gatMax: number;
  gpaMax: number;
  matMax: number;
  mpaMax: number;
}

export interface ComputedRule {
  rule: RuleEntry;
  currentValue?: number;
  computedValue?: Value;
  /** Kosten in der fuer diese Kategorie zutreffenden Waehrung (SP ausser bei Talente: TaP). */
  kostenCurrent?: number;
  kostenNext?: number;
  selected?: boolean;
  kostenSelect?: number;
  /** Nur fuer Art='Fixwert': roher Referenztext (z.B. "0,3 m/s", "je nach Pferd, ca. 10-15"),
   *  KEIN Spielerwert und KEINE Formel - unveraendert anzeigen, nicht auswerten. */
  fixedText?: string;
  /** Nur fuer Art='Pool': aktuelle gAT/gPA/mAT/mPA-Zuteilung des Charakters. */
  poolAllocation?: PoolAllocation;
  /** Nur fuer Art='Pool', wenn eine Basis-Waffenart ableitbar ist (siehe poolCaps.ts). */
  poolCaps?: PoolCaps;
  /** Nur fuer Art='Pool': computedValue (Budget) minus Summe der aktuellen Zuteilung. */
  poolRemaining?: number;
  error?: string;
}

export interface ComputedSheet {
  characterId: string;
  byKategorie: Record<string, ComputedRule[]>;
  /** Lebenszeit-Gesamt-EP (informativ, speist Stufe/Kreis) - keine eigene Waehrung zum Ausgeben. */
  epGesamt: number;
  /** "EP ab"-Schwelle der naechsten Stufe (EP-Stufe-Kreis), undefined wenn bereits hoechste Stufe. */
  epNaechsteStufeAb?: number;
  spTotal: number;
  spSpent: number;
  spRemaining: number;
  tapTotal: number;
  tapSpent: number;
  tapRemaining: number;
  dublonenTotal: number;
  dublonenSpent: number;
  dublonenRemaining: number;
}

/** Kleinste "EP ab"-Schwelle oberhalb von epGesamt (naechste Stufe), oder undefined am Anschlag. */
function computeNextStufeThreshold(epGesamt: number): number | undefined {
  const rows = LOOKUP_TABLES['EP-Stufe-Kreis'] ?? [];
  let next: number | undefined;
  for (const row of rows) {
    const epAb = Number(row['EP ab']);
    if (epAb > epGesamt && (next === undefined || epAb < next)) next = epAb;
  }
  return next;
}

function makeValueSource(character: CharacterState): CharacterValueSource {
  return {
    getWert(referenz: string): number {
      const key = referenz.toLowerCase();
      if (key in character.values) return character.values[key];
      if (key in character.selections) return character.selections[key];
      return 0;
    },
  };
}

/**
 * Kostenlose Muttersprache/Kultur (siehe voelker.ts): Kosten der GRANT-Stufe selbst, die von
 * kostenCurrent/kostenNext abgezogen wird - 0 wenn diese Regel kein Grant ist (oder der
 * Freibetrag selbst nicht berechenbar ist, konservativ statt zu crashen).
 */
function computeFreibetrag(rule: RuleEntry, character: CharacterState, values: CharacterValueSource): number {
  try {
    if (rule.referenz === character.freieSpracheReferenz) {
      return Number(evalKostenFor(rule.referenz, MUTTERSPRACHE_STUFE, values));
    }
    if (rule.referenz === character.freieKulturReferenz) {
      return Number(evalKostenFor(rule.referenz, VATERLAND_STUFE, values));
    }
  } catch {
    // Freibetrag nicht berechenbar - konservativ 0 (keine Befreiung) statt zu crashen.
  }
  return 0;
}

function computeRule(rule: RuleEntry, character: CharacterState, values: CharacterValueSource): ComputedRule {
  const key = rule.referenz.toLowerCase();

  if (rule.art === 'Fixwert') {
    // Fester Referenzwert aus der xlsx (Zahl oder Text wie "0,3 m/s") - nicht spielerbearbeitbar,
    // nicht formelauswertbar, keine Kosten (siehe characterSheet.ts-Kommentar oben).
    return { rule, fixedText: rule.formelRaw };
  }

  if (rule.art === 'Wert') {
    const currentValue = character.values[key] ?? 0;
    const result: ComputedRule = { rule, currentValue };
    if (rule.kostenRaw) {
      // freibetrag > 0 nur wenn diese Regel der Sprache/Kultur-Grant des Charakters ist -
      // zieht dessen Kosten ab, statt komplett auf 0 zu setzen, damit ein spaeteres Steigern
      // ueber die Grant-Stufe hinaus weiterhin die echte Differenz kostet.
      const freibetrag = computeFreibetrag(rule, character, values);
      try {
        // WICHTIG: kostenCurrent als eigene Anweisung VOR kostenNext zuweisen - kostenNext kann
        // am oberen Ende einer Kosten-Tabelle werfen (z.B. Wert 64->65 existiert nicht), und ein
        // Wurf darf das bereits erfolgreich berechnete kostenCurrent nicht verwerfen.
        result.kostenCurrent = Math.max(0, Number(evalKostenFor(rule.referenz, currentValue, values)) - freibetrag);
        result.kostenNext = Math.max(0, Number(evalKostenFor(rule.referenz, currentValue + 1, values)) - freibetrag);
      } catch (err) {
        result.error = err instanceof Error ? err.message : String(err);
      }
    }
    return result;
  }

  if (rule.art === 'Auswahl') {
    const selected = (character.selections[key] ?? 0) > 0;
    const result: ComputedRule = { rule, selected };
    if (rule.kostenRaw) {
      try {
        result.kostenSelect = Number(evalKostenFor(rule.referenz, 1, values));
      } catch (err) {
        result.error = err instanceof Error ? err.message : String(err);
      }
    }
    return result;
  }

  if (rule.art === 'Formel' || rule.art === 'Lookup') {
    // Art=Lookup faellt hier mit rein: manche Lookup-Zeilen (stufe, kreis) haben trotzdem
    // eine echte Formel (SVERWEIS) in formelRaw - siehe rules.ts fuer die Auswertungslogik.
    // Zeilen ohne formelRaw werfen dort einen klaren Fehler statt stillschweigend 0 zu zeigen.
    try {
      return { rule, computedValue: evalReferenz(rule.referenz, values) };
    } catch (err) {
      return { rule, error: err instanceof Error ? err.message : String(err) };
    }
  }

  if (rule.art === 'Pool') {
    let computedValue: Value;
    try {
      computedValue = evalReferenz(rule.referenz, values);
    } catch (err) {
      return { rule, error: err instanceof Error ? err.message : String(err) };
    }

    const allocation = character.poolAllocations[key] ?? { gat: 0, gpa: 0, mat: 0, mpa: 0 };
    const allocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa;
    const result: ComputedRule = {
      rule,
      computedValue,
      poolAllocation: allocation,
      poolRemaining: Number(computedValue) - allocatedTotal,
    };

    const basis = getPoolCapBasis(rule.referenz);
    if (basis) {
      try {
        const nAt = Number(evalReferenz(basis.atReferenz, values));
        const nPa = Number(evalReferenz(basis.paReferenz, values));
        const gatMax = computeGutMax(nAt);
        const gpaMax = computeGutMax(nPa);
        result.poolCaps = {
          gatMax,
          gpaMax,
          matMax: computeMeisterlichMax(gatMax),
          mpaMax: computeMeisterlichMax(gpaMax),
        };
      } catch {
        // Basis-Waffenwert (at_X/pa_X) nicht auswertbar - Pool bleibt ohne Deckelungs-Anzeige,
        // Zuteilung ist dann nur durchs Budget selbst begrenzt (siehe characterMutations.ts).
      }
    }
    return result;
  }

  // Unerreichbar: alle Art-Werte sind oben behandelt. Nur als Typ-Absicherung.
  return { rule };
}

export function computeSheet(character: CharacterState): ComputedSheet {
  const values = makeValueSource(character);
  const byKategorie: Record<string, ComputedRule[]> = {};

  let spSpent = 0;
  let tapSpent = 0;
  for (const rule of RULES) {
    const computed = computeRule(rule, character, values);
    (byKategorie[rule.kategorie] ??= []).push(computed);

    const isTap = rule.kategorie === TAP_KATEGORIE;
    const kosten = (computed.kostenCurrent !== undefined && (computed.currentValue ?? 0) > 0)
      ? computed.kostenCurrent
      : (computed.selected && computed.kostenSelect !== undefined ? computed.kostenSelect : undefined);
    if (kosten !== undefined) {
      if (isTap) tapSpent += kosten; else spSpent += kosten;
    }
  }

  const dublonenSpent = character.equipment.reduce(
    (sum, e) => sum + (e.computedPriceSnapshot ?? 0) * e.quantity, 0,
  );
  const epGesamt = character.values['ep_gesamt'] ?? 0;
  // SP = 6400 + EP - ausgegebene SP. Die 6400 ist eine feste Konstante IN DER FORMEL SELBST
  // (jeder Charakter bekommt sie, unabhaengig vom Startbudget-Preset), NICHT nur ein
  // Startwert - bestaetigt mit Nutzer 2026-07-17 nach anfaenglich falscher Gleichsetzung
  // SP=EP. Bei "gehoben" (EP=1600, korrekt Stufe 15) ergibt das SP=6400+1600=8000.
  const spTotal = 6400 + epGesamt;
  const dublonenTotal = (character.values['dublonen_bank'] ?? 0) + (character.values['dublonen_bar'] ?? 0);

  let tapTotal = 0;
  try {
    tapTotal = Number(evalReferenz('talentpunkte', values));
  } catch {
    // stufe/kreis (transitive Abhaengigkeit von talentpunkte) noch nicht auswertbar -
    // z.B. bei einem ganz frischen Charakter ohne ep_gesamt. TaP bleibt dann 0.
  }

  return {
    characterId: character.id,
    byKategorie,
    epGesamt,
    epNaechsteStufeAb: computeNextStufeThreshold(epGesamt),
    spTotal,
    spSpent,
    spRemaining: spTotal - spSpent,
    tapTotal,
    tapSpent,
    tapRemaining: tapTotal - tapSpent,
    dublonenTotal,
    dublonenSpent,
    dublonenRemaining: dublonenTotal - dublonenSpent,
  };
}
