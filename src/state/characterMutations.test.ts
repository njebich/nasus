import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import {
  setValue, addSelection, removeSelection, setWaffenPoolAllocation, buyWeapon, BudgetError, MutationError,
} from './characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';

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

  it('Angststufen desselben Themas sind exklusiv und eine neue Stufe ersetzt die alte', () => {
    const character = withEpGesamt(0);
    const withUnbehagen = addSelection(character, 'vn_angst_magie_5');
    expect(withUnbehagen.selections['vn_angst_magie_5']).toBe(1);

    const withPhobie = addSelection(withUnbehagen, 'vn_angst_magie_30');
    expect(withPhobie.selections['vn_angst_magie_5']).toBeUndefined();
    expect(withPhobie.selections['vn_angst_magie_30']).toBe(1);
  });

  it('Angststufen unterschiedlicher Themen koennen gleichzeitig gewaehlt werden', () => {
    const character = withEpGesamt(0);
    const withMagicFear = addSelection(character, 'vn_angst_magie_10');
    const withTwoFears = addSelection(withMagicFear, 'vn_angst_wasser_15');
    expect(withTwoFears.selections['vn_angst_magie_10']).toBe(1);
    expect(withTwoFears.selections['vn_angst_wasser_15']).toBe(1);
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

// Kampf-Tab (2026-07-20): Pool-Verteilung pro besessener Waffe statt einmal pro Skill - zwei
// Aexte teilen sich dasselbe Spezialisierungs-Budget (nk_pool_hiebwaffen_aexte), waehrend nAT/nPA
// pro Zeile gedeckelt bleiben.
describe('setWaffenPoolAllocation', () => {
  function findRow<T extends { name: string; sourceRow: number }>(rows: readonly T[], name: string): T {
    const row = rows.find((r) => r.name === name);
    if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
    return row;
  }

  // Axt: AT=-4, PA=-5 (Eisen/Gesellenarbeit/Von der Stange/Standard, siehe weaponComposition.test.ts).
  function characterWithZweiAexten(nkHiebwaffen: number) {
    let character = createCharacter('Test');
    character.values['ep_gesamt'] = 100000;
    character.values['dublonen_bank'] = 100000;
    character = setValue(character, 'eig_g_mut', 30);
    character = setValue(character, 'eig_k_athletik', 30);
    character = setValue(character, 'eig_k_schnelligkeit', 30);
    character = setValue(character, 'nk_hiebwaffen', nkHiebwaffen);
    const axt = findRow(NK_WAFFEN_BASIS, 'Axt');
    const material = findRow(NK_MATERIAL, 'Eisen');
    const fertigung = findRow(NK_FERTIGUNG, 'Gesellenarbeit');
    const anpassung = findRow(NK_ANPASSUNG, 'Von der Stange');
    const schaftmaterial = findRow(NK_SCHAFTMATERIAL, 'Standard');
    character = buyWeapon(character, axt.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
    character = buyWeapon(character, axt.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
    return character;
  }

  it('lehnt eine Nicht-Pool-Referenz ab', () => {
    const character = characterWithZweiAexten(10);
    const [w1] = character.equipment;
    expect(() => setWaffenPoolAllocation(character, 'eig_g_mut', w1.id, { gat: 1, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .toThrow(MutationError);
  });

  it('zwei Waffen mit derselben Spezialisierung teilen sich ein gemeinsames Budget', () => {
    // Mit nk_hiebwaffen=10 bleibt jede Axt (AT=-4/PA=-5) selbst unter der 20er-Deckung
    // (uncAtWeapon=20, uncPaWeapon=19 - siehe Test unten), traegt also KEINEN Ueberschuss bei -
    // das Budget ist rein die Pool-Formel: nk_spez_hiebwaffen_aexte(0)
    // + MAX(0;(30+30+10)/3-20) + MAX(0;(30+30+10)/3-20) = 0 + 3.33 + 3.33 = 6.67 -> aufgerundet 7.
    const character = characterWithZweiAexten(10);
    const [w1, w2] = character.equipment;
    const allocation = { gat: 2, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
    let updated = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, allocation);
    updated = setWaffenPoolAllocation(updated, 'nk_pool_hiebwaffen_aexte', w2.id, allocation);

    const pool = computeSheet(updated).byKategorie['Nahkampf']!
      .find((r) => r.rule.referenz === 'nk_pool_hiebwaffen_aexte')!;
    expect(pool.computedValue).toBe(7);
    expect(pool.weaponOverflowBudget).toBe(0);
    expect(pool.poolAllocation).toEqual({ gat: 4, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });
    expect(pool.poolRemaining).toBe(3); // 7 - 4
  });

  it('lehnt eine Zuteilung ab, wenn beide Waffen zusammen das gemeinsame Budget ueberschreiten', () => {
    const character = characterWithZweiAexten(10); // Budget = 7 (siehe oben)
    const [w1, w2] = character.equipment;
    const erste = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 4, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });
    expect(() => setWaffenPoolAllocation(erste, 'nk_pool_hiebwaffen_aexte', w2.id, { gat: 4, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .toThrow(BudgetError); // 4+4=8 > 7
  });

  it('nAT-Obergrenze ist pro Waffenzeile gedeckelt, nicht ueber Geschwister-Waffen summiert', () => {
    // unc_at_hiebwaffen (ungedeckelt) = (30+30+10)/3 = 23.33 -> aufgerundet 24. Axt AT-Bonus = -4
    // -> uncAtWeapon = 20 genau -> natMax = MAX(0;20-20) = 0 fuer JEDE Axt-Zeile einzeln.
    const character = characterWithZweiAexten(10);
    const [w1] = character.equipment;
    expect(() => setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 1, npa: 0 }))
      .toThrow(BudgetError);
  });

  it('Budget beruecksichtigt den Waffen-Ueberschuss ueber 20 unbefoerderter AT/PA-Basis', () => {
    // w1 wird kuenstlich auf AT/PA=+10 gesetzt (simuliert eine seltene Waffe mit positivem
    // AT/PA-Bonus, siehe Plan-Kommentar "gelegentlich positiv") - uncAtWeapon/uncPaWeapon =
    // 24+10 = 34 -> je 14 Ueberschuss, zusammen +28 Budget von w1. w2 bleibt der reguläre,
    // unveraenderte Axt-Bonus (AT=-4/PA=-5), der bei nk_hiebwaffen=10 selbst 0 Ueberschuss
    // beitraegt (siehe Test oben) - Gesamt-Ueberschuss also ausschliesslich von w1.
    const character = characterWithZweiAexten(10);
    const [w1] = character.equipment;
    w1.computedStatsSnapshot = { ...w1.computedStatsSnapshot, at: 10, pa: 10 };

    const pool = computeSheet(character).byKategorie['Nahkampf']!
      .find((r) => r.rule.referenz === 'nk_pool_hiebwaffen_aexte')!;
    expect(pool.weaponOverflowBudget).toBe(28);

    // Das aufgestockte Budget (7+28=35) erlaubt jetzt eine gAT-Zuteilung von 9 rohen Pool-Punkten
    // (gAT-Gesamtziel ist unveraendert 10, siehe poolCaps.ts, davon 1 kostenlose Basis + 9 aus dem
    // Pool zahlbar - unbeeinflusst vom Ueberschuss-Budget), waehrend das reine Formel-Budget (7)
    // dafuer bei weitem nicht gereicht haette.
    const updated = setWaffenPoolAllocation(character, 'nk_pool_hiebwaffen_aexte', w1.id, { gat: 9, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });
    expect(updated.poolAllocations['nk_pool_hiebwaffen_aexte::' + w1.id]).toEqual({ gat: 9, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 });
  });

  describe('Geweihte-Gate (Nutzer 2026-07-22): att_karma bleibt auf 0 gedeckelt ohne Gate-Talent', () => {
    it('setValue lehnt att_karma>0 ohne Geweihte-Talent ab', () => {
      const character = withEpGesamt(1000);
      expect(() => setValue(character, 'att_karma', 1)).toThrow(MutationError);
    });

    it('setValue erlaubt att_karma>0 sobald ein Geweihte-Gate-Talent gewaehlt ist', () => {
      const character = { ...withEpGesamt(1000), religion: 'Lloth, Orthodox' };
      const withTalent = addSelection(character, 'talente_geweihter_lloth_orthodox');
      const withKarma = setValue(withTalent, 'att_karma', 1);
      expect(withKarma.values['att_karma']).toBe(1);
    });

    it('Geweihte-Gate-Talente sind gegenseitig exklusiv - eine neue Wahl (nach Religionswechsel) ersetzt die alte', () => {
      const character = { ...withEpGesamt(1000), religion: 'Lloth, Orthodox' };
      const withLloth = addSelection(character, 'talente_geweihter_lloth_orthodox');
      const withKhartazh = addSelection({ ...withLloth, religion: 'Khartazh, Orthodox' }, 'talente_geweihter_khartazh_orthodox');
      expect(withKhartazh.selections['talente_geweihter_lloth_orthodox']).toBeUndefined();
      expect(withKhartazh.selections['talente_geweihter_khartazh_orthodox']).toBe(1);
    });
  });

  describe('Geweihte-Religions-Gate (Nutzer 2026-07-22): Gate-Talent muss zur gewaehlten Religion passen', () => {
    it('addSelection lehnt ein Gate-Talent ohne gewaehlte Religion ab', () => {
      const character = withEpGesamt(1000);
      expect(() => addSelection(character, 'talente_geweihter_lloth_orthodox')).toThrow(MutationError);
    });

    it('addSelection lehnt ein Gate-Talent ab, das nicht zur gewaehlten Religion passt', () => {
      const character = { ...withEpGesamt(1000), religion: 'Tepod, Orthodox' };
      expect(() => addSelection(character, 'talente_geweihter_lloth_orthodox')).toThrow(MutationError);
    });

    it('addSelection lehnt ein Gate-Talent ab, wenn nur die Religion aber nicht die Sekte passt', () => {
      const character = { ...withEpGesamt(1000), religion: 'Lloth, Käsequark' };
      expect(() => addSelection(character, 'talente_geweihter_lloth_orthodox')).toThrow(MutationError);
    });

    it('addSelection erlaubt ein Gate-Talent, das zur gewaehlten Religion+Sekte passt', () => {
      const character = { ...withEpGesamt(1000), religion: 'Isch, Orthodox' };
      const updated = addSelection(character, 'talente_geweihter_isch_orthodox');
      expect(updated.selections['talente_geweihter_isch_orthodox']).toBe(1);
    });
  });
});
