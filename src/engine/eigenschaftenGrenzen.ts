// Eigenschaften-Grenzen je Volk (Regel Nutzer 2026-07-17, werte 0.8 / Sheet "Voelker-Maxima"):
// waehrend der Charaktererstellung gilt Erstellungs-Min/-Max je Volk+Eigenschaft; sobald der
// Charakter Kreis 3 erreicht hat, gilt stattdessen die einheitliche Obergrenze "Max (ab Kreis 3)"
// (=31 fuer alle Voelker/Eigenschaften) - die Untergrenze (Erstellungs-Min) bleibt unveraendert.

import { VOELKER_MAXIMA } from '../data/voelkerMaxima';
import { getRule } from './rules';
import { normalizeForMatch } from './normalize';

export interface EigenschaftGrenzen {
  min: number;
  max: number;
}

const byKey = new Map<string, VoelkerMaximaEntry>();

interface VoelkerMaximaEntry {
  erstellungsMin: number;
  erstellungsMax: number;
  maxAbKreis3: number;
}

for (const row of VOELKER_MAXIMA) {
  byKey.set(`${normalizeForMatch(row.volk)}::${normalizeForMatch(row.eigenschaft)}`, {
    erstellungsMin: row.erstellungsMin,
    erstellungsMax: row.erstellungsMax,
    maxAbKreis3: row.maxAbKreis3,
  });
}

/**
 * Grenzen fuer eine Eigenschafts-Referenz (z.B. "eig_g_mut") bei gegebener Spezies + aktuellem
 * Kreis. Gibt undefined zurueck, wenn die Spezies nicht in Voelker-Maxima bekannt ist (z.B. ein
 * Test-Fixture-Wert wie "Mensch") - dann gilt keine Einschraenkung ausser Wert>=0.
 */
export function getEigenschaftGrenzen(spezies: string, referenz: string, kreis: number): EigenschaftGrenzen | undefined {
  const rule = getRule(referenz);
  const eigenschaftLabel = rule?.beschreibung ?? referenz;
  const entry = byKey.get(`${normalizeForMatch(spezies)}::${normalizeForMatch(eigenschaftLabel)}`);
  if (!entry) return undefined;
  return {
    min: entry.erstellungsMin,
    max: kreis >= 3 ? entry.maxAbKreis3 : entry.erstellungsMax,
  };
}
