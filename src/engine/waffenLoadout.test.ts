import { describe, expect, it } from 'vitest';
import { createCharacter, type CharacterState } from '../state/characterStore';
import { buyWeapon, buyShield, buyFeuerwaffe, addSelection, removeEquipment } from '../state/characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { makeValueSource } from './characterSheet';
import { evalReferenz } from './rules';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { FEUERWAFFEN } from '../data/equipment/fernkampf';
import { feuerwaffenStandardauswahl } from './feuerwaffenComposition';
import { computeWeaponAtPaOverflow, getKampfstilModifier } from './waffenPool';
import { computeSchaden, averageSchadenValue, parseDiceAverage } from './waffenSchaden';
import { computeRangeCellValues, fkGuteDivisor, fkMeisterlichDivisor } from './fernkampfRange';
import {
  listEligibleNahkampf1HWaffen,
  resolveNk1hNk1h, resolveNk1hPistole, resolveNk1hSchild, resolveSchildPistole, resolvePistolePistole,
  resolveLoadout, describeLoadout, pickHigherPoolSide,
} from './waffenLoadout';

function fkNum(row: Record<string, string>, header: string): number {
  const raw = row[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function findRow<T extends { name: string; sourceRow: number }>(rows: readonly T[], name: string): T {
  const row = rows.find((r) => r.name === name);
  if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
  return row;
}

function baseCharacter(): CharacterState {
  let character = createCharacter('Test');
  character.values['ep_gesamt'] = 100000;
  character.values['dublonen_bank'] = 100000;
  character.values['eig_g_mut'] = 30;
  character.values['eig_k_athletik'] = 30;
  character.values['eig_k_schnelligkeit'] = 30;
  character.values['eig_k_staerke'] = 30;
  character.values['nk_hiebwaffen'] = 10;
  character.values['nk_stichwaffen'] = 10;
  character.values['nk_klingenwaffen'] = 10;
  character.values['nk_unbewaffnet'] = 10;
  return character;
}

function buyTestWeapon(character: CharacterState, name: string): CharacterState {
  const row = findRow(NK_WAFFEN_BASIS, name);
  const material = findRow(NK_MATERIAL, 'Eisen');
  const fertigung = findRow(NK_FERTIGUNG, 'Gesellenarbeit');
  const anpassung = findRow(NK_ANPASSUNG, 'Von der Stange');
  const schaftmaterial = findRow(NK_SCHAFTMATERIAL, 'Standard');
  return buyWeapon(character, row.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
}

function buyTestSchild(character: CharacterState, name: string): CharacterState {
  const row = findRow(NK_WAFFEN_BASIS, name);
  const material = findRow(SCHILD_MATERIAL, 'Holz');
  const fertigung = findRow(SCHILD_FERTIGUNG, 'Gesellenarbeit');
  const bespannung = findRow(SCHILD_BESPANNUNG, 'Stoff');
  return buyShield(character, row.sourceRow, material.sourceRow, fertigung.sourceRow, bespannung.sourceRow);
}

function buyTestPistole(character: CharacterState): CharacterState {
  const pistole = findRow(FEUERWAFFEN, 'Pistole');
  return buyFeuerwaffe(character, pistole.sourceRow, feuerwaffenStandardauswahl(pistole));
}

const EIG_K_STAERKE = 30;

describe('Eignungslisten', () => {
  it('schliesst Stangenwaffen von der 1H-Loadout-Eignung aus', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    const stangenwaffe = NK_WAFFEN_BASIS.find((r) => r['Hauptfertigkeit'] === 'Stangenwaffen' && r['Min-Staerke-1H-Basis']);
    if (!stangenwaffe) throw new Error('Keine Stangenwaffe mit 1H-Spalte in den Testdaten gefunden');
    const material = findRow(NK_MATERIAL, 'Eisen');
    const fertigung = findRow(NK_FERTIGUNG, 'Gesellenarbeit');
    const anpassung = findRow(NK_ANPASSUNG, 'Von der Stange');
    const schaftmaterial = findRow(NK_SCHAFTMATERIAL, 'Standard');
    character = buyWeapon(character, stangenwaffe.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);

    const eligible = listEligibleNahkampf1HWaffen(character);
    expect(eligible.some((i) => i.label === 'Axt')).toBe(true);
    expect(eligible.some((i) => i.label === stangenwaffe.name)).toBe(false);
  });
});

describe('resolveNk1hNk1h: kein Talent (dual wield)', () => {
  it('summiert das n-Mod beider Waffen in JEDE Hand, mit eigener Hauptfertigkeit pro Hand, und halbiert die Nebenhand (abgerundet)', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    const sheet = computeSheet(character);
    const values = makeValueSource(character);
    const kampfstil = getKampfstilModifier(character);

    const axtSnap = axt.computedStatsSnapshot!;
    const dolchSnap = dolch.computedStatsSnapshot!;
    const atSum = axtSnap.at + dolchSnap.at;
    const paSum = axtSnap.pa + dolchSnap.pa;
    const expectedPrimary = computeWeaponAtPaOverflow('Hiebwaffen', atSum, paSum, values, kampfstil);
    const expectedSecondary = computeWeaponAtPaOverflow('Stichwaffen', atSum, paSum, values, kampfstil);

    const result = resolveNk1hNk1h(character, sheet, values, axt.id, dolch.id);
    if (!result.ok || result.talentActive) throw new Error('Erwartete no-talent Ergebnis');
    expect(result.primary.nat).toBe(Math.min(20, expectedPrimary.uncAtWeapon));
    expect(result.primary.npa).toBe(Math.min(20, expectedPrimary.uncPaWeapon));
    expect(result.secondary.nat).toBe(Math.floor(Math.min(20, expectedSecondary.uncAtWeapon) / 2));
    expect(result.secondary.npa).toBe(Math.floor(Math.min(20, expectedSecondary.uncPaWeapon) / 2));
    expect(result.primary.schaden).toBe(computeSchaden(NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === axt.baseId), axtSnap.staerkeMalus, EIG_K_STAERKE));
    expect(result.secondary.halved).toBe(true);
    expect(result.primary.halved).toBe(false);
  });

  it('deckelt nAT/nPA bei 20, selbst wenn die solo-Basis (ohne jede Investition) schon darueber liegt', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    axt.computedStatsSnapshot = { ...axt.computedStatsSnapshot, at: 30, pa: 30 };
    const sheet = computeSheet(character);
    const values = makeValueSource(character);

    const result = resolveNk1hNk1h(character, sheet, values, axt.id, dolch.id);
    if (!result.ok || result.talentActive) throw new Error('Erwartete no-talent Ergebnis');
    expect(result.primary.nat).toBeLessThanOrEqual(20);
    expect(result.primary.npa).toBeLessThanOrEqual(20);
  });

  it('meldet einen Fehler statt zu werfen, wenn eine referenzierte Waffe nicht mehr besessen wird', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    const removed = removeEquipment(character, dolch.id);
    const sheet = computeSheet(removed);
    const values = makeValueSource(removed);

    const result = resolveNk1hNk1h(removed, sheet, values, axt.id, dolch.id);
    expect(result.ok).toBe(false);
  });
});

