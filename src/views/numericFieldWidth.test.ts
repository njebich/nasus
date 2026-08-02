import { describe, expect, it } from 'vitest';
import { numericFieldWidthClass } from './numericFieldWidth';

describe('numericFieldWidthClass', () => {
  it('reserviert einstellige und zweistellige positive Werte statisch', () => {
    expect(numericFieldWidthClass(9)).toBe('numeric-field-one');
    expect(numericFieldWidthClass(99)).toBe('numeric-field-two');
  });

  it('reserviert bei moeglichen negativen zweistelligen Werten auch das Minuszeichen', () => {
    expect(numericFieldWidthClass(99, true)).toBe('numeric-field-signed-two');
  });

  it('reserviert fuer groessere oder unbekannte Bereiche immer Platz fuer -99999', () => {
    expect(numericFieldWidthClass(100)).toBe('numeric-field-signed-five');
    expect(numericFieldWidthClass(undefined)).toBe('numeric-field-signed-five');
  });
});
