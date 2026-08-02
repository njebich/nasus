// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeSheet } from '../engine/characterSheet';
import { getGrundfertigkeitOptionen } from '../engine/grundfertigkeitAuswahl';
import { getRulesByKategorie } from '../engine/rules';
import { createCharacter } from '../state/characterStore';
import { renderReadOnlyBesitzView } from './besitz';
import { renderCharakterbogen } from './charakterbogen';
import { renderGeweihteView } from './geweihte';
import { renderKiView, renderReadOnlyKiView } from './ki';
import { renderPsiView, renderReadOnlyPsiView } from './psi';
import { renderReadOnlySpruchmagieView, renderSpruchmagieView } from './spruchmagie';

describe('Charakterbogen-Untertabs als reine Ausgabe', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="view"></div>';
    container = document.querySelector<HTMLDivElement>('#view')!;
  });

  it('zeigt Spruchmagie, KI und PSI mit denselben aktuellen TaW wie die Arbeitsansichten', () => {
    const character = createCharacter('Read-only-Magie', undefined, undefined, true);
    const spell = getRulesByKategorie('Spruchmagie').find((rule) => rule.art === 'Wert')!;
    const psiRoot = getRulesByKategorie('PSI').find((rule) => rule.art === 'Wert' && !rule.parent)!;
    character.values[spell.referenz] = 2;
    character.values.ki_konzentration = 3;
    character.values[psiRoot.referenz] = 4;
    const sheet = computeSheet(character);

    // Arbeitsansichten zeigen den TaW seit Punkt 12 ueber ein editierbares .stat-value-Eingabefeld,
    // nicht mehr ueber die .kampf-pool-value-Span - die bleibt der readOnly-Anzeige vorbehalten.
    renderSpruchmagieView(container, sheet, vi.fn());
    const spruchArbeitswert = container.querySelector<HTMLInputElement>(`tr[data-referenz="${spell.referenz}"] .stat-value`)?.value;
    renderReadOnlySpruchmagieView(container, sheet);
    expect(container.querySelector(`tr[data-referenz="${spell.referenz}"] .kampf-pool-value`)?.textContent).toBe(spruchArbeitswert);

    renderKiView(container, sheet, vi.fn(), character.grundfertigkeitAuswahl, vi.fn());
    const kiArbeitswert = container.querySelector<HTMLInputElement>('tr[data-referenz="ki_konzentration"] .stat-value')?.value;
    renderReadOnlyKiView(container, sheet, character.grundfertigkeitAuswahl);
    expect(container.querySelector('tr[data-referenz="ki_konzentration"] .kampf-pool-value')?.textContent).toBe(kiArbeitswert);

    renderPsiView(container, sheet, vi.fn());
    const psiArbeitswert = container.querySelector<HTMLInputElement>(`tr[data-referenz="${psiRoot.referenz}"] .stat-value`)?.value;
    renderReadOnlyPsiView(container, sheet);
    expect(container.querySelector(`tr[data-referenz="${psiRoot.referenz}"] .kampf-pool-value`)?.textContent).toBe(psiArbeitswert);
  });

  it('bindet in den drei neuen Read-only-Renderern keine Eingaben oder Buttons', () => {
    const character = createCharacter('Ohne Steuerung', undefined, undefined, true);
    character.values.ki_meister_der_grundfertigkeiten = 1;
    const grundfertigkeit = getGrundfertigkeitOptionen()[0]!;
    character.grundfertigkeitAuswahl.ki_meister_der_grundfertigkeiten = [grundfertigkeit.referenz];
    const sheet = computeSheet(character);

    for (const render of [
      () => renderReadOnlySpruchmagieView(container, sheet),
      () => renderReadOnlyKiView(container, sheet, character.grundfertigkeitAuswahl),
      () => renderReadOnlyPsiView(container, sheet),
    ]) {
      render();
      expect(container.querySelector('button, input, select, textarea')).toBeNull();
    }

    renderReadOnlyKiView(container, sheet, character.grundfertigkeitAuswahl);
    expect(container.textContent).toContain(grundfertigkeit.name);
  });

  it('hält alle sechs Charakterbogen-Ausgaben frei von Mutationssteuerungen', () => {
    const character = createCharacter('Alle Blätter', { religion: 'Nomna, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_nomna_orthodox = 1;
    const sheet = computeSheet(character);
    const renderers = [
      () => renderCharakterbogen(container, sheet, character),
      () => renderReadOnlySpruchmagieView(container, sheet),
      () => renderReadOnlyKiView(container, sheet, character.grundfertigkeitAuswahl),
      () => renderReadOnlyPsiView(container, sheet),
      () => renderGeweihteView(container, sheet, character),
      () => renderReadOnlyBesitzView(container, character),
    ];

    for (const render of renderers) {
      render();
      expect(container.querySelector('button, input, select, textarea')).toBeNull();
      expect(container.querySelector('.stat-inc, .stat-dec, [data-remove], [data-buy]')).toBeNull();
    }
  });

  it('verwendet für Charakterbogen und Inventar denselben Besitzrenderer inklusive Rüstung', () => {
    const character = createCharacter('Inventarspiegel', undefined, undefined, true);
    character.ruestungSlots['Kopf:1'] = {
      basisSourceRow: 1,
      verarbeitungSourceRow: 2,
      anpassungSourceRow: 3,
      computedStatsSnapshot: { rs: 2, rh: 1, verfuegbarkeitNw: 1, verfuegbarkeitAw: 1 },
      computedPriceSnapshot: 3,
    };

    renderReadOnlyBesitzView(container, character);
    const inventarHtml = container.innerHTML;
    renderReadOnlyBesitzView(container, character);
    expect(container.innerHTML).toBe(inventarHtml);
    expect(container.textContent).toContain('Rüstung');
    expect(container.textContent).toContain('Kopf:1');
  });
});
