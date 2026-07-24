// Talente-Stufenketten (Nutzer 2026-07-24): "Stufe N" eines Talents darf erst gewaehlt werden,
// wenn "Stufe N-1" derselben Familie bereits gewaehlt ist. Analog zur Spruchmagie-Vorstufenkette
// (engine/spruchmagieGating.ts#canIncreaseSpell), hier aber als harter Block in
// characterMutations.ts statt nur UI-Gating, weil die Auswahl-Checkbox sonst ohne Fehlermeldung
// einfach eine hoehere Stufe ohne die Vorstufe(n) setzen wuerde.
//
// Familien-Erkennung: der Regelfall ist "talente_<familie>_stufe_<N>[_beliebiger Rest]" - ein
// Rest nach der Nummer (z.B. "_doppelschuss"/"_tripelschuss" bei Mehrfachschuss) wird ignoriert,
// da er pro Stufe unterschiedlich benannt ist und die Familie trotzdem eindeutig ist. Ausnahme:
// die 12 Magus-Schulen (talente_magus_stufe_<N>_<schule>_(gross|erz)?magus) - hier steht die
// Schule NACH der Nummer und MUSS pro Schule getrennt gruppiert werden, sonst wuerde z.B. "Stufe
// 2: Feuerbeschwoerungs-Grossmagus" durch irgendeine andere Stufe-1-Schule freigeschaltet. Die
// Schul-Suffixe "_magus"/"_grossmagus"/"_erzmagus" und ein optionales Genitiv-"s" werden dafuer
// entfernt (die xlsx schreibt uneinheitlich "antimagie_magus" vs. "antimagies_grossmagus").

import { RULES } from '../data/rules';

interface StufeInfo {
  family: string;
  stufe: number;
}

const MAGUS_STUFE_RE = /^talente_magus_stufe_(\d+)_(.+)$/;
const MAGUS_SUFFIX_RE = /_(gross|erz)?magus$/;
const GENERAL_STUFE_RE = /^(talente_.+?)_stufe_?0*(\d+)/;

function parseStufe(referenzLower: string): StufeInfo | null {
  const magus = MAGUS_STUFE_RE.exec(referenzLower);
  if (magus) {
    const schule = magus[2].replace(MAGUS_SUFFIX_RE, '').replace(/s$/, '');
    return { family: `talente_magus_${schule}`, stufe: Number(magus[1]) };
  }
  const general = GENERAL_STUFE_RE.exec(referenzLower);
  if (general) return { family: general[1], stufe: Number(general[2]) };
  return null;
}

// Einmalig aus RULES aufgebaut (Talente-Auswahl-Regeln aendern sich nicht zur Laufzeit).
const stufeByReferenz = new Map<string, StufeInfo>();
const referenzByFamilyStufe = new Map<string, string>(); // Key `${family}::${stufe}`
for (const rule of RULES) {
  if (rule.kategorie !== 'Talente' || rule.art !== 'Auswahl') continue;
  const key = rule.referenz.toLowerCase();
  const info = parseStufe(key);
  if (!info) continue;
  stufeByReferenz.set(key, info);
  referenzByFamilyStufe.set(`${info.family}::${info.stufe}`, key);
}

/** Referenz (lowercase) der direkt darunterliegenden Stufe derselben Talent-Familie, falls
 *  `referenz` eine Stufe > 1 ist UND eine solche Vorstufe im Regelwerk existiert (z.B.
 *  "Spruchmagie Stufe 2 zaubern" hat keine "Stufe 1"-Zeile - dort ist Stufe 2 die niedrigste
 *  vorhandene und braucht keine Vorstufe). */
export function getVorstufeReferenz(referenz: string): string | undefined {
  const info = stufeByReferenz.get(referenz.toLowerCase());
  if (!info || info.stufe <= 1) return undefined;
  return referenzByFamilyStufe.get(`${info.family}::${info.stufe - 1}`);
}

/** Alle Referenzen (lowercase) hoeherer Stufen derselben Familie - fuer die Kaskaden-Entfernung
 *  in removeSelection: faellt eine Stufe weg, sind alle darauf aufbauenden Stufen nicht mehr
 *  durch eine gueltige Kette gedeckt. */
export function getHoehereStufenReferenzen(referenz: string): string[] {
  const info = stufeByReferenz.get(referenz.toLowerCase());
  if (!info) return [];
  return [...stufeByReferenz.entries()]
    .filter(([, other]) => other.family === info.family && other.stufe > info.stufe)
    .map(([ref]) => ref);
}
