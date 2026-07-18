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
import { getTalentModifikatorBonus as talentModifikatorBonus } from './talenteModifikator';
import { getTalentFaktorBonus as talentFaktorBonus } from './talenteFaktor';
import { ruestungSlotKey, type CharacterState, type PoolAllocation, type RuestungSlotEntry } from '../state/characterStore';
import type { RsGruppe } from '../data/trefferzonen';
import type { Value } from './evaluator';

const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;

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
  /** Aufteilung von dublonenRemaining auf die beiden Wert-Felder (Regel Nutzer 2026-07-17:
   *  Kaeufe ziehen erst vom Bargeld, danach vom Bankguthaben ab) - rein abgeleitete Anzeige,
   *  dublonen_bar/dublonen_bank selbst bleiben unveraendert (Ausruestung bleibt einzige
   *  Quelle der Wahrheit fuer "ausgegeben", siehe dublonenSpent oben). */
  dublonenBarRemaining: number;
  dublonenBankRemaining: number;
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

function ruestungSlotEntries(character: CharacterState): RuestungSlotEntry[] {
  return Object.values(character.ruestungSlots);
}

export function makeValueSource(character: CharacterState): CharacterValueSource {
  return {
    getWert(referenz: string): number {
      const key = referenz.toLowerCase();
      if (key in character.values) return character.values[key];
      if (key in character.selections) return character.selections[key];
      return 0;
    },
    // rs_kopf/rs_torso/rs_arme/rs_beine (Regel Nutzer 2026-07-17): "SUMME(RS der 5
    // Ruestungslagen in Zone X)" - Summe der RS ueber alle 5 Lage-Slots dieser TZ-Gruppe.
    getRsGruppe(gruppe: RsGruppe): number {
      return RUESTUNG_LAGEN.reduce(
        (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rs ?? 0),
        0,
      );
    },
    // RHg (Regel Nutzer 2026-07-17): "Die RH aller Lagen und aller TZ wird addiert zur RH
    // gesamt RHg" - Summe der RH ueber ALLE Slots (alle 4 TZ-Gruppen x 5 Lagen zusammen).
    getRhGesamt(): number {
      return ruestungSlotEntries(character).reduce((sum, e) => sum + e.computedStatsSnapshot.rh, 0);
    },
    getTalentModifikatorBonus(referenz: string): number {
      return talentModifikatorBonus(character, referenz);
    },
    getTalentFaktorBonus(referenz: string): number {
      return talentFaktorBonus(character, referenz);
    },
  };
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
      try {
        // WICHTIG: kostenCurrent als eigene Anweisung VOR kostenNext zuweisen - kostenNext kann
        // am oberen Ende einer Kosten-Tabelle werfen (z.B. Wert 64->65 existiert nicht), und ein
        // Wurf darf das bereits erfolgreich berechnete kostenCurrent nicht verwerfen.
        result.kostenCurrent = Number(evalKostenFor(rule.referenz, currentValue, values));
        result.kostenNext = Number(evalKostenFor(rule.referenz, currentValue + 1, values));
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
  ) + ruestungSlotEntries(character).reduce((sum, e) => sum + e.computedPriceSnapshot, 0);
  const dublonenBar = character.values['dublonen_bar'] ?? 0;
  const dublonenBank = character.values['dublonen_bank'] ?? 0;
  const dublonenBarRemaining = Math.max(0, dublonenBar - dublonenSpent);
  const dublonenBankRemaining = dublonenBank - Math.max(0, dublonenSpent - dublonenBar);
  const epGesamt = character.values['ep_gesamt'] ?? 0;
  // SP = 6490 + EP - ausgegebene SP. Die 6490 ist eine feste Konstante IN DER FORMEL SELBST
  // (jeder Charakter bekommt sie, unabhaengig vom Startbudget-Preset), NICHT nur ein
  // Startwert - bestaetigt mit Nutzer 2026-07-17 nach anfaenglich falscher Gleichsetzung
  // SP=EP. War urspruenglich 6400; per Nutzer-Entscheidung 2026-07-17 um 90 SP erhoeht
  // (Kosten fuer Muttersprache=Stufe3/50 SP + Kultur=Stufe3/40 SP), im Gegenzug wurde der
  // vorherige Sonderfall "erste Sprache/Kultur kostenlos" (freieSpracheReferenz/
  // freieKulturReferenz) komplett entfernt - jede Sprache/Kultur wird jetzt normal bezahlt,
  // die erste ist implizit ueber die hoehere SP-Basis abgedeckt statt per Ausnahme.
  const spTotal = 6490 + epGesamt;
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
    dublonenBarRemaining,
    dublonenBankRemaining,
  };
}
