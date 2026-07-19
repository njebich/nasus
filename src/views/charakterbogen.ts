// Charakterbogen: kompakte, rein lesbare End-Ansicht "wie der Charakter dargestellt werden
// soll, nachdem er fertig gesteigert ist" (Nutzer-Mockup 2026-07-17) - ein zusaetzlicher Tab
// neben den editierbaren Punktekauf-Tabs, kein Ersatz dafuer.

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import { makeValueSource } from '../engine/characterSheet';
import { ruestungSlotKey, type CharacterState, type CharacterHeader } from '../state/characterStore';
import { buildHierarchy, sortHierarchyByValue, type HierarchyNode } from '../engine/hierarchy';
import { describeSkillStufe } from '../engine/skillStufen';
import { computeRbe } from '../engine/armorComposition';
import { aufrunden } from '../engine/functions';
import { RUESTUNG_BASIS } from '../data/equipment/armor';
import type { RsGruppe } from '../data/trefferzonen';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatValue(value: unknown): string {
  if (typeof value === 'number') return String(Math.round(value * 100) / 100);
  if (value == null) return '–';
  return String(value);
}

function findRule(rows: ComputedRule[], referenz: string): ComputedRule | undefined {
  return rows.find((r) => r.rule.referenz === referenz);
}

type TextHeaderKey = Exclude<keyof CharacterHeader, 'herkunftSnapshot'>;

function headerField(character: CharacterState, key: TextHeaderKey, label: string): string {
  return `<tr><th>${label}</th><td>${escapeHtml(character[key] ?? '')}</td></tr>`;
}

function herkunftField(character: CharacterState): string {
  const snapshot = character.herkunftSnapshot;
  const text = snapshot ? [snapshot.name, snapshot.region, snapshot.welt].filter(Boolean).join(', ') : '';
  return `<tr><th>Herkunft</th><td>${escapeHtml(text)}</td></tr>`;
}

function renderHeaderTable(character: CharacterState): string {
  return `
    <div class="bogen-header">
      <h2 class="bogen-name">${escapeHtml(character.name)}</h2>
      <div class="bogen-header-columns">
        <table class="bogen-table">
          ${headerField(character, 'spezies', 'Spezies')}
          ${headerField(character, 'beruf', 'Beruf')}
          ${headerField(character, 'alter', 'Alter')}
          ${headerField(character, 'geburtstag', 'Geburtstag')}
          ${herkunftField(character)}
          ${headerField(character, 'familie', 'Familie')}
          ${headerField(character, 'religion', 'Religion')}
        </table>
        <table class="bogen-table">
          ${headerField(character, 'groesse', 'Größe')}
          ${headerField(character, 'gewicht', 'Gewicht')}
          ${headerField(character, 'haarfarbe', 'Haarfarbe')}
          ${headerField(character, 'haarschnitt', 'Haarschnitt')}
          ${headerField(character, 'bartwuchs', 'Bartwuchs')}
          ${headerField(character, 'hautfarbe', 'Hautfarbe')}
          ${headerField(character, 'augenfarbe', 'Augenfarbe')}
        </table>
      </div>
    </div>`;
}

const CHARAKTERWERTE_LEISTE = ['kreis', 'stufe', 'macht', 'mana', 'rerolls'];

function renderCharakterwerteUndAttribute(sheet: ComputedSheet): string {
  const charakterwerte = sheet.byKategorie['Charakterwerte'] ?? [];
  const attribute = sheet.byKategorie['Attribute'] ?? [];
  const werteRows = CHARAKTERWERTE_LEISTE
    .map((ref) => findRule(charakterwerte, ref))
    .filter((r): r is ComputedRule => r !== undefined)
    .map((r) => `<tr><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${formatValue(r.computedValue)}</td></tr>`)
    .join('');
  const epSpRows = `
    <tr><th>Erfahrungspkt.</th><td>${sheet.epGesamt}</td></tr>
    <tr><th>Steigerungspkt.</th><td>${sheet.spRemaining} / ${sheet.spTotal}</td></tr>`;
  const attributeRows = attribute
    .map((r) => `<tr><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${r.currentValue ?? formatValue(r.computedValue)}${r.alteredValue !== undefined ? ` (${r.alteredValue})` : ''}</td></tr>`)
    .join('');
  return `
    <div class="bogen-zwei-spalten">
      <table class="bogen-table">${werteRows}${epSpRows}</table>
      <table class="bogen-table"><tr><th colspan="2">Attribute</th></tr>${attributeRows}</table>
    </div>`;
}

