import type { EquipmentEntry } from '../state/characterStore';
import type { GenericRow } from '../data/equipment/armor';
import {
  NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL,
} from '../data/equipment/weapons';
import { MELEE_WEAPON_BY_SOURCE_ROW } from '../engine/weaponCatalog';
import { formatSchadenswuerfel } from '../engine/waffenSchaden';
import type { ComposedWeapon } from '../engine/weaponComposition';

export interface WeaponDisplay {
  title: string;
  stats: string;
}

function selectedName(rows: GenericRow[], sourceRow: string | undefined): string | undefined {
  if (!sourceRow) return undefined;
  return rows.find((row) => String(row.sourceRow) === sourceRow)?.name;
}

function weaponTitle(
  basis: GenericRow,
  materialName: string | undefined,
  fertigungName: string | undefined,
  anpassungName: string | undefined,
): string {
  return [basis.name, materialName, fertigungName, anpassungName].filter(Boolean).join(', ');
}

function weaponStats(
  basis: GenericRow,
  stats: { at?: number; pa?: number; staerkeMalus?: number; rb?: number },
  schaftmaterialName: string | undefined,
): string {
  const staerkeTeiler = basis['Staerke-Teiler']?.trim() || '–';
  const staerkeMalus = stats.staerkeMalus ?? 0;
  const specials = basis['Art-Specials']?.trim();
  const schaft = schaftmaterialName && schaftmaterialName !== 'Standard'
    ? schaftmaterialName
    : specials?.includes('Holzschaft') ? 'Holzschaft' : undefined;
  return [
    `n-Mod ${stats.at ?? '–'}/${stats.pa ?? '–'}`,
    `TP ${formatSchadenswuerfel(basis)}`,
    `Stä-Mod :${staerkeTeiler}${staerkeMalus >= 0 ? `+${staerkeMalus}` : staerkeMalus}`,
    `RB ${stats.rb ?? 0}`,
    schaft,
  ].filter(Boolean).join(', ');
}

/** Einheitliche Kurzbeschreibung für Kaufbildschirm und beide Besitzansichten. */
export function describeWeaponSelection(
  basis: GenericRow,
  material: GenericRow,
  fertigung: GenericRow,
  anpassung: GenericRow,
  schaftmaterial: GenericRow,
  composed: ComposedWeapon,
): WeaponDisplay {
  return {
    title: weaponTitle(basis, material.name, fertigung.name, anpassung.name),
    stats: weaponStats(basis, composed, schaftmaterial.name),
  };
}

export function describeStoredWeapon(entry: EquipmentEntry): WeaponDisplay | undefined {
  if (entry.family !== 'weapon') return undefined;
  const basis = MELEE_WEAPON_BY_SOURCE_ROW.get(entry.baseId);
  if (!basis) return undefined;
  const materialName = selectedName(NK_MATERIAL, entry.selections.material);
  const fertigungName = selectedName(NK_FERTIGUNG, entry.selections.fertigung);
  const anpassungName = selectedName(NK_ANPASSUNG, entry.selections.anpassung);
  const schaftmaterialName = selectedName(NK_SCHAFTMATERIAL, entry.selections.schaftmaterial);
  return {
    title: weaponTitle(basis, materialName, fertigungName, anpassungName),
    stats: weaponStats(basis, entry.computedStatsSnapshot ?? {}, schaftmaterialName),
  };
}
