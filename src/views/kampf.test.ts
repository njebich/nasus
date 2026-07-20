import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { buyFeuerwaffe, buyFeuerwaffenMunition, buyWeapon, setValue, setWaffenPoolAllocation } from '../state/characterMutations';
import { buildFeuerwaffenRows, buildNahkampfRows } from './kampf';
import { FEUERWAFFEN } from '../data/equipment/fernkampf';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import { feuerwaffenStandardauswahl, composeFeuerwaffe } from '../engine/feuerwaffenComposition';
import { computeSheet } from '../engine/characterSheet';

function findFeuerwaffe(name: string) {
  const row = FEUERWAFFEN.find((r) => r.name === name);
  if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
  return row;
}

function baseCharacter() {
  let character = createCharacter('Test');
  character.values['ep_gesamt'] = 100000;
  character.values['dublonen_bank'] = 100000;
  return character;
}

describe('buildFeuerwaffenRows', () => {
  it('zeigt eine leere Munition-Zelle, wenn keine passende Feuerwaffen-Munition besessen wird', () => {
    const muskete = findFeuerwaffe('Muskete'); // Typ='Gewehr'
    const selections = feuerwaffenStandardauswahl(muskete);
    let character = baseCharacter();
    character = buyFeuerwaffe(character, muskete.sourceRow, selections);

    const rows = buildFeuerwaffenRows(character);
    expect(rows).toHaveLength(1);
    expect(rows[0].munition).toBe('–');
  });

  it('Kreuzprodukt: eine Feuerwaffe + passend besessene Feuerwaffen-Munition (nach Kaliber) ergibt die Munition-Zelle', () => {
    const muskete = findFeuerwaffe('Muskete');
    const selections = feuerwaffenStandardauswahl(muskete);
    const composed = composeFeuerwaffe(muskete, selections);
    let character = baseCharacter();
    character = buyFeuerwaffe(character, muskete.sourceRow, selections);
    character = buyFeuerwaffenMunition(character, 'blei_pulver', composed.kaliber, 10);

    const rows = buildFeuerwaffenRows(character);
    expect(rows).toHaveLength(1);
    expect(rows[0].munition).toContain('10 Stück');
  });

  it('Typ="Gewehr" nutzt die Musketen-Pool-Familie, Typ="Pistole" die Pistolen-Familie (unterschiedliche Reichweiten-Basiswerte)', () => {
    const muskete = findFeuerwaffe('Muskete'); // Typ='Gewehr'
    const pistole = findFeuerwaffe('Langpistole'); // Typ='Pistole'
    let character = baseCharacter();
    character = buyFeuerwaffe(character, muskete.sourceRow, feuerwaffenStandardauswahl(muskete));
    character = buyFeuerwaffe(character, pistole.sourceRow, feuerwaffenStandardauswahl(pistole));

    const rows = buildFeuerwaffenRows(character);
    expect(rows).toHaveLength(2);
    // Beide Waffen loesen sich auf einen bekannten Pool auf (kein "x" in jeder Zelle) - die
    // konkreten Basiswerte unterscheiden sich zwischen Musketen/Pistolen, aber beide muessen
    // ueberhaupt eine reale Zahl (nicht durchgehend "x") liefern.
    for (const row of rows) {
      expect(row.ranges.some((cell) => cell !== 'x')).toBe(true);
    }
  });
});

describe('buildNahkampfRows: PP-Spalte (Poolpunkte)', () => {
  function findRow<T extends { name: string; sourceRow: number }>(rows: readonly T[], name: string): T {
    const row = rows.find((r) => r.name === name);
    if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
    return row;
  }

  function characterWithZweiAexten() {
    let character = baseCharacter();
    character = setValue(character, 'eig_g_mut', 30);
    character = setValue(character, 'eig_k_athletik', 30);
    character = setValue(character, 'eig_k_schnelligkeit', 30);
    character = setValue(character, 'eig_k_staerke', 30);
    character = setValue(character, 'nk_hiebwaffen', 10);
    const axt = findRow(NK_WAFFEN_BASIS, 'Axt');
    const material = findRow(NK_MATERIAL, 'Eisen');
    const fertigung = findRow(NK_FERTIGUNG, 'Gesellenarbeit');
    const anpassung = findRow(NK_ANPASSUNG, 'Von der Stange');
    const schaftmaterial = findRow(NK_SCHAFTMATERIAL, 'Standard');
    character = buyWeapon(character, axt.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
    character = buyWeapon(character, axt.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
    return character;
  }

  it('zieht nur die eigene Zeilen-Zuteilung vom Pool-Budget ab, nicht die Summe der Geschwister-Waffen', () => {
    // Budget=7 (reine Pool-Formel bei nk_hiebwaffen=10, siehe characterMutations.test.ts), zwei
    // Aexte teilen sich das Budget fuer die BUDGET-Pruefung, aber PP zeigt pro Zeile nur "Budget
    // minus eigene Zuteilung" (Nutzer 2026-07-20: "spend is per row, not for the total pool").
    let character = characterWithZweiAexten();
    const [w1, w2] = character.equipment;

    character = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 2, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });
    character = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w2.id, { gat: 2, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });

    const sheet = computeSheet(character);
    const rows = buildNahkampfRows(character, sheet);
    const row1 = rows.find((r) => r.key === w1.id && r.grip === '1H')!;
    const row2 = rows.find((r) => r.key === w2.id && r.grip === '1H')!;
    // 7 - 2 (nur die eigene Zuteilung) = 5 fuer JEDE Zeile, nicht 7 - 4 (Summe beider Waffen) = 3.
    expect(row1.pp).toBe(5);
    expect(row2.pp).toBe(5);
  });

  it('addiert den eigenen AT/PA-Ueberschuss ueber 20 dieser Zeile zum Budget, bevor die eigene Zuteilung abgezogen wird', () => {
    // Gleiches Fixture wie characterMutations.test.ts's "Budget beruecksichtigt den Waffen-
    // Ueberschuss ueber 20": w1 kuenstlich auf AT/PA=+10 -> uncAtWeapon/uncPaWeapon=34,
    // Ueberschuss je 14 (atOverflow=14, paOverflow=14). w2 bleibt reguldter Axt-Bonus (kein
    // Ueberschuss). Spez-Budget bleibt 7 fuer beide (Pool-Formel).
    let character = characterWithZweiAexten();
    const [w1, w2] = character.equipment;
    w1.computedStatsSnapshot = { ...w1.computedStatsSnapshot, at: 10, pa: 10 };
    character = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 0, gpa: 0, mat: 5, mpa: 0, nat: 0, npa: 0 });

    const sheet = computeSheet(character);
    const rows = buildNahkampfRows(character, sheet);
    const row1 = rows.find((r) => r.key === w1.id && r.grip === '1H')!;
    const row2 = rows.find((r) => r.key === w2.id && r.grip === '1H')!;
    // w1: (14+14) + 7 - 5 (eigene mAT-Zuteilung) = 30.
    expect(row1.pp).toBe(30);
    // w2: 0 + 7 - 0 (keine eigene Zuteilung, w1's Zuteilung zaehlt hier nicht mit) = 7.
    expect(row2.pp).toBe(7);
  });
});