const EIGENSCHAFTEN_PAARE: Array<[string, string]> = [
  ['eig_k_ausstrahlung', 'eig_k_athletik'],
  ['eig_g_intelligenz', 'eig_k_geschicklichkeit'],
  ['eig_g_mut', 'eig_k_konstitution'],
  ['eig_g_sinneschaerfe', 'eig_k_schnelligkeit'],
  ['eig_g_willenskraft', 'eig_k_staerke'],
];

function eigenschaftZellen(eigenschaft: ComputedRule[], bonus: ComputedRule[], referenz: string): string {
  const eig = findRule(eigenschaft, referenz);
  if (!eig) return '<td></td><td></td><td></td>';
  const bonusRef = referenz.replace(/^eig_/, 'eig_bonus_');
  const bon = findRule(bonus, bonusRef);
  return `
    <td>${escapeHtml(eig.rule.beschreibung ?? eig.rule.referenz)} (${escapeHtml(eig.rule.abkuerzung ?? '')})</td>
    <td>${eig.currentValue ?? 0}${eig.alteredValue !== undefined ? ` (${eig.alteredValue})` : ''}</td>
    <td>${bon ? formatValue(bon.computedValue) : ''}</td>`;
}

function renderEigenschaften(sheet: ComputedSheet): string {
  const eigenschaft = sheet.byKategorie['Eigenschaft'] ?? [];
  const bonus = sheet.byKategorie['Eigenschaftsbonus'] ?? [];
  const rows = EIGENSCHAFTEN_PAARE.map(([links, rechts]) => `
    <tr>
      ${eigenschaftZellen(eigenschaft, bonus, links)}
      ${eigenschaftZellen(eigenschaft, bonus, rechts)}
    </tr>`).join('');
  return `
    <h3 class="bogen-section-heading">Eigenschaften</h3>
    <table class="bogen-table bogen-table-eigenschaften">${rows}</table>`;
}

function renderAuswahlListe(sheet: ComputedSheet, kategorie: string, ueberschrift: string): string {
  const gewaehlt = (sheet.byKategorie[kategorie] ?? []).filter((r) => r.selected);
  if (gewaehlt.length === 0) return `<h3 class="bogen-section-heading">${escapeHtml(ueberschrift)}</h3><p class="bogen-leer">– keine –</p>`;
  const items = gewaehlt.map((r) => `<li>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</li>`).join('');
  return `<h3 class="bogen-section-heading">${escapeHtml(ueberschrift)}</h3><ul class="bogen-liste">${items}</ul>`;
}

/** Rendert eine Hauptfertigkeit + ihre Spezialisierungen als eingerueckte Tabellenzeilen. */
function renderFertigkeitGruppe(node: HierarchyNode): string {
  const hauptzeile = `<tr><td>${escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz)}</td><td>${node.row.currentValue ?? 0}</td></tr>`;
  const kinderzeilen = node.children
    .map((r) => `<tr class="bogen-spez"><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return hauptzeile + kinderzeilen;
}

function renderGrundfertigkeiten(sheet: ComputedSheet): string {
  const rows = (sheet.byKategorie['Grundfertigkeit'] ?? [])
    .map((r) => `<tr><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Grundfertigkeiten</h4>
      <table class="bogen-table">${rows}</table>
    </div>`;
}

/** Wie renderFertigkeitGruppe, aber nur TaW>0-Zeilen: Hauptfertigkeit ohne TaW wird nicht
 *  gezeigt, und ihre Spezialisierungen einzeln nur, wenn sie selbst TaW>0 haben. */
function renderFertigkeitGruppeNurTaw(node: HierarchyNode): string {
  const hauptzeile = `<tr><td>${escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz)}</td><td>${node.row.currentValue ?? 0}</td></tr>`;
  const kinderzeilen = node.children
    .filter((r) => (r.currentValue ?? 0) > 0)
    .map((r) => `<tr class="bogen-spez"><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return hauptzeile + kinderzeilen;
}

