import type { FeuerwaffenMunitionArt } from '../data/equipment/feuerwaffenMunition';

export type AmmunitionTypeId =
  | 'pfeil'
  | 'bolzen'
  | 'feuerwaffe:vorderlader'
  | 'feuerwaffe:hinterlader'
  | 'feuerwaffe:patronenwaffe'
  | 'feuerwaffe:harpune';

export function rangedWeaponAmmunitionType(table: 'boegen' | 'armbrust'): AmmunitionTypeId {
  return table === 'boegen' ? 'pfeil' : 'bolzen';
}

export function firearmAmmunitionType(lademechanik: string, munition: string): AmmunitionTypeId {
  if (munition === 'Harpune') return 'feuerwaffe:harpune';
  if (lademechanik === 'Vorderlader') return 'feuerwaffe:vorderlader';
  if (lademechanik === 'Hinterlader') return 'feuerwaffe:hinterlader';
  return 'feuerwaffe:patronenwaffe';
}

const FIREARM_AMMO_TYPE_BY_ART: Readonly<Record<FeuerwaffenMunitionArt, AmmunitionTypeId>> = {
  blei_pulver: 'feuerwaffe:vorderlader',
  papierpatrone_vl: 'feuerwaffe:vorderlader',
  papierpatrone: 'feuerwaffe:hinterlader',
  messingpatrone: 'feuerwaffe:patronenwaffe',
  harpune: 'feuerwaffe:harpune',
};

export function firearmAmmoTypeForArt(art: string): AmmunitionTypeId | undefined {
  return FIREARM_AMMO_TYPE_BY_ART[art as FeuerwaffenMunitionArt];
}
