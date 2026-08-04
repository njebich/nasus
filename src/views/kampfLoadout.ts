// Waffen-Loadout (2026-07-22): abgeleitete Zwei-Item-Kombinationen aus bereits besessener
// Ausruestung - siehe engine/waffenLoadout.ts fuer die Regelwerks-Mathematik. Reine Anzeige (keine
// +/- Pool-Buttons): Die rechte Ursprungszeile liefert ihre AT-Seite, die linke ihre PA-Seite.
// Verbleibende PP werden nur fuer diese abgeleitete Sicht automatisch und innerhalb jeder
// Ursprungszeile balanciert verteilt; der gespeicherte Charakterzustand bleibt unveraendert.
// Siehe kampf.ts-Dateikopf fuer den Gesamtkontext des Kampf-Tabs.

import type { ComputedSheet } from '../engine/characterSheet';
import { makeValueSource } from '../engine/characterSheet';
import {
  isWaffenLoadoutSingleType,
  type CharacterState, type WaffenLoadoutEntry, type WaffenLoadoutComboType, type WaffenLoadoutSingleType,
} from '../state/characterStore';
import {
  listEligibleNahkampf1HWaffen, listEligibleSchilde, listEligiblePistolen, resolveLoadout, describeLoadout,
  type LoadoutResult,
} from '../engine/waffenLoadout';
import { MELEE_WEAPON_BY_SOURCE_ROW, FIREARM_BY_SOURCE_ROW } from '../engine/weaponCatalog';
import { escapeHtml } from './kampfShared';
import { buildNahkampfRows, type PoolContext } from './kampfNahkampf';
import { buildFeuerwaffenRows } from './kampfFeuerwaffen';
import { buildArmbrustBoegenRows } from './kampfArmbrustBogen';

export interface LoadoutDisplayRow {
  entry: WaffenLoadoutEntry;
  displayName: string;
  result: LoadoutResult | SingleLoadoutResult;
  pool?: { gat: number; gpa: number; mat: number; mpa: number; pp?: number };
}

export interface SingleLoadoutResult {
  ok: true;
  comboType: WaffenLoadoutSingleType;
  schaden: string;
  wk: string;
  nat: string;
  npa: string;
  fkSchaden: string;
  fkReichweiten: string;
}

export function buildLoadoutDisplayRows(character: CharacterState, sheet: ComputedSheet): LoadoutDisplayRow[] {
  const ctx: PoolContext = { sheet, character, values: makeValueSource(character) };
  return character.waffenLoadouts.map((entry) => {
    if (isWaffenLoadoutSingleType(entry.comboType)) {
      const single = buildSingleLoadoutDisplayRow(character, sheet, entry);
      if (single) return single;
      return {
        entry, displayName: describeLoadout(character, entry),
        result: { ok: false, reason: 'Die ausgewählte Einzelwaffe ist nicht mehr vorhanden oder ungültig' },
      };
    }
    const result = resolveLoadout(character, sheet, ctx.values, entry);
    const pool = result.ok && (result.comboType === 'nk1h_nk1h' || result.comboType === 'nk1h_schild')
      ? {
          gat: result.poolValues.gat, gpa: result.poolValues.gpa,
          mat: result.poolValues.mat, mpa: result.poolValues.mpa,
        }
      : undefined;
    return { entry, displayName: describeLoadout(character, entry), result, pool };
  });
}

