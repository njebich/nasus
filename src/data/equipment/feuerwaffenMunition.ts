// Quelle: werte 0.8-claude.xlsx, Blatt "Munition-Feuerwaffen", A2:D39.
// Preise sind Dublonen pro Schuss.
import { firearmAmmunitionType, firearmAmmoTypeForArt } from '../../engine/ammunitionTypes';
import { FEUERWAFFEN_MUNITION } from './fernkampf';

export type FeuerwaffenMunitionArt =
  | 'blei_pulver'
  | 'papierpatrone_vl'
  | 'papierpatrone'
  | 'messingpatrone'
  | 'harpune';

export interface FeuerwaffenMunitionRow {
  art: FeuerwaffenMunitionArt;
  label: string;
  geeignetFuer: 'Vorderlader' | 'Hinterlader' | 'Patronenwaffen' | 'Harpunengewehr';
  kaliber: number;
  preisDublonen: number;
}

const rows = (
  art: FeuerwaffenMunitionArt,
  label: string,
  geeignetFuer: FeuerwaffenMunitionRow['geeignetFuer'],
  entries: ReadonlyArray<readonly [number, number]>,
): FeuerwaffenMunitionRow[] => entries.map(([kaliber, preisDublonen]) => ({
  art, label, geeignetFuer, kaliber, preisDublonen,
}));

export const FEUERWAFFEN_MUNITION_PREISE: FeuerwaffenMunitionRow[] = [
  ...rows('blei_pulver', 'Blei&Pulver', 'Vorderlader', [
    [12, 0.366912], [13, 0.374556], [14, 0.3822], [15, 0.389844],
    [16, 0.397488], [17, 0.405132], [18, 0.412776], [19, 0.42042],
    [20, 0.428064], [21, 0.435708], [22, 0.443352], [23, 0.450996],
  ]),
  ...rows('papierpatrone_vl', 'Papierpatrone', 'Vorderlader', [
    [12, 0.408855], [13, 0.4151775], [14, 0.4215], [15, 0.4278225],
    [16, 0.434145], [17, 0.4404675], [18, 0.44679], [19, 0.4531125],
    [20, 0.459435], [21, 0.4657575], [22, 0.47208], [23, 0.4784025],
  ]),
  ...rows('papierpatrone', 'Papierpatrone', 'Hinterlader', [
    [16, 0.6806666666666668], [17, 0.7010866666666667],
    [18, 0.7215066666666667], [19, 0.7419266666666668],
  ]),
  ...rows('messingpatrone', 'Messingpatrone', 'Patronenwaffen', [
    [5, 0.4036032], [6, 0.445104], [7, 0.718784], [8, 0.8251584],
    [9, 0.8689168], [10, 0.9126752], [11, 0.9564336], [12, 1.000192],
  ]),
  ...rows('harpune', 'Harpune', 'Harpunengewehr', [
    [16, 6.88384], [17, 6.88384],
  ]),
];

export function feuerwaffenMunitionOptionen(
  lademechanik: string,
  munition: string,
  kaliber: number,
): FeuerwaffenMunitionRow[] {
  const requiredTypeId = firearmAmmunitionType(lademechanik, munition);
  return FEUERWAFFEN_MUNITION_PREISE.filter(
    (row) => firearmAmmoTypeForArt(row.art) === requiredTypeId && row.kaliber === kaliber,
  );
}

// LLM-021 (DEC-1269): Alternativmunition-Effekte des Sheets "Feuerwaffen-Munition" als echte Mechanik.
// Bislang einzige Effektart: "Reduziert die Nachladezeit um N Sekunden" (KR = Sekunde, Owner
// 2026-09-29, also -N KR auf die rohe Nachladezeit). Unbekannte Effekttexte brechen laut ab, damit
// neue Effekte nicht stillschweigend ignoriert werden.
const ALTERNATIV_ART_BY_LABEL: Record<string, FeuerwaffenMunitionArt> = {
  'VL. Papierpatrone': 'papierpatrone_vl',
};
const NACHLADEZEIT_EFFEKT_RE = /^Reduziert die Nachladezeit um (\d+) Sekunden?$/;

export function parseMunitionEffekt(text: string): { nachladezeitMod: number } {
  const match = NACHLADEZEIT_EFFEKT_RE.exec(text.trim());
  if (!match) throw new Error(`Unbekannter Alternativ-Effekt der Feuerwaffen-Munition: '${text}'`);
  return { nachladezeitMod: -Number(match[1]) };
}

export interface FeuerwaffenMunitionEffekt {
  art: FeuerwaffenMunitionArt;
  nachladezeitMod: number;
}

/** Schluessel `${Name}|${Volk}` -> Alternativmunition der Waffe samt Effekt. */
export const FEUERWAFFEN_MUNITION_LOOKUP: ReadonlyMap<string, FeuerwaffenMunitionEffekt> = new Map(
  FEUERWAFFEN_MUNITION
    .filter((row) => row['Munition-Art (alternativ)'] && row['Alternativ-Effekt'])
    .map((row) => {
      const label = row['Munition-Art (alternativ)']!;
      const art = ALTERNATIV_ART_BY_LABEL[label];
      if (!art) throw new Error(`Unbekannte Alternativmunition '${label}' bei '${row['Name']}'`);
      return [`${row['Name']}|${row['Volk']}`, { art, ...parseMunitionEffekt(row['Alternativ-Effekt']!) }] as const;
    }),
);

/** Nachladezeit-Modifikator (KR, <= 0), den eine Munitionsart bei dieser Waffe mitbringt. */
export function munitionNachladezeitMod(waffenName: string, volk: string, art: string): number {
  const effekt = FEUERWAFFEN_MUNITION_LOOKUP.get(`${waffenName}|${volk}`);
  return effekt && effekt.art === art ? effekt.nachladezeitMod : 0;
}

/** Schnellste besessene Munition (kleinster Modifikator); ohne Munition 0. */
export function schnellsterMunitionNachladezeitMod(waffenName: string, volk: string, arten: readonly string[]): number {
  return arten.length === 0 ? 0 : Math.min(...arten.map((art) => munitionNachladezeitMod(waffenName, volk, art)));
}
