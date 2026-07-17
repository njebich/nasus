// Leitet aus einem Trefferwurf (1-29, siehe data/trefferzonen.ts) den tatsaechlichen
// Ruestungswert an dieser Zone ab: volle oder halbe RS der zustaendigen RS-Gruppe
// (rs_kopf/rs_torso/rs_arme/rs_beine, siehe rules.ts), oder 0 fuer Zonen ohne Ruestungswert
// (Augen). "Halbe RS" wird wie alle berechneten Werte im Projekt aufgerundet (siehe
// rules.ts applyRoundingRule) statt abgeschnitten.
import { TREFFERZONEN, type RsGruppe } from '../data/trefferzonen';
import { aufrunden } from './functions';

export interface RsGruppenWerte {
  kopf: number;
  torso: number;
  arme: number;
  beine: number;
}

export function getTrefferzone(wurf: number) {
  const entry = TREFFERZONEN.find((tz) => tz.wurf === wurf);
  if (!entry) throw new Error(`Trefferwurf '${wurf}' ist keine bekannte Trefferzone (gueltig: 1-29)`);
  return entry;
}

export function computeRsFuerTrefferzone(wurf: number, rsGruppen: RsGruppenWerte): number {
  const entry = getTrefferzone(wurf);
  if (entry.rsGruppe === null) return 0;
  const basis = rsGruppen[entry.rsGruppe as RsGruppe];
  return entry.halbeRs ? aufrunden(basis / 2, 0) : basis;
}