function renderKampffertigkeiten(sheet: ComputedSheet): string {
  const nahkampf = (sheet.byKategorie['Nahkampf'] ?? []).filter((r) => r.rule.art === 'Wert');
  const fernkampf = (sheet.byKategorie['Fernkampf'] ?? []).filter((r) => r.rule.art === 'Wert');
  const hierarchie = sortHierarchyByValue(buildHierarchy([...nahkampf, ...fernkampf]))
    .filter((node) => (node.row.currentValue ?? 0) > 0);
  const rows = hierarchie.map(renderFertigkeitGruppeNurTaw).join('');
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Kampffertigkeiten</h4>
      <table class="bogen-table">${rows}</table>
    </div>`;
}

/** Alle besessenen ssk_sprache_.../ssk_kultur_.../ssk_schrift_...-Faehigkeiten (Wert>0) mit
 *  benannter Stufe, wo vorhanden - ersetzt die frueher feste Volk/Sprache/Kultur-Zeile,
 *  seit es keinen kostenlosen Einzel-Grant mehr gibt (Nutzer 2026-07-17). */
function renderSpracheUndKultur(sheet: ComputedSheet): string {
  const alle = (sheet.byKategorie['Sprache & Kultur'] ?? []).filter((r) => (r.currentValue ?? 0) > 0);
  const rows = alle.length > 0
    ? alle.map((r) => {
        const wert = r.currentValue ?? 0;
        const stufe = describeSkillStufe(r.rule.referenz, wert);
        return `<tr><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${wert}${stufe ? ` (${escapeHtml(stufe)})` : ''}</td></tr>`;
      }).join('')
    : '<tr><td colspan="2">– keine –</td></tr>';
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Sprache &amp; Kultur</h4>
      <table class="bogen-table">${rows}</table>
      ${renderWhkNurGewaehlt(sheet)}
    </div>`;
}

function renderWhkNurGewaehlt(sheet: ComputedSheet): string {
  const whk = (sheet.byKategorie['WHK'] ?? []).filter((r) => (r.currentValue ?? 0) > 0);
  if (whk.length === 0) return '<h4>WHK</h4><p class="bogen-leer">– keine –</p>';
  const hierarchie = sortHierarchyByValue(buildHierarchy(whk));
  const rows = hierarchie.map(renderFertigkeitGruppe).join('');
  return `<h4>WHK</h4><table class="bogen-table bogen-table-whk">${rows}</table>`;
}

const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;

/** Eine Trefferzonen-Gruppe der LE/RS-Tabelle (Nutzer-Mockup "S03 Kampfseite mockup"). RH/RS
 *  kommen aus den echten Ruestungs-Slots einer TZ-Gruppe (rsGruppe) - Unterleib hat KEINE
 *  eigenen Slots und teilt sich die von Torso (Regelkorrektur Nutzer 2026-07-17: "Torso inkl.
 *  Unterleib" ist EINE Ruestungs-TZ-Gruppe), bekommt aber trotzdem eine eigene LE-Zeile, da
 *  le_unterleib eine eigenstaendige Formel-Referenz ist (siehe data/rules.json). Arme/Beine
 *  haben zwar getrennte L/R-Referenzen, zeigen hier aber nur EINEN Wert (Nutzer 2026-07-19) -
 *  beide Seiten nutzen ohnehin dieselbe Formel, le_arm_l/le_bein_l stehen stellvertretend. */
interface KampfTzGruppe {
  key: string;
  label: string;
  rsGruppe: RsGruppe;
  leReferenz: string;
  rechtsLabel: string;
}

const KAMPF_TZ_GRUPPEN: KampfTzGruppe[] = [
  { key: 'kopf', label: 'Kopf', rsGruppe: 'kopf', leReferenz: 'le_kopf', rechtsLabel: 'Gesundheit' },
  { key: 'torso', label: 'Torso', rsGruppe: 'torso', leReferenz: 'le_brust', rechtsLabel: 'Trefferschwelle' },
  { key: 'unterleib', label: 'Unterleib', rsGruppe: 'torso', leReferenz: 'le_unterleib', rechtsLabel: 'Selbstbeherrschung' },
  { key: 'arme', label: 'Arme', rsGruppe: 'arme', leReferenz: 'le_arm_l', rechtsLabel: 'Rüstungshinderlichkeit' },
  { key: 'beine', label: 'Beine', rsGruppe: 'beine', leReferenz: 'le_bein_l', rechtsLabel: 'RBE' },
];

function ruestungLagenStats(character: CharacterState, gruppe: RsGruppe) {
  return RUESTUNG_LAGEN.map((lage) => {
    const entry = character.ruestungSlots[ruestungSlotKey(gruppe, lage)];
    if (!entry) return { lage, name: undefined as string | undefined, rh: 0, rs: 0 };
    const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === entry.basisSourceRow);
    return { lage, name: basis?.name, rh: entry.computedStatsSnapshot.rh, rs: entry.computedStatsSnapshot.rs };
  });
}

function leText(sheet: ComputedSheet, referenz: string): string {
  const r = findRule(sheet.byKategorie['Charakterwerte'] ?? [], referenz);
  return r ? formatValue(r.computedValue) : '–';
}

