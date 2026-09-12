import { describe, expect, it } from 'vitest';
import {
  effektiveVerfuegbarkeit, effektiveVerfuegbarkeitKomponenten, ortsModifikator, parseGegenstandVoelker, volkAusAdjektiv,
} from './verfuegbarkeitOrt';
import { VORDEFINIERTE_ORTE } from '../data/orte';
import type { GenericRow } from '../data/equipment/armor';

const straitmor = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'straitmor')!;
// Isch-Isch: ehem. Zwogón, zwergische Hauptstadt - Nutzer 2026-09-12: Zwerge vertrieben, jetzt
// goblinisches Kernland (hauptspezies 'Goblins'). Rest (Metropole/Handelszentrum/Herstellung vor
// Ort/Grosshaendler je Warengruppe) unveraendert - siehe data/orte.ts.
const ischIsch = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'isch-isch')!;
// Katharsis: die (neue) zwergische Hauptstadt, "absolutes Optimum an Verfuegbarkeit fuer
// Artefakte, zwergische Waffen und ungewoehnliche Materialien" (Nutzer 2026-09-12) - uebernimmt
// das "Großkönigliche Kernprovinz"-Profil von der gefallenen Zwogón.
const katharsis = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'katharsis')!;
const phoenixFeste = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'phoenix-feste')!;

