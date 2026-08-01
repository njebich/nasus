import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import {
  buyFernkampfwaffe, buyFeuerwaffe, buyFeuerwaffenMunition, buyMunition, buyWeapon, setValue,
  setWaffenPoolAllocation, addWaffenLoadout, BudgetError,
} from '../state/characterMutations';
import {
  buildArmbrustBoegenRows, buildFeuerwaffenRows, buildNahkampfRows, buildLoadoutDisplayRows,
  previewWaffenPoolAllocation, renderKampfView,
} from './kampf';
import { ARMBRUST, BOEGEN, BOLZEN, FEUERWAFFEN, PFEILE } from '../data/equipment/fernkampf';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import { feuerwaffenStandardauswahl, composeFeuerwaffe } from '../engine/feuerwaffenComposition';
import { computeSheet } from '../engine/characterSheet';
import { TALENTE_KAMPFMODUL } from '../data/talenteKampfmodul';

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

describe('vollstaendiger Kampfbereich mit gemeinsamer LE/RS-Zustandsanzeige', () => {
  it('stellt den identischen Zustandsblock vor alle bestehenden Kampfsektionen', () => {
    const character = baseCharacter();
    character.selections[TALENTE_KAMPFMODUL[0].toLowerCase()] = 1;
    const container = document.createElement('div');
    renderKampfView(container, computeSheet(character), character, () => {}, () => {}, () => {}, () => {});

    expect(container.querySelector('h3')?.textContent).toBe('Lebensenergie & Rüstungsschutz');
    expect([...container.querySelectorAll('.kampf-tz-rechts-label')].map((node) => node.textContent)).toEqual([
      'Gesundheit', 'Trefferschwelle', 'Selbstbeherrschung', 'Rüstungshinderlichkeit', 'RBE',
    ]);
    const headings = [...container.querySelectorAll('h3')].map((heading) => heading.textContent);
    expect(headings).toEqual(expect.arrayContaining([
      'Nahkampf', 'Waffen-Loadout', 'Ausweichen / Bewegung', 'Talent-Effekte (Kampfmodul)',
    ]));
  });

  it('behaelt geoeffnete Trefferzonen beim Neurendern nach bestaetigter Poolaenderung', () => {
    let character = baseCharacter();
    character = setValue(character, 'eig_g_mut', 30);
    character = setValue(character, 'eig_k_athletik', 30);
    character = setValue(character, 'eig_k_schnelligkeit', 30);
    character = setValue(character, 'eig_k_staerke', 30);
    character = setValue(character, 'nk_hiebwaffen', 10);
    const axt = NK_WAFFEN_BASIS.find((row) => row.name === 'Axt')!;
    const material = NK_MATERIAL.find((row) => row.name === 'Eisen')!;
    const fertigung = NK_FERTIGUNG.find((row) => row.name === 'Gesellenarbeit')!;
    const anpassung = NK_ANPASSUNG.find((row) => row.name === 'Von der Stange')!;
    const schaftmaterial = NK_SCHAFTMATERIAL.find((row) => row.name === 'Standard')!;
    character = buyWeapon(
      character, axt.sourceRow, material.sourceRow, fertigung.sourceRow,
      anpassung.sourceRow, schaftmaterial.sourceRow,
    );

    const container = document.createElement('div');
    document.body.append(container);
    const render = () => renderKampfView(
      container, computeSheet(character), character,
      (referenz, equipmentId, allocation) => {
        character = setWaffenPoolAllocation(character, referenz, equipmentId, allocation);
        render();
      },
      () => {}, () => {}, () => {},
    );

    try {
      render();
      const torso = container.querySelector<HTMLDetailsElement>('[data-kampf-tz-gruppe="torso"]')!;
      torso.open = true;
      const increment = container.querySelector<HTMLButtonElement>('.kampf-pool-cell .stat-inc:not([disabled])')!;
      expect(increment).toBeTruthy();
      increment.click();
      container.querySelector<HTMLButtonElement>('.kampf-allocation-apply')!.click();

      expect(container.querySelector<HTMLDetailsElement>('[data-kampf-tz-gruppe="torso"]')?.open).toBe(true);
    } finally {
      container.remove();
    }
  });
});

