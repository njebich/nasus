// Punktekauf-Mutationen: validieren das EP/Dublonen-Budget VOR der Aenderung und werfen mit
// einem klaren Grund statt sie stillschweigend abzulehnen. Jede Funktion gibt einen NEUEN
// CharacterState zurueck (der Aufrufer speichert ihn danach via characterStore.saveCharacter) -
// bei Ablehnung wird geworfen und der ursprüngliche State bleibt unangetastet.

import { getRule, findParentRule, evalReferenz } from '../engine/rules';
import { computeSheet, makeValueSource } from '../engine/characterSheet';
import { getEigenschaftGrenzen } from '../engine/eigenschaftenGrenzen';
import { previewPreislistePrice, previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { composeArmor } from '../engine/armorComposition';
import { composeShield, istSchildKomponenteVerfuegbar } from '../engine/shieldComposition';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import type { RsGruppe } from '../data/trefferzonen';
import { ruestungSlotKey, type CharacterState, type CharacterHeader, type PoolAllocation, type EquipmentEntry } from './characterStore';

export class BudgetError extends Error {}
export class MutationError extends Error {}

/** Aktualisiert die Charakterheader-Felder (Name/Spezies/Beruf/...) - reine Identitaet,
 *  kein Budget-Bezug, daher keine assertBudgetOk-Pruefung noetig. */
export function updateHeader(character: CharacterState, updates: Partial<CharacterHeader>): CharacterState {
  return { ...clone(character), ...updates };
}

function clone(character: CharacterState): CharacterState {
  return {
    ...character,
    values: { ...character.values },
    selections: { ...character.selections },
    poolAllocations: { ...character.poolAllocations },
    equipment: character.equipment.map((e) => ({ ...e, selections: { ...e.selections } })),
    ruestungSlots: { ...character.ruestungSlots },
  };
}

function assertBudgetOk(candidate: CharacterState): void {
  const sheet = computeSheet(candidate);
  if (sheet.spRemaining < 0) {
    throw new BudgetError(`Nicht genug SP: benoetigt ${sheet.spSpent}, verfuegbar ${sheet.spTotal}`);
  }
  if (sheet.tapRemaining < 0) {
    throw new BudgetError(`Nicht genug TaP: benoetigt ${sheet.tapSpent}, verfuegbar ${sheet.tapTotal}`);
  }
  if (sheet.dublonenRemaining < 0) {
    throw new BudgetError(`Nicht genug Dublonen: benoetigt ${sheet.dublonenSpent}, verfuegbar ${sheet.dublonenTotal}`);
  }
}

export function setValue(character: CharacterState, referenz: string, wert: number): CharacterState {
  const rule = getRule(referenz);
  if (!rule) throw new MutationError(`Referenz '${referenz}' existiert nicht`);
  if (rule.art !== 'Wert') {
    throw new MutationError(`'${referenz}' ist Art='${rule.art}', kein direkt setzbarer Wert`);
  }
  if (wert < 0) throw new MutationError('Wert darf nicht negativ sein');

  // Regel (Nutzer 2026-07-17): eine Spezialisierung darf hoechstens so hoch sein wie der TaW
  // ihrer Hauptfertigkeit - deckt implizit auch "Spezialisierung erst ab TaW>0 verfuegbar" ab,
  // da bei Hauptfertigkeit=0 bereits jeder Wert>0 den Deckel 0 ueberschreitet.
  const parentRule = findParentRule(rule);
  if (parentRule) {
    const parentWert = character.values[parentRule.referenz.toLowerCase()] ?? 0;
    if (wert > parentWert) {
      throw new MutationError(
        `'${rule.referenz}' darf nicht hoeher sein als die Hauptfertigkeit '${parentRule.referenz}' (TaW ${parentWert})`,
      );
    }
  }

  // Regel (Nutzer 2026-07-17, werte 0.8 / Sheet "Voelker-Maxima"): Eigenschaften sind je nach
  // Spezies auf ein Min/Max begrenzt - Max ist Erstellungs-Max bis Kreis 3, danach einheitlich
  // 31 ("Max ab Kreis 3"). Unbekannte Spezies (z.B. Test-Fixtures) -> keine Einschraenkung.
  if (rule.kategorie === 'Eigenschaft') {
    let kreis = 0;
    try {
      kreis = Number(evalReferenz('kreis', makeValueSource(character)));
    } catch {
      // ep_gesamt noch nicht auswertbar (z.B. ganz frischer Charakter) -> Kreis 0 annehmen.
    }
    const grenzen = getEigenschaftGrenzen(character.spezies, rule.referenz, Number.isFinite(kreis) ? kreis : 0);
    if (grenzen && (wert < grenzen.min || wert > grenzen.max)) {
      throw new MutationError(
        `'${rule.referenz}' muss fuer ${character.spezies} zwischen ${grenzen.min} und ${grenzen.max} liegen`,
      );
    }
  }

  const candidate = clone(character);
  if (wert === 0) {
    delete candidate.values[rule.referenz.toLowerCase()];
  } else {
    candidate.values[rule.referenz.toLowerCase()] = wert;
  }
  assertBudgetOk(candidate);
  return candidate;
}

export function addSelection(character: CharacterState, referenz: string): CharacterState {
  const rule = getRule(referenz);
  if (!rule) throw new MutationError(`Referenz '${referenz}' existiert nicht`);
  if (rule.art !== 'Auswahl') throw new MutationError(`'${referenz}' ist Art='${rule.art}', keine Auswahl`);

  const candidate = clone(character);
  candidate.selections[rule.referenz.toLowerCase()] = 1;
  assertBudgetOk(candidate);
  return candidate;
}

export function removeSelection(character: CharacterState, referenz: string): CharacterState {
  const rule = getRule(referenz);
  if (!rule) throw new MutationError(`Referenz '${referenz}' existiert nicht`);

  const candidate = clone(character);
  delete candidate.selections[rule.referenz.toLowerCase()];
  return candidate; // Entfernen macht das Budget nie schlechter, keine Pruefung noetig
}

export function setPoolAllocation(character: CharacterState, referenz: string, allocation: PoolAllocation): CharacterState {
  const rule = getRule(referenz);
  if (!rule) throw new MutationError(`Referenz '${referenz}' existiert nicht`);
  if (rule.art !== 'Pool') throw new MutationError(`'${referenz}' ist Art='${rule.art}', kein Pool`);
  if (allocation.gat < 0 || allocation.gpa < 0 || allocation.mat < 0 || allocation.mpa < 0) {
    throw new MutationError('Pool-Zuteilung darf nicht negativ sein');
  }

  const candidate = clone(character);
  candidate.poolAllocations[rule.referenz.toLowerCase()] = allocation;

  const computed = computeSheet(candidate).byKategorie[rule.kategorie]?.find((r) => r.rule.referenz === rule.referenz);
  const budget = Number(computed?.computedValue ?? 0);
  const allocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa;
  if (allocatedTotal > budget) {
    throw new BudgetError(`Nicht genug Pool-Punkte: benoetigt ${allocatedTotal}, verfuegbar ${budget}`);
  }
  if (computed?.poolCaps) {
    const { gatMax, gpaMax, matMax, mpaMax } = computed.poolCaps;
    if (allocation.gat > gatMax) throw new BudgetError(`gAT ueberschreitet die Obergrenze (max ${gatMax})`);
    if (allocation.gpa > gpaMax) throw new BudgetError(`gPA ueberschreitet die Obergrenze (max ${gpaMax})`);
    if (allocation.mat > matMax) throw new BudgetError(`mAT ueberschreitet die Obergrenze (max ${matMax})`);
    if (allocation.mpa > mpaMax) throw new BudgetError(`mPA ueberschreitet die Obergrenze (max ${mpaMax})`);
  }

  return candidate;
}

function newEquipmentId(): string {
  return crypto.randomUUID();
}

export function buyPreislisteItem(character: CharacterState, sourceRow: number, quantity: number): CharacterState {
  const row = PREISLISTE.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`Preisliste-Eintrag (Zeile ${sourceRow}) existiert nicht`);
  if (quantity <= 0) throw new MutationError('Anzahl muss groesser als 0 sein');

  const unitPrice = previewPreislistePrice(row, 1);
  if (unitPrice === null) {
    throw new MutationError(`'${row.name}' ist nicht kaeuflich (kein Preis hinterlegt: "${row.preisRoh}")`);
  }

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'preisliste', baseTable: 'preisliste', baseId: String(sourceRow),
    selections: {}, quantity, computedPriceSnapshot: unitPrice,
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

export function buyArtefakt(
  character: CharacterState, referenz: string, grad: string, variant: ArtefaktVariant,
): CharacterState {
  const kostenRow = ARTEFAKT_KOSTEN.find((r) => r.referenz === referenz && r.grad === grad);
  if (!kostenRow) throw new MutationError(`Artefakt '${referenz}' Grad ${grad} existiert nicht`);

  const price = previewArtefaktPrice(kostenRow, variant);
  if (price === null) throw new MutationError(`Kein Preis fuer '${referenz}' Grad ${grad} (${variant}) hinterlegt`);

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'artefakt', baseTable: 'artefakt_kosten', baseId: String(kostenRow.sourceRow),
    selections: { variant }, quantity: 1, computedPriceSnapshot: price,
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

const RS_GRUPPEN: readonly RsGruppe[] = ['kopf', 'torso', 'arme', 'beine'];
const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;

/**
 * Ruestet ein Ruestungsteil in den festen Slot (TZ-Gruppe × Lage) aus - ueberschreibt einen
 * bereits belegten Slot (Regel Nutzer 2026-07-17: "feste Slots: TZ-Gruppe x Lage", pro Slot
 * immer nur EIN Teil). Lage 0 (Kleidung, immer RS/RH=0) hat bewusst keinen Slot - siehe
 * characterStore.ts. Die Basis-Zeile muss selbst zur angeforderten Lage gehoeren (kein
 * Lage-3-Ruestungsteil im Lage-5-Slot).
 */
export function equipRuestung(
  character: CharacterState, gruppe: RsGruppe, lage: number,
  basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
): CharacterState {
  if (!RS_GRUPPEN.includes(gruppe)) throw new MutationError(`Unbekannte TZ-Gruppe '${gruppe}'`);
  if (!RUESTUNG_LAGEN.includes(lage as (typeof RUESTUNG_LAGEN)[number])) {
    throw new MutationError(`Lage '${lage}' ist ungueltig (erlaubt: 1-5)`);
  }

  const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === basisSourceRow);
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === verarbeitungSourceRow);
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === anpassungSourceRow);
  if (!basis) throw new MutationError(`Ruestungsteil (Zeile ${basisSourceRow}) existiert nicht`);
  if (!verarbeitung) throw new MutationError(`Verarbeitung (Zeile ${verarbeitungSourceRow}) existiert nicht`);
  if (!anpassung) throw new MutationError(`Anpassung (Zeile ${anpassungSourceRow}) existiert nicht`);
  if (Number(basis['Lage']) !== lage) {
    throw new MutationError(`'${basis.name}' hat Lage ${basis['Lage']}, passt nicht in den Lage-${lage}-Slot`);
  }

  const composed = composeArmor(basis, verarbeitung, anpassung);

  const candidate = clone(character);
  candidate.ruestungSlots[ruestungSlotKey(gruppe, lage)] = {
    basisSourceRow, verarbeitungSourceRow, anpassungSourceRow,
    computedPriceSnapshot: composed.preis,
    computedStatsSnapshot: {
      rs: composed.rs, rh: composed.rh,
      verfuegbarkeitNw: composed.verfuegbarkeitNw, verfuegbarkeitAw: composed.verfuegbarkeitAw,
    },
  };
  assertBudgetOk(candidate);
  return candidate;
}

