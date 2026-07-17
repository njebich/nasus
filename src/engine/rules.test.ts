import { describe, it, expect } from 'vitest';
import { getRule, evalReferenz, evalKostenFor, type CharacterValueSource } from './rules';

function values(vals: Record<string, number>): CharacterValueSource {
  return {
    getWert: (referenz) => vals[referenz.toLowerCase()] ?? 0,
  };
}

describe('rules.ts gegen echte Werte-Daten (werte 0.7-claude.xlsx)', () => {
  it('kennt at_hiebwaffen als Formel-Regel', () => {
    const rule = getRule('at_hiebwaffen');
    expect(rule?.art).toBe('Formel');
    expect(rule?.formelRaw).toBe('MIN(20;(eig_g_mut+eig_k_athletik+nk_hiebwaffen)/3)');
  });

  it('at_hiebwaffen: einfache Abhaengigkeitskette ohne Deckelung', () => {
    const result = evalReferenz('at_hiebwaffen', values({
      eig_g_mut: 10, eig_k_athletik: 8, nk_hiebwaffen: 12,
    }));
    expect(result).toBe(10); // (10+8+12)/3 = 10, MIN(20;10) = 10
  });

  it('at_hiebwaffen: MIN(20;...) deckelt bei hohen Werten', () => {
    const result = evalReferenz('at_hiebwaffen', values({
      eig_g_mut: 30, eig_k_athletik: 30, nk_hiebwaffen: 30,
    }));
    expect(result).toBe(20); // (90)/3 = 30, MIN(20;30) = 20
  });

  it('nk_pool_hiebwaffen: Pool-Formel summiert AT- und PA-seitigen Ueberlauf ueber 20', () => {
    const result = evalReferenz('nk_pool_hiebwaffen', values({
      eig_g_mut: 30, eig_k_athletik: 30, eig_k_schnelligkeit: 30, nk_hiebwaffen: 30,
    }));
    // AT-Seite: MAX(0; 90/3-20) = 10.  PA-Seite: MAX(0; 90/3-20) = 10.  Summe = 20.
    expect(result).toBe(20);
  });

  it('nk_pool_hiebwaffen: kein Pool-Budget wenn AT/PA unter 20 bleiben', () => {
    const result = evalReferenz('nk_pool_hiebwaffen', values({
      eig_g_mut: 5, eig_k_athletik: 5, eig_k_schnelligkeit: 5, nk_hiebwaffen: 5,
    }));
    expect(result).toBe(0);
  });

  it('eig_g_mut Kosten: SVERWEIS gegen die generierte Eigenschaften-Kosten-Tabelle', () => {
    // Laut Flag-Spalte: 30 EP/Punkt bis Wert 11 -> Wert 5 kostet insgesamt 150 EP.
    const result = evalKostenFor('eig_g_mut', 5, values({}));
    expect(result).toBe(150);
  });

  it('eig_g_mut Kosten: nichtlinearer Bereich ab Wert 12', () => {
    const result = evalKostenFor('eig_g_mut', 12, values({}));
    expect(result).toBe(363);
  });

  it('wirft einen klaren Fehler fuer eine nicht existierende Referenz', () => {
    expect(() => evalReferenz('does_not_exist', values({}))).toThrow(/existiert nicht/);
  });

  it('stufe (Art=Lookup) wird ausgewertet, nicht uebersprungen (Regression: Lookup-Zeilen mit Formel)', () => {
    const rule = getRule('stufe');
    expect(rule?.art).toBe('Lookup');
    // EP-Stufe-Kreis: 'EP ab'=1600 -> Stufe 15, 1750 -> Stufe 16. Bereichsverweis (SVERWEIS mit
    // 4. Argument=1) muss den groessten Schwellenwert <= ep_gesamt finden, nicht exakt matchen.
    expect(evalReferenz('stufe', values({ ep_gesamt: 1600 }))).toBe(15);
    expect(evalReferenz('stufe', values({ ep_gesamt: 1699 }))).toBe(15);
    expect(evalReferenz('stufe', values({ ep_gesamt: 1750 }))).toBe(16);
  });

  it('kreis (Art=Lookup) wird ebenfalls ausgewertet', () => {
    expect(evalReferenz('kreis', values({ ep_gesamt: 1600 }))).toBe(3);
    expect(evalReferenz('kreis', values({ ep_gesamt: 1750 }))).toBe(4);
  });

  it('mana wird bei negativem Ergebnis auf 0 begrenzt (Spielregel, Nutzer 2026-07-17)', () => {
    // att_aura*7+att_magie*3+3*eig_g_willenskraft-30+eig_bonus_g_intelligenz*att_weisheit+stufe+sf_mana_talent*2
    // Alle Eingaben 0 -> -30, ohne Boden waere das Ergebnis negativ.
    expect(evalReferenz('mana', values({}))).toBe(0);
  });

  it('gewichtsbelastung wertet waehrend der Charaktererstellung fest zu 0 aus (Kampfmodul-Scope, Nutzer 2026-07-17)', () => {
    // Die echte Formel ist ein Prosa-Platzhalter (braucht Ruestungs-/Inventar-Laufzeitdaten aus
    // dem Kampfmodul) - waere ohne den Override ein Parse-Fehler statt eines nutzbaren Werts.
    expect(evalReferenz('gewichtsbelastung', values({}))).toBe(0);
  });

  it('aw_def_normal/aw_off_normal sind dank GBE=0-Override berechenbar (Regression: waren zuvor immer "nicht definiert")', () => {
    const chara = values({ eig_k_athletik: 10, eig_k_schnelligkeit: 10, att_glueck: 5, sf_ausweichen: 0 });
    expect(evalReferenz('aw_def_normal', chara)).toBe(11); // (10+10+5+0)/5+6-0 = 11
    expect(evalReferenz('aw_off_normal', chara)).toBe(7); // (10+10+5+0)/5+2-0 = 7
  });
});
