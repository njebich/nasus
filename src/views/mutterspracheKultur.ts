// Kostenlose Muttersprache + Kultur bei Erschaffung (siehe engine/voelker.ts,
// state/characterMutations.ts setFreieSpracheUndKultur). Freie Wahl, nicht an die
// eingetragene Spezies gekoppelt (Nutzer 2026-07-17, nach "NN Sprachen 0.11.docx").

import { VOELKER } from '../engine/voelker';
import type { CharacterState } from '../state/characterStore';

export type OnMutterspracheKulturChange = (spracheReferenz: string | null, kulturReferenz: string | null) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderMutterspracheKultur(
  container: HTMLElement, character: CharacterState, onChange: OnMutterspracheKulturChange,
): void {
  const volk = VOELKER.find((v) => v.kulturReferenz === character.freieKulturReferenz);
  const spracheOptionen = volk?.spracheOptionen ?? [];

  container.innerHTML = `
    <div class="mutter-kultur">
      <label class="mutter-kultur-field">
        <span>Muttersprache &amp; Kultur (kostenlos)</span>
        <select id="mk-volk">
          <option value="">-- Volk wählen --</option>
          ${VOELKER.map((v) => `<option value="${v.kulturReferenz}" ${v.kulturReferenz === character.freieKulturReferenz ? 'selected' : ''}>${escapeHtml(v.label)}</option>`).join('')}
        </select>
      </label>
      ${spracheOptionen.length > 1 ? `
      <label class="mutter-kultur-field">
        <span>Dialekt</span>
        <select id="mk-sprache">
          <option value="">-- Dialekt wählen --</option>
          ${spracheOptionen.map((s) => `<option value="${s.referenz}" ${s.referenz === character.freieSpracheReferenz ? 'selected' : ''}>${escapeHtml(s.label)}</option>`).join('')}
        </select>
      </label>` : ''}
    </div>`;

  container.querySelector<HTMLSelectElement>('#mk-volk')?.addEventListener('change', (e) => {
    const kulturReferenz = (e.target as HTMLSelectElement).value || null;
    const gewaehltesVolk = VOELKER.find((v) => v.kulturReferenz === kulturReferenz);
    // Bei genau einem Dialekt gleich mit setzen (kein extra Klick noetig), bei mehreren muss
    // der Spieler noch waehlen - siehe zweites Dropdown, das dann erscheint.
    const spracheReferenz = gewaehltesVolk?.spracheOptionen.length === 1
      ? gewaehltesVolk.spracheOptionen[0].referenz
      : null;
    onChange(spracheReferenz, kulturReferenz);
  });

  container.querySelector<HTMLSelectElement>('#mk-sprache')?.addEventListener('change', (e) => {
    const spracheReferenz = (e.target as HTMLSelectElement).value || null;
    onChange(spracheReferenz, character.freieKulturReferenz ?? null);
  });
}
