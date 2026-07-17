// Ruestungs-Komposition: Basis x Verarbeitung x Anpassung.
// Formel bestaetigt aus dem "Entwickeln"-Sheet (Autoren-Changelog) und gegen das dort
// dokumentierte Beispiel verifiziert (Stoffruestung+Meisterarbeit+angepasst -> RS=3, BE=1,
// Preis=227, NW=3, AW=2 - alle 5 Werte exakt reproduziert, siehe armorComposition.test.ts).
// Ruestung-Addons ist NICHT Teil dieser Formel (im Changelog nicht mitgetestet) - bewusst
// nicht eingebaut, siehe Phase-9-Notizen.

import type { GenericRow } from '../data/equipment/armor';

function num(row: GenericRow, header: string): number {
  const raw = row[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export interface ComposedArmor {
  rs: number;
  be: number;
  preis: number;
  verfuegbarkeitNw: number;
  verfuegbarkeitAw: number;
}

export function composeArmor(basis: GenericRow, verarbeitung: GenericRow, anpassung: GenericRow): ComposedArmor {
  const rsBasis = num(basis, 'RS-Basis');
  const beBasis = num(basis, 'BE-Basis');
  const lage = num(basis, 'Lage');
  const materialkosten = num(basis, 'Materialkosten');
  const arbeitszeitBasis = num(basis, 'Arbeitszeit-Tag-Basis');

  const rsModVerarbeitung = num(verarbeitung, 'RS-Mod');
  const beModVerarbeitung = num(verarbeitung, 'BE-Mod');
  const lohnProTag = num(verarbeitung, 'Lohn-pro-Tag');

  const beModAnpassung = num(anpassung, 'BE-Mod');
  const zusaetzlicheTage = num(anpassung, 'Zusaetzliche-Tage');

  const rs = rsBasis + rsModVerarbeitung;
  const be = Math.max(lage, beBasis + beModVerarbeitung + beModAnpassung);
  const preis = materialkosten + lohnProTag * (arbeitszeitBasis + zusaetzlicheTage);
  const verfuegbarkeitNw = Math.max(
    num(basis, 'Verfuegbarkeit-NW'), num(verarbeitung, 'Verfuegbarkeit-NW'), num(anpassung, 'Verfuegbarkeit-NW'),
  );
  const verfuegbarkeitAw = Math.max(
    num(basis, 'Verfuegbarkeit-AW'), num(verarbeitung, 'Verfuegbarkeit-AW'), num(anpassung, 'Verfuegbarkeit-AW'),
  );

  return { rs, be, preis, verfuegbarkeitNw, verfuegbarkeitAw };
}
