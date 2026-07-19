import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import { buyPreislisteItem, buyArtefakt, buyFeuerwaffe, removeEquipment, BudgetError, MutationError } from './characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { FEUERWAFFEN } from '../data/equipment/fernkampf';
import { composeFeuerwaffe, feuerwaffenStandardauswahl } from '../engine/feuerwaffenComposition';

function withDublonen(bank: number) {
  const character = createCharacter('Test');
  character.values['dublonen_bank'] = bank;
  return character;
}

describe('buyPreislisteItem', () => {
  const purchasableRow = PREISLISTE.find((r) => r.preisAvailable && (r.preisDublonen ?? 0) > 0)!;

  it('kauft einen Preisliste-Eintrag und zieht Dublonen vom Budget ab', () => {
    const character = withDublonen(purchasableRow.preisDublonen! * 2);
    const updated = buyPreislisteItem(character, purchasableRow.sourceRow, 1);
    expect(updated.equipment).toHaveLength(1);
    const sheet = computeSheet(updated);
    expect(sheet.dublonenSpent).toBe(purchasableRow.preisDublonen);
  });

  it('lehnt einen Kauf ab, wenn nicht genug Dublonen vorhanden sind', () => {
    const character = withDublonen(0);
    expect(() => buyPreislisteItem(character, purchasableRow.sourceRow, 1)).toThrow(BudgetError);
  });

  it('lehnt einen Kauf ohne hinterlegten Preis ab (Sentinel-Zeile)', () => {
    const unavailableRow = PREISLISTE.find((r) => !r.preisAvailable)!;
    const character = withDublonen(1000000);
    expect(() => buyPreislisteItem(character, unavailableRow.sourceRow, 1)).toThrow(MutationError);
  });
});

describe('buyArtefakt', () => {
  const kostenRow = ARTEFAKT_KOSTEN.find((r) => r.kostenEinmalig)!;

  it('kauft ein Artefakt (einmalig) und zieht den einmaligen Preis ab', () => {
    const price = Number(kostenRow.kostenEinmalig);
    const character = withDublonen(price);
    const updated = buyArtefakt(character, kostenRow.referenz, kostenRow.grad!, 'einmalig');
    const sheet = computeSheet(updated);
    expect(sheet.dublonenSpent).toBe(price);
  });

  it('removeEquipment entfernt den Kauf wieder und das Budget erholt sich', () => {
    const price = Number(kostenRow.kostenEinmalig);
    const character = withDublonen(price);
    const updated = buyArtefakt(character, kostenRow.referenz, kostenRow.grad!, 'einmalig');
    const removed = removeEquipment(updated, updated.equipment[0].id);
    expect(computeSheet(removed).dublonenSpent).toBe(0);
  });
});

describe('buyFeuerwaffe', () => {
  const muskete = FEUERWAFFEN.find((row) => row.name === 'Muskete')!;
  const auswahl = feuerwaffenStandardauswahl(muskete);
  const composed = composeFeuerwaffe(muskete, auswahl);

  it('speichert die vier Komponenten und belastet das Dublonenbudget mit dem komponierten Preis', () => {
    const updated = buyFeuerwaffe(withDublonen(1000), muskete.sourceRow, auswahl);
    expect(updated.equipment[0]).toMatchObject({
      family: 'feuerwaffe', baseTable: 'feuerwaffen', computedPriceSnapshot: composed.preisDublonen,
      selections: {
        bauart: String(auswahl.bauartSourceRow), lademechanik: String(auswahl.lademechanikSourceRow),
        schloss: String(auswahl.schlossSourceRow), lauf: String(auswahl.laufSourceRow),
      },
    });
    expect(computeSheet(updated).dublonenSpent).toBe(composed.preisDublonen);
  });

  it('wendet die einheitliche Kaufsperre ab Verfuegbarkeit 5 auch auf Feuerwaffen an', () => {
    const hakenbuechse = FEUERWAFFEN.find((row) => row.name === 'Hakenbüchse')!;
    expect(() => buyFeuerwaffe(withDublonen(10000), hakenbuechse.sourceRow, feuerwaffenStandardauswahl(hakenbuechse)))
      .toThrow(MutationError);
  });
});
