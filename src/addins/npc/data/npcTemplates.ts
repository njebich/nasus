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
}

// Referenzstände vom 7. September 2026; ausschließlich Charakterdaten, keine Speicherhistorie.
export const NPC_TEMPLATES: readonly NpcTemplate[] = [
  { id: 'bauer', role: 'Zivilist', label: 'Bauer · Stufe 0', description: 'Landwirtschaft mit Kampfstab und Muskete.', character: bauer },
  { id: 'wachmann', role: 'Wache', label: 'Wachmann · Stufe 0', description: 'Wachdienst mit Stab und Speer.', character: wachmann },
  { id: 'schuetze', role: 'Räuber', label: 'Schütze · Stufe 0', description: 'Räuber mit Schwerpunkt Fernkampf.', character: schuetze },
  { id: 'nahkaempfer', role: 'Räuber', label: 'Nahkämpfer · Stufe 0', description: 'Räuber mit Schwerpunkt Nahkampf.', character: nahkaempfer },
  { id: 'hauptmann', role: 'Räuber', label: 'Hauptmann · Stufe 15', description: 'Führung und Kampf mit Entermesser und Schild.', character: hauptmann },
  { id: 'ki', role: 'Magischer Kämpfer', label: 'KI-Spezialist · Stufe 15', description: 'Gerüsteter Schadensspezialist mit KI und Artefaktausrüstung.', character: ki },
] as unknown as readonly NpcTemplate[];
