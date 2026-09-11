// Lokale Persistenz fuer selbst angelegte Orte (Spec 04-Verfuegbarkeiten-und-Herkunftsorte.md,
// Abschnitt "Lokale Persistenz"): VORDEFINIERTE_ORTE bleiben Client-Konstanten, neu angelegte
// oder geaenderte Orte werden global in localStorage abgelegt - global statt pro Charakter, wie
// religionStore.ts (ein neu angelegter Ort soll bei der naechsten Charaktererschaffung ebenfalls
// zur Auswahl stehen, nicht nur beim Charakter, bei dem er entstand). Abweichend vom Spec-Vorschlag
// (getrennte nasus:location(-index)/nasus:location:<id>-Keys) genuegt hier EIN Key mit einer
// Liste, analog zu religionStore.ts - fachlich aequivalent, weniger Code.

import { VORDEFINIERTE_ORTE, assertValidOrt, createOrt, type Ort } from '../data/orte';

const STORAGE_KEY = 'nasus:orte:custom';

function readCustom(): Ort[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Ort[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustom(orte: Ort[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orte));
}

/** Vordefinierte + alle selbst angelegten Orte, vordefinierte zuerst. */
export function listOrte(): Ort[] {
  return [...VORDEFINIERTE_ORTE, ...readCustom()];
}

export function getOrtById(id: string | undefined): Ort | undefined {
  if (!id) return undefined;
  return listOrte().find((ort) => ort.id === id);
}

/** Legt einen neuen Ort an UND speichert ihn dauerhaft (im Unterschied zu createOrt() aus
 *  data/orte.ts, das den Ort nur im Speicher baut/validiert). */
export function createAndSaveOrt(input: Omit<Ort, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Ort {
  const ort = createOrt(input);
  const custom = readCustom();
  custom.push(ort);
  writeCustom(custom);
  return ort;
}

/** Aktualisiert einen zuvor selbst angelegten Ort. Vordefinierte Orte sind schreibgeschuetzt. */
export function updateOrt(ort: Ort): Ort {
  const custom = readCustom();
  const index = custom.findIndex((existing) => existing.id === ort.id);
  if (index === -1) {
    throw new Error(`Ort '${ort.id}' ist kein selbst angelegter, bearbeitbarer Ort`);
  }
  const validated = assertValidOrt({ ...ort, aktualisiertAm: new Date().toISOString() });
  custom[index] = validated;
  writeCustom(custom);
  return validated;
}
