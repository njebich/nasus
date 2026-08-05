import {
  setValue, addSelection, removeSelection, setPoolAllocation, setWaffenPoolAllocation, updateHeader,
  buyPreislisteItem, buyArtefakt, equipRuestung, unequipRuestung, buyShield, buyWeapon,
  buyFernkampfwaffe, buyFeuerwaffe, buyMunition, buyFeuerwaffenMunition, buyAlchemika, removeEquipment,
  setGrundfertigkeitPick, addWaffenLoadout, removeWaffenLoadout, toggleWaffenLoadoutFavorite,
  addCustomWhkHauptfertigkeit, renameCustomWhkHauptfertigkeit, setCustomWhkHauptfertigkeitWert,
  addCustomWhkSpezialisierung, renameCustomWhkSpezialisierung, setCustomWhkSpezialisierungWert,
  setGesinnung, setGesinnungNotiz,
  BudgetError, MutationError,
} from './characterMutations';
import { saveCharacter, ruestungSlotKey, type CharacterHeader, type PoolAllocation, type WaffenLoadoutComboType } from './characterStore';
import type { WhkCustomAction } from '../views/categoryView';
import type { RuestungGruppenSelection } from '../views/ausruestung';
import type { ArtefaktVariant } from '../engine/equipmentPricing';
import type { RsGruppe } from '../data/trefferzonen';
import type { FeuerwaffenSelections } from '../engine/feuerwaffenComposition';
import type { FeuerwaffenMunitionArt } from '../data/equipment/feuerwaffenMunition';
import type { AppState } from './appState';

const RUESTUNG_GRUPPEN_REIHENFOLGE: readonly RsGruppe[] = ['kopf', 'torso', 'arme', 'beine'];

/** Alle Mutations-Handler von main.ts, gebündelt hinter einer Factory: schließt über `appState`
 *  (in-place mutiert, wie vorher die losen `let`s) und `render` statt globaler Modul-Variablen. */