function buildSingleLoadoutDisplayRow(
  character: CharacterState, sheet: ComputedSheet, entry: WaffenLoadoutEntry,
): LoadoutDisplayRow | null {
  if (!isWaffenLoadoutSingleType(entry.comboType)) return null;
  const displayName = describeLoadout(character, entry);
  if (entry.comboType === 'nk1h' || entry.comboType === 'nk2h') {
    const grip = entry.comboType === 'nk1h' ? '1H' : '2H';
    const row = buildNahkampfRows(character, sheet).find(
      (candidate) => candidate.key === entry.primaryEquipmentId && candidate.grip === grip,
    );
    if (!row) return null;
    return {
      entry, displayName,
      result: {
        ok: true, comboType: entry.comboType, schaden: row.schaden, wk: row.wk,
        nat: String(row.nat.value), npa: String(row.npa.value), fkSchaden: '–', fkReichweiten: '–',
      },
      pool: { gat: row.gat.value, gpa: row.gpa.value, mat: row.mat.value, mpa: row.mpa.value, pp: row.pp },
    };
  }

  if (entry.comboType === 'pistole' || entry.comboType === 'muskete') {
    const row = buildFeuerwaffenRows(character).find(
      (candidate) => candidate.key.startsWith(`${entry.primaryEquipmentId}:`),
    );
    if (!row) return null;
    return {
      entry, displayName,
      result: {
        ok: true, comboType: entry.comboType, schaden: '–', wk: '–', nat: '–', npa: '–',
        fkSchaden: row.schaden, fkReichweiten: row.ranges.join(' / '),
      },
    };
  }

  const typ = entry.comboType === 'armbrust' ? 'armbrust' : 'boegen';
  const row = buildArmbrustBoegenRows(character, typ).find(
    (candidate) => candidate.key.startsWith(`${entry.primaryEquipmentId}:`),
  );
  if (!row) return null;
  return {
    entry, displayName,
    result: {
      ok: true, comboType: entry.comboType, schaden: '–', wk: '–', nat: '–', npa: '–',
      fkSchaden: row.schaden, fkReichweiten: row.ranges.join(' / '),
    },
  };
}

export interface LoadoutCells {
  schaden: string;
  wk: string;
  nat: string;
  npa: string;
  fkSchadenR: string;
  fkSchadenL: string;
  fkReichweitenR: string;
  fkReichweitenL: string;
}

export function formatLoadoutCells(result: LoadoutResult | SingleLoadoutResult): LoadoutCells | { error: string } {
  if (!result.ok) return { error: result.reason };
  switch (result.comboType) {
    case 'nk1h':
    case 'nk2h':
      return {
        schaden: result.schaden, wk: result.wk, nat: result.nat, npa: result.npa,
        fkSchadenR: '', fkSchadenL: '', fkReichweitenR: '', fkReichweitenL: '',
      };
    case 'pistole':
    case 'muskete':
    case 'armbrust':
    case 'bogen':
      return {
        schaden: '–', wk: '–', nat: '–', npa: '–',
        fkSchadenR: result.fkSchaden, fkSchadenL: '',
        fkReichweitenR: result.fkReichweiten, fkReichweitenL: '',
      };
    case 'nk1h_nk1h':
      if (result.talentActive) {
        return {
          schaden: result.schaden, wk: `AT ${result.atWk} / PA ${result.paWk}`,
          nat: String(result.nat), npa: String(result.npa),
          fkSchadenR: '', fkSchadenL: '', fkReichweitenR: '', fkReichweitenL: '',
        };
      }
      return {
        schaden: `${result.primary.schaden} / ${result.secondary.schaden}`,
        wk: `${result.primary.wk} / ${result.secondary.wk}`,
        nat: String(result.nat), npa: String(result.npa),
        fkSchadenR: '', fkSchadenL: '', fkReichweitenR: '', fkReichweitenL: '',
      };
    case 'nk1h_pistole':
      return {
        schaden: result.melee.schaden, wk: result.melee.wk,
        nat: String(result.melee.nat), npa: String(result.melee.npa),
        fkSchadenR: '', fkSchadenL: result.pistole.schaden,
        fkReichweitenR: '', fkReichweitenL: result.pistole.ranges.join(' / '),
      };
    case 'nk1h_schild':
      if (result.talentActive) {
        return {
          schaden: result.schaden, wk: `AT ${result.atWk} / PA ${result.paWk}`,
          nat: String(result.nat), npa: String(result.npa),
          fkSchadenR: '', fkSchadenL: '', fkReichweitenR: '', fkReichweitenL: '',
        };
      }
      return {
        schaden: `${result.primary.schaden} / ${result.secondary.schaden}`,
        wk: `${result.primary.wk} / ${result.secondary.wk}`,
        nat: String(result.nat), npa: String(result.npa),
        fkSchadenR: '', fkSchadenL: '', fkReichweitenR: '', fkReichweitenL: '',
      };
    case 'schild_pistole':
      return {
        schaden: result.schild.schaden, wk: result.schild.wk,
        nat: String(result.schild.nat), npa: String(result.schild.npa),
        fkSchadenR: '', fkSchadenL: result.pistole.schaden,
        fkReichweitenR: '', fkReichweitenL: result.pistole.ranges.join(' / '),
      };
    case 'pistole_pistole':
      return {
        schaden: '–', wk: '–', nat: '–', npa: '–',
        fkSchadenR: result.primary.schaden, fkSchadenL: result.secondary.schaden,
        fkReichweitenR: result.primary.ranges.join(' / '),
        fkReichweitenL: result.secondary.ranges.join(' / '),
      };
  }
}

