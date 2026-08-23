import type { ComputedSheet } from '../engine/characterSheet';
import type { CharacterValueSource } from '../engine/rules';
import type { CharacterState } from '../state/characterStore';
import type { NavigationState } from '../navigation';
import { getViewRoute } from '../navigation';
import type { MutationHandlers } from '../state/mutationHandlers';
import { renderCategoryRouteView } from './categoryView';
import { renderAuswahlView } from './talenteVornachteile';
import { renderAusruestungView } from './ausruestung';
import { renderReadOnlyBesitzView } from './besitz';
import { renderGrunddatenView } from './charakterheader';
import { renderGesinnungView } from './gesinnung';
import { renderCharakterbogen } from './charakterbogen';
import { renderKampfView } from './kampf';
import { renderKiView, renderReadOnlyKiView } from './ki';
import { renderReadOnlySpruchmagieView, renderSpruchmagieView } from './spruchmagie';
import { renderGrimoireView } from './grimoire';
import { renderPsiView, renderReadOnlyPsiView } from './psi';
import { renderGeweihteView } from './geweihte';
import { renderVerteilungView } from './verteilung';

/** Route-Dispatch von main.ts (vormals der abschließende if/else-Block in render()): entscheidet
 *  anhand von navigationState, welche Tab-View in den viewContainer gerendert wird. */
export function renderActiveView(
  viewContainer: HTMLDivElement,
  sheet: ComputedSheet,
  currentCharacter: CharacterState,
  navigationState: NavigationState,
  handlers: MutationHandlers,
  characterValues: CharacterValueSource | undefined,
): void {
  const route = getViewRoute(navigationState.activeMainTab, navigationState.activeSubTab);
  if (route.kind === 'grunddaten') {
    renderGrunddatenView(viewContainer, currentCharacter, handlers.handleHeaderChange);
  } else if (route.kind === 'gesinnung') {
    renderGesinnungView(viewContainer, currentCharacter, handlers.handleGesinnungChange, handlers.handleGesinnungNotizChange);
  } else if (route.kind === 'charakterbogen') {
    renderCharakterbogen(viewContainer, sheet, currentCharacter);
  } else if (route.kind === 'charakterbogen-spruchmagie') {
    renderReadOnlySpruchmagieView(viewContainer, sheet);
  } else if (route.kind === 'charakterbogen-grimoire') {
    renderGrimoireView(viewContainer, sheet, currentCharacter);
  } else if (route.kind === 'charakterbogen-ki') {
    renderReadOnlyKiView(viewContainer, sheet, currentCharacter.grundfertigkeitAuswahl);
  } else if (route.kind === 'charakterbogen-psi') {
    renderReadOnlyPsiView(viewContainer, sheet);
  } else if (route.kind === 'charakterbogen-geweihte') {
    renderGeweihteView(viewContainer, sheet, currentCharacter);
  } else if (route.kind === 'charakterbogen-inventar') {
    renderReadOnlyBesitzView(viewContainer, currentCharacter);
  } else if (route.kind === 'ausruestung') {
    if (route.category === 'Besitz') {
      renderReadOnlyBesitzView(viewContainer, currentCharacter);
    } else renderAusruestungView(viewContainer, sheet, currentCharacter, {
      onBuyPreisliste: handlers.handleBuyPreisliste,
      onBuyArtefakt: handlers.handleBuyArtefakt,
      onEquipRuestung: handlers.handleEquipRuestung,
      onEquipRuestungAlleTz: handlers.handleEquipRuestungAlleTz,
      onUnequipRuestung: handlers.handleUnequipRuestung,
      onBuyShield: handlers.handleBuyShield,
      onBuyWeapon: handlers.handleBuyWeapon,
      onBuyFernkampfwaffe: handlers.handleBuyFernkampfwaffe,
      onBuyFeuerwaffe: handlers.handleBuyFeuerwaffe,
      onBuyFeuerwaffenMunition: handlers.handleBuyFeuerwaffenMunition,
      onBuyMunition: handlers.handleBuyMunition,
      onBuyAlchemika: handlers.handleBuyAlchemika,
      onRemoveEquipment: handlers.handleRemoveEquipment,
    }, route.category);
  } else if (route.kind === 'verteilung') {
    renderVerteilungView(viewContainer, sheet, currentCharacter);
  } else if (route.kind === 'auswahl') {
    renderAuswahlView(
      viewContainer, sheet, route.category, route.isTalent, handlers.handleToggle,
      currentCharacter.religion, currentCharacter.charakterTyp,
    );
  } else if (route.kind === 'kampf') {
    renderKampfView(
      viewContainer, sheet, currentCharacter, handlers.handleWaffenPoolChange,
      handlers.handleAddWaffenLoadout, handlers.handleRemoveWaffenLoadout, handlers.handleToggleWaffenLoadoutFavorite,
    );
  } else if (route.kind === 'ki') {
    renderKiView(viewContainer, sheet, handlers.handleValueChange, currentCharacter.grundfertigkeitAuswahl, handlers.handleGrundfertigkeitPick);
  } else if (route.kind === 'spruchmagie') {
    renderSpruchmagieView(viewContainer, sheet, handlers.handleValueChange);
  } else if (route.kind === 'psi') {
    renderPsiView(viewContainer, sheet, handlers.handleValueChange);
  } else if (route.kind === 'geweihte') {
    renderGeweihteView(viewContainer, sheet, currentCharacter, handlers.handleValueChange);
  } else if (route.kind === 'category') {
    renderCategoryRouteView(
      viewContainer, sheet, route.title, route.categories,
      handlers.handleValueChange, handlers.handlePoolChange, characterValues, handlers.handleWhkCustomChange,
    );
  }
}
