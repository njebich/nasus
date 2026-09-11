import bauer from './npc/bauer.json';
import wachmann from './npc/wachmann.json';
import hauptmann from './npc/hauptmann.json';
import schuetze from './npc/schuetze.json';
import nahkaempfer from './npc/nahkaempfer.json';
import ki from './npc/ki.json';
import type { CharacterState } from '../../../state/characterStore';

export interface NpcTemplate {
  id: string;
  role: string;
  label: string;
  description: string;
  character: CharacterState;
  armorProfile: 'beruf' | 'fernkampf' | 'nahkampf';
}

// Referenzen vom 11. September 2026: Spezialisierungsgrenzen und Budgets korrigiert; keine Speicherhistorie.
export const NPC_TEMPLATES: readonly NpcTemplate[] = [
  { id: 'bauer', armorProfile: 'beruf', role: 'Zivilist', label: 'Bauer · Stufe 0', description: 'Landwirtschaft mit Kampfstab und Muskete.', character: bauer },
  { id: 'wachmann', armorProfile: 'nahkampf', role: 'Wache', label: 'Wachmann · Stufe 0', description: 'Wachdienst mit Stab und Speer.', character: wachmann },
  { id: 'schuetze', armorProfile: 'fernkampf', role: 'Räuber', label: 'Schütze · Stufe 0', description: 'Räuber mit Schwerpunkt Fernkampf.', character: schuetze },
  { id: 'nahkaempfer', armorProfile: 'nahkampf', role: 'Räuber', label: 'Nahkämpfer · Stufe 0', description: 'Räuber mit Schwerpunkt Nahkampf.', character: nahkaempfer },
  { id: 'hauptmann', armorProfile: 'nahkampf', role: 'Räuber', label: 'Hauptmann · Stufe 15', description: 'Führung und Kampf mit Entermesser und Schild.', character: hauptmann },
  { id: 'ki', armorProfile: 'nahkampf', role: 'Magischer Kämpfer', label: 'KI-Spezialist · Stufe 15', description: 'Gerüsteter Schadensspezialist mit KI und Artefaktausrüstung.', character: ki },
] as unknown as readonly NpcTemplate[];

/** Explizite Ausbildungsprofile: gleiche Berufsrolle kann verschiedene Kampfstile enthalten. */
export function getNpcRoleArmor(templateId: string) {
  const template = NPC_TEMPLATES.find((entry) => entry.id === templateId);
  if (!template) throw new Error('Bitte eine vorhandene NPC-Vorlage wählen.');
  if (templateId === 'wachmann') return { packageId: 'wache-zeughaus', reason: 'Einfache Wache: Stoff und Leder überall, Kette an Armen/Torso und Eisenbrustplatte, alles von der Stange. Bis zu 3 KBE aus Rüstung sind akzeptabel; keine MBE.' };
  const profiles = {
    beruf: { packageId: 'handwerker', reason: 'Körperlicher Beruf: Stoff und Leder an Kopf, Torso, Armen und Beinen.' },
    fernkampf: { packageId: 'handwerker', reason: 'Fernkampfprofession: Stoff und Leder an allen vier Zonengruppen; zusätzlicher Kopfpanzer bleibt optional.' },
    nahkampf: { packageId: 'nahkaempfer-lederpanzer', reason: 'Nahkampfschwerpunkt: Stoff und Leder überall, Kette an Armen und Torso sowie Panzer am Torso.' },
  };
  return profiles[template.armorProfile];
}
