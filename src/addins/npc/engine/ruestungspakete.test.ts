import { describe, expect, it } from 'vitest';
import { NPC_TEMPLATES } from '../data/npcTemplates';
import { createNpcPreview, inspectNpc } from './npcCreation';

describe('Rüstungspakete und individuelle Fertigung/Anpassung', () => {
  it('liefert das vollständige Nahkämpferpaket ohne Budgetänderung oder neue Talente', () => {
    const original = JSON.stringify(NPC_TEMPLATES);
    const before = createNpcPreview('nahkaempfer', 'Test', '');
    const candidate = createNpcPreview('nahkaempfer', 'Test', '', 'nahkaempfer-lederpanzer');
    const result = inspectNpc(candidate);
    expect(result.issues).toEqual([]);
    expect(result.armor).toMatchObject({ preis: 1132, rh: 22, be: 0, rbe: 0, minimumRm: 13, rm: 14 });
    expect(candidate.values.dublonen_bank).toBe(before.values.dublonen_bank);
    expect(candidate.selections).toEqual(before.selections);
    expect(result.sheet.spRemaining).toBe(0);
    expect(result.sheet.dublonenRemaining).toBeGreaterThan(364);
    expect(Object.keys(candidate.ruestungSlots)).toHaveLength(11);
    expect(JSON.stringify(NPC_TEMPLATES)).toBe(original);
  });

  it('zeigt die Finanzierungslücke des Handwerkers trotz mathematisch erreichter Null-RBE', () => {
    const result = inspectNpc(createNpcPreview('bauer', '', '', 'handwerker'));
    expect(result.armor).toMatchObject({ rbe: 0, rm: 4, preis: 240 });
    expect(result.sheet.spRemaining).toBe(-9);
    expect(result.sheet.dublonenRemaining).toBeCloseTo(-114.2018);
    expect(result.issues.some((issue) => issue.startsWith('SP-Budget'))).toBe(true);
  });

  it('tauscht an genau einer Lederzone 12 D gegen einen RM-Punkt, ohne den Schutz zu senken', () => {
    const before = inspectNpc(createNpcPreview('bauer', '', '', 'handwerker-stange'));
    const after = inspectNpc(createNpcPreview('bauer', '', '', 'handwerker-stange', false, {
      'torso:2': { verarbeitungSourceRow: 2, anpassungSourceRow: 4 },
    }));
    expect(before.armor).toMatchObject({ preis: 192, rm: 8, rh: 16 });
    expect(after.armor).toMatchObject({ preis: 204, rm: 7, rh: 15, rbe: 0 });
    expect(after.armor.zonen).toEqual(before.armor.zonen);
    expect(after.sheet.spSpent - before.sheet.spSpent).toBe(-9);
    expect(after.sheet.dublonenSpent - before.sheet.dublonenSpent).toBe(12);
  });

  it('berechnet Fertigung und Anpassung gemeinsam und beachtet die Lage-Untergrenze', () => {
    const result = inspectNpc(createNpcPreview('bauer', '', '', 'handwerker', false, {
      'kopf:1': { verarbeitungSourceRow: 3, anpassungSourceRow: 4 },
    }));
    // Meisterarbeit + angepasst: 16 Material + 65 * (1+2) = 211 statt 22 D; RH bleibt 1.
    expect(result.armor).toMatchObject({ preis: 429, rh: 12, rm: 4 });
    expect(result.armor.zonen.find((zone) => zone.zone === 'kopf')!.rs).toBe(5);
  });

  it('weist beim Kopfpanzer auf die fehlende Talentfreischaltung hin', () => {
    const result = inspectNpc(createNpcPreview('nahkaempfer', '', '', 'nahkaempfer-lederpanzer', true));
    expect(result.armor).toMatchObject({ rm: 17, maximumRm: 16, rbe: 0 });
    expect(result.issues.some((issue) => issue.includes('Maximum 16'))).toBe(true);
  });

  it('berücksichtigt die Verfügbarkeit individueller Anpassung in der Neuen Welt', () => {
    const result = inspectNpc(createNpcPreview('bauer', '', '', 'handwerker', false, {
      'torso:2': { verarbeitungSourceRow: 2, anpassungSourceRow: 5 },
    }));
    expect(result.issues).toContain('Rüstung: Teile sind am Herkunftsort nicht regulär kaufbar.');
  });

  it('lehnt unbekannte Pakete und Änderungen an nicht belegten Plätzen ab', () => {
    expect(() => createNpcPreview('bauer', '', '', 'unbekannt')).toThrow('Rüstungspaket');
    expect(() => createNpcPreview('bauer', '', '', 'handwerker', false, {
      'torso:4': { verarbeitungSourceRow: 2, anpassungSourceRow: 3 },
    })).toThrow('nicht belegt');
  });
});
