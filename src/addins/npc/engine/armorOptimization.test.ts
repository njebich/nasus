import { describe, expect, it } from 'vitest';
import { createNpcPreview, inspectNpc } from './npcCreation';
import { optimizeNpcArmor } from './armorOptimization';
import { applyNpcArmorPackage } from './ruestungspakete';
import { RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../../../data/equipment/armor';

describe('Automatische Rüstungswahl', () => {
  it('findet eine gemischte Anpassung, wenn weder alles von der Stange noch alles angepasst passt', () => {
    const candidate = createNpcPreview('bauer', '', '', 'handwerker-stange');
    // Kontrolliertes Budget: höchstens RM 7 und genau 204 D für die Rüstung.
    candidate.values.ep_gesamt += 36;
    candidate.values.dublonen_bank = 578.21;
    const before = JSON.stringify(candidate);
    const result = optimizeNpcArmor(candidate, 3, 'sparsam');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const actual = inspectNpc(result.character);
    expect(actual.issues).toEqual([]);
    expect(actual.armor).toMatchObject({ rh: 15, rm: 7, rbe: 0, preis: 204 });
    expect(Object.entries(result.overrides).filter(([key, entry]) => key.endsWith(':2') && entry.anpassungSourceRow === 4)).toHaveLength(1);
    expect(actual.sheet.spRemaining).toBe(0);
    expect(JSON.stringify(candidate)).toBe(before);
    expect(result.character.selections).toEqual(candidate.selections);
  });

  it('meldet eine echte Sackgasse statt Geld oder Talentpunkte zu erhöhen', () => {
    const candidate = createNpcPreview('bauer', '', '', 'handwerker');
    const result = optimizeNpcArmor(candidate, 3);
    expect(result.ok).toBe(false);
    expect(result.message).toContain('Keine Kombination');
  });

  it('verbessert den Schutz im Budget und ist deterministisch', () => {
    const candidate = createNpcPreview('nahkaempfer', '', '', 'nahkaempfer-lederpanzer');
    const result = optimizeNpcArmor(candidate, 14);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const after = inspectNpc(result.character);
    expect(after.issues).toEqual([]);
    expect(after.armor.rbe).toBe(0);
    expect(after.sheet.spRemaining).toBeGreaterThanOrEqual(0);
    expect(after.sheet.dublonenRemaining).toBeGreaterThanOrEqual(0);
    for (const [key, old] of Object.entries(candidate.ruestungSlots)) {
      expect(result.character.ruestungSlots[key].computedStatsSnapshot.rs).toBeGreaterThanOrEqual(old.computedStatsSnapshot.rs);
    }
    const score = (c: typeof candidate) => Object.values(c.ruestungSlots).reduce((sum, slot) => sum + slot.computedStatsSnapshot.rs, 0);
    expect(score(result.character)).toBeGreaterThan(score(candidate));
    expect(optimizeNpcArmor(candidate, 14)).toEqual(result);
  });

  it('erreicht dasselbe Optimum wie eine vollständige unabhängige Aufzählung bei zwei Teilen', () => {
    const candidate = createNpcPreview('bauer', '', '');
    candidate.ruestungSlots = Object.fromEntries(Object.entries(candidate.ruestungSlots).filter(([key]) => ['torso:2', 'beine:2'].includes(key)));
    candidate.values.dublonen_bank = 750;
    const keys = Object.keys(candidate.ruestungSlots);
    const combinations = RUESTUNG_VERARBEITUNG.flatMap((v) => RUESTUNG_ANPASSUNG.map((a) => ({ verarbeitungSourceRow: v.sourceRow, anpassungSourceRow: a.sourceRow })));
    const feasible: Array<{ rs: number; rm: number; price: number }> = [];
    for (const one of combinations) for (const two of combinations) {
      const c = applyNpcArmorPackage(candidate, '', false, { [keys[0]]: one, [keys[1]]: two });
      const result = inspectNpc(c);
      if (result.issues.length || Object.entries(c.ruestungSlots).some(([key, slot]) => slot.computedStatsSnapshot.rs < candidate.ruestungSlots[key].computedStatsSnapshot.rs)) continue;
      feasible.push({ rs: result.armor.zonen.reduce((sum, zone) => sum + zone.rs, 0), rm: result.armor.rm, price: result.armor.preis });
    }
    expect(feasible.length).toBeGreaterThan(0);
    for (const mode of ['schutz', 'sparsam'] as const) {
      feasible.sort((a, b) => mode === 'schutz' ? b.rs - a.rs || a.rm - b.rm || a.price - b.price : a.price - b.price || a.rm - b.rm || b.rs - a.rs);
      const result = optimizeNpcArmor(candidate, 3, mode);
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const { armor } = inspectNpc(result.character);
      expect({ rs: armor.zonen.reduce((sum, zone) => sum + zone.rs, 0), rm: armor.rm, price: armor.preis }).toEqual(feasible[0]);
    }
  }, 15000);
});
