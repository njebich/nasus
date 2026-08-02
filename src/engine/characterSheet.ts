// Vollstaendiges berechnetes Charakterblatt: reine Funktion (CharacterState) -> ComputedSheet.
// Kein Seiteneffekt, kein Speichern - das macht der aufrufende UI-Code via characterStore.
//
// Drei getrennte Waehrungen (mit Nutzer 2026-07-17 geklaert):
// - EP (Erfahrungspunkte): Lebenszeit-Gesamtsumme, speist die Stufe/Kreis-Tabelle.
// - SP (Steigerungspunkte) = 6400 + ep_gesamt - (SP-Ausgaben). Bezahlt Eigenschaft, Attribute,
//   Grundfertigkeit, Sonderfertigkeit, WHK, Vor-/Nachteile.
// - TaP (Talentpunkte) = 20 + Stufe*5 (Referenz "talentpunkte"). Bezahlt AUSSCHLIESSLICH
//   die Kategorie "Talente" - komplett getrennter Pool von SP, waechst nur mit der Stufe.

import { RULES, type RuleEntry } from '../data/rules';
import { LOOKUP_TABLES } from '../data/lookups';
import { evalReferenz, evalKostenFor, type CharacterValueSource } from './rules';
import { getPoolCapBasis, computeGutMax, computeMeisterlichMax } from './poolCaps';
import { getTalentModifikatorBonus as talentModifikatorBonus } from './talenteModifikator';
import { getTalentFaktorBonus as talentFaktorBonus } from './talenteFaktor';
import { getArtefaktBonus as artefaktBonus } from './artefaktBonus';
import { getWaffenSpezKostenRate } from './waffenSpezKosten';
import { getWhkHauptfertigkeitKosten, getWhkSpezialisierungKosten } from './whkCustomSpezialisierung';
import { getEigenschaftGrenzen } from './eigenschaftenGrenzen';
import { getTalentMaximumBonus } from './talenteMaximum';
import { getSchlechteEigenschaftMax, hasSchlechteEigenschaft } from './schlechteEigenschaft';
import { ruestungSlotKey, type CharacterState, type PoolAllocation, type RuestungSlotEntry, type CustomWhkEintrag } from '../state/characterStore';
import type { RsGruppe } from '../data/trefferzonen';
import type { Value } from './evaluator';

const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;

const TAP_KATEGORIE = 'Talente';
const SSK_KATEGORIE = 'Sprache & Kultur';
export const SSK_MINDEST_SP = 90;

export interface CharacterValidationIssue {
  /** Bereich bzw. konkrete Regel, in der der Fehler behoben werden kann. */
  source: string;
  message: string;
}

export interface PoolCaps {
  gatMax: number;
  gpaMax: number;
  matMax: number;
  mpaMax: number;
}

