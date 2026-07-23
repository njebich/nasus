// Punktekauf-Mutationen: validieren das EP/Dublonen-Budget VOR der Aenderung und werfen mit
// einem klaren Grund statt sie stillschweigend abzulehnen. Jede Funktion gibt einen NEUEN
// CharacterState zurueck (der Aufrufer speichert ihn danach via characterStore.saveCharacter) -
// bei Ablehnung wird geworfen und der ursprüngliche State bleibt unangetastet.

import { getRule, findParentRule, findChildRules, evalReferenz } from '../engine/rules';
import { computeSheet, makeValueSource } from '../engine/characterSheet';
import { getEigenschaftGrenzen } from '../engine/eigenschaftenGrenzen';
import { getFertigkeitBaseMax } from '../engine/fertigkeitenGrenzen';
import { getTalentMaximumBonus } from '../engine/talenteMaximum';
import { GEWEIHTER_TALENT_PREFIX, hasGeweihterTalent, isGeweihterReferenzErlaubt } from '../engine/geweihte';
import { previewPreislistePrice, previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { composeArmor } from '../engine/armorComposition';
import { composeShield, istSchildKomponenteVerfuegbar } from '../engine/shieldComposition';
import { composeWeapon, istWaffenKomponenteVerfuegbar } from '../engine/weaponComposition';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import { composeMunition } from '../engine/pfeilBolzenComposition';
import { composeFeuerwaffe, type FeuerwaffenSelections } from '../engine/feuerwaffenComposition';
import { computeWeaponAtPaOverflow, resolveWaffenRowBasis, getKampfstilModifier } from '../engine/waffenPool';
import { gutBudget, meisterlichBudget } from '../engine/poolCaps';
import { BOEGEN, ARMBRUST, PFEILE, BOLZEN, FEUERWAFFEN, type FernkampfRow } from '../data/equipment/fernkampf';
import { ALCHEMIKA } from '../data/equipment/alchemika';
import { FEUERWAFFEN_MUNITION_PREISE, type FeuerwaffenMunitionArt } from '../data/equipment/feuerwaffenMunition';
import type { RsGruppe } from '../data/trefferzonen';
import { listEligibleNahkampf1HWaffen, listEligibleSchilde, listEligiblePistolen } from '../engine/waffenLoadout';
import {
  ruestungSlotKey, type CharacterState, type CharacterHeader, type PoolAllocation, type EquipmentEntry,
  type WaffenLoadoutEntry, type WaffenLoadoutComboType,
} from './characterStore';

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
    grundfertigkeitAuswahl: Object.fromEntries(
      Object.entries(character.grundfertigkeitAuswahl ?? {}).map(([k, v]) => [k, [...v]]),
    ),
    waffenLoadouts: character.waffenLoadouts.map((l) => ({ ...l })),
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
  // Nur fuer Nahkampf/Fernkampf/WHK, wo 'parent' tatsaechlich "Spezialisierung ihrer
  // Hauptfertigkeit" bedeutet (Bugfix 2026-07-23): PSI nutzt dasselbe 'parent'-Feld fuer sein
  // Zauberbaum-Gate (mindestTaw, siehe psiBaumGating.ts) - dort ist z.B. Kryokinese.parent =
  // Telekinese, OHNE dass Kryokinese <= Telekinese gedeckelt sein soll (nur das Gate muss
  // erfuellt sein, kein Werte-Deckel). Reproduziert per Nutzer-Report: Telekinese=10 verhinderte
  // faelschlich Kryokinese>10 mit "darf nicht hoeher sein als die Hauptfertigkeit".
  const HAUPTFERTIGKEIT_SPEZIALISIERUNG_KATEGORIEN = new Set(['Nahkampf', 'Fernkampf', 'WHK']);
  if (HAUPTFERTIGKEIT_SPEZIALISIERUNG_KATEGORIEN.has(rule.kategorie)) {
    const parentRule = findParentRule(rule);
    if (parentRule) {
      const parentWert = character.values[parentRule.referenz.toLowerCase()] ?? 0;
      if (wert > parentWert) {
        throw new MutationError(
          `'${rule.referenz}' darf nicht hoeher sein als die Hauptfertigkeit '${parentRule.referenz}' (TaW ${parentWert})`,
        );
      }
    }

    // Regel (Nutzer 2026-07-22): umgekehrter Fall zum Deckel oben - eine Hauptfertigkeit darf
    // nicht unter den TaW einer ihrer bereits gesetzten Spezialisierungen gesenkt werden (sonst
    // waere die Spezialisierung im Widerspruch zur obigen Regel, ohne dass hier eine
    // Fehlermeldung erscheint).
    const childRules = findChildRules(rule);
    for (const child of childRules) {
      const childWert = character.values[child.referenz.toLowerCase()] ?? 0;
      if (childWert > wert) {
        throw new MutationError(
          `'${rule.referenz}' darf nicht unter den TaW der Spezialisierung '${child.referenz}' (${childWert}) gesenkt werden`,
        );
      }
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
    if (grenzen) {
      const effectiveMax = grenzen.max + getTalentMaximumBonus(character, rule.referenz, rule.kategorie);
      if (wert < grenzen.min || wert > effectiveMax) {
        throw new MutationError(
          `'${rule.referenz}' muss für ${character.spezies} zwischen ${grenzen.min} und ${effectiveMax} liegen`,
        );
      }
    }
  }

  // Regel (Nutzer 2026-07-18, im Zuge der Talente-Wirkung-Analyse): Grundfertigkeit/
  // Sonderfertigkeit/Nahkampf/Fernkampf/WHK/Spruchmagie/Attribute haben einen Basis-Maximalwert
  // (siehe fertigkeitenGrenzen.ts), den "Maximum"-Talente (talenteMaximum.ts) fuer einzelne
  // Referenzen/Kategorien/Zauberschulen erhoehen koennen. Vorher gab es hierfuer KEINE
  // Obergrenze - jede Kosten-Formel (z.B. "wert*9") war unbegrenzt gueltig.
  const fertigkeitBaseMax = getFertigkeitBaseMax(rule.kategorie);
  if (fertigkeitBaseMax !== undefined) {
    const effectiveMax = fertigkeitBaseMax + getTalentMaximumBonus(character, rule.referenz, rule.kategorie);
    if (wert > effectiveMax) {
      throw new MutationError(`'${rule.referenz}' darf das Maximum von ${effectiveMax} nicht überschreiten`);
    }
  }

  // Regel (Nutzer 2026-07-22, Geweihte-Feature): Karma bleibt auf 0 gedeckelt, solange kein
  // Geweihte-Gate-Talent gewaehlt ist ("rang 0"/Laie) - siehe engine/geweihte.ts.
  if (rule.referenz === 'att_karma' && wert > 0 && !hasGeweihterTalent(character)) {
    throw new MutationError(
      `'att_karma' erfordert ein Geweihte-Talent (Tab Talente, Gruppe "Geweihte")`,
    );
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

  // Regel (Nutzer 2026-07-22, Geweihte-Feature): ein Gate-Talent darf nur gekauft werden, wenn es
  // zur im Charakterheader gewaehlten Religion+Sekte passt - siehe engine/geweihte.ts.
  if (rule.referenz.toLowerCase().startsWith(GEWEIHTER_TALENT_PREFIX) && !isGeweihterReferenzErlaubt(rule.referenz, character.religion)) {
    throw new MutationError(
      `'${rule.referenz}' erfordert die passende Religion (Feld "Religion"/"Sekte" oben im Charakterheader)`,
    );
  }

  const candidate = clone(character);
  // Angststufen verwenden das Schema vn_angst_<thema>_<5|10|15|20|25|30>. Innerhalb eines
  // Angstthemas ist genau eine Stufe erlaubt; eine neue Auswahl ersetzt die bisherige.
  const fearMatch = /^vn_angst_(.+)_(5|10|15|20|25|30)$/i.exec(rule.referenz);
  if (fearMatch) {
    const fearGroup = fearMatch[1].toLowerCase();
    const sameFearGroup = new RegExp(`^vn_angst_${fearGroup}_(5|10|15|20|25|30)$`, 'i');
    for (const selectedReference of Object.keys(candidate.selections)) {
      if (sameFearGroup.test(selectedReference)) delete candidate.selections[selectedReference];
    }
  }
  // Geweihte-Gate-Talente sind gegenseitig exklusiv (Nutzer 2026-07-22: ein Charakter kann nicht
  // gleichzeitig Geweihter mehrerer Religionen sein - sonst waere Geweihtengrad/Wundertabellen-
  // Filterung mehrdeutig) - gleiche Struktur wie die Angststufen-Regel oben.
  if (rule.referenz.toLowerCase().startsWith(GEWEIHTER_TALENT_PREFIX)) {
    for (const selectedReference of Object.keys(candidate.selections)) {
      if (selectedReference.startsWith(GEWEIHTER_TALENT_PREFIX) && selectedReference !== rule.referenz.toLowerCase()) {
        delete candidate.selections[selectedReference];
      }
    }
  }
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

/** Setzt die fest gewaehlte Grundfertigkeit fuer einen Slot eines Talents mit Grundfertigkeit-
 *  Auswahl (aktuell nur 'Meister der Grundfertigkeiten', siehe grundfertigkeitAuswahl.ts). Eine
 *  Grundfertigkeit darf innerhalb desselben Talents nicht doppelt gewaehlt werden - eine
 *  Kollision entfernt die Auswahl aus ihrem bisherigen Slot (die Reihenfolge der Slots hat sonst
 *  keine Bedeutung). leer ('') loescht den Slot wieder. */
export function setGrundfertigkeitPick(
  character: CharacterState,
  talentReferenz: string,
  slotIndex: number,
  grundfertigkeitReferenz: string,
): CharacterState {
  const talentRule = getRule(talentReferenz);
  if (!talentRule) throw new MutationError(`Referenz '${talentReferenz}' existiert nicht`);
  if (grundfertigkeitReferenz) {
    const gfRule = getRule(grundfertigkeitReferenz);
    if (!gfRule || gfRule.kategorie !== 'Grundfertigkeit') {
      throw new MutationError(`'${grundfertigkeitReferenz}' ist keine Grundfertigkeit`);
    }
  }

  const candidate = clone(character);
  const key = talentReferenz.toLowerCase();
  const slots = [...(candidate.grundfertigkeitAuswahl[key] ?? [])];
  if (grundfertigkeitReferenz) {
    for (let i = 0; i < slots.length; i++) {
      if (i !== slotIndex && slots[i] === grundfertigkeitReferenz) slots[i] = '';
    }
  }
  while (slots.length <= slotIndex) slots.push('');
  slots[slotIndex] = grundfertigkeitReferenz;
  candidate.grundfertigkeitAuswahl[key] = slots;
  return candidate;
}

export function setPoolAllocation(character: CharacterState, referenz: string, allocation: PoolAllocation): CharacterState {
  const rule = getRule(referenz);
  if (!rule) throw new MutationError(`Referenz '${referenz}' existiert nicht`);
  if (rule.art !== 'Pool') throw new MutationError(`'${referenz}' ist Art='${rule.art}', kein Pool`);
  if (
    allocation.gat < 0 || allocation.gpa < 0 || allocation.mat < 0 || allocation.mpa < 0
    || allocation.nat < 0 || allocation.npa < 0
  ) {
    throw new MutationError('Pool-Zuteilung darf nicht negativ sein');
  }

  const previous = character.poolAllocations[rule.referenz.toLowerCase()]
    ?? { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
  const previousTotal = previous.gat + previous.gpa + previous.mat + previous.mpa + previous.nat + previous.npa;

  const candidate = clone(character);
  candidate.poolAllocations[rule.referenz.toLowerCase()] = allocation;

  const allocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa + allocation.nat + allocation.npa;
  // Eine Verringerung (Gesamtsumme sinkt oder bleibt gleich) darf NIE am Budget scheitern - sonst
  // saesse man in einem durch fremde Aenderungen (z.B. entferntes Kampfstil-Talent) ungueltig
  // gewordenen Zustand fest und koennte ihn nicht einmal durch Reduzieren wieder verlassen
  // (Nutzer-Bugreport 2026-07-23). Untergrenze bleibt die 0-Pruefung oben pro Feld.
  if (allocatedTotal > previousTotal) {
    const computed = computeSheet(candidate).byKategorie[rule.kategorie]?.find((r) => r.rule.referenz === rule.referenz);
    const budget = Number(computed?.computedValue ?? 0);
    if (allocatedTotal > budget) {
      throw new BudgetError(`Nicht genug Pool-Punkte: benoetigt ${allocatedTotal}, verfuegbar ${budget}`);
    }
    if (computed?.poolCaps) {
      const { gatMax, gpaMax, matMax, mpaMax } = computed.poolCaps;
      const [gatBudget, gpaBudget, matBudget, mpaBudget] = [gutBudget(gatMax), gutBudget(gpaMax), meisterlichBudget(matMax), meisterlichBudget(mpaMax)];
      if (allocation.gat > gatBudget) throw new BudgetError(`gAT ueberschreitet die Obergrenze (max ${gatBudget} Pool-Punkte, Gesamt-Ziel ${gatMax})`);
      if (allocation.gpa > gpaBudget) throw new BudgetError(`gPA ueberschreitet die Obergrenze (max ${gpaBudget} Pool-Punkte, Gesamt-Ziel ${gpaMax})`);
      if (allocation.mat > matBudget) throw new BudgetError(`mAT ueberschreitet die Obergrenze (max ${matBudget} Pool-Punkte, Gesamt-Ziel ${matMax})`);
      if (allocation.mpa > mpaBudget) throw new BudgetError(`mPA ueberschreitet die Obergrenze (max ${mpaBudget} Pool-Punkte, Gesamt-Ziel ${mpaMax})`);
    }
  }

  return candidate;
}

/**
 * Verteilt Pool-Punkte auf EINE besessene Nahkampfwaffe (oder eine synthetische Unbewaffnet-Zeile,
 * siehe resolveWaffenRowBasis) - Kampf-Tab (2026-07-20), Gegenstueck zu setPoolAllocation, aber
 * pro Waffe statt pro Skill. Bis 2026-07-22 teilten sich alle Waffen einer Spezialisierung ein
 * gemeinsames Budget (Aggregation ueber `${poolReferenz}::*` in characterSheet.ts) - das erlaubte
 * einer Waffe mit wenig eigenem AT/PA-Ueberschuss, legitim (jede Einzel-Zuteilung fuer sich
 * validiert) so viel auszugeben, wie eine Geschwister-Waffe mit grossem Ueberschuss beisteuerte,
 * waehrend die Pro-Zeile-PP-Anzeige in views/kampf.ts nur mit der EIGENEN Zuteilung rechnete und
 * dadurch negativ werden konnte (Bug, User-Repro 2026-07-23). Nutzer-Entscheidung: KEIN
 * gemeinsames Budget mehr - jede Waffe hat ihr EIGENES unabhaengiges Budget (Pool-Formel-Wert +
 * der eigene AT/PA-Ueberschuss ueber 20 GENAU DIESER Waffe). gAT/gPA/mAT/mPA UND nAT/nPA werden
 * daher alle gegen die eigene Zuteilung dieser Waffe geprueft, nicht gegen Geschwister-Waffen.
 */
export function setWaffenPoolAllocation(
  character: CharacterState, poolReferenz: string, equipmentId: string, allocation: PoolAllocation,
): CharacterState {
  const rule = getRule(poolReferenz);
  if (!rule) throw new MutationError(`Referenz '${poolReferenz}' existiert nicht`);
  if (rule.art !== 'Pool') throw new MutationError(`'${poolReferenz}' ist Art='${rule.art}', kein Pool`);
  if (
    allocation.gat < 0 || allocation.gpa < 0 || allocation.mat < 0 || allocation.mpa < 0
    || allocation.nat < 0 || allocation.npa < 0
  ) {
    throw new MutationError('Pool-Zuteilung darf nicht negativ sein');
  }

  const previous = character.poolAllocations[`${rule.referenz.toLowerCase()}::${equipmentId}`]
    ?? { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
  const previousTotal = previous.gat + previous.gpa + previous.mat + previous.mpa + previous.nat + previous.npa;

  const candidate = clone(character);
  candidate.poolAllocations[`${rule.referenz.toLowerCase()}::${equipmentId}`] = allocation;

  const allocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa + allocation.nat + allocation.npa;
  // Eine Verringerung (Gesamtsumme sinkt oder bleibt gleich) darf NIE am Budget scheitern - sonst
  // saesse man in einem durch fremde Aenderungen (z.B. entferntes Kampfstil-Talent, verkaufte
  // Waffe mit dadurch gesunkenem Ueberschuss) ungueltig gewordenen Zustand fest und koennte ihn
  // nicht einmal durch Reduzieren wieder verlassen (Nutzer-Bugreport 2026-07-23). Die tatsaechliche
  // Untergrenze pro Feld bleibt 0 (siehe Pruefung oben) - fuer nAT/nPA entspricht das dem
  // unmodifizierten uncAtWeapon/uncPaWeapon-Basiswert (inkl. Kampfstil-Modifikator).
  if (allocatedTotal > previousTotal) {
    const sheet = computeSheet(candidate);
    const computed = sheet.byKategorie[rule.kategorie]?.find((r) => r.rule.referenz === rule.referenz);

    const basis = resolveWaffenRowBasis(character, equipmentId);
    const overflow = basis
      ? computeWeaponAtPaOverflow(basis.hauptfertigkeit, basis.atBonus, basis.paBonus, makeValueSource(candidate), getKampfstilModifier(candidate))
      : undefined;
    const budget = Number(computed?.computedValue ?? 0) + (overflow ? overflow.atOverflow + overflow.paOverflow : 0);
    if (allocatedTotal > budget) {
      throw new BudgetError(`Nicht genug Pool-Punkte: benoetigt ${allocatedTotal}, verfuegbar ${budget}`);
    }
    if (computed?.poolCaps) {
      const { gatMax, gpaMax, matMax, mpaMax } = computed.poolCaps;
      const [gatBudget, gpaBudget, matBudget, mpaBudget] = [gutBudget(gatMax), gutBudget(gpaMax), meisterlichBudget(matMax), meisterlichBudget(mpaMax)];
      if (allocation.gat > gatBudget) throw new BudgetError(`gAT ueberschreitet die Obergrenze (max ${gatBudget} Pool-Punkte, Gesamt-Ziel ${gatMax})`);
      if (allocation.gpa > gpaBudget) throw new BudgetError(`gPA ueberschreitet die Obergrenze (max ${gpaBudget} Pool-Punkte, Gesamt-Ziel ${gpaMax})`);
      if (allocation.mat > matBudget) throw new BudgetError(`mAT ueberschreitet die Obergrenze (max ${matBudget} Pool-Punkte, Gesamt-Ziel ${matMax})`);
      if (allocation.mpa > mpaBudget) throw new BudgetError(`mPA ueberschreitet die Obergrenze (max ${mpaBudget} Pool-Punkte, Gesamt-Ziel ${mpaMax})`);
    }

    if (overflow) {
      if (allocation.nat > overflow.natMax) throw new BudgetError(`nAT ueberschreitet die Obergrenze (max ${overflow.natMax})`);
      if (allocation.npa > overflow.npaMax) throw new BudgetError(`nPA ueberschreitet die Obergrenze (max ${overflow.npaMax})`);
    }
  }

  return candidate;
}

function newEquipmentId(): string {
  return crypto.randomUUID();
}

export function buyPreislisteItem(character: CharacterState, sourceRow: number, quantity: number): CharacterState {
  const row = PREISLISTE.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`Preisliste-Eintrag (Zeile ${sourceRow}) existiert nicht`);
  if (quantity <= 0) throw new MutationError('Anzahl muss größer als 0 sein');

  const unitPrice = previewPreislistePrice(row, 1);
  if (unitPrice === null) {
    throw new MutationError(`'${row.name}' ist nicht käuflich (kein Preis hinterlegt: "${row.preisRoh}")`);
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

  const verfuegbarkeit = Number(variant === 'einmalig'
    ? kostenRow.verfuegbarkeitEinmalig
    : kostenRow.verfuegbarkeitPermanent);
  if (Number.isFinite(verfuegbarkeit) && verfuegbarkeit >= 5) {
    throw new MutationError(`'${referenz}' Grad ${grad} (${variant}) ist nicht verfügbar (Verfügbarkeit ${verfuegbarkeit})`);
  }

  const price = previewArtefaktPrice(kostenRow, variant);
  if (price === null) throw new MutationError(`Kein Preis für '${referenz}' Grad ${grad} (${variant}) hinterlegt`);

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

/** Verfuegbarkeit-Legende: 1=Immer ... 5=Fast nie ... 7=Einzigartig (Wuerfelwurf-basiert im
 *  Original, siehe Verfuegbarkeit-Legende-Sheet). Nutzer 2026-07-18: ab hier (inkl.) fuers
 *  Chargen-Tool als hart gesperrt behandeln, statt den Wuerfelwurf zu simulieren. */
const VERFUEGBARKEIT_SPERRE_AB = 5;

/** Wie die Ruestungs-Kaufsperre oben, aber pauschal statt Region(NW/AW)-abhaengig: Boegen/
 *  Armbrust/Pfeile/Bolzen haben nur eine einzige "Direkt beim Volk"-Verfuegbarkeit-Spalte, keinen
 *  NW/AW-Split wie Ruestung - Nutzer 2026-07-19 bestaetigt "Kaufsperre" trotzdem einzubauen, mit
 *  Reminder im Entwickeln-Sheet (Zeile 36), dass der Region-Split hier noch nachgeholt werden muss. */
function assertFernkampfVerfuegbar(stufe: number | undefined, name: string): void {
  if (stufe !== undefined && stufe >= VERFUEGBARKEIT_SPERRE_AB) {
    throw new MutationError(`'${name}' ist nicht verfügbar (Verfügbarkeit ${stufe})`);
  }
}

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
    throw new MutationError(`Lage '${lage}' ist ungültig (erlaubt: 1-5)`);
  }

  const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === basisSourceRow);
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === verarbeitungSourceRow);
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === anpassungSourceRow);
  if (!basis) throw new MutationError(`Rüstungsteil (Zeile ${basisSourceRow}) existiert nicht`);
  if (!verarbeitung) throw new MutationError(`Verarbeitung (Zeile ${verarbeitungSourceRow}) existiert nicht`);
  if (!anpassung) throw new MutationError(`Anpassung (Zeile ${anpassungSourceRow}) existiert nicht`);
  if (Number(basis['Lage']) !== lage) {
    throw new MutationError(`'${basis.name}' hat Lage ${basis['Lage']}, passt nicht in den Lage-${lage}-Slot`);
  }

  const composed = composeArmor(basis, verarbeitung, anpassung);

  // AW/NW kommt aus dem stabilen Herkunftssnapshot; das fruehere, irrefuehrend `region`
  // genannte Welt-Feld wurde entfernt.
  const welt = character.herkunftSnapshot?.welt;
  const verfuegbarkeit = welt === 'NW' ? composed.verfuegbarkeitNw
    : welt === 'AW' ? composed.verfuegbarkeitAw
    : undefined;
  if (verfuegbarkeit !== undefined && verfuegbarkeit >= VERFUEGBARKEIT_SPERRE_AB) {
    throw new MutationError(`'${basis.name}' ist in ${welt} nicht verfügbar (Verfügbarkeit ${verfuegbarkeit})`);
  }

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
    throw new MutationError(`Material '${material.name}' ist nur für Zentauren verfügbar`);
  }
  if (!istSchildKomponenteVerfuegbar(bespannung.name, character.spezies)) {
    throw new MutationError(`Bespannung '${bespannung.name}' ist nur für Zentauren verfügbar`);
  }

  const composed = composeShield(row, material, fertigung, bespannung);
  if (composed.preis === null) {
    throw new MutationError(`Kein automatischer Preis für diese Kombination (Materialpreis liegt im Ermessen der Spielleitung)`);
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

/**
 * Kauft eine Nahkampfwaffe, komponiert aus Basis x Material x Fertigung x Anpassung x
 * Schaftmaterial (Regel Nutzer 2026-07-18: "fang an damit, die nk-waffen inkl. herstellungs-
 * modifikatoren zu implementieren" - vormals nur Browse-Liste ohne Preis, siehe ausruestung.ts).
 * Manche Basis-Zeilen (unbewaffnete Kampfstile, Ruestungsmodifikatoren) haben keinen
 * Materialpreis-Faktor - dort ist kein automatischer Kauf moeglich (composeWeapon liefert preis=null).
 */
export function buyWeapon(
  character: CharacterState, sourceRow: number,
  materialSourceRow: number, fertigungSourceRow: number, anpassungSourceRow: number, schaftmaterialSourceRow: number,
): CharacterState {
  const row = NK_WAFFEN_BASIS.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`Waffe (Zeile ${sourceRow}) existiert nicht`);
  if (row['Spezialisierung'] === 'Schild') throw new MutationError(`'${row.name}' ist ein Schild, siehe buyShield`);

  const material = NK_MATERIAL.find((r) => r.sourceRow === materialSourceRow);
  const fertigung = NK_FERTIGUNG.find((r) => r.sourceRow === fertigungSourceRow);
  const anpassung = NK_ANPASSUNG.find((r) => r.sourceRow === anpassungSourceRow);
  const schaftmaterial = NK_SCHAFTMATERIAL.find((r) => r.sourceRow === schaftmaterialSourceRow);
  if (!material) throw new MutationError(`Material (Zeile ${materialSourceRow}) existiert nicht`);
  if (!fertigung) throw new MutationError(`Fertigung (Zeile ${fertigungSourceRow}) existiert nicht`);
  if (!anpassung) throw new MutationError(`Anpassung (Zeile ${anpassungSourceRow}) existiert nicht`);
  if (!schaftmaterial) throw new MutationError(`Schaftmaterial (Zeile ${schaftmaterialSourceRow}) existiert nicht`);
  if (!istWaffenKomponenteVerfuegbar(material, character.spezies)) {
    throw new MutationError(`Material '${material.name}' ist für '${character.spezies}' nicht verfügbar`);
  }
  if (!istWaffenKomponenteVerfuegbar(fertigung, character.spezies)) {
    throw new MutationError(`Fertigung '${fertigung.name}' ist für '${character.spezies}' nicht verfügbar`);
  }
  if (!istWaffenKomponenteVerfuegbar(anpassung, character.spezies)) {
    throw new MutationError(`Anpassung '${anpassung.name}' ist für '${character.spezies}' nicht verfügbar`);
  }
  if (!istWaffenKomponenteVerfuegbar(schaftmaterial, character.spezies)) {
    throw new MutationError(`Schaftmaterial '${schaftmaterial.name}' ist für '${character.spezies}' nicht verfügbar`);
  }

  const composed = composeWeapon(row, material, fertigung, anpassung, schaftmaterial);
  if (composed.preis === null) {
    throw new MutationError(`Kein automatischer Preis für '${row.name}' (kein Materialpreis-Faktor hinterlegt)`);
  }

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'weapon', baseTable: 'nk_waffen_basis', baseId: String(sourceRow),
    selections: {
      material: String(materialSourceRow), fertigung: String(fertigungSourceRow),
      anpassung: String(anpassungSourceRow), schaftmaterial: String(schaftmaterialSourceRow),
    },
    quantity: 1, computedPriceSnapshot: composed.preis,
    computedStatsSnapshot: {
      at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus,
      minStaerke1H: composed.minStaerke1H, minStaerke2H: composed.minStaerke2H,
      klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz, rezeptMod: composed.rezeptMod,
      rb: composed.rb,
    },
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

/**
 * Kauft eine fertige Fernkampfwaffe (Bogen/Armbrust) - anders als NK-Waffen/Schilde/Ruestung sind
 * Boegen/Armbrust bereits fertige Objekte mit festem Preis, keine Material/Fertigung/Anpassung-
 * Komposition (die Boegen/Armbrust-Sheets sind normalisierte, reine Wertetabellen ohne Bauteile-
 * System - siehe project-fk-waffen-erfassung memory).
 */
export function buyFernkampfwaffe(character: CharacterState, typ: 'boegen' | 'armbrust', sourceRow: number): CharacterState {
  const table = typ === 'boegen' ? BOEGEN : ARMBRUST;
  const row = table.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`${typ === 'boegen' ? 'Bogen' : 'Armbrust'} (Zeile ${sourceRow}) existiert nicht`);
  assertFernkampfVerfuegbar(row.verfuegbarkeitStufe, row.name);
  if (row.preisDublonen === undefined) {
    throw new MutationError(`'${row.name}' ist nicht käuflich (kein Preis hinterlegt: "${row['Preis'] ?? '?'}")`);
  }

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'fernkampfwaffe', baseTable: typ, baseId: String(sourceRow),
    selections: {}, quantity: 1, computedPriceSnapshot: row.preisDublonen,
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

/** Kauft eine aus Vorlage + Verarbeitung/Anpassung komponierte Feuerwaffe. Die
 * berechneten Werte und der Preis werden wie bei den anderen komponierten Gegenstaenden als
 * Snapshot gespeichert, damit spaetere Regelwerksupdates bestehende Inventare nicht umdeuten. */
export function buyFeuerwaffe(
  character: CharacterState, sourceRow: number, selections: FeuerwaffenSelections,
): CharacterState {
  const basis = FEUERWAFFEN.find((row) => row.sourceRow === sourceRow);
  if (!basis) throw new MutationError(`Feuerwaffe (Zeile ${sourceRow}) existiert nicht`);

  let composed;
  try {
    composed = composeFeuerwaffe(basis, selections);
  } catch (error) {
    throw new MutationError(error instanceof Error ? error.message : String(error));
  }
  assertFernkampfVerfuegbar(composed.verfuegbarkeitStufe, basis.name);

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'feuerwaffe', baseTable: 'feuerwaffen', baseId: String(sourceRow),
    selections: {
      verarbeitung: String(selections.verarbeitungSourceRow), anpassung: String(selections.anpassungSourceRow),
    },
    quantity: 1, computedPriceSnapshot: composed.preisDublonen,
    computedStatsSnapshot: {
      gewicht: composed.gewicht, minStaerke: composed.minStaerke, fixschaden: composed.fixschaden,
      rb: composed.rb, kaliber: composed.kaliber, rw: composed.rw, nachladezeit: composed.nachladezeit,
      nachladenTawTeiler: composed.nachladenTawTeiler, patzermodifikator: composed.patzermodifikator,
      verfuegbarkeitRaw: composed.verfuegbarkeitRaw, verfuegbarkeitStufe: composed.verfuegbarkeitStufe,
      herstellungszeit: composed.herstellungszeit, materialpreis: composed.materialpreis, ini: composed.ini,
      rw10m: composed.rwMod[0], rw30m: composed.rwMod[1], rw60m: composed.rwMod[2],
      rw100m: composed.rwMod[3], rw150m: composed.rwMod[4], rw210m: composed.rwMod[5],
    },
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

/**
 * Kauft Munition (Pfeile/Bolzen), optional komponiert mit einem Spitzen-Modifikator (Nutzer
 * 2026-07-19: "mod ändert pfeil zu neuem mod-pfeil, mod nicht einzeln kaufbar" - der Modifikator
 * ist nie ein eigenstaendiger Kauf, siehe pfeilBolzenComposition.ts). quantity = Anzahl Geschosse
 * (gleiches Mengen-Kaufmuster wie buyPreislisteItem).
 */
export function buyMunition(
  character: CharacterState, typ: 'pfeile' | 'bolzen',
  basisSourceRow: number, modifikatorSourceRow: number | null, quantity: number,
): CharacterState {
  if (quantity <= 0) throw new MutationError('Anzahl muss größer als 0 sein');
  const table = typ === 'pfeile' ? PFEILE : BOLZEN;
  const basis = table.find((r) => r.sourceRow === basisSourceRow);
  if (!basis) throw new MutationError(`${typ === 'pfeile' ? 'Pfeil' : 'Bolzen'} (Zeile ${basisSourceRow}) existiert nicht`);
  if (basis['Kategorie'] === 'Spitzen-Modifikator') {
    throw new MutationError(`'${basis.name}' ist ein Spitzen-Modifikator, keine eigenstaendige Munition`);
  }
  let modifikator: FernkampfRow | null = null;
  if (modifikatorSourceRow !== null) {
    modifikator = table.find((r) => r.sourceRow === modifikatorSourceRow) ?? null;
    if (!modifikator) throw new MutationError(`Modifikator (Zeile ${modifikatorSourceRow}) existiert nicht`);
    if (modifikator['Kategorie'] !== 'Spitzen-Modifikator') {
      throw new MutationError(`'${modifikator.name}' ist kein Spitzen-Modifikator`);
    }
  }

  const composed = composeMunition(basis, modifikator);
  const anzeigeName = modifikator ? `${modifikator.name} (${basis.name})` : basis.name;
  assertFernkampfVerfuegbar(composed.verfuegbarkeitStufe, anzeigeName);
  if (composed.preisDublonen === null) {
    throw new MutationError(`'${basis.name}' ist nicht käuflich (kein Preis hinterlegt: "${basis['Preis'] ?? '?'}")`);
  }

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'ammo', baseTable: typ, baseId: String(basisSourceRow),
    selections: modifikator ? { modifikator: String(modifikator.sourceRow) } : {},
    quantity, computedPriceSnapshot: composed.preisDublonen,
    computedStatsSnapshot: { fixschaden: composed.fixschaden, rb: composed.rb, rwModMeter: composed.rwModMeter, be: composed.be },
  };
  candidate.equipment = [...candidate.equipment, entry];
  assertBudgetOk(candidate);
  return candidate;
}

/** Kauft Feuerwaffenmunition aus der Preis-/Kalibertabelle. */
export function buyFeuerwaffenMunition(
  character: CharacterState, art: FeuerwaffenMunitionArt, kaliber: number, quantity: number,
): CharacterState {
  if (![1, 10, 100].includes(quantity)) throw new MutationError('Anzahl muss 1, 10 oder 100 sein');
  const ammo = FEUERWAFFEN_MUNITION_PREISE.find((row) => row.art === art && row.kaliber === kaliber);
  if (!ammo) throw new MutationError(`Keine passende Feuerwaffenmunition für Kaliber ${kaliber}`);

  const candidate = clone(character);
  candidate.equipment = [...candidate.equipment, {
    id: newEquipmentId(),
    family: 'ammo',
    baseTable: 'feuerwaffen-munition',
    baseId: art,
    selections: { kaliber: String(kaliber) },
    quantity,
    computedPriceSnapshot: ammo.preisDublonen,
    computedStatsSnapshot: { kaliber },
  }];
  assertBudgetOk(candidate);
  return candidate;
}

/**
 * Kauft ein Alchemika-Item (Gift/Heiltrank/Kampftrank/Parfum/Zustandstrank) - fertiges Item mit
 * festem Preis, keine Komposition (wie buyPreislisteItem/buyFernkampfwaffe). quantity = Anzahl
 * Flaeschchen/Dosen. Gleiche Verfuegbarkeits-Kaufsperre wie Fernkampf (Nutzer-Konvention 2026-07-19
 * fuer alle Kataloge mit der 1-7-Verfuegbarkeitsskala, siehe assertFernkampfVerfuegbar) -
 * "Verbotener Gegenstand" (Legalitaet>2, in Beschreibung sichtbar) sperrt den Kauf NICHT, ist nur
 * eine Anzeige-Info (Nutzer-Vorgabe: keine Spielregeln ableiten).
 */
export function buyAlchemika(character: CharacterState, sourceRow: number, quantity: number): CharacterState {
  if (quantity <= 0) throw new MutationError('Anzahl muss größer als 0 sein');
  const row = ALCHEMIKA.find((r) => r.sourceRow === sourceRow);
  if (!row) throw new MutationError(`Alchemika-Eintrag (Zeile ${sourceRow}) existiert nicht`);
  assertFernkampfVerfuegbar(row.verfuegbarkeitStufe, row.name);
  if (!row.preisAvailable || row.preisDublonen === undefined) {
    throw new MutationError(`'${row.name}' ist nicht käuflich (kein Preis hinterlegt: "${row.preisRoh ?? '?'}")`);
  }

  const candidate = clone(character);
  const entry: EquipmentEntry = {
    id: newEquipmentId(), family: 'alchemika', baseTable: 'alchemika', baseId: String(sourceRow),
    selections: {}, quantity, computedPriceSnapshot: row.preisDublonen,
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

function newLoadoutId(): string {
  return crypto.randomUUID();
}

/**
 * Legt ein neues Waffen-Loadout an (Waffen-Loadout-Feature, 2026-07-22, REWORKED 2026-07-23) -
 * referenziert zwei bereits besessene EquipmentEntry.id. Validiert nur, dass beide IDs zur
 * richtigen Kombination (und ggf. richtigen Primaer-/Sekundaerhand-Zuordnung) gehoeren - kein
 * Budget-Bezug (kostet nichts), daher kein assertBudgetOk.
 */
export function addWaffenLoadout(
  character: CharacterState, comboType: WaffenLoadoutComboType, primaryEquipmentId: string, secondaryEquipmentId: string,
): CharacterState {
  if (primaryEquipmentId === secondaryEquipmentId) {
    throw new MutationError('Ein Loadout braucht zwei verschiedene Gegenstände');
  }

  if (comboType === 'nk1h_nk1h') {
    const ids = new Set(listEligibleNahkampf1HWaffen(character).map((i) => i.equipmentId));
    if (!ids.has(primaryEquipmentId) || !ids.has(secondaryEquipmentId)) {
      throw new MutationError('Benötigt zwei besessene, 1H-fähige Nahkampfwaffen');
    }
  } else if (comboType === 'nk1h_pistole') {
    // Die NK-Waffe ist seit dem 2026-07-23-Rework IMMER primaer, die Pistole IMMER sekundaer
    // (kein Rollentausch mehr moeglich, siehe characterStore.ts's WaffenLoadoutEntry-Kommentar).
    const meleeIds = new Set(listEligibleNahkampf1HWaffen(character).map((i) => i.equipmentId));
    const pistoleIds = new Set(listEligiblePistolen(character).map((i) => i.equipmentId));
    if (!meleeIds.has(primaryEquipmentId) || !pistoleIds.has(secondaryEquipmentId)) {
      throw new MutationError('Benötigt eine besessene Nahkampfwaffe (1H) als Primärhand und eine besessene Pistole als Sekundärhand');
    }
  } else if (comboType === 'schild_pistole') {
    // Das Schild ist immer primaer, die Pistole immer sekundaer (analog zu nk1h_pistole).
    const schildIds = new Set(listEligibleSchilde(character).map((i) => i.equipmentId));
    const pistoleIds = new Set(listEligiblePistolen(character).map((i) => i.equipmentId));
    if (!schildIds.has(primaryEquipmentId) || !pistoleIds.has(secondaryEquipmentId)) {
      throw new MutationError('Benötigt ein besessenes Schild als Primärhand und eine besessene Pistole als Sekundärhand');
    }
  } else if (comboType === 'pistole_pistole') {
    const pistoleIds = new Set(listEligiblePistolen(character).map((i) => i.equipmentId));
    if (!pistoleIds.has(primaryEquipmentId) || !pistoleIds.has(secondaryEquipmentId)) {
      throw new MutationError('Benötigt zwei besessene Pistolen');
    }
  } else {
    // nk1h_schild: seit dem 2026-07-23-Rework darf der Spieler frei waehlen, ob Waffe oder Schild
    // primaer ist (vorher war die Waffe zwingend primaer) - beide Reihenfolgen sind gueltig.
    const weaponIds = new Set(listEligibleNahkampf1HWaffen(character).map((i) => i.equipmentId));
    const schildIds = new Set(listEligibleSchilde(character).map((i) => i.equipmentId));
    const bothValid = (weaponIds.has(primaryEquipmentId) && schildIds.has(secondaryEquipmentId))
      || (schildIds.has(primaryEquipmentId) && weaponIds.has(secondaryEquipmentId));
    if (!bothValid) throw new MutationError('Benötigt eine besessene 1H-Waffe und ein besessenes Schild');
  }

  const candidate = clone(character);
  const entry: WaffenLoadoutEntry = { id: newLoadoutId(), comboType, primaryEquipmentId, secondaryEquipmentId, favorite: false };
  candidate.waffenLoadouts = [...candidate.waffenLoadouts, entry];
  return candidate;
}

/** Entfernt ein Loadout - kein Budget-Bezug, no-op wenn die id nicht (mehr) existiert. */
export function removeWaffenLoadout(character: CharacterState, loadoutId: string): CharacterState {
  const candidate = clone(character);
  candidate.waffenLoadouts = candidate.waffenLoadouts.filter((l) => l.id !== loadoutId);
  return candidate;
}

/** Mehrere Loadouts duerfen gleichzeitig favorisiert sein (Nutzer 2026-07-22) - reines Toggle,
 *  kein exklusiver "nur eins"-Zustand. */
export function toggleWaffenLoadoutFavorite(character: CharacterState, loadoutId: string): CharacterState {
  const candidate = clone(character);
  candidate.waffenLoadouts = candidate.waffenLoadouts.map(
    (l) => (l.id === loadoutId ? { ...l, favorite: !l.favorite } : l),
  );
  return candidate;
}
