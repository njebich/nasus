import { RULES, type RuleEntry } from '../data/rules';
import { NK_WAFFEN_BASIS, type GenericRow as WeaponRow } from '../data/equipment/weapons';
import {
  ARMBRUST, BOEGEN, BOLZEN, FEUERWAFFEN, PFEILE, type FernkampfRow,
} from '../data/equipment/fernkampf';
import {
  FEUERWAFFEN_MUNITION_PREISE, type FeuerwaffenMunitionRow,
} from '../data/equipment/feuerwaffenMunition';
import {
  firearmAmmunitionType, firearmAmmoTypeForArt,
} from './ammunitionTypes';
import specializationsJson from '../data/weaponSpecializations.json';

export interface WeaponSpecializationDefinition {
  id: string;
  label: string;
  poolReferenz: string;
  skillable: boolean;
}

const SPECIALIZATIONS = specializationsJson as WeaponSpecializationDefinition[];

function uniqueIndex<T>(
  values: readonly T[],
  keyOf: (value: T) => string,
  describe: (value: T) => string,
  label: string,
): ReadonlyMap<string, T> {
  const index = new Map<string, T>();
  const conflicts = new Map<string, string[]>();
  for (const value of values) {
    const key = keyOf(value);
    const previous = index.get(key);
    if (previous) {
      const entries = conflicts.get(key) ?? [describe(previous)];
      entries.push(describe(value));
      conflicts.set(key, entries);
      continue;
    }
    index.set(key, value);
  }
  if (conflicts.size > 0) {
    const details = [...conflicts.entries()]
      .map(([key, rows]) => `${label} '${key}': ${rows.join(', ')}`)
      .join('\n');
    throw new Error(`Ungültiger Waffen-Katalog – doppelte Schlüssel:\n${details}`);
  }
  return index;
}

export const WEAPON_SPECIALIZATION_BY_ID = uniqueIndex(
  SPECIALIZATIONS, (definition) => definition.id, (definition) => definition.label, 'Spezialisierungs-ID',
);
export const WEAPON_SPECIALIZATION_BY_LABEL = uniqueIndex(
  SPECIALIZATIONS, (definition) => definition.label, (definition) => definition.id, 'Spezialisierungsname',
);

export const MELEE_WEAPON_BY_SOURCE_ROW = uniqueIndex(
  NK_WAFFEN_BASIS,
  (row) => String(row.sourceRow),
  (row) => `NK-Waffen-Basis Zeile ${row.sourceRow} (${row.name})`,
  'NK-Waffen-Basis sourceRow',
);
export const BOW_BY_SOURCE_ROW = uniqueIndex(
  BOEGEN, (row) => String(row.sourceRow), (row) => `Bögen-Basis Zeile ${row.sourceRow} (${row.name})`, 'Bögen sourceRow',
);
export const CROSSBOW_BY_SOURCE_ROW = uniqueIndex(
  ARMBRUST, (row) => String(row.sourceRow), (row) => `Armbrust-Basis Zeile ${row.sourceRow} (${row.name})`, 'Armbrust sourceRow',
);
export const FIREARM_BY_SOURCE_ROW = uniqueIndex(
  FEUERWAFFEN, (row) => String(row.sourceRow), (row) => `Feuerwaffen Zeile ${row.sourceRow} (${row.name})`, 'Feuerwaffen sourceRow',
);
export const ARROW_BY_SOURCE_ROW = uniqueIndex(
  PFEILE, (row) => String(row.sourceRow), (row) => `Pfeile Zeile ${row.sourceRow} (${row.name})`, 'Pfeile sourceRow',
);
export const BOLT_BY_SOURCE_ROW = uniqueIndex(
  BOLZEN, (row) => String(row.sourceRow), (row) => `Bolzen Zeile ${row.sourceRow} (${row.name})`, 'Bolzen sourceRow',
);

export function weaponSpecializationForLabel(label: string | undefined): WeaponSpecializationDefinition {
  if (!label) throw new Error('Spezialisierung fehlt');
  const definition = WEAPON_SPECIALIZATION_BY_LABEL.get(label);
  if (!definition) throw new Error(`Unbekannte Spezialisierung '${label}'`);
  return definition;
}

export function weaponSpecializationForRow(
  table: string,
  row: WeaponRow | FernkampfRow,
): WeaponSpecializationDefinition {
  try {
    return weaponSpecializationForLabel(row['Spezialisierung']);
  } catch (error) {
    const shortcoming = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Ungültige Waffe: Tabelle '${table}', sourceRow ${row.sourceRow}, Waffe '${row.name}', `
      + `Spezialisierung '${row['Spezialisierung'] ?? '<fehlt>'}': ${shortcoming}`,
    );
  }
}

export const FIREARM_AMMO_BY_ART_AND_CALIBER = uniqueIndex(
  FEUERWAFFEN_MUNITION_PREISE,
  (row) => `${row.art}:${row.kaliber}`,
  (row) => `${row.label}, Kaliber ${row.kaliber}`,
  'Feuerwaffen-Munition',
);

export interface WeaponCatalogValidationResult {
  errors: string[];
}

function poolRulesByReference(rules: readonly RuleEntry[]): ReadonlyMap<string, RuleEntry> {
  return uniqueIndex(
    rules.filter((rule) => rule.art === 'Pool' && rule.kategorie === 'Nahkampf' && rule.referenz !== 'nk_pool_unbewaffnet'),
    (rule) => rule.referenz,
    (rule) => `Werte Zeile ${rule.sourceRow} (${rule.beschreibung ?? rule.referenz})`,
    'Pool-Referenz',
  );
}

export function validateWeaponCatalog(): WeaponCatalogValidationResult {
  const errors: string[] = [];
  const pools = poolRulesByReference(RULES);
  for (const definition of SPECIALIZATIONS) {
    if (!pools.has(definition.poolReferenz)) {
      errors.push(
        `Spezialisierung '${definition.id}' (${definition.label}) verweist auf fehlenden Pool '${definition.poolReferenz}'`,
      );
    }
  }
  const tables: ReadonlyArray<readonly [string, readonly (WeaponRow | FernkampfRow)[]]> = [
    ['NK-Waffen-Basis', NK_WAFFEN_BASIS],
    ['Bögen-Basis', BOEGEN],
    ['Armbrust-Basis', ARMBRUST],
    ['Feuerwaffen', FEUERWAFFEN],
  ];
  for (const [table, rows] of tables) {
    for (const row of rows) {
      try {
        weaponSpecializationForRow(table, row);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
  }
  for (const row of FEUERWAFFEN) {
    const typeId = firearmAmmunitionType(row['Lademechanik'] ?? '', row['Munition'] ?? '');
    if (!typeId) {
      errors.push(
        `Ungültige Waffe: Tabelle 'Feuerwaffen', sourceRow ${row.sourceRow}, Waffe '${row.name}': Munitions-Typ fehlt`,
      );
    }
  }
  for (const row of FEUERWAFFEN_MUNITION_PREISE) {
    if (!firearmAmmoTypeForArt(row.art)) {
      errors.push(`Ungültige Munition: '${row.art}', Kaliber ${row.kaliber}: Munitions-Typ fehlt`);
    }
  }
  return { errors };
}

export function assertValidWeaponCatalog(): void {
  const { errors } = validateWeaponCatalog();
  if (errors.length > 0) throw new Error(`Ungültiger Waffen-Katalog:\n${errors.join('\n')}`);
}

export type { WeaponRow, FernkampfRow, FeuerwaffenMunitionRow };
