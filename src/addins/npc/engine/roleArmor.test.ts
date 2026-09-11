import { describe, expect, it } from 'vitest';
import { NPC_TEMPLATES, getNpcRoleArmor } from '../data/npcTemplates';
import { createNpcPreview, inspectNpc } from './npcCreation';
import { renderNpcWizard } from '../views/npcCreation';

describe('Rüstung nach Beruf und Kampfstil', () => {
  it.each([
    ['bauer', 'handwerker'], ['schuetze', 'handwerker'], ['wachmann', 'wache-zeughaus'],
    ['nahkaempfer', 'nahkaempfer-lederpanzer'], ['hauptmann', 'nahkaempfer-lederpanzer'], ['ki', 'nahkaempfer-lederpanzer'],
  ])('ordnet %s dem Paket %s zu und verwendet dieselbe Berechnung', (id, packageId) => {
    const before = JSON.stringify(NPC_TEMPLATES);
    expect(getNpcRoleArmor(id).packageId).toBe(packageId);
    const automatic = createNpcPreview(id, '', '', 'auto');
    const manual = createNpcPreview(id, '', '', packageId);
    expect(automatic.ruestungSlots).toEqual(manual.ruestungSlots);
    expect(automatic.values).toEqual(manual.values);
    expect(inspectNpc(automatic)).toEqual(inspectNpc(manual));
    expect(JSON.stringify(NPC_TEMPLATES)).toBe(before);
  });

  it('deckt im Fernkampf alle Zonen mit Stoff und Leder ab und ergänzt Kopfschutz nur auf Wunsch', () => {
    const basic = createNpcPreview('schuetze', '', '', 'auto');
    expect(Object.keys(basic.ruestungSlots).sort()).toEqual(['arme:1', 'arme:2', 'beine:1', 'beine:2', 'kopf:1', 'kopf:2', 'torso:1', 'torso:2']);
    const helmet = createNpcPreview('schuetze', '', '', 'auto', true);
    expect(Object.keys(helmet.ruestungSlots)).toHaveLength(9);
    expect(helmet.ruestungSlots['kopf:4']).toBeDefined();
  });

  it('lässt Finanzierungslücken bestehen und sperrt das Anlegen in der Vorschau', () => {
    const automatic = createNpcPreview('bauer', '', '', 'auto');
    expect(inspectNpc(automatic).issues.length).toBeGreaterThan(0);
    const html = renderNpcWizard({ step: 3, role: 'Zivilist', templateId: 'bauer', name: 'Bauer', age: '', armorPackageId: 'auto' });
    expect(html).toContain('Diese Auswahl kann noch nicht angelegt werden');
    expect(html).toContain('type="submit" disabled');
    expect(html).toContain('Handwerker – Stoff und Leder vollständig');
  });

  it('zeigt die passende Erklärung nach einem Variantenwechsel und erhält manuelle Pakete', () => {
    const state = { step: 2, role: 'Räuber', templateId: 'schuetze', name: 'Test', age: '', armorPackageId: 'auto' };
    expect(renderNpcWizard(state)).toContain('Fernkampfprofession:');
    state.templateId = 'nahkaempfer';
    expect(renderNpcWizard(state)).toContain('Nahkampfschwerpunkt:');
    expect(createNpcPreview('nahkaempfer', '', '', 'stoff').ruestungSlots['torso:4']).toBeUndefined();
    expect(() => getNpcRoleArmor('unbekannt')).toThrow();
  });
});


it('akzeptiert bis zu 3 KBE und stattet die einfache Wache ohne Anpassung aus', () => {
  const candidate = createNpcPreview('wachmann', '', '', 'auto');
  const result = inspectNpc(candidate);
  expect(result.armor.maxBe).toBe(3);
  expect(result.armor.be).toBeGreaterThan(0);
  expect(result.armor.be).toBeLessThanOrEqual(3);
  expect(result.issues).toEqual([]);
  expect(candidate.ruestungSlots['torso:4'].basisSourceRow).toBe(16);
  for (const part of Object.values(candidate.ruestungSlots)) expect(part.anpassungSourceRow).toBe(3);
  const html = renderNpcWizard({ step: 2, role: 'Wache', templateId: 'wachmann', name: 'Wache', age: '', armorPackageId: 'auto' });
  expect(html).not.toMatch(/name="automaticArmor" checked/);
  const slot = candidate.ruestungSlots['torso:4'];
  slot.computedStatsSnapshot.rh += 18 + result.armor.attributeContribution + result.armor.rm - result.armor.rh;
  expect(inspectNpc(candidate).armor.rbe).toBeCloseTo(3);
  expect(inspectNpc(candidate).issues.some((issue) => issue.includes('BE statt'))).toBe(false);
  slot.computedStatsSnapshot.rh += 0.001;
  expect(inspectNpc(candidate).issues.some((issue) => issue.includes('BE statt höchstens 3'))).toBe(true);
});
