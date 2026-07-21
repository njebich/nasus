// Religionen: feste Basisliste + vom Nutzer erweiterbare Sekten und komplett neue Religionen.
// Anders als charakterStore.ts NICHT pro Charakter, sondern global in localStorage abgelegt
// (Nutzer 2026-07-22, Grundlage fuer den kommenden Geweihte-Tab) - eine neu angelegte Sekte
// oder Religion soll allen Charakteren zur Auswahl stehen, nicht nur dem, bei dem sie entstand.

export interface Religion {
  id: string;
  name: string;
  volk?: string;
  sekten: string[];
}

// Volk-Werte folgen der Schreibweise aus engine/voelker.ts (VOELKER_NAMEN), nicht der
// Fantasy-Trope-Schreibweise ("Draw" statt "Drow"). Jede Basis-Religion startet mit der
// "Orthodox"-Sekte (Nutzer 2026-07-22) - die unmarkierte/traditionelle Ausrichtung, von der
// zukuenftige Abspaltungen abweichen.
const RELIGIONEN_BASIS: readonly Religion[] = [
  { id: 'lloth', name: 'Lloth', volk: 'Draw', sekten: ['Orthodox'] },
  { id: 'khartazh', name: 'Khartazh', volk: 'Orks', sekten: ['Orthodox'] },
  { id: 'nomna', name: 'Nomna', volk: 'Zwerge', sekten: ['Orthodox'] },
  { id: 'tepod', name: 'Tepod', volk: 'Elfen', sekten: ['Orthodox'] },
  { id: 'isch', name: 'Isch', volk: 'Goblins', sekten: ['Orthodox'] },
];

const STORAGE_KEY = 'nasus:religionen:custom';

interface CustomState {
  /** Vollstaendig neue, vom Nutzer angelegte Religionen (eigene sekten-Liste inklusive). */
  religionen: Religion[];
  /** Zusaetzliche Sekten je Religions-Id (auch fuer Basis-Religionen) - Key ist die Id. */
  sekten: Record<string, string[]>;
}

function readCustom(): CustomState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { religionen: [], sekten: {} };
  try {
    const parsed = JSON.parse(raw) as Partial<CustomState>;
    return { religionen: parsed.religionen ?? [], sekten: parsed.sekten ?? {} };
  } catch {
    return { religionen: [], sekten: {} };
  }
}

function writeCustom(state: CustomState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function slugify(name: string): string {
  return name.trim().toLowerCase()
    .replace(/[^a-z0-9äöüß]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'religion';
}

export function getReligionen(): Religion[] {
  const custom = readCustom();
  const mitSekten = (basis: Omit<Religion, 'sekten'>, eigeneSekten: string[]): Religion => ({
    ...basis,
    sekten: [...eigeneSekten, ...(custom.sekten[basis.id] ?? [])],
  });
  const basis = RELIGIONEN_BASIS.map((r) => mitSekten(r, r.sekten));
  const zusaetzlich = custom.religionen.map((r) => mitSekten(r, r.sekten));
  return [...basis, ...zusaetzlich];
}

export function findReligionByName(name: string): Religion | undefined {
  return getReligionen().find((r) => r.name.toLowerCase() === name.trim().toLowerCase());
}

export function addReligion(name: string, volk?: string): Religion {
  const trimmed = name.trim();
  const existing = findReligionByName(trimmed);
  if (existing) return existing;
  const custom = readCustom();
  let id = slugify(trimmed);
  const belegteIds = new Set([...RELIGIONEN_BASIS.map((r) => r.id), ...custom.religionen.map((r) => r.id)]);
  if (belegteIds.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 6)}`;
  const religion: Religion = { id, name: trimmed, volk: volk?.trim() || undefined, sekten: [] };
  custom.religionen.push(religion);
  writeCustom(custom);
  return religion;
}

export function addSekte(religionId: string, sekteName: string): string | undefined {
  const trimmed = sekteName.trim();
  if (!trimmed) return undefined;
  const religion = getReligionen().find((r) => r.id === religionId);
  if (!religion) return undefined;
  if (religion.sekten.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return trimmed;
  const custom = readCustom();
  custom.sekten[religionId] = [...(custom.sekten[religionId] ?? []), trimmed];
  writeCustom(custom);
  return trimmed;
}

/** Nur der Name - das Volk wird bewusst NICHT mehr angehaengt (Nutzer 2026-07-22), sondern
 *  nur noch als Tooltip (title-Attribut) auf dem jeweiligen UI-Element gezeigt. */
export function formatReligionLabel(religion: Pick<Religion, 'name'>): string {
  return religion.name;
}

/** CharacterHeader.religion traegt Religion UND Sekte als EIN Freitext-Feld (Nutzer 2026-07-22:
 *  "Sekte should add to the religion, not be new field") - gedruckt/gespeichert als
 *  "Lloth, Käsequark". combineReligionSekte/parseReligionSekte sind die einzige Stelle, die
 *  dieses Format kennen muss. */
export function combineReligionSekte(religionName: string, sekteName?: string): string {
  return sekteName ? `${religionName}, ${sekteName}` : religionName;
}

export function parseReligionSekte(value: string): { religionName: string; sekteName?: string } {
  const trenner = value.indexOf(', ');
  if (trenner === -1) return { religionName: value };
  return { religionName: value.slice(0, trenner), sekteName: value.slice(trenner + 2) };
}
