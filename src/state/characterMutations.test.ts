import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import {
  setValue, addSelection, removeSelection, setFreieSpracheUndKultur, BudgetError, MutationError,
} from './characterMutations';
import { computeSheet } from '../engine/characterSheet';

function withEpGesamt(epGesamt: number) {
  const character = createCharacter('Test');
  character.values['ep_gesamt'] = epGesamt;
  return character;
}

describe('characterMutations', () => {
  it('setValue erhoeht einen Wert, wenn genug SP vorhanden sind', () => {
    const character = withEpGesamt(1000);
    const updated = setValue(character, 'eig_g_mut', 5);
    expect(updated.values['eig_g_mut']).toBe(5);
  });

  it('setValue lehnt ab, wenn nicht genug SP vorhanden sind', () => {
    // SP = 6400 + ep_gesamt (feste Konstante in der Formel) - selbst bei ep_gesamt=0 hat man
    // also 6400 SP, und eine einzelne Eigenschaft kostet maximal 6213 (Wert 64, Tabellenende) -
    // daher zwei Eigenschaften kombinieren, um das Budget sicher zu ueberschreiten.
    const character = withEpGesamt(0);
    const afterFirst = setValue(character, 'eig_g_mut', 64); // kostet 6213 von 6400 SP
    expect(() => setValue(afterFirst, 'eig_k_athletik', 10)).toThrow(BudgetError); // weitere 300 SP -> ueber Budget
  });

  it('setValue lehnt eine unbekannte Referenz ab', () => {
    const character = withEpGesamt(1000);
    expect(() => setValue(character, 'does_not_exist', 1)).toThrow(MutationError);
  });

  it('setValue lehnt eine Formel-Referenz ab (nicht direkt setzbar)', () => {
    const character = withEpGesamt(1000);
    expect(() => setValue(character, 'at_hiebwaffen', 5)).toThrow(MutationError);
  });

  it('addSelection/removeSelection schalten eine Auswahl an/aus (Talente kosten TaP, nicht SP)', () => {
    const character = withEpGesamt(0); // ep_gesamt=0 -> Stufe 0 -> TaP-Budget = 20+0*5 = 20
    const rule = 'talente_zaeher_bursche_stufe_1'; // Kosten: 16 TaP
    const withSelection = addSelection(character, rule);
    expect(withSelection.selections[rule]).toBe(1);
    const withoutSelection = removeSelection(withSelection, rule);
    expect(withoutSelection.selections[rule]).toBeUndefined();
  });

  it('addSelection lehnt ein Talent ab, wenn nicht genug TaP vorhanden sind', () => {
    const character = withEpGesamt(0); // TaP-Budget bei Stufe 0 = 20
    // talente_schnell_zaubern_stufe_1 kostet 85 TaP - deutlich mehr als das Minimalbudget.
    expect(() => addSelection(character, 'talente_schnell_zaubern_stufe_1')).toThrow(BudgetError);
  });

  it('ein Nachteil (negative Kosten) erhoeht das verfuegbare SP-Budget statt es zu verringern', () => {
    const character = withEpGesamt(0);
    // vn_leicht_anfaelligkeit_gegen_alchemie hat Kosten=-20 -> gibt 20 SP zurueck
    const updated = addSelection(character, 'vn_leicht_anfaelligkeit_gegen_alchemie');
    expect(updated.selections['vn_leicht_anfaelligkeit_gegen_alchemie']).toBe(1);
    // Mit den so gewonnenen 20 SP sollte jetzt z.B. eine Grundfertigkeit (9 SP/Punkt) kaufbar sein
    const withSkill = setValue(updated, 'gr_klettern', 2);
    expect(withSkill.values['gr_klettern']).toBe(2);
  });

  it('setFreieSpracheUndKultur setzt Sprache=Muttersprache(3)/Kultur=Vaterland(3) kostenlos (Nutzer 2026-07-17)', () => {
    const character = withEpGesamt(0);
    const updated = setFreieSpracheUndKultur(character, 'whk_sprache_zwergisch', 'whk_kultur_zwerge');
    expect(updated.values['whk_sprache_zwergisch']).toBe(3);
    expect(updated.values['whk_kultur_zwerge']).toBe(3);
    expect(updated.freieSpracheReferenz).toBe('whk_sprache_zwergisch');
    expect(updated.freieKulturReferenz).toBe('whk_kultur_zwerge');
    const sheet = computeSheet(updated);
    expect(sheet.spSpent).toBe(0); // beide sind laut Grant kostenlos
  });

  it('setFreieSpracheUndKultur setzt den vorherigen Grant beim Wechsel zurueck', () => {
    const character = withEpGesamt(0);
    const first = setFreieSpracheUndKultur(character, 'whk_sprache_zwergisch', 'whk_kultur_zwerge');
    const second = setFreieSpracheUndKultur(first, 'whk_sprache_orkisch', 'whk_kultur_orks');
    expect(second.values['whk_sprache_zwergisch']).toBeUndefined();
    expect(second.values['whk_kultur_zwerge']).toBeUndefined();
    expect(second.values['whk_sprache_orkisch']).toBe(3);
    expect(second.values['whk_kultur_orks']).toBe(3);
  });

  it('Steigern ueber die Grant-Stufe hinaus kostet nur die echte Differenz, nicht den vollen Betrag', () => {
    const character = withEpGesamt(0);
    const granted = setFreieSpracheUndKultur(character, 'whk_sprache_zwergisch', 'whk_kultur_zwerge');
    // Akademisches Niveau (Stufe 4) kostet insgesamt 75 SP, Muttersprache (Stufe 3, der Grant) 50 SP
    // -> die tatsaechliche Zusatzkosten fuers Steigern auf Stufe 4 sollten 25 SP sein, nicht 75.
    const raised = setValue(granted, 'whk_sprache_zwergisch', 4);
    const sheet = computeSheet(raised);
    expect(sheet.spSpent).toBe(25);
  });
});