export function createMutationHandlers(appState: AppState, render: () => void) {
  function handleValueChange(referenz: string, newValue: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = setValue(appState.currentCharacter, referenz, newValue);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleWhkCustomChange(action: WhkCustomAction): void {
    if (!appState.currentCharacter) return;
    try {
      switch (action.type) {
        case 'add-hauptfertigkeit':
          appState.currentCharacter = addCustomWhkHauptfertigkeit(appState.currentCharacter, action.name);
          break;
        case 'rename-hauptfertigkeit':
          appState.currentCharacter = renameCustomWhkHauptfertigkeit(appState.currentCharacter, action.id, action.name);
          break;
        case 'set-hauptfertigkeit-wert':
          appState.currentCharacter = setCustomWhkHauptfertigkeitWert(appState.currentCharacter, action.id, action.wert);
          break;
        case 'add-spezialisierung':
          appState.currentCharacter = addCustomWhkSpezialisierung(appState.currentCharacter, action.hauptfertigkeitKey, action.name);
          break;
        case 'rename-spezialisierung':
          appState.currentCharacter = renameCustomWhkSpezialisierung(appState.currentCharacter, action.hauptfertigkeitKey, action.id, action.name);
          break;
        case 'set-spezialisierung-wert':
          appState.currentCharacter = setCustomWhkSpezialisierungWert(appState.currentCharacter, action.hauptfertigkeitKey, action.id, action.wert);
          break;
      }
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleHeaderChange(updates: Partial<CharacterHeader>): void {
    if (!appState.currentCharacter) return;
    appState.currentCharacter = updateHeader(appState.currentCharacter, updates);
    saveCharacter(appState.currentCharacter);
    render();
  }

  function handlePoolChange(referenz: string, allocation: PoolAllocation): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = setPoolAllocation(appState.currentCharacter, referenz, allocation);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleWaffenPoolChange(poolReferenz: string, equipmentId: string, allocation: PoolAllocation): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = setWaffenPoolAllocation(appState.currentCharacter, poolReferenz, equipmentId, allocation);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleGrundfertigkeitPick(talentReferenz: string, slotIndex: number, grundfertigkeitReferenz: string): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = setGrundfertigkeitPick(appState.currentCharacter, talentReferenz, slotIndex, grundfertigkeitReferenz);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleToggle(referenz: string, selected: boolean): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = selected
        ? addSelection(appState.currentCharacter, referenz)
        : removeSelection(appState.currentCharacter, referenz);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyPreisliste(sourceRow: number, quantity: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyPreislisteItem(appState.currentCharacter, sourceRow, quantity);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyArtefakt(referenz: string, grad: string, variant: ArtefaktVariant, targetWeaponId?: string, targetReferenz?: string): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyArtefakt(appState.currentCharacter, referenz, grad, variant, targetWeaponId, targetReferenz);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleEquipRuestung(
    gruppe: RsGruppe, lage: number, basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
  ): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = equipRuestung(appState.currentCharacter, gruppe, lage, basisSourceRow, verarbeitungSourceRow, anpassungSourceRow);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleEquipRuestungAlleTz(gruppe: RsGruppe, selections: RuestungGruppenSelection[]): void {
    if (!appState.currentCharacter) return;
    try {
      for (const ziel of RUESTUNG_GRUPPEN_REIHENFOLGE) {
        if (ziel === gruppe) continue;
        for (const sel of selections) {
          if (appState.currentCharacter.ruestungSlots[ruestungSlotKey(ziel, sel.lage)]) continue;
          appState.currentCharacter = equipRuestung(
            appState.currentCharacter, ziel, sel.lage, sel.basisSourceRow, sel.verarbeitungSourceRow, sel.anpassungSourceRow,
          );
        }
      }
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    saveCharacter(appState.currentCharacter);
    render();
  }

  function handleUnequipRuestung(gruppe: RsGruppe, lage: number): void {
    if (!appState.currentCharacter) return;
    appState.currentCharacter = unequipRuestung(appState.currentCharacter, gruppe, lage);
    saveCharacter(appState.currentCharacter);
    appState.errorMessage = '';
    render();
  }

  function handleBuyShield(sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, bespannungSourceRow: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyShield(appState.currentCharacter, sourceRow, materialSourceRow, fertigungSourceRow, bespannungSourceRow);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyWeapon(
    sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, anpassungSourceRow: number, schaftmaterialSourceRow: number,
  ): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyWeapon(appState.currentCharacter, sourceRow, materialSourceRow, fertigungSourceRow, anpassungSourceRow, schaftmaterialSourceRow);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyFernkampfwaffe(typ: 'boegen' | 'armbrust', sourceRow: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyFernkampfwaffe(appState.currentCharacter, typ, sourceRow);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyFeuerwaffe(sourceRow: number, selections: FeuerwaffenSelections): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyFeuerwaffe(appState.currentCharacter, sourceRow, selections);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyFeuerwaffenMunition(art: FeuerwaffenMunitionArt, kaliber: number, quantity: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyFeuerwaffenMunition(appState.currentCharacter, art, kaliber, quantity);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyMunition(typ: 'pfeile' | 'bolzen', basisSourceRow: number, modifikatorSourceRow: number | null, quantity: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyMunition(appState.currentCharacter, typ, basisSourceRow, modifikatorSourceRow, quantity);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleBuyAlchemika(sourceRow: number, quantity: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = buyAlchemika(appState.currentCharacter, sourceRow, quantity);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleRemoveEquipment(equipmentId: string): void {
    if (!appState.currentCharacter) return;
    appState.currentCharacter = removeEquipment(appState.currentCharacter, equipmentId);
    saveCharacter(appState.currentCharacter);
    appState.errorMessage = '';
    render();
  }

  function handleAddWaffenLoadout(comboType: WaffenLoadoutComboType, primaryEquipmentId: string, secondaryEquipmentId: string): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = addWaffenLoadout(appState.currentCharacter, comboType, primaryEquipmentId, secondaryEquipmentId);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleRemoveWaffenLoadout(loadoutId: string): void {
    if (!appState.currentCharacter) return;
    appState.currentCharacter = removeWaffenLoadout(appState.currentCharacter, loadoutId);
    saveCharacter(appState.currentCharacter);
    appState.errorMessage = '';
    render();
  }

  function handleToggleWaffenLoadoutFavorite(loadoutId: string): void {
    if (!appState.currentCharacter) return;
    appState.currentCharacter = toggleWaffenLoadoutFavorite(appState.currentCharacter, loadoutId);
    saveCharacter(appState.currentCharacter);
    appState.errorMessage = '';
    render();
  }

  function handleGesinnungChange(traitKey: string, wert: number): void {
    if (!appState.currentCharacter) return;
    try {
      appState.currentCharacter = setGesinnung(appState.currentCharacter, traitKey, wert);
      saveCharacter(appState.currentCharacter);
      appState.errorMessage = '';
    } catch (err) {
      appState.errorMessage = err instanceof MutationError ? err.message : String(err);
    }
    render();
  }

  function handleGesinnungNotizChange(notiz: string): void {
    if (!appState.currentCharacter) return;
    appState.currentCharacter = setGesinnungNotiz(appState.currentCharacter, notiz);
    saveCharacter(appState.currentCharacter);
    render();
  }

  return {
    handleValueChange, handleWhkCustomChange, handleHeaderChange, handlePoolChange, handleWaffenPoolChange,
    handleGrundfertigkeitPick, handleToggle, handleBuyPreisliste, handleBuyArtefakt, handleEquipRuestung,
    handleEquipRuestungAlleTz, handleUnequipRuestung, handleBuyShield, handleBuyWeapon, handleBuyFernkampfwaffe,
    handleBuyFeuerwaffe, handleBuyFeuerwaffenMunition, handleBuyMunition, handleBuyAlchemika, handleRemoveEquipment,
    handleAddWaffenLoadout, handleRemoveWaffenLoadout, handleToggleWaffenLoadoutFavorite,
    handleGesinnungChange, handleGesinnungNotizChange,
  };
}

export type MutationHandlers = ReturnType<typeof createMutationHandlers>;
