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
});
