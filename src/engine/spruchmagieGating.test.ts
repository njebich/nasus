import { describe, it, expect } from 'vitest';
import { createCharacter, type CharacterState } from '../state/characterStore';
import { computeSheet } from './characterSheet';
import { getHauszauberSlots, getMaxLernbarerGrad, canLearnSpell, canIncreaseSpell } from './spruchmagieGating';
import { RULES, type RuleEntry } from '../data/rules';

function rule(referenz: string, grad: number, parent = 'TestSchule'): RuleEntry {
  return { referenz, kategorie: 'Spruchmagie', art: 'Wert', grad: String(grad), parent, sourceRow: 0 };
}

function withEpGesamt(epGesamt: number): CharacterState {
  const character = createCharacter('Test');
  character.values['ep_gesamt'] = epGesamt;
  return character;
}

describe('getMaxLernbarerGrad (Regel 5: Cap = Attribut Weisheit = kreis+1)', () => {
  it('ep_gesamt=0 -> Kreis 0 -> Weisheit 1', () => {
    expect(getMaxLernbarerGrad(computeSheet(withEpGesamt(0)))).toBe(1);
  });

  it('ep_gesamt=500 -> Kreis 2 -> Weisheit 3', () => {
    expect(getMaxLernbarerGrad(computeSheet(withEpGesamt(500)))).toBe(3);
  });
});

describe('getHauszauberSlots (Regel 6/8: Stufenfunktion ueber Magier-TaP, hoechste Schwelle gilt)', () => {
  it('0 TaP in Talentgruppe Magier -> 0 Slots', () => {
    expect(getHauszauberSlots(computeSheet(createCharacter('Test')))).toBe(0);
  });

  it('Spruchmagie Stufe 2 + Stufe 3 zaubern (je 7 TaP, Talentgruppe Magier) = 14 TaP -> 1 Slot (Schwelle 12)', () => {
    const character = createCharacter('Test');
    character.selections['talente_spruchmagie_stufe_2_zaubern'] = 1;
    character.selections['talente_spruchmagie_stufe_3_zaubern'] = 1;
    expect(getHauszauberSlots(computeSheet(character))).toBe(1);
  });

  it('nur Spruchmagie Stufe 2 zaubern (7 TaP) -> noch unter Schwelle 12 -> 0 Slots', () => {
    const character = createCharacter('Test');
    character.selections['talente_spruchmagie_stufe_2_zaubern'] = 1;
    expect(getHauszauberSlots(computeSheet(character))).toBe(0);
  });
});

describe('canLearnSpell (Regel 5/7/9/10: Weisheit-Cap + Hauszauber-Bypass um genau +1)', () => {
  it('Grad <= Weisheit ist immer erlaubt, unabhaengig von Hauszauber', () => {
    const sheet = computeSheet(withEpGesamt(500)); // Weisheit=3
    expect(canLearnSpell(sheet, rule('r', 2)).allowed).toBe(true);
    expect(canLearnSpell(sheet, rule('r', 3)).allowed).toBe(true);
  });

  it('Grad === Weisheit+1 ohne freien Hauszauber-Slot ist gesperrt', () => {
    const sheet = computeSheet(withEpGesamt(500)); // Weisheit=3, 0 Hauszauber-Slots
    const result = canLearnSpell(sheet, rule('r', 4));
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/Hauszauber/);
  });

  it('Grad === Weisheit+1 MIT freiem Hauszauber-Slot ist erlaubt', () => {
    const character = withEpGesamt(500); // Weisheit=3
    character.selections['talente_spruchmagie_stufe_2_zaubern'] = 1;
    character.selections['talente_spruchmagie_stufe_3_zaubern'] = 1; // 14 TaP -> 1 Slot
    const result = canLearnSpell(computeSheet(character), rule('r', 4));
    expect(result.allowed).toBe(true);
  });

  it('Grad > Weisheit+1 ist NIE erlaubt, auch nicht mit Hauszauber-Slots', () => {
    const character = withEpGesamt(500); // Weisheit=3
    character.selections['talente_spruchmagie_stufe_2_zaubern'] = 1;
    character.selections['talente_spruchmagie_stufe_3_zaubern'] = 1;
    const result = canLearnSpell(computeSheet(character), rule('r', 5));
    expect(result.allowed).toBe(false);
  });

  it('ein bereits gelernter Hauszauber bleibt erlaubt, auch wenn inzwischen alle Slots anderweitig belegt sind (kein rueckwirkendes Sperren)', () => {
    // Reale Grad-4-Zauber aus zwei verschiedenen Schulen (Weisheit=3 -> Hauszauber-Grad=4).
    const belegterSlotRule = RULES.find((r) => r.referenz === 'spruchmagie_erdbeschwoerung_4_steinschuss_salve')!;
    const neuerRule = RULES.find((r) => r.referenz === 'spruchmagie_feuerbeschwoerung_4_grosser_feuerball')!;
    expect(belegterSlotRule).toBeDefined();
    expect(neuerRule).toBeDefined();

    const character = withEpGesamt(500); // Weisheit=3
    character.selections['talente_spruchmagie_stufe_2_zaubern'] = 1;
    character.selections['talente_spruchmagie_stufe_3_zaubern'] = 1; // 14 TaP -> 1 Slot total
    character.values[belegterSlotRule.referenz] = 1; // bereits gelernter Hauszauber, belegt den einen Slot

    const sheet = computeSheet(character);
    expect(canLearnSpell(sheet, belegterSlotRule).allowed).toBe(true);
    expect(canLearnSpell(sheet, neuerRule).allowed).toBe(false);
  });
});

