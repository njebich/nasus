import { describe, it, expect } from 'vitest';
import { computeSheet } from './characterSheet';
import { createCharacter } from '../state/characterStore';
import { GESINNUNG_TRAITS } from '../data/gesinnung';

// createCharacter() speichert in localStorage - im Test-Environment (happy-dom, via
// vitest.config.ts) ist das verfuegbar; wir nutzen nur die zurueckgegebene In-Memory-Instanz.

describe('computeSheet', () => {
  it('wendet den Blindheitsrabatt nur auf Blinder Kampf I an', () => {
    const normal = createCharacter('Normal');
    const normalRow = computeSheet(normal).byKategorie['Vor- und Nachteile']
      .find((row) => row.rule.referenz === 'vn_sicht_blinder_kampf_i');
    expect(normalRow?.kostenSelect).toBe(150);

    const blind = createCharacter('Blind');
    blind.selections.vn_sicht_blindheit = 1;
    const blindRows = computeSheet(blind).byKategorie['Vor- und Nachteile'];
    expect(blindRows.find((row) => row.rule.referenz === 'vn_sicht_blinder_kampf_i')?.kostenSelect).toBe(75);
    expect(blindRows.find((row) => row.rule.referenz === 'vn_sicht_blinder_kampf_2')?.kostenSelect).toBe(25);
  });

  it('SP = 6400 + EP fuer einen frischen Charakter (ep_gesamt=0 -> SP=6400, feste Konstante in der Formel)', () => {
    const character = createCharacter('Test');
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(0);
    expect(sheet.spTotal).toBe(6400);
    expect(sheet.spSpent).toBe(0);
    expect(sheet.spRemaining).toBe(6400);
  });

  it('spTotal = 6400 + ep_gesamt, NICHT spTotal = ep_gesamt', () => {
    const character = createCharacter('Test');
    character.values['ep_gesamt'] = 1000;
    const sheet = computeSheet(character);
    expect(sheet.epGesamt).toBe(1000);
    expect(sheet.spTotal).toBe(7400);
    expect(sheet.spRemaining).toBe(7400);
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
    expect(sheet.spRemaining).toBe(7250); // spTotal(6400+1000=7400) - 150
  });

  describe('SSK-Mindestinvestment', () => {
    it('macht Muttersprache und Vaterland nicht einzeln zu harten Anforderungen', () => {
      const character = createCharacter('Test');
      character.values['ssk_sprache_zwergisch'] = 4; // 75 SP, keine Muttersprache-Stufe 3
      character.values['ssk_sprache_drow'] = 1; // weitere 15 SP, keine Kultur

      const sheet = computeSheet(character);

      expect(sheet.sskSpent).toBe(90);
      expect(sheet.sskMinimumMet).toBe(true);
      expect(sheet.sskLanguageMinimumMet).toBe(true);
    });

    it('markiert einen Charakter unter 90 SSK-SP als noch nicht gueltig', () => {
      const character = createCharacter('Test');
      character.values['ssk_sprache_zwergisch'] = 3; // Muttersprache, aber nur 50 SP
      character.values['ssk_kultur_zwerge'] = 2; // 25 SP, zusammen 75 SP

      const sheet = computeSheet(character);

      expect(sheet.sskSpent).toBe(75);
      expect(sheet.sskMinimumMet).toBe(false);
    });

    it('zeigt keinen Fehler auf einer SSK-Zeile, die bereits auf Stufe 4 (Maximum) steht', () => {
      // Regression: kostenNext wurde immer fuer currentValue+1 berechnet, auch am oberen Ende
      // der Sprachstufe-Kosten-Tabelle (nur Stufen 0-4) - der Wurf bei Stufe 5 landete faelschlich
      // in result.error statt (wie kostenPrev) stillschweigend zu scheitern.
      const character = createCharacter('Test');
      character.values['ssk_sprache_zwergisch'] = 4;

      const sheet = computeSheet(character);
      const row = sheet.byKategorie['Sprache & Kultur']?.find((r) => r.rule.referenz === 'ssk_sprache_zwergisch');

      expect(row?.currentValue).toBe(4);
      expect(row?.error).toBeUndefined();
      expect(row?.kostenNext).toBeUndefined();
    });

    it('verlangt auch bei mindestens 90 SSK-SP wenigstens eine Sprache auf Stufe 1+', () => {
      const character = createCharacter('Test');
      character.values['ssk_kultur_zwerge'] = 4;
      character.values['ssk_kultur_elfen'] = 4; // zusammen 110 SP, aber keine Sprache

      const sheet = computeSheet(character);

      expect(sheet.sskMinimumMet).toBe(true);
      expect(sheet.sskLanguageMinimumMet).toBe(false);
      expect(sheet.validationIssues).toContainEqual({
        source: 'SSK › Sprachen', message: 'keine Sprache auf Stufe 1 oder höher',
      });
    });
  });

  describe('Gesinnung-Vollstaendigkeit (S09 Gesinnung.docx: Charakter erst gueltig, wenn alle 22 Slider gesetzt sind)', () => {
    it('meldet ein validationIssue, solange nicht alle 22 Gesinnung-Slider gesetzt sind', () => {
      const character = createCharacter('Test');
      const sheet = computeSheet(character);
      expect(sheet.validationIssues).toContainEqual({
        source: 'Gesinnung', message: 'nur 0 von 22 Charakterzügen gesetzt',
      });
    });

    it('meldet kein Gesinnung-validationIssue mehr, sobald alle 22 Slider gesetzt sind (auch auf 0/Neutral)', () => {
      const character = createCharacter('Test');
      for (const trait of GESINNUNG_TRAITS) character.gesinnung[trait.key] = 0;
      const sheet = computeSheet(character);
      expect(sheet.validationIssues.some((issue) => issue.source === 'Gesinnung')).toBe(false);
    });
  });

  describe('Nahkampf-/Fernkampf-TaW-Kosten (Nutzer-Bugreport 2026-07-24: Hauptfertigkeit und Spezialisierung zogen kein SP ab)', () => {
    it('Nahkampf-Hauptfertigkeit kostet 25 SP/Punkt (xlsx-Formel "wert*25")', () => {
      const character = createCharacter('Test');
      character.values['ep_gesamt'] = 1000;
      character.values['nk_hiebwaffen'] = 3;
      const sheet = computeSheet(character);
      const rule = sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === 'nk_hiebwaffen');
      expect(rule?.kostenCurrent).toBe(75);
      expect(sheet.spSpent).toBe(75);
    });

    it('Fernkampf-Hauptfertigkeit kostet 18 SP/Punkt (xlsx-Formel "wert*18")', () => {
      const character = createCharacter('Test');
      character.values['ep_gesamt'] = 1000;
      character.values['fk_boegen'] = 2;
      const sheet = computeSheet(character);
      const rule = sheet.byKategorie['Fernkampf']?.find((r) => r.rule.referenz === 'fk_boegen');
      expect(rule?.kostenCurrent).toBe(36);
      expect(sheet.spSpent).toBe(36);
    });

    it('Nahkampf-Spezialisierung: die erste investierte Geschwister-Spezialisierung kostet 15 SP/Punkt, die zweite 8, alle weiteren 4 (engine/waffenSpezKosten.ts)', () => {
      const character = createCharacter('Test');
      character.values['ep_gesamt'] = 1000;
      character.values['nk_hiebwaffen'] = 5;
      character.values['nk_spez_hiebwaffen_aexte'] = 2; // hoechster Wert -> Rang 0 -> 15/Punkt
      character.values['nk_spez_hiebwaffen_kettenwaffen'] = 1; // Rang 1 -> 8/Punkt
      character.values['nk_spez_hiebwaffen_stumpfe_hiebwaffen'] = 1; // Rang 2+ -> 4/Punkt
      const sheet = computeSheet(character);
      const byRef = (ref: string) => sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === ref);
      expect(byRef('nk_spez_hiebwaffen_aexte')?.kostenCurrent).toBe(2 * 15);
      expect(byRef('nk_spez_hiebwaffen_kettenwaffen')?.kostenCurrent).toBe(1 * 8);
      expect(byRef('nk_spez_hiebwaffen_stumpfe_hiebwaffen')?.kostenCurrent).toBe(1 * 4);
    });

    it('Fernkampf-Spezialisierung kostet 10/5/3 SP/Punkt je Investitions-Rang', () => {
      const character = createCharacter('Test');
      character.values['ep_gesamt'] = 1000;
      character.values['fk_feuerwaffen'] = 5;
      character.values['fk_spez_feuerwaffen_pistolen'] = 3; // Rang 0 -> 10/Punkt
      const sheet = computeSheet(character);
      const rule = sheet.byKategorie['Fernkampf']?.find((r) => r.rule.referenz === 'fk_spez_feuerwaffen_pistolen');
      expect(rule?.kostenCurrent).toBe(3 * 10);
    });
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
    // Hochsprung ist eine Ausnahme von dieser generellen Regel (rundet auf 0,25, siehe Test
    // unten) - Weitsprung testet hier stellvertretend die generelle Ganzzahl-Aufrundung.
    const weitsprung = sheet.byKategorie['Bewegung']?.find((r) => r.rule.referenz === 'bewegung_f_weitsprung_aus_dem_stand');
    // (5+5+5)/13+1 = 2,1538... -> aufgerundet = 3
    expect(weitsprung?.computedValue).toBe(3);
  });

  it('Hochsprung rundet abweichend auf 0,25 auf statt auf ganze Zahlen (Nutzer-Ask)', () => {
    const character = createCharacter('Test');
    character.values['eig_k_staerke'] = 5;
    character.values['eig_k_schnelligkeit'] = 5;
    character.values['gr_springen'] = 5;
    const sheet = computeSheet(character);
    const hochsprung = sheet.byKategorie['Bewegung']?.find((r) => r.rule.referenz === 'bewegung_f_hochsprung');
    // (5+5+5)/40 = 0.375 -> auf 0,25 aufgerundet = 0.5
    expect(hochsprung?.computedValue).toBe(0.5);
  });

  describe('Talent-Modifikator (Nutzer 2026-07-18, Talente-Wirkung-Analyse: Zaeher Bursche addiert auf Selbstbeherrschung/Gesundheit/Trefferschwelle)', () => {
    function findCharakterwert(sheet: ReturnType<typeof computeSheet>, referenz: string) {
      return sheet.byKategorie['Charakterwerte']?.find((r) => r.rule.referenz === referenz)?.computedValue;
    }

    it('ohne Talent bleiben Selbstbeherrschung/Gesundheit/Trefferschwelle unveraendert', () => {
      const character = createCharacter('Test');
      const sheet = computeSheet(character);
      expect(findCharakterwert(sheet, 'selbstbeherrschung')).toBe(12); // (0+0+0+0+0)/7+0+12
      expect(findCharakterwert(sheet, 'gesundheit')).toBe(0);
      expect(findCharakterwert(sheet, 'trefferschwelle')).toBe(5); // 0+5
    });

    it('Zaeher Bursche Stufe 1 addiert +1 Selbstbeherrschung und +2 Gesundheit', () => {
      const character = createCharacter('Test');
      character.selections['talente_zaeher_bursche_stufe_1'] = 1;
      const sheet = computeSheet(character);
      expect(findCharakterwert(sheet, 'selbstbeherrschung')).toBe(13);
      expect(findCharakterwert(sheet, 'gesundheit')).toBe(2);
      expect(findCharakterwert(sheet, 'trefferschwelle')).toBe(5); // Stufe 1 wirkt nicht auf Trefferschwelle
    });

    it('mehrere Stufen gleichzeitig gewaehlt: nur die hoechste zaehlt, kein Aufaddieren (Stufe 1+2, Nutzer 2026-07-18 zweite Runde)', () => {
      const character = createCharacter('Test');
      character.selections['talente_zaeher_bursche_stufe_1'] = 1;
      character.selections['talente_zaeher_bursche_stufe_2'] = 1;
      const sheet = computeSheet(character);
      expect(findCharakterwert(sheet, 'selbstbeherrschung')).toBe(12 + 3); // nur Stufe 2s +3, nicht +1+3
      expect(findCharakterwert(sheet, 'gesundheit')).toBe(4); // nur Stufe 2s +4, nicht +2+4
      expect(findCharakterwert(sheet, 'trefferschwelle')).toBe(5 + 1); // nur Stufe 2 wirkt hier ueberhaupt
    });
  });

  describe('Talent-Faktor (Nutzer 2026-07-18 zweite Runde: Mana Regeneration Stufe 1/2 x1,5/x2,0 auf mana_regeneration_pro_stunde = att_aura*2)', () => {
    function findCharakterwert(sheet: ReturnType<typeof computeSheet>, referenz: string) {
      return sheet.byKategorie['Charakterwerte']?.find((r) => r.rule.referenz === referenz)?.computedValue;
    }

    it('ohne Talent: reine Basisformel att_aura*2', () => {
      const character = createCharacter('Test');
      character.values['att_aura'] = 5;
      const sheet = computeSheet(character);
      expect(findCharakterwert(sheet, 'mana_regeneration_pro_stunde')).toBe(10);
    });

    it('Stufe 1 multipliziert mit 1,5', () => {
      const character = createCharacter('Test');
      character.values['att_aura'] = 5;
      character.selections['talente_mana_regeneration_stufe_1'] = 1;
      const sheet = computeSheet(character);
      expect(findCharakterwert(sheet, 'mana_regeneration_pro_stunde')).toBe(15); // 5*2=10, *1.5=15
    });

    it('Stufe 2 multipliziert mit 2,0, beide Stufen gleichzeitig geben nur x2,0 (nicht x3,0)', () => {
      const character = createCharacter('Test');
      character.values['att_aura'] = 5;
      character.selections['talente_mana_regeneration_stufe_1'] = 1;
      character.selections['talente_mana_regeneration_stufe_2'] = 1;
      const sheet = computeSheet(character);
      expect(findCharakterwert(sheet, 'mana_regeneration_pro_stunde')).toBe(20); // 5*2=10, *2.0=20
    });
  });
});
