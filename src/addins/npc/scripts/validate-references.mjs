// Read-only audit using the same rules as the app, including imported character files.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const server = await createServer({ root, configFile: false, appType: 'custom', server: { middlewareMode: true, hmr: false, watch: null } });
try {
  const load = (path) => server.ssrLoadModule(`/src/${path}.ts`);
  const { NPC_TEMPLATES } = await load('addins/npc/data/npcTemplates');
  const { getRule } = await load('engine/rules');
  const { setValue } = await load('state/characterMutations');
  const { inspectNpc } = await load('addins/npc/engine/npcCreation');
  const { isKiFaehigkeitUnlocked } = await load('engine/kiBaumGating');
  const { parseCharacterFile } = await load('state/characterFile');
  for (const template of NPC_TEMPLATES) {
    const character = structuredClone(template.character);
    const result = inspectNpc(character);
    assert.deepEqual(result.issues, [], template.id);
    for (const [ref, value] of Object.entries(character.values)) {
      if (getRule(ref)?.art === 'Wert') setValue(character, ref, value);
      if (ref.startsWith('ki_') && value > 0) assert(isKiFaehigkeitUnlocked(result.sheet, ref), ref);
    }
    const file = new URL(`../../../../outputs/goblin-regelkorrektur-2026-09-11/${template.id}.nasus.json`, import.meta.url);
    const imported = parseCharacterFile(readFileSync(file, 'utf8')).character;
    assert.deepEqual(inspectNpc(imported).issues, [], `${template.id}: Export`);
    assert.deepEqual(imported.values, character.values);
    assert.deepEqual(imported.poolAllocations, character.poolAllocations);
    console.log(`${template.id}: ${result.sheet.spSpent}/${result.sheet.spTotal} SP; ${result.sheet.tapSpent}/${result.sheet.tapTotal} TaP; ${result.armor.be} KBE; Eingabeprüfung, Pools, KI und Export OK`);
  }
} finally { await server.close(); }
