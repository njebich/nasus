import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
// Ganzzahlige Prozentrechnung verhindert versehentliches Aufrunden durch Float-Artefakte.
const scale = (value, percent) => { const rounded = Math.floor((value * percent + 99) / 100); return percent < 100 && rounded === value ? value - (percent === 80 ? 2 : 1) : rounded; };
const stages = [{ label: '0', percent: 80, budget: 5120 }, { label: '0+', percent: 90, budget: 5760 }, { label: '1', percent: 100, budget: 6400 }];
const species = [...new Set(minima.map((row) => row.volk))];
const details = species.flatMap((volk) => stages.map((stage) => {
  const rows = minima.filter((row) => row.volk === volk);
  assert.equal(rows.length, 10, `${volk}: zehn Eigenschaften erwartet`);
  const properties = rows.map((row) => {
    const minimum = scale(row.erstellungsMin, stage.percent);
    return { property: row.eigenschaft, original: row.erstellungsMin, minimum, cost: cost('Eigenschaften-Kosten', minimum) };
  });
  const total = properties.reduce((sum, row) => sum + row.cost, 0);
  return { volk, stage: stage.label, budget: stage.budget, properties, total, afterSsk: stage.budget - total - 90 };
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
const lines = [
  '# NPC-Budgetgrundlage', '', 'Stand: 8. September 2026. Berechnet aus den aktuellen Client-Regeldaten. Dies ist die Planungsgrundlage für wertelose Templates und Arbeitsaufträge; die laufende Charakterberechnung wurde nicht geändert.', '',
  '## Verbindliche Berechnung', '',
  '- Nach jeder Multiplikation aufrunden. Bei den Minima jede Eigenschaft einzeln skalieren und aufrunden. Bleibt der gerundete Wert unverändert, stattdessen vom ursprünglichen Minimum 2 (Kreis 0) oder 1 (Kreis 0+) abziehen. Danach die vollständigen Kosten nachschlagen und summieren. Kein Zusatzabzug, wenn die Prozentrechnung bereits senkt.',
  '- Kreis 0: 80 % der Volksminima, 5.120 SP. Kreis 0+: 90 %, 5.760 SP. Ab Kreis 1: volle Volksminima; hier wird für den Vergleich das Einstiegsbudget von 6.400 SP verwendet.',
  '- Höhere Kreise behalten den regulären Eigenschaftssockel; ihr größeres Gesamtbudget ist separat zu bestimmen.',
  '- Es werden zehn Eigenschaften erfasst. Attribute, weitere Eigenschaftssteigerungen und Fähigkeiten gehören nicht zu diesem Sockel.',
  '- Die Kostenspalte heißt in der Quelldatei „Gesamt-EP“, wird in der App aber als SP-Ausgabe verwendet.', '',
  '## Kosten der Volksminima', '',
  '| Volk | Kreis 0: Sockel | Kreis 0: Rest nach 90 SSK | Kreis 0+: Sockel | Kreis 0+: Rest nach 90 SSK | Kreis 1: Sockel | Kreis 1: Rest nach 90 SSK |',
  '|---|---:|---:|---:|---:|---:|---:|',
  ...species.map((volk) => `| ${volk} | ${details.filter((row) => row.volk === volk).flatMap((row) => [row.total, row.afterSsk]).join(' | ')} |`), '',
  'Der Rest ist noch kein frei verteilbares Budget: Aussehen, zusätzliche Voraussetzungen, GF/SF, Beruf, Kampf und Magie sind noch abzuziehen. Beim Händler kommen für die zusätzliche Sprache weitere 30 SP hinzu.', '',
  '## SSK-Pflichtbündel', '',
  '- Aktuelle App-Regel: mindestens 90 SP in Sprache, Schrift und Kultur sowie mindestens eine Sprache auf Stufe 1 oder höher. Lesen/Schreiben ist dadurch nicht automatisch Pflicht.',
  '- Sprach- und Schriftkosten: Stufe 1 = 15 SP, Stufe 2 = 30 SP, Stufe 3 = 50 SP, Stufe 4 = 75 SP.',
  '- Kulturkosten: Stufe 1 = 10 SP, Stufe 2 = 25 SP, Stufe 3 = 40 SP, Stufe 4 = 55 SP.',
  '- Beispielstub ohne Schrift: Hauptsprache 3 (50) + Herkunftskultur 3 (40) = 90 SP. Dies ist ein Vorschlag, keine allgemeine Sprachstufenvorgabe.',
  '- Händler: eine andere, zusätzliche Sprache auf Stufe 2 = 30 SP zusätzlich zum allgemeinen Bündel; mit dem 90-SP-Stub insgesamt 120 SP. Dieselbe Sprache darf nicht doppelt zählen.',
  '- Sprache anhand Herkunft und Handelsgebiet wählen. Besitzt ein gewählter SSK-Stub diese Zweitsprache bereits, einen anderen Stub wählen oder den Überschneidungsfall sichtbar auflösen, statt 30 SP ohne Leistung abzuziehen.', '',
  '## Aussehen und Schlaf sind Pflichtauswahlen', '',
  'Für jeden NPC genau eine Aussehensstufe und eine Schlafstufe festlegen; zufällige Auswahl anschließend im Auftrag festhalten. Wahrscheinlichkeiten sind noch nicht festgelegt. Ein Zufallswurf wird beim Neuberechnen nicht wiederholt.', '',
  '| Aussehen im Regeldatensatz | SP | Voraussetzung |', '|---|---:|---|',
  ...rules.filter((row) => row.referenz.startsWith('vn_aussehen_') && row.referenz !== 'vn_aussehen_allerweltsgesicht').map((row) => `| ${row.beschreibung} | ${row.kostenRaw} | ${row.flag ?? '—'} |`), '',
  'Die fünf geordneten Aussehensstufen sind Widerwärtiges Aussehen, Hässlichkeit, Normal, Gutes Aussehen und Herausragendes Aussehen. Allerweltsgesicht ist aus dem NPC-Template und Randomizer ausgeschlossen.',
  'Gutes/herausragendes Aussehen kann zusätzliche Ausstrahlungssteigerungen erfordern. Diese Mehrkosten oberhalb des Volkssockels separat reservieren. Negative Aussehenskosten geben SP zurück.', '',
  '| Schlaf im Regeldatensatz | SP | Wirkung |', '|---|---:|---|',
  ...rules.filter((row) => row.referenz.startsWith('vn_schlaf_')).map((row) => `| ${row.beschreibung} | ${row.kostenRaw} | ${row.wirkung} |`), '',
  'Verbindlich gibt es genau vier Schlafstufen. Es fehlt keine fünfte Stufe. Pflichtauswahl bedeutet hier keine positiven Fixkosten: alle vier vorhandenen Optionen kosten 0 SP.', '',
  '## GF/SF-Bündel: Referenzmessung', '',
  'Grund- und Sonderfertigkeiten kosten im aktuellen Regelstand jeweils 9 SP pro gekauftem Punkt. Die folgende Auswertung umfasst sämtliche GF/SF der sechs vorhandenen Vorlagen, einschließlich beruflicher, kämpferischer und magischer Sonderfertigkeiten. Sie ist deshalb noch kein universelles Grundausbildungsbündel.', '',
  '| Referenz | GF | SF | Zusammen | Gesamt-SP | Anteil, auf 0,01 Prozentpunkte aufgerundet |', '|---|---:|---:|---:|---:|---:|',
  ...examples.map((row) => `| ${row.id} | ${row.gf} | ${row.sf} | ${row.total} | ${row.budget} | ${row.percent.toFixed(2)} % |`), '',
  'Noch keinen pauschalen Prozentsatz als Regel festschreiben. Zuerst gemeinsame Alltagsausbildung und berufliche/kämpferische/magische Zusätze trennen. Jede Fähigkeit wird einmal bezahlt und kann mehrere Anforderungen erfüllen.',
  'Vorschlag für spätere Prozentbündel: Reservierung = aufrunden(Gesamt-SP × Anteil). Ein gewöhnlicher GF/SF-Punkt kostet 9 SP; die Reservierung ist daher nicht immer vollständig in solche Punkte umsetzbar. Nicht ausgegebene SP bleiben sichtbar und werden zurückgegeben. Keine Überschreitung durch zusätzliches Aufrunden auf neun.', '',
  '## Technischer Abgleich', '',
  'Der aktuelle App-Sockel beträgt weiterhin 6.400 + Gesamt-EP, und die Eigenschaftsprüfung verwendet noch die ungekürzten Volksminima. Kreis 0/0+ aus dieser Planung müssen vor einer echten Charaktererzeugung eigens integriert werden. Negative EP sind kein Ersatz dafür. Stufe 0 der bisherigen Referenzdateien ist nicht mit dem neuen Kreis 0 gleichzusetzen.', '',
  'Quellen: src/data/voelkerMaxima.json; src/data/lookups.json (Eigenschaften-Kosten, Sprachstufe-Kosten, Kulturstufe-Kosten); src/data/rules.json; src/engine/characterSheet.ts (SSK_MINDEST_SP = 90); src/addins/npc/data/npc/*.json.', '',
  '## Einzelwerte zur Nachprüfung', '',
  ...species.flatMap((volk) => [
    `### ${volk}`, '', '| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |', '|---|---:|---:|---:|---:|',
    ...details.filter((row) => row.volk === volk)[0].properties.map((property, index) => `| ${property.property} | ${property.original} | ${details.filter((row) => row.volk === volk).map((row) => `${row.properties[index].minimum} / ${row.properties[index].cost}`).join(' | ')} |`), '',
  ]),
];
assert.equal(cost('Sprachstufe-Kosten', 2), 30);
assert.equal(scale(11, 80), 9);
assert.equal(scale(13, 90), 12);
assert.equal(scale(3, 80), 1);
assert.equal(scale(3, 90), 2);
assert.equal(scale(5, 80), 4);
assert.equal(scale(5, 90), 4);
assert.equal(scale(9, 90), 8);
assert.equal(scale(10, 90), 9);
assert.equal(scale(3, 100), 3);
const out = new URL('../docs/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('Budgetgrundlage.md', out), lines.join('\n'));
writeFileSync(new URL('Budgetdaten.json', out), JSON.stringify({ details, examples }, null, 2));
console.log(JSON.stringify({ species: species.length, details: details.length, examples }, null, 2));