describe('resolveNk1hNk1h: Kampf mit zwei Waffen-Talent (Gate + Amalgamation)', () => {
  function characterWithKrummdolchUndKriegsbeil() {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Krummdolch schwer'); // WK 3.5
    character = buyTestWeapon(character, 'Kriegsbeil'); // WK 4.5
    return character;
  }

  it('aktiviert das Talent NICHT, wenn eine Seite ueber der Kappungsgrenze der besessenen Stufe liegt (Stufe 1, Cap 3,5 < Kriegsbeil-WK 4,5)', () => {
    let character = characterWithKrummdolchUndKriegsbeil();
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_1');
    const [krummdolch, kriegsbeil] = character.equipment;
    const result = resolveNk1hNk1h(character, computeSheet(character), makeValueSource(character), krummdolch.id, kriegsbeil.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.talentActive).toBe(false);
  });

  it('aktiviert das Talent, wenn beide WK genau auf der Kappungsgrenze liegen oder darunter (Stufe 2, Cap 4,5 == Kriegsbeil-WK)', () => {
    let character = characterWithKrummdolchUndKriegsbeil();
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_1');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_2');
    const [krummdolch, kriegsbeil] = character.equipment;
    const result = resolveNk1hNk1h(character, computeSheet(character), makeValueSource(character), krummdolch.id, kriegsbeil.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.talentActive).toBe(true);
  });

  it('berechnet AT-WK = hoehere WK * 1,5, PA-WK = Summe der WK, Mindeststaerke summiert', () => {
    let character = characterWithKrummdolchUndKriegsbeil();
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_1');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_2');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_3');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_4');
    const [krummdolch, kriegsbeil] = character.equipment;
    const result = resolveNk1hNk1h(character, computeSheet(character), makeValueSource(character), krummdolch.id, kriegsbeil.id);
    if (!result.ok || !result.talentActive) throw new Error('Erwartete Talent-Ergebnis');
    expect(result.atWk).toBe(String(4.5 * 1.5));
    expect(result.paWk).toBe(String(3.5 + 4.5));
    expect(result.minStaerke).toBe(krummdolch.computedStatsSnapshot!.minStaerke1H + kriegsbeil.computedStatsSnapshot!.minStaerke1H);
  });

  it('waehlt die Waffe mit dem hoeheren DURCHSCHNITTSSCHADEN (Wuerfel+Flachbonus), nicht die mit dem hoeheren Flachbonus allein', () => {
    // Kriegsbeil hat den SCHLECHTEREN Flachbonus (0 statt +2 bei Krummdolch schwer, siehe
    // computeSchaden), aber durch [2W12]+W12 den deutlich hoeheren Wuerfeldurchschnitt - ein
    // reiner Flachbonus-Vergleich wuerde faelschlich Krummdolch schwer waehlen.
    let character = characterWithKrummdolchUndKriegsbeil();
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_1');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_2');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_3');
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_4');
    const [krummdolch, kriegsbeil] = character.equipment;
    const krummdolchBasis = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === krummdolch.baseId);
    const kriegsbeilBasis = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === kriegsbeil.baseId);
    const krummdolchAvg = averageSchadenValue(krummdolchBasis, krummdolch.computedStatsSnapshot!.staerkeMalus, EIG_K_STAERKE);
    const kriegsbeilAvg = averageSchadenValue(kriegsbeilBasis, kriegsbeil.computedStatsSnapshot!.staerkeMalus, EIG_K_STAERKE);
    expect(kriegsbeilAvg).toBeGreaterThan(krummdolchAvg); // Praemisse der Testkonstruktion bestaetigen

    const result = resolveNk1hNk1h(character, computeSheet(character), makeValueSource(character), krummdolch.id, kriegsbeil.id);
    if (!result.ok || !result.talentActive) throw new Error('Erwartete Talent-Ergebnis');
    expect(result.schaden).toBe(computeSchaden(kriegsbeilBasis, kriegsbeil.computedStatsSnapshot!.staerkeMalus, EIG_K_STAERKE));
  });
});

