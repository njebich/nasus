import { beforeEach, describe, expect, it } from 'vitest';
import { GESINNUNG_TRAITS } from '../data/gesinnung';
import { createCharacter } from './characterStore';
import {
  CharacterFileError, characterFileName, createCharacterCheckpoint, getCharacterSaveDocument,
  parseCharacterFile, serializeCharacterFile,
} from './characterFile';

function makeValidCharacter(name = 'Test', type: 'SC' | 'NSC' = 'SC') {
  const character = createCharacter(name, { spezies: 'Mensch' }, undefined, false, type);
  character.values.ssk_sprache_zwergisch = 4;
  character.values.ssk_sprache_drow = 1;
  for (const trait of GESINNUNG_TRAITS) character.gesinnung[trait.key] = 0;
  return character;
}

describe('portable Nasus-Charakterdatei', () => {
  beforeEach(() => localStorage.clear());

  it('erzwingt bei jedem Speicherpunkt einen nichtleeren Vermerk', () => {
    const character = makeValidCharacter();
    expect(() => createCharacterCheckpoint(character, '   ')).toThrow(CharacterFileError);
    expect(getCharacterSaveDocument(character.id)).toBeNull();
  });

  it('verweigert einen regelwidrigen Speicherstand auch ohne vom Aufrufer gelieferte Fehler', () => {
    const character = createCharacter('Unfertig');
    expect(() => createCharacterCheckpoint(character, 'Noch nicht fertig'))
      .toThrow(/nicht regelkonform/);
    expect(getCharacterSaveDocument(character.id)).toBeNull();
  });

  it('legt genau eine Revision pro Speichern an und berechnet EP- und Dublonenzuwachs', () => {
    const character = makeValidCharacter();
    character.values.ep_gesamt = 100;
    character.values.dublonen_bank = 50;
    const first = createCharacterCheckpoint(character, 'Erster Stand', [], new Date('2026-08-24T10:00:00Z'));

    character.values.ep_gesamt = 250;
    character.values.dublonen_bank = 75;
    character.notes = 'Nach Sitzung 2';
    const second = createCharacterCheckpoint(character, 'Sitzung 2', [], new Date('2026-08-24T12:00:00Z'));

    expect(first.history).toHaveLength(1);
    expect(second.history).toHaveLength(2);
    expect(second.history[1].note).toBe('Sitzung 2');
    expect(second.history[1].changes.experience).toEqual({ before: 100, after: 250, delta: 150 });
    expect(second.history[1].changes.currency.funds).toEqual({ before: 50, after: 75, delta: 25 });
    expect(second.history[1].changes.values).toContainEqual({
      reference: 'ep_gesamt', before: 100, after: 250,
    });
    expect(second.history[1].changes.sections).toContain('Notizen');
    expect(second.history[1].previousRevisionId).toBe(first.latestRevisionId);
  });

  it('kennzeichnet NSC für Foundry als npc und übersteht den JSON-Roundtrip', () => {
    const character = makeValidCharacter('Stadtwache Ährenfurt', 'NSC');
    const saved = createCharacterCheckpoint(character, 'Einsatzbereit');
    const parsed = parseCharacterFile(serializeCharacterFile(saved));

    expect(parsed.foundry).toEqual({ systemId: 'nasus', actorType: 'npc' });
    expect(parsed.character.charakterTyp).toBe('NSC');
    expect(parsed.history[0].snapshot.name).toBe('Stadtwache Ährenfurt');
    expect(characterFileName(character)).toBe('Stadtwache-Ahrenfurt.nasus.json');
  });

  it('lädt den kurzzeitig erzeugbaren v1-Export eines Altdaten-Charakters ohne charakterTyp', () => {
    const saved = createCharacterCheckpoint(makeValidCharacter('Alter SC'), 'Vor der Migration');
    const legacy = JSON.parse(serializeCharacterFile(saved)) as Record<string, any>;
    delete legacy.character.charakterTyp;
    delete legacy.history[0].snapshot.charakterTyp;
    legacy.foundry.actorType = 'npc'; // so wurde das fehlende Feld im fehlerhaften Export abgebildet

    const migrated = parseCharacterFile(JSON.stringify(legacy));

    expect(migrated.character.charakterTyp).toBe('SC');
    expect(migrated.character.selections.vn_kind_der_froehlichkeit).toBe(1);
    expect(migrated.history[0].snapshot.charakterTyp).toBe('SC');
    expect(migrated.foundry.actorType).toBe('pc');
  });

  it('lehnt fremde und beschädigte Dateien kontrolliert ab', () => {
    expect(() => parseCharacterFile('{kaputt')).toThrow(/kein gültiges JSON/);
    expect(() => parseCharacterFile('{"format":"anderes"}')).toThrow(/keine Nasus-Charakterdatei/);
  });
});
