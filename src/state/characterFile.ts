import { computeSheet, type CharacterValidationIssue } from '../engine/characterSheet';
import { restoreCharacterSnapshot, type CharacterState } from './characterStore';

export const NASUS_CHARACTER_FORMAT = 'nasus-character' as const;
export const NASUS_CHARACTER_SCHEMA_VERSION = 1 as const;
export const NASUS_RULESET_VERSION = '0.8' as const;

const SAVE_DOCUMENT_KEY_PREFIX = 'nasus:save-document:';

export interface NumberChange {
  before: number | null;
  after: number;
  delta: number | null;
}

export interface ValueChange {
  reference: string;
  before: number | null;
  after: number | null;
}

export interface SavedCharacterChanges {
  experience: NumberChange;
  currency: {
    funds: NumberChange;
    spent: NumberChange;
    remaining: NumberChange;
  };
  values: ValueChange[];
  /** Geaenderte Bereiche ausserhalb der reinen Werte-Map, fuer eine kompakte History-Anzeige. */
  sections: string[];
}

export interface CharacterRevision {
  revisionId: string;
  previousRevisionId: string | null;
  savedAt: string;
  note: string;
  changes: SavedCharacterChanges;
  /** Vollstaendiger Zustand erlaubt Wiederherstellung ohne fragile Patch-Ketten. */
  snapshot: CharacterState;
}

export interface NasusCharacterFile {
  format: typeof NASUS_CHARACTER_FORMAT;
  schemaVersion: typeof NASUS_CHARACTER_SCHEMA_VERSION;
  rulesetVersion: string;
  exportedAt: string;
  latestRevisionId: string;
  foundry: {
    systemId: 'nasus';
    actorType: 'pc' | 'npc';
  };
  character: CharacterState;
  history: CharacterRevision[];
}

export class CharacterFileError extends Error {}

function cloneCharacter(character: CharacterState): CharacterState {
  return JSON.parse(JSON.stringify(character)) as CharacterState;
}

function numberChange(before: number | null, after: number): NumberChange {
  return { before, after, delta: before === null ? null : after - before };
}

function recordValueChanges(
  previous: Record<string, number> | undefined,
  current: Record<string, number>,
): ValueChange[] {
  const references = new Set([...Object.keys(previous ?? {}), ...Object.keys(current)]);
  return [...references]
    .sort((a, b) => a.localeCompare(b))
    .flatMap((reference) => {
      const before = previous?.[reference] ?? null;
      const after = current[reference] ?? null;
      return before === after ? [] : [{ reference, before, after }];
    });
}

const SECTION_FIELDS: Array<{ label: string; key: keyof CharacterState }> = [
  { label: 'Grunddaten', key: 'name' },
  { label: 'Grunddaten', key: 'spezies' },
  { label: 'Grunddaten', key: 'charakterTyp' },
  { label: 'Grunddaten', key: 'herkunftSnapshot' },
  { label: 'Grunddaten', key: 'beruf' },
  { label: 'Grunddaten', key: 'religion' },
  { label: 'Auswahlen', key: 'selections' },
  { label: 'Poolverteilungen', key: 'poolAllocations' },
  { label: 'Inventar', key: 'equipment' },
  { label: 'Rüstung', key: 'ruestungSlots' },
  { label: 'Grundfertigkeitsauswahl', key: 'grundfertigkeitAuswahl' },
  { label: 'Waffen-Loadouts', key: 'waffenLoadouts' },
  { label: 'Eigene WHK', key: 'customWhkHauptfertigkeiten' },
  { label: 'Eigene WHK', key: 'customWhkSpezialisierungen' },
  { label: 'Gesinnung', key: 'gesinnung' },
  { label: 'Gesinnung', key: 'gesinnungNotiz' },
  { label: 'Notizen', key: 'notes' },
];

function changedSections(previous: CharacterState | undefined, current: CharacterState): string[] {
  if (!previous) return ['Erster Speicherpunkt'];
  const sections = SECTION_FIELDS
    .filter(({ key }) => JSON.stringify(previous[key]) !== JSON.stringify(current[key]))
    .map(({ label }) => label);
  return [...new Set(sections)];
}

export function describeCharacterChanges(
  previous: CharacterState | undefined,
  current: CharacterState,
): SavedCharacterChanges {
  const currentSheet = computeSheet(current);
  const previousSheet = previous ? computeSheet(previous) : undefined;
  return {
    experience: numberChange(previousSheet?.epGesamt ?? null, currentSheet.epGesamt),
    currency: {
      funds: numberChange(previousSheet?.dublonenTotal ?? null, currentSheet.dublonenTotal),
      spent: numberChange(previousSheet?.dublonenSpent ?? null, currentSheet.dublonenSpent),
      remaining: numberChange(previousSheet?.dublonenRemaining ?? null, currentSheet.dublonenRemaining),
    },
    values: recordValueChanges(previous?.values, current.values),
    sections: changedSections(previous, current),
  };
}

function historyStorageKey(characterId: string): string {
  return `${SAVE_DOCUMENT_KEY_PREFIX}${characterId}`;
}

function readStoredDocument(characterId: string): NasusCharacterFile | null {
  const raw = localStorage.getItem(historyStorageKey(characterId));
  if (!raw) return null;
  try {
    return parseCharacterFile(raw);
  } catch {
    return null;
  }
}

