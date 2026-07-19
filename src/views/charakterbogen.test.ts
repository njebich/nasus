import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { computeSheet } from '../engine/characterSheet';
import { renderCharakterbogen } from './charakterbogen';

describe('gedruckter Herkunftsheader', () => {
  it('druckt fuer die Herkunft ausschliesslich Ort, Region und AW/NW', () => {
    const character = createCharacter('Test', {
      spezies: 'Orks', herkunftOrtId: 'straitmor',
      herkunftSnapshot: { name: 'Straitmor', region: 'Orkisches Protektorat Straitmor', welt: 'NW' },
    });
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const herkunft = [...container.querySelectorAll('tr')].find((row) => row.querySelector('th')?.textContent === 'Herkunft');
    expect(herkunft?.querySelector('td')?.textContent).toBe('Straitmor, Orkisches Protektorat Straitmor, NW');
    expect(herkunft?.textContent).not.toContain('Metropole');
  });
});
