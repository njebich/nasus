import type { CharacterState } from './characterStore';
import { DEFAULT_NAVIGATION, type NavigationState } from '../navigation';
import type { NpcWizardState } from '../addins/npc';

/** Gebündelter Top-Level-UI-Zustand von main.ts (vorher lose Modul-`let`s). */
export interface AppState {
  npcWizard: NpcWizardState | null;
  currentCharacter: CharacterState | null;
  errorMessage: string;
  navigationState: NavigationState;
  showNewCharacterForm: boolean;
  /** "Bestehenden Charakter erstellen" (Nutzer 2026-07-24): zweite Auswahl neben "Neuer Charakter"
   *  im selben Formular - einziger Unterschied ist das bestehenderCharakter-Flag auf dem erzeugten
   *  Charakter, das alle Verfuegbarkeit-Kaufsperren deaktiviert (siehe characterMutations.ts). */
  newCharacterBestehend: boolean;
  confirmingDelete: boolean;
  showSaveForm: boolean;
  statusMessage: string;
}

export function createInitialAppState(currentCharacter: CharacterState | null): AppState {
  return {
    npcWizard: null,
    currentCharacter,
    errorMessage: '',
    navigationState: { ...DEFAULT_NAVIGATION },
    showNewCharacterForm: false,
    newCharacterBestehend: false,
    confirmingDelete: false,
    showSaveForm: false,
    statusMessage: '',
  };
}
