// Reine Info-Ermittlung fuer die 60 Talente aus data/talenteKampfmodul.ts (Kampfrunden-/Proben-
// Mechaniken ohne editierbaren Zielwert, siehe scripts/extract_talente_kampfmodul.py). Liefert
// fuer jedes vom Charakter GEWAEHLTE dieser Talente Name+Wirkungstext, damit views/kampf.ts sie
// als reine Hinweiszeilen anzeigen kann ("Talent-Effekte (Kampfmodul)") - keine Zahl wird hier
// berechnet oder auf irgendeine Formel angewendet.
import { TALENTE_KAMPFMODUL } from '../data/talenteKampfmodul';
import { RULES } from '../data/rules';
import type { CharacterState } from '../state/characterStore';

export interface TalentKampfmodulInfo {
  referenz: string;
  name: string;
  wirkung: string;
}

export function getOwnedKampfmodulTalentInfo(character: CharacterState): TalentKampfmodulInfo[] {
  const out: TalentKampfmodulInfo[] = [];
  for (const referenz of TALENTE_KAMPFMODUL) {
    if ((character.selections[referenz.toLowerCase()] ?? 0) <= 0) continue;
    const rule = RULES.find((r) => r.referenz === referenz);
    if (!rule) continue;
    out.push({ referenz, name: rule.beschreibung ?? referenz, wirkung: rule.wirkung ?? '' });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