export type OnAddWaffenLoadout = (comboType: WaffenLoadoutComboType, primaryEquipmentId: string, secondaryEquipmentId: string) => void;
export type OnRemoveWaffenLoadout = (loadoutId: string) => void;
export type OnToggleWaffenLoadoutFavorite = (loadoutId: string) => void;

function loadoutOptionList(items: ReadonlyArray<{ equipmentId: string; label: string }>): string {
  const totals = new Map<string, number>();
  const seen = new Map<string, number>();
  for (const item of items) totals.set(item.label, (totals.get(item.label) ?? 0) + 1);
  return items.map((item) => {
    const copy = (seen.get(item.label) ?? 0) + 1;
    seen.set(item.label, copy);
    const label = (totals.get(item.label) ?? 0) > 1 ? `${item.label} (${copy})` : item.label;
    return `<option value="${escapeHtml(item.equipmentId)}">${escapeHtml(label)}</option>`;
  }).join('');
}

function renderLoadoutCombo(comboType: WaffenLoadoutComboType, hidden: boolean, primaryOptions: string, secondaryOptions: string, primaryLabel: string, secondaryLabel: string): string {
  return `
    <div class="loadout-combo-fieldset" data-combo-type="${comboType}" ${hidden ? 'hidden' : ''}>
      <label>${primaryLabel}
        <select data-role="primary"><option value="">–</option>${primaryOptions}</select>
      </label>
      <label>${secondaryLabel}
        <select data-role="secondary"><option value="">–</option>${secondaryOptions}</select>
      </label>
    </div>`;
}

function renderSingleLoadout(
  comboType: WaffenLoadoutSingleType, hidden: boolean,
  options: string, label: string,
): string {
  return `
    <div class="loadout-combo-fieldset" data-combo-type="${comboType}" ${hidden ? 'hidden' : ''}>
      <label>${label}
        <select data-role="primary"><option value="">–</option>${options}</select>
      </label>
    </div>`;
}

const LOADOUT_COMBO_LABELS: Record<WaffenLoadoutComboType, string> = {
  nk1h: '1H', nk2h: '2H', pistole: 'Pistole', muskete: 'Muskete', armbrust: 'Armbrust', bogen: 'Bogen',
  nk1h_nk1h: 'NK 1H + NK 1H', nk1h_pistole: 'NK 1H + Pistole', nk1h_schild: 'NK 1H + Schild',
  schild_pistole: 'Schild + Pistole', pistole_pistole: 'Pistole + Pistole',
};

