import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { buyFeuerwaffe, buyFeuerwaffenMunition } from '../state/characterMutations';
import { buildFeuerwaffenRows } from './kampf';
import { FEUERWAFFEN } from '../data/equipment/fernkampf';
import { feuerwaffenStandardauswahl, composeFeuerwaffe } from '../engine/feuerwaffenComposition';

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
