// Gemeinsam genutzte, reine Ausgabe fuer den LE/RS-Gesamtblock. Der Renderer nimmt nur den
// berechneten Charakterzustand sowie optional den Aufklappzustand entgegen und bindet selbst
// keine Ereignisse. So koennen Kampfbereich und Charakterbogen exakt dieselbe Darstellung nutzen.

import type { ComputedRule, ComputedSheet } from '../engine/characterSheet';
import { makeValueSource } from '../engine/characterSheet';
import { computeRbe } from '../engine/armorComposition';
import { aufrunden } from '../engine/functions';
import { RUESTUNG_BASIS } from '../data/equipment/armor';
import type { RsGruppe } from '../data/trefferzonen';
import { ruestungSlotKey, type CharacterState } from '../state/characterStore';

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

const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;

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
  const rule = findRule(sheet.byKategorie['Charakterwerte'] ?? [], referenz);
  return rule ? formatValue(rule.computedValue) : '–';
}

function renderKampfTzGruppe(
  gruppe: KampfTzGruppe,
  sheet: ComputedSheet,
  character: CharacterState,
  rechtsWert: string,
  openGruppen: ReadonlySet<string>,
): string {
  const lagen = ruestungLagenStats(character, gruppe.rsGruppe);
  const rhSumme = lagen.reduce((sum, lage) => sum + lage.rh, 0);
  const rsSumme = lagen.reduce((sum, lage) => sum + lage.rs, 0);
  const lagenZeilen = lagen.map((lage) => `
    <tr>
      <td>Lage ${lage.lage}</td>
      <td>${escapeHtml(lage.name ?? '–')}</td>
      <td>${lage.rh}</td>
      <td>${lage.rs}</td>
    </tr>`).join('');
  return `
    <div class="kampf-tz-row">
      <details class="kampf-tz-details" data-kampf-tz-gruppe="${gruppe.key}"${openGruppen.has(gruppe.key) ? ' open' : ''}>
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

/**
 * Rendert den vollstaendigen LE/RS-Zustandsblock ohne DOM-Zugriff oder Event-Bindung.
 * Aufrufende Views besitzen ihren UI-Zustand und geben lediglich die offenen Gruppen hinein.
 */
export function renderKampfLeRs(
  sheet: ComputedSheet,
  character: CharacterState,
  openGruppen: ReadonlySet<string> = new Set(),
): string {
  const charakterwerte = sheet.byKategorie['Charakterwerte'] ?? [];
  const values = makeValueSource(character);
  const rhg = values.getRhGesamt?.() ?? 0;
  const rbeRoh = computeRbe(
    rhg,
    values.getWert('eig_k_konstitution'),
    values.getWert('eig_k_staerke'),
    values.getWert('sf_ruestungsmanoever'),
  );
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
      ${KAMPF_TZ_GRUPPEN.map((gruppe) => renderKampfTzGruppe(
        gruppe, sheet, character, rechtsWerte[gruppe.key], openGruppen,
      )).join('')}
    </div>`;
}
