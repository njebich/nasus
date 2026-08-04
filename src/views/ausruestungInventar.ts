// "Mein Inventar" - Besitz-Liste je Kaufkategorie, inkl. Ungueltigkeits-Erkennung fuer
// Katalogeintraege, die seit dem Kauf aus der xlsx entfernt/umbenannt wurden. Siehe
// ausruestung.ts-Dateikopf fuer den Gesamtkontext der Ausruestungs-Ansicht.

import type { CharacterState } from '../state/characterStore';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { ALCHEMIKA } from '../data/equipment/alchemika';
import {
  ARROW_BY_SOURCE_ROW, BOLT_BY_SOURCE_ROW, BOW_BY_SOURCE_ROW, CROSSBOW_BY_SOURCE_ROW,
  FIREARM_AMMO_BY_ART_AND_CALIBER, FIREARM_BY_SOURCE_ROW, MELEE_WEAPON_BY_SOURCE_ROW,
} from '../engine/weaponCatalog';
import { firearmAmmoTypeForArt } from '../engine/ammunitionTypes';
import { isXKlingeReferenz, resolveXKlingeWirkung, xKlingeTooltip, xKlingeWeaponName, xKlingeWirkungForEntry } from '../engine/xKlinge';
import { artefaktTooltip } from '../engine/artefaktWirkung';
import { describeStoredWeapon } from './weaponDisplay';
import { tooltipAttr } from './tooltip';
import { formatDublonen } from '../utils/format';
import { escapeHtml, statSnapshotTooltip, statSnapshotTooltipText, fernkampfwaffeStatTooltip, alchemikaStatTooltip } from './ausruestungShared';
import { resolveArtefaktZielLabel } from './ausruestungArtefakte';
import type { AusruestungCallbacks, KaufKategorie } from './ausruestung';

export function equipmentInKategorie(entry: CharacterState['equipment'][number], category: KaufKategorie): boolean {
  if (category === 'Schilde') return entry.family === 'shield';
  if (category === 'Waffen') return entry.family === 'weapon';
  if (category === 'Bögen') return (entry.family === 'fernkampfwaffe' && entry.baseTable === 'boegen')
    || (entry.family === 'ammo' && entry.baseTable === 'pfeile');
  if (category === 'Armbrüste') return (entry.family === 'fernkampfwaffe' && entry.baseTable === 'armbrust')
    || (entry.family === 'ammo' && entry.baseTable === 'bolzen');
  if (category === 'Feuerwaffen') return entry.family === 'feuerwaffe'
    || (entry.family === 'ammo' && entry.baseTable === 'feuerwaffen-munition');
  if (category === 'Alchemika') return entry.family === 'alchemika';
  if (category === 'Preisliste') return entry.family === 'preisliste';
  if (category === 'Artefakte') return entry.family === 'artefakt';
  return false;
}

