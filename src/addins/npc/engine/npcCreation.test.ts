import { beforeEach, describe, expect, it } from 'vitest';
import { NPC_TEMPLATES } from '../data/npcTemplates';
import { createNpcPreview, inspectNpc, instantiateNpc } from './npcCreation';
import { listCharacters, loadCharacter, saveCharacter } from '../../../state/characterStore';
import { createInitialAppState } from '../../../state/appState';
import { renderNpcWizard, wireNpcWizard } from '../views/npcCreation';
import { ergaenzeGrundkleidung } from './grundkleidung';
import grundkleidung from '../data/grundkleidung.json';
import { PREISLISTE } from '../../../data/equipment/preisliste';

beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; });

describe('NPC-Vorlagen', () => {
  for (const template of NPC_TEMPLATES) {
    it(`${template.id}: unabhängige Kopie mit gültigen Verknüpfungen`, () => {
      const preview = createNpcPreview(template.id, 'Neuer NPC', '31');
      for (const slot of grundkleidung) {
        expect(preview.equipment.some((entry) => entry.family === 'preisliste' && entry.quantity > 0
          && new RegExp(slot.erkennt).test(PREISLISTE.find((row) => String(row.sourceRow) === entry.baseId)?.name ?? ''))).toBe(true);
      }
      const originalCount = preview.equipment.length;
      ergaenzeGrundkleidung(preview);
      expect(preview.equipment).toHaveLength(originalCount);
      expect(listCharacters()).toEqual([]);
      const character = instantiateNpc(preview);
      expect(character.id).not.toBe(template.character.id);
      expect(character.name).toBe('Neuer NPC');
      expect(character.alter).toBe('31');
      expect(character.charakterTyp).toBe('NSC');
      const ids = new Set(character.equipment.map((entry) => entry.id));
      expect(character.equipment.every((entry) => !template.character.equipment.some((original) => original.id === entry.id))).toBe(true);
      for (const loadout of character.waffenLoadouts) {
        expect(ids.has(loadout.primaryEquipmentId)).toBe(true);
        expect(ids.has(loadout.secondaryEquipmentId)).toBe(true);
      }
      for (const key of Object.keys(character.poolAllocations)) {
        const equipmentId = key.split('::')[1];
        if (equipmentId && !equipmentId.startsWith('unbewaffnet')) expect(ids.has(equipmentId)).toBe(true);
      }
      const { sheet, issues } = inspectNpc(character);
      expect(issues).toEqual([]);
      expect(sheet.spRemaining).toBeGreaterThanOrEqual(0);
      expect(sheet.tapRemaining).toBeGreaterThanOrEqual(0);
      expect(sheet.dublonenRemaining).toBeGreaterThanOrEqual(0);
      saveCharacter(character);
      expect(loadCharacter(character.id)?.name).toBe('Neuer NPC');
      expect(listCharacters()).toHaveLength(1);
      expect(template.character.name).not.toBe('Neuer NPC');
    });
  }

  it('behält die vollständige Bauernkleidung und berechnet neue Kleidung regulär', () => {
    const bauer = NPC_TEMPLATES.find((entry) => entry.id === 'bauer')!;
    expect(createNpcPreview('bauer', '', '').equipment).toEqual(bauer.character.equipment);
    const wache = NPC_TEMPLATES.find((entry) => entry.id === 'wachmann')!;
    const original = JSON.stringify(wache.character);
    const vorher = inspectNpc(wache.character).sheet;
    const nachher = inspectNpc(createNpcPreview('wachmann', '', '')).sheet;
    const preis = grundkleidung.reduce((sum, slot) => sum + PREISLISTE.find((row) => row.sourceRow === slot.sourceRow)!.preisDublonen!, 0);
    expect(nachher.dublonenSpent - vorher.dublonenSpent).toBeCloseTo(preis);
    expect(nachher.dublonenTotal - vorher.dublonenTotal).toBeCloseTo(Math.ceil(preis * 100) / 100);
    expect(nachher.dublonenRemaining - vorher.dublonenRemaining).toBeLessThan(0.011);
    expect(JSON.stringify(wache.character)).toBe(original);
  });

  it('rechnet ein vorhandenes Kleid als Ober- und Beinkleidung an', () => {
    const character = JSON.parse(JSON.stringify(NPC_TEMPLATES.find((entry) => entry.id === 'wachmann')!.character));
    character.equipment.push({ id: 'kleid', family: 'preisliste', baseTable: 'preisliste', baseId: '809', selections: {}, quantity: 1 });
    ergaenzeGrundkleidung(character);
    expect(character.equipment.some((entry: { baseId: string }) => entry.baseId === '796' || entry.baseId === '784')).toBe(false);
    expect(character.equipment.some((entry: { baseId: string }) => entry.baseId === '553')).toBe(true);
  });

  it('führt durch Auswahl, Zurück und Anlegen; Abbrechen speichert nichts', () => {
    const state = createInitialAppState(null);
    const render = () => {
      document.body.innerHTML = `<button id="new-npc">NPC erstellen</button>${state.npcWizard ? renderNpcWizard(state.npcWizard) : ''}`;
      wireNpcWizard(state, render);
    };
    const click = (id: string) => document.querySelector<HTMLButtonElement>(id)!.click();
    const next = () => document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    render();
    click('#new-npc');
    click('#npc-cancel');
    expect(listCharacters()).toHaveLength(0);
    click('#new-npc');
    document.querySelector<HTMLSelectElement>('[name="role"]')!.value = 'Räuber';
    next();
    document.querySelector<HTMLSelectElement>('[name="templateId"]')!.value = 'hauptmann';
    next();
    document.querySelector<HTMLInputElement>('[name="name"]')!.value = 'Testhauptmann';
    next();
    expect(document.body.textContent).toContain('Testhauptmann');
    expect(listCharacters()).toHaveLength(0);
    click('#npc-back');
    expect(document.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe('Testhauptmann');
    next();
    next();
    expect(state.npcWizard).toBeNull();
    expect(state.currentCharacter?.name).toBe('Testhauptmann');
    expect(listCharacters()).toHaveLength(1);
  });
});
