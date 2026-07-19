import { describe, expect, it } from 'vitest';
import { ARMBRUST, BOEGEN } from './fernkampf';

describe('Fernkampfpreise aus den Basis-Sheets', () => {
  it('enthaelt fuer jeden Bogen einen numerischen Preis', () => {
    expect(BOEGEN).toHaveLength(41);
    expect(BOEGEN.every((row) => typeof row.preisDublonen === 'number')).toBe(true);
    expect(BOEGEN[1].name).toBe('Kurzbogen');
    expect(BOEGEN.find((row) => row.name === 'Schwarzfels-Bogen')?.preisDublonen).toBe(1500);
    expect(BOEGEN.find((row) => row.name === 'Drachenbogen')?.preisDublonen).toBe(1_000_000);
  });

  it('enthaelt fuer jede Armbrust den Preis aus der Preis-Spalte H', () => {
    expect(ARMBRUST).toHaveLength(38);
    expect(ARMBRUST.every((row) => typeof row.preisDublonen === 'number')).toBe(true);
    expect(ARMBRUST.find((row) => row.name === 'Improvisierte Armbrust')?.preisDublonen).toBe(0.001);
    expect(ARMBRUST[1].name).toBe('Hand Armbrust');
    expect(ARMBRUST.find((row) => row.name === 'Balläster')?.preisDublonen).toBe(300);
  });
});