function renderLoadoutCreationForm(character: CharacterState): string {
  const nk1h = listEligibleNahkampf1HWaffen(character);
  const schilde = listEligibleSchilde(character);
  const pistolen = listEligiblePistolen(character);
  const nk1hOptions = loadoutOptionList(nk1h);
  const schildOptions = loadoutOptionList(schilde);
  const pistoleOptions = loadoutOptionList(pistolen);

  const equipmentOption = (equipment: CharacterState['equipment'][number], label: string) => ({
    equipmentId: equipment.id, label,
  });
  const nk1hSingle = character.equipment.flatMap((equipment) => {
    if (equipment.family !== 'weapon' || equipment.computedStatsSnapshot?.minStaerke1H === undefined) return [];
    const basis = MELEE_WEAPON_BY_SOURCE_ROW.get(equipment.baseId);
    return basis ? [equipmentOption(equipment, basis.name)] : [];
  });
  const nk2hSingle = character.equipment.flatMap((equipment) => {
    if (equipment.family !== 'weapon' || equipment.computedStatsSnapshot?.minStaerke2H === undefined) return [];
    const basis = MELEE_WEAPON_BY_SOURCE_ROW.get(equipment.baseId);
    return basis ? [equipmentOption(equipment, basis.name)] : [];
  });
  const musketen = character.equipment.flatMap((equipment) => {
    if (equipment.family !== 'feuerwaffe') return [];
    const basis = FIREARM_BY_SOURCE_ROW.get(equipment.baseId);
    return basis?.['Typ'] === 'Gewehr' ? [equipmentOption(equipment, basis.name)] : [];
  });
  const armbrueste = character.equipment.flatMap((equipment) => equipment.family === 'fernkampfwaffe'
    && equipment.baseTable === 'armbrust' && equipment.rangedSnapshot?.kind === 'ranged-weapon'
    ? [equipmentOption(equipment, equipment.rangedSnapshot.name)] : []);
  const boegen = character.equipment.flatMap((equipment) => equipment.family === 'fernkampfwaffe'
    && equipment.baseTable === 'boegen' && equipment.rangedSnapshot?.kind === 'ranged-weapon'
    ? [equipmentOption(equipment, equipment.rangedSnapshot.name)] : []);

  const available: WaffenLoadoutComboType[] = [];
  if (nk1hSingle.length >= 1) available.push('nk1h');
  if (nk2hSingle.length >= 1) available.push('nk2h');
  if (pistolen.length >= 1) available.push('pistole');
  if (musketen.length >= 1) available.push('muskete');
  if (armbrueste.length >= 1) available.push('armbrust');
  if (boegen.length >= 1) available.push('bogen');
  if (nk1h.length >= 2) available.push('nk1h_nk1h');
  if (nk1h.length >= 1 && pistolen.length >= 1) available.push('nk1h_pistole');
  if (nk1h.length >= 1 && schilde.length >= 1) available.push('nk1h_schild');
  if (schilde.length >= 1 && pistolen.length >= 1) available.push('schild_pistole');
  if (pistolen.length >= 2) available.push('pistole_pistole');

  if (available.length === 0) {
    return `<p class="kampf-talente-hinweis">Für ein Waffen-Loadout werden mindestens zwei besessene
      1H-Nahkampfwaffen/Pistolen, oder eine Kombination aus 1H-Nahkampfwaffe/Schild/Pistole
      benötigt.</p>`;
  }

  const typeOptions = available.map((comboType) => `
      <option value="${comboType}">${LOADOUT_COMBO_LABELS[comboType]}</option>`).join('');

  const fieldsets = available.map((comboType, i) => {
    const hidden = i !== 0;
    switch (comboType) {
      case 'nk1h':
        return renderSingleLoadout(comboType, hidden, loadoutOptionList(nk1hSingle), '1H-Waffe');
      case 'nk2h':
        return renderSingleLoadout(comboType, hidden, loadoutOptionList(nk2hSingle), '2H-Waffe');
      case 'pistole':
        return renderSingleLoadout(comboType, hidden, pistoleOptions, 'Pistole');
      case 'muskete':
        return renderSingleLoadout(comboType, hidden, loadoutOptionList(musketen), 'Muskete');
      case 'armbrust':
        return renderSingleLoadout(comboType, hidden, loadoutOptionList(armbrueste), 'Armbrust');
      case 'bogen':
        return renderSingleLoadout(comboType, hidden, loadoutOptionList(boegen), 'Bogen');
      case 'nk1h_nk1h':
        return renderLoadoutCombo(comboType, hidden, nk1hOptions, nk1hOptions, 'Primärhand (rechte Hand)', 'Sekundärhand');
      case 'nk1h_pistole':
        return renderLoadoutCombo(comboType, hidden, nk1hOptions, pistoleOptions, 'Nahkampfwaffe (Primärhand)', 'Pistole (Sekundärhand)');
      case 'nk1h_schild': {
        const combinedOptions = loadoutOptionList([...nk1h, ...schilde]);
        return renderLoadoutCombo(comboType, hidden, combinedOptions, combinedOptions, 'Primärhand (rechte Hand)', 'Sekundärhand');
      }
      case 'schild_pistole':
        return renderLoadoutCombo(comboType, hidden, schildOptions, pistoleOptions, 'Schild (Primärhand)', 'Pistole (Sekundärhand)');
      case 'pistole_pistole':
        return renderLoadoutCombo(comboType, hidden, pistoleOptions, pistoleOptions, 'Primärhand (rechte Hand)', 'Sekundärhand');
    }
  }).join('');

  return `
    <div class="loadout-creation-form">
      <label>Loadout-Art
        <select name="loadout-combo-type">${typeOptions}</select>
      </label>
      ${fieldsets}
      <button type="button" class="loadout-add-btn">Hinzufügen</button>
    </div>`;
}

