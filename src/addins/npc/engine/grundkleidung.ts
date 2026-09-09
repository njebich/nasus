import grundkleidung from '../data/grundkleidung.json';
import { PREISLISTE } from '../../../data/equipment/preisliste';
import type { CharacterState } from '../../../state/characterStore';

/** Ergänzt ausschließlich fehlende Alltagskleidung in der unabhängigen NPC-Vorschau. */
export function ergaenzeGrundkleidung(character: CharacterState): number {
  let addedCost = 0;
  const vorhandeneKleidung = character.equipment
    .filter((entry) => entry.family === 'preisliste' && entry.quantity > 0)
    .map((entry) => PREISLISTE.find((row) => String(row.sourceRow) === entry.baseId))
    .filter((row) => row?.art === 'Kleidung & Schuhwerk');
  for (const slot of grundkleidung) {
    const pattern = new RegExp(slot.erkennt);
    if (vorhandeneKleidung.some((row) => pattern.test(row?.name ?? ''))) continue;
    const row = PREISLISTE.find((item) => item.sourceRow === slot.sourceRow);
    if (!row?.preisAvailable || row.preisDublonen === undefined) {
      throw new Error(`Grundkleidung fehlt im Katalog: ${slot.bereich}`);
    }
    character.equipment.push({
      id: crypto.randomUUID(), family: 'preisliste', baseTable: 'preisliste',
      baseId: String(row.sourceRow), displayNameSnapshot: row.name,
      selections: {}, quantity: 1, computedPriceSnapshot: row.preisDublonen,
    });
    vorhandeneKleidung.push(row);
    addedCost += row.preisDublonen;
  }
  return addedCost;
}