describe('buildFeuerwaffenRows', () => {
  it('zeigt eine leere Munition-Zelle, wenn keine passende Feuerwaffen-Munition besessen wird', () => {
    const muskete = findFeuerwaffe('Muskete'); // Typ='Gewehr'
    const selections = feuerwaffenStandardauswahl(muskete);
    let character = baseCharacter();
    character = buyFeuerwaffe(character, muskete.sourceRow, selections);

    const rows = buildFeuerwaffenRows(character);
    expect(rows).toHaveLength(1);
    expect(rows[0].munition).toBe('–');
    expect(rows[0].rangedUsable).toBe(false);
    expect(rows[0].ranges).toEqual(['x', 'x', 'x', 'x', 'x', 'x']);
    expect(rows[0].nk).not.toBeNull();
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
    expect(rows[0].rangedUsable).toBe(true);
  });

  it('dupliziert eine Feuerwaffe fuer jeden kompatiblen Munitionsstapel', () => {
    const muskete = findFeuerwaffe('Muskete');
    const selections = feuerwaffenStandardauswahl(muskete);
    const composed = composeFeuerwaffe(muskete, selections);
    let character = baseCharacter();
    character = buyFeuerwaffe(character, muskete.sourceRow, selections);
    character = buyFeuerwaffenMunition(character, 'blei_pulver', composed.kaliber, 10);
    character = buyFeuerwaffenMunition(character, 'papierpatrone_vl', composed.kaliber, 1);

    const rows = buildFeuerwaffenRows(character);
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.munition)).toEqual([
      expect.stringContaining('10 Stück'),
      expect.stringContaining('1 Stück'),
    ]);
  });

  it('Typ="Gewehr" nutzt die Musketen-Pool-Familie, Typ="Pistole" die Pistolen-Familie (unterschiedliche Reichweiten-Basiswerte)', () => {
    const muskete = findFeuerwaffe('Muskete'); // Typ='Gewehr'
    const pistole = findFeuerwaffe('Pistole'); // Typ='Pistole', Verfuegbarkeit-Stufe < 5 (Kaufsperre)
    let character = baseCharacter();
    const musketeSelections = feuerwaffenStandardauswahl(muskete);
    const pistoleSelections = feuerwaffenStandardauswahl(pistole);
    const musketeComposed = composeFeuerwaffe(muskete, musketeSelections);
    const pistoleComposed = composeFeuerwaffe(pistole, pistoleSelections);
    character = buyFeuerwaffe(character, muskete.sourceRow, musketeSelections);
    character = buyFeuerwaffe(character, pistole.sourceRow, pistoleSelections);
    character = buyFeuerwaffenMunition(character, 'blei_pulver', musketeComposed.kaliber, 10);
    character = buyFeuerwaffenMunition(character, 'blei_pulver', pistoleComposed.kaliber, 10);

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

describe('buildArmbrustBoegenRows: aufgeloestes Inventar', () => {
  const bogen = BOEGEN.find((row) => row.name === 'Improvisierter Bogen')!;
  const pfeil = PFEILE.find((row) => row.name === 'Holzspitzen-Pfeil')!;
  const spitze = PFEILE.find((row) => row.name === 'Breitkopfspitzen-Pfeil')!;

  it('dupliziert die Waffenzeile fuer jeden besessenen kompatiblen Munitionsstapel', () => {
    let character = baseCharacter();
    character = buyFernkampfwaffe(character, 'boegen', bogen.sourceRow);
    character = buyMunition(character, 'pfeile', pfeil.sourceRow, null, 10);
    character = buyMunition(character, 'pfeile', pfeil.sourceRow, spitze.sourceRow, 5);

    const rows = buildArmbrustBoegenRows(character, 'boegen');
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.munition)).toEqual([
      'Holzspitzen-Pfeil (10 Stück)',
      'Breitkopfspitzen-Pfeil (Holzspitzen-Pfeil) (5 Stück)',
    ]);
  });

  it('zeigt die bestaetigte Waffe auch ohne kompatible Munition', () => {
    const character = buyFernkampfwaffe(baseCharacter(), 'boegen', bogen.sourceRow);
    const rows = buildArmbrustBoegenRows(character, 'boegen');
    expect(rows).toHaveLength(1);
    expect(rows[0].munition).toBe('–');
    expect(rows[0].rangedUsable).toBe(false);
    expect(rows[0].nk).not.toBeNull();
  });

  it('wendet denselben Snapshot-/Duplikationspfad auf Armbrust und Bolzen an', () => {
    const armbrust = ARMBRUST.find((row) => row.name === 'Improvisierte Armbrust')!;
    const bolzen = BOLZEN.find((row) => row['Kategorie'] !== 'Spitzen-Modifikator' && row.preisDublonen !== undefined)!;
    let character = baseCharacter();
    character = buyFernkampfwaffe(character, 'armbrust', armbrust.sourceRow);
    character = buyMunition(character, 'bolzen', bolzen.sourceRow, null, 7);

    const rows = buildArmbrustBoegenRows(character, 'armbrust');
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe(armbrust.name);
    expect(rows[0].munition).toBe(`${bolzen.name} (7 Stück)`);
  });

  it('addiert den Schadenswuerfel des Bolzens zum Schadenswuerfel der Armbrust', () => {
    const armbrust = ARMBRUST.find((row) => row.name === 'Mittelschwere Armbrust' && row['1.W'] === '1W10')!;
    const stahlbolzen = BOLZEN.find((row) => row.name === 'Stahlspitzen-Bolzen')!;
    const bronzebolzen = BOLZEN.find((row) => row.name === 'Bronzespitzen-Bolzen')!;

    let mitStahl = buyFernkampfwaffe(baseCharacter(), 'armbrust', armbrust.sourceRow);
    mitStahl = buyMunition(mitStahl, 'bolzen', stahlbolzen.sourceRow, null, 1);
    expect(buildArmbrustBoegenRows(mitStahl, 'armbrust')[0].schaden).toBe('2W10');

    let mitBronze = buyFernkampfwaffe(baseCharacter(), 'armbrust', armbrust.sourceRow);
    mitBronze = buyMunition(mitBronze, 'bolzen', bronzebolzen.sourceRow, null, 1);
    expect(buildArmbrustBoegenRows(mitBronze, 'armbrust')[0].schaden).toBe('W10+W8');
  });

  it('liest im Kampf-Tab Namen und Fernkampfschaden aus dem Inventar-Snapshot statt erneut aus dem Katalog', () => {
    let character = buyFernkampfwaffe(baseCharacter(), 'boegen', bogen.sourceRow);
    character = buyMunition(character, 'pfeile', pfeil.sourceRow, null, 10);
    const oldName = bogen.name;
    const oldWuerfel = bogen['1.W'];
    try {
      bogen.name = 'Katalog wurde nach Kauf geaendert';
      bogen['1.W'] = 'W999';
      const [row] = buildArmbrustBoegenRows(character, 'boegen');
      expect(row.label).toBe(oldName);
      expect(row.schaden).toBe('W4+W6');
    } finally {
      bogen.name = oldName;
      bogen['1.W'] = oldWuerfel;
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

  it('berechnet eine lokale Zuteilungsvorschau, ohne den persistierten Charakter zu verändern', () => {
    const character = characterWithZweiAexten();
    const [w1] = character.equipment;
    const sheet = computeSheet(character);
    const row = buildNahkampfRows(character, sheet).find((candidate) => candidate.key === w1.id && candidate.grip === '1H')!;
    const originalPp = row.pp;

    const preview = previewWaffenPoolAllocation(row, {
      gat: 2, gpa: 1, mat: 0, mpa: 0, nat: 0, npa: 0,
    });

    expect(preview.gat.allocated).toBe(2);
    expect(preview.gat.value).toBe(row.gat.value + 2);
    expect(preview.gpa.value).toBe(row.gpa.value + 1);
    expect(preview.pp).toBe(originalPp - 3);
    expect(row.gat.allocated).toBe(0);
    expect(character.poolAllocations).toEqual({});
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

describe('buildNahkampfRows: ungueltige gespeicherte Waffen', () => {
  it('behaelt einen fehlenden Katalogeintrag sichtbar und deaktiviert alle Kampfwerte', () => {
    const character = baseCharacter();
    character.equipment.push({
      id: 'stale-waffe',
      family: 'weapon',
      baseTable: 'nk_waffen_basis',
      baseId: '99999',
      selections: {},
      quantity: 1,
      displayNameSnapshot: 'Alte Waffe',
      invalidReason: "Ungültige Waffe: Tabelle 'NK-Waffen-Basis', sourceRow 99999: Katalogeintrag fehlt",
    });

    const row = buildNahkampfRows(character, computeSheet(character))
      .find((candidate) => candidate.key === 'stale-waffe')!;
    expect(row.usable).toBe(false);
    expect(row.poolReferenz).toBeNull();
    expect(row.schaden).toBe('–');
    expect(row.unusableReason).toContain('Katalogeintrag fehlt');
  });

  it('deaktiviert eine Waffe mit unbekannter stabiler Spezialisierungs-ID detailliert', () => {
    let character = baseCharacter();
    const axt = NK_WAFFEN_BASIS.find((row) => row.name === 'Axt')!;
    const material = NK_MATERIAL.find((row) => row.name === 'Eisen')!;
    const fertigung = NK_FERTIGUNG.find((row) => row.name === 'Gesellenarbeit')!;
    const anpassung = NK_ANPASSUNG.find((row) => row.name === 'Von der Stange')!;
    const schaftmaterial = NK_SCHAFTMATERIAL.find((row) => row.name === 'Standard')!;
    character = buyWeapon(
      character, axt.sourceRow, material.sourceRow, fertigung.sourceRow,
      anpassung.sourceRow, schaftmaterial.sourceRow,
    );
    character.equipment[0].specializationId = 'nk_spez_fehlt';

    const row = buildNahkampfRows(character, computeSheet(character))
      .find((candidate) => candidate.key === character.equipment[0].id)!;
    expect(row.usable).toBe(false);
    expect(row.poolReferenz).toBeNull();
    expect(row.unusableReason).toMatch(/Spezialisierungs-ID 'nk_spez_fehlt'.*Referenz fehlt/);
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

describe('Waffen-Loadout-Auswahl und getrennte Tabellen', () => {
  function buyAxt(character: ReturnType<typeof baseCharacter>) {
    const axt = NK_WAFFEN_BASIS.find((row) => row.name === 'Axt')!;
    const material = NK_MATERIAL.find((row) => row.name === 'Eisen')!;
    const fertigung = NK_FERTIGUNG.find((row) => row.name === 'Gesellenarbeit')!;
    const anpassung = NK_ANPASSUNG.find((row) => row.name === 'Von der Stange')!;
    const schaftmaterial = NK_SCHAFTMATERIAL.find((row) => row.name === 'Standard')!;
    return buyWeapon(
      character, axt.sourceRow, material.sourceRow, fertigung.sourceRow,
      anpassung.sourceRow, schaftmaterial.sourceRow,
    );
  }

  it('macht zwei gleiche besessene Waffen als getrennte Exemplare auswählbar', () => {
    let character = buyAxt(buyAxt(baseCharacter()));
    const [axt1, axt2] = character.equipment;
    const container = document.createElement('div');
    let added = character;
    renderKampfView(
      container, computeSheet(character), character, () => {},
      (comboType, primaryId, secondaryId) => {
        added = addWaffenLoadout(character, comboType, primaryId, secondaryId);
      },
      () => {}, () => {},
    );

    const fieldset = container.querySelector<HTMLElement>('[data-combo-type="nk1h_nk1h"]')!;
    const selects = fieldset.querySelectorAll<HTMLSelectElement>('select');
    expect([...selects[0].options].map((option) => option.textContent)).toContain('Axt (1)');
    expect([...selects[0].options].map((option) => option.textContent)).toContain('Axt (2)');

    selects[0].value = axt1.id;
    selects[1].value = axt2.id;
    container.querySelector<HTMLButtonElement>('.loadout-add-btn')!.click();

    expect(added.waffenLoadouts[0]).toMatchObject({
      comboType: 'nk1h_nk1h', primaryEquipmentId: axt1.id, secondaryEquipmentId: axt2.id,
    });
  });

  it('zeigt ein gemischtes NK/Pistolen-Loadout in getrennten NK- und FK-Tabellen', () => {
    let character = buyAxt(baseCharacter());
    const pistole = FEUERWAFFEN.find((row) => row['Typ'] === 'Pistole' && (row.verfuegbarkeitStufe ?? 1) < 5)!;
    character = buyFeuerwaffe(character, pistole.sourceRow, feuerwaffenStandardauswahl(pistole));
    const [axt, pistoleEntry] = character.equipment;
    character = addWaffenLoadout(character, 'nk1h_pistole', axt.id, pistoleEntry.id);

    const container = document.createElement('div');
    renderKampfView(container, computeSheet(character), character, () => {}, () => {}, () => {}, () => {});

    const nkTable = container.querySelector<HTMLTableElement>('[data-loadout-table="nk"]')!;
    const fkTable = container.querySelector<HTMLTableElement>('[data-loadout-table="fk"]')!;
    expect(nkTable.caption?.textContent).toBe('Nahkampf');
    expect(fkTable.caption?.textContent).toBe('Fernkampf');
    expect(nkTable.textContent).toContain(`Axt+${pistole.name}`);
    expect(fkTable.textContent).toContain(`Axt+${pistole.name}`);
    expect(nkTable.textContent).not.toContain('FK-Reichweiten');
    expect(fkTable.textContent).not.toContain('nAT');
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
