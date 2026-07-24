import { ARMBRUST, BOEGEN, BOLZEN, PFEILE, type FernkampfRow } from '../data/equipment/fernkampf';
import { composeMunition } from './pfeilBolzenComposition';

export type RangedWeaponTable = 'boegen' | 'armbrust';
export type RangedAmmoTable = 'pfeile' | 'bolzen';

export interface RangedWeaponInventorySnapshot {
  kind: 'ranged-weapon';
  table: RangedWeaponTable;
  name: string;
  preisDublonen?: number;
  fernkampfWuerfel: string;
  schadenswuerfel1: string;
  schadenswuerfel2: string;
  fixschaden: number;
  rb: number;
  rangeMods: [string, string, string, string, string, string];
  rw: string;
  ini: number;
  nachladezeit: number;
  nachladenTawTeiler: number;
  armbrustLadedaten: Record<string, string>;
  hauptfertigkeit: string;
  spezialisierung: string;
  wkBasis: number;
  staerkeTeiler: number;
  staerkeMalusBasis: number;
  atBasis: number;
  paBasis: number;
  minStaerke1H?: number;
  minStaerke2H?: number;
  klingenbrecherBasis: number;
  klingenschutzBasis: number;
}

export interface RangedAmmoInventorySnapshot {
  kind: 'ranged-ammo';
  table: RangedAmmoTable;
  name: string;
  preisDublonen: number | null;
  wuerfel: string;
  fixschaden: number;
  rb: number;
  rwModMeter: number;
  be: number;
}

export type RangedInventorySnapshot = RangedWeaponInventorySnapshot | RangedAmmoInventorySnapshot;

const RANGE_HEADERS = ['10m', '30m', '60m', '100m', '150m', '210m'] as const;
const ARMBRUST_LADE_HEADERS = [
  'Ladetechnik Hand: min.Stä',
  'Ladetechnik Hand: Ladezeit',
  'Ladetechnik Hand: Ladezeit-Teiler',
  'Ladetechnik Geißfuß: min.Stä',
  'Ladetechnik Geißfuß: Ladezeit',
  'Ladetechnik Geißfuß: Ladezeit-Teiler',
  'Ladetechnik Winde: min.Stä',
  'Ladetechnik Winde: Ladezeit',
  'Ladetechnik Winde: Ladezeit-Teiler',
  'Ladetechnik Repetieren: Ladezeit',
  'Ladetechnik Repetieren: Ladezeit-Teiler',
  'Ladetechnik Repetierer Nachladen: Ladezeit',
  'Ladetechnik Nachladen: Ladezeit-Teiler',
] as const;

function numberValue(row: FernkampfRow, header: string): number {
  const raw = row[header];
  if (raw === undefined) return 0;
  const parsed = Number(raw.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function optionalNumberValue(row: FernkampfRow, header: string): number | undefined {
  if (row[header] === undefined) return undefined;
  return numberValue(row, header);
}

export function createRangedWeaponInventorySnapshot(
  table: RangedWeaponTable,
  row: FernkampfRow,
): RangedWeaponInventorySnapshot {
  const armbrustLadedaten: Record<string, string> = {};
  if (table === 'armbrust') {
    for (const header of ARMBRUST_LADE_HEADERS) {
      if (row[header] !== undefined) armbrustLadedaten[header] = row[header];
    }
  }
  return {
    kind: 'ranged-weapon',
    table,
    name: row.name,
    preisDublonen: row.preisDublonen,
    fernkampfWuerfel: row['1.W'] ?? '–',
    schadenswuerfel1: row['Schadenswuerfel-1'] ?? '',
    schadenswuerfel2: row['Schadenswuerfel-2'] ?? '',
    fixschaden: numberValue(row, 'Fixschaden'),
    rb: numberValue(row, 'RB'),
    rangeMods: RANGE_HEADERS.map((header) => row[header] ?? 'x') as RangedWeaponInventorySnapshot['rangeMods'],
    rw: row['RW'] ?? '–',
    ini: numberValue(row, 'Ini'),
    nachladezeit: numberValue(row, 'Nachladezeit'),
    nachladenTawTeiler: numberValue(row, 'Nachladen TaW-Teiler'),
    armbrustLadedaten,
    hauptfertigkeit: row['Hauptfertigkeit'] ?? '',
    spezialisierung: row['Spezialisierung'] ?? '',
    wkBasis: numberValue(row, 'WK-Basis'),
    staerkeTeiler: numberValue(row, 'Staerke-Teiler'),
    staerkeMalusBasis: numberValue(row, 'Staerke-Malus-Basis'),
    atBasis: numberValue(row, 'AT-Basis'),
    paBasis: numberValue(row, 'PA-Basis'),
    minStaerke1H: optionalNumberValue(row, 'Min-Staerke-1H-Basis'),
    minStaerke2H: optionalNumberValue(row, 'Min-Staerke-2H-Basis'),
    klingenbrecherBasis: numberValue(row, 'Klingenbrecher-Basis'),
    klingenschutzBasis: numberValue(row, 'Klingenschutz-Basis'),
  };
}

export function resolveRangedWeaponInventorySnapshot(
  table: RangedWeaponTable,
  baseId: string,
): RangedWeaponInventorySnapshot | undefined {
  const rows = table === 'boegen' ? BOEGEN : ARMBRUST;
  const row = rows.find((candidate) => String(candidate.sourceRow) === baseId);
  return row ? createRangedWeaponInventorySnapshot(table, row) : undefined;
}

export function createRangedAmmoInventorySnapshot(
  table: RangedAmmoTable,
  basis: FernkampfRow,
  modifikator: FernkampfRow | null,
): RangedAmmoInventorySnapshot {
  const composed = composeMunition(basis, modifikator);
  return {
    kind: 'ranged-ammo',
    table,
    name: modifikator ? `${modifikator.name} (${basis.name})` : basis.name,
    preisDublonen: composed.preisDublonen,
    wuerfel: composed.wuerfel,
    fixschaden: composed.fixschaden,
    rb: composed.rb,
    rwModMeter: composed.rwModMeter,
    be: composed.be,
  };
}

export function resolveRangedAmmoInventorySnapshot(
  table: RangedAmmoTable,
  baseId: string,
  modifikatorId?: string,
): RangedAmmoInventorySnapshot | undefined {
  const rows = table === 'pfeile' ? PFEILE : BOLZEN;
  const basis = rows.find((candidate) => String(candidate.sourceRow) === baseId);
  if (!basis || basis['Kategorie'] === 'Spitzen-Modifikator') return undefined;
  const modifikator = modifikatorId
    ? rows.find((candidate) => String(candidate.sourceRow) === modifikatorId)
    : undefined;
  if (modifikatorId && (!modifikator || modifikator['Kategorie'] !== 'Spitzen-Modifikator')) return undefined;
  return createRangedAmmoInventorySnapshot(table, basis, modifikator ?? null);
}