function renderKampfTzGruppe(gruppe: KampfTzGruppe, sheet: ComputedSheet, character: CharacterState, rechtsWert: string): string {
  const lagen = ruestungLagenStats(character, gruppe.rsGruppe);
  const rhSumme = lagen.reduce((sum, l) => sum + l.rh, 0);
  const rsSumme = lagen.reduce((sum, l) => sum + l.rs, 0);
  const lagenZeilen = lagen.map((l) => `
    <tr>
      <td>Lage ${l.lage}</td>
      <td>${escapeHtml(l.name ?? '–')}</td>
      <td>${l.rh}</td>
      <td>${l.rs}</td>
    </tr>`).join('');
  return `
    <div class="kampf-tz-row">
      <details class="kampf-tz-details">
        <summary class="kampf-tz-summary">
          <span class="kampf-tz-name">${escapeHtml(gruppe.label)}</span>
          <span class="kampf-tz-rh">${rhSumme}</span>
          <span class="kampf-tz-rs">${rsSumme}</span>
          <span class="kampf-tz-le">${leText(sheet, gruppe.leReferenz)}</span>
        </summary>
        <table class="kampf-tz-lagen">${lagenZeilen}</table>
      </details>
      <div class="kampf-tz-rechts">
        <span class="kampf-tz-rechts-label">${escapeHtml(gruppe.rechtsLabel)}</span>
        <span class="kampf-tz-rechts-wert">${rechtsWert}</span>
      </div>
    </div>`;
}

/** RHg/RBE sind KEINE eigenen Regelwerk-Referenzen (siehe engine/rules.ts's
 *  computeGewichtsbelastungRbe) - hier direkt ueber dieselben Bausteine nachgerechnet, statt nur
 *  ueber die davon abgeleitete "gewichtsbelastung" (=MAX(0;RBE)) zu gehen, da das Mockup den
 *  rohen (auch negativen) RBE-Wert zeigen will. */
function renderKampfLeRs(sheet: ComputedSheet, character: CharacterState): string {
  const charakterwerte = sheet.byKategorie['Charakterwerte'] ?? [];
  const values = makeValueSource(character);
  const rhg = values.getRhGesamt?.() ?? 0;
  const rbeRoh = computeRbe(rhg, values.getWert('eig_k_konstitution'), values.getWert('eig_k_staerke'), values.getWert('sf_ruestungsmanoever'));
  // Nutzer 2026-07-19: RBE immer aufrunden - gleiche "aufgerundet" (vom Nullpunkt weg)-Konvention
  // wie fuer alle anderen berechneten Werte im Regelwerk (siehe engine/rules.ts's
  // applyRoundingRule), hier nur nachgeholt, da RBE selbst keine Regelwerk-Referenz ist.
  const rbe = aufrunden(rbeRoh, 0);

  const rechtsWerte: Record<string, string> = {
    kopf: formatValue(findRule(charakterwerte, 'gesundheit')?.computedValue),
    torso: formatValue(findRule(charakterwerte, 'trefferschwelle')?.computedValue),
    unterleib: formatValue(findRule(charakterwerte, 'selbstbeherrschung')?.computedValue),
    arme: formatValue(rhg),
    beine: formatValue(rbe),
  };

  return `
    <h3 class="bogen-section-heading">Lebensenergie &amp; Rüstungsschutz</h3>
    <div class="kampf-tz-tabelle">
      <div class="kampf-tz-row kampf-tz-kopfzeile">
        <div class="kampf-tz-summary">
          <span class="kampf-tz-name">Trefferzone</span>
          <span class="kampf-tz-rh">RH</span>
          <span class="kampf-tz-rs">RS</span>
          <span class="kampf-tz-le">LE</span>
        </div>
        <div class="kampf-tz-rechts-spacer"></div>
      </div>
      ${KAMPF_TZ_GRUPPEN.map((g) => renderKampfTzGruppe(g, sheet, character, rechtsWerte[g.key])).join('')}
    </div>`;
}

export function renderCharakterbogen(container: HTMLElement, sheet: ComputedSheet, character: CharacterState): void {
  container.innerHTML = `
    <div class="bogen">
      ${renderHeaderTable(character)}
      ${renderCharakterwerteUndAttribute(sheet)}
      ${renderEigenschaften(sheet)}
      ${renderAuswahlListe(sheet, 'Vor- und Nachteile', 'Vor-/Nachteile')}
      ${renderAuswahlListe(sheet, 'Talente', 'Talente')}
      <h3 class="bogen-section-heading">Fertigkeiten</h3>
      <div class="bogen-fertigkeiten-reihe">
        ${renderGrundfertigkeiten(sheet)}
        ${renderKampffertigkeiten(sheet)}
        ${renderSpracheUndKultur(sheet)}
      </div>
      ${renderKampfLeRs(sheet, character)}
    </div>`;
}
