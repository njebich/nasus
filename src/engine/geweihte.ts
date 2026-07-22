// Geweihte-Tab (Nutzer 2026-07-22): Gate-Talente + Geweihtengrad/KPP-Mechanik.
//
// Architekturentscheidung (Nutzer-Antwort 2026-07-22): die 5 Gate-Talente
// (talente_geweihter_<religion>_orthodox) sind eine STATISCHE xlsx-generierte Liste (siehe
// scripts/add_geweihte_rows.py), nicht zur Laufzeit aus religionStore.ts synthetisiert - neue,
// vom Nutzer per "+ Neu" angelegte Religionen/Sekten bekommen also (noch) kein eigenes
// Gate-Talent, bis die xlsx manuell erweitert wird.
//
// Geweihtengrad (Nutzer-Antwort 2026-07-22): das Kaufen des Gate-Talents setzt den Charakter
// SOFORT auf Grad 1 "Niederer" - es gibt (noch) keine spielerseitige Steigerung auf Grad 2-7,
// das ist als Meistermodul-Folgearbeit im Entwickeln-Sheet vermerkt (add_geweihte_rows.py).
export interface GeweihtenGradEintrag {
  grad: number;
  titel: string;
  /** Basiswert der Formel "KPP = Basis + Karma*10" fuer diesen Grad (Nutzer-Antwort 2026-07-22:
   *  die Tabellenspalte "KPP" je Geweihtengrad ist dieser Basiswert, NICHT der Grad selbst). */
  kppBasis: number;
}

export const GEWEIHTEN_GRADE: GeweihtenGradEintrag[] = [
  { grad: 0, titel: '', kppBasis: 0 },
  { grad: 1, titel: 'Niederer', kppBasis: 100 },
  { grad: 2, titel: 'Minderer', kppBasis: 125 },
  { grad: 3, titel: 'Konfirmierter', kppBasis: 150 },
  { grad: 4, titel: 'Etablierter', kppBasis: 175 },
  { grad: 5, titel: 'Angesehener', kppBasis: 200 },
  { grad: 6, titel: 'Gesalbter', kppBasis: 225 },
  { grad: 7, titel: 'Heiliger', kppBasis: 250 },
];

export function getGeweihtenGradEintrag(grad: number): GeweihtenGradEintrag {
  return GEWEIHTEN_GRADE.find((g) => g.grad === grad) ?? GEWEIHTEN_GRADE[0];
}

/** Maximale Karma-Pool-Punkte fuer einen gegebenen Grad+Karma (Formel S.4: "Geweihtengrad +
 *  Karma*10" - praezisiert per Nutzer-Antwort 2026-07-22 zur Grad-spezifischen KPP-Basis). */
export function getMaxKpp(grad: number, karma: number): number {
  return getGeweihtenGradEintrag(grad).kppBasis + karma * 10;
}

export const GEWEIHTER_TALENT_PREFIX = 'talente_geweihter_';

/** Statische Zuordnung Talent-Referenz -> Religion/Sekte (siehe Architekturentscheidung oben -
 *  muss von Hand erweitert werden, wenn add_geweihte_rows.py um weitere Kombinationen ergaenzt wird). */
export const GEWEIHTER_RELIGION_BY_REFERENZ: Record<string, { religion: string; sekte: string }> = {
  talente_geweihter_lloth_orthodox: { religion: 'Lloth', sekte: 'Orthodox' },
  talente_geweihter_khartazh_orthodox: { religion: 'Khartazh', sekte: 'Orthodox' },
  talente_geweihter_nomna_orthodox: { religion: 'Nomna', sekte: 'Orthodox' },
  talente_geweihter_tepod_orthodox: { religion: 'Tepod', sekte: 'Orthodox' },
  talente_geweihter_isch_orthodox: { religion: 'Isch', sekte: 'Orthodox' },
};

/** Minimaler Ausschnitt aus CharacterState/ComputedSheet, den diese Datei braucht - vermeidet
 *  einen Importzyklus mit characterStore.ts/characterSheet.ts (beide importieren nichts von hier). */
interface SelectionsSource {
  selections: Record<string, number>;
}
interface SheetTalenteSource {
  byKategorie: Record<string, { rule: { referenz: string }; selected?: boolean }[]>;
}

export function findSelectedGeweihterReferenz(character: SelectionsSource): string | undefined {
  return Object.keys(character.selections).find(
    (r) => r.startsWith(GEWEIHTER_TALENT_PREFIX) && (character.selections[r] ?? 0) > 0,
  );
}

export function hasGeweihterTalent(character: SelectionsSource): boolean {
  return findSelectedGeweihterReferenz(character) !== undefined;
}

export function getAktiveGeweihteReligion(character: SelectionsSource): { religion: string; sekte: string } | undefined {
  const referenz = findSelectedGeweihterReferenz(character);
  return referenz ? GEWEIHTER_RELIGION_BY_REFERENZ[referenz] : undefined;
}

export function isGeweihterTalentSelectedInSheet(sheet: SheetTalenteSource): boolean {
  return (sheet.byKategorie['Talente'] ?? []).some(
    (r) => r.rule.referenz.startsWith(GEWEIHTER_TALENT_PREFIX) && r.selected,
  );
}

/** Fixe Geweihtengrad-Ermittlung: 1 sobald irgendein Gate-Talent gewaehlt ist, sonst 0 - siehe
 *  Architekturentscheidung oben (keine Steigerung ueber Grad 1 hinaus implementiert). */
export function getGeweihtenGrad(sheet: SheetTalenteSource): number {
  return isGeweihterTalentSelectedInSheet(sheet) ? 1 : 0;
}
