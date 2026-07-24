import {
  ARTEFAKT_BASIS, ARTEFAKT_WIRKUNGSSTUFEN, type ArtefaktBasis,
} from '../data/equipment/artefakte';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import type { EquipmentEntry } from '../state/characterStore';

export interface XKlingeWirkung {
  referenz: string;
  grad: number;
  wirkungsstufe: number;
  element: string;
  schadenselement: string;
  namenspraefix: string;
  schadenswuerfel: string;
  rb?: number;
  sb?: number;
  beschreibung: string;
}

export function isXKlingeReferenz(referenz: string): boolean {
  return ARTEFAKT_BASIS.some((row) => row.referenz === referenz && !!row.element);
}

function basisForXKlinge(referenz: string): ArtefaktBasis {
  const basis = ARTEFAKT_BASIS.find((row) => row.referenz === referenz && !!row.element);
  if (!basis) throw new Error(`Unbekannte X-Klinge '${referenz}'`);
  return basis;
}

export function resolveXKlingeWirkung(referenz: string, gradRaw: string | number): XKlingeWirkung {
  const basis = basisForXKlinge(referenz);
  const grad = Number(gradRaw);
  if (!Number.isInteger(grad) || grad < 1) throw new Error(`Ungueltiger X-Klinge-Grad '${gradRaw}'`);
  const wirkungsstufe = grad + Number(basis.wirkungsstufeOffset ?? 0);
  const row = ARTEFAKT_WIRKUNGSSTUFEN.find((entry) => Number(entry.wirkungsstufe) === wirkungsstufe);
  if (!row?.schadenswuerfel) {
    throw new Error(`Keine Artefakt-Wirkungsstufe ${wirkungsstufe} fuer '${referenz}'`);
  }
  const numeric = (value: string | undefined): number | undefined => {
    if (value === undefined || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  return {
    referenz,
    grad,
    wirkungsstufe,
    element: basis.element!,
    schadenselement: basis.schadenselement ?? basis.element!,
    namenspraefix: basis.namenspraefix ?? basis.element!,
    schadenswuerfel: row.schadenswuerfel,
    rb: basis.zusatzwertArt === 'RB' ? numeric(row.rb) : undefined,
    sb: basis.zusatzwertArt === 'SB' ? numeric(row.sb) : undefined,
    beschreibung: basis.beschreibung ?? '',
  };
}

export function xKlingeTooltip(wirkung: XKlingeWirkung): string {
  const lines = [
    `Artefakt-Grad: ${wirkung.grad}`,
    `Wirkungsstufe: ${wirkung.wirkungsstufe}`,
    `Elementarschaden: ${wirkung.schadenswuerfel} ${wirkung.schadenselement}`,
  ];
  if (wirkung.rb !== undefined) lines.push(`RB: +${wirkung.rb}`);
  if (wirkung.sb !== undefined) lines.push(`SB: ${wirkung.sb}`);
  if (wirkung.beschreibung) lines.push(`Wirkung: ${wirkung.beschreibung}`);
  return lines.join('\n');
}

export function xKlingeWeaponName(entry: EquipmentEntry): string | undefined {
  if (entry.family !== 'weapon' || !entry.xKlinge) return undefined;
  const basis = NK_WAFFEN_BASIS.find((row) => String(row.sourceRow) === entry.baseId);
  if (!basis) return undefined;
  const wirkung = resolveXKlingeWirkung(entry.xKlinge.artefaktReferenz, entry.xKlinge.grad);
  return `${wirkung.namenspraefix}-${basis.name}`;
}

export function xKlingeWirkungForEntry(entry: EquipmentEntry): XKlingeWirkung | undefined {
  return entry.xKlinge
    ? resolveXKlingeWirkung(entry.xKlinge.artefaktReferenz, entry.xKlinge.grad)
    : undefined;
}