describe('canIncreaseSpell (Regel 1: Mindestintelligenz + Vorstufe TaW>=10 derselben Schule, Grad 1 ausgenommen)', () => {
  // Reale Erdbeschwoerung-Zauber: Grad1 "Splitterwand" (Min.Int 12), Grad2 "Steinschuss" (Min.Int 13).
  const grad1 = RULES.find((r) => r.referenz === 'spruchmagie_erdbeschwoerung_1_splitterwand')!;
  const grad2 = RULES.find((r) => r.referenz === 'spruchmagie_erdbeschwoerung_2_steinschuss')!;
  // Grad1-Zauber aus einer ANDEREN Schule, als "falsche" Vorstufe fuer den Cross-Schule-Test.
  const andereSchuleGrad1 = RULES.find((r) => r.referenz === 'spruchmagie_feuerbeschwoerung_1_feuerball')
    ?? RULES.find((r) => r.kategorie === 'Spruchmagie' && r.grad === '1' && r.parent !== grad1.parent)!;

  it('Grad 1: nur Mindestintelligenz zaehlt, keine Vorstufe noetig', () => {
    const character = createCharacter('Test');
    character.values['eig_g_intelligenz'] = 12; // = Min.Int von Splitterwand
    const sheet = computeSheet(character);
    expect(canIncreaseSpell(sheet, grad1).allowed).toBe(true);
  });

  it('Grad 2: ohne gelernte Vorstufe derselben Schule gesperrt', () => {
    const character = createCharacter('Test');
    character.values['eig_g_intelligenz'] = 20;
    const sheet = computeSheet(character);
    const result = canIncreaseSpell(sheet, grad2);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/Vorstufe|gradniedrigeren/);
  });

  it('Grad 2: mit Vorstufe derselben Schule auf TaW>=10 erlaubt', () => {
    const character = createCharacter('Test');
    character.values['eig_g_intelligenz'] = 20;
    character.values[grad1.referenz] = 10;
    const sheet = computeSheet(character);
    expect(canIncreaseSpell(sheet, grad2).allowed).toBe(true);
  });

  it('Grad 2: Vorstufe mit TaW<10 reicht nicht', () => {
    const character = createCharacter('Test');
    character.values['eig_g_intelligenz'] = 20;
    character.values[grad1.referenz] = 9;
    const sheet = computeSheet(character);
    expect(canIncreaseSpell(sheet, grad2).allowed).toBe(false);
  });

  it('Grad 2: Vorstufe aus einer ANDEREN Schule zaehlt nicht', () => {
    const character = createCharacter('Test');
    character.values['eig_g_intelligenz'] = 20;
    character.values[andereSchuleGrad1.referenz] = 10;
    const sheet = computeSheet(character);
    expect(canIncreaseSpell(sheet, grad2).allowed).toBe(false);
  });

  it('unter Mindestintelligenz gesperrt, auch bei erfuellter Vorstufe', () => {
    const character = createCharacter('Test');
    character.values['eig_g_intelligenz'] = 1;
    character.values[grad1.referenz] = 10;
    const sheet = computeSheet(character);
    const result = canIncreaseSpell(sheet, grad2);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/Intelligenz/);
  });

  it('Integration: reale Referenz spruchmagie_erdbeschwoerung_1_splitterwand hat Min.Int 12 (aus spruchmagieDetails.json)', () => {
    const zuNiedrig = createCharacter('Test');
    zuNiedrig.values['eig_g_intelligenz'] = 11;
    expect(canIncreaseSpell(computeSheet(zuNiedrig), grad1).allowed).toBe(false);

    const reicht = createCharacter('Test');
    reicht.values['eig_g_intelligenz'] = 12;
    expect(canIncreaseSpell(computeSheet(reicht), grad1).allowed).toBe(true);
  });
});
