// LLM-022: berechnet computedPriceSnapshot aller NK-Waffen in den gespeicherten NPC-Dateien mit der
// neuen Preisformel (RC-096 §3.1) neu. Nur der Preis wird angefasst, sonst nichts.
// Aufruf: node src/addins/npc/scripts/recompute-weapon-prices.mjs [--write]
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const write = process.argv.includes('--write');
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const server = await createServer({ root, configFile: false, appType: 'custom', server: { middlewareMode: true, hmr: false, watch: null } });
try {
  const { composeWeapon } = await server.ssrLoadModule('/src/engine/weaponComposition.ts');
  const W = await server.ssrLoadModule('/src/data/equipment/weapons.ts');
  const by = (rows, sourceRow) => rows.find((r) => String(r.sourceRow) === String(sourceRow));
  const dirs = ['src/addins/npc/data/npc', 'outputs/goblin-regelkorrektur-2026-09-11', 'outputs/straitmor-nahkaempfer-20260913'];
  const files = dirs.flatMap((d) => readdirSync(root + d).filter((f) => f.endsWith('.json')).map((f) => root + d + '/' + f));
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const data = JSON.parse(text);
    const character = data.character ?? data;
    let changed = 0;
    for (const e of character.equipment ?? []) {
      if (e.family !== 'weapon' || e.baseTable !== 'nk_waffen_basis') continue;
      const s = e.selections;
      const parts = [by(W.NK_WAFFEN_BASIS, e.baseId), by(W.NK_MATERIAL, s.material), by(W.NK_FERTIGUNG, s.fertigung),
        by(W.NK_ANPASSUNG, s.anpassung), by(W.NK_SCHAFTMATERIAL, s.schaftmaterial)];
      if (parts.some((p) => !p)) { console.log(`${file}: ${e.displayNameSnapshot} - Katalogzeile fehlt`, e.baseId, s); continue; }
      const neu = composeWeapon(...parts).preis;
      if (neu !== e.computedPriceSnapshot) {
        console.log(`${file.split(/[\/]/).pop()}: ${e.displayNameSnapshot}: ${e.computedPriceSnapshot} -> ${neu}`);
        e.computedPriceSnapshot = neu;
        changed++;
      }
    }
    if (write && changed) {
      const indent = /^\{\r?\n( +)"/.exec(text)?.[1].length ?? 2;
      const eol = text.includes('\r\n') ? '\r\n' : '\n';
      const out = JSON.stringify(data, null, indent).replace(/\n/g, eol) + (/\r?\n$/.test(text) ? eol : '');
      writeFileSync(file, out);
    }
  }
} finally {
  await server.close();
}