export function getCharacterSaveDocument(characterId: string): NasusCharacterFile | null {
  return readStoredDocument(characterId);
}

export function createCharacterCheckpoint(
  character: CharacterState,
  noteRaw: string,
  additionalValidationIssues: readonly CharacterValidationIssue[] = [],
  now = new Date(),
): NasusCharacterFile {
  const note = noteRaw.trim();
  if (!note) throw new CharacterFileError('Für jeden Speicherpunkt ist ein Vermerk erforderlich.');
  const validationIssues = [...computeSheet(character).validationIssues, ...additionalValidationIssues]
    .filter((issue, index, issues) => issues.findIndex((candidate) => candidate.source === issue.source
      && candidate.message === issue.message) === index);
  if (validationIssues.length > 0) {
    throw new CharacterFileError(`Der Charakter ist nicht regelkonform:\n${validationIssues
      .map((issue) => `${issue.source}: ${issue.message}`).join('\n')}`);
  }

  const existing = readStoredDocument(character.id);
  const previousRevision = existing?.history[existing.history.length - 1];
  const snapshot = cloneCharacter(character);
  const savedAt = now.toISOString();
  const revision: CharacterRevision = {
    revisionId: crypto.randomUUID(),
    previousRevisionId: previousRevision?.revisionId ?? null,
    savedAt,
    note,
    changes: describeCharacterChanges(previousRevision?.snapshot, snapshot),
    snapshot,
  };
  const document: NasusCharacterFile = {
    format: NASUS_CHARACTER_FORMAT,
    schemaVersion: NASUS_CHARACTER_SCHEMA_VERSION,
    rulesetVersion: NASUS_RULESET_VERSION,
    exportedAt: savedAt,
    latestRevisionId: revision.revisionId,
    foundry: {
      systemId: 'nasus',
      actorType: character.charakterTyp === 'SC' ? 'pc' : 'npc',
    },
    character: cloneCharacter(snapshot),
    history: [...(existing?.history ?? []), revision],
  };
  localStorage.setItem(historyStorageKey(character.id), JSON.stringify(document));
  return document;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseCharacterFile(raw: string): NasusCharacterFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new CharacterFileError('Die Datei enthält kein gültiges JSON.');
  }
  if (!isRecord(parsed) || parsed.format !== NASUS_CHARACTER_FORMAT) {
    throw new CharacterFileError('Die Datei ist keine Nasus-Charakterdatei.');
  }
  if (parsed.schemaVersion !== NASUS_CHARACTER_SCHEMA_VERSION) {
    throw new CharacterFileError(`Nicht unterstützte Schemaversion: ${String(parsed.schemaVersion)}.`);
  }
  if (!isRecord(parsed.character) || typeof parsed.character.id !== 'string'
    || typeof parsed.character.name !== 'string'
    || (parsed.character.charakterTyp !== 'SC' && parsed.character.charakterTyp !== 'NSC')) {
    throw new CharacterFileError('Die Charakterdaten sind unvollständig oder ungültig.');
  }
  if (!Array.isArray(parsed.history) || parsed.history.length === 0
    || typeof parsed.latestRevisionId !== 'string') {
    throw new CharacterFileError('Die Datei enthält keinen gültigen Speicherverlauf.');
  }
  for (let index = 0; index < parsed.history.length; index += 1) {
    const revision = parsed.history[index];
    const expectedPrevious = index === 0 ? null : parsed.history[index - 1]?.revisionId;
    if (!isRecord(revision) || typeof revision.revisionId !== 'string'
      || typeof revision.savedAt !== 'string' || typeof revision.note !== 'string' || !revision.note.trim()
      || revision.previousRevisionId !== expectedPrevious || !isRecord(revision.snapshot)
      || revision.snapshot.id !== parsed.character.id) {
      throw new CharacterFileError(`History-Eintrag ${index + 1} ist ungültig.`);
    }
  }
  const latest = parsed.history[parsed.history.length - 1];
  if (!isRecord(latest) || latest.revisionId !== parsed.latestRevisionId
    || typeof latest.note !== 'string' || !latest.note.trim() || !isRecord(latest.snapshot)) {
    throw new CharacterFileError('Der letzte History-Eintrag ist ungültig.');
  }
  if (latest.snapshot.id !== parsed.character.id) {
    throw new CharacterFileError('History und Charakter gehören nicht zur selben Datei.');
  }
  return parsed as unknown as NasusCharacterFile;
}

/** Installiert eine bereits semantisch geprüfte Datei als aktuellen lokalen Charakter. */
export function installCharacterFile(document: NasusCharacterFile): CharacterState {
  const character = cloneCharacter(document.character);
  restoreCharacterSnapshot(character);
  localStorage.setItem(historyStorageKey(character.id), JSON.stringify(document));
  return character;
}

export function serializeCharacterFile(document: NasusCharacterFile): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}

export function characterFileName(character: CharacterState): string {
  const safeName = character.name.trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'charakter';
  return `${safeName}.nasus.json`;
}

export function downloadCharacterFile(document: NasusCharacterFile): void {
  const blob = new Blob([serializeCharacterFile(document)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = documentOwner().createElement('a');
  anchor.href = url;
  anchor.download = characterFileName(document.character);
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Kleine Indirektion vermeidet die Namenskollision zwischen Dateidokument und DOM-document. */
function documentOwner(): Document {
  return globalThis.document;
}
