import { describe, expect, it } from 'vitest';
import { RULES } from '../data/rules';
import {
  validateWeaponCatalog, weaponSpecializationForLabel,
  WEAPON_SPECIALIZATION_BY_ID,
} from './weaponCatalog';

describe('kanonischer Waffen-Katalog', () => {
  it('validiert alle Waffen, Spezialisierungen, Pool-Referenzen und eindeutigen sourceRows', () => {
    expect(validateWeaponCatalog().errors).toEqual([]);
  });

  it('enthaelt den generischen Unbewaffnet-Pool nicht mehr im Laufzeit-Regelwerk', () => {
    expect(RULES.some((rule) => rule.referenz === 'nk_pool_unbewaffnet')).toBe(false);
    expect(weaponSpecializationForLabel('Unbewaffnet').poolReferenz)
      .toBe('nk_pool_unbewaffnet_unbewaffnet');
  });

  it('fuehrt improvisierte Fernkampf-NK-Spezialisierungen stabil, aber nicht skillbar', () => {
    expect(WEAPON_SPECIALIZATION_BY_ID.get('nk_spez_hiebwaffen_improvisierte_hiebwaffen'))
      .toMatchObject({ label: 'Improvisierte Hiebwaffen', poolReferenz: 'nk_pool_hiebwaffen', skillable: false });
    expect(WEAPON_SPECIALIZATION_BY_ID.get('nk_spez_stangenwaffen_improvisierte_stangenwaffen'))
      .toMatchObject({ label: 'Improvisierte Stangenwaffen', poolReferenz: 'nk_pool_stangenwaffen', skillable: false });
  });

  it('meldet eine fehlende oder unbekannte Spezialisierung detailliert', () => {
    expect(() => weaponSpecializationForLabel('')).toThrow('Spezialisierung fehlt');
    expect(() => weaponSpecializationForLabel('Nicht vorhanden'))
      .toThrow("Unbekannte Spezialisierung 'Nicht vorhanden'");
  });
});
