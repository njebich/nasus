import { describe, expect, it } from 'vitest';
import { createNpcPreview as previewWithTarget, inspectNpc } from './npcCreation';
import { optimizeNpcArmor } from './armorOptimization';
import { applyNpcArmorPackage } from './ruestungspakete';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../../../data/equipment/armor';

describe('Automatische Rüstungswahl', () => {
  it('findet eine gemischte Anpassung, wenn weder alles von der Stange noch alles angepasst passt', () => {
    const candidate = createNpcPreview('bauer', '', '', 'handwerker-stange');
    // Kontrolliertes Budget: höchstens RM 7 und genau 204 D für die Rüstung.
    candidate.values.ep_gesamt += 31; // Die korrigierte Referenz hat bereits 5 SP frei.
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


describe('Automatische Basisteile', () => {
  it('entspricht bei freier Materialwahl der vollständigen Aufzählung und bleibt reproduzierbar', () => {
    const candidate = createNpcPreview('nahkaempfer', '', '', 'nahkaempfer-lederpanzer');
    candidate.ruestungSlots = { 'torso:4': candidate.ruestungSlots['torso:4'] };
    const before = JSON.stringify(candidate);
    const feasible: Array<{ rs: number; rm: number; price: number }> = [];
    for (const basis of RUESTUNG_BASIS.filter((row) => Number(row.Lage) === 4)) {
      for (const v of RUESTUNG_VERARBEITUNG) for (const a of RUESTUNG_ANPASSUNG) {
        const c = applyNpcArmorPackage(candidate, '', false, { 'torso:4': {
          basisSourceRow: basis.sourceRow, verarbeitungSourceRow: v.sourceRow, anpassungSourceRow: a.sourceRow,
        } });
        const { armor, issues } = inspectNpc(c);
        if (issues.length || c.ruestungSlots['torso:4'].computedStatsSnapshot.rs < candidate.ruestungSlots['torso:4'].computedStatsSnapshot.rs) continue;
        feasible.push({ rs: armor.zonen.reduce((sum, zone) => sum + zone.rs, 0), rm: armor.rm, price: armor.preis });
      }
    }
    expect(feasible.length).toBeGreaterThan(0);
    for (const mode of ['schutz', 'sparsam'] as const) {
      feasible.sort((a, b) => mode === 'schutz' ? b.rs - a.rs || a.rm - b.rm || a.price - b.price : a.price - b.price || a.rm - b.rm || b.rs - a.rs);
      const result = optimizeNpcArmor(candidate, candidate.values.sf_ruestungsmanoever, mode, true);
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const { armor, issues } = inspectNpc(result.character);
      expect(issues).toEqual([]);
      expect({ rs: armor.zonen.reduce((sum, zone) => sum + zone.rs, 0), rm: armor.rm, price: armor.preis }).toEqual(feasible[0]);
      expect(applyNpcArmorPackage(candidate, '', false, result.overrides).ruestungSlots).toEqual(result.character.ruestungSlots);
      expect(Object.keys(result.character.ruestungSlots)).toEqual(['torso:4']);
    }
    expect(JSON.stringify(candidate)).toBe(before);
    expect(() => applyNpcArmorPackage(candidate, '', false, { 'torso:4': {
      basisSourceRow: 2, verarbeitungSourceRow: 2, anpassungSourceRow: 3,
    } })).toThrow();
  });

  it('prüft ein vollständiges Paket mit freier Basisteilwahl', () => {
    const candidate = createNpcPreview('nahkaempfer', '', '', 'nahkaempfer-lederpanzer');
    const result = optimizeNpcArmor(candidate, 14, 'schutz', true);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(inspectNpc(result.character).issues).toEqual([]);
    expect(inspectNpc(result.character).armor.rbe).toBe(0);
    expect(result.character.selections).toEqual(candidate.selections);
  }, 15000);
});


it('vergleicht für Vollrüstung auch schwächere Materialien, hält aber die Anpassung ein', () => {
  const candidate = createNpcPreview('ki', '', '', 'vollgeruestet');
  candidate.ruestungSlots = { 'torso:4': candidate.ruestungSlots['torso:4'] };
  const result = optimizeNpcArmor(candidate, candidate.values.sf_ruestungsmanoever, 'sparsam', true, true);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  const slot = result.character.ruestungSlots['torso:4'];
  expect([4, 5]).toContain(slot.anpassungSourceRow);
  expect(slot.basisSourceRow).toBe(14); // Lederpanzer ist als günstigste Alternative erlaubt.
  expect(result.character.values.eig_k_staerke).toBe(candidate.values.eig_k_staerke);
  expect(inspectNpc(result.character).issues).toEqual([]);
});

function createNpcPreview(...args: Parameters<typeof previewWithTarget>) {
  return previewWithTarget(args[0], args[1], args[2], args[3], args[4], args[5], args[3] === 'vollgeruestet' ? 1 : 0);
}
