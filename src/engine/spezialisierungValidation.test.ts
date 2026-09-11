import { describe, expect, it } from 'vitest';
import { computeSheet } from './characterSheet';
import { createCharacter } from '../state/characterStore';
import { createCharacterCheckpoint } from '../state/characterFile';
import { setValue } from '../state/characterMutations';

const errors = (c: ReturnType<typeof createCharacter>) => computeSheet(c).validationIssues.filter((issue) => issue.message.includes('Spezialisierung'));

describe('Spezialisierungsgrenzen auch für importierte Werte', () => {
  it.each([
    ['nk_stangenwaffen', 'nk_spez_stangenwaffen_staebe'],
    ['fk_feuerwaffen', 'fk_spez_feuerwaffen_musketen'],
    ['whk_rechtskunde', 'whk_spez_rechtskunde_strafrecht'],
  ])('meldet die gleiche Grenze wie setValue: %s', (parent, child) => {
    const c = createCharacter('Import', { spezies: 'Goblins' });
    c.values[parent] = 8;
    c.values[child] = 9;
    expect(() => setValue(c, child, 9)).toThrow('Hauptfertigkeit');
    expect(errors(c)).toHaveLength(1);
    expect(() => createCharacterCheckpoint(c, 'Ungültiger Import')).toThrow('Spezialisierung');
    c.values[parent] = 9;
    expect(errors(c)).toEqual([]);
    c.values[parent] = 0;
    expect(errors(c)).toHaveLength(1);
  });

  it('prüft freie WHK unter festen und freien Hauptfertigkeiten', () => {
    const c = createCharacter('Import', { spezies: 'Goblins' });
    c.customWhkHauptfertigkeiten = [{ id: 'custom', name: 'Handwerk', wert: 3 }];
    c.values.whk_rechtskunde = 3;
    c.customWhkSpezialisierungen = {
      custom: [{ id: 'one', name: 'Detail', wert: 4 }],
      whk_rechtskunde: [{ id: 'two', name: 'Sonderrecht', wert: 4 }],
    };
    expect(errors(c)).toHaveLength(2);
    c.customWhkHauptfertigkeiten[0].wert = 4;
    c.values.whk_rechtskunde = 4;
    expect(errors(c)).toEqual([]);
  });

  it('behandelt PSI-Baumvoraussetzungen nicht als Spezialisierungsdeckel', () => {
    const c = createCharacter('PSI', { spezies: 'Goblins' });
    c.values.psi_telekinese = 10;
    c.values.psi_kryokinese = 15;
    expect(errors(c)).toEqual([]);
  });
});
