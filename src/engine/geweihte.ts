// Geweihte-Tab (Nutzer 2026-07-22): Gate-Talente + Geweihtengrad/KPP-Mechanik.
//
// Architekturentscheidung (Nutzer-Antwort 2026-07-22): die 5 Gate-Talente
// (urspruenglich talente_geweihter_<religion>_orthodox) sind eine STATISCHE xlsx-generierte
// Liste (siehe scripts/add_geweihte_rows.py), nicht zur Laufzeit aus religionStore.ts
// synthetisiert - neue, vom Nutzer per "+ Neu" angelegte Religionen/Sekten bekommen also
// (noch) keine eigene Stufenkette, bis die xlsx manuell erweitert wird.
//
// Geweihtengrad-Steigerung (Nutzer-Ask 2026-08-06, ersetzt die 2026-07-22-Entscheidung "nur
// Meister-vergebbar"): die 5 Gate-Talente sind jetzt Stufe 1 einer 7-stufigen Stufenkette pro
// Religion (talente_geweihter_<religion>_stufe_<1-7>_orthodox, scripts/add_geweihte_stufen.py),
// mit dem generischen Stufenketten-Mechanismus aus engine/talenteStufenKette.ts (gleiches Muster
// wie die Magus-Schulen) - Stufe N erfordert Stufe N-1 bereits gewaehlt, harter Block in
// characterMutations.ts. Jede Stufe kostet 5 TaP. getGeweihtenGrad() liest jetzt die hoechste
// gewaehlte Stufe der aktiven Religion (statt fix 1 sobald irgendein Gate-Talent gewaehlt ist).
//
// Religions-Gate (Nutzer 2026-07-22): ein Charakter darf nur die Stufenkette seiner im
// Charakterheader gewaehlten Religion+Sekte kaufen - ein Lloth-Anhaenger kann kein Geweihter
// von Tepod werden. Sekte muss ebenfalls passen (nicht nur Religion), da die Wundertabelle
// aktuell nur Orthodox abdeckt (siehe GEWEIHTER_RELIGION_BY_REFERENZ unten). Innerhalb einer
// Religion bleiben alle gekauften Stufen nebeneinander bestehen (Stufenkette); der Wechsel zu
// einer ANDEREN Religion entfernt weiterhin alle bisherigen Stufen (characterMutations.ts,
// gleiche Exklusivitaet wie zuvor, jetzt familienbasiert statt exact-referenz-basiert).
import { parseReligionSekte } from '../state/religionStore';
import { getTalentStufeInfo } from './talenteStufenKette';

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

const GEWEIHTER_RELIGIONEN = ['Lloth', 'Khartazh', 'Nomna', 'Tepod', 'Isch'] as const;

/** Statische Zuordnung Talent-Referenz -> Religion/Sekte (siehe Architekturentscheidung oben -
 *  muss von Hand erweitert werden, wenn add_geweihte_stufen.py-artige xlsx-Edits um weitere
 *  Religionen/Sekten ergaenzt werden). Ein Eintrag pro Stufe (1-7), da jede Stufe ihre eigene
 *  Talent-Referenz ist - Religion/Sekte sind fuer alle 7 Stufen einer Religion identisch. */
export const GEWEIHTER_RELIGION_BY_REFERENZ: Record<string, { religion: string; sekte: string }> = Object.fromEntries(
  GEWEIHTER_RELIGIONEN.flatMap((religion) =>
    Array.from({ length: 7 }, (_, i) => i + 1).map((stufe) => [
      `talente_geweihter_${religion.toLowerCase()}_stufe_${stufe}_orthodox`,
      { religion, sekte: 'Orthodox' },
    ]),
  ),
);

/** Prueft, ob referenz's Gate-Talent zur gewaehlten Charakter-Religion (CharacterHeader.religion,
 *  Format "Religion, Sekte") passt. Nicht-Gate-Talente sind immer erlaubt (true); ohne gewaehlte
 *  Religion ist kein Gate-Talent erlaubt. */
export function isGeweihterReferenzErlaubt(referenz: string, characterReligion: string | undefined): boolean {
  const info = GEWEIHTER_RELIGION_BY_REFERENZ[referenz.toLowerCase()];
  if (!info) return true;
  if (!characterReligion) return false;
  const { religionName, sekteName } = parseReligionSekte(characterReligion);
  return (
    religionName.trim().toLowerCase() === info.religion.toLowerCase()
    && (sekteName ?? '').trim().toLowerCase() === info.sekte.toLowerCase()
  );
}

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

/** Geweihtengrad = hoechste gewaehlte Stufe der Stufenkette (Nutzer-Ask 2026-08-06, ersetzt die
 *  vorherige feste "1 sobald irgendein Gate-Talent gewaehlt" - siehe Architekturentscheidung
 *  oben). Gemischte Religionen koennen laut characterMutations.ts-Exklusivitaet nicht gleichzeitig
 *  bestehen, daher reicht ein einfaches Maximum ueber alle gewaehlten Geweihter-Stufen. */
export function getGeweihtenGrad(sheet: SheetTalenteSource): number {
  let maxGrad = 0;
  for (const row of sheet.byKategorie['Talente'] ?? []) {
    if (!row.selected) continue;
    const info = getTalentStufeInfo(row.rule.referenz);
    if (info && info.family.startsWith(GEWEIHTER_TALENT_PREFIX) && info.stufe > maxGrad) maxGrad = info.stufe;
  }
  return maxGrad;
}
