// Gesinnung/Charakterzüge (S09 Gesinnung.docx): 22 gegensätzliche Wertepaare, je ein Slider
// von -7 (linker Pol) bis +7 (rechter Pol), 0 = Neutral. Kostenlos, frei setzbar - kein
// Bezug zum Regelwerk/SP-Budget, daher eigene Datei statt eines Eintrags in rules.ts.

export interface GesinnungTrait {
  /** Key in CharacterState.gesinnung - Wert fehlt = Slider noch nicht gesetzt. */
  key: string;
  links: string;
  rechts: string;
}

export const GESINNUNG_TRAITS: readonly GesinnungTrait[] = [
  { key: 'gut_boese', links: 'Das Gute', rechts: 'Das Böse' },
  { key: 'ehrlichkeit_unehrlichkeit', links: 'Ehrlichkeit', rechts: 'Unehrlichkeit' },
  { key: 'prinzipientreue_opportunismus', links: 'Prinzipientreue', rechts: 'Opportunismus' },
  { key: 'gesetze_recht_des_staerkeren', links: 'Gesetze', rechts: 'Recht des Stärkeren' },
  { key: 'toleranz_rassismus', links: 'Toleranz', rechts: 'Rassismus' },
  { key: 'pazifismus_bellizismus', links: 'Pazifismus', rechts: 'Bellizismus' },
  { key: 'lebensbewahrung_toetungsbereitschaft', links: 'Lebensbewahrung', rechts: 'Tötungsbereitschaft' },
  { key: 'altruismus_egoismus', links: 'Altruismus', rechts: 'Egoismus' },
  { key: 'gleichberechtigung_sexismus', links: 'Gleichberechtigung', rechts: 'Sexismus' },
  { key: 'hierarchie_anarchie', links: 'Hierarchie', rechts: 'Anarchie' },
  { key: 'staaten_gilden_clans_haeuser', links: 'Staaten', rechts: 'Gilden/Clans/Häuser' },
  { key: 'kommunismus_kapitalismus', links: 'Kommunismus', rechts: 'Kapitalismus' },
  { key: 'gruppenmensch_einzelgaenger', links: 'Gruppenmensch', rechts: 'Einzelgänger' },
  { key: 'vertrauen_misstrauen', links: 'Vertrauen', rechts: 'Misstrauen' },
  { key: 'kompromissbereitschaft_sturheit', links: 'Kompromissbereitschaft', rechts: 'Sturheit' },
  { key: 'strebsamkeit_faulheit', links: 'Strebsamkeit', rechts: 'Faulheit' },
  { key: 'disziplin_triebhaftigkeit', links: 'Disziplin', rechts: 'Triebhaftigkeit' },
  { key: 'introvertiert_extrovertiert', links: 'Introvertiert', rechts: 'Extrovertiert' },
  { key: 'humor_ernst', links: 'Humor', rechts: 'Ernst' },
  { key: 'willensfreiheit_fatalismus', links: 'Willensfreiheit', rechts: 'Fatalismus' },
  { key: 'religiositaet_atheismus', links: 'Religiosität', rechts: 'Atheismus' },
  { key: 'optimismus_pessimismus', links: 'Optimismus', rechts: 'Pessimismus' },
];

/** Legende (0=Neutral "nur in Ausnahmefällen erlaubt" .. 7=Fanatisch), gilt symmetrisch für
 *  beide Pole - der Slider-Wert ist negativ für den linken, positiv für den rechten Pol. */
export const GESINNUNG_LEGEND: readonly { value: number; label: string }[] = [
  { value: 0, label: 'Neutral (nur in Ausnahmefällen erlaubt)' },
  { value: 1, label: 'Unentschlossen' },
  { value: 2, label: 'Kaum ausgeprägt' },
  { value: 3, label: 'Schwach ausgeprägt' },
  { value: 4, label: 'Ausgeprägt' },
  { value: 5, label: 'Deutlich ausgeprägt' },
  { value: 6, label: 'Stark ausgeprägt' },
  { value: 7, label: 'Fanatisch' },
];

export function gesinnungLegendLabel(intensity: number): string {
  return GESINNUNG_LEGEND.find((l) => l.value === intensity)?.label ?? '';
}

/** Menschenlesbare Beschreibung eines Slider-Werts, z.B. "Ausgeprägt (Das Böse)" oder "Neutral". */
export function describeGesinnungWert(trait: GesinnungTrait, wert: number): string {
  if (wert === 0) return 'Neutral';
  const pol = wert < 0 ? trait.links : trait.rechts;
  return `${gesinnungLegendLabel(Math.abs(wert))} (${pol})`;
}

export function countGesinnungGesetzt(gesinnung: Record<string, number> | undefined): number {
  if (!gesinnung) return 0;
  return GESINNUNG_TRAITS.filter((t) => gesinnung[t.key] !== undefined).length;
}

export function isGesinnungVollstaendig(gesinnung: Record<string, number> | undefined): boolean {
  return countGesinnungGesetzt(gesinnung) >= GESINNUNG_TRAITS.length;
}
