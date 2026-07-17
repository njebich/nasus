// Punktekauf-Mutationen: validieren das EP/Dublonen-Budget VOR der Aenderung und werfen mit
// einem klaren Grund statt sie stillschweigend abzulehnen. Jede Funktion gibt einen NEUEN
// CharacterState zurueck (der Aufrufer speichert ihn danach via characterStore.saveCharacter) -
// bei Ablehnung wird geworfen und der ursprüngliche State bleibt unangetastet.

import { getRule } from '../engine/rules';
import { computeSheet } from '../engine/characterSheet';
import { previewPreislistePrice, previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { composeArmor } from '../engine/armorComposition';
import { MUTTERSPRACHE_STUFE, VATERLAND_STUFE } from '../engine/voelker';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import type { CharacterState, CharacterHeader, PoolAllocation, EquipmentEntry } from './characterStore';

export class BudgetError extends Error {}
export class MutationError extends Error {}

/** Aktualisiert die Charakterheader-Felder (Name/Spezies/Beruf/...) - reine Identitaet,
 *  kein Budget-Bezug, daher keine assertBudgetOk-Pruefung noetig. */
export function updateHeader(character: CharacterState, updates: Partial<CharacterHeader>): CharacterState {
  return { ...clone(character), ...updates };
}

/**
 * Kostenlose Muttersprache (Stufe "Muttersprache") + zugehoerige Kultur (Stufe "Vaterland") bei
 * Erschaffung - freie Wahl, nicht an die Spezies gekoppelt (Nutzer 2026-07-17, nach
 * "NN Sprachen 0.11.docx"). Kein Budget-Check: das ist explizit die kostenlose Ausnahme -
 * siehe characterSheet.ts, wo die Kosten dieser beiden Referenzen um den Freibetrag reduziert
 * werden. Ein vorheriger Grant wird beim Wechsel zurueckgesetzt (Wert entfernt).
 */
export function setFreieSpracheUndKultur(
  character: CharacterState, spracheReferenz: string | null, kulturReferenz: string | null,
): CharacterState {
  const candidate = clone(character);
  if (candidate.freieSpracheReferenz && candidate.freieSpracheReferenz !== spracheReferenz) {
    delete candidate.values[candidate.freieSpracheReferenz];
  }
  if (candidate.freieKulturReferenz && candidate.freieKulturReferenz !== kulturReferenz) {
    delete candidate.values[candidate.freieKulturReferenz];
  }
  if (spracheReferenz) candidate.values[spracheReferenz] = MUTTERSPRACHE_STUFE;
  if (kulturReferenz) candidate.values[kulturReferenz] = VATERLAND_STUFE;
  candidate.freieSpracheReferenz = spracheReferenz ?? undefined;
  candidate.freieKulturReferenz = kulturReferenz ?? undefined;
  return candidate;
}

function clone(character: CharacterState): CharacterState {
  return {
    ...character,
    values: { ...character.values },
    selections: { ...character.selections },
    poolAllocations: { ...character.poolAllocations },
    equipment: character.equipment.map((e) => ({ ...e, selections: { ...e.selections } })),
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

export function buyArmor(
  character: CharacterState, basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
): CharacterState {
  const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === basisSourceRow);
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === verarbeitungSourceRow);
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === anpassungSourceRow);
  if (!basis) throw new MutationError(`Ruestungsteil (Zeile ${basisSourceRow}) existiert nicht`);
  if (!verarbeitung) throw new MutationError(`Verarbeitung (Zeile ${verarbeitungSourceRow}) existiert nicht`);
  if (!anpassung) throw new MutationError(`Anpassung (Zeile ${anpassungSourceRow}) existiert nicht`);

  const composed = composeArmor(basis, verarbeitung, anpassung);

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'armor', baseTable: 'ruestung_basis', baseId: String(basisSourceRow),
    selections: { verarbeitung: String(verarbeitungSourceRow), anpassung: String(anpassungSourceRow) },
    quantity: 1, computedPriceSnapshot: composed.preis,
    computedStatsSnapshot: {
      rs: composed.rs, be: composed.be,
      verfuegbarkeitNw: composed.verfuegbarkeitNw, verfuegbarkeitAw: composed.verfuegbarkeitAw,
    },
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

export function buyShield(character: CharacterState, sourceRow: number): CharacterState {
  const row = NK_WAFFEN_BASIS.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`Schild (Zeile ${sourceRow}) existiert nicht`);
  if (row['Spezialisierung'] !== 'Schild') throw new MutationError(`'${row.name}' ist kein Schild`);

  const raw = row['Preis-Basis'];
  const price = raw !== undefined ? Number(raw.replace(',', '.')) : NaN;
  if (!Number.isFinite(price)) throw new MutationError(`Kein Preis-Basis fuer '${row.name}' hinterlegt`);

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'shield', baseTable: 'nk_waffen_basis', baseId: String(sourceRow),
    selections: {}, quantity: 1, computedPriceSnapshot: price,
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
