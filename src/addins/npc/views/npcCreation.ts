import { NPC_TEMPLATES } from '../data/npcTemplates';
import { createNpcPreview, inspectNpc, instantiateNpc } from '../engine/npcCreation';
import { saveCharacter, setLastActiveCharacterId } from '../../../state/characterStore';
import type { AppState } from '../../../state/appState';
import { DEFAULT_NAVIGATION } from '../../../navigation';
import { formatDublonenNumber } from '../../../utils/format';

export interface NpcWizardState {
  step: number;
  role: string;
  templateId: string;
  name: string;
  age: string;
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function renderNpcWizard(wizard: NpcWizardState): string {
  const template = NPC_TEMPLATES.find((entry) => entry.id === wizard.templateId)!;
  const steps = ['Rolle', 'Variante', 'Persönliche Angaben', 'Vorschau'];
  let content = '';
  if (wizard.step === 0) {
    content = `<p>Wähle die Aufgabe des NPCs. Die ersten sechs Vorlagen bilden Goblins ab.</p>
      <label>Rolle <select name="role">${[...new Set(NPC_TEMPLATES.map((entry) => entry.role))]
        .map((role) => `<option ${role === wizard.role ? 'selected' : ''}>${escape(role)}</option>`).join('')}</select></label>`;
  } else if (wizard.step === 1) {
    content = `<label>Ausbildung und Kampfstil <select name="templateId">${NPC_TEMPLATES.filter((entry) => entry.role === wizard.role)
      .map((entry) => `<option value="${entry.id}" ${entry.id === wizard.templateId ? 'selected' : ''}>${escape(entry.label)}</option>`).join('')}</select></label>
      <p>Werte, Stufe, Magie und Ausrüstung gehören zur jeweiligen Vorlage. Du kannst den angelegten NPC anschließend bearbeiten.</p>`;
  } else if (wizard.step === 2) {
    content = `<p>${escape(template.description)} Spezies: ${escape(template.character.spezies)}.</p>
      <label>Name <input name="name" required maxlength="160" value="${escape(wizard.name)}" /></label>
      <label>Alter <input name="age" maxlength="80" value="${escape(wizard.age)}" /></label>`;
  } else {
    const preview = createNpcPreview(wizard.templateId, wizard.name, wizard.age);
    const { sheet, issues } = inspectNpc(preview);
    content = `<h3>${escape(preview.name)}</h3><p>${escape(template.label)} · ${escape(preview.spezies)} · ${escape(preview.herkunftSnapshot?.name ?? 'Herkunft offen')}</p>
      <p>${escape(template.description)}</p>
      <dl class="npc-summary"><dt>Steigerungspunkte</dt><dd>${sheet.spSpent} / ${sheet.spTotal} (${sheet.spRemaining} frei)</dd>
      <dt>Talentpunkte</dt><dd>${sheet.tapSpent} / ${sheet.tapTotal} (${sheet.tapRemaining} frei)</dd>
      <dt>Ausrüstungskosten</dt><dd>${formatDublonenNumber(sheet.dublonenSpent)} D</dd>
      <dt>Restguthaben</dt><dd>${formatDublonenNumber(sheet.dublonenRemaining)} D</dd></dl>
      <details><summary>Ausrüstung (${preview.equipment.length} Einträge)</summary><ul>${preview.equipment.map((entry) =>
        `<li>${entry.quantity} × ${escape(entry.displayNameSnapshot ?? entry.rangedSnapshot?.name ?? entry.baseTable)}</li>`).join('')}</ul>
        <p>Zusätzlich ${Object.keys(preview.ruestungSlots).length} belegte Rüstungsplätze.</p></details>
      <p>Herkunft, Religion, Persönlichkeit und Geld werden aus der Vorlage übernommen. Das Guthaben ist keine allgemeine Vermögensstufe.</p>
      ${preview.bestehenderCharakter ? '<p>Diese Vorlage verwendet den Modus „bestehender Charakter“: Verfügbarkeit-Kaufsperren sind deaktiviert.</p>' : ''}
      ${issues.length ? `<div role="alert"><strong>Bitte nach dem Anlegen prüfen:</strong><ul>${issues.map((issue) => `<li>${escape(issue)}</li>`).join('')}</ul></div>` : '<p>Die vorhandene Charakter- und AT/PA-Poolprüfung meldet keine Verstöße.</p>'}
      <p>Die Vorlage wird als eigenständiger NSC angelegt. Die vollständigen Kampfwerte stehen danach im Charakterbogen und Kampfbereich.</p>`;
  }
  return `<section class="npc-wizard" aria-labelledby="npc-title"><h2 id="npc-title">NPC erstellen</h2>
    <ol class="npc-steps">${steps.map((step, index) => `<li ${index === wizard.step ? 'aria-current="step"' : ''}>${index + 1}. ${step}</li>`).join('')}</ol>
    <form id="npc-wizard-form"><div class="npc-step-content">${content}</div><div class="npc-actions">
      ${wizard.step > 0 ? '<button type="button" id="npc-back">Zurück</button>' : ''}
      <button type="submit">${wizard.step === 3 ? 'Als neuen NPC anlegen' : 'Weiter'}</button>
      <button type="button" id="npc-cancel">Abbrechen</button></div></form></section>`;
}

export function wireNpcWizard(state: AppState, render: () => void): void {
  document.querySelector('#new-npc')?.addEventListener('click', () => {
    const template = NPC_TEMPLATES[0];
    state.npcWizard = { step: 0, role: template.role, templateId: template.id, name: template.label, age: template.character.alter ?? '' };
    state.showNewCharacterForm = state.showSaveForm = state.confirmingDelete = false;
    state.errorMessage = state.statusMessage = '';
    render();
  });
  const readFields = () => {
    const wizard = state.npcWizard;
    const form = document.querySelector<HTMLFormElement>('#npc-wizard-form');
    if (!wizard || !form) return;
    const data = new FormData(form);
    const role = data.get('role')?.toString();
    const templateId = data.get('templateId')?.toString();
    if (role && role !== wizard.role) {
      wizard.role = role;
      wizard.templateId = NPC_TEMPLATES.find((entry) => entry.role === role)!.id;
      wizard.name = '';
    }
    if (templateId && templateId !== wizard.templateId) { wizard.templateId = templateId; wizard.name = ''; }
    const template = NPC_TEMPLATES.find((entry) => entry.id === wizard.templateId)!;
    if (!wizard.name) { wizard.name = template.label; wizard.age = template.character.alter ?? ''; }
    if (data.has('name')) wizard.name = data.get('name')!.toString().trim();
    if (data.has('age')) wizard.age = data.get('age')!.toString().trim();
  };
  document.querySelector('#npc-cancel')?.addEventListener('click', () => { state.npcWizard = null; render(); });
  document.querySelector('#npc-back')?.addEventListener('click', () => {
    readFields();
    if (state.npcWizard) state.npcWizard.step--;
    render();
  });
  document.querySelector('#npc-wizard-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    readFields();
    const wizard = state.npcWizard;
    if (!wizard) return;
    if (wizard.step === 2 && !wizard.name) {
      state.errorMessage = 'Bitte einen Namen eingeben.';
      render();
      return;
    }
    state.errorMessage = '';
    if (wizard.step < 3) wizard.step++;
    else {
      try {
        const character = instantiateNpc(createNpcPreview(wizard.templateId, wizard.name, wizard.age));
        saveCharacter(character);
        state.currentCharacter = character;
        setLastActiveCharacterId(character.id);
        state.navigationState = { ...DEFAULT_NAVIGATION };
        state.npcWizard = null;
        state.statusMessage = 'NPC angelegt. Du kannst ihn jetzt bearbeiten.';
      } catch (error) { state.errorMessage = error instanceof Error ? error.message : String(error); }
    }
    render();
    document.querySelector<HTMLElement>('#npc-wizard-form input, #npc-wizard-form select, #npc-wizard-form button')?.focus();
  });
}
