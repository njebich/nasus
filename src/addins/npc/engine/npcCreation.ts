import { NPC_TEMPLATES } from '../data/npcTemplates';
import type { CharacterState } from '../../../state/characterStore';
import { computeSheet } from '../../../engine/characterSheet';
import { buildNahkampfRows } from '../../../views/kampf';
import { ergaenzeGrundkleidung } from './grundkleidung';

export function createNpcPreview(templateId: string, name: string, age: string): CharacterState {
  const template = NPC_TEMPLATES.find((entry) => entry.id === templateId);
  if (!template) throw new Error('Bitte eine vorhandene NPC-Vorlage wählen.');
  const character: CharacterState = JSON.parse(JSON.stringify(template.character));
  character.name = name.trim() || template.label;
  character.alter = age.trim();
  character.charakterTyp = 'NSC';
  const clothingCost = ergaenzeGrundkleidung(character);
  if (clothingCost > 0) {
    // Die Referenzen haben ein vorläufiges Anschaffungsbudget, kein festes NSC-Geldbudget.
    character.values['dublonen_bank'] = (character.values['dublonen_bank'] ?? 0) + Math.ceil(clothingCost * 100) / 100;
    character.notes += '\nGrundkleidung ergänzt; vorläufiges Anschaffungsbudget um ihre Katalogkosten (auf Cent aufgerundet) erweitert.';
  }
  return character;
}

/** Erst beim Anlegen neue Identitäten vergeben; eine Vorschau schreibt nichts in den Speicher. */
export function instantiateNpc(preview: CharacterState): CharacterState {
  const character: CharacterState = JSON.parse(JSON.stringify(preview));
  character.id = crypto.randomUUID();
  character.createdAt = character.updatedAt = new Date().toISOString();
  const equipmentIds = new Map(character.equipment.map((entry) => [entry.id, crypto.randomUUID()]));
  character.equipment.forEach((entry) => { entry.id = equipmentIds.get(entry.id)!; });
  character.waffenLoadouts.forEach((entry) => {
    entry.id = crypto.randomUUID();
    entry.primaryEquipmentId = equipmentIds.get(entry.primaryEquipmentId) ?? entry.primaryEquipmentId;
    entry.secondaryEquipmentId = equipmentIds.get(entry.secondaryEquipmentId) ?? entry.secondaryEquipmentId;
  });
  character.poolAllocations = Object.fromEntries(Object.entries(character.poolAllocations).map(([key, value]) => {
    const [reference, equipmentId] = key.split('::');
    return [equipmentId && equipmentIds.has(equipmentId) ? `${reference}::${equipmentIds.get(equipmentId)}` : key, value];
  }));
  return character;
}

export function inspectNpc(character: CharacterState) {
  const sheet = computeSheet(character);
  const combat = buildNahkampfRows(character, sheet);
  const issues = [...sheet.validationIssues.map((issue) => `${issue.source}: ${issue.message}`),
    ...combat.filter((row) => !row.poolValid).map((row) => `${row.label}: AT/PA-Pool unausgeglichen.`)];
  return { sheet, issues };
}
