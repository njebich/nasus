import { describe, expect, it } from 'vitest';
import { resolveRw, resolveWirkungText } from './spruchmagieRw';

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

describe('resolveWirkungText', () => {
  const macht = 12;
  const magie = 8;
  const aura = 5;

  it('ersetzt (M) immer, unabhaengig vom Kontext', () => {
    expect(resolveWirkungText('Wurde mehr als (M) % der Kleidung zerstört, werden maximal (M) % wiederhergestellt.', macht, magie, aura))
      .toBe('Wurde mehr als 12 % der Kleidung zerstört, werden maximal 12 % wiederhergestellt.');
  });

  it('ersetzt Magie in Formel-Kontexten', () => {
    expect(resolveWirkungText('Die Ausstrahlung des Magus erhöht sich um Magie * 2.', macht, magie, aura))
      .toBe('Die Ausstrahlung des Magus erhöht sich um 8 * 2.');
    expect(resolveWirkungText('Schaden: 2W6 + Magie, RB Magie*2', macht, magie, aura))
      .toBe('Schaden: 2W6 + 8, RB 8*2');
  });

  it('laesst "Magie" als Material/Tabellenkopf/Konzept unveraendert', () => {
    expect(resolveWirkungText('Der Magus erschafft einen Ball aus Magie.', macht, magie, aura))
      .toBe('Der Magus erschafft einen Ball aus Magie.');
    expect(resolveWirkungText('Eine Waffe erhält Schadenswirkung entsprechend der Magie des Magus: 1=W4, 2=W6', macht, magie, aura))
      .toBe('Eine Waffe erhält Schadenswirkung entsprechend der Magie des Magus: 1=W4, 2=W6');
    expect(resolveWirkungText('Alle Magie und Materie können die Kugel verlassen.', macht, magie, aura))
      .toBe('Alle Magie und Materie können die Kugel verlassen.');
    expect(resolveWirkungText('Feindliche Magie ist mit Ziel Aura hiervon nicht betroffen.', macht, magie, aura))
      .toBe('Feindliche Magie ist mit Ziel Aura hiervon nicht betroffen.');
  });

  it('trennt zwei Magie-Vorkommen im selben Satz korrekt (Formel vs. Material)', () => {
    expect(resolveWirkungText('Der Magus erschafft Magie/2 Bälle aus Magie.', macht, magie, aura))
      .toBe('Der Magus erschafft 8/2 Bälle aus Magie.');
  });

  it('ersetzt Aura in Formel-Kontexten', () => {
    expect(resolveWirkungText('RS=Aura und LE von 4*(M).', macht, magie, aura))
      .toBe('RS=5 und LE von 4*12.');
    expect(resolveWirkungText('Golems haben einen Wert von (Magie+Aura), außer Intelligenz = (Magie) und Stärke = (M).', macht, magie, aura))
      .toBe('Golems haben einen Wert von (8+5), außer Intelligenz = (8) und Stärke = 12.');
    expect(resolveWirkungText('FK-Angriffe sind um Aura*2 erschwert.', macht, magie, aura))
      .toBe('FK-Angriffe sind um 5*2 erschwert.');
  });

  it('laesst "Aura" als Wirkzone/Ziel-Attribut/Zaubername unveraendert', () => {
    expect(resolveWirkungText('Wer sich in die Aura begibt, erleidet Elementarschaden.', macht, magie, aura))
      .toBe('Wer sich in die Aura begibt, erleidet Elementarschaden.');
    expect(resolveWirkungText('Blick in die Gedanken und Aura erkennen mit dem Ziel Magus sind erschwert.', macht, magie, aura))
      .toBe('Blick in die Gedanken und Aura erkennen mit dem Ziel Magus sind erschwert.');
    expect(resolveWirkungText('Explodiert, wenn eine Aura außer dem Magus ihn berührt.', macht, magie, aura))
      .toBe('Explodiert, wenn eine Aura außer dem Magus ihn berührt.');
    expect(resolveWirkungText('Der Magus verhüllt seine Aura.', macht, magie, aura))
      .toBe('Der Magus verhüllt seine Aura.');
  });

  it('faellt bei fehlendem Text auf "–" zurueck', () => {
    expect(resolveWirkungText(undefined, macht, magie, aura)).toBe('–');
  });
});
