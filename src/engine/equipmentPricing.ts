// Reine Preis-Berechnung fuer Ausruestungs-Kaeufe (Phase 6: nur Preisliste + Artefakte,
// kein Markt-Kontext-Faktor angewendet - siehe Phasenplan, das ist eine bewusste Vereinfachung).

import type { PreislisteRow } from '../data/equipment/preisliste';
import type { ArtefaktKosten } from '../data/equipment/artefakte';

export type ArtefaktVariant = 'einmalig' | 'permanent';

export function previewPreislistePrice(row: PreislisteRow, quantity: number): number | null {
  if (!row.preisAvailable || row.preisDublonen == null) return null;
  return row.preisDublonen * quantity;
}

export function previewArtefaktPrice(kostenRow: ArtefaktKosten, variant: ArtefaktVariant): number | null {
  const raw = variant === 'einmalig' ? kostenRow.kostenEinmalig : kostenRow.kostenPermanent;
  if (raw == null) return null;
  const num = Number(raw.replace(',', '.'));
  return Number.isFinite(num) ? num : null;
}