describe('resolveNk1hSchild (REWORKED 2026-07-23: unabhaengige Haende wie nk1h_nk1h, keine Amalgamation ohne Talent)', () => {
  it('summiert das n-Mod beider Seiten in JEDE Hand, mit eigener Hauptfertigkeit pro Hand, und halbiert die Nebenhand (abgerundet) - Waffe ist hier die Spieler-gewaehlte Primaerhand', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestSchild(character, 'Faustschild/Buckler');
    const [axt, schild] = character.equipment;
    const sheet = computeSheet(character);
    const values = makeValueSource(character);
    const kampfstil = getKampfstilModifier(character);
    const axtSnap = axt.computedStatsSnapshot!;
    const schildSnap = schild.computedStatsSnapshot!;
    const atSum = axtSnap.at + schildSnap.at;
    const paSum = axtSnap.pa + schildSnap.pa;
    const expectedWeapon = computeWeaponAtPaOverflow('Hiebwaffen', atSum, paSum, values, kampfstil);

    const result = resolveNk1hSchild(character, sheet, values, axt.id, schild.id);
    if (!result.ok || result.talentActive) throw new Error('Erwartete no-talent Ergebnis');
    expect(result.primary.equipmentId).toBe(axt.id);
    expect(result.primary.halved).toBe(false);
    expect(result.primary.nat).toBe(Math.min(20, expectedWeapon.uncAtWeapon));
    expect(result.primary.npa).toBe(Math.min(20, expectedWeapon.uncPaWeapon));
    expect(result.secondary.equipmentId).toBe(schild.id);
    expect(result.secondary.halved).toBe(true);
  });

  it('erlaubt dem Spieler, stattdessen das Schild als Primaerhand zu waehlen - dann ist die Waffe die (halbierte) Nebenhand', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestSchild(character, 'Faustschild/Buckler');
    const [axt, schild] = character.equipment;
    const result = resolveNk1hSchild(character, computeSheet(character), makeValueSource(character), schild.id, axt.id);
    if (!result.ok || result.talentActive) throw new Error('Erwartete no-talent Ergebnis');
    expect(result.primary.equipmentId).toBe(schild.id);
    expect(result.primary.halved).toBe(false);
    expect(result.secondary.equipmentId).toBe(axt.id);
    expect(result.secondary.halved).toBe(true); // kein Talent deckt "Waffe in der Nebenhand" ab
  });

  it('Talent "Schildkampf" hebt die Halbierung auf, wenn das SCHILD in der Nebenhand ist', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestSchild(character, 'Faustschild/Buckler');
    character = addSelection(character, 'talente_schildkampf');
    const [axt, schild] = character.equipment;
    const result = resolveNk1hSchild(character, computeSheet(character), makeValueSource(character), axt.id, schild.id);
    if (!result.ok || result.talentActive) throw new Error('Erwartete no-talent Ergebnis');
    expect(result.secondary.equipmentId).toBe(schild.id);
    expect(result.secondary.halved).toBe(false);
  });

  it('Talent "Schildkampf" hilft NICHT, wenn stattdessen die WAFFE in der Nebenhand ist (kein passendes Talent dafuer)', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestSchild(character, 'Faustschild/Buckler');
    character = addSelection(character, 'talente_schildkampf');
    const [axt, schild] = character.equipment;
    const result = resolveNk1hSchild(character, computeSheet(character), makeValueSource(character), schild.id, axt.id);
    if (!result.ok || result.talentActive) throw new Error('Erwartete no-talent Ergebnis');
    expect(result.secondary.equipmentId).toBe(axt.id);
    expect(result.secondary.halved).toBe(true);
  });

  it('prueft das Talent-Gate ("Kampf mit zwei Waffen") gegen die ROHE (nicht halbierte) Schild-WK - ein Schild, dessen halbierte WK die Kappung erfuellen wuerde, aktiviert das Talent trotzdem NICHT', () => {
    // Rundschild hat eine komponierte WK von 6,5 (> Stufe-1-Cap 3,5); halbiert waere sie 3,5
    // (<= Cap) - das Gate MUSS trotzdem ablehnen, weil es die rohe WK prueft.
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Krummdolch schwer'); // WK 3,5
    character = buyTestSchild(character, 'Rundschild'); // komponierte WK 6,5
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_1');
    const [weapon, schild] = character.equipment;
    expect(schild.computedStatsSnapshot!.wk).toBe(6.5);

    const result = resolveNk1hSchild(character, computeSheet(character), makeValueSource(character), weapon.id, schild.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.talentActive).toBe(false);
  });

  it('halbiert die Schild-WK (aufgerundet auf 0,5) VOR den AT-WK/PA-WK-Formeln, wenn das Talent aktiv ist (Amalgamation unveraendert gegenueber der Vorversion)', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Krummdolch schwer'); // WK 3,5
    character = buyTestSchild(character, 'Faustschild/Buckler'); // komponierte WK 2,5
    character = addSelection(character, 'talente_kampf_mit_zwei_waffen_stufe_1');
    const [weapon, schild] = character.equipment;
    expect(schild.computedStatsSnapshot!.wk).toBe(2.5);
    const halvedSchildWk = 1.5; // aufrunden(2.5/2, auf 0.5) = 1.5

    const result = resolveNk1hSchild(character, computeSheet(character), makeValueSource(character), weapon.id, schild.id);
    if (!result.ok || !result.talentActive) throw new Error('Erwartete Talent-Ergebnis');
    expect(result.atWk).toBe(String(Math.max(3.5, halvedSchildWk) * 1.5));
    expect(result.paWk).toBe(String(3.5 + halvedSchildWk));
    expect(result.minStaerke).toBe(weapon.computedStatsSnapshot!.minStaerke1H + schild.computedStatsSnapshot!.minStaerke);
  });
});

