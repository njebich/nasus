import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import { setValue, addSelection, removeSelection, BudgetError, MutationError } from './characterMutations';
import { computeSheet } from '../engine/characterSheet';

function withEpGesamt(epGesamt: number) {
  const character = createCharacter('Test');
  character.values['ep_gesamt'] = epGesamt;
  return character;
}

describe('characterMutations', () => {
  it('setValue erhoeht einen Wert, wenn genug SP vorhanden sind', () => {
    const character = withEpGesamt(1000);
    const updated = setValue(character, 'eig_g_mut', 5);
    expect(updated.values['eig_g_mut']).toBe(5);
  });

  it('setValue lehnt ab, wenn nicht genug SP vorhanden sind', () => {
    // SP = 6490 + ep_gesamt (feste Konstante in der Formel) - selbst bei ep_gesamt=0 hat man
    // also 6490 SP, und eine einzelne Eigenschaft kostet maximal 6213 (Wert 64, Tabellenende) -
    // daher zwei Eigenschaften kombinieren, um das Budget sicher zu ueberschreiten.
    const character = withEpGesamt(0);
    const afterFirst = setValue(character, 'eig_g_mut', 64); // kostet 6213 von 6490 SP
    expect(() => setValue(afterFirst, 'eig_k_athletik', 10)).toThrow(BudgetError); // weitere 300 SP -> ueber Budget
  });

  it('setValue lehnt eine unbekannte Referenz ab', () => {
    const character = withEpGesamt(1000);
    expect(() => setValue(character, 'does_not_exist', 1)).toThrow(MutationError);
  });

  it('setValue lehnt eine Formel-Referenz ab (nicht direkt setzbar)', () => {
    const character = withEpGesamt(1000);
    expect(() => setValue(character, 'at_hiebwaffen', 5)).toThrow(MutationError);
  });

  it('addSelection/removeSelection schalten eine Auswahl an/aus (Talente kosten TaP, nicht SP)', () => {
    const character = withEpGesamt(0); // ep_gesamt=0 -> Stufe 0 -> TaP-Budget = 20+0*5 = 20
    const rule = 'talente_zaeher_bursche_stufe_1'; // Kosten: 16 TaP
    const withSelection = addSelection(character, rule);
    expect(withSelection.selections[rule]).toBe(1);
    const withoutSelection = removeSelection(withSelection, rule);
    expect(withoutSelection.selections[rule]).toBeUndefined();
  });

  it('addSelection lehnt ein Talent ab, wenn nicht genug TaP vorhanden sind', () => {
    const character = withEpGesamt(0); // TaP-Budget bei Stufe 0 = 20
    // talente_schnell_zaubern_stufe_1 kostet 85 TaP - deutlich mehr als das Minimalbudget.
    expect(() => addSelection(character, 'talente_schnell_zaubern_stufe_1')).toThrow(BudgetError);
  });

  it('ein Nachteil (negative Kosten) erhoeht das verfuegbare SP-Budget statt es zu verringern', () => {
    const character = withEpGesamt(0);
    // vn_leicht_anfaelligkeit_gegen_alchemie hat Kosten=-20 -> gibt 20 SP zurueck
    const updated = addSelection(character, 'vn_leicht_anfaelligkeit_gegen_alchemie');
    expect(updated.selections['vn_leicht_anfaelligkeit_gegen_alchemie']).toBe(1);
    // Mit den so gewonnenen 20 SP sollte jetzt z.B. eine Grundfertigkeit (9 SP/Punkt) kaufbar sein
    const withSkill = setValue(updated, 'gr_klettern', 2);
    expect(withSkill.values['gr_klettern']).toBe(2);
  });

  describe('ssk_sprache_*/ssk_kultur_* (Regel Nutzer 2026-07-17: keine Freibetrag-Ausnahme mehr, SP-Basis stattdessen erhoeht)', () => {
    it('Muttersprache (Stufe 3) kostet ganz normal 50 SP, keine Ausnahme', () => {
      const character = withEpGesamt(0);
      const updated = setValue(character, 'ssk_sprache_zwergisch', 3);
      expect(updated.values['ssk_sprache_zwergisch']).toBe(3);
      const sheet = computeSheet(updated);
      expect(sheet.spSpent).toBe(50);
    });

    it('Kultur (Stufe 3, "Vaterland") kostet ganz normal 40 SP', () => {
      const character = withEpGesamt(0);
      const updated = setValue(character, 'ssk_kultur_zwerge', 3);
      const sheet = computeSheet(updated);
      expect(sheet.spSpent).toBe(40);
    });

    it('Muttersprache + Kultur zusammen kosten 90 SP - genau der Betrag, um den die SP-Basis erhoeht wurde', () => {
      const character = withEpGesamt(0);
      const mitSprache = setValue(character, 'ssk_sprache_zwergisch', 3);
      const mitBeidem = setValue(mitSprache, 'ssk_kultur_zwerge', 3);
      const sheet = computeSheet(mitBeidem);
      expect(sheet.spSpent).toBe(90);
      expect(sheet.spRemaining).toBe(6490 - 90);
    });
  });

  describe('Spezialisierung <= TaW der Hauptfertigkeit (Regel Nutzer 2026-07-17)', () => {
    it('lehnt eine Spezialisierung ab, solange die Hauptfertigkeit 0 ist', () => {
      const character = withEpGesamt(1000);
      expect(() => setValue(character, 'nk_spez_hiebwaffen_aexte', 1)).toThrow(MutationError);
    });

    it('erlaubt die Spezialisierung bis maximal zum TaW der Hauptfertigkeit', () => {
      const character = withEpGesamt(1000);
      const withHaupt = setValue(character, 'nk_hiebwaffen', 5);
      const withSpez = setValue(withHaupt, 'nk_spez_hiebwaffen_aexte', 5);
      expect(withSpez.values['nk_spez_hiebwaffen_aexte']).toBe(5);
    });

    it('lehnt eine Spezialisierung ueber dem TaW der Hauptfertigkeit ab', () => {
      const character = withEpGesamt(1000);
      const withHaupt = setValue(character, 'nk_hiebwaffen', 5);
      expect(() => setValue(withHaupt, 'nk_spez_hiebwaffen_aexte', 6)).toThrow(MutationError);
    });

    it('Hauptfertigkeiten selbst sind vom Deckel unberuehrt (haben kein Parent-Feld)', () => {
      const character = withEpGesamt(1000);
      const updated = setValue(character, 'nk_hiebwaffen', 20);
      expect(updated.values['nk_hiebwaffen']).toBe(20);
    });
  });

  describe('Eigenschaften-Min/Max je Spezies (Regel Nutzer 2026-07-17, werte 0.8 / "Voelker-Maxima")', () => {
    function withSpezies(spezies: string, epGesamt: number) {
      const character = createCharacter('Test', { spezies });
      character.values['ep_gesamt'] = epGesamt;
      return character;
    }

    it('erlaubt einen Wert innerhalb von Erstellungs-Min/-Max (Dalkini/Staerke: 11-23)', () => {
      const character = withSpezies('Dalkini', 500); // ep_gesamt=500 -> Kreis 2
      const updated = setValue(character, 'eig_k_staerke', 15);
      expect(updated.values['eig_k_staerke']).toBe(15);
    });

    it('lehnt einen Wert unterhalb des Erstellungs-Min ab', () => {
      const character = withSpezies('Dalkini', 500);
      expect(() => setValue(character, 'eig_k_staerke', 10)).toThrow(MutationError);
    });

    it('lehnt einen Wert oberhalb des Erstellungs-Max ab, solange Kreis < 3', () => {
      const character = withSpezies('Dalkini', 500); // ep_gesamt=500 -> Kreis 2 (< 3)
      expect(() => setValue(character, 'eig_k_staerke', 24)).toThrow(MutationError);
    });

    it('erlaubt bis zu 31 ("Max ab Kreis 3"), sobald der Charakter Kreis 3 erreicht hat', () => {
      const character = withSpezies('Dalkini', 1600); // ep_gesamt=1600 -> Stufe 15 -> Kreis 3
      const updated = setValue(character, 'eig_k_staerke', 31);
      expect(updated.values['eig_k_staerke']).toBe(31);
      expect(() => setValue(character, 'eig_k_staerke', 32)).toThrow(MutationError);
    });

    it('unbekannte Spezies bleibt uneingeschraenkt (z.B. leere Test-Fixtures)', () => {
      const character = withEpGesamt(1000); // spezies='' (kein Header angegeben)
      const updated = setValue(character, 'eig_k_staerke', 60);
      expect(updated.values['eig_k_staerke']).toBe(60);
    });
  });

  describe('Fertigkeitsmaximum (Nutzer 2026-07-18, Talente-Wirkung-Analyse): Basis-Max je Kategorie + Talent-Boni', () => {
    it('lehnt einen Wert oberhalb des Basis-Max fuer Sonderfertigkeit (12) ab', () => {
      const character = withEpGesamt(1000);
      expect(() => setValue(character, 'sf_alchemieresistenz', 13)).toThrow(MutationError);
      const updated = setValue(character, 'sf_alchemieresistenz', 12);
      expect(updated.values['sf_alchemieresistenz']).toBe(12);
    });

    it('erlaubt einen hoeheren Wert, wenn das passende Maximum-Talent gewaehlt ist (Alchemieresistenz Stufe 1 -> sf_alchemieresistenz +6)', () => {
      let character = withEpGesamt(1000);
      character.selections['talente_alchemieresistenz_stufe_1'] = 1;
      const updated = setValue(character, 'sf_alchemieresistenz', 18);
      expect(updated.values['sf_alchemieresistenz']).toBe(18);
      expect(() => setValue(updated, 'sf_alchemieresistenz', 19)).toThrow(MutationError);
    });

    it('Basis-Max fuer Nahkampf/Fernkampf/WHK/Spruchmagie ist 24, fuer Attribute 7', () => {
      const character = withEpGesamt(1000);
      expect(() => setValue(character, 'fk_boegen', 25)).toThrow(MutationError);
      expect(setValue(character, 'fk_boegen', 24).values['fk_boegen']).toBe(24);
      expect(() => setValue(character, 'att_aura', 8)).toThrow(MutationError);
      expect(setValue(character, 'att_aura', 7).values['att_aura']).toBe(7);
    });

    it('Kategorie-weites Talent (Grundfertigkeiten Stufe 1) erhoeht das Maximum JEDER Grundfertigkeit um 2', () => {
      let character = withEpGesamt(1000);
      character.selections['talente_grundfertigkeiten_stufe_1'] = 1;
      expect(setValue(character, 'gr_klettern', 14).values['gr_klettern']).toBe(14);
      expect(() => setValue(character, 'gr_klettern', 15)).toThrow(MutationError);
      // Sonderfertigkeit ist nicht betroffen (nur Grundfertigkeit-Kategorie)
      expect(() => setValue(character, 'sf_ausweichen', 14)).toThrow(MutationError);
    });

    it('Zauberschul-Talent (Magus Feuerbeschwoerung Stufe 1) erhoeht das Maximum aller Feuerbeschwoerung-Zauber um 6', () => {
      let character = withEpGesamt(1000);
      character.selections['talente_magus_stufe_1_feuerbeschwoerungs_magus'] = 1;
      const updated = setValue(character, 'spruchmagie_feuerbeschwoerung_1_flammenwand', 30);
      expect(updated.values['spruchmagie_feuerbeschwoerung_1_flammenwand']).toBe(30);
      // andere Schule bleibt beim Basis-Max von 24
      expect(() => setValue(character, 'spruchmagie_wasserbeschwoerung_1_frostwand', 30)).toThrow(MutationError);
    });

    it('Basis-Max fuer KI/PSI ist 24 (Nutzer 2026-07-18, zweite Runde der Talente-Wirkung-Analyse), KI-Meister/PSI Psinetik erhoehen es kategorienweit', () => {
      const character = withEpGesamt(1000);
      expect(() => setValue(character, 'ki_regeneration', 25)).toThrow(MutationError);
      expect(setValue(character, 'ki_regeneration', 24).values['ki_regeneration']).toBe(24);
      expect(() => setValue(character, 'psi_telekinese', 25)).toThrow(MutationError);

      let mitKiMeister = withEpGesamt(1000);
      mitKiMeister.selections['talente_ki_meister'] = 1;
      expect(setValue(mitKiMeister, 'ki_regeneration', 42).values['ki_regeneration']).toBe(42);
      expect(() => setValue(mitKiMeister, 'ki_regeneration', 43)).toThrow(MutationError);
      // PSI bleibt von KI-Meister unberuehrt
      expect(() => setValue(mitKiMeister, 'psi_telekinese', 25)).toThrow(MutationError);

      let mitPsiPsinetik = withEpGesamt(1000);
      mitPsiPsinetik.selections['talente_psi_psinetik_stufe_1'] = 1;
      expect(setValue(mitPsiPsinetik, 'psi_telekinese', 30).values['psi_telekinese']).toBe(30);
      expect(() => setValue(mitPsiPsinetik, 'psi_telekinese', 31)).toThrow(MutationError);
    });

    it('manueller Override Vorderlader Ladeschuetze erhoeht sf_ladeschuetze_vorderlader', () => {
      let character = withEpGesamt(1000);
      character.selections['talente_vorderlader_ladeschuetze_stufe1'] = 1;
      expect(setValue(character, 'sf_ladeschuetze_vorderlader', 19).values['sf_ladeschuetze_vorderlader']).toBe(19);
      expect(() => setValue(character, 'sf_ladeschuetze_vorderlader', 20)).toThrow(MutationError);
    });
  });
});
