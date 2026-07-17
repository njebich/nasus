import { describe, it, expect } from 'vitest';
import { createCharacter, STARTBUDGET_PRESETS, getLastActiveCharacterId, setLastActiveCharacterId } from './characterStore';
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

  it('Startbudget normal: EP=0 (Stufe 0), SP automatisch 6400+0=6400, 5000 Dublonen', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' }, 'normal');
    expect(character.values['ep_gesamt']).toBe(STARTBUDGET_PRESETS.normal.epGesamt);
    expect(character.values['ep_gesamt']).toBe(0);
    expect(character.values['dublonen_bank']).toBe(5000);
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(0);
    expect(sheet.spTotal).toBe(6400); // SP = 6400 + EP, NICHT SP = EP
    expect(sheet.dublonenTotal).toBe(5000);
  });

  it('Startbudget gehoben: EP=1600 (Stufe 15), SP automatisch 6400+1600=8000, 6000 Dublonen', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' }, 'gehoben');
    expect(character.values['ep_gesamt']).toBe(1600);
    expect(character.values['dublonen_bank']).toBe(6000);
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(1600);
    expect(sheet.spTotal).toBe(8000);
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
    // 10 Eigenschaften a 300 SP (Wert 10 in der Kosten-Tabelle) + Glueck=1 (80 SP) = 3080 SP.
    const sheet = computeSheet(character);
    expect(sheet.spSpent).toBe(3080);
    expect(sheet.spRemaining).toBe(6400 - 3080);
  });

  it('ohne Startbudget bleibt der Durchschnittscharakter-Ausgangswert aus (reine Test-Fixtures bleiben leer)', () => {
    const character = createCharacter('Test');
    expect(character.values['eig_g_mut']).toBeUndefined();
    expect(character.values['att_glueck']).toBeUndefined();
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
