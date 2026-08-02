import type { EquipmentEntry } from '../state/characterStore';
import type { GenericRow } from '../data/equipment/armor';
import {
  NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL,
} from '../data/equipment/weapons';
import { MELEE_WEAPON_BY_SOURCE_ROW } from '../engine/weaponCatalog';
import { formatSchadenswuerfel } from '../engine/waffenSchaden';
import type { ComposedWeapon } from '../engine/weaponComposition';
import { tooltipAttr } from './tooltip';

export interface WeaponDisplay {
  title: string;
  /** Nur von describeStoredWeapon (Nutzer-Ask "Anpassung/Fertigung/Material: Tooltip on Hover
   *  Wertemodifikator anzeigen") - dieselben Namen wie `title`, aber Material/Fertigung/Anpassung
   *  jeweils als eigener <span data-tooltip> mit den numerischen Modifikator-Spalten dieser Zeile.
   *  describeWeaponSelection (Kaufvorschau) liefert das bewusst NICHT, da dort das reine `title`
   *  per toEqual gegen den unveraenderten String getestet wird. */
  titleHtml?: string;
  stats: string;
}

function selectedRow(rows: GenericRow[], sourceRow: string | undefined): GenericRow | undefined {
  if (!sourceRow) return undefined;
  return rows.find((row) => String(row.sourceRow) === sourceRow);
}

function selectedName(rows: GenericRow[], sourceRow: string | undefined): string | undefined {
  return selectedRow(rows, sourceRow)?.name;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** true, wenn `raw` eine geparste Modifikator-Zahl ist (nicht leer/"-"/"x" - die uebliche
 *  "kein Wert"-Schreibweise in den Material-/Fertigung-/Anpassung-Tabellen). */
function isModifierValue(raw: string | undefined): boolean {
  if (!raw) return false;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '-' || trimmed === '–' || trimmed.toLowerCase() === 'x') return false;
  return Number.isFinite(Number(trimmed.replace(',', '.')));
}

/** Alle numerischen Spalten einer Material-/Fertigung-/Anpassung-Zeile als "<Spalte>: <Wert>"-
 *  Zeilen - der Rohtext der xlsx-Spaltennamen (kein kuratiertes Wording, wie an anderen Stellen
 *  bereits ueblich, z.B. Wirkung-/Info-Spalten). */
function wertemodifikatorTooltip(row: GenericRow | undefined): string {
  if (!row) return '';
  return Object.entries(row)
    .filter(([key, value]) => key !== 'sourceRow' && key !== 'name' && isModifierValue(String(value)))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

/** Name einer Material-/Fertigung-/Anpassung-/Bespannung-Zeile als HTML, mit Wertemodifikator-
 *  Tooltip (Nutzer-Ask) falls die Zeile numerische Modifikator-Spalten hat - sonst nur der
 *  escapte Name. Exportiert, damit besitz.ts dasselbe fuer Schilde (Material/Fertigung/
 *  Bespannung, andere Tabellen, gleiche GenericRow-Form) wiederverwenden kann. */
export function wertemodifikatorSpan(row: GenericRow | undefined): string {
  if (!row) return '';
  const tooltip = wertemodifikatorTooltip(row);
  return tooltip ? `<span${tooltipAttr(tooltip)}>${escapeHtml(row.name)}</span>` : escapeHtml(row.name);
}

function weaponTitleHtml(
  basis: GenericRow,
  material: GenericRow | undefined,
  fertigung: GenericRow | undefined,
  anpassung: GenericRow | undefined,
): string {
  return [escapeHtml(basis.name), wertemodifikatorSpan(material), wertemodifikatorSpan(fertigung), wertemodifikatorSpan(anpassung)]
    .filter(Boolean).join(', ');
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
  const material = selectedRow(NK_MATERIAL, entry.selections.material);
  const fertigung = selectedRow(NK_FERTIGUNG, entry.selections.fertigung);
  const anpassung = selectedRow(NK_ANPASSUNG, entry.selections.anpassung);
  const schaftmaterialName = selectedName(NK_SCHAFTMATERIAL, entry.selections.schaftmaterial);
  return {
    title: weaponTitle(basis, material?.name, fertigung?.name, anpassung?.name),
    titleHtml: weaponTitleHtml(basis, material, fertigung, anpassung),
    stats: weaponStats(basis, entry.computedStatsSnapshot ?? {}, schaftmaterialName),
  };
}
