// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeSheet } from '../engine/characterSheet';
import { getRulesByKategorie } from '../engine/rules';
import { createCharacter } from '../state/characterStore';
import { renderGeweihteView } from './geweihte';
import { renderKiView } from './ki';
import { renderPsiView } from './psi';
import { renderSpruchmagieView } from './spruchmagie';

describe('Magie-Arbeitsbereich', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="view"></div>';
    container = document.querySelector<HTMLDivElement>('#view')!;
  });

  it('erhält Suche und Aufklappzustand der Spruchmagie beim Wechsel der Ansicht', () => {
    const character = createCharacter('Magietest', undefined, undefined, true);
    const sheet = computeSheet(character);
    renderSpruchmagieView(container, sheet, vi.fn());

    const search = container.querySelector<HTMLInputElement>('#spruchmagie-search')!;
    search.value = 'Flammenwand';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    const gesamtliste = container.querySelector<HTMLDetailsElement>('[data-spruchmagie-gesamtliste]')!;
    gesamtliste.open = false;
    gesamtliste.dispatchEvent(new Event('toggle'));

    renderPsiView(container, sheet, vi.fn());
    renderSpruchmagieView(container, sheet, vi.fn());

    expect(container.querySelector<HTMLInputElement>('#spruchmagie-search')?.value).toBe('Flammenwand');
    expect(container.querySelector<HTMLDetailsElement>('[data-spruchmagie-gesamtliste]')?.open).toBe(false);

    // Modulzustand für nachfolgende Tests neutralisieren.
    const restoredSearch = container.querySelector<HTMLInputElement>('#spruchmagie-search')!;
    restoredSearch.value = '';
    restoredSearch.dispatchEvent(new Event('input', { bubbles: true }));
    const restoredGesamtliste = container.querySelector<HTMLDetailsElement>('[data-spruchmagie-gesamtliste]')!;
    restoredGesamtliste.open = true;
    restoredGesamtliste.dispatchEvent(new Event('toggle'));
  });

  it('bindet die bestehenden Steigerungssteuerungen aller drei Magie-Renderer', () => {
    const character = createCharacter('Steigerungstest', undefined, undefined, true);
    const psiRoot = getRulesByKategorie('PSI').find((rule) => rule.art === 'Wert' && !rule.parent)!;
    const spell = getRulesByKategorie('Spruchmagie').find((rule) => rule.art === 'Wert')!;
    character.values.ki_konzentration = 1;
    character.values[psiRoot.referenz] = 1;
    character.values[spell.referenz] = 1;
    const sheet = computeSheet(character);

    const kiChange = vi.fn();
    renderKiView(container, sheet, kiChange, character.grundfertigkeitAuswahl, vi.fn());
    container.querySelector<HTMLButtonElement>('tr[data-referenz="ki_konzentration"] .stat-dec')!.click();
    expect(kiChange).toHaveBeenCalledWith('ki_konzentration', 0);

    const psiChange = vi.fn();
    renderPsiView(container, sheet, psiChange);
    container.querySelector<HTMLButtonElement>(`tr[data-referenz="${psiRoot.referenz}"] .stat-dec`)!.click();
    expect(psiChange).toHaveBeenCalledWith(psiRoot.referenz, 0);

    const spruchChange = vi.fn();
    renderSpruchmagieView(container, sheet, spruchChange);
    container.querySelector<HTMLButtonElement>(`tr[data-referenz="${spell.referenz}"] .stat-dec`)!.click();
    expect(spruchChange).toHaveBeenCalledWith(spell.referenz, 0);
  });

  it('übernimmt den KI-Auswahlzustand beim Wechsel unverändert aus dem Charakter', () => {
    const character = createCharacter('Auswahltest', undefined, undefined, true);
    character.values.ki_meister_der_grundfertigkeiten = 1;
    const sheet = computeSheet(character);
    const onPick = vi.fn();
    renderKiView(container, sheet, vi.fn(), character.grundfertigkeitAuswahl, onPick);

    const select = container.querySelector<HTMLSelectElement>('.ki-grundfertigkeit-pick')!;
    const selectedReferenz = select.options[1]!.value;
    select.value = selectedReferenz;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onPick).toHaveBeenCalledWith('ki_meister_der_grundfertigkeiten', 0, selectedReferenz);

    renderPsiView(container, sheet, vi.fn());
    renderKiView(container, sheet, vi.fn(), {
      ki_meister_der_grundfertigkeiten: [selectedReferenz],
    }, vi.fn());
    expect(container.querySelector<HTMLSelectElement>('.ki-grundfertigkeit-pick')?.value).toBe(selectedReferenz);
  });

  it('zeigt Geweihte nach dem Gate mit denselben Daten und ohne Mutationssteuerung', () => {
    const character = createCharacter('Geweihtentest', { religion: 'Nomna, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_nomna_stufe_1_orthodox = 1;
    character.values.att_karma = 3;
    const sheet = computeSheet(character);

    renderGeweihteView(container, sheet, character);
    const firstRender = container.innerHTML;
    expect(container.textContent).toContain('Nomna, Orthodox');
    expect(container.textContent).toContain('130');
    expect(container.querySelector('.geweihte-table tbody tr')).not.toBeNull();
    expect(container.querySelector('button, input, select')).toBeNull();

    renderSpruchmagieView(container, sheet, vi.fn());
    renderGeweihteView(container, sheet, character);
    expect(container.innerHTML).toBe(firstRender);
  });
});
