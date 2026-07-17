import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import { equipRuestung, unequipRuestung, buyShield, removeEquipment, BudgetError, MutationError } from './characterMutations';
import { computeSheet, makeValueSource } from '../engine/characterSheet';
import { composeShield } from '../engine/shieldComposition';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';

function withDublonen(bank: number) {
  const character = createCharacter('Test');
  character.values['dublonen_bank'] = bank;
  return character;
}

describe('equipRuestung (Regel Nutzer 2026-07-17: feste Slots TZ-Gruppe x Lage)', () => {
  // Stoffruestung ist Lage 1 (siehe Ruestung-Basis) -> gehoert in den Lage-1-Slot.
  const basis = RUESTUNG_BASIS.find((r) => r.name === 'Stoffrüstung')!;
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Meisterarbeit')!;
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.name === 'angepasst')!;

  it('ruestet eine komponierte Ruestung in den passenden Slot aus und zieht den berechneten Preis (227D) ab', () => {
    const character = withDublonen(227);
    const updated = equipRuestung(character, 'torso', 1, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    expect(updated.ruestungSlots['torso:1'].computedStatsSnapshot).toEqual({ rs: 3, rh: 1, verfuegbarkeitNw: 3, verfuegbarkeitAw: 2 });
    expect(computeSheet(updated).dublonenSpent).toBe(227);
  });

  it('rs_torso liest die echte Summe aus dem Slot (Nutzer 2026-07-17: "im character state muss die ruestung erfasst werden")', () => {
    const character = withDublonen(227);
    const updated = equipRuestung(character, 'torso', 1, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    expect(makeValueSource(updated).getRsGruppe?.('torso')).toBe(3);
    expect(makeValueSource(updated).getRsGruppe?.('kopf')).toBe(0); // kein Slot belegt
  });

  it('lehnt ab, wenn nicht genug Dublonen vorhanden sind', () => {
    const character = withDublonen(226);
    expect(() => equipRuestung(character, 'torso', 1, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow)).toThrow(BudgetError);
  });

  it('lehnt eine unbekannte Basis-Zeile ab', () => {
    const character = withDublonen(100000);
    expect(() => equipRuestung(character, 'torso', 1, 999999, verarbeitung.sourceRow, anpassung.sourceRow)).toThrow(MutationError);
  });

  it('lehnt eine ungueltige Lage ab', () => {
    const character = withDublonen(100000);
    expect(() => equipRuestung(character, 'torso', 6, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow)).toThrow(MutationError);
  });

  it('lehnt ab, wenn die Basis-Zeile nicht zur angeforderten Lage passt (Stoffruestung ist Lage 1, nicht Lage 3)', () => {
    const character = withDublonen(100000);
    expect(() => equipRuestung(character, 'torso', 3, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow)).toThrow(MutationError);
  });

  it('erneutes Ausruesten desselben Slots ueberschreibt den vorherigen Eintrag statt zu duplizieren', () => {
    const character = withDublonen(100000);
    const first = equipRuestung(character, 'torso', 1, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    const leichteStoff = RUESTUNG_BASIS.find((r) => r.name === 'Leichte Stoffrüstung')!; // auch Lage 1
    const second = equipRuestung(first, 'torso', 1, leichteStoff.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    expect(Object.keys(second.ruestungSlots)).toEqual(['torso:1']);
    expect(second.ruestungSlots['torso:1'].basisSourceRow).toBe(leichteStoff.sourceRow);
  });

  it('unequipRuestung entfernt den Slot wieder und macht das Budget rueckgaengig', () => {
    const character = withDublonen(227);
    const updated = equipRuestung(character, 'torso', 1, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    const removed = unequipRuestung(updated, 'torso', 1);
    expect(removed.ruestungSlots['torso:1']).toBeUndefined();
    expect(computeSheet(removed).dublonenSpent).toBe(0);
  });
});

describe('rs_kopf/rs_torso/rs_arme/rs_beine + gewichtsbelastung ueber die echten Ruestungs-Slots (Nutzer 2026-07-17: "im character state muss die ruestung erfasst werden")', () => {
  it('rs_torso liefert im vollen computeSheet-Durchlauf die echte RS-Summe, andere Gruppen bleiben 0', () => {
    const basis = RUESTUNG_BASIS.find((r) => r.name === 'Stoffrüstung')!;
    const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Meisterarbeit')!;
    const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.name === 'angepasst')!;
    const updated = equipRuestung(withDublonen(100000), 'torso', 1, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    const sheet = computeSheet(updated);
    const findRs = (ref: string) => sheet.byKategorie['Kampf']?.find((r) => r.rule.referenz === ref)?.computedValue;
    expect(findRs('rs_torso')).toBe(3);
    expect(findRs('rs_kopf')).toBe(0);
    expect(findRs('rs_arme')).toBe(0);
    expect(findRs('rs_beine')).toBe(0);
  });

  it('gewichtsbelastung wird positiv, sobald RHg (Summe aller Ruestungs-Slots) hoch genug ist', () => {
    const character = withDublonen(100000);
    character.values['eig_k_konstitution'] = 10;
    character.values['eig_k_staerke'] = 10;
    // Synthetischer Slot mit stark ueberhoehtem RH, um die Verdrahtung deterministisch zu
    // pruefen, unabhaengig von den echten (deutlich kleineren) Ruestung-Basis-Werten.
    character.ruestungSlots['torso:1'] = {
      basisSourceRow: -1, verarbeitungSourceRow: -1, anpassungSourceRow: -1,
      computedPriceSnapshot: 0,
      computedStatsSnapshot: { rs: 5, rh: 50, verfuegbarkeitNw: 0, verfuegbarkeitAw: 0 },
    };
    const sheet = computeSheet(character);
    const gbe = sheet.byKategorie['Charakterwerte']?.find((r) => r.rule.referenz === 'gewichtsbelastung')?.computedValue;
    expect(Number(gbe)).toBeGreaterThan(0);
  });
});

describe('buyShield (Regel Nutzer 2026-07-17: Schilde komponiert aus Basis x Material x Fertigung x Bespannung)', () => {
  const shieldRow = NK_WAFFEN_BASIS.find((r) => r['Spezialisierung'] === 'Schild')!;
  const feineisen = SCHILD_MATERIAL.find((r) => r.name === 'Feineisen')!;
  const gesellenarbeit = SCHILD_FERTIGUNG.find((r) => r.name === 'Gesellenarbeit')!;
  const stoff = SCHILD_BESPANNUNG.find((r) => r.name === 'Stoff')!;
  const komponiertesPreis = composeShield(shieldRow, feineisen, gesellenarbeit, stoff).preis!;

  it('kauft ein Schild zum komponierten Preis (Basis x Material x Fertigung + Bespannung)', () => {
    const character = withDublonen(komponiertesPreis);
    const updated = buyShield(character, shieldRow.sourceRow, feineisen.sourceRow, gesellenarbeit.sourceRow, stoff.sourceRow);
    expect(computeSheet(updated).dublonenSpent).toBe(komponiertesPreis);
    expect(updated.equipment[0].computedStatsSnapshot?.rs).toBe(Number(shieldRow['RS-Basis']));
  });

  it('lehnt eine Nicht-Schild-Zeile ab', () => {
    const nonShield = NK_WAFFEN_BASIS.find((r) => r['Spezialisierung'] !== 'Schild')!;
    const character = withDublonen(100000);
    expect(() => buyShield(character, nonShield.sourceRow, feineisen.sourceRow, gesellenarbeit.sourceRow, stoff.sourceRow)).toThrow(MutationError);
  });

  it('lehnt Kolhartz-Material ab, wenn der Charakter kein Zentaure ist (Nutzer 2026-07-17)', () => {
    const kolhartz = SCHILD_MATERIAL.find((r) => r.name === 'Kolhartz')!;
    const character = createCharacter('Test', { spezies: 'Mensch' });
    character.values['dublonen_bank'] = 100000;
    expect(() => buyShield(character, shieldRow.sourceRow, kolhartz.sourceRow, gesellenarbeit.sourceRow, stoff.sourceRow)).toThrow(MutationError);
  });

  it('erlaubt Kolhartz-Material fuer Zentauren-Charaktere', () => {
    const kolhartz = SCHILD_MATERIAL.find((r) => r.name === 'Kolhartz')!;
    const character = createCharacter('Test', { spezies: 'Zentauren' });
    character.values['dublonen_bank'] = 100000;
    const updated = buyShield(character, shieldRow.sourceRow, kolhartz.sourceRow, gesellenarbeit.sourceRow, stoff.sourceRow);
    expect(updated.equipment).toHaveLength(1);
  });

  it('lehnt eine Material/Fertigung/Bespannung-Kombination ohne automatischen Preis ab (Drachensch. = Meister-Ermessen)', () => {
    const drachensch = SCHILD_MATERIAL.find((r) => r.name === 'Drachensch.')!;
    const character = withDublonen(1000000);
    expect(() => buyShield(character, shieldRow.sourceRow, drachensch.sourceRow, gesellenarbeit.sourceRow, stoff.sourceRow)).toThrow(MutationError);
  });

  it('removeEquipment entfernt den Schild-Kauf wieder', () => {
    const character = withDublonen(komponiertesPreis);
    const updated = buyShield(character, shieldRow.sourceRow, feineisen.sourceRow, gesellenarbeit.sourceRow, stoff.sourceRow);
    const removed = removeEquipment(updated, updated.equipment[0].id);
    expect(computeSheet(removed).dublonenSpent).toBe(0);
  });
});
