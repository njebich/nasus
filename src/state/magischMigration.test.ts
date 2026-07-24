import { describe, expect, it } from 'vitest';
import { loadCharacter } from './characterStore';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { ALCHEMIKA } from '../data/equipment/alchemika';

describe('loadCharacter: unsichtbares magisch-Flag', () => {
  it('migriert alte Artefakte und Alchemika anhand ihrer autoritativen Kategorie/Sheet-Flag', () => {
    const artefakt = ARTEFAKT_KOSTEN[0];
    const magischesAlchemika = ALCHEMIKA.find((row) => row.magisch)!;
    const profanesAlchemika = ALCHEMIKA.find((row) => !row.magisch)!;
    const id = 'alt-charakter-vor-magisch-flag';
    localStorage.setItem(`nasus:character:${id}`, JSON.stringify({
      id,
      name: 'Alt',
      spezies: 'Mensch',
      createdAt: '',
      updatedAt: '',
      values: {},
      selections: {},
      poolAllocations: {},
      equipment: [
        {
          id: 'artefakt',
          family: 'artefakt',
          baseTable: 'artefakt_kosten',
          baseId: String(artefakt.sourceRow),
          selections: { variant: 'einmalig' },
          quantity: 1,
        },
        {
          id: 'magisches-alchemika',
          family: 'alchemika',
          baseTable: 'alchemika',
          baseId: String(magischesAlchemika.sourceRow),
          selections: {},
          quantity: 1,
        },
        {
          id: 'profanes-alchemika',
          family: 'alchemika',
          baseTable: 'alchemika',
          baseId: String(profanesAlchemika.sourceRow),
          selections: {},
          quantity: 1,
        },
      ],
    }));

    const loaded = loadCharacter(id)!;
    expect(loaded.equipment.find((entry) => entry.id === 'artefakt')?.magisch).toBe(true);
    expect(loaded.equipment.find((entry) => entry.id === 'magisches-alchemika')?.magisch).toBe(true);
    expect(loaded.equipment.find((entry) => entry.id === 'profanes-alchemika')?.magisch).toBeUndefined();
  });
});