function renderLoadoutActions(row: LoadoutDisplayRow): { favoriteBtn: string; removeBtn: string } {
  const favoriteIcon = row.entry.favorite ? '★' : '☆';
  return {
    favoriteBtn: `<button type="button" class="loadout-favorite-toggle" data-loadout-id="${escapeHtml(row.entry.id)}" aria-label="Favorit umschalten">${favoriteIcon}</button>`,
    removeBtn: `<button type="button" class="loadout-remove" data-loadout-id="${escapeHtml(row.entry.id)}">Entfernen</button>`,
  };
}

function renderNkLoadoutRow(row: LoadoutDisplayRow): string {
  const cells = formatLoadoutCells(row.result);
  const { favoriteBtn, removeBtn } = renderLoadoutActions(row);
  if ('error' in cells) {
    return `
      <tr class="kampf-row-unusable" title="${escapeHtml(cells.error)}">
        <td>${escapeHtml(row.displayName)}</td>
        <td colspan="8">${escapeHtml(cells.error)}</td>
        <td>${favoriteBtn}</td>
        <td>${removeBtn}</td>
      </tr>`;
  }
  const pool = row.pool;
  return `
    <tr>
      <td>${escapeHtml(row.displayName)}</td>
      <td>${escapeHtml(cells.schaden)}</td>
      <td>${escapeHtml(cells.wk)}</td>
      <td>${escapeHtml(cells.nat)}</td>
      <td>${pool ? pool.gat : '–'}</td>
      <td>${pool ? pool.mat : '–'}</td>
      <td>${escapeHtml(cells.npa)}</td>
      <td>${pool ? pool.gpa : '–'}</td>
      <td>${pool ? pool.mpa : '–'}</td>
      <td>${favoriteBtn}</td>
      <td>${removeBtn}</td>
    </tr>`;
}