/** Entfernt ein ausgeruestetes Ruestungsteil aus seinem Slot - macht das Budget nie schlechter,
 *  keine Pruefung noetig (analog removeEquipment/removeSelection). No-op, wenn der Slot leer ist. */
export function unequipRuestung(character: CharacterState, gruppe: RsGruppe, lage: number): CharacterState {
  const candidate = clone(character);
  delete candidate.ruestungSlots[ruestungSlotKey(gruppe, lage)];
  return candidate;
}

/**
 * Kauft ein Schild, komponiert aus Basis x Material x Fertigung x Bespannung (Regel Nutzer
 * 2026-07-17: "die haben auch Anpassung"). Schild-RS wird bewusst NICHT in rs_arme eingerechnet
 * (Regel Nutzer 2026-07-17: "Rüstung wird immer für beide Arme gekauft ... lassen wir den
 * Schild also aus der Basis-RS-Berechnung raus" - die Anrechnung auf den linken Arm bei
 * misslungener Parade ist Kampfmodul-Scope), bleibt aber im computedStatsSnapshot sichtbar.
 */
export function buyShield(
  character: CharacterState, sourceRow: number,
  materialSourceRow: number, fertigungSourceRow: number, bespannungSourceRow: number,
): CharacterState {
  const row = NK_WAFFEN_BASIS.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`Schild (Zeile ${sourceRow}) existiert nicht`);
  if (row['Spezialisierung'] !== 'Schild') throw new MutationError(`'${row.name}' ist kein Schild`);

  const material = SCHILD_MATERIAL.find((r) => r.sourceRow === materialSourceRow);
  const fertigung = SCHILD_FERTIGUNG.find((r) => r.sourceRow === fertigungSourceRow);
  const bespannung = SCHILD_BESPANNUNG.find((r) => r.sourceRow === bespannungSourceRow);
  if (!material) throw new MutationError(`Schild-Material (Zeile ${materialSourceRow}) existiert nicht`);
  if (!fertigung) throw new MutationError(`Schild-Fertigung (Zeile ${fertigungSourceRow}) existiert nicht`);
  if (!bespannung) throw new MutationError(`Schild-Bespannung (Zeile ${bespannungSourceRow}) existiert nicht`);
  if (!istSchildKomponenteVerfuegbar(material.name, character.spezies)) {
    throw new MutationError(`Material '${material.name}' ist nur fuer Zentauren verfuegbar`);
  }
  if (!istSchildKomponenteVerfuegbar(bespannung.name, character.spezies)) {
    throw new MutationError(`Bespannung '${bespannung.name}' ist nur fuer Zentauren verfuegbar`);
  }

  const composed = composeShield(row, material, fertigung, bespannung);
  if (composed.preis === null) {
    throw new MutationError(`Kein automatischer Preis fuer diese Kombination (Materialpreis liegt im Ermessen der Spielleitung)`);
  }

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'shield', baseTable: 'nk_waffen_basis', baseId: String(sourceRow),
    selections: {
      material: String(materialSourceRow), fertigung: String(fertigungSourceRow), bespannung: String(bespannungSourceRow),
    },
    quantity: 1, computedPriceSnapshot: composed.preis,
    computedStatsSnapshot: {
      rs: composed.rs, klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz,
      at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus, minStaerke: composed.minStaerke,
    },
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

export function removeEquipment(character: CharacterState, equipmentId: string): CharacterState {
  const candidate = clone(character);
  candidate.equipment = candidate.equipment.filter((e) => e.id !== equipmentId);
  return candidate; // Entfernen macht das Budget nie schlechter, keine Pruefung noetig
}
