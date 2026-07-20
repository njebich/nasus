// "Meister der Grundfertigkeiten" (KI-Talent, Nutzer 2026-07-20): eine Grundfertigkeit wird fest
// gewaehlt, sobald der Talent-TaW 1 erreicht; ab TaW 5 kann eine weitere gewaehlt werden, dann
// alle weiteren 5 TaW eine mehr (5, 10, 15, ...) - Ausnahme ist der erste Slot, der schon bei
// TaW 1 statt erst bei TaW 5 freigeschaltet ist (Nutzer-Bestaetigung 2026-07-20). Analog zu
// kiBaumGating.ts bewusst nur UI-Ebene, keine Durchsetzung in characterMutations.ts.

import { getRulesByKategorie } from './rules';

export const MEISTER_DER_GRUNDFERTIGKEITEN_REFERENZ = 'ki_meister_der_grundfertigkeiten';

export function grundfertigkeitSlotCount(taw: number): number {
  if (taw < 1) return 0;
  return 1 + Math.floor(taw / 5);
}

export function getGrundfertigkeitOptionen(): { referenz: string; name: string }[] {
  return getRulesByKategorie('Grundfertigkeit')
    .filter((r) => r.art === 'Wert')
    .map((r) => ({ referenz: r.referenz, name: r.beschreibung ?? r.referenz }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
}
