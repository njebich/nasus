import { describe, it, expect } from 'vitest';
import { TREFFERZONEN } from '../data/trefferzonen';
import { getTrefferzone, computeRsFuerTrefferzone } from './trefferzonen';

const RS = { kopf: 4, torso: 6, arme: 3, beine: 5 };

describe('Trefferzonentabelle (Nutzer 2026-07-17, aus "NN Meisterscreen S1 v0.31.docx")', () => {
  it('enthaelt genau 29 Zonen (Wurf 1-29, Streiftreffer 0/30 bewusst ausgeschlossen)', () => {
    expect(TREFFERZONEN).toHaveLength(29);
    expect(TREFFERZONEN.map((tz) => tz.wurf)).toEqual(Array.from({ length: 29 }, (_, i) => i + 1));
  });

  it('wirft einen klaren Fehler fuer einen unbekannten Trefferwurf', () => {
    expect(() => getTrefferzone(0)).toThrow(/keine bekannte Trefferzone/);
    expect(() => getTrefferzone(30)).toThrow(/keine bekannte Trefferzone/);
  });

  it('normale Zonen bekommen die volle RS ihrer Gruppe', () => {
    expect(computeRsFuerTrefferzone(1, RS)).toBe(4); // Kopf
    expect(computeRsFuerTrefferzone(2, RS)).toBe(6); // Brust Mitte -> Torso
    expect(computeRsFuerTrefferzone(5, RS)).toBe(3); // L. Oberarm -> Arme
    expect(computeRsFuerTrefferzone(7, RS)).toBe(5); // L. Oberschenkel -> Beine
  });

  it('Huefte zaehlt zur Bein-Ruestung (Nutzer 2026-07-17)', () => {
    expect(getTrefferzone(14).rsGruppe).toBe('beine');
    expect(computeRsFuerTrefferzone(14, RS)).toBe(5);
  });

  it('Schultergelenk zaehlt zur Arm-Ruestung, aber mit halber RS', () => {
    expect(getTrefferzone(25).rsGruppe).toBe('arme');
    expect(getTrefferzone(25).halbeRs).toBe(true);
    expect(computeRsFuerTrefferzone(25, RS)).toBe(2); // aufgerundet 3/2=1.5 -> 2
  });

  it('Hals zaehlt zur Kopf-Ruestung, mit halber RS (trotz "K"-Markierung im Dokument, die nicht halbe RS bedeutet)', () => {
    expect(getTrefferzone(21).rsGruppe).toBe('kopf');
    expect(getTrefferzone(21).halbeRs).toBe(true);
    expect(computeRsFuerTrefferzone(21, RS)).toBe(2); // aufgerundet 4/2=2
  });

  it('Ellenbogen und Knie bekommen halbe RS (Nutzer 2026-07-17)', () => {
    expect(computeRsFuerTrefferzone(22, RS)).toBe(2); // Ellenbogen -> Arme/2 = 1.5 -> 2
    expect(computeRsFuerTrefferzone(17, RS)).toBe(3); // Knie -> Beine/2 = 2.5 -> 3
  });

  it('"Arm" (Zone 23, ganzer Arm getroffen) bekommt volle RS, nicht halbe wie Ellenbogen', () => {
    expect(getTrefferzone(23).halbeRs).toBe(false);
    expect(computeRsFuerTrefferzone(23, RS)).toBe(3);
  });

  it('Augen koennen strukturell nie durch Ruestung geschuetzt werden (Nutzer 2026-07-17: keine pauschale RS=0-Zahl, sondern nie-schuetzbar)', () => {
    expect(getTrefferzone(29).rsGruppe).toBeNull();
    expect(computeRsFuerTrefferzone(29, RS)).toBe(0);
    // Bleibt 0 auch bei einer sehr hohen Kopf-RS - es gibt keinen Pfad, ueber den Ruestung hier je greift.
    expect(computeRsFuerTrefferzone(29, { ...RS, kopf: 99 })).toBe(0);
  });

  it('Unterleib (Organ) und Brust (Lunge)/Herz zaehlen zur Torso-Ruestung, mit voller RS', () => {
    expect(computeRsFuerTrefferzone(26, RS)).toBe(6);
    expect(computeRsFuerTrefferzone(27, RS)).toBe(6);
    expect(computeRsFuerTrefferzone(28, RS)).toBe(6);
  });

  it('Hand und Fuss bekommen nur halbe RS (Korrektur 2026-07-17: Legende einer anderen Version listet Haende/Fuesse explizit mit "K, S, E, H, Kn, F = halbe RS")', () => {
    expect(getTrefferzone(18).halbeRs).toBe(true);
    expect(getTrefferzone(24).halbeRs).toBe(true);
    expect(computeRsFuerTrefferzone(18, RS)).toBe(2); // Hand -> Arme/2 = 1.5 -> 2
    expect(computeRsFuerTrefferzone(24, RS)).toBe(3); // Fuss -> Beine/2 = 2.5 -> 3
  });

  it('genau 6 Zonen bekommen halbe RS: Hals, Schultergelenk, Ellenbogen, Hand, Knie, Fuss', () => {
    const halbeRsNamen = TREFFERZONEN.filter((tz) => tz.halbeRs).map((tz) => tz.name).sort();
    expect(halbeRsNamen).toEqual(['Ellenbogen', 'Fuß', 'Hals', 'Hand', 'Knie', 'Schultergelenk'].sort());
  });
});
