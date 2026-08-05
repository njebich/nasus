// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { computeSheet } from '../engine/characterSheet';
import { createCharacter } from '../state/characterStore';
import { renderGeweihteView } from './geweihte';

// Nutzer-Ask 2026-08-06: Geweihter-Stufenkette (Grad 2-7 spielerseitig kaufbar) + "Gute Wunder"-
// Talent (ersetzt Basis-Gute 1 durch Karma/Karma+Aura, gedeckelt auf Normale:2, "gXX nur wenn
// g>1"). Diese Tests decken die View-Ebene ab (engine/geweihte.test.ts deckt getGeweihtenGrad
// selbst schon ab) - insbesondere die tatsaechlich gerenderte Probe-Zelle inkl. "/g<X>"-Suffix.

function probeZelleFuer(container: HTMLElement, wunderName: string): string {
  const row = [...container.querySelectorAll('tr')].find((tr) => tr.textContent?.includes(wunderName));
  return row?.querySelector('td')?.textContent ?? '';
}

describe('renderGeweihteView', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="view"></div>';
    container = document.querySelector<HTMLDivElement>('#view')!;
  });

  it('zeigt den Geweihtengrad-Titel der hoechsten gekauften Stufe (nicht fix Grad 1)', () => {
    const character = createCharacter('StufenTest', { religion: 'Lloth, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_lloth_stufe_1_orthodox = 1;
    character.selections.talente_geweihter_lloth_stufe_2_orthodox = 1;
    character.selections.talente_geweihter_lloth_stufe_3_orthodox = 1;
    const sheet = computeSheet(character);

    renderGeweihteView(container, sheet, character);
    expect(container.textContent).toContain('Geweihtengrad = 3');
    expect(container.textContent).toContain('Konfirmierter');
  });

  it('zeigt die Probe ohne "/g"-Suffix, wenn "Gute Wunder" nicht gewaehlt ist', () => {
    const character = createCharacter('OhneGuteWunder', { religion: 'Lloth, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_lloth_stufe_1_orthodox = 1;
    character.values.att_karma = 5;
    character.values.whk_geweihte_stossgebet = 10;
    const sheet = computeSheet(character);

    renderGeweihteView(container, sheet, character);
    const probe = probeZelleFuer(container, 'Heiliger Blitz');
    expect(probe).not.toBe('');
    expect(probe).not.toContain('/g');
  });

  it('haengt "/g<Karma>" an, wenn "Gute Wunder Stufe 1" gewaehlt ist und Karma>1 (gedeckelt auf Normale:2)', () => {
    const character = createCharacter('GuteWunder1', { religion: 'Lloth, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_lloth_stufe_1_orthodox = 1;
    character.selections.talente_geweihte_gute_wunder_stufe_1 = 1;
    character.values.att_karma = 5;
    character.values.whk_geweihte_stossgebet = 30;
    const sheet = computeSheet(character);

    renderGeweihteView(container, sheet, character);
    const probe = probeZelleFuer(container, 'Heiliger Blitz');
    // Normale = Aus.Bon + TaW(30) - Malus(3); Gute = min(Karma=5, floor(Normale/2)).
    expect(probe).toMatch(/^-?\d+\/g\d+$/);
    const [normale, gute] = probe.split('/g').map(Number);
    expect(gute).toBe(Math.min(5, Math.floor(normale / 2)));
    expect(gute).toBeGreaterThan(1);
  });

  it('Stufe 2 nutzt Karma+Aura statt nur Karma', () => {
    const character = createCharacter('GuteWunder2', { religion: 'Lloth, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_lloth_stufe_1_orthodox = 1;
    character.selections.talente_geweihte_gute_wunder_stufe_1 = 1;
    character.selections.talente_geweihte_gute_wunder_stufe_2 = 1;
    character.values.att_karma = 3;
    character.values.att_aura = 6;
    character.values.whk_geweihte_stossgebet = 30;
    const sheet = computeSheet(character);

    renderGeweihteView(container, sheet, character);
    const probe = probeZelleFuer(container, 'Heiliger Blitz');
    const [normale, gute] = probe.split('/g').map(Number);
    // Karma(3) + Aura(6) = 9, gedeckelt auf floor(Normale/2).
    expect(gute).toBe(Math.min(9, Math.floor(normale / 2)));
  });

  it('unterdrueckt das "/g"-Suffix, wenn die gedeckelte Gute <=1 waere (Anzeigeregel Proben v2.0.md §7)', () => {
    const character = createCharacter('GuteWunderNiedrig', { religion: 'Lloth, Orthodox' }, undefined, true);
    character.selections.talente_geweihter_lloth_stufe_1_orthodox = 1;
    character.selections.talente_geweihte_gute_wunder_stufe_1 = 1;
    character.values.att_karma = 1; // Gute = min(1, ...) <= 1 -> kein Suffix
    character.values.whk_geweihte_stossgebet = 10;
    const sheet = computeSheet(character);

    renderGeweihteView(container, sheet, character);
    const probe = probeZelleFuer(container, 'Heiliger Blitz');
    expect(probe).not.toContain('/g');
  });
});