describe('resolveNk1hPistole (REWORKED 2026-07-23: NK-Waffe immer primaer, n-Mod jetzt summiert ueber die NK-Statblock-Werte der Pistole)', () => {
  function meleeAndPistoleCharacter() {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestPistole(character);
    return character;
  }

  it('summiert das Axt-n-Mod mit dem NK-Statblock-n-Mod (AT-Basis/PA-Basis) der Pistole, und halbiert die Pistole standardmaessig', () => {
    let character = meleeAndPistoleCharacter();
    const [axt, pistole] = character.equipment;
    const values = makeValueSource(character);
    const kampfstil = getKampfstilModifier(character);
    const pistoleBasis = findRow(FEUERWAFFEN, 'Pistole');
    const atSum = axt.computedStatsSnapshot!.at + fkNum(pistoleBasis, 'AT-Basis');
    const paSum = axt.computedStatsSnapshot!.pa + fkNum(pistoleBasis, 'PA-Basis');
    const expectedMelee = computeWeaponAtPaOverflow('Hiebwaffen', atSum, paSum, values, kampfstil);

    const result = resolveNk1hPistole(character, values, axt.id, pistole.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.melee.halved).toBe(false); // die NK-Waffe ist immer primaer
    expect(result.melee.nat).toBe(Math.min(20, expectedMelee.uncAtWeapon));
    expect(result.melee.npa).toBe(Math.min(20, expectedMelee.uncPaWeapon));
    expect(result.pistole.halved).toBe(true);
  });

  it('meldet einen Fehler, wenn primary NICHT die Nahkampfwaffe ist (kein Rollentausch mehr moeglich)', () => {
    let character = meleeAndPistoleCharacter();
    const [axt, pistole] = character.equipment;
    const result = resolveNk1hPistole(character, makeValueSource(character), pistole.id, axt.id);
    expect(result.ok).toBe(false);
  });

  it('halbiert normal/gut/meisterlich unabhaengig voneinander, und laesst eine "x"-Zelle unveraendert', () => {
    let character = meleeAndPistoleCharacter();
    const [axt, pistole] = character.equipment;
    const values = makeValueSource(character);
    const gutDivisor = fkGuteDivisor(values);
    const meisterlichDivisor = fkMeisterlichDivisor(values);
    const basisWert = Number(evalReferenz('fk_basis_spez_schusswaffen_pistolen', values));
    const snap = pistole.computedStatsSnapshot ?? {};
    const rawCell = computeRangeCellValues(snap.rw10m ?? 0, basisWert, gutDivisor, meisterlichDivisor);

    const result = resolveNk1hPistole(character, values, axt.id, pistole.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    if (rawCell === 'x') {
      expect(result.pistole.ranges[0]).toBe('x');
    } else {
      const expectedNormal = Math.floor(rawCell.normal / 2);
      expect(result.pistole.ranges[0]).toContain(String(expectedNormal));
    }
  });

  it('Linkshaendig Pistolenschiessen hebt die Halbierung auf (die Pistole ist hier immer die Nebenhand)', () => {
    let character = meleeAndPistoleCharacter();
    character = addSelection(character, 'talente_linkshaendig_pistolenschiessen');
    const [axt, pistole] = character.equipment;
    const result = resolveNk1hPistole(character, makeValueSource(character), axt.id, pistole.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.pistole.halved).toBe(false);
  });

  it('Beidhaendig Pistolenschiessen hebt die Halbierung ebenfalls auf', () => {
    let character = meleeAndPistoleCharacter();
    character = addSelection(character, 'talente_beidhaendig_pistolenschiessen');
    const [axt, pistole] = character.equipment;
    const result = resolveNk1hPistole(character, makeValueSource(character), axt.id, pistole.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.pistole.halved).toBe(false);
  });
});

describe('resolveSchildPistole (NEU 2026-07-23: Schild immer primaer, n-Mod summiert, Pistole halbiert)', () => {
  function schildAndPistoleCharacter() {
    let character = baseCharacter();
    character = buyTestSchild(character, 'Faustschild/Buckler');
    character = buyTestPistole(character);
    return character;
  }

  it('summiert das Schild-n-Mod mit dem NK-Statblock-n-Mod der Pistole, und halbiert die Pistole standardmaessig', () => {
    let character = schildAndPistoleCharacter();
    const [schild, pistole] = character.equipment;
    const values = makeValueSource(character);
    const kampfstil = getKampfstilModifier(character);
    const pistoleBasis = findRow(FEUERWAFFEN, 'Pistole');
    const schildHauptfertigkeit = findRow(NK_WAFFEN_BASIS, 'Faustschild/Buckler')['Hauptfertigkeit'] ?? '';
    const atSum = schild.computedStatsSnapshot!.at + fkNum(pistoleBasis, 'AT-Basis');
    const paSum = schild.computedStatsSnapshot!.pa + fkNum(pistoleBasis, 'PA-Basis');
    const expectedSchild = computeWeaponAtPaOverflow(schildHauptfertigkeit, atSum, paSum, values, kampfstil);

    const result = resolveSchildPistole(character, values, schild.id, pistole.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.schild.halved).toBe(false);
    expect(result.schild.nat).toBe(Math.min(20, expectedSchild.uncAtWeapon));
    expect(result.schild.npa).toBe(Math.min(20, expectedSchild.uncPaWeapon));
    expect(result.pistole.halved).toBe(true);
  });

  it('meldet einen Fehler, wenn primary NICHT das Schild ist', () => {
    let character = schildAndPistoleCharacter();
    const [schild, pistole] = character.equipment;
    const result = resolveSchildPistole(character, makeValueSource(character), pistole.id, schild.id);
    expect(result.ok).toBe(false);
  });

  it('Linkshaendig/Beidhaendig Pistolenschiessen heben die Pistolen-Halbierung auf', () => {
    let character = schildAndPistoleCharacter();
    character = addSelection(character, 'talente_beidhaendig_pistolenschiessen');
    const [schild, pistole] = character.equipment;
    const result = resolveSchildPistole(character, makeValueSource(character), schild.id, pistole.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.pistole.halved).toBe(false);
  });
});

describe('resolvePistolePistole (NEU 2026-07-23: beide Haende standardmaessig halbiert, keine "volle" Primaerhand)', () => {
  function zweiPistolenCharacter() {
    let character = baseCharacter();
    character = buyTestPistole(character);
    character = buyTestPistole(character);
    return character;
  }

  it('halbiert BEIDE Haende standardmaessig - auch die Primaerhand', () => {
    let character = zweiPistolenCharacter();
    const [p1, p2] = character.equipment;
    const result = resolvePistolePistole(character, makeValueSource(character), p1.id, p2.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.primary.halved).toBe(true);
    expect(result.secondary.halved).toBe(true);
  });

  it('Linkshaendig Pistolenschiessen hebt NUR die Sekundaerhand (links) auf', () => {
    let character = zweiPistolenCharacter();
    character = addSelection(character, 'talente_linkshaendig_pistolenschiessen');
    const [p1, p2] = character.equipment;
    const result = resolvePistolePistole(character, makeValueSource(character), p1.id, p2.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.primary.halved).toBe(true);
    expect(result.secondary.halved).toBe(false);
  });

  it('Beidhaendig Pistolenschiessen hebt BEIDE Haende auf', () => {
    let character = zweiPistolenCharacter();
    character = addSelection(character, 'talente_beidhaendig_pistolenschiessen');
    const [p1, p2] = character.equipment;
    const result = resolvePistolePistole(character, makeValueSource(character), p1.id, p2.id);
    if (!result.ok) throw new Error('Erwartete ein Ergebnis');
    expect(result.primary.halved).toBe(false);
    expect(result.secondary.halved).toBe(false);
  });

  it('meldet einen Fehler, wenn eine der beiden IDs keine besessene Pistole ist', () => {
    let character = zweiPistolenCharacter();
    character = buyTestWeapon(character, 'Axt');
    const [p1, , axt] = character.equipment;
    const result = resolvePistolePistole(character, makeValueSource(character), p1.id, axt.id);
    expect(result.ok).toBe(false);
  });
});

describe('pickHigherPoolSide', () => {
  it('waehlt bei Gleichstand (keine Investition auf beiden Seiten) die Primaerseite', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    const sheet = computeSheet(character);
    const winner = pickHigherPoolSide(
      sheet,
      { equipmentId: axt.id, poolReferenz: 'nk_pool_hiebwaffen_aexte' },
      { equipmentId: dolch.id, poolReferenz: 'nk_pool_stichwaffen_dolche' },
    );
    expect(winner.equipmentId).toBe(axt.id);
  });

  it('waehlt die Seite mit mehr investierten Spezialisierungspunkten, auch wenn sie die Sekundaerseite ist', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    character.values['nk_spez_stichwaffen_dolche'] = 50; // Dolche-Pool deutlich hoeher als Aexte-Pool (0)
    const [axt, dolch] = character.equipment;
    const sheet = computeSheet(character);
    const winner = pickHigherPoolSide(
      sheet,
      { equipmentId: axt.id, poolReferenz: 'nk_pool_hiebwaffen_aexte' },
      { equipmentId: dolch.id, poolReferenz: 'nk_pool_stichwaffen_dolche' },
    );
    expect(winner.equipmentId).toBe(dolch.id);
  });
});

