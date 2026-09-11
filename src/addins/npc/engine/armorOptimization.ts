import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../../../data/equipment/armor';
import { composeArmor, computeRbe } from '../../../engine/armorComposition';
import { computeSheet, makeValueSource } from '../../../engine/characterSheet';
import { evalReferenz } from '../../../engine/rules';
import type { CharacterState } from '../../../state/characterStore';
import { applyNpcArmorPackage, inspectNpcArmor, type NpcArmorOverrides } from './ruestungspakete';

export type ArmorOptimizationMode = 'schutz' | 'sparsam';
export type ArmorOptimizationResult =
  | { ok: true; character: CharacterState; overrides: NpcArmorOverrides; changes: number; message: string }
  | { ok: false; message: string };

interface Plan {
  rh: number;
  rs: number;
  price: number;
  overrides: NpcArmorOverrides;
}

/** Kombinationensuche für Fertigung/Anpassung und optional Basisteile derselben Lage.
 * Pro (Gesamt-RH, Gesamt-RS) genügt der günstigste Teilplan: weitere Teile sind additiv.
 * RS darf an KEINEM Teil sinken. Keine Änderungen an Budgets, belegten Lagen/Zonen oder Talenten.
 */
export function optimizeNpcArmor(
  character: CharacterState, learnedRm = character.values.sf_ruestungsmanoever ?? 0,
  mode: ArmorOptimizationMode = 'schutz', chooseBaseParts = false, fittedOnly = false,
): ArmorOptimizationResult {
  const baseline = structuredClone(character);
  baseline.values.sf_ruestungsmanoever = learnedRm;
  const armor = inspectNpcArmor(baseline);
  const source = makeValueSource(baseline);
  const kon = Number(evalReferenz('eig_k_konstitution', source));
  const strength = Number(evalReferenz('eig_k_staerke', source));
  if (![kon, strength, learnedRm, armor.maximumRm].every(Number.isFinite) || learnedRm < 0) {
    return { ok: false, message: 'Die Ausgangswerte für die Rüstungsplanung sind ungültig.' };
  }
  const withoutArmor = structuredClone(baseline);
  withoutArmor.ruestungSlots = {};
  const baseSheet = computeSheet(withoutArmor);
  const money = baseSheet.dublonenRemaining;
  if (money < 0 || baseSheet.spRemaining < 0 || baseSheet.tapRemaining < 0) {
    return { ok: false, message: 'Schon ohne Rüstung ist ein Budget überschritten. Die Automatik kann die übrige Ausstattung oder Ausbildung nicht finanzieren.' };
  }
  if (baseSheet.validationIssues.length) {
    return { ok: false, message: 'Die Ausgangsfigur hat weitere Regelprobleme, die sich durch Fertigung und Anpassung nicht beheben lassen.' };
  }
  // Auch Ausbildungsstufen werden mit dem vollständigen Modell bepreist, nicht mit einer zweiten Kostenformel.
  const affordableRm: number[] = [];
  for (let rm = learnedRm; rm <= armor.maximumRm; rm++) {
    withoutArmor.values.sf_ruestungsmanoever = rm;
    const sheet = computeSheet(withoutArmor);
    if (sheet.spRemaining >= 0 && sheet.tapRemaining >= 0) affordableRm.push(rm);
  }
  if (!affordableRm.length) return { ok: false, message: 'Für Rüstungsmanöver fehlen freie Punkte oder die passende Talentfreischaltung.' };
  const maxRm = affordableRm[affordableRm.length - 1];
  const welt = character.herkunftSnapshot?.welt;
  let plans: Plan[] = [{ rh: 0, rs: 0, price: 0, overrides: {} }];
  for (const [key, old] of Object.entries(baseline.ruestungSlots).sort(([a], [b]) => a.localeCompare(b))) {
    const basis = RUESTUNG_BASIS.find((row) => row.sourceRow === old.basisSourceRow);
    if (!basis) return { ok: false, message: 'Ein Rüstungsteil fehlt im aktuellen Katalog.' };
    const bases = chooseBaseParts ? RUESTUNG_BASIS.filter((row) => Number(row.Lage) === Number(basis.Lage)) : [basis];
    const options = bases.flatMap((basis) => RUESTUNG_VERARBEITUNG.flatMap((verarbeitung) => RUESTUNG_ANPASSUNG.filter((row) => !fittedOnly || ['angepasst', 'perfekt angepasst'].includes(row.name)).map((anpassung) => ({
      basisSourceRow: basis.sourceRow, verarbeitungSourceRow: verarbeitung.sourceRow, anpassungSourceRow: anpassung.sourceRow,
      stats: composeArmor(basis, verarbeitung, anpassung),
    })))).filter(({ stats }) => stats.rs >= (fittedOnly && chooseBaseParts ? 0 : old.computedStatsSnapshot.rs)
      && (character.bestehenderCharakter || (welt === 'AW' ? stats.verfuegbarkeitAw : welt === 'NW'
        ? stats.verfuegbarkeitNw : Math.max(stats.verfuegbarkeitNw, stats.verfuegbarkeitAw)) < 5));
    const next = new Map<string, Plan>();
    for (const plan of plans) for (const option of options) {
      const price = plan.price + option.stats.preis;
      const rh = plan.rh + option.stats.rh;
      if (price > money || computeRbe(rh, kon, strength, maxRm) > armor.maxBe) continue;
      const rs = plan.rs + option.stats.rs;
      const stateKey = `${rh}:${rs}`;
      if (next.has(stateKey) && next.get(stateKey)!.price <= price) continue;
      next.set(stateKey, { rh, rs, price, overrides: { ...plan.overrides, [key]: {
        basisSourceRow: option.basisSourceRow, verarbeitungSourceRow: option.verarbeitungSourceRow, anpassungSourceRow: option.anpassungSourceRow,
      } } });
    }
    plans = [...next.values()];
    if (!plans.length) return { ok: false, message: 'Keine Kombination aus den erlaubten Teilen, Fertigungen und Anpassungen erreicht das BE-Ziel innerhalb der vorhandenen Budgets und Talentgrenzen, ohne den Schutz eines Teils zu senken.' };
  }
  const candidates = plans.map((plan) => ({ ...plan, rm: affordableRm.find((rm) => computeRbe(plan.rh, kon, strength, rm) <= armor.maxBe)! }));
  candidates.sort((a, b) => mode === 'sparsam'
    ? a.price - b.price || a.rm - b.rm || b.rs - a.rs
    : b.rs - a.rs || a.rm - b.rm || a.price - b.price);
  for (const best of candidates) {
    const candidate = applyNpcArmorPackage(baseline, '', false, best.overrides);
    const sheet = computeSheet(candidate);
    if (sheet.validationIssues.length || inspectNpcArmor(candidate).rbe > armor.maxBe) continue;
    const changes = Object.entries(best.overrides).filter(([key, choice]) => {
      const old = character.ruestungSlots[key];
      return old.basisSourceRow !== choice.basisSourceRow || old.verarbeitungSourceRow !== choice.verarbeitungSourceRow || old.anpassungSourceRow !== choice.anpassungSourceRow;
    }).length;
    return { ok: true, character: candidate, overrides: best.overrides, changes,
      message: `Automatische Auswahl: ${changes} Teile geändert, ${inspectNpcArmor(candidate).be} BE (Ziel höchstens ${armor.maxBe}). ${fittedOnly && chooseBaseParts ? 'Alle Rüstungsstärken und Materialien innerhalb der belegten Lagen verglichen; jedes Teil mindestens angepasst.' : mode === 'sparsam'
        ? 'Günstigste passende Kombination bei mindestens gleichem Schutz je Teil.'
        : 'Höchste Summe der Schutzwerte bei mindestens gleichem Schutz je Teil; danach möglichst wenig zusätzliche Ausbildung und geringe Kosten.'}` };
  }
  return { ok: false, message: 'Die gefundenen Rüstungskombinationen bestehen die vollständige Charakterprüfung nicht. Bitte die angezeigten Charakterprobleme beheben.' };
}
