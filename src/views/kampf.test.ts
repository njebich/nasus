import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import {
  buyFeuerwaffe, buyFeuerwaffenMunition, buyWeapon, setValue, setWaffenPoolAllocation, addWaffenLoadout, BudgetError,
} from '../state/characterMutations';
import { buildFeuerwaffenRows, buildNahkampfRows, buildLoadoutDisplayRows } from './kampf';
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
    const pistole = findFeuerwaffe('Pistole'); // Typ='Pistole', Verfuegbarkeit-Stufe < 5 (Kaufsperre)
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
    // Budget=7 fuer JEDE Axt fuer sich (reine Pool-Formel bei nk_hiebwaffen=10, siehe
    // characterMutations.test.ts) - seit 2026-07-23 hat jede Waffe ihr eigenes unabhaengiges
    // Budget, PP zeigt entsprechend pro Zeile "eigenes Budget minus eigene Zuteilung".
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

  it('nAT/nPA werden bei 20 gekappt angezeigt, auch wenn die ungedeckelte Basis darueber liegt (Bug, User-Repro 2026-07-23)', () => {
    // nk_hiebwaffen sehr hoch -> unc_at_hiebwaffen weit ueber 20, Axt-Bonus AT=-4/PA=-5 aendert
    // daran nichts. Jede at_X/pa_X-Formel ist selbst MIN(20;...) (siehe waffenPool.ts's
    // stripMin20) - der Ueberschuss darueber fliesst als Pool-Budget ab, darf aber nicht als
    // Anzeigewert >20 im nAT/nPA-Feld stehen bleiben.
    let character = characterWithZweiAexten();
    character.values['nk_hiebwaffen'] = 90;
    const [w1] = character.equipment;

    const sheet = computeSheet(character);
    const rows = buildNahkampfRows(character, sheet);
    const row1 = rows.find((r) => r.key === w1.id && r.grip === '1H')!;
    expect(row1.nat.value).toBeLessThanOrEqual(20);
    expect(row1.npa.value).toBeLessThanOrEqual(20);
    expect(row1.nat.max).toBe(0); // schon ohne Zuteilung ueber 20 -> nichts mehr sinnbar
  });

  it('kein gemeinsames Budget mehr: w2 kann nicht ueber ihr eigenes Budget hinaus zuteilen, selbst wenn eine Geschwister-Waffe im selben Pool einen riesigen eigenen Ueberschuss hat (Bug, User-Repro 2026-07-23: Gladius mit Griffkorb PP=-2)', () => {
    // w1 bekommt einen riesigen eigenen AT/PA-Bonus (grosser eigener Ueberschuss ueber 20), w2
    // bleibt der reguläre, kleine Axt-Bonus (0 eigener Ueberschuss, Budget bleibt bei der reinen
    // Pool-Formel = 7). Vor der 2026-07-23-Korrektur teilten sich beide Waffen EIN gemeinsames
    // Budget (aufgeblaeht durch w1s Ueberschuss); w2 konnte dadurch - jede Einzel-Zuteilung fuer
    // sich validiert - mehr zugeteilt bekommen, als ihr EIGENER Anteil hergab, und ihre
    // Pro-Zeile-PP-Anzeige wurde negativ. Seit der Korrektur hat jede Waffe ihr eigenes
    // unabhaengiges Budget - w2 bleibt bei 7 gedeckelt, unbeeinflusst von w1s riesigem Ueberschuss.
    let character = characterWithZweiAexten();
    const [w1, w2] = character.equipment;
    w1.computedStatsSnapshot = { ...w1.computedStatsSnapshot, at: 50, pa: 50 };

    expect(() => setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w2.id, { gat: 9, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .toThrow(BudgetError); // w2s eigenes Budget bleibt 7, 9 > 7

    // Innerhalb ihres eigenen Budgets (<=7) klappt die Zuteilung weiterhin, und PP bleibt >= 0.
    const updated = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w2.id, { gat: 7, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });
    const sheet = computeSheet(updated);
    const rows = buildNahkampfRows(updated, sheet);
    const row2 = rows.find((r) => r.key === w2.id && r.grip === '1H')!;
    expect(row2.pp).toBe(0);
  });
});

