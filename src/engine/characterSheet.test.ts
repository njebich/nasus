import { describe, it, expect } from 'vitest';
import { computeSheet } from './characterSheet';
import { createCharacter } from '../state/characterStore';

// createCharacter() speichert in localStorage - im Test-Environment (happy-dom, via
// vitest.config.ts) ist das verfuegbar; wir nutzen nur die zurueckgegebene In-Memory-Instanz.

describe('computeSheet', () => {
  it('SP = 6490 + EP fuer einen frischen Charakter (ep_gesamt=0 -> SP=6490, feste Konstante in der Formel)', () => {
    const character = createCharacter('Test');
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(0);
    expect(sheet.spTotal).toBe(6490);
    expect(sheet.spSpent).toBe(0);
    expect(sheet.spRemaining).toBe(6490);
  });

  it('spTotal = 6490 + ep_gesamt, NICHT spTotal = ep_gesamt (mit Nutzer 2026-07-17 korrigiert)', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 1000;
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(1000);
    expect(sheet.spTotal).toBe(7490);
    expect(sheet.spRemaining).toBe(7490);
  });

  it('berechnet SP-Kosten fuer eine gesetzte Eigenschaft ueber SVERWEIS', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 1000;
    character.values['eig_g_mut'] = 5;
    const sheet = computeSheet(character);
    const mutRule = sheet.byKategorie['Eigenschaft']?.find((r) => r.rule.referenz === 'eig_g_mut');
    expect(mutRule?.currentValue).toBe(5);
    expect(mutRule?.kostenCurrent).toBe(150);
    expect(sheet.spSpent).toBe(150);
    expect(sheet.spRemaining).toBe(7340); // spTotal(6490+1000=7490) - 150
  });

  it('Talente kosten TaP, NICHT SP - komplett getrennter Pool (mit Nutzer 2026-07-17 geklaert)', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 1000; // SP-Budget, sollte von Talente-Kauf unberuehrt bleiben
    character.selections['talente_alchemieresistenz_stufe_1'] = 1; // Kosten laut Daten: 2
    const sheet = computeSheet(character);
    expect(sheet.spSpent).toBe(0); // Talente-Kosten duerfen NICHT ins SP-Budget einfliessen
    expect(sheet.tapSpent).toBe(2);
  });

  it('tapTotal = 20 + Stufe*5 (Referenz "talentpunkte", neu ergaenzt)', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 1600; // EP-Stufe-Kreis: 1600 -> Stufe 15
    const sheet = computeSheet(character);
    expect(sheet.tapTotal).toBe(20 + 15 * 5); // 95
  });

  it('epNaechsteStufeAb zeigt die "EP ab"-Schwelle der naechsten Stufe (Nutzer 2026-07-17)', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 1600; // Stufe 15, naechste Schwelle laut EP-Stufe-Kreis: 1750 (Stufe 16)
    const sheet = computeSheet(character);
    expect(sheet.epNaechsteStufeAb).toBe(1750);
  });

  it('epNaechsteStufeAb ist undefined auf der hoechsten Stufe', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 999999;
    const sheet = computeSheet(character);
    expect(sheet.epNaechsteStufeAb).toBeUndefined();
  });

  it('dublonenTotal ist die Summe aus dublonen_bank und dublonen_bar', () => {
    const character = createCharacter('Test');
    character.values['dublonen_bank'] = 3000;
    character.values['dublonen_bar'] = 500;
    const sheet = computeSheet(character);
    expect(sheet.dublonenTotal).toBe(3500);
  });

  describe('dublonenBarRemaining/dublonenBankRemaining (Regel Nutzer 2026-07-17: Kaeufe ziehen erst vom Bargeld, dann von der Bank ab)', () => {
    function withPurchase(bar: number, bank: number, preis: number) {
      const character = createCharacter('Test');
      character.values['dublonen_bar'] = bar;
      character.values['dublonen_bank'] = bank;
      character.equipment = [{
        id: 'test-1', family: 'preisliste', baseTable: 'preisliste', baseId: '1',
        selections: {}, quantity: 1, computedPriceSnapshot: preis,
      }];
      return character;
    }

    it('Kauf unter dem Bargeld-Betrag: nur bar sinkt, Bank bleibt unangetastet', () => {
      const sheet = computeSheet(withPurchase(500, 3000, 200));
      expect(sheet.dublonenBarRemaining).toBe(300);
      expect(sheet.dublonenBankRemaining).toBe(3000);
    });

    it('Kauf ueberschreitet das Bargeld: bar auf 0, Ueberschuss geht von der Bank ab', () => {
      const sheet = computeSheet(withPurchase(500, 3000, 800));
      expect(sheet.dublonenBarRemaining).toBe(0);
      expect(sheet.dublonenBankRemaining).toBe(2700); // 3000 - (800-500)
    });

    it('kein Bargeld vorhanden (Standardfall): Kauf geht komplett von der Bank ab', () => {
      const sheet = computeSheet(withPurchase(0, 5000, 227));
      expect(sheet.dublonenBarRemaining).toBe(0);
      expect(sheet.dublonenBankRemaining).toBe(4773);
    });
  });

  it('berechnet Formel-Werte live aus den aktuellen character.values', () => {
    const character = createCharacter('Test');
    character.values['eig_g_mut'] = 10;
    character.values['eig_k_athletik'] = 8;
    character.values['nk_hiebwaffen'] = 12;
    const sheet = computeSheet(character);
    const atHieb = sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === 'at_hiebwaffen');
    expect(atHieb?.computedValue).toBe(10);
  });

  it('markiert bekannte kaputte/unvollstaendige Formeln mit error statt zu crashen', () => {
    // gewichtsbelastung wertet seit 2026-07-17 fest zu 0 aus (siehe rules.test.ts), daher hier
    // stattdessen eine echte FEHLT-Platzhalter-Zeile als Regression-Beispiel.
    const character = createCharacter('Test');
    const sheet = computeSheet(character);
    const leiter = sheet.byKategorie['Bewegung']?.find((r) => r.rule.referenz === 'bewegung_f_leiter_steigen_schnell');
    expect(leiter?.error).toBeDefined();
  });

  it('Art=Fixwert zeigt rohen Referenztext, ist kein Spielerwert und kostet keine SP', () => {
    const character = createCharacter('Test');
    const sheet = computeSheet(character);
    const marschieren = sheet.byKategorie['Bewegung']?.find((r) => r.rule.referenz === 'bewegung_fix_marschieren');
    expect(marschieren?.fixedText).toBe('1,5 m/s');
    expect(marschieren?.currentValue).toBeUndefined();
    expect(sheet.spSpent).toBe(0);
  });

  it('Art=Formel in Bewegung wird live berechnet (Hochsprung)', () => {
    const character = createCharacter('Test');
    character.values['eig_k_staerke'] = 10;
    character.values['eig_k_schnelligkeit'] = 10;
    character.values['gr_springen'] = 20;
    const sheet = computeSheet(character);
    const hochsprung = sheet.byKategorie['Bewegung']?.find((r) => r.rule.referenz === 'bewegung_f_hochsprung');
    expect(hochsprung?.computedValue).toBe(1); // (10+10+20)/40 = 1
  });

  it('rundet berechnete Formel-Werte immer auf ganze Zahlen auf (bestaetigte Spielregel)', () => {
    const character = createCharacter('Test');
    character.values['eig_k_staerke'] = 5;
    character.values['eig_k_schnelligkeit'] = 5;
    character.values['gr_springen'] = 5;
    const sheet = computeSheet(character);
    const hochsprung = sheet.byKategorie['Bewegung']?.find((r) => r.rule.referenz === 'bewegung_f_hochsprung');
    // (5+5+5)/40 = 0.375 -> aufgerundet = 1
    expect(hochsprung?.computedValue).toBe(1);
  });
});
