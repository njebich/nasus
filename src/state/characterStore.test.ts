import { describe, it, expect } from 'vitest';
import { createCharacter, loadCharacter, STARTBUDGET_PRESETS, getLastActiveCharacterId, setLastActiveCharacterId } from './characterStore';
import { updateHeader } from './characterMutations';
import { computeSheet } from '../engine/characterSheet';

describe('createCharacter mit Charakterheader + Startbudget', () => {
  it('legt einen Charakter mit vollem Header an', () => {
    const character = createCharacter('Grimjaw', {
      spezies: 'Ork', beruf: 'Söldner', heimat: 'Steppenreich',
    }, 'normal');
    expect(character.name).toBe('Grimjaw');
    expect(character.spezies).toBe('Ork');
    expect(character.beruf).toBe('Söldner');
    expect(character.heimat).toBe('Steppenreich');
    expect(character.alter).toBeUndefined();
  });

  it('Startbudget normal: EP=0 (Stufe 0), SP automatisch 6490+0=6490, 5000 Dublonen', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' }, 'normal');
    expect(character.values['ep_gesamt']).toBe(STARTBUDGET_PRESETS.normal.epGesamt);
    expect(character.values['ep_gesamt']).toBe(0);
    expect(character.values['dublonen_bank']).toBe(5000);
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(0);
    expect(sheet.spTotal).toBe(6490); // SP = 6490 + EP, NICHT SP = EP
    expect(sheet.dublonenTotal).toBe(5000);
  });

  it('Startbudget gehoben: EP=1600 (Stufe 15), SP automatisch 6490+1600=8090, 6000 Dublonen', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' }, 'gehoben');
    expect(character.values['ep_gesamt']).toBe(1600);
    expect(character.values['dublonen_bank']).toBe(6000);
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(1600);
    expect(sheet.spTotal).toBe(8090);
  });

  it('ohne Startbudget bleiben ep_gesamt/dublonen_bank ungesetzt (0)', () => {
    const character = createCharacter('Test');
    expect(character.values['ep_gesamt']).toBeUndefined();
    expect(character.spezies).toBe('');
  });

  it('"Durchschnittscharakter" (Nutzer 2026-07-17): Startbudget fuellt alle Eigenschaften=10, Glueck=1 vor', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' }, 'normal');
    for (const ref of [
      'eig_g_intelligenz', 'eig_g_mut', 'eig_g_sinneschaerfe', 'eig_g_willenskraft',
      'eig_k_athletik', 'eig_k_ausstrahlung', 'eig_k_geschicklichkeit', 'eig_k_konstitution',
      'eig_k_schnelligkeit', 'eig_k_staerke',
    ]) {
      expect(character.values[ref]).toBe(10);
    }
    expect(character.values['att_glueck']).toBe(1);
    // 10 Eigenschaften a 300 SP (Wert 10 in der Kosten-Tabelle) + Glueck=1 (100 SP seit werte
    // 0.8: Attribut-Kosten-Formel von 10*wert^2+70*wert auf 80+wert*20 geaendert) = 3100 SP.
    const sheet = computeSheet(character);
    expect(sheet.spSpent).toBe(3100);
    expect(sheet.spRemaining).toBe(6490 - 3100);
  });

  it('ohne Startbudget bleibt der Durchschnittscharakter-Ausgangswert aus (reine Test-Fixtures bleiben leer)', () => {
    const character = createCharacter('Test');
    expect(character.values['eig_g_mut']).toBeUndefined();
    expect(character.values['att_glueck']).toBeUndefined();
  });

  it('bei einer bekannten Spezies (werte 0.8 "Voelker-Maxima") fuellt der Durchschnittscharakter das Erstellungs-Min statt pauschal 10', () => {
    const character = createCharacter('Test', { spezies: 'Dalkini' }, 'normal');
    // Dalkini: Willenskraft Erstellungs-Min=15, Staerke Erstellungs-Min=11 (beide != 10)
    expect(character.values['eig_g_willenskraft']).toBe(15);
    expect(character.values['eig_k_staerke']).toBe(11);
  });
});

describe('loadCharacter Migrations-Fallback (Regression 2026-07-17: ruestungSlots-Feld neu, alte localStorage-Charaktere hatten es nicht)', () => {
  it('ergaenzt ein fehlendes ruestungSlots-Feld beim Laden statt beim naechsten computeSheet zu werfen', () => {
    const id = 'alt-charakter-vor-ruestungslots';
    const ohneRuestungSlots = {
      id, name: 'Alt', spezies: 'Mensch', createdAt: '', updatedAt: '',
      values: {}, selections: {}, poolAllocations: {}, equipment: [],
      // kein ruestungSlots-Feld - so sahen gespeicherte Charaktere vor diesem Feature aus.
    };
    localStorage.setItem(`nasus:character:${id}`, JSON.stringify(ohneRuestungSlots));
    const loaded = loadCharacter(id);
    expect(loaded?.ruestungSlots).toEqual({});
    expect(() => computeSheet(loaded!)).not.toThrow();
  });

  it('migriert alte Angst-Referenzen und behaelt pro Thema nur die hoechste Stufe', () => {
    const id = 'alt-charakter-vor-angstnummern';
    const alterCharakter = {
      id, name: 'Alt', spezies: 'Mensch', createdAt: '', updatedAt: '',
      values: {},
      selections: {
        vn_unbehagen_magie: 1,
        vn_phobie_magie: 1,
        vn_furcht_wasser: 1,
      },
      poolAllocations: {}, equipment: [], ruestungSlots: {},
    };
    localStorage.setItem(`nasus:character:${id}`, JSON.stringify(alterCharakter));

    const loaded = loadCharacter(id);
    expect(loaded?.selections).toEqual({
      vn_angst_magie_30: 1,
      vn_angst_wasser_15: 1,
    });
  });
});

describe('zuletzt aktiver Charakter (Regression: Seiten-Reload faellt sonst auf leere Auswahl zurueck)', () => {
  it('ist anfangs nicht gesetzt', () => {
    expect(getLastActiveCharacterId()).toBeNull();
  });

  it('merkt sich eine gesetzte ID und kann sie wieder loeschen', () => {
    setLastActiveCharacterId('abc-123');
    expect(getLastActiveCharacterId()).toBe('abc-123');
    setLastActiveCharacterId(null);
    expect(getLastActiveCharacterId()).toBeNull();
  });
});

describe('updateHeader', () => {
  it('aktualisiert Header-Felder ohne Budget-Pruefung', () => {
    const character = createCharacter('Test', { spezies: 'Elf' });
    const updated = updateHeader(character, { beruf: 'Magier', alter: '120' });
    expect(updated.beruf).toBe('Magier');
    expect(updated.alter).toBe('120');
    expect(updated.spezies).toBe('Elf'); // unveraendert
  });
});
