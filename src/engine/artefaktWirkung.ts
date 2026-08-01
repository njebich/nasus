import {
  ARTEFAKT_WIRKUNGSSTUFEN, type ArtefaktBasis,
} from '../data/equipment/artefakte';

/**
 * Die Gradformeln stammen aus "NN Artefakte 0.52.xlsx", Blatt
 * "Artefaktpreisliste", Spalten Wirkung, ED und Wirkungsdauer. Die importierten
 * Basiswerte sind deren Ergebnisse fuer Artefakt-Grad 7; hier werden dieselben
 * Formeln fuer den tatsaechlich angebotenen Grad 1-7 ausgewertet.
 */
const MAGIE_PARAMETER = [0, 5, 10, 20, 25, 30, 35, 40] as const;

const EIGENSCHAFT_ERHOEHEN = new Set([
  'artefakt_ausstrahlung_erhoehen',
  'artefakt_athletik_erhoehen',
  'artefakt_geschicklichkeit_erhoehen',
  'artefakt_konstitution_erhoehen',
  'artefakt_schnelligkeit_erhoehen',
  'artefakt_staerke_erhoehen',
  'artefakt_intelligenz_erhoehen',
  'artefakt_mut_erhoehen',
  'artefakt_sinnesschaerfe_erhoehen',
  'artefakt_willenskraft_erhoehen',
]);

const ELEMENT_PFEILE = new Set([
  'artefakt_flammen_pfeil', 'artefakt_frost_pfeil', 'artefakt_sturm_pfeil',
  'artefakt_splitter_pfeil', 'artefakt_schock_pfeil',
]);

const WD_MAGIE_PARAMETER = new Set([
  'artefakt_grundfertigkeit_erhoehen', 'artefakt_waffe_erschaffen',
  ...EIGENSCHAFT_ERHOEHEN,
  ...ELEMENT_PFEILE,
  'artefakt_flammen_klinge', 'artefakt_frost_klinge', 'artefakt_sturm_klinge',
  'artefakt_splitter_klinge', 'artefakt_schock_klinge',
  'artefakt_material_verstaerken', 'artefakt_in_pflanze_verwandeln',
  'artefakt_in_tier_verwandeln', 'artefakt_gecko', 'artefakt_unauffindbarkeit',
  'artefakt_magischer_schild', 'artefakt_korpi_ignorieren', 'artefakt_kampfmaschine',
]);

export interface ArtefaktGradWerte {
  grad: number;
  wirkungswert?: string;
  effektdauer: string;
  wirkungsdauer: string;
}

function parseGrad(raw: string | number): number {
  const grad = Number(raw);
  if (!Number.isInteger(grad) || grad < 1 || grad > 7) {
    throw new Error(`Ungueltiger Artefakt-Grad '${raw}'`);
  }
  return grad;
}

function wirkungsstufe(grad: number, offset = 0) {
  return ARTEFAKT_WIRKUNGSSTUFEN.find((row) => Number(row.wirkungsstufe) === grad + offset);
}

function formatNumeric(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value).replace('.', ',');
}

function formatZeit(value: string | undefined, einheit: string | undefined): string {
  if (!value) return '–';
  if (/^(sofort|permanent)$/i.test(value)) return value;
  return `${value}${einheit ? ` ${einheit}` : ''}`;
}