describe('Ortsmodifikator auf die 1-7-Verfuegbarkeitsskala', () => {
  it('macht eine orkische Feuerwaffe in ihrer orkischen Heimat-Metropole kaufbar (Ausgangsfall)', () => {
    // Durass (Orkisch), raw Verfuegbarkeit 75 -> Basisstufe 6 ("Nie"), regulaer fuer SC gesperrt.
    const effektiv = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'],
    });
    expect(effektiv).toBe(1);
  });

  it('gewaehrt den lokalen Produktionsbonus nur dem passenden Volk, nicht generell', () => {
    // Hakenbuechse (Dalkinisch), raw Verfuegbarkeit 85 -> Basisstufe 6. Straitmors lokale
    // Feuerwaffen-Produktion ist an "Orks" gebunden, greift fuer Dalkini also NICHT - dafuer
    // schlaegt die Voelker/Ortsbevoelkerung-Fremdheit (+3) zu, da Dalkini in Straitmor weder
    // Hauptspezies noch etablierte Minderheit ist.
    const effektivOrkisch = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'],
    });
    const effektivDalkinisch = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Dalkini'],
    });
    expect(effektivDalkinisch!).toBeGreaterThan(effektivOrkisch!);
  });

  it('behandelt eine etablierte Minderheit besser als eine ganz fremde Spezies, aber schlechter als die Hauptspezies', () => {
    const hauptspezies = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'] });
    const minderheit = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Zwerge'] });
    const fremd = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Elfen'] });
    expect(hauptspezies).toBeLessThan(minderheit);
    expect(minderheit).toBeLessThan(fremd);
  });

  it('nimmt bei ALLE (kein gegenstandVoelker) keinen Voelkermodifikator', () => {
    const mitVolk = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Elfen'] });
    const ohneVolk = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' });
    expect(ohneVolk).toBeLessThan(mitVolk);
  });

  it('AUSWAHL mit mehreren Eintraegen: die beste Uebereinstimmung zaehlt (Spec-Punkt 20)', () => {
    // Straitmor: Hauptspezies Orks, etablierte Minderheiten Zwerge/Goblins. Eine Komponente mit
    // AUSWAHL [Elfen, Zwerge] soll wie eine reine Zwerge-Zuweisung behandelt werden (Minderheit,
    // +1), nicht wie eine reine Elfen-Zuweisung (fremd, +3).
    const nurElfen = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Elfen'] });
    const elfenUndZwerge = ortsModifikator({
      ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Elfen', 'Zwerge'],
    });
    expect(elfenUndZwerge).toBeLessThan(nurElfen);
  });

  it('verrechnet Siedlungsgroesse, Handelsstufe, Herstellung direkt vor Ort und Großer-spezialisierter-Haendler zusammen (Isch-Isch)', () => {
    const effektiv = effektiveVerfuegbarkeit(4, { ort: ischIsch, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' });
    // Metropole (-4) + Handelszentrum (-2) + Herstellung direkt vor Ort (-2) + Großer
    // spezialisierter Haendler (-2) + ALLE (0) = -10 auf Basis 4 -> clamp bei 1.
    expect(effektiv).toBe(1);
  });

  it('waehlt unter mehreren anwendbaren Haendlern den niedrigsten (guenstigsten) Modifikator', () => {
    const ortMitZweiHaendlern = {
      ...phoenixFeste,
      haendler: [
        { typ: 'Fahrender Trödelhändler' as const, warengruppe: null },
        { typ: 'Großer spezialisierter Händler' as const, warengruppe: 'Rüstungen' },
      ],
    };
    const nurGeneralist = ortsModifikator({
      ort: { ...ortMitZweiHaendlern, haendler: [ortMitZweiHaendlern.haendler[0]] }, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen',
    });
    const mitSpezialist = ortsModifikator({ ort: ortMitZweiHaendlern, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' });
    expect(mitSpezialist).toBeLessThan(nurGeneralist);
  });

  it('faellt ohne anwendbaren Haendler auf "Kein Laden / kein Händler" zurueck (Phoenix-Feste, Artefakte)', () => {
    // Phoenix-Feste hat nur einen "Kleiner General Store" ohne Warengruppen-Bindung -> gilt fuer
    // alle Warengruppen, ist aber selbst kein spezialisierter Haendler fuer Artefakte.
    const mod = ortsModifikator({ ort: phoenixFeste, warengruppe: 'Artefakte', tarif: 'artefakte' });
    // Dorf (+3) + Handelsroute (+1) + Import (+3) + Kleiner General Store (+3, Artefakte-Spalte) = +10.
    expect(mod).toBe(10);
  });

  it('bleibt ohne Ort neutral (0) statt zusaetzlich zu sperren', () => {
    expect(ortsModifikator({ ort: undefined, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'] })).toBe(0);
    expect(effektiveVerfuegbarkeit(6, { ort: undefined, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen' })).toBe(6);
  });

  it('laesst eine fehlende Basisstufe (OFFEN) unveraendert undefined, auch mit gutem Ortsbonus', () => {
    expect(effektiveVerfuegbarkeit(undefined, { ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'] })).toBeUndefined();
  });

  it('Floor bei Basisstufe 7 ("Einzigartig", Nutzer 2026-09-12): faellt selbst in Katharsis nicht unter 5', () => {
    // Katharsis: absolutes Optimum in allen 5 Kategorien (Metropole + Handelszentrum +
    // Herstellung vor Ort + eigener Grosshaendler + Hauptspezies-Match) auf Mithril/Nasium
    // (Basis 7) - Nutzer: "wenn mithril/nasium unter 5 fallen, dann ist was falsch".
    const effektiv = effektiveVerfuegbarkeit(7, {
      ort: katharsis, warengruppe: 'NK-Waffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Zwerge'],
    });
    expect(effektiv).toBe(5);
  });

  it('Floor bei Basisstufe 7 aendert das bestehende Verhalten fuer niedrigere Basisstufen nicht (Basis 6 faellt weiterhin auf 1)', () => {
    const effektiv = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'],
    });
    expect(effektiv).toBe(1);
  });

  it('begrenzt das Ergebnis nach oben auf 7, auch bei sehr schlechtem Ort', () => {
    const wildnisOhneAlles = {
      ...straitmor, siedlungsgroesse: 'Wildnis' as const, handelsstufe: 'Völlig abgelegen von jeglichem Handel' as const,
      herstellungsort: 'Import, wird nicht hergestellt' as const, haendler: [], lokaleProduktion: [],
    };
    const effektiv = effektiveVerfuegbarkeit(6, { ort: wildnisOhneAlles, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVoelker: ['Orks'] });
    expect(effektiv).toBe(7);
  });
});

describe('volkAusAdjektiv: Feuerwaffen/Boegen/Armbrust-Volk-Adjektive auf VOELKER_NAMEN abbilden', () => {
  it('erkennt bekannte Adjektiv- und Singularformen', () => {
    expect(volkAusAdjektiv('Orkisch')).toBe('Orks');
    expect(volkAusAdjektiv('Ork')).toBe('Orks');
    expect(volkAusAdjektiv('Dalkinisch')).toBe('Dalkini');
    expect(volkAusAdjektiv('Daikini')).toBe('Dalkini');
    expect(volkAusAdjektiv('Drow')).toBe('Draw');
    expect(volkAusAdjektiv('Zwergisch')).toBe('Zwerge');
  });

  it('bleibt bei "Alle", generischen oder fehlenden Werten undefined (= ALLE)', () => {
    expect(volkAusAdjektiv('Alle')).toBeUndefined();
    expect(volkAusAdjektiv('Spezial/Legendaer')).toBeUndefined();
    expect(volkAusAdjektiv('None')).toBeUndefined();
    expect(volkAusAdjektiv(undefined)).toBeUndefined();
  });
});

describe('parseGegenstandVoelker: Spalten-Rohwert -> kanonische Voelkerliste (Nutzer 2026-09-12: "kein Volk angegeben = alle Voelker")', () => {
  it('ALLE/Standard/fehlend werden zu undefined (= ALLE)', () => {
    expect(parseGegenstandVoelker(undefined)).toBeUndefined();
    expect(parseGegenstandVoelker('ALLE')).toBeUndefined();
    expect(parseGegenstandVoelker('Standard')).toBeUndefined();
  });

  it('parst eine Komma-Liste vollstaendig, nicht nur den ersten Eintrag', () => {
    expect(parseGegenstandVoelker('Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge')).toEqual(
      ['Dalkini', 'Draw', 'Elfen', 'Goblins', 'Orks', 'Trolle', 'Zwerge'],
    );
  });

  it('loest bekannte Falschschreibungen (Drow/Goblin) auf die kanonischen Namen auf', () => {
    expect(parseGegenstandVoelker('Drow')).toEqual(['Draw']);
    expect(parseGegenstandVoelker('Goblin')).toEqual(['Goblins']);
  });

  it('unbekannte Freitext-Werte (z.B. "andere Voelker") ergeben undefined statt eines leeren Arrays', () => {
    expect(parseGegenstandVoelker('andere Voelker')).toBeUndefined();
  });
});

describe('effektiveVerfuegbarkeitKomponenten: Spec-Punkt 23 (jede Komponente separat ortsberechnet, schlechtestes Ergebnis gewinnt)', () => {
  function row(aw: string | undefined, nw: string | undefined, volk?: string): GenericRow {
    const r: Record<string, string> = { name: 'Test' };
    if (aw !== undefined) r['Verfuegbarkeit-AW'] = aw;
    if (nw !== undefined) r['Verfuegbarkeit-NW'] = nw;
    if (volk !== undefined) r['Volk'] = volk;
    return { ...r, sourceRow: -1 } as GenericRow;
  }

  it('eine voelkerfremde Komponente (z.B. Kette fuer Trolle) wird NICHT hart gesperrt, sondern nur schlechter bewertet', () => {
    // Synthetischer, "neutraler" Ort (keine Siedlungsgroesse/Handelsstufe/Herstellungsort/
    // Haendler/Garnison/lokale Produktion) - damit ausschliesslich der Voelker-Modifikator den
    // Unterschied macht, nicht von Floor/Ceiling anderer, staerker wirkender Ortskategorien
    // verschluckt (Straitmor/Phoenix-Feste sind zu extrem ausgestattet, um das isoliert zu zeigen).
    const neutralerOrt = {
      ...straitmor, siedlungsgroesse: undefined, handelsstufe: undefined, herstellungsort: undefined,
      haendler: [], lokaleProduktion: [], garnisonsgrad: undefined, hauptspezies: 'Zwerge' as const, etablierteMinderheiten: [],
    };
    const eigeneBasis = row('1', '1', 'Zwerge');
    const fremdeBasis = row('1', '1', 'Elfen');
    const eigen = effektiveVerfuegbarkeitKomponenten(
      [eigeneBasis], 'AW', { ort: neutralerOrt, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' },
    );
    const fremd = effektiveVerfuegbarkeitKomponenten(
      [fremdeBasis], 'AW', { ort: neutralerOrt, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' },
    );
    // Keine harte Sperre (kein `undefined`, keine geworfene Ausnahme) - nur eine schlechtere Zahl.
    expect(typeof fremd).toBe('number');
    expect(fremd as number).toBeGreaterThan(eigen as number);
  });

  it('das schlechteste Komponentenergebnis gewinnt (numerisches Maximum)', () => {
    const basis = row('1', '1');
    const material = row('3', '5');
    const effektiv = effektiveVerfuegbarkeitKomponenten(
      [basis, material], 'NW', { ort: undefined, warengruppe: 'NK-Waffen', tarif: 'ruestungenWaffen' },
    );
    expect(effektiv).toBe(5);
  });

  it('`M` schlaegt jeden numerischen Wert, `NICHT KAUFBAR` schlaegt `M`', () => {
    const numerisch = row('1', '1');
    const meister = row('M', 'M');
    const nichtKaufbar = row('NICHT KAUFBAR', 'NICHT KAUFBAR');
    expect(effektiveVerfuegbarkeitKomponenten([numerisch, meister], 'AW', { ort: undefined, warengruppe: 'x', tarif: 'ruestungenWaffen' })).toBe('M');
    expect(effektiveVerfuegbarkeitKomponenten([meister, nichtKaufbar], 'AW', { ort: undefined, warengruppe: 'x', tarif: 'ruestungenWaffen' })).toBe('NICHT KAUFBAR');
  });

  it('fehlende Welt (kein Herkunftsort/-snapshot) ergibt undefined', () => {
    expect(effektiveVerfuegbarkeitKomponenten([row('1', '1')], undefined, { ort: undefined, warengruppe: 'x', tarif: 'ruestungenWaffen' })).toBeUndefined();
  });
});