describe('buildNahkampfRows: AT/PA-Balance-Regel (Nutzer-Diktat 2026-07-23)', () => {
  function characterWithEineAxt() {
    let character = baseCharacter();
    character = setValue(character, 'eig_g_mut', 30);
    character = setValue(character, 'eig_k_athletik', 30);
    character = setValue(character, 'eig_k_schnelligkeit', 30);
    character = setValue(character, 'eig_k_staerke', 30);
    character = setValue(character, 'nk_hiebwaffen', 10);
    const axt = NK_WAFFEN_BASIS.find((r) => r.name === 'Axt')!;
    const material = NK_MATERIAL.find((r) => r.name === 'Eisen')!;
    const fertigung = NK_FERTIGUNG.find((r) => r.name === 'Gesellenarbeit')!;
    const anpassung = NK_ANPASSUNG.find((r) => r.name === 'Von der Stange')!;
    const schaftmaterial = NK_SCHAFTMATERIAL.find((r) => r.name === 'Standard')!;
    character = buyWeapon(character, axt.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
    return character;
  }

  // Fixture-Kennwerte (per Probe bestaetigt): nat startet bereits bei 20/max 0, npa bei 19/max 1,
  // gat/gpa-Budget je 9 (Gesamt-Ziel 10), mat/mpa-Budget je 5 (Gesamt-Ziel 26) - also exakt die
  // vom Nutzer genannte "20/10/26"-Obergrenze fuer beide Seiten.

  it('erlaubt bis zu 1 PP Diskrepanz zwischen AT- und PA-Summe (poolValid bleibt true)', () => {
    let character = characterWithEineAxt();
    const [w1] = character.equipment;
    character = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 3, gpa: 2, mat: 0, mpa: 0, nat: 0, npa: 0 });

    const sheet = computeSheet(character);
    const row1 = buildNahkampfRows(character, sheet).find((r) => r.key === w1.id && r.grip === '1H')!;
    expect(row1.atSpent).toBe(3);
    expect(row1.paSpent).toBe(2);
    expect(row1.poolValid).toBe(true);
  });

  it('markiert eine Waffenzeile mit groesserer AT/PA-Diskrepanz als ungueltig, OHNE die Zuteilung zu blockieren (Warn-Icon statt Fehler, Nutzer-Direktive)', () => {
    let character = characterWithEineAxt();
    const [w1] = character.equipment;
    // gat=5 alleine (Budget erlaubt bis 9) - die Zuteilung selbst darf trotz Diskrepanz gelingen.
    expect(() => setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 5, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .not.toThrow();
    character = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 5, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });

    const sheet = computeSheet(character);
    const row1 = buildNahkampfRows(character, sheet).find((r) => r.key === w1.id && r.grip === '1H')!;
    expect(row1.atSpent).toBe(5);
    expect(row1.paSpent).toBe(0);
    expect(row1.poolValid).toBe(false);
  });

  it('hebt die Balance-Regel auf, sobald eine Seite ihr absolutes Maximum (n=20/g=10/m=26) erreicht hat', () => {
    let character = characterWithEineAxt();
    const [w1] = character.equipment;
    // Reine Pool-Formel (7) reicht nicht fuer gat=9+mat=5=14 - eigener AT/PA-Ueberschuss ueber 20
    // (wie in den Budget-Tests oben) hebt das Gesamtbudget an, OHNE gatMax/matMax zu veraendern
    // (die kommen aus der geteilten Kategorie-Referenz, nicht aus dem Waffen-Bonus).
    w1.computedStatsSnapshot = { ...w1.computedStatsSnapshot, at: 10, pa: 10 };
    // Volles AT-Budget (gat=9, mat=5) -> AT erreicht 20/10/26, obwohl PA (npa/gpa/mpa) bei 0 bleibt.
    character = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 9, gpa: 0, mat: 5, mpa: 0, nat: 0, npa: 0 });

    const sheet = computeSheet(character);
    const row1 = buildNahkampfRows(character, sheet).find((r) => r.key === w1.id && r.grip === '1H')!;
    expect(row1.gat.value).toBe(10);
    expect(row1.mat.value).toBe(26);
    expect(row1.paSpent).toBe(0);
    expect(row1.poolValid).toBe(true);
  });
});

describe('buildLoadoutDisplayRows: gAT/gPA/mAT/mPA-Spiegelung der "hoeheren Pool"-Seite', () => {
  function findRow<T extends { name: string; sourceRow: number }>(rows: readonly T[], name: string): T {
    const row = rows.find((r) => r.name === name);
    if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
    return row;
  }

  function buyTestWeapon(character: ReturnType<typeof baseCharacter>, name: string) {
    const row = findRow(NK_WAFFEN_BASIS, name);
    const material = findRow(NK_MATERIAL, 'Eisen');
    const fertigung = findRow(NK_FERTIGUNG, 'Gesellenarbeit');
    const anpassung = findRow(NK_ANPASSUNG, 'Von der Stange');
    const schaftmaterial = findRow(NK_SCHAFTMATERIAL, 'Standard');
    return buyWeapon(character, row.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
  }

  it('spiegelt gAT/gPA/mAT/mPA/PP exakt von der gewinnenden Pool-Seite - identisch zu deren eigener Solo-Zeile', () => {
    let character = baseCharacter();
    character = setValue(character, 'eig_k_staerke', 30);
    character = setValue(character, 'nk_hiebwaffen', 10);
    character = setValue(character, 'nk_stichwaffen', 10);
    character = buyTestWeapon(character, 'Axt');
    character = buyTestWeapon(character, 'Dolch');
    const [axt, dolch] = character.equipment;
    // Dolche-Pool deutlich hoeher investiert als Aexte-Pool -> Dolch (Sekundaerseite) gewinnt.
    character.values['nk_spez_stichwaffen_dolche'] = 50;
    character = addWaffenLoadout(character, 'nk1h_nk1h', axt.id, dolch.id);

    const sheet = computeSheet(character);
    const soloRows = buildNahkampfRows(character, sheet);
    const dolchSoloRow = soloRows.find((r) => r.key === dolch.id && r.grip === '1H')!;

    const loadoutRows = buildLoadoutDisplayRows(character, sheet);
    expect(loadoutRows).toHaveLength(1);
    const pool = loadoutRows[0].pool!;
    expect(pool.gat).toBe(dolchSoloRow.gat.value);
    expect(pool.gpa).toBe(dolchSoloRow.gpa.value);
    expect(pool.mat).toBe(dolchSoloRow.mat.value);
    expect(pool.mpa).toBe(dolchSoloRow.mpa.value);
    expect(pool.pp).toBe(dolchSoloRow.pp);
  });
});
