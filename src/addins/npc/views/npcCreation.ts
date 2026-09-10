import { NPC_TEMPLATES } from '../data/npcTemplates';
import { createNpcPreview, inspectNpc, instantiateNpc } from '../engine/npcCreation';
import { saveCharacter, setLastActiveCharacterId } from '../../../state/characterStore';
import type { AppState } from '../../../state/appState';
import { DEFAULT_NAVIGATION } from '../../../navigation';
import { formatDublonenNumber } from '../../../utils/format';
import { NPC_ARMOR_PACKAGES, type NpcArmorOverrides } from '../engine/ruestungspakete';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../../../data/equipment/armor';
import { composeArmor } from '../../../engine/armorComposition';
import type { CharacterState } from '../../../state/characterStore';
import { optimizeNpcArmor, type ArmorOptimizationMode } from '../engine/armorOptimization';

export interface NpcWizardState {
  step: number;
  role: string;
  templateId: string;
  name: string;
  age: string;
  armorPackageId?: string;
  kopfschutz?: boolean;
  armorOverrides?: NpcArmorOverrides;
  automaticArmor?: boolean;
  armorOptimizationMode?: ArmorOptimizationMode;
  armorOptimizationMessage?: string;
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function renderArmorChoices(character: CharacterState): string {
  const zoneNames: Record<string, string> = { kopf: 'Kopf', torso: 'Torso', arme: 'Arme', beine: 'Beine' };
  return `<details class="npc-armor-choices"><summary>Fertigung und Anpassung je Rüstungsteil vergleichen</summary>
    <p>Die Auswahl zeigt Schutz (RS), Hinderlichkeit (RH) und den vollständigen Teilpreis. Jede Änderung berechnet Ausbildung, Behinderung und alle Budgets neu. Bereits vorhandene Rüstungsmanöver bleiben erhalten.</p>
    ${Object.entries(character.ruestungSlots).map(([key, slot]) => {
      const basis = RUESTUNG_BASIS.find((row) => row.sourceRow === slot.basisSourceRow)!;
      const verarbeitung = RUESTUNG_VERARBEITUNG.find((row) => row.sourceRow === slot.verarbeitungSourceRow)!;
      const anpassung = RUESTUNG_ANPASSUNG.find((row) => row.sourceRow === slot.anpassungSourceRow)!;
      const caption = `${zoneNames[key.split(':')[0]]} · Lage ${key.split(':')[1]} · ${basis.name}`;
      const label = (stats: ReturnType<typeof composeArmor>) => `RS ${stats.rs} / RH ${stats.rh} · ${formatDublonenNumber(stats.preis)} D`;
      return `<fieldset><legend>${escape(caption)}</legend>
        <label>Fertigung<select name="armor-verarbeitung:${key}" data-npc-armor>${RUESTUNG_VERARBEITUNG.map((row) =>
          `<option value="${row.sourceRow}" ${row.sourceRow === slot.verarbeitungSourceRow ? 'selected' : ''}>${escape(row.name)} – ${label(composeArmor(basis, row, anpassung))}</option>`).join('')}</select></label>
        <label>Anpassung<select name="armor-anpassung:${key}" data-npc-armor>${RUESTUNG_ANPASSUNG.map((row) =>
          `<option value="${row.sourceRow}" ${row.sourceRow === slot.anpassungSourceRow ? 'selected' : ''}>${escape(row.name)} – ${label(composeArmor(basis, verarbeitung, row))}</option>`).join('')}</select></label>
      </fieldset>`;
    }).join('')}</details>`;
}

export function renderNpcWizard(wizard: NpcWizardState): string {
  const template = NPC_TEMPLATES.find((entry) => entry.id === wizard.templateId)!;
  const steps = ['Rolle', 'Variante', 'Angaben und Rüstung', 'Vorschau'];
  let content = '';
  let blocked = false;
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
      <label>Alter <input name="age" maxlength="80" value="${escape(wizard.age)}" /></label>
      <label>Rüstung <select name="armorPackageId"><option value="" ${!wizard.armorPackageId ? 'selected' : ''}>Rüstungsteile der Vorlage verwenden</option>${NPC_ARMOR_PACKAGES.map((paket) =>
        `<option value="${escape(paket.id)}" ${paket.id === wizard.armorPackageId ? 'selected' : ''}>${escape(paket.name)}</option>`).join('')}</select></label>
      <label class="npc-checkbox"><input type="checkbox" name="kopfschutz" ${wizard.kopfschutz ? 'checked' : ''} ${wizard.armorPackageId ? '' : 'disabled'} />Zusätzlicher Lederpanzer am Kopf (148 D; nur mit Rüstungspaket)</label>
      <label class="npc-checkbox"><input type="checkbox" name="automaticArmor" ${wizard.automaticArmor !== false ? 'checked' : ''} />Fertigung und Anpassung automatisch auswählen</label>
      <label>Schwerpunkt<select name="armorOptimizationMode"><option value="schutz" ${wizard.armorOptimizationMode !== 'sparsam' ? 'selected' : ''}>Mehr Schutz innerhalb des Budgets</option><option value="sparsam" ${wizard.armorOptimizationMode === 'sparsam' ? 'selected' : ''}>Möglichst günstig bei mindestens gleichem Schutz</option></select></label>
      <p>Ein Paket ersetzt die gesamte Vorlagenrüstung. Stoff und Leder bedecken alle vier Zonengruppen. Die Vorschau plant nötige Rüstungsmanöver für 0 BE ein und prüft, ob Punkte, Talente und Geld reichen.</p>`;
  } else {
    const preview = createNpcPreview(wizard.templateId, wizard.name, wizard.age, wizard.armorPackageId, wizard.kopfschutz, wizard.armorOverrides);
    const { sheet, issues, armor } = inspectNpc(preview);
    blocked = issues.length > 0;
    const previousRm = template.character.values.sf_ruestungsmanoever ?? 0;
    content = `<h3>${escape(preview.name)}</h3><p>${escape(template.label)} · ${escape(preview.spezies)} · ${escape(preview.herkunftSnapshot?.name ?? 'Herkunft offen')}</p>
      <p>${escape(template.description)}</p>
      <dl class="npc-summary"><dt>Steigerungspunkte</dt><dd>${sheet.spSpent} / ${sheet.spTotal} (${sheet.spRemaining} frei)</dd>
      <dt>Talentpunkte</dt><dd>${sheet.tapSpent} / ${sheet.tapTotal} (${sheet.tapRemaining} frei)</dd>
      <dt>Ausrüstungskosten</dt><dd>${formatDublonenNumber(sheet.dublonenSpent)} D</dd>
      <dt>Restguthaben</dt><dd>${formatDublonenNumber(sheet.dublonenRemaining)} D</dd>
      <dt>BE aus Rüstung · Ziel 0</dt><dd>${armor.be}${armor.rbe > 0 ? ` (ungerundet ${armor.rbe.toLocaleString('de-DE', { maximumFractionDigits: 6 })})` : ''}</dd>
      <dt>Rüstungsmanöver</dt><dd>${armor.rm} · mindestens ${armor.minimumRm} nötig · Maximum ${armor.maximumRm}</dd>
      <dt>Rüstungskosten</dt><dd>${formatDublonenNumber(armor.preis)} D</dd></dl>
      ${wizard.armorPackageId ? `<p>${escape(NPC_ARMOR_PACKAGES.find((entry) => entry.id === wizard.armorPackageId)!.name)}${wizard.kopfschutz ? ' mit zusätzlichem Kopfschutz' : ''}. Rüstungsmanöver: ${previousRm} → ${armor.rm}. Die Steigerung ist in den SP-Ausgaben enthalten.</p>` : ''}
      <div class="npc-table-scroll"><table class="npc-armor-table"><caption>Rüstungsschutz nach Zonengruppen</caption><thead><tr><th scope="col">Zone</th><th scope="col">Lagen</th><th scope="col">RS</th></tr></thead><tbody>${armor.zonen.map((entry) =>
        `<tr><th scope="row">${({ kopf: 'Kopf', torso: 'Torso', arme: 'Arme', beine: 'Beine' })[entry.zone]}</th><td>${entry.lagen.join(', ') || 'Keine'}</td><td>${entry.rs}</td></tr>`).join('')}</tbody></table></div>
      <p>Einzelne Trefferzonen haben nach den bestehenden Regeln halben Schutz; Augen sind durch Rüstung nicht geschützt.</p>
      <p>Die Automatik behält Teile, Zonen und mindestens den Schutz je Teil bei. Sie verteilt Fertigung und Anpassung passend zum vorhandenen Geld und zur bezahlbaren Ausbildung; neue Talente kauft sie nicht.</p>
      <button type="button" id="npc-optimize-armor">Fertigung und Anpassung automatisch optimieren</button>
      ${wizard.armorOptimizationMessage ? `<p role="status">${escape(wizard.armorOptimizationMessage)}</p>` : ''}
      ${renderArmorChoices(preview)}
      <details><summary>Ausrüstung (${preview.equipment.length} Einträge)</summary><ul>${preview.equipment.map((entry) =>
        `<li>${entry.quantity} × ${escape(entry.displayNameSnapshot ?? entry.rangedSnapshot?.name ?? entry.baseTable)}</li>`).join('')}</ul>
        <p>Zusätzlich ${Object.keys(preview.ruestungSlots).length} belegte Rüstungsplätze.</p></details>
      <p>Herkunft, Religion, Persönlichkeit und Geld werden aus der Vorlage übernommen. Das Guthaben ist keine allgemeine Vermögensstufe.</p>
      ${preview.bestehenderCharakter ? '<p>Diese Vorlage verwendet den Modus „bestehender Charakter“: Verfügbarkeit-Kaufsperren sind deaktiviert.</p>' : ''}
      ${issues.length ? `<div role="alert"><strong>Diese Auswahl kann noch nicht angelegt werden.</strong><ul>${issues.map((issue) => `<li>${escape(issue)}</li>`).join('')}</ul><p>Gehe zurück und wähle eine passende Rüstung. Punkte und Geld werden nicht automatisch erhöht.</p></div>` : '<p>0 BE aus Rüstung erreicht. Die vorhandene Charakter- und AT/PA-Poolprüfung meldet keine Verstöße.</p>'}
      <p>Die Vorlage wird als eigenständiger NSC angelegt. Die vollständigen Kampfwerte stehen danach im Charakterbogen und Kampfbereich.</p>`;
  }
  return `<section class="npc-wizard" aria-labelledby="npc-title"><h2 id="npc-title">NPC erstellen</h2>
    <ol class="npc-steps">${steps.map((step, index) => `<li ${index === wizard.step ? 'aria-current="step"' : ''}>${index + 1}. ${step}</li>`).join('')}</ol>
    <form id="npc-wizard-form"><div class="npc-step-content">${content}</div><div class="npc-actions">
      ${wizard.step > 0 ? '<button type="button" id="npc-back">Zurück</button>' : ''}
      <button type="submit" ${blocked ? 'disabled' : ''}>${wizard.step === 3 ? 'Als neuen NPC anlegen' : 'Weiter'}</button>
      <button type="button" id="npc-cancel">Abbrechen</button></div></form></section>`;
}

export function wireNpcWizard(state: AppState, render: () => void): void {
  // Beim Neuaufbau des Formulars den aktuellen Auswahlzustand explizit wiederherstellen.
  document.querySelectorAll<HTMLSelectElement>('#npc-wizard-form select').forEach((select) => {
    const selected = select.querySelector<HTMLOptionElement>('option[selected]');
    if (selected) select.value = selected.value;
  });
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
      wizard.armorOverrides = {};
      wizard.armorOptimizationMessage = undefined;
    }
    if (templateId && templateId !== wizard.templateId) { wizard.templateId = templateId; wizard.name = ''; wizard.armorOverrides = {}; wizard.armorOptimizationMessage = undefined; }
    const template = NPC_TEMPLATES.find((entry) => entry.id === wizard.templateId)!;
    if (!wizard.name) { wizard.name = template.label; wizard.age = template.character.alter ?? ''; }
    if (data.has('name')) wizard.name = data.get('name')!.toString().trim();
    if (data.has('age')) wizard.age = data.get('age')!.toString().trim();
    if (data.has('armorPackageId')) {
      if ((wizard.armorPackageId ?? '') !== data.get('armorPackageId')!.toString() || !!wizard.kopfschutz !== data.has('kopfschutz')) {
        wizard.armorOverrides = {};
        wizard.armorOptimizationMessage = undefined;
      }
      wizard.armorPackageId = data.get('armorPackageId')!.toString();
      wizard.kopfschutz = !!wizard.armorPackageId && data.has('kopfschutz');
      wizard.automaticArmor = data.has('automaticArmor');
      wizard.armorOptimizationMode = data.get('armorOptimizationMode') === 'sparsam' ? 'sparsam' : 'schutz';
    }
    // Nur echte Änderungen übernehmen; bloßes Absenden der Vorlagenrüstung plant keine Steigerung.
    const preview = wizard.step === 3 ? createNpcPreview(wizard.templateId, wizard.name, wizard.age, wizard.armorPackageId, wizard.kopfschutz, wizard.armorOverrides) : null;
    if (preview) for (const [key, slot] of Object.entries(preview.ruestungSlots)) {
      const verarbeitung = data.get(`armor-verarbeitung:${key}`);
      const anpassung = data.get(`armor-anpassung:${key}`);
      if (verarbeitung !== null && anpassung !== null && (Number(verarbeitung) !== slot.verarbeitungSourceRow || Number(anpassung) !== slot.anpassungSourceRow)) {
        wizard.armorOverrides ??= {};
        wizard.armorOverrides[key] = { verarbeitungSourceRow: Number(verarbeitung), anpassungSourceRow: Number(anpassung) };
        wizard.armorOptimizationMessage = undefined;
      }
    }
  };
  const optimizeArmor = () => {
    const wizard = state.npcWizard;
    if (!wizard) return;
    const preview = createNpcPreview(wizard.templateId, wizard.name, wizard.age, wizard.armorPackageId, wizard.kopfschutz, wizard.armorOverrides);
    const template = NPC_TEMPLATES.find((entry) => entry.id === wizard.templateId)!;
    const result = optimizeNpcArmor(preview, template.character.values.sf_ruestungsmanoever ?? 0, wizard.armorOptimizationMode);
    wizard.armorOptimizationMessage = result.message;
    if (result.ok) wizard.armorOverrides = result.overrides;
  };
  document.querySelector('#npc-optimize-armor')?.addEventListener('click', () => {
    readFields();
    optimizeArmor();
    render();
    document.querySelector<HTMLElement>('#npc-optimize-armor')?.focus();
  });
  document.querySelectorAll<HTMLSelectElement>('[data-npc-armor]').forEach((select) => select.addEventListener('change', () => {
    const name = select.name;
    readFields();
    render();
    document.querySelector<HTMLDetailsElement>('.npc-armor-choices')?.setAttribute('open', '');
    document.getElementsByName(name)[0]?.focus();
  }));
  document.querySelector('[name="armorPackageId"]')?.addEventListener('change', () => {
    readFields();
    render();
    document.querySelector<HTMLElement>('[name="armorPackageId"]')?.focus();
  });
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
    if (wizard.step < 3) {
      if (wizard.step === 2 && wizard.automaticArmor !== false) optimizeArmor();
      wizard.step++;
    }
    else {
      try {
        const preview = createNpcPreview(wizard.templateId, wizard.name, wizard.age, wizard.armorPackageId, wizard.kopfschutz, wizard.armorOverrides);
        const { issues } = inspectNpc(preview);
        if (issues.length) throw new Error(`NPC kann noch nicht angelegt werden: ${issues.join(' ')}`);
        const character = instantiateNpc(preview);
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
