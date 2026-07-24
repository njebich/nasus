import { describe, it, expect } from 'vitest';
import { prettyFormula } from './formulaDisplay';

describe('prettyFormula', () => {
  it('ersetzt Referenzen durch ihre Abkuerzung, wo vorhanden', () => {
    // aw_def_normal-Formel: eig_g_mut hat Abkuerzung "Mut", att_glueck hat "Glü".
    expect(prettyFormula('eig_g_mut+att_glueck')).toBe('Mut + Glü');
  });

  it('faellt auf Beschreibung zurueck, wenn keine Abkuerzung gepflegt ist', () => {
    // at_hiebwaffen hat keine Abkuerzung, nur eine Beschreibung.
    expect(prettyFormula('at_hiebwaffen')).toBe('Attacke-Basis-Wert Hiebwaffen');
  });

  it('laesst Funktionsnamen und die Kosten-Pseudo-Variable "wert" unveraendert', () => {
    expect(prettyFormula('WENN(wert=0;0;10+(wert-1)*grad)')).toBe('WENN(Wert = 0; 0; 10 + (Wert - 1) * Grad)');
  });

  it('gibt unparsebare Rohtexte unveraendert zurueck (z.B. der GBE-Prosa-Platzhalter)', () => {
    const raw = 'SUMME(Ruestungs-Komponente [RBE/6] + Ausruestungs-Gewichts-Komponente)';
    expect(prettyFormula(raw)).toBe(raw);
  });

  it('behandelt SVERWEIS-Sheetnamen (String-Literal) unveraendert', () => {
    // ep_gesamt hat keine Abkuerzung -> faellt auf die Beschreibung zurueck.
    expect(prettyFormula("SVERWEIS(ep_gesamt;'EP-Stufe-Kreis';2;1)"))
      .toBe("SVERWEIS(Gesamte Erfahrungspunke; 'EP-Stufe-Kreis'; 2; 1)");
  });

  it('entfernt AUFRUNDEN(x;0)/ABRUNDEN(x;0)-Huellen (rein kosmetische Rundung)', () => {
    expect(prettyFormula('AUFRUNDEN(eig_g_mut/2;0)')).toBe('Mut / 2');
    expect(prettyFormula('ABRUNDEN(eig_g_mut/2;0)')).toBe('Mut / 2');
  });

  it('entfernt die "auf 20 gedeckelt"-Huelle MIN(20;x), laesst andere MIN-Aufrufe unveraendert', () => {
    expect(prettyFormula('MIN(20;eig_g_mut+att_glueck)')).toBe('Mut + Glü');
    expect(prettyFormula('MIN(21;eig_g_mut)')).toBe('MIN(21; Mut)');
  });

  it('vereinfacht verschachtelte Rundungs-/Kappungs-Huellen rekursiv', () => {
    expect(prettyFormula('AUFRUNDEN(MIN(20;eig_g_mut)/3;0)')).toBe('Mut / 3');
  });

  it('erlaubt Aufrufer-seitige Namens-Ueberschreibung fuer einzelne Referenzen (nameOverrides)', () => {
    // Nahkampf AT-/PA-Basis (categoryView.ts's renderWaffenBasisCell): die eigene Hauptfertigkeit
    // (hier synthetisch eig_g_mut) soll als "TaW" statt ihres normalen Anzeigenamens erscheinen.
    expect(prettyFormula('MIN(20;(eig_g_mut+att_glueck)/3)', { eig_g_mut: 'TaW' })).toBe('(TaW + Glü) / 3');
  });
});
