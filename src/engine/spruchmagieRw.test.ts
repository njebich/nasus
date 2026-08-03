import { describe, expect, it } from 'vitest';
import { markFormulaTokens, resolveRw, resolveWirkungText } from './spruchmagieRw';

describe('resolveRw', () => {
  const macht = 10;
  const magie = 8;
  const aura = 6;
  const mana = 60;

  it('wertet (M)-Formeln aus', () => {
    expect(resolveRw('(M)*10m', macht, magie, aura, mana)).toBe('100m');
    expect(resolveRw('(M)/2m', macht, magie, aura, mana)).toBe('5m');
    expect(resolveRw('(M)*6cm', macht, magie, aura, mana)).toBe('60cm');
    expect(resolveRw('(M)*10km', macht, magie, aura, mana)).toBe('100km');
  });

  it('wertet Magie-/Aura-Formeln aus', () => {
    expect(resolveRw('Magie*4m', macht, magie, aura, mana)).toBe('32m');
    expect(resolveRw('Aura/3m', macht, magie, aura, mana)).toBe('2m');
  });

  it('wertet Radius-Formeln aus, mit und ohne Leerzeichen vor "Radius"', () => {
    expect(resolveRw('(M)/2m Radius', macht, magie, aura, mana)).toBe('5m Radius');
    expect(resolveRw('Magie*kmRadius', macht, magie, aura, mana)).toBe('8km Radius');
    expect(resolveRw('(M)*mRadius', macht, magie, aura, mana)).toBe('10m Radius');
  });

  it('loest den verschachtelten Mana-Sonderfall auf', () => {
    expect(resolveRw('(M)*(Mana/30)m', macht, magie, aura, mana)).toBe('20m');
  });

  it('reicht Literale wie Selbst/Beruehrung unveraendert durch', () => {
    expect(resolveRw('Selbst', macht, magie, aura, mana)).toBe('Selbst');
    expect(resolveRw('Berührung', macht, magie, aura, mana)).toBe('Berührung');
  });

  it('faellt bei fehlendem Wert auf "–" zurueck', () => {
    expect(resolveRw(undefined, macht, magie, aura, mana)).toBe('–');
  });
});

describe('resolveWirkungText (Marker-Format {M}/{Magie}/{Aura})', () => {
  const macht = 12;
  const magie = 8;
  const aura = 5;

  it('loest {M} auf', () => {
    expect(resolveWirkungText('Wurde mehr als {M} % der Kleidung zerstört, werden maximal {M} % wiederhergestellt.', macht, magie, aura))
      .toBe('Wurde mehr als 12 % der Kleidung zerstört, werden maximal 12 % wiederhergestellt.');
  });

  it('loest {Magie} auf und rechnet die Formel fertig', () => {
    expect(resolveWirkungText('Die Ausstrahlung des Magus erhöht sich um {Magie} * 2.', macht, magie, aura))
      .toBe('Die Ausstrahlung des Magus erhöht sich um 16.');
    expect(resolveWirkungText('Schaden: 2W6 + {Magie}, RB {Magie}*2', macht, magie, aura))
      .toBe('Schaden: 2W6 + 8, RB 16');
  });

  it('rechnet gemischte +/*-Formeln fertig (Steinschuss-Fall, Nutzer-Feedback)', () => {
    expect(resolveWirkungText('Schaden: 2W6 + {Magie}; RB: 6 + {Magie}*2', macht, magie, aura))
      .toBe('Schaden: 2W6 + 8; RB: 22');
  });

  it('startet keine Zahlenkette mitten in einem Wuerfel-Term (2W6)', () => {
    expect(resolveWirkungText('Schaden: 2W6 + {Magie} auf jede TZ.', macht, magie, aura))
      .toBe('Schaden: 2W6 + 8 auf jede TZ.');
  });

  it('behandelt ":" direkt nach einem Marker wie "/" (der eigentliche Bug-Fall)', () => {
    // Vorher: "Magie/2" wurde manuell zu "Magie : 2" umgeschrieben, wodurch die Division nicht
    // mehr berechnet wurde (":" gilt bei blossem Text bewusst nicht als Division). Mit einem
    // expliziten Marker ist ":" direkt danach unzweideutig Division.
    expect(resolveWirkungText('Hochsprung: + {Magie} : 2 m', macht, magie, aura)).toBe('Hochsprung: + 4 m');
    // 6 + {M}:2 = 6 + (12/2) = 12 (Punkt-vor-Strich, wie beim bestehenden "/"-Verhalten)
    expect(resolveWirkungText('RB: 6 + {M}:2', macht, magie, aura)).toBe('RB: 12');
    expect(resolveWirkungText('Fluggeschwindigkeit ist {M}:2 m/s.', macht, magie, aura)).toBe('Fluggeschwindigkeit ist 6 m/s.');
  });

  it('laesst "|" als Listen-/Label-Trenner immer unangetastet (Golem-Faelle, seit 2026-08-03 auf "|" migriert)', () => {
    expect(resolveWirkungText('NK-AT|PA von {M}|1|21 mit 2W8+{Aura} Schaden, AW= {Magie}|1|21.', macht, magie, aura))
      .toBe('NK-AT|PA von 12|1|21 mit 2W8+5 Schaden, AW= 8|1|21.');
    // Gemischte Liste mit "+" zwischen den Werten (Großer-Golem-Fall): "|" trennt die drei
    // Grad-Werte, "+" innerhalb eines Werts wird ganz normal weiterhin verrechnet.
    expect(resolveWirkungText('NK-AT|PA von {M}|1+{Magie}|21+{Aura} mit 2W15+{Aura} Schaden.', macht, magie, aura))
      .toBe('NK-AT|PA von 12|9|26 mit 2W15+5 Schaden.');
  });

  it('wertet Ketten mit 2+ "/" weiterhin nicht aus (Sicherheitsnetz, falls "/" statt "|" fuer eine Liste verwendet wird)', () => {
    expect(resolveWirkungText('NK-AT/PA von {M}/1/21 mit 2W8+{Aura} Schaden, AW= {Magie}/1/21.', macht, magie, aura))
      .toBe('NK-AT/PA von 12/1/21 mit 2W8+5 Schaden, AW= 8/1/21.');
  });

  it('laesst unmarkiertes "Magie"/"Aura" immer unveraendert (kein Formel-Kontext-Raten mehr)', () => {
    expect(resolveWirkungText('Der Magus erschafft einen Ball aus Magie.', macht, magie, aura))
      .toBe('Der Magus erschafft einen Ball aus Magie.');
    expect(resolveWirkungText('Wer sich in die Aura begibt, erleidet Elementarschaden.', macht, magie, aura))
      .toBe('Wer sich in die Aura begibt, erleidet Elementarschaden.');
    expect(resolveWirkungText('Feindliche Magie ist mit Ziel Aura hiervon nicht betroffen.', macht, magie, aura))
      .toBe('Feindliche Magie ist mit Ziel Aura hiervon nicht betroffen.');
  });

  it('trennt zwei Magie-Vorkommen im selben Satz korrekt (Formel vs. Material)', () => {
    expect(resolveWirkungText('Der Magus erschafft {Magie}/2 Bälle aus Magie.', macht, magie, aura))
      .toBe('Der Magus erschafft 4 Bälle aus Magie.');
  });

  it('loest {Aura} in Formel-Kontexten auf und rechnet fertig', () => {
    expect(resolveWirkungText('RS={Aura} und LE von 4*{M}.', macht, magie, aura))
      .toBe('RS=5 und LE von 48.');
    expect(resolveWirkungText('Golems haben einen Wert von ({Magie}+{Aura}), außer Intelligenz = ({Magie}) und Stärke = {M}.', macht, magie, aura))
      .toBe('Golems haben einen Wert von (13), außer Intelligenz = (8) und Stärke = 12.');
    expect(resolveWirkungText('FK-Angriffe sind um {Aura}*2 erschwert.', macht, magie, aura))
      .toBe('FK-Angriffe sind um 10 erschwert.');
  });

  it('faellt bei fehlendem Text auf "–" zurueck', () => {
    expect(resolveWirkungText(undefined, macht, magie, aura)).toBe('–');
  });
});