export function renderInventar(character: CharacterState, category: KaufKategorie): string {
  const equipment = character.equipment.filter((entry) => equipmentInKategorie(entry, category));
  if (equipment.length === 0) {
    return '<p class="inventar-empty">In dieser Kategorie noch nichts gekauft.</p>';
  }
  return equipment.map((e) => {
    let invalidReason = e.invalidReason;
    if (!invalidReason && (e.family === 'weapon' || e.family === 'shield') && !MELEE_WEAPON_BY_SOURCE_ROW.has(e.baseId)) {
      invalidReason = `Ungültige Waffe: Tabelle '${e.baseTable}', sourceRow ${e.baseId}, `
        + `Waffe '<unbekannt>', Spezialisierung '<fehlt>': Katalogeintrag fehlt`;
    } else if (!invalidReason && e.family === 'feuerwaffe' && !FIREARM_BY_SOURCE_ROW.has(e.baseId)) {
      invalidReason = `Ungültige Waffe: Tabelle 'Feuerwaffen', sourceRow ${e.baseId}, `
        + `Waffe '<unbekannt>', Spezialisierung '<fehlt>': Katalogeintrag fehlt`;
    } else if (!invalidReason && e.family === 'fernkampfwaffe' && e.rangedSnapshot?.kind !== 'ranged-weapon') {
      invalidReason = `Ungültige Waffe: Tabelle '${e.baseTable}', sourceRow ${e.baseId}: Waffen-Snapshot fehlt`;
    } else if (!invalidReason && e.family === 'ammo' && e.baseTable === 'feuerwaffen-munition') {
      const caliber = Number(e.selections.kaliber);
      const ammoRow = FIREARM_AMMO_BY_ART_AND_CALIBER.get(`${e.baseId}:${caliber}`);
      if (!ammoRow) {
        invalidReason = `Ungültige Munition: Eintrag '${e.baseId}', Kaliber '${e.selections.kaliber ?? '<fehlt>'}', `
          + `Munitions-Typ '${firearmAmmoTypeForArt(e.baseId) ?? '<fehlt>'}': Katalogeintrag fehlt`;
      }
    } else if (!invalidReason && e.family === 'ammo' && e.baseTable !== 'feuerwaffen-munition'
      && e.rangedSnapshot?.kind !== 'ranged-ammo') {
      invalidReason = `Ungültige Munition: Tabelle '${e.baseTable}', sourceRow ${e.baseId}, `
        + `erwarteter Munitions-Typ '${e.baseTable === 'pfeile' ? 'pfeil' : 'bolzen'}', tatsächlicher Typ '<fehlt>'`;
    }
    let label = e.displayNameSnapshot ?? `${e.family} (${e.baseTable} #${e.baseId})`;
    // Nur gesetzt fuer Faelle, die eigenes sicheres HTML brauchen (Material-/Fertigung-/Anpassung-
    // Wertemodifikator-Tooltips, Nutzer-Ask) - sonst faellt der Renderer auf escapeHtml(label) zurueck.
    let labelHtml: string | undefined;
    // Nutzer 2026-07-24: "Show full item stat block if Schilde, NK-Waffe or FK-Waffe or ammo or
    // Alchemika" - Ruestung/Preisliste/Artefakt bewusst aussen vor (nicht in der Nutzer-Aufzaehlung).
    let statTooltip = '';
    if (e.family === 'preisliste') {
      const row = PREISLISTE.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
    } else if (e.family === 'artefakt') {
      const kostenRow = ARTEFAKT_KOSTEN.find((r) => String(r.sourceRow) === e.baseId);
      const zielLabel = kostenRow && e.selections.ziel
        ? resolveArtefaktZielLabel(character, kostenRow.referenz, String(e.selections.ziel))
        : undefined;
      label = kostenRow
        ? `${kostenRow.name}${zielLabel ? ` – ${zielLabel}` : ''} Grad ${kostenRow.grad} (${e.selections.variant})`
        : label;
      const basis = kostenRow ? ARTEFAKT_BASIS.find((row) => row.referenz === kostenRow.referenz) : undefined;
      if (basis && kostenRow) {
        // Nutzer-Ask: volle Wirkung/Wirkungswert/ED/WD zeigen, wenn vorhanden - dieselbe Funktion
        // wie die Kaufvorschau (siehe artefaktTooltip-Aufruf oben in renderArtefaktGradAuswahl),
        // statt nur der rohen Basis-Beschreibung ohne ED/WD.
        const text = isXKlingeReferenz(basis.referenz)
          ? xKlingeTooltip(resolveXKlingeWirkung(basis.referenz, kostenRow.grad ?? ''))
          : artefaktTooltip(basis, kostenRow.grad ?? '');
        statTooltip = tooltipAttr(text);
      }
    } else if (e.family === 'shield') {
      const row = MELEE_WEAPON_BY_SOURCE_ROW.get(e.baseId);
      const rs = e.computedStatsSnapshot?.rs;
      // RS des Schilds wird angezeigt, aber bewusst NICHT in rs_arme eingerechnet (Regel Nutzer
      // 2026-07-17: Anrechnung auf den linken Arm ist Kampfmodul-Scope, siehe characterMutations.ts).
      label = row ? `${row.name} (RS ${rs})` : label;
      statTooltip = statSnapshotTooltip(e.computedStatsSnapshot);
    } else if (e.family === 'weapon') {
      const row = MELEE_WEAPON_BY_SOURCE_ROW.get(e.baseId);
      const display = describeStoredWeapon(e);
      label = display ? `${display.title} — ${display.stats}` : row ? (xKlingeWeaponName(e) ?? row.name) : label;
      // Nutzer-Ask: Material/Fertigung/Anpassung zeigen einzeln beim Hover ihren Wertemodifikator.
      if (display) labelHtml = `${display.titleHtml ?? escapeHtml(display.title)} — ${escapeHtml(display.stats)}`;
      const wirkung = xKlingeWirkungForEntry(e);
      statTooltip = tooltipAttr([
        statSnapshotTooltipText(e.computedStatsSnapshot),
        wirkung ? xKlingeTooltip(wirkung) : '',
      ].filter(Boolean).join('\n'));
    } else if (e.family === 'fernkampfwaffe') {
      const row = (e.baseTable === 'boegen' ? BOW_BY_SOURCE_ROW : CROSSBOW_BY_SOURCE_ROW).get(e.baseId);
      label = row?.name ?? label;
      if (row) statTooltip = fernkampfwaffeStatTooltip(row);
    } else if (e.family === 'feuerwaffe') {
      const row = FIREARM_BY_SOURCE_ROW.get(e.baseId);
      label = row?.name ?? label;
      statTooltip = statSnapshotTooltip(e.computedStatsSnapshot);
    } else if (e.family === 'ammo') {
      if (e.baseTable === 'feuerwaffen-munition') {
        const ammo = FIREARM_AMMO_BY_ART_AND_CALIBER.get(`${e.baseId}:${e.selections.kaliber}`);
        label = ammo ? `${ammo.label} (Kaliber ${ammo.kaliber})` : label;
      } else {
        const table = e.baseTable === 'pfeile' ? ARROW_BY_SOURCE_ROW : BOLT_BY_SOURCE_ROW;
        const basis = table.get(e.baseId);
        const modRow = e.selections.modifikator ? table.get(e.selections.modifikator) : undefined;
        const fixschaden = e.computedStatsSnapshot?.fixschaden;
        const rwMod = e.computedStatsSnapshot?.rwModMeter;
        const details = [
          fixschaden ? `Fixschaden ${fixschaden >= 0 ? '+' : ''}${fixschaden}` : '',
          rwMod ? `RW-Mod ${rwMod >= 0 ? '+' : ''}${rwMod}m` : '',
        ].filter(Boolean).join(', ');
        label = basis ? `${modRow ? `${modRow.name} (${basis.name})` : basis.name}${details ? ` (${details})` : ''}` : label;
      }
      statTooltip = statSnapshotTooltip(e.computedStatsSnapshot);
    } else if (e.family === 'alchemika') {
      const row = ALCHEMIKA.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
      if (row) statTooltip = alchemikaStatTooltip(row);
    }
    const total = (e.computedPriceSnapshot ?? 0) * e.quantity;
    return `
      <div class="inventar-row${invalidReason ? ' inventar-row-invalid' : ''}" data-equipment-id="${e.id}"${invalidReason ? ` title="${escapeHtml(invalidReason)}"` : statTooltip}>
        <span class="stat-label">${labelHtml ?? escapeHtml(label)}${e.quantity > 1 ? ` ×${e.quantity}` : ''}${invalidReason ? `<span class="inventar-invalid-error">Ungültig: ${escapeHtml(invalidReason)}</span>` : ''}</span>
        <span class="stat-cost">${formatDublonen(total)}</span>
        <button type="button" class="inventar-remove" data-equipment-id="${e.id}">Entfernen</button>
      </div>`;
  }).join('');
}

export function wireInventarEvents(container: HTMLElement, callbacks: AusruestungCallbacks): void {
  container.querySelectorAll<HTMLButtonElement>('.inventar-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onRemoveEquipment(btn.dataset.equipmentId!);
    });
  });
}