function resolveWirkungswert(basis: ArtefaktBasis, grad: number, magie: number): string | undefined {
  const ref = basis.referenz;
  if (ref === 'artefakt_licht') return `${magie} Fackeln`;
  if (ref === 'artefakt_magisches_makeover') return `${magie} %`;
  if (ref === 'artefakt_in_nahrung_verwandeln') return `${grad * 100} Gramm`;
  if (ref === 'artefakt_whk_talentwert_erhoehen') return `${grad * 2} TaP`;
  if (ref === 'artefakt_grundfertigkeit_erhoehen') return `${grad * 2 - 1} TaP`;
  if (EIGENSCHAFT_ERHOEHEN.has(ref)) return `${basis.eigenschaft ?? 'Eigenschaft'} +${grad * 2 - 1}`;

  if (ELEMENT_PFEILE.has(ref)) {
    const stufe = wirkungsstufe(grad, ref === 'artefakt_flammen_pfeil' ? 1 : 0);
    if (!stufe?.schadenswuerfel) return undefined;
    const teile = [`${stufe.schadenswuerfel} Elementarschaden`];
    if (ref === 'artefakt_splitter_pfeil' && stufe.rb) teile.push(`RB ${stufe.rb}`);
    if (ref === 'artefakt_schock_pfeil' && stufe.sb) teile.push(`SB ${stufe.sb}`);
    return teile.join(' / ');
  }

  if (ref === 'artefakt_material_verstaerken') return `KS/KB +${Math.ceil(magie / 5)}`;
  if (ref === 'artefakt_sinne_verbessern') return `Sinnesschaerfe +${Math.ceil(magie / 2)}`;
  if (ref === 'artefakt_in_pflanze_verwandeln') return `LE ${magie * 10} / RS ${grad}`;
  if (ref === 'artefakt_gecko') return `Klettern +${Math.ceil(magie / 2)}`;
  if (ref === 'artefakt_chamaeleon') return `Sinnesschaerfe +${grad * 3}`;
  if (ref === 'artefakt_warp') return `${magie * 5} m Reichweite`;
  if (ref === 'artefakt_unauffindbarkeit') return `Schleichen/Tarnung +${grad * 3} / Sinnesschaerfe -${grad * 2}`;
  if (ref === 'artefakt_verjuengung') return `${grad * 5} Jahre`;
  if (ref === 'artefakt_artefakt_analysieren') return `bis Grad ${grad} / Magietheorie ${grad * 5}`;
  if (ref === 'artefakt_magische_reinigung') return `Zauber bis Grad ${grad}`;
  if (ref === 'artefakt_magischer_schild') return `RS ${Math.ceil(magie / 2)} / LE ${magie}`;
  if (ref === 'artefakt_kampfmaschine') return `Kampfproben +${grad}`;
  if (ref.startsWith('artefakt_attributs_artefakt_')) return `Attribut +${grad}`;
  if (ref.startsWith('artefakt_eigenschafts_artefakt_')) return `Eigenschaft +${grad}`;
  return undefined;
}

function resolveWirkungsdauer(basis: ArtefaktBasis, grad: number, magie: number): string {
  const ref = basis.referenz;
  let wert = basis.wirkungsdauerBasis;

  if (ref === 'artefakt_whk_talentwert_erhoehen' || ref === 'artefakt_wasserwandeln' || ref === 'artefakt_stimme_veraendern') {
    wert = String(grad);
  } else if (WD_MAGIE_PARAMETER.has(ref)) {
    wert = String(magie);
  } else if (ref === 'artefakt_kiemen' || ref === 'artefakt_dammerungssicht') {
    wert = String(magie * 3);
  } else if (ref === 'artefakt_sinne_verbessern' || ref === 'artefakt_unsichtbarkeit' || ref === 'artefakt_waermesicht') {
    wert = formatNumeric(magie / 2);
  } else if (ref === 'artefakt_langsamer_fall' || ref === 'artefakt_chamaeleon') {
    wert = String(Math.ceil(magie / 2));
  } else if (ref === 'artefakt_verwandlung') {
    wert = String(magie * 6);
  } else if (ref === 'artefakt_last_des_alters' || ref === 'artefakt_verjuengung') {
    wert = String(magie * 5);
  } else if (ref === 'artefakt_magische_sicht') {
    wert = String(magie * 2);
  }

  return formatZeit(wert, basis.wirkungsdauerEinheit);
}

export function resolveArtefaktGradWerte(basis: ArtefaktBasis, gradRaw: string | number): ArtefaktGradWerte {
  const grad = parseGrad(gradRaw);
  const magie = MAGIE_PARAMETER[grad];
  const effektdauer = basis.referenz === 'artefakt_artefakt_analysieren'
    ? `${grad * 3} sec`
    : formatZeit(basis.effektdauerSec, typeof basis.effektdauerSec === 'string' && /^(sofort|permanent)$/i.test(basis.effektdauerSec) ? undefined : 'sec');

  return {
    grad,
    wirkungswert: resolveWirkungswert(basis, grad, magie),
    effektdauer,
    wirkungsdauer: resolveWirkungsdauer(basis, grad, magie),
  };
}

export function artefaktTooltip(basis: ArtefaktBasis, gradRaw: string | number): string {
  const werte = resolveArtefaktGradWerte(basis, gradRaw);
  return [
    basis.beschreibung ? `Wirkung: ${basis.beschreibung}` : 'Wirkung: –',
    werte.wirkungswert ? `Wirkungswert: ${werte.wirkungswert}` : '',
    `ED: ${werte.effektdauer}`,
    `WD: ${werte.wirkungsdauer}`,
  ].filter(Boolean).join('\n');
}