export interface ComputedRule {
  rule: RuleEntry;
  currentValue?: number;
  /** Nur fuer Art='Wert', wenn ein Eigenschafts-/Attributs-Artefakt im Inventar liegt (Nutzer
   *  2026-07-19): currentValue + Artefakt-Bonus, zur "Basiswert (veraendert)"-Anzeige. Fliesst
   *  selbst NICHT in kostenCurrent/kostenNext ein - siehe rules.ts/artefaktBonus.ts. */
  alteredValue?: number;
  computedValue?: Value;
  /** Kosten in der fuer diese Kategorie zutreffenden Waehrung (SP ausser bei Talente: TaP). */
  kostenCurrent?: number;
  kostenNext?: number;
  /** Gesamtkosten bei currentValue-1 (nur wenn currentValue>0) - fuer den echten "Rueckerstattung"-
   *  Tooltip am "-"-Button (Nutzer-Entscheidung 2026-07-24: "Both buttons, real refund calc" statt
   *  eines symmetrisch gespiegelten kostenNext-Werts). kostenCurrent-kostenPrev ist der Preis, den
   *  der zuletzt gekaufte Punkt tatsaechlich gekostet hat. */
  kostenPrev?: number;
  selected?: boolean;
  kostenSelect?: number;
  /** Nur fuer Art='Fixwert': roher Referenztext (z.B. "0,3 m/s", "je nach Pferd, ca. 10-15"),
   *  KEIN Spielerwert und KEINE Formel - unveraendert anzeigen, nicht auswerten. */
  fixedText?: string;
  /** Nur fuer Art='Pool': aktuelle gAT/gPA/mAT/mPA-Zuteilung des Charakters. */
  poolAllocation?: PoolAllocation;
  /** Nur fuer Art='Pool', wenn eine Basis-Waffenart ableitbar ist (siehe poolCaps.ts). */
  poolCaps?: PoolCaps;
  /** Nur fuer Art='Pool': Budget (computedValue + weaponOverflowBudget) minus Summe der
   *  aktuellen Zuteilung. */
  poolRemaining?: number;
  /** Nur fuer `nk_pool_*`-Referenzen (Kampf-Tab, 2026-07-20): Summe aus
   *  computeNkPoolOverflowBudget - AT/PA-Ueberschuss ueber 20 besessener Waffen dieses Pools,
   *  der on top von computedValue ins Budget einfliesst (siehe waffenPool.ts). */
  weaponOverflowBudget?: number;
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
  /** In Sprache, Kultur und Schrift investierte SP. Fuer einen gueltigen Charakter muessen
   *  mindestens SSK_MINDEST_SP ausgegeben sein; bestimmte Stufen sind nicht vorgeschrieben. */
  sskSpent: number;
  sskMinimumMet: boolean;
  /** Neben den 90 SSK-SP muss mindestens eine echte Sprache auf Stufe 1+ beherrscht werden. */
  sskLanguageMinimumMet: boolean;
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
  /** Freie WHK-Hauptfertigkeiten/-Spezialisierungen (Punkt 4a/4b) - unveraendert aus character
   *  durchgereicht (keine eigene Berechnung noetig), damit views/categoryView.ts sie rendern kann,
   *  ohne zusaetzlich zum ComputedSheet auch noch das rohe CharacterState zu bekommen. */
  customWhkHauptfertigkeiten: CustomWhkEintrag[];
  customWhkSpezialisierungen: Record<string, CustomWhkEintrag[]>;
  /** Zentrale, fuer die Kopfzeilen-Warnung bestimmte Liste aller bekannten Regelverstoesse. */
  validationIssues: CharacterValidationIssue[];
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
    getArtefaktBonus(referenz: string): number {
      return artefaktBonus(character, referenz);
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
    if (rule.kategorie === 'Eigenschaft') {
      let kreis = 0;
      try {
        kreis = Number(evalReferenz('kreis', values));
      } catch {
        // ep_gesamt noch nicht auswertbar (z.B. ganz frischer Charakter) -> Kreis 0 annehmen.
      }
      const safeKreis = Number.isFinite(kreis) ? kreis : 0;
      const grenzen = getEigenschaftGrenzen(character.spezies, rule.referenz, safeKreis);
      if (hasSchlechteEigenschaft(character, rule.referenz)) {
        const max = getSchlechteEigenschaftMax(safeKreis);
        if (currentValue > max) {
          result.error = `'${rule.referenz}' ist durch den Nachteil "Schlechte Eigenschaft" auf ${max} gedeckelt (nicht übersteigerbar)`;
        }
      } else if (grenzen) {
        const effectiveMax = grenzen.max + getTalentMaximumBonus(character, rule.referenz, rule.kategorie);
        if (currentValue < grenzen.min || currentValue > effectiveMax) {
          result.error = `'${rule.referenz}' muss für ${character.spezies} zwischen ${grenzen.min} und ${effectiveMax} liegen`;
        }
      }
    }
    const artefaktBonusValue = values.getArtefaktBonus?.(rule.referenz) ?? 0;
    if (artefaktBonusValue > 0) result.alteredValue = currentValue + artefaktBonusValue;
    // Nahkampf-/Fernkampf-Spezialisierungen tragen keine eigene Kosten-Formel in der xlsx (siehe
    // waffenSpezKosten.ts-Kommentar) - ihr SP-Preis ist ein flacher, vom Investitions-Rang unter
    // den Geschwister-Spezialisierungen abhaengiger Satz statt einer SVERWEIS-Formel.
    const spezRate = getWaffenSpezKostenRate(character, rule.referenz);
    if (spezRate !== undefined) {
      result.kostenCurrent = currentValue * spezRate;
      result.kostenNext = (currentValue + 1) * spezRate;
      if (currentValue > 0) result.kostenPrev = (currentValue - 1) * spezRate;
      return result;
    }
    if (rule.kostenRaw) {
      try {
        result.kostenCurrent = Number(evalKostenFor(rule.referenz, currentValue, values));
      } catch (err) {
        const kostenError = err instanceof Error ? err.message : String(err);
        result.error = result.error ? `${result.error}; ${kostenError}` : kostenError;
      }
      try {
        result.kostenNext = Number(evalKostenFor(rule.referenz, currentValue + 1, values));
      } catch {
        // kein Preis-Tooltip fuer den naechsten Klick, wenn currentValue+1 nicht mehr in der
        // Kosten-Tabelle steht (z.B. SSK-Stufen 0-4, Punkt 5) - kein echter Fehler: der Wert
        // ist bereits am Maximum, der "+"-Button ist ohnehin per maxValue gesperrt (siehe
        // categoryView.ts sskMaxValue). Frueher landete dieser Wurf faelschlich in result.error
        // und zeigte ein Warn-Icon auf einer voellig gueltigen Stufe-4-Zeile.
      }
      if (currentValue > 0) {
        try {
          result.kostenPrev = Number(evalKostenFor(rule.referenz, currentValue - 1, values));
        } catch {
          // kein Rueckerstattungs-Tooltip, wenn currentValue-1 aus irgendeinem Grund nicht
          // auswertbar ist (z.B. Tabellenrand) - kostenCurrent/kostenNext bleiben davon unberuehrt.
        }
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

    // Kampf-Tab (2026-07-20, REVIDIERT 2026-07-23): nk_pool_*-Referenzen verteilen sich PRO
    // besessener Waffe (Key `${referenz}::${equipmentId}`). Bis 2026-07-22 aggregierte diese
    // Stelle ueber alle Geschwister-Waffen zu EINEM gemeinsamen Budget - das fuehrte dazu, dass
    // eine Waffe mit wenig eigenem AT/PA-Ueberschuss legitim (jede Einzel-Zuteilung fuer sich
    // validiert) so viel aus dem gemeinsamen Budget ausgeben konnte, wie eine Geschwister-Waffe
    // mit grossem Ueberschuss beisteuerte - die Pro-Zeile-PP-Anzeige (views/kampf.ts) rechnete
    // aber nur mit der EIGENEN Zuteilung gegen das volle Budget, wurde also negativ (Bug, User-
    // Repro 2026-07-23). Nutzer-Entscheidung: kein gemeinsames Budget mehr - jede Waffe hat ihr
    // EIGENES unabhaengiges Budget. Ein sheet-weiter Aggregatwert ergibt dafuer keinen Sinn mehr;
    // characterMutations.ts's setWaffenPoolAllocation und views/kampf.ts's poolFieldsForRow
    // rechnen beide direkt pro Waffe. Nicht-Waffen-Pools (z.B. le_leberschutz) bleiben unveraendert
    // bei ihrem einzelnen Flach-Key.
    const isWaffenPool = rule.referenz.toLowerCase().startsWith('nk_pool_');
    const result: ComputedRule = { rule, computedValue };
    if (!isWaffenPool) {
      const allocation = character.poolAllocations[key] ?? { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
      const allocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa + allocation.nat + allocation.npa;
      result.poolAllocation = allocation;
      result.poolRemaining = Number(computedValue) - allocatedTotal;
    }

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
  let sskSpent = 0;
  let tapSpent = 0;
  for (const rule of RULES) {
    const computed = computeRule(rule, character, values);
    (byKategorie[rule.kategorie] ??= []).push(computed);

    const isTap = rule.kategorie === TAP_KATEGORIE;
    const kosten = (computed.kostenCurrent !== undefined && (computed.currentValue ?? 0) > 0)
      ? computed.kostenCurrent
      : (computed.selected && computed.kostenSelect !== undefined ? computed.kostenSelect : undefined);
    if (kosten !== undefined) {
      if (isTap) {
        tapSpent += kosten;
      } else {
        spSpent += kosten;
        if (rule.kategorie === SSK_KATEGORIE) sskSpent += kosten;
      }
    }
  }

  // Frei benannte WHK-Hauptfertigkeiten/-Spezialisierungen (Punkt 4a/4b) haben keine eigene
  // RuleEntry und wurden daher von der RULES-Schleife oben nicht erfasst - separat aufaddieren.
  for (const h of character.customWhkHauptfertigkeiten ?? []) {
    spSpent += getWhkHauptfertigkeitKosten(h.wert);
  }
  for (const list of Object.values(character.customWhkSpezialisierungen ?? {})) {
    for (const s of list) spSpent += getWhkSpezialisierungKosten(s.wert);
  }

  const dublonenSpent = character.equipment.reduce(
    (sum, e) => sum + (e.computedPriceSnapshot ?? 0) * e.quantity, 0,
  ) + ruestungSlotEntries(character).reduce((sum, e) => sum + e.computedPriceSnapshot, 0);
  const dublonenBar = character.values['dublonen_bar'] ?? 0;
  const dublonenBank = character.values['dublonen_bank'] ?? 0;
  const dublonenBarRemaining = Math.max(0, dublonenBar - dublonenSpent);
  const dublonenBankRemaining = dublonenBank - Math.max(0, dublonenSpent - dublonenBar);
  const epGesamt = character.values['ep_gesamt'] ?? 0;
  // SP = 6400 + EP - ausgegebene SP. Die 6400 ist eine feste Konstante IN DER FORMEL SELBST
  // (jeder Charakter bekommt sie, unabhaengig vom Startbudget-Preset), NICHT nur ein
  // Startwert - bestaetigt mit Nutzer 2026-07-17 nach anfaenglich falscher Gleichsetzung
  // SP=EP. Sprache und Kultur bleiben regulär kostenpflichtig; statt Muttersprache und
  // Vaterland als harte Einzelanforderungen vorzuschreiben, wird weiter unten die Summe aller
  // SSK-Ausgaben gegen ein Mindestinvestment von 90 SP geprueft.
  const spTotal = 6400 + epGesamt;
  const dublonenTotal = (character.values['dublonen_bank'] ?? 0) + (character.values['dublonen_bar'] ?? 0);

  let tapTotal = 0;
  try {
    tapTotal = Number(evalReferenz('talentpunkte', values));
  } catch {
    // stufe/kreis (transitive Abhaengigkeit von talentpunkte) noch nicht auswertbar -
    // z.B. bei einem ganz frischen Charakter ohne ep_gesamt. TaP bleibt dann 0.
  }

  const sskLanguageMinimumMet = Object.entries(character.values)
    .some(([referenz, value]) => referenz.toLowerCase().startsWith('ssk_sprache_') && value > 0);
  const validationIssues: CharacterValidationIssue[] = [];
  if (spTotal - spSpent < 0) {
    validationIssues.push({ source: 'SP-Budget', message: `${spSpent - spTotal} SP zu viel ausgegeben` });
  }
  if (tapTotal - tapSpent < 0) {
    validationIssues.push({ source: 'TaP-Budget', message: `${tapSpent - tapTotal} TaP zu viel ausgegeben` });
  }
  if (dublonenTotal - dublonenSpent < 0) {
    validationIssues.push({
      source: 'Dublonen-Budget',
      message: `${Math.round((dublonenSpent - dublonenTotal) * 100) / 100} Dublonen zu viel ausgegeben`,
    });
  }
  if (sskSpent < SSK_MINDEST_SP) {
    validationIssues.push({
      source: 'SSK',
      message: `nur ${sskSpent} von mindestens ${SSK_MINDEST_SP} SP investiert`,
    });
  }
  if (!sskLanguageMinimumMet) {
    validationIssues.push({ source: 'SSK › Sprachen', message: 'keine Sprache auf Stufe 1 oder höher' });
  }
  for (const rows of Object.values(byKategorie)) {
    for (const row of rows) {
      if (row.rule.art === 'Pool' && row.poolRemaining !== undefined && row.poolRemaining < 0) {
        validationIssues.push({
          source: `${row.rule.kategorie} › ${row.rule.beschreibung ?? row.rule.referenz}`,
          message: `${Math.abs(row.poolRemaining)} Poolpunkte zu viel verteilt`,
        });
      }
      // Formel-/Lookup-Fehler sind technische Datenfehler. Charakterkonformität betrifft hier
      // die vom Spieler gesetzten Werte und Auswahlen; deren Fehler werden bereits an der Zeile gezeigt.
      if (!row.error || (row.rule.art !== 'Wert' && row.rule.art !== 'Auswahl')) continue;
      validationIssues.push({
        source: `${row.rule.kategorie} › ${row.rule.beschreibung ?? row.rule.referenz}`,
        message: row.error,
      });
    }
  }
  for (const entry of character.equipment) {
    if (!entry.invalidReason) continue;
    validationIssues.push({
      source: `Inventar › ${entry.displayNameSnapshot ?? entry.baseId}`,
      message: entry.invalidReason,
    });
  }

  return {
    characterId: character.id,
    byKategorie,
    epGesamt,
    epNaechsteStufeAb: computeNextStufeThreshold(epGesamt),
    spTotal,
    spSpent,
    spRemaining: spTotal - spSpent,
    sskSpent,
    sskMinimumMet: sskSpent >= SSK_MINDEST_SP,
    sskLanguageMinimumMet,
    tapTotal,
    tapSpent,
    tapRemaining: tapTotal - tapSpent,
    dublonenTotal,
    dublonenSpent,
    dublonenRemaining: dublonenTotal - dublonenSpent,
    dublonenBarRemaining,
    dublonenBankRemaining,
    customWhkHauptfertigkeiten: character.customWhkHauptfertigkeiten,
    customWhkSpezialisierungen: character.customWhkSpezialisierungen,
    validationIssues,
  };
}
