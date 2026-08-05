// Gesinnung/Charakterzüge (S09 Gesinnung.docx): 22 Slider von -7 (linker Pol) bis +7 (rechter
// Pol), kostenlos, frei setzbar. Kein Bezug zum Regelwerk - reine Charakterisierung, daher kein
// computeSheet/ComputedRule-Bezug wie bei den Punktekauf-Tabs.

import type { CharacterState } from '../state/characterStore';
import {
  GESINNUNG_TRAITS, GESINNUNG_LEGEND, describeGesinnungWert, countGesinnungGesetzt,
} from '../data/gesinnung';

export type OnGesinnungChange = (traitKey: string, wert: number) => void;
export type OnGesinnungNotizChange = (notiz: string) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderLegende(): string {
  return `
    <div class="gesinnung-legende">
      <strong>Legende</strong>
      <ol class="gesinnung-legende-liste" start="0">
        ${GESINNUNG_LEGEND.map((l) => `<li value="${l.value}">${l.value} = ${escapeHtml(l.label)}</li>`).join('')}
      </ol>
    </div>`;
}

export function renderGesinnungView(
  container: HTMLElement,
  character: CharacterState,
  onChange: OnGesinnungChange,
  onNotizChange: OnGesinnungNotizChange,
): void {
  const gesetzt = countGesinnungGesetzt(character.gesinnung);
  const vollstaendig = gesetzt >= GESINNUNG_TRAITS.length;

  container.innerHTML = `
    <section class="gesinnung-view" aria-labelledby="gesinnung-heading">
      <h2 id="gesinnung-heading">Gesinnung</h2>
      ${renderLegende()}
      ${!vollstaendig ? `<div class="error-message">Noch nicht alle Charakterzüge gesetzt (${gesetzt} von ${GESINNUNG_TRAITS.length}) - der Charakter gilt erst als vollständig, wenn jeder Slider einmal gesetzt wurde.</div>` : ''}
      <div class="gesinnung-grid">
        ${GESINNUNG_TRAITS.map((trait) => {
          const istGesetzt = character.gesinnung[trait.key] !== undefined;
          const wert = character.gesinnung[trait.key] ?? 0;
          return `
            <span class="gesinnung-label gesinnung-label-links">${escapeHtml(trait.links)}</span>
            <div class="gesinnung-slider-wrap ${istGesetzt ? '' : 'gesinnung-row-unset'}">
              <input
                type="range"
                class="gesinnung-slider"
                data-trait="${escapeHtml(trait.key)}"
                min="-7" max="7" step="1"
                value="${wert}"
              />
              <span class="gesinnung-readout" data-trait-readout="${escapeHtml(trait.key)}">
                ${istGesetzt ? escapeHtml(describeGesinnungWert(trait, wert)) : '– nicht gesetzt –'}
              </span>
            </div>
            <span class="gesinnung-label gesinnung-label-rechts">${escapeHtml(trait.rechts)}</span>`;
        }).join('')}
      </div>
      <label class="gesinnung-notiz-feld">
        <span>Besonderheiten und Anmerkungen</span>
        <textarea data-gesinnung-notiz rows="4">${escapeHtml(character.gesinnungNotiz ?? '')}</textarea>
      </label>
    </section>`;

  container.querySelectorAll<HTMLInputElement>('.gesinnung-slider').forEach((slider) => {
    const traitKey = slider.dataset.trait!;
    const trait = GESINNUNG_TRAITS.find((t) => t.key === traitKey)!;
    const readout = container.querySelector<HTMLSpanElement>(`[data-trait-readout="${traitKey}"]`);
    slider.addEventListener('input', () => {
      if (readout) readout.textContent = describeGesinnungWert(trait, Number(slider.value));
    });
    slider.addEventListener('change', () => {
      onChange(traitKey, Number(slider.value));
    });
  });

  container.querySelector<HTMLTextAreaElement>('[data-gesinnung-notiz]')?.addEventListener('change', (event) => {
    onNotizChange((event.target as HTMLTextAreaElement).value);
  });
}
