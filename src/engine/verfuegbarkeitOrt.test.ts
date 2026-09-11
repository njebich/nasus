import { describe, expect, it } from 'vitest';
import { effektiveVerfuegbarkeit, ortsModifikator, volkAusAdjektiv } from './verfuegbarkeitOrt';
import { VORDEFINIERTE_ORTE } from '../data/orte';

const straitmor = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'straitmor')!;
const zwogon = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'zwogon')!;
const phoenixFeste = VORDEFINIERTE_ORTE.find((ort) => ort.id === 'phoenix-feste')!;

describe('Ortsmodifikator auf die 1-7-Verfuegbarkeitsskala', () => {
  it('macht eine orkische Feuerwaffe in ihrer orkischen Heimat-Metropole kaufbar (Ausgangsfall)', () => {
    // Durass (Orkisch), raw Verfuegbarkeit 75 -> Basisstufe 6 ("Nie"), regulaer fuer SC gesperrt.
    const effektiv = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Orks',
    });
    expect(effektiv).toBe(1);
  });

  it('gewaehrt den lokalen Produktionsbonus nur dem passenden Volk, nicht generell', () => {
    // Hakenbuechse (Dalkinisch), raw Verfuegbarkeit 85 -> Basisstufe 6. Straitmors lokale
    // Feuerwaffen-Produktion ist an "Orks" gebunden, greift fuer Dalkini also NICHT - dafuer
    // schlaegt die Voelker/Ortsbevoelkerung-Fremdheit (+3) zu, da Dalkini in Straitmor weder
    // Hauptspezies noch etablierte Minderheit ist.
    const effektivOrkisch = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Orks',
    });
    const effektivDalkinisch = effektiveVerfuegbarkeit(6, {
      ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Dalkini',
    });
    expect(effektivDalkinisch!).toBeGreaterThan(effektivOrkisch!);
  });

  it('behandelt eine etablierte Minderheit besser als eine ganz fremde Spezies, aber schlechter als die Hauptspezies', () => {
    const hauptspezies = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Orks' });
    const minderheit = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Zwerge' });
    const fremd = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Elfen' });
    expect(hauptspezies).toBeLessThan(minderheit);
    expect(minderheit).toBeLessThan(fremd);
  });

  it('nimmt bei ALLE (kein gegenstandVolk) keinen Voelkermodifikator', () => {
    const mitVolk = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Elfen' });
    const ohneVolk = ortsModifikator({ ort: straitmor, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' });
    expect(ohneVolk).toBeLessThan(mitVolk);
  });

  it('verrechnet Siedlungsgroesse, Handelsstufe, Herstellung direkt vor Ort und Großer-spezialisierter-Haendler zusammen (Zwogón)', () => {
    const effektiv = effektiveVerfuegbarkeit(4, { ort: zwogon, warengruppe: 'Rüstungen', tarif: 'ruestungenWaffen' });
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
    expect(ortsModifikator({ ort: undefined, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Orks' })).toBe(0);
    expect(effektiveVerfuegbarkeit(6, { ort: undefined, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen' })).toBe(6);
  });

  it('laesst eine fehlende Basisstufe (OFFEN) unveraendert undefined, auch mit gutem Ortsbonus', () => {
    expect(effektiveVerfuegbarkeit(undefined, { ort: straitmor, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Orks' })).toBeUndefined();
  });

  it('begrenzt das Ergebnis nach oben auf 7, auch bei sehr schlechtem Ort', () => {
    const wildnisOhneAlles = {
      ...straitmor, siedlungsgroesse: 'Wildnis' as const, handelsstufe: 'Völlig abgelegen von jeglichem Handel' as const,
      herstellungsort: 'Import, wird nicht hergestellt' as const, haendler: [], lokaleProduktion: [],
    };
    const effektiv = effektiveVerfuegbarkeit(6, { ort: wildnisOhneAlles, warengruppe: 'Feuerwaffen', tarif: 'ruestungenWaffen', gegenstandVolk: 'Orks' });
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
