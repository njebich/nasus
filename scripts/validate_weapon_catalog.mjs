import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

const rules = readJson('src/data/rules.json');
const weapons = readJson('src/data/equipment/weapons.json');
const ranged = readJson('src/data/equipment/fernkampf.json');
const specializations = readJson('src/data/weaponSpecializations.json');
const errors = [];

function unique(values, keyOf, describe, label) {
  const seen = new Map();
  for (const value of values) {
    const key = String(keyOf(value) ?? '');
    const previous = seen.get(key);
    if (previous) {
      errors.push(`${label} '${key}' ist doppelt: ${describe(previous)}; ${describe(value)}`);
    } else {
      seen.set(key, value);
    }
  }
  return seen;
}

const specializationById = unique(
  specializations, (value) => value.id, (value) => value.label, 'Spezialisierungs-ID',
);
const specializationByLabel = unique(
  specializations, (value) => value.label, (value) => value.id, 'Spezialisierungsname',
);
const poolByReference = unique(
  rules.filter((rule) => rule.art === 'Pool' && rule.kategorie === 'Nahkampf'
    && rule.referenz !== 'nk_pool_unbewaffnet'),
  (rule) => rule.referenz,
  (rule) => `Werte Zeile ${rule.sourceRow} (${rule.beschreibung ?? rule.referenz})`,
  'Pool-Referenz',
);

if (rules.some((rule) => rule.referenz === 'nk_pool_unbewaffnet')
  && specializations.some((definition) => definition.poolReferenz === 'nk_pool_unbewaffnet')) {
  errors.push("Der ungültige generische Pool 'nk_pool_unbewaffnet' wird noch von einer Spezialisierung referenziert");
}

for (const definition of specializations) {
  if (!poolByReference.has(definition.poolReferenz)) {
    errors.push(
      `Spezialisierung '${definition.id}' (${definition.label}) verweist auf fehlenden Pool '${definition.poolReferenz}'`,
    );
  }
  if (definition.skillable && !rules.some((rule) => rule.referenz === definition.id)) {
    errors.push(`Skillbare Spezialisierung '${definition.id}' (${definition.label}) fehlt in den Regeln`);
  }
}

const tables = [
  ['NK-Waffen-Basis', weapons.basis],
  ['Bögen-Basis', ranged.boegen],
  ['Armbrust-Basis', ranged.armbrust],
  ['Feuerwaffen', ranged.feuerwaffen],
];
for (const [table, rows] of tables) {
  unique(
    rows, (row) => row.sourceRow, (row) => `${table} Zeile ${row.sourceRow} (${row.name})`,
    `${table} sourceRow`,
  );
  for (const row of rows) {
    const specialization = row.Spezialisierung;
    if (!specialization) {
      errors.push(
        `Ungültige Waffe: Tabelle '${table}', sourceRow ${row.sourceRow}, Waffe '${row.name}', `
        + `Spezialisierung '<fehlt>': Spezialisierung fehlt`,
      );
    } else if (!specializationByLabel.has(specialization)) {
      errors.push(
        `Ungültige Waffe: Tabelle '${table}', sourceRow ${row.sourceRow}, Waffe '${row.name}', `
        + `Spezialisierung '${specialization}': unbekannte Spezialisierung`,
      );
    }
  }
}

for (const [table, rows] of [['Pfeile', ranged.pfeile], ['Bolzen', ranged.bolzen]]) {
  unique(
    rows, (row) => row.sourceRow, (row) => `${table} Zeile ${row.sourceRow} (${row.name})`,
    `${table} sourceRow`,
  );
}

if (!specializationById.has('nk_spez_unbewaffnet_unbewaffnet')
  || specializationById.get('nk_spez_unbewaffnet_unbewaffnet')?.poolReferenz !== 'nk_pool_unbewaffnet_unbewaffnet') {
  errors.push("Unbewaffnet muss ausschließlich auf 'nk_pool_unbewaffnet_unbewaffnet' zeigen");
}

if (errors.length > 0) {
  console.error(`Ungültiger Waffen-Katalog (${errors.length} Fehler):\n${errors.join('\n')}`);
  process.exit(1);
}

console.log(
  `Waffen-Katalog gültig: ${specializations.length} Spezialisierungen, `
  + `${tables.reduce((sum, [, rows]) => sum + rows.length, 0)} Waffenzeilen.`,
);
