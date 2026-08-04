// Preisliste (generische Kategorie "Art") - siehe ausruestung.ts-Dateikopf fuer den
// Gesamtkontext der Ausruestungs-Ansicht.

import { PREISLISTE } from '../data/equipment/preisliste';
import { previewPreislistePrice } from '../engine/equipmentPricing';
import { escapeHtml, kaufenLabel } from './ausruestungShared';
import type { AusruestungCallbacks } from './ausruestung';

export const PREISLISTE_ARTEN = [...new Set(PREISLISTE.map((r) => r.art).filter((a): a is string => !!a))].sort();

export function renderPreislisteRow(row: (typeof PREISLISTE)[number]): string {
  const price = previewPreislistePrice(row, 1);
  return `
    <div class="ausruestung-row">
      <span class="stat-label">${escapeHtml(row.name ?? '')}</span>
      ${price !== null ? `
        <input type="number" class="ausruestung-qty" min="1" value="1" data-source-row="${row.sourceRow}" />
        <button type="button" class="ausruestung-buy-button ausruestung-buy" data-source-row="${row.sourceRow}" data-unit-price="${price}">${kaufenLabel(price)}</button>
      ` : `<span class="stat-cost">nicht käuflich (${escapeHtml(row.preisRoh ?? '?')})</span><span></span>`}
    </div>`;
}

export function wirePreislisteEvents(container: HTMLElement, callbacks: AusruestungCallbacks): void {
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.sourceRow);
      const qtyInput = container.querySelector<HTMLInputElement>(`.ausruestung-qty[data-source-row="${sourceRow}"]`);
      const quantity = Math.max(1, Math.floor(Number(qtyInput?.value ?? '1')));
      callbacks.onBuyPreisliste(sourceRow, quantity);
    });
  });
  container.querySelectorAll<HTMLInputElement>('.ausruestung-qty[data-source-row]').forEach((input) => {
    input.addEventListener('input', () => {
      const button = container.querySelector<HTMLButtonElement>(`.ausruestung-buy[data-source-row="${input.dataset.sourceRow}"]`);
      const quantity = Math.max(1, Math.floor(Number(input.value || '1')));
      const unitPrice = Number(button?.dataset.unitPrice);
      if (button && Number.isFinite(unitPrice)) button.textContent = kaufenLabel(unitPrice * quantity);
    });
  });
}