describe('resolveLoadout + describeLoadout', () => {
  it('leitet den Anzeigenamen live aus den aktuellen Ausruestungsnamen ab', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    const entry = { id: 'x', comboType: 'nk1h_nk1h' as const, primaryEquipmentId: axt.id, secondaryEquipmentId: dolch.id, favorite: false };
    expect(describeLoadout(character, entry)).toBe('Axt+Dolch');
  });

  it('zeigt "???" fuer eine Seite, deren Ausruestung nicht mehr existiert, statt zu werfen', () => {
    let character = baseCharacter();
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    const removed = removeEquipment(character, dolch.id);
    const entry = { id: 'x', comboType: 'nk1h_nk1h' as const, primaryEquipmentId: axt.id, secondaryEquipmentId: dolch.id, favorite: false };
    expect(describeLoadout(removed, entry)).toBe('Axt+???');

    const result = resolveLoadout(removed, computeSheet(removed), makeValueSource(removed), entry);
    expect(result.ok).toBe(false);
  });
});

describe('parseDiceAverage', () => {
  it('berechnet den Durchschnitt eines einzelnen Wuerfels ("Wxx")', () => {
    expect(parseDiceAverage('W6')).toBe(3.5);
    expect(parseDiceAverage('W20')).toBe(10.5);
  });

  it('berechnet den Durchschnitt mehrerer summierter Wuerfel ("NWxx")', () => {
    expect(parseDiceAverage('2W8')).toBe(9); // 2 * (8+1)/2
  });

  it('berechnet den Durchschnitt von "bester aus N" ("[NWxx]") ueber die Tail-Summenformel', () => {
    // E[max(2W12)] = (s+1)(4s-1)/(6s) mit s=12 = 13*47/72
    expect(parseDiceAverage('[2W12]')).toBeCloseTo((13 * 47) / 72, 10);
  });

  it('gibt 0 fuer leere/unbekannte Notation zurueck', () => {
    expect(parseDiceAverage(undefined)).toBe(0);
    expect(parseDiceAverage('')).toBe(0);
  });
});