describe('markFormulaTokens (Migrations-Helfer)', () => {
  it('markiert "(M)" immer', () => {
    expect(markFormulaTokens('Wurde mehr als (M) % zerstört, max. (M) %.')).toBe('Wurde mehr als {M} % zerstört, max. {M} %.');
  });

  it('markiert "Magie" in Formel-Kontexten, laesst Material/Konzept unangetastet', () => {
    expect(markFormulaTokens('Der Magus erschafft Magie/2 Bälle aus Magie.')).toBe('Der Magus erschafft {Magie}/2 Bälle aus Magie.');
    expect(markFormulaTokens('Eine Waffe erhält Schadenswirkung entsprechend der Magie des Magus: 1=W4')).toBe(
      'Eine Waffe erhält Schadenswirkung entsprechend der Magie des Magus: 1=W4',
    );
    expect(markFormulaTokens('Alle Magie und Materie können die Kugel verlassen.')).toBe('Alle Magie und Materie können die Kugel verlassen.');
    expect(markFormulaTokens('Feindliche Magie ist mit Ziel Aura hiervon nicht betroffen.')).toBe(
      'Feindliche Magie ist mit Ziel Aura hiervon nicht betroffen.',
    );
  });

  it('markiert "Aura" in Formel-Kontexten, laesst Wirkzone/Ziel-Attribut/Zaubername unangetastet', () => {
    expect(markFormulaTokens('RS=Aura und LE von 4*(M).')).toBe('RS={Aura} und LE von 4*{M}.');
    expect(markFormulaTokens('Wer sich in die Aura begibt, erleidet Elementarschaden.')).toBe(
      'Wer sich in die Aura begibt, erleidet Elementarschaden.',
    );
    expect(markFormulaTokens('Blick in die Gedanken und Aura erkennen mit dem Ziel Magus sind erschwert.')).toBe(
      'Blick in die Gedanken und Aura erkennen mit dem Ziel Magus sind erschwert.',
    );
    expect(markFormulaTokens('Explodiert, wenn eine Aura außer dem Magus ihn berührt.')).toBe(
      'Explodiert, wenn eine Aura außer dem Magus ihn berührt.',
    );
    expect(markFormulaTokens('Der Magus verhüllt seine Aura.')).toBe('Der Magus verhüllt seine Aura.');
    expect(markFormulaTokens('Wer sich in dieser Aura befindet, erleidet Elementarschaden.')).toBe(
      'Wer sich in dieser Aura befindet, erleidet Elementarschaden.',
    );
  });
});
