// Ruestungs-Komposition: Basis x Verarbeitung x Anpassung.
// Formel bestaetigt aus dem "Entwickeln"-Sheet (Autoren-Changelog) und gegen das dort
// dokumentierte Beispiel verifiziert (Stoffruestung+Meisterarbeit+angepasst -> RS=3, RH=1,
// Preis=227, NW=3, AW=2 - alle 5 Werte exakt reproduziert, siehe armorComposition.test.ts).
// Ruestung-Addons ist NICHT Teil dieser Formel (im Changelog nicht mitgetestet) - bewusst
// nicht eingebaut, siehe Phase-9-Notizen.
//
// Regelkorrektur (Nutzer 2026-07-17): eine Ruestungslage verursacht keine direkte Behinderung
// (BE), sondern "Ruestungshinderlichkeit" (RH). Die xlsx-Spaltennamen heissen weiterhin
// "BE-Basis"/"BE-Mod" (Datenquelle unveraendert), das Ergebnis dieser Funktion heisst aber
// korrekt `rh`. Die RH aller Lagen und Trefferzonen wird zu RHg aufsummiert (Kampfmodul-Scope,
// noch nicht live berechenbar - rules.ts nimmt RHg=0 als Platzhalter an); aus RHg leitet sich
// erst per computeRbe() die tatsaechliche Ruestungsbehinderung (RBE) ab.

import type { GenericRow } from '../data/equipment/armor';

function num(row: GenericRow, header: string): number {
  const raw = row[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export interface ComposedArmor {
  rs: number;
  rh: number;
  preis: number;
  verfuegbarkeitNw: number;
  verfuegbarkeitAw: number;
}

export function composeArmor(basis: GenericRow, verarbeitung: GenericRow, anpassung: GenericRow): ComposedArmor {
  const rsBasis = num(basis, 'RS-Basis');
  const rhBasis = num(basis, 'BE-Basis');
  const lage = num(basis, 'Lage');
  const materialkosten = num(basis, 'Materialkosten');
  const arbeitszeitBasis = num(basis, 'Arbeitszeit-Tag-Basis');

  const rsModVerarbeitung = num(verarbeitung, 'RS-Mod');
  const rhModVerarbeitung = num(verarbeitung, 'BE-Mod');
  const lohnProTag = num(verarbeitung, 'Lohn-pro-Tag');

  const rhModAnpassung = num(anpassung, 'BE-Mod');
  const zusaetzlicheTage = num(anpassung, 'Zusaetzliche-Tage');

  const rs = rsBasis + rsModVerarbeitung;
  const rh = Math.max(lage, rhBasis + rhModVerarbeitung + rhModAnpassung);
  const preis = materialkosten + lohnProTag * (arbeitszeitBasis + zusaetzlicheTage);
  const verfuegbarkeitNw = Math.max(
    num(basis, 'Verfuegbarkeit-NW'), num(verarbeitung, 'Verfuegbarkeit-NW'), num(anpassung, 'Verfuegbarkeit-NW'),
  );
  const verfuegbarkeitAw = Math.max(
    num(basis, 'Verfuegbarkeit-AW'), num(verarbeitung, 'Verfuegbarkeit-AW'), num(anpassung, 'Verfuegbarkeit-AW'),
  );

  return { rs, rh, preis, verfuegbarkeitNw, verfuegbarkeitAw };
}

/**
 * Ruestungsbehinderung (RBE), abgeleitet aus RHg (Summe aller RH-Werte ueber alle getragenen
 * Ruestungslagen und Trefferzonen) - Regelkorrektur Nutzer 2026-07-17:
 * RBE = (RHg - ((Kon/5 + Staerke)/2 + sf_ruestungsmanoever)) / 6
 * RHg selbst ist noch nicht live berechenbar (Kampfmodul-Scope, braucht Ausruestung-pro-
 * Trefferzone-Tracking) - diese Funktion ist bewusst schon fertig+getestet fuer den Tag, an dem
 * das existiert.
 */
export function computeRbe(rhg: number, kon: number, staerke: number, sfRuestungsmanoever: number): number {
  return (rhg - ((kon / 5 + staerke) / 2 + sfRuestungsmanoever)) / 6;
}
