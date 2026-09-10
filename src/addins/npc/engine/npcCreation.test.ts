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
      expect(issues).toEqual(template.id === 'wachmann'
        ? ['Rüstung: 1 BE statt 0. Bei dieser Ausstattung ist mindestens Rüstungsmanöver 16 nötig.']
        : template.id === 'hauptmann'
          ? ['Rüstung: 1 BE statt 0. Bei dieser Ausstattung ist mindestens Rüstungsmanöver 8 nötig.'] : []);
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
    document.querySelector<HTMLSelectElement>('[name="templateId"]')!.value = 'nahkaempfer';
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

  it('verhindert Anlegen trotz programmgesteuertem Absenden bei positiver RBE oder Budgetlücke', () => {
    const state = createInitialAppState(null);
    state.npcWizard = { step: 3, role: 'Wache', templateId: 'wachmann', name: 'Wache', age: '' };
    const render = () => {
      document.body.innerHTML = renderNpcWizard(state.npcWizard!);
      wireNpcWizard(state, render);
    };
    render();
    expect(document.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true);
    document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(listCharacters()).toHaveLength(0);
    expect(state.errorMessage).toContain('1 BE statt 0');
    state.npcWizard = { step: 3, role: 'Zivilist', templateId: 'bauer', name: 'Bauer', age: '', armorPackageId: 'handwerker' };
    render();
    document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(listCharacters()).toHaveLength(0);
    expect(state.errorMessage).toContain('SP-Budget');
  });

  it('rechnet Anpassung je Teil neu und behält sie nach Zurück sowie beim Speichern', () => {
    const state = createInitialAppState(null);
    state.npcWizard = { step: 3, role: 'Räuber', templateId: 'nahkaempfer', name: 'Gerüstet', age: '', armorPackageId: 'nahkaempfer-lederpanzer', automaticArmor: false };
    const render = () => {
      document.body.innerHTML = state.npcWizard ? renderNpcWizard(state.npcWizard) : '';
      wireNpcWizard(state, render);
    };
    render();
    const adaptation = document.getElementsByName('armor-anpassung:torso:2')[0] as HTMLSelectElement;
    adaptation.value = '3'; // von der Stange: +1 RH, -12 D; die vorhandenen RM 14 reichen weiterhin.
    adaptation.dispatchEvent(new Event('change'));
    expect(state.npcWizard.armorOverrides?.['torso:2'].anpassungSourceRow).toBe(3);
    expect(document.querySelector<HTMLDetailsElement>('.npc-armor-choices')!.open).toBe(true);
    document.querySelector<HTMLButtonElement>('#npc-back')!.click();
    document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect((document.getElementsByName('armor-anpassung:torso:2')[0] as HTMLSelectElement).value).toBe('3');
    document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(state.npcWizard).toBeNull();
    expect(listCharacters()).toHaveLength(1);
    expect(state.currentCharacter!.ruestungSlots['torso:2'].computedStatsSnapshot.rh).toBe(3);
    expect(inspectNpc(state.currentCharacter!).armor.rbe).toBe(0);
  });

  it('optimiert automatisch vor der Vorschau und speichert genau diese Auswahl', () => {
    const state = createInitialAppState(null);
    state.npcWizard = { step: 2, role: 'Räuber', templateId: 'nahkaempfer', name: 'Automatisch', age: '', armorPackageId: 'nahkaempfer-lederpanzer' };
    const render = () => {
      document.body.innerHTML = state.npcWizard ? renderNpcWizard(state.npcWizard) : '';
      wireNpcWizard(state, render);
    };
    render();
    expect(document.querySelector<HTMLInputElement>('[name="automaticArmor"]')!.checked).toBe(true);
    expect(document.querySelector<HTMLSelectElement>('[name="armorPackageId"]')!.value).toBe('nahkaempfer-lederpanzer');
    document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(document.body.textContent).toContain('Automatische Auswahl:');
    const wizard = state.npcWizard!;
    expect(Object.keys(wizard.armorOverrides ?? {})).toHaveLength(11);
    const chosen = createNpcPreview(wizard.templateId, wizard.name, wizard.age, wizard.armorPackageId, wizard.kopfschutz, wizard.armorOverrides);
    expect(Object.values(chosen.ruestungSlots).some((slot) => slot.verarbeitungSourceRow > 2)).toBe(true);
    document.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(state.npcWizard).toBeNull();
    expect(state.currentCharacter!.ruestungSlots).toEqual(chosen.ruestungSlots);
    expect(inspectNpc(state.currentCharacter!).issues).toEqual([]);
  });
});
