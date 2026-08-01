import { describe, expect, it } from 'vitest';
import {
  NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL,
} from '../data/equipment/weapons';
import { composeWeapon } from '../engine/weaponComposition';
import { describeStoredWeapon, describeWeaponSelection } from './weaponDisplay';

describe('einheitliche Waffen-Kurzbeschreibung', () => {
  it('zeigt für die Beispiel-Axt Auswahl und tatsächlich komponierte Werte', () => {
    const basis = NK_WAFFEN_BASIS.find((row) => row.sourceRow === 5)!;
    const material = NK_MATERIAL.find((row) => row.name === 'Stahl')!;
    const fertigung = NK_FERTIGUNG.find((row) => row.name === 'Meisterarbeit')!;
    const anpassung = NK_ANPASSUNG.find((row) => row.name === 'Perfekt angepasst')!;
    const schaft = NK_SCHAFTMATERIAL.find((row) => row.name === 'Standard')!;
    const composed = composeWeapon(basis, material, fertigung, anpassung, schaft);

    expect(describeWeaponSelection(basis, material, fertigung, anpassung, schaft, composed)).toEqual({
      title: 'Axt, Stahl, Meisterarbeit, Perfekt angepasst',
      stats: 'n-Mod -2/-2, TP W20, Stä-Mod :2-5, RB 0, Holzschaft',
    });
  });

  it('rekonstruiert dieselbe Beschreibung aus einem gespeicherten Kauf', () => {
    const display = describeStoredWeapon({
      id: 'axt', family: 'weapon', baseTable: 'nk_waffen_basis', baseId: '5', quantity: 1,
      selections: { material: '3', fertigung: '6', anpassung: '4', schaftmaterial: '2' },
      computedStatsSnapshot: { at: -2, pa: -2, staerkeMalus: -5, rb: 0 },
    });
    expect(display?.title).toBe('Axt, Stahl, Meisterarbeit, Perfekt angepasst');
    expect(display?.stats).toBe('n-Mod -2/-2, TP W20, Stä-Mod :2-5, RB 0, Holzschaft');
  });
});
