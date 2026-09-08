import { beforeEach, describe, expect, it } from 'vitest';
import { NPC_TEMPLATES } from '../data/npcTemplates';
import { createNpcPreview, inspectNpc, instantiateNpc } from './npcCreation';
import { listCharacters, loadCharacter, saveCharacter } from '../../../state/characterStore';
import { createInitialAppState } from '../../../state/appState';
import { renderNpcWizard, wireNpcWizard } from '../views/npcCreation';

beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; });

describe('NPC-Vorlagen', () => {
  for (const template of NPC_TEMPLATES) {
    it(`${template.id}: unabhängige Kopie mit gültigen Verknüpfungen`, () => {
      const preview = createNpcPreview(template.id, 'Neuer NPC', '31');
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
