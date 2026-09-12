import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => JSON.parse(readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
const minima = read('src/data/voelkerMaxima.json');
const tables = read('src/data/lookups.json');
const rules = read('src/data/rules.json');
const cost = (table, value) => {
  const row = tables[table].find((entry) => Number(entry.Wert) === value);
  assert(row, `Fehlender Kostenwert ${table}: ${value}`);
  return Number(row['Gesamt-EP']);
};
// Stufe 0 = Kreis 0; Kreis+ verwendet die mittlere Stufe. Keine Minima-Abschläge.
const stages = [0, 1, 2].map((level, index) => {
  const row = tables['EP-Stufe-Kreis'].find(entry => Number(entry.Stufe) === level);
  assert(row, 'Fehlende EP-Stufe');
  return { label: ['0', '1', '1+'][index], level, budget: 6400 + Number(row['EP ab']) };
});
const species = [...new Set(minima.map((row) => row.volk))];
const details = species.flatMap((volk) => stages.map((stage) => {
  const rows = minima.filter((row) => row.volk === volk);
  assert.equal(rows.length, 10, `${volk}: zehn Eigenschaften erwartet`);
  const properties = rows.map((row) => {
    const minimum = row.erstellungsMin;
    return { property: row.eigenschaft, original: row.erstellungsMin, minimum, cost: cost('Eigenschaften-Kosten', minimum) };
  });
  const total = properties.reduce((sum, row) => sum + row.cost, 0);
  return { volk, stage: stage.label, level: stage.level, budget: stage.budget, properties, total, afterSsk: stage.budget - total - 90 };
}));
const examples = ['bauer', 'wachmann', 'hauptmann', 'schuetze', 'nahkaempfer', 'ki'].map((id) => {
  const character = read(`src/addins/npc/data/npc/${id}.json`);
  const sumCategory = (category) => rules.filter((rule) => rule.kategorie === category && rule.art === 'Wert').reduce((sum, rule) => {
    const value = character.values[rule.referenz] ?? 0;
    assert.equal(rule.kostenRaw, 'wert*9', `Kostenformel geändert: ${rule.referenz}`);
    return sum + Math.ceil(value * 9);
  }, 0);
  const gf = sumCategory('Grundfertigkeit');
  const sf = sumCategory('Sonderfertigkeit');
  const budget = 6400 + (character.values.ep_gesamt ?? 0);
  return { id, gf, sf, total: gf + sf, budget, percent: Math.ceil((gf + sf) * 10000 / budget) / 100 };
});

const out = new URL('../docs/', import.meta.url);
// Nur berechnete Abschnitte ersetzen; bestätigte redaktionelle Entscheidungen erhalten.
const documentUrl = new URL('Budgetgrundlage.md', out);
let document = readFileSync(documentUrl, 'utf8').replace(/\r\n/g, '\n');
const replaceSection = (heading, next, body) => {
  const start = document.indexOf(heading);
  const end = next ? document.indexOf(next, start + heading.length) : document.length;
  assert(start >= 0 && end > start, 'Budgetabschnitt fehlt: ' + heading);
  document = document.slice(0, start) + heading + '\n\n' + body + '\n\n' + document.slice(end);
};
replaceSection('## Kosten der Volksminima', '## SSK-Pflichtbündel', [
  'Volle reguläre Minima in allen Kreisen. Stufe 0 hat 6.400 SP, Kreis 1 beginnt mit 6.420 SP; Kreis 1+ liegt auf Stufe 2 mit 6.460 SP.', '',
  '| Volk | Regulärer Sockel | Stufe 0: Rest nach 90 SSK | Kreis 1: Rest nach 90 SSK | Kreis 1+: Rest nach 90 SSK |',
  '|---|---:|---:|---:|---:|',
  ...species.map(volk => { const rows = details.filter(row => row.volk === volk); return '| ' + volk + ' | ' + rows[0].total + ' | ' + rows.map(row => row.afterSsk).join(' | ') + ' |'; }), '',
  'Der Rest ist noch kein frei verteilbares Budget: GF/SF, WHK, Attribute, Aussehen, zusätzliche Voraussetzungen, Beruf, Kampf und Magie sind noch zu bezahlen. Bei Schriftbedarf kommen mindestens 30 SP, beim Händler für eine andere Sprache weitere 30 SP hinzu. Prozentminima werden durch tatsächliche Käufe erfüllt und nicht zusätzlich abgezogen.'
].join('\n'));
replaceSection('## Einzelwerte zur Nachprüfung', null, species.flatMap(volk => [
  '### ' + volk, '', '| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |', '|---|---:|---:|',
  ...details.find(row => row.volk === volk).properties.map(row => '| ' + row.property + ' | ' + row.minimum + ' | ' + row.cost + ' |'), ''
]).join('\n'));
assert.equal(cost('Sprachstufe-Kosten', 2), 30);
assert.equal(details.find(row => row.volk === 'Trolle').total, 3351);
assert(details.every(row => row.properties.every(property => property.minimum === property.original)));
writeFileSync(documentUrl, document.trimEnd() + '\n');
writeFileSync(new URL('Budgetdaten.json', out), JSON.stringify({ model: 'Reguläre Volksminima; SP = 6400 + EP; Kreis+ = mittlere Stufe; kein eigener Kreis 0+', details, examples }, null, 2) + '\n');
console.log(JSON.stringify({ species: species.length, details: details.length, stages }, null, 2));