function renderFkLoadoutRow(row: LoadoutDisplayRow, showRight: boolean, showLeft: boolean): string {
  const cells = formatLoadoutCells(row.result);
  const { favoriteBtn, removeBtn } = renderLoadoutActions(row);
  if ('error' in cells) {
    const dataColumns = (showRight ? 2 : 0) + (showLeft ? 2 : 0);
    return `
      <tr class="kampf-row-unusable" title="${escapeHtml(cells.error)}">
        <td>${escapeHtml(row.displayName)}</td>
        <td colspan="${dataColumns}">${escapeHtml(cells.error)}</td>
        <td>${favoriteBtn}</td>
        <td>${removeBtn}</td>
      </tr>`;
  }
  return `
    <tr>
      <td>${escapeHtml(row.displayName)}</td>
      ${showRight ? `<td>${escapeHtml(cells.fkSchadenR)}</td>` : ''}
      ${showLeft ? `<td>${escapeHtml(cells.fkSchadenL)}</td>` : ''}
      ${showRight ? `<td>${escapeHtml(cells.fkReichweitenR)}</td>` : ''}
      ${showLeft ? `<td>${escapeHtml(cells.fkReichweitenL)}</td>` : ''}
      <td>${favoriteBtn}</td>
      <td>${removeBtn}</td>
    </tr>`;
}

function loadoutHasNk(row: LoadoutDisplayRow): boolean {
  return row.entry.comboType === 'nk1h' || row.entry.comboType === 'nk2h'
    || row.entry.comboType === 'nk1h_nk1h' || row.entry.comboType === 'nk1h_pistole'
    || row.entry.comboType === 'nk1h_schild' || row.entry.comboType === 'schild_pistole';
}

function loadoutHasFk(row: LoadoutDisplayRow): boolean {
  return row.entry.comboType === 'pistole' || row.entry.comboType === 'muskete'
    || row.entry.comboType === 'armbrust' || row.entry.comboType === 'bogen'
    || row.entry.comboType === 'nk1h_pistole'
    || row.entry.comboType === 'schild_pistole'
    || row.entry.comboType === 'pistole_pistole';
}

function loadoutHasFkRight(row: LoadoutDisplayRow): boolean {
  return row.entry.comboType === 'pistole' || row.entry.comboType === 'muskete'
    || row.entry.comboType === 'armbrust' || row.entry.comboType === 'bogen'
    || row.entry.comboType === 'pistole_pistole';
}

function loadoutHasFkLeft(row: LoadoutDisplayRow): boolean {
  return row.entry.comboType === 'nk1h_pistole' || row.entry.comboType === 'schild_pistole'
    || row.entry.comboType === 'pistole_pistole';
}

export function renderWaffenLoadoutBlock(character: CharacterState, sheet: ComputedSheet): string {
  const rows = buildLoadoutDisplayRows(character, sheet);
  const nkRows = rows.filter(loadoutHasNk);
  const fkRows = rows.filter(loadoutHasFk);
  const showFkRight = fkRows.some(loadoutHasFkRight);
  const showFkLeft = fkRows.some(loadoutHasFkLeft);
  return `
    <h3 class="bogen-section-heading">Waffen-Loadout</h3>
    ${renderLoadoutCreationForm(character)}
    ${nkRows.length > 0 ? `
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-loadout-table" data-loadout-table="nk">
        <caption class="loadout-table-heading">Nahkampf</caption>
        <thead><tr>
          <th>Loadout</th><th>Schaden</th><th>WK</th>
          <th>nAT</th><th>gAT</th><th>mAT</th><th>nPA</th><th>gPA</th><th>mPA</th>
          <th>Favorit</th><th></th>
        </tr></thead>
        <tbody>${nkRows.map(renderNkLoadoutRow).join('')}</tbody>
      </table>
    </div>` : ''}
    ${fkRows.length > 0 ? `
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-loadout-table" data-loadout-table="fk">
        <caption class="loadout-table-heading">Fernkampf</caption>
        <thead><tr>
          <th>Loadout</th>
          ${showFkRight ? '<th>Schaden R</th>' : ''}${showFkLeft ? '<th>Schaden L</th>' : ''}
          ${showFkRight ? '<th>FK-Reichweiten R</th>' : ''}${showFkLeft ? '<th>FK-Reichweiten L</th>' : ''}
          <th>Favorit</th><th></th>
        </tr></thead>
        <tbody>${fkRows.map((row) => renderFkLoadoutRow(row, showFkRight, showFkLeft)).join('')}</tbody>
      </table>
    </div>` : ''}`;
}
