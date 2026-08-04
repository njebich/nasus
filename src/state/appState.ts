import type { CharacterState } from './characterStore';
import { DEFAULT_NAVIGATION, type NavigationState } from '../navigation';

/** Gebündelter Top-Level-UI-Zustand von main.ts (vorher lose Modul-`let`s). */
export interface AppState {
  currentCharacter: CharacterState | null;
  errorMessage: string;
  navigationState: NavigationState;
  showNewCharacterForm: boolean;
  /** "Bestehenden Charakter erstellen" (Nutzer 2026-07-24): zweite Auswahl neben "Neuer Charakter"
   *  im selben Formular - einziger Unterschied ist das bestehenderCharakter-Flag auf dem erzeugten
   *  Charakter, das alle Verfuegbarkeit-Kaufsperren deaktiviert (siehe characterMutations.ts). */
  newCharacterBestehend: boolean;
  confirmingDelete: boolean;
}

export function createInitialAppState(currentCharacter: CharacterState | null): AppState {
  return {
    currentCharacter,
    errorMessage: '',
    navigationState: { ...DEFAULT_NAVIGATION },
    showNewCharacterForm: false,
    newCharacterBestehend: false,
    confirmingDelete: false,
  };
}
