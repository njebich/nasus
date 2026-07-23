import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { makeValueSource } from './characterSheet';
import { gesBonWert, ladezeitKr, feuerwaffenLadeschuetzeReferenz, computeArmbrustLadezeitLabel } from './fernkampfLadezeit';

describe('gesBonWert', () => {
  it('AUFRUNDEN(Geschicklichkeit/2;0)-5', () => {
    const character = createCharacter('Test');
    character.values['eig_k_geschicklichkeit'] = 15;
    expect(gesBonWert(makeValueSource(character))).toBe(3); // aufrunden(7.5)=8, -5=3
  });
});

describe('ladezeitKr', () => {
  it('subtracts the aufgerundet reduction and never drops below 1', () => {
    // Hakenbuechse: Ladezeit 39, Teiler 3, Ges.Bon 0, Ladeschuetze 0 -> keine Reduktion.
    expect(ladezeitKr(39, 3, 0, 0)).toBe(39);
    // reduktion = aufrunden((3+2)/3) = aufrunden(1.667) = 2 -> 39-2=37
    expect(ladezeitKr(39, 3, 3, 2)).toBe(37);
  });

  it('floors at 1 KR, never lower', () => {
    expect(ladezeitKr(2, 1, 20, 20)).toBe(1);
  });

  it('teiler 0 means no reduction', () => {
    expect(ladezeitKr(10, 0, 5, 5)).toBe(10);
  });
});

describe('feuerwaffenLadeschuetzeReferenz', () => {
  it('Vorderlader uses its own SF', () => {
    expect(feuerwaffenLadeschuetzeReferenz('Vorderlader')).toBe('sf_ladeschuetze_vorderlader');
  });
  it('Hinterlader/Klapplauf/Block-oder-Scharnierverschluss share "Patrone"', () => {
    expect(feuerwaffenLadeschuetzeReferenz('Hinterlader')).toBe('sf_ladeschuetze_patrone');
    expect(feuerwaffenLadeschuetzeReferenz('Klapplauf')).toBe('sf_ladeschuetze_patrone');
    expect(feuerwaffenLadeschuetzeReferenz('Block- oder Scharnierverschluss')).toBe('sf_ladeschuetze_patrone');
  });
});

describe('computeArmbrustLadezeitLabel', () => {
  // Hand Armbrust (Daikini): Hand 9/14/4, Geissfuss 5/30/2, Winde 3/60/1.
  const handArmbrust: Record<string, string> = {
    'Ladetechnik Hand: min.Stä': '9', 'Ladetechnik Hand: Ladezeit': '14', 'Ladetechnik Hand: Ladezeit-Teiler': '4',
    'Ladetechnik Geißfuß: min.Stä': '5', 'Ladetechnik Geißfuß: Ladezeit': '30', 'Ladetechnik Geißfuß: Ladezeit-Teiler': '2',
    'Ladetechnik Winde: min.Stä': '3', 'Ladetechnik Winde: Ladezeit': '60', 'Ladetechnik Winde: Ladezeit-Teiler': '1',
  };

  it('picks the fastest technique the character\'s Staerke fulfils', () => {
    // Staerke 9 erfuellt alle drei -> Hand ist am schnellsten (14 KR, keine Reduktion).
    expect(computeArmbrustLadezeitLabel(handArmbrust, 9, 0, 0)).toBe('14 KR');
  });

  it('falls back to a slower technique once the fastest is out of reach', () => {
    // Staerke 5 erfuellt nur Geissfuss (30) und Winde (60) -> Geissfuss gewinnt.
    expect(computeArmbrustLadezeitLabel(handArmbrust, 5, 0, 0)).toBe('30 KR');
  });

  it('returns "x" when no technique is fulfilled', () => {
    expect(computeArmbrustLadezeitLabel(handArmbrust, 1, 0, 0)).toBe('x');
  });

  it('Repetier-Armbrust always prints both R and M, ignoring Staerke-Gating', () => {
    const repetier: Record<string, string> = {
      'Ladetechnik Repetieren: min.Stä': '9', 'Ladetechnik Repetieren: Ladezeit': '6', 'Ladetechnik Repetieren: Ladezeit-Teiler': '10',
      'Ladetechnik Repetierer Nachladen: min.Stä': '1', 'Ladetechnik Repetierer Nachladen: Ladezeit': '16', 'Ladetechnik Nachladen: Ladezeit-Teiler': '6',
    };
    expect(computeArmbrustLadezeitLabel(repetier, 1, 0, 0)).toBe('R 6 KR / M 16 KR');
  });

  it('Ladeschuetze + Ges.Bon reduce the chosen technique\'s KR', () => {
    // Hand: reduktion = aufrunden((3+1)/4) = 1 -> 14-1=13
    expect(computeArmbrustLadezeitLabel(handArmbrust, 9, 3, 1)).toBe('13 KR');
  });
});
